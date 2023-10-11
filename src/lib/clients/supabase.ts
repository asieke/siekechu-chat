import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';
import type { Database } from './database';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
	auth: { persistSession: false }
});

export const isRecentMessage = async (message: string) => {
	//find the last time a webhook with this message was sent
	const { data } = await supabase.from('webhooks').select('created_at').eq('body', message).order('created_at', { ascending: false }).limit(1);

	//if there is no match return false
	if (!data || data.length === 0) return false;

	//if there is a match check if it was in the last 5 minutes
	const now = new Date();
	const last = new Date(data[0].created_at);
	const diff = now.getTime() - last.getTime();
	const minutes = Math.floor(diff / 1000 / 60);
	if (minutes < 10) return true;

	return false;
};
