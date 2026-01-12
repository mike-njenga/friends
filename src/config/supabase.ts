import { createClient } from '@supabase/supabase-js'
import config from './env.js'



if (!config.supabase.anonKey || !config.supabase.serviceRoleKey || !config.supabase.url ) {
  throw new Error('Supabase environment variables are missing')
}

export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export const supabaseClient = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {auth:{
    autoRefreshToken: true,
    persistSession: false
  } }
)