// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL and Anon Key from environment variables
// It's crucial to use environment variables for security.
// For Create React App, these should be prefixed with REACT_APP_
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if environment variables are loaded (optional, but good for debugging)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing from environment variables.');
  // You might want to throw an error or handle this more gracefully in a real app
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Add any additional configurations or helper functions here
// For example, if you need to set up authentication listeners globally:
/*
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session);
  // Handle auth state changes, e.g., redirecting users
});
*/