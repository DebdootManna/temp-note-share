"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"
import { supabase } from "./lib/supabaseClient"
import { Button } from "./components/ui/button"
import { Textarea } from "./components/ui/textarea"
import { useToast } from "./components/ui/use-toast"
import { useAuth } from "./contexts/auth-context"
import { NotesList } from "./components/notes-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"

export default function Page() {
  const [content, setContent] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const createNote = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      })
      return
    }

    const id = uuidv4()
    const { error } = await supabase.from("notes").insert({
      id,
      content,
      user_id: user?.id || null,
      expires_at: user ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })

    if (error) {
      console.error("Error creating note:", error)
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      })
    } else {
      setContent("")
      toast({
        title: "Success",
        description: "Note created successfully!",
      })
      router.push(`/note/${id}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="notes" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">My Notes</TabsTrigger>
          <TabsTrigger value="create">Create Note</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{user ? "Your Notes" : "Temporary Notes"}</h2>
          </div>
          <NotesList />
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a {user ? "Permanent" : "Temporary"} Note</CardTitle>
              <CardDescription>
                {user
                  ? "This note will be permanently saved to your account."
                  : "This note will expire in 24 hours. Login to create permanent notes."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your note here..."
              />
              <Button onClick={createNote} className="w-full">
                Create Note
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

