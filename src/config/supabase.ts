import { createClient } from '@supabase/supabase-js'
import myconfig from './env.js'



if (!myconfig.supabase.anonKey || !myconfig.supabase.serviceRoleKey || !myconfig.supabase.url ) {
  throw new Error('Supabase environment variables are missing')
}

export const supabaseAdmin = createClient(
  myconfig.supabase.url,
  myconfig.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export const supabaseClient = createClient(
  myconfig.supabase.url,
  myconfig.supabase.serviceRoleKey,
  {auth:{
    autoRefreshToken: true,
    persistSession: false
  } }
)