export const GET = async () => {
	console.log('running webhook.... hello!');
	return new Response(JSON.stringify({ bones: 'money' }));
};
