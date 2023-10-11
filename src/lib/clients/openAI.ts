/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { ChatCompletionMessage } from 'openai/resources/chat';
import { parseStartEndDates } from '$lib/strings/dates';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY // defaults to process.env["OPENAI_API_KEY"]
});

async function getRawResponse(message: string) {
	const estDateTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
	const currentDateTime = `It is currently: ${estDateTime}`;
	const messages: ChatCompletionMessage[] = [{ role: 'user', content: message }];
	const functions = [
		{
			name: 'reminder',
			description: 'creates a new reminder',
			parameters: {
				type: 'object',
				properties: {
					reminder: {
						type: 'string',
						description: 'reminder text'
					},
					due: {
						type: 'string',
						description: `${currentDateTime} list absolute time when the reminder is due in format YYYY-MM-DD HH:MM:SS.  If none provided, then empty string`
					}
				},
				required: ['reminder']
			}
		},
		{
			name: 'calendar',
			description: 'creates a new calendar event any text with the words: event, calendar, meeting or appointment should return this function',
			parameters: {
				type: 'object',
				properties: {
					calendar: {
						type: 'string',
						enum: ['Alex', 'Family'],
						description: 'Should default to "Family" unless it has the word "Alex" in it'
					},
					title: {
						type: 'string',
						description: 'title of the event'
					},
					description: {
						type: 'string',
						description: 'description of the event; if none provided, then title is used'
					},
					start: {
						type: 'string',
						description: `${currentDateTime} list absolute starting time of the event in format YYYY-MM-DD HH:MM:SS.`
					},
					end: {
						type: 'string',
						description: `Default: 1h after start time.  If explicitly provided, then list absolute ending time of the event in format YYYY-MM-DD HH:MM:SS. (current time: ${currentDateTime})`
					},
					location: {
						type: 'string',
						description: 'location of the event; if none provided, then empty string'
					}
				},
				required: ['title', 'start', 'end', 'location', 'description', 'calendar']
			}
		}
	];

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: messages,
		functions: functions,
		function_call: 'auto' // auto is default, but we'll be explicit
	});

	console.log(response, response.choices[0]);

	if (response.choices[0].finish_reason === 'function_call') {
		const args = JSON.parse(response.choices[0].message.function_call?.arguments as string);
		return {
			action: response.choices[0].message.function_call?.name,
			data: args
		};
	} else {
		const text = response.choices[0].message?.content;

		try {
			const json = JSON.parse(text!);
			if (json.calendar) return { action: 'calendar', data: json };
			if (json.reminder) return { action: 'reminder', data: json };
		} catch (e) {
			return { action: 'text', data: text };
		}
	}
}

export async function textToAction(message: string) {
	console.log('------------------------------------------------------------------');
	console.log('[textToAction] message: ', message);
	console.log('------------------------------------------------------------------');

	try {
		const response = await getRawResponse(message);
		if (!response) return null;

		if (response.action === 'calendar') {
			const { start, end, description, title } = response.data;
			const { start: startStr, end: endStr } = parseStartEndDates(start, end);

			response.data.description = !description || description.length < 5 ? title : description;
			response.data.start = startStr;
			response.data.end = endStr;
			// if title or description contains the words: Jane, Stan, George then set calendar to Family
			if (title?.toLowerCase().includes('jane') || title?.toLowerCase().includes('stan') || title?.toLowerCase().includes('george')) {
				response.data.calendar = 'Family';
			}
		}

		return response;
	} catch (e) {
		console.log(e);
		return null;
	}
}
