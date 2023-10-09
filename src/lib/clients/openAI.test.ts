import { describe, it, expect } from 'vitest';

import { textToAction } from './openAI';

describe('Test OPEN AI Calendar Actions', () => {
	it('Create a valid calendar event', async () => {
		const prompt = 'create an event tomorrow from 8-9am called Breakfast with Julia at Tatte in Boston';
		const response = await textToAction(prompt);
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('calendar');
		const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
		expect(response.data.start).toBe(tomorrow + ' 08:00:00');
		expect(response.data.end).toBe(tomorrow + ' 09:00:00');
		expect(response.data.calendar).toBe('Alex');
	});
	it('Create a Family Calendar event with unspecified end time ', async () => {
		const prompt = 'create an event this Sunday at 11:00 called Jane Lacrosse Practice at Wilton High School';
		const response = await textToAction(prompt);
		const nextSunday = new Date(new Date().setDate(new Date().getDate() + (7 - new Date().getDay()))).toISOString().split('T')[0];
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('calendar');
		expect(response.data.calendar).toBe('Family');
		expect(response.data.start).toBe(nextSunday + ' 11:00:00');
		expect(response.data.end).toBe(nextSunday + ' 12:00:00');
		console.log(response);
	});
	it('Create a calendar event without a location ', async () => {
		const prompt = 'create an event this Thursday at 1pm called Lunch with Stan';
		const response = await textToAction(prompt);
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('calendar');
		expect(response.data.location).toBe('');
	});
});

describe('Test OPEN AI Reminder Actions', () => {
	it('Create a valid reminder', async () => {
		const prompt = 'remind me to take out the trash';
		const response = await textToAction(prompt);
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('reminder');
		expect(response.data.reminder).toBe('take out the trash');
	});
});
