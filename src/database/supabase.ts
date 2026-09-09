import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wuveugddohtuleysuzrr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'TU_LLAVE_ANON_PUBLICA_COMPLETA_AQUI'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);