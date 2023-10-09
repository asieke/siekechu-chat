import { supabase } from '$clients/supabase';

export const logMessage = async (message: { from: string; to: string; message: string }) => {
	try {
		const { data, error } = await supabase.from('messages').insert(message);
		if (error) {
			throw error;
		}
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
