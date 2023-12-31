import { SINCH_KEY } from '$env/static/private';
import { logMessage } from '$lib/functions/logging';
import axios from 'axios';

export const sendSMS = async (message: string) => {
	const params = {
		from: '12066498203',
		to: ['17032443494'],
		body: message
	};

	try {
		const response = await axios.post('https://sms.api.sinch.com/xms/v1/3f7fa1e89e784727b104fd134995b7ae/batches', params, {
			headers: {
				Authorization: 'Bearer ' + SINCH_KEY,
				'Content-Type': 'application/json'
			}
		});

		if (response.status === 200) {
			await logMessage({ from: params.from, to: params.to[0], message: params.body });
			return response.data;
		} else {
			console.log('Error: ', response.statusText);
			return null;
		}
	} catch (error) {
		console.log('Error: ', error);
		return null;
	}
};
