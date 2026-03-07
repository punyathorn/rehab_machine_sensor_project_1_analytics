import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zckdujksdcmlulyypinx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpja2R1amtzZGNtbHVseXlwaW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTExMzEsImV4cCI6MjA4ODM2NzEzMX0.z3BCtcGMck_XzH1cNsjq9_wMvmVSB61-XyPa5aYO5OQ";

export const supabase = createClient(supabaseUrl, supabaseKey);