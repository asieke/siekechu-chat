import { SINCH_KEY } from '$env/static/private';
import { logMessage } from '$lib/functions/logMessage';

import axios from 'axios';

export const sendSMS = async (message: string) => {
	const params = {
		from: '12066498203',
		to: ['17032443494'],
		body: message
	};

	const config = {
		headers: {
			Authorization: 'Bearer ' + SINCH_KEY,
			'Content-Type': 'application/json'
		}
	};

	try {
		const { data } = await axios.post('https://sms.api.sinch.com/xms/v1/3f7fa1e89e784727b104fd134995b7ae/batches', params, config);

		await logMessage({ from: params.from, to: params.to[0], message: params.body });
		return data;
	} catch (error) {
		console.log('Error: ', error);
		return null;
	}
};
