import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ildgjnmfhjmzeimzaqfx.supabase.co'
const supabaseKey = import.meta.env.VITE_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
