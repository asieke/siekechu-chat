import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

//functions
import { logToGoogleSheet } from '$lib/functions/logToGoogleSheet';

export const POST = async ({ request }: { request: Request }) => {
	const { INCOMING_WEBHOOK_KEY } = process.env;

	try {
		// Retrieve API key from query parameters
		const url = new URL(request.url);
		const apiKey = url.searchParams.get('key');

		// Validate API key
		if (apiKey !== INCOMING_WEBHOOK_KEY) {
			return new Response('Unauthorized', { status: 401 });
		}

		//get the webhook payload
		const payload = await request.json();

		//log the payload
		console.log('payload', payload);
		console.log('running webhook.... hello!');

		//log to google sheet
		await logToGoogleSheet(payload);

		return new Response(JSON.stringify({ bones: 'money' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.log('Error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

/** THIS IS THE PAYLOAD

payload {
  body: 'Hello there!',
  from: '17032443494',
  id: '01HBVQ3K8883ZCAFE2BR5RNQRF',
  operator_id: '310150',
  received_at: '2023-10-03T21:29:05.032Z',
  to: '12066498203',
  type: 'mo_text'
}

*/
