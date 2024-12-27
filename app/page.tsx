'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabaseClient'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { useToast } from './components/ui/use-toast'
import { useAuth } from './contexts/auth-context'

export default function Page() {
  const [content, setContent] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const createNote = async () => {
    const id = uuidv4()
    const { error } = await supabase
      .from('notes')
      .insert({ 
        id, 
        content, 
        user_id: user?.id || null,
        expires_at: user ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      })

    if (error) {
      console.error('Error creating note:', error)
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      })
    } else {
      router.push(`/note/${id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Create a {user ? 'Permanent' : 'Temporary'} Note</h1>
      <Textarea
        className="min-h-[200px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your note here..."
      />
      <Button
        onClick={createNote}
        className="w-full"
      >
        Create Note
      </Button>
    </div>
  )
}

