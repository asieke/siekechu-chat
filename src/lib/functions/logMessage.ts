import { supabase } from '$clients/supabase';

export const logMessage = async (message: { from: string; to: string; message: string }) => {
	try {
		const { data, error } = await supabase.from('messages').insert(message);
		if (error) {
			console.log('Error: ', error);
			return null;
		}
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
	}
};
