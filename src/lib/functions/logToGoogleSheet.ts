import dotenv from 'dotenv';
dotenv.config();
import type { Payload } from '$lib/types';
import axios from 'axios';

const { GOOGLE_SHEET_KEY, GOOGLE_URL } = process.env;
const action = 'logTextMessage';
const URL = `${GOOGLE_URL}?key=${GOOGLE_SHEET_KEY}&action=${action}`;

export const logToGoogleSheet = async (payload: Payload) => {
	const { data } = await axios.post(URL, payload);

	return data;
};
