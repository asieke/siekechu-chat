import { INCOMING_WEBHOOK_KEY } from '$env/static/private';

export const POST = async ({ request, query }: { request: Request; query: URLSearchParams }) => {
	try {
		// Retrieve API key from query parameters
		const apiKey = query.get('key');

		// Validate API key
		if (apiKey !== INCOMING_WEBHOOK_KEY) {
			return new Response('Unauthorized', { status: 401 });
		}

		const payload = await request.json();

		console.log('payload', payload);
		console.log('running webhook.... hello!');

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
