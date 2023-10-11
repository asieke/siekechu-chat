import { INCOMING_WEBHOOK_KEY } from '$env/static/private';
import { isRecentMessage } from '$lib/clients/supabase';
import type { Payload } from '$lib/types';

//functions
import { logMessage, logWebhook } from '$lib/functions/logging';
import { routeMessage } from '$lib/functions/routeMessage';

export const POST = async ({ request }: { request: Request }) => {
	console.log('Incoming webhook request', new Date().toLocaleTimeString());
	try {
		// Retrieve API key from query parameters
		const url = new URL(request.url);
		const apiKey = url.searchParams.get('key');

		// Validate API key
		if (apiKey !== INCOMING_WEBHOOK_KEY) {
			return new Response('Unauthorized', { status: 401 });
		}

		//get the webhook payload and log it to supabase
		const payload = (await request.json()) as Payload;

		//if the message has not been processed
		if ((await isRecentMessage(payload.body)) === false) {
			await routeMessage(payload.body);
		}

		//log the messages
		await logMessage({ from: payload.from, to: payload.to, message: payload.body });
		await logWebhook(payload);

		console.log('Completed webhook', new Date().toLocaleTimeString());
		return new Response('Success', { status: 200 });
	} catch (error) {
		console.log('Error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
