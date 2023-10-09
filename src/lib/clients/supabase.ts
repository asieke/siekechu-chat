import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SERVICE_ROLE_KEY } from '$env/static/public';
import type { Database } from './database';

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SERVICE_ROLE_KEY, {
	auth: { persistSession: false }
});
