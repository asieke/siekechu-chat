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
		//create a new object but rename the id field to sinch_id, make sure id is removed
		const { id, ...remainder } = payload;
		const { data, error } = await supabase.from('webhooks').insert({ ...remainder, sinch_id: id });
		if (error) {
			throw error;
		}
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};
