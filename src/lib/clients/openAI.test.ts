import { describe, it, expect } from 'vitest';
import { textToAction } from './openAI';

describe('Test OPEN AI Calendar Actions', () => {
	it('Create a valid calendar event', async () => {
		const prompt = "create an event tomorrow on Alex's Calendar from 8-9am called Breakfast with Julia at Tatte in Boston";
		const response = await textToAction(prompt);
		console.log(response);
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
		console.log(response);
		const nextSunday = new Date(new Date().setDate(new Date().getDate() + (7 - new Date().getDay()))).toISOString().split('T')[0];
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('calendar');
		expect(response.data.calendar).toBe('Family');
		expect(response.data.start).toBe(nextSunday + ' 11:00:00');
		expect(response.data.end).toBe(nextSunday + ' 12:00:00');
	});
	it('Create a calendar event without a location ', async () => {
		const prompt = 'create an event this Thursday at 1pm called Lunch with Stan';
		const response = await textToAction(prompt);
		console.log(response);
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('calendar');
		expect(response.data.location).toBe('');
	});
	it('Create a calendar event with a vague description', async () => {
		const prompt = 'coffee tomorrow at 10am';
		const response = await textToAction(prompt);
		console.log(response);
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('calendar');
		expect(response.data.location).toBe('');
	});
	it('Create a calendar event with a title and a description ', async () => {
		const prompt =
			'create an event this Friday called Hockey Practice.  It is at 4pm at the Winter Club.  Description: Practice for the upcoming tournament';
		const response = await textToAction(prompt);
		console.log(response);
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('calendar');
		expect(response.data.description).toBe('Practice for the upcoming tournament');
		expect(response.data.title).toBe('Hockey Practice');
		expect(response.data.location).toBe('Winter Club');
	});
});

describe('Test OPEN AI Reminder Actions', () => {
	it('Create a valid reminder', async () => {
		const prompt = 'remind me to take out the trash';
		const response = await textToAction(prompt);
		console.log(response);
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('reminder');
		expect(response.data.reminder.toLowerCase()).toBe('take out the trash');
		expect(response.data.due).toBeUndefined();
	});
	it('Create a valid reminder with a due date', async () => {
		const prompt = 'remind me to take out the trash by tomorrow night at 10pm';
		const response = await textToAction(prompt);
		if (!response) throw new Error('Response is null');
		expect(response.action).toBe('reminder');
		expect(response.data.reminder.toLowerCase()).toBe('take out the trash');
		const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
		expect(response.data.due).toBe(tomorrow + ' 22:00:00');
	});
});
