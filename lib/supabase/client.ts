import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

// Create a singleton instance for the browser client
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export const getSupabaseBrowserClient = () => {
  // Only create one instance per browser session
  if (typeof window !== "undefined" && !clientInstance) {
    clientInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return (
    clientInstance ||
    createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  )
}

// Export the client directly for convenience
export const supabase = getSupabaseBrowserClient()
