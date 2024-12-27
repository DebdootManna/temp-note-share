import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabaseClient'

export async function GET() {
  const { error } = await supabase
    .from('notes')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .is('user_id', null) // Only delete notes without a user_id

  if (error) {
    console.error('Error cleaning up expired notes:', error)
    return NextResponse.json({ error: 'Failed to clean up expired notes' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Expired notes cleaned up successfully' })
}

