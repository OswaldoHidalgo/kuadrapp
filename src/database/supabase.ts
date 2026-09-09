import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wuveugddohtuleysuzrr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'PeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dmV1Z2Rkb2h0dWxleXN1enJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MDIxNjMsImV4cCI6MjEwNDQ3ODE2M30.8WS9x-0do-SJ6wWZF4MWG8082iO8HeqKRiReDm3cMSY'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);