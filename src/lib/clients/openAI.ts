import OpenAI from 'openai';
import { OPENAI_KEY } from '$lib/env';

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
Example text: create a calendar event on Alexs calendar for 2pm tomorrow called 'meeting with Dave' at the ZHPP in Wilton that lasts 1 hour
Example JSON: {
  calendar: ('Alex' | 'Family') // can only be Alex OR Family.  If it contains the words Jane, Stan, George then it is Family, otherwise it is Alex
  start: (string) // converted to absolute time e.g. 2023-10-10 14:00:00
  end: (string) // converted to absolute time e.g. 2023-10-10 15:00:00 (if not provided, use the start time + 1 hour)
  title: (string) // e.g. meeting with Dave
  location: (string) // e.g. ZHPP Wilton if none provided return an empty string ''
  description: (string) // if not provided, use the title
}

2. Create a Reminder
Example text: remind me to take out the trash
Example JSON: { "reminder": "take out the trash" }

Based on the above options - please return a JSON object:
{
  action: ('calendar' | 'reminder') // whether the user wants to create a calendar event or a reminder
  data: (object) // the JSON object described above
}

3. Response to a basic question:
Example text: what is the
`;

const actions = ['calendar', 'reminder'];

type JSON = {
	action: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
};

function validateObject(object: JSON) {
	//if the object doesn't exist
	if (typeof object !== 'object' || !object || !object.data || !object.action) {
		return null;
	}

	if (!actions.includes(object.action)) {
		return null;
	}

	if (object.action === 'calendar') {
		if (!(object.data.calendar && object.data.start && object.data.end && object.data.title)) {
			return null;
		}
	}

	return object;
}

async function getJSONFromAI(prompt: string) {
	try {
		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{ role: 'system', content: context },
				{ role: 'user', content: prompt }
			],
			model: 'gpt-3.5-turbo'
		});

		const object = JSON.parse(chatCompletion.choices[0].message.content!);
		return validateObject(object);
	} catch (e) {
		return null;
	}
}

//write a function that takes a prompt, tries to get a response up to 3 times, and returns the response

export async function textToAction(text: string) {
	let response = null;
	for (let i = 0; i < 3; i++) {
		response = await getJSONFromAI(text);
		if (response) {
			break;
		}
	}
	return response;
}
