export const POST = async ({ request }: { request: Request }) => {
	try {
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
