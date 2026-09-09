import { createClient } from '@supabase/supabase-js';

// Tus credenciales configuradas de Supabase
const SUPABASE_URL = 'https://wuveugddohtuleysuzrr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_dUYG8MvpaQPZ0HyxAuD_6g_PPHHA...'; // Asegúrate de tener tu clave completa aquí

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);