import axios from 'axios';
import { GOOGLE_SHEET_KEY } from '$env/static/private';
import { GOOGLE_URL } from '$lib/env';
import { textToAction } from '$clients/openAI';
import { sendSMS } from '$lib/functions/sendSMS';
import { getColloquialDate } from '$lib/strings/dates';

export async function routeMessage(message: string) {
	console.log('------------------------------------------------------------------');
	console.log('[routeMessage]: ', message);
	console.log('------------------------------------------------------------------');

	const res = await textToAction(message);
	if (!res || !res.action || !res.data) {
		await sendSMS('No Action Taken, please try again');
		return;
	}

	try {
		let url;

		if (res.action === 'calendar') {
			url = `${GOOGLE_URL}?key=${GOOGLE_SHEET_KEY}&action=addToCalendar`;
			await axios.post(url, res.data);
			await sendSMS(`${res.data.title} added to calendar: ${getColloquialDate(res.data.start)}`);
		} else if (res.action === 'reminder') {
			url = `${GOOGLE_URL}?key=${GOOGLE_SHEET_KEY}&action=addReminder`;
			await axios.post(url, res.data);
			await sendSMS(`Reminder added: ${res.data.reminder}`);
		} else {
			await sendSMS('Could not parse message, please try again');
		}
	} catch (e) {
		await sendSMS('No action taken, please try again');
		return;
	}
}
