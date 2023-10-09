import { INCOMING_WEBHOOK_KEY } from '$lib/env';

import type { Payload } from '$lib/types';

//functions
import { sendSMS } from '$lib/functions/sendSMS';
import { logMessage } from '$lib/functions/logMessage';

export const POST = async ({ request }: { request: Request }) => {
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
		await logMessage({ from: payload.from, to: payload.to, message: payload.body });

		//log the payload
		console.log('payload', payload);
		console.log('running webhook.... hello!');

		//send the user back thanks
		await sendSMS('Thanks for your message!');

		return new Response(JSON.stringify({ bones: 'money' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.log('Error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
