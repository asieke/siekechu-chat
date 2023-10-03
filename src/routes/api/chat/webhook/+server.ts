export const GET = async ({ request }: { request: Request }) => {
	const payload = await request.json();

	console.log('payload', payload);
	console.log('running webhook.... hello!');

	return new Response(JSON.stringify({ bones: 'money' }));
};
