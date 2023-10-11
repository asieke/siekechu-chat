import { supabase } from '$clients/supabase';
import type { Payload } from '$lib/types';

export const logMessage = async (message: { from: string; to: string; message: string }) => {
	try {
		const { data, error } = await supabase.from('messages').insert(message);
		if (error) {
			throw error;
		}
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const logWebhook = async (payload: Payload) => {
	try {
		const { data: lastMessage } = await supabase
			.from('webhooks')
			.select('created_at')
			.eq('body', payload.body)
			.order('created_at', { ascending: false })
			.limit(1);

		if (lastMessage && lastMessage.length > 0) {
			const now = new Date();
			const last = new Date(lastMessage[0].created_at);
			const diff = now.getTime() - last.getTime();
			const minutes = Math.floor(diff / 1000 / 60);
			if (minutes < 10) return false;
		}

		//create a new object but rename the id field to sinch_id, make sure id is removed
		const { id, ...remainder } = payload;
		const { error } = await supabase.from('webhooks').insert({ ...remainder, sinch_id: id });
		if (error) {
			throw error;
		}
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
