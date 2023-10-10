/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';
import { OPENAI_KEY } from '$lib/env';
import type { ChatCompletionCreateParams, ChatCompletionMessage } from 'openai/resources/chat';

const openai = new OpenAI({
	apiKey: OPENAI_KEY // defaults to process.env["OPENAI_API_KEY"]
});

const context = `
You are a digital assistant that returns ONLY valid JSON.  Do not return anything other than valid JSON.
You will be provided with a string of text and several possible JSON formats.
Your job is the turn the string of text into the correct JSON format.
If the user gives a relative time e.g. "this friday at 2pm" use the current date and time to figure out the absolute date/time.
The returned JSON MUST have all of the fields specified in the example JSON.

The current date is ${new Date().toLocaleDateString()}.
The current time is ${new Date().toLocaleTimeString()}.

1. Calendar Event
Returned JSON for calendar event MUST have the following fields: calendar, start, end, title, location, description
Example text: create a calendar event on Alexs calendar for 2pm tomorrow called 'meeting with Dave' at the ZHPP in Wilton that lasts 1 hour
Example JSON: {
  calendar: ('Alex' | 'Family') // can only be Alex OR Family.  If it contains the words Jane, Stan, George then it is Family, otherwise it is Alex
  start: (string) // converted to absolute time in the format: 2023-10-10 14:00:00
  end: (string) // converted to absolute time in the format: 2023-10-10 15:00:00 (if not provided, use the start time + 1 hour)
  title: (string) // e.g. meeting with Dave
  location: (string) // e.g. ZHPP Wilton if none provided return an empty string ''
  description: (string) // if not provided, use the title
}

2. Create a Reminder
Returned JSON for reminder MUST have the following fields: reminder, due
Example text: remind me to complete school registration by this Friday at 11:59pm
Example JSON: {
	reminder: (string) "complete school registration" //free text of the reminder
	due: (string) "2013-10-13 23:59:00" // if no due date is specified return an empty string '', a string that represents the absolute time when the reminder is due e.g. 2023-10-10 14:00:00
}

Based on the above options - please return a JSON object:
{
  action: ('calendar' | 'reminder') // whether the user wants to create a calendar event or a reminder
  data: (object) // the JSON object described above
}
`;

function validateObject(object: any) {
	const actions = ['calendar', 'reminder'];

	//if the object doesn't exist
	if (typeof object !== 'object' || !object || !object.data || !object.action) {
		return {
			error: true,
			assistant: JSON.stringify(object),
			message: 'Please ensure that the response is a valid JSON object.  Only return JSON'
		};
	}

	if (!actions.includes(object.action)) {
		return {
			error: true,
			assistant: JSON.stringify(object),
			message: 'Please ensure that the JSON object contains an action field that is either: ' + actions.join(' or ')
		};
	}

	if (object.action === 'calendar') {
		if (!(object.data.calendar && object.data.start && object.data.end && object.data.title)) {
			return {
				error: true,
				assistant: JSON.stringify(object),
				message: 'Please ensure that the JSON object contains a data object the following fields: calendar, start, end, title, location, description'
			};
		}
	}

	if (object.action === 'reminder') {
		if (!(object.data.reminder && object.data.due !== undefined)) {
			return {
				error: true,
				assistant: JSON.stringify(object),
				message: 'Please ensure that the JSON object contains a data object the following fields: reminder, due'
			};
		}
	}

	return object;
}

async function getJSONFromAI(prompt: string) {
	try {
		//initialize the chat messages
		const messages: ChatCompletionMessage[] = [
			{ role: 'system', content: context },
			{ role: 'user', content: prompt }
		];

		for (let i = 0; i < 5; i++) {
			const chatCompletion = await openai.chat.completions.create({
				messages: messages,
				model: 'gpt-4'
			});

			const object = validateObject(JSON.parse(chatCompletion.choices[0].message.content!));
			console.log('ATTEMPT ' + (i + 1) + ': ' + JSON.stringify(object));

			if (!object) return null;
			if (!object.error) return object;

			messages.push({ role: 'assistant', content: object.assistant });
			messages.push({ role: 'user', content: object.message });
		}
	} catch (e) {
		return null;
	}
}

//write a function that takes a prompt, tries to get a response up to 3 times, and returns the response

export async function textToAction(text: string) {
	console.log('-------------------\n' + text + '\n-------------------');
	let response = null;
	for (let i = 0; i < 2; i++) {
		response = await getJSONFromAI(text);
		if (response) {
			break;
		}
	}
	return response;
}
