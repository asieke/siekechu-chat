import { GOOGLE_SHEET_KEY } from '$env/static/private';
import { GOOGLE_URL } from '$lib/env';
import axios from 'axios';
import { textToAction } from '$clients/openAI';
import { sendSMS } from '$lib/functions/sendSMS';
import { getColloquialDate } from '$lib/strings/dates';

export async function routeMessage(message: string) {
	const res = await textToAction(message);
	if (!res || !res.action || !res.data) {
		await sendSMS('No Action Taken, please try again');
		return;
	}

	try {
		if (res.action === 'calendar') {
			const url = `${GOOGLE_URL}?key=${GOOGLE_SHEET_KEY}&action=addToCalendar`;
			await axios.post(url, res.data);
			await sendSMS(res.data.title + ' added to calendar: ' + getColloquialDate(res.data.start));
		}
		if (res.action === 'reminder') {
			const url = `${GOOGLE_URL}?key=${GOOGLE_SHEET_KEY}&action=addReminder`;
			await axios.post(url, res.data);
			await sendSMS('reminder added: ' + res.data.reminder);
		}
	} catch (e) {
		await sendSMS('No action taken, please try again');
		return;
	}
}
