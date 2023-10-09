import { INCOMING_WEBHOOK_KEY } from '$env/static/private';

import { expect, test } from '@playwright/test';

const postData = {
	body: 'Hello there! (test from localhost)',
	from: '17032443494',
	id: '01HBVQ3K8883ZCAFE2BR5RNQRF',
	operator_id: '310150',
	received_at: '2023-10-03T21:29:05.032Z',
	to: '12066498203',
	type: 'mo_text'
};

const requestOptions = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(postData)
};

//test to make sure the api/chat/webhook route returns a JSON object that matches {bones: 'money'}
test('api/chat/webhook returns JSON object', async () => {
	const response = await fetch(
		`http://localhost:5173/api/chat/webhook?key=${INCOMING_WEBHOOK_KEY}`,
		requestOptions
	);
	const json = await response.json();

	expect(json).toEqual({ bones: 'money' });
});

//test when the incoming webhook key is wrong, it should return return new Response('Unauthorized', { status: 401 });
test('api/chat/webhook returns 401 when key is wrong', async () => {
	const response = await fetch(
		`http://localhost:5173/api/chat/webhook?key=wrongkey`,
		requestOptions
	);

	expect(response.status).toEqual(401);
});
