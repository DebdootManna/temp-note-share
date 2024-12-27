'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../contexts/auth-context'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { LoginDialog } from '../../../components/auth/login-dialog'
import { useToast } from '../../../components/ui/use-toast'

export default function NotePage() {
  const [content, setContent] = useState('')
  const [isPermanent, setIsPermanent] = useState(false)
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('content, user_id')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching note:', error)
        toast({
          title: "Error",
          description: "Failed to fetch note. Please try again.",
          variant: "destructive",
        })
      } else if (data) {
        setContent(data.content)
        setIsPermanent(!!data.user_id)
      }
    }

    fetchNote()

    const channel = supabase
      .channel(`note_${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notes', filter: `id=eq.${id}` }, (payload) => {
        setContent(payload.new.content)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, toast])

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
      .update({ user_id: user.id })
      .eq('id', id)

    if (error) {
      console.error('Error making note permanent:', error)
      toast({
        title: "Error",
        description: "Failed to save note permanently",
        variant: "destructive"
      })
    } else {
      setIsPermanent(true)
      toast({
        title: "Success",
        description: "Note saved permanently",
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Note</h1>
        <div className="flex gap-2">
          {!isPermanent && (
            user ? (
              <Button onClick={makePermanent}>
                Save Permanently
              </Button>
            ) : (
              <LoginDialog />
            )
          )}
        </div>
      </div>
      <Textarea
        className="min-h-[200px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={updateNote}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Share this URL to allow others to view and edit this note:</p>
        <code className="px-2 py-1 bg-muted rounded text-sm">{`${window.location.origin}/note/${id}`}</code>
      </div>
      {isPermanent && (
        <p className="text-sm text-muted-foreground">
          This note is permanently saved to your account
        </p>
      )}
    </div>
  )
}

