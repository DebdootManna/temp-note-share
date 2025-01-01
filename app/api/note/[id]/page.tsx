'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../contexts/auth-context'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { LoginDialog } from '../../../components/auth/login-dialog'
import { useToast } from '../../../components/ui/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { ArrowLeft, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Note {
  content: string
  user_id: string | null
  expires_at: string | null
}

export default function NotePage() {
  const [note, setNote] = useState<Note | null>(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('content, user_id, expires_at')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching note:', error)
        toast({
          title: "Error",
          description: "Failed to fetch note. It may have been deleted or expired.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (data) {
        setNote(data)
        setContent(data.content)
      }
      setIsLoading(false)
    }

    fetchNote()

    // Set up real-time subscription
    const channel = supabase
      .channel(`note_${id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notes',
        filter: `id=eq.${id}` 
      }, (payload: any) => {
        if (payload.eventType === 'DELETE') {
          router.push('/')
          return
        }
        setNote(payload.new)
        setContent(payload.new.content)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, router, toast])

  const updateNote = async () => {
    const { error } = await supabase
      .from('notes')
      .update({ content })
      .eq('id', id)

    if (error) {
      console.error('Error updating note:', error)
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Note updated successfully!",
      })
    }
  }

  const makePermanent = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save notes permanently",
        variant: "destructive"
      })
      return
    }

    const { error } = await supabase
      .from('notes')
      .update({ 
        user_id: user.id,
        expires_at: null 
      })
      .eq('id', id)

    if (error) {
      console.error('Error making note permanent:', error)
      toast({
        title: "Error",
        description: "Failed to save note permanently",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Success",
        description: "Note saved permanently",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-muted rounded"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Note not found</CardTitle>
            <CardDescription>
              This note may have been deleted or expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const getExpiryText = (expiresAt: string | null) => {
    if (!expiresAt) return 'Permanent note'
    const expiryDate = new Date(expiresAt)
    if (expiryDate < new Date()) return 'Expired'
    return `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={() => router.push('/')} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <CardTitle>Edit Note</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {getExpiryText(note.expires_at)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={updateNote}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          {!note.user_id && (
            user ? (
              <Button onClick={makePermanent}>
                Save Permanently
              </Button>
            ) : (
              <LoginDialog />
            )
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

