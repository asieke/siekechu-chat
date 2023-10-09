import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '$lib/env';
import type { Database } from './database';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
	auth: { persistSession: false }
});
