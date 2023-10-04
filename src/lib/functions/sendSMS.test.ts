//write a test that calls the sendSMS('hello') and checks that the response res.data.body === 'hello'

import { sendSMS } from './sendSMS';
import { it, expect } from 'vitest';

it('When sendSMS is called you get back a successful response', async () => {
	const data = await sendSMS('hello');
	expect(data.body).toBe('hello');
});
