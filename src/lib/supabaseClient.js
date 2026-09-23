import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://jnywotypxhmpryinbvuv.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueXdvdHlweGhtcHJ5aW5idnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTU4MzUsImV4cCI6MjEwNTU3MTgzNX0.qCd1lzGHtfcRS6_FhQdtdPwX9ubFMDJPsYB3Rt5JO1Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
