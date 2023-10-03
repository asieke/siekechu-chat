import { expect, test } from '@playwright/test';

//test to make sure the api/chat/webhook route returns a JSON object that matches {bones: 'money'}

test('api/chat/webhook returns JSON object', async ({ page }) => {
	const response = await page.goto('/api/chat/webhook');
	const json = await response?.json();
	expect(json).toEqual({ bones: 'money' });
});
