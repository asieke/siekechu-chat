import { GOOGLE_SHEET_KEY } from '$env/static/private';
import { GOOGLE_URL } from '$lib/env';
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
		let url;
		let response;

		if (res.action === 'calendar') {
			url = `${GOOGLE_URL}?key=${GOOGLE_SHEET_KEY}&action=addToCalendar`;
			response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(res.data)
			});

			if (response.ok) {
				await sendSMS(res.data.title + ' added to calendar: ' + getColloquialDate(res.data.start));
			}
		}

		if (res.action === 'reminder') {
			url = `${GOOGLE_URL}?key=${GOOGLE_SHEET_KEY}&action=addReminder`;
			response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(res.data)
			});

			if (response.ok) {
				await sendSMS('reminder added: ' + res.data.reminder);
			}
		}

		if (!response || !response.ok) {
			await sendSMS('No action taken, please try again');
		}
	} catch (e) {
		await sendSMS('No action taken, please try again');
		return;
	}
}

routeMessage('remind me to take out the trash tomorrow at 8pm');
