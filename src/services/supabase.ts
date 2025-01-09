import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface SavedTweet {
  id: number
  content: string
  created_at: string
}

export const saveTweet = async (content: string): Promise<SavedTweet | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_tweets')
      .insert([{ content }])
      .select()
      .single()

    if (error) {
      console.error('Error saving tweet:', error.message)
      console.error('Error details:', error)
      return null
    }

    return data
  } catch (e) {
    console.error('Exception while saving tweet:', e)
    return null
  }
}

export const getSavedTweets = async (): Promise<SavedTweet[]> => {
  const { data, error } = await supabase
    .from('saved_tweets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved tweets:', error)
    return []
  }

  return data || []
}

export const deleteSavedTweet = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('saved_tweets')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting tweet:', error)
    return false
  }

  return true
} 