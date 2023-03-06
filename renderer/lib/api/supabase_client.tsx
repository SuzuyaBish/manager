import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://dbubwmtcqmkbqatvrohe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRidWJ3bXRjcW1rYnFhdHZyb2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgwNDQyNTcsImV4cCI6MTk5MzYyMDI1N30._SksSwk5UgeZoZdfcLi4jOjEVCcIdSPlLswdbZ1dBLs"
);

export default supabase;
