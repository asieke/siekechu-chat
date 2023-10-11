import { SINCH_KEY } from '$env/static/private';
import { logMessage } from '$lib/functions/logging';

export const sendSMS = async (message: string) => {
	const params = {
		from: '12066498203',
		to: ['17032443494'],
		body: message
	};

	try {
		const response = await fetch('https://sms.api.sinch.com/xms/v1/3f7fa1e89e784727b104fd134995b7ae/batches', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + SINCH_KEY,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		});

		if (response.ok) {
			const data = await response.json();
			await logMessage({ from: params.from, to: params.to[0], message: params.body });
			return data;
		} else {
			console.log('Error: ', await response.text());
			return null;
		}
	} catch (error) {
		console.log('Error: ', error);
		return null;
	}
};
