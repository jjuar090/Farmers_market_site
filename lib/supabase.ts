import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://wtpftepixdkeenxjwlfv.supabase.co/'
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cGZ0ZXBpeGRrZWVueGp3bGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTU1ODksImV4cCI6MjA2NzY5MTU4OX0.mpqgV_HMxf_Yalk2BN9JECe_Hk91IggzjT3M1NVjyuk'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

