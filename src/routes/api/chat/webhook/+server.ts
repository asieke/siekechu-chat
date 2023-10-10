import { INCOMING_WEBHOOK_KEY } from '$lib/env';

import type { Payload } from '$lib/types';

//functions
import { logMessage } from '$lib/functions/logMessage';
import { routeMessage } from '$lib/functions/routeMessage';

export const config = {
	runtime: 'edge'
};

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

		//route the message to the appropriate function
		await routeMessage(payload.body);

		return new Response(JSON.stringify({ bones: 'money' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.log('Error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
