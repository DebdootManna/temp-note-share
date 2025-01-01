'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/auth-context'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Clock, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Note {
  id: string
  content: string
  created_at: string
  expires_at: string | null
  user_id: string | null
}

export function NotesList() {
  const [notes, setNotes] = useState<Note[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchNotes = async () => {
      const query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      // If user is logged in, fetch their permanent notes and temporary notes
      // If not logged in, only fetch temporary notes that haven't expired
      if (user) {
        query.or(`user_id.eq.${user.id},and(user_id.is.null,expires_at.gt.${new Date().toISOString()})`)
      } else {
        query.is('user_id', null).gt('expires_at', new Date().toISOString())
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching notes:', error)
      } else {
        setNotes(data || [])
      }
    }

    fetchNotes()

    // Set up real-time subscription
    const channel = supabase
      .channel('notes_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
        fetchNotes()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting note:', error)
    }
  }

  const getExpiryText = (expiresAt: string | null) => {
    if (!expiresAt) return 'Permanent note'
    const expiryDate = new Date(expiresAt)
    if (expiryDate < new Date()) return 'Expired'
    return `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card key={note.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Note
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteNote(note.id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {getExpiryText(note.expires_at)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="line-clamp-3">{note.content}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/note/${note.id}`)}
            >
              View & Edit
            </Button>
          </CardFooter>
        </Card>
      ))}
      {notes.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No notes found. Create your first note!</p>
        </div>
      )}
    </div>
  )
}

