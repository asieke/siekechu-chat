import dotenv from 'dotenv';
dotenv.config();
const { SINCH_KEY } = process.env;

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
		const { data } = await axios.post(
			'https://sms.api.sinch.com/xms/v1/3f7fa1e89e784727b104fd134995b7ae/batches',
			params,
			config
		);
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
