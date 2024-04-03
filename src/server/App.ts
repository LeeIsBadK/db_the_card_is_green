import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_PROJECT_URL || ""
const supabaseKey = import.meta.env.VITE_SVDX|| ""
console.log(supabaseUrl)
console.log(supabaseKey)
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;
