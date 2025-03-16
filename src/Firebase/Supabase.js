
// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and public anon key
const supabaseUrl = 'https://pfczymmhgubmkalctpqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmY3p5bW1oZ3VibWthbGN0cHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNjQ3MTYsImV4cCI6MjA1Nzc0MDcxNn0.HwrppSLcPed9FYmPeqjWnBv97mGJvppXaROxQt3eteU';

export const supabase = createClient(supabaseUrl, supabaseKey);