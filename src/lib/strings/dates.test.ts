import { describe, it, expect } from 'vitest';
import { getColloquialDate, parseStartEndDates } from './dates';

describe('Test Colloquial Dates', () => {
	it('Get today', () => {
		const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });
		const date = getColloquialDate(today + ' 14:00:00');
		expect(date).toBe('today at 2:00 PM');
	});
	it('Get tomorrow!', () => {
		//get a date 24h from now
		const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { timeZone: 'America/New_York' });
		const date = getColloquialDate(tomorrow + ' 14:00:00');
		expect(date).toBe('tomorrow at 2:00 PM');
	});
	it('Get yesterday', () => {
		//get a date 24h from now
		const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { timeZone: 'America/New_York' });
		const date = getColloquialDate(yesterday + ' 14:00:00');
		expect(date).toBe('yesterday at 2:00 PM');
	});
	it('Get day of week', () => {
		const threeDaysOut = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { timeZone: 'America/New_York' });
		const weekday = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
			timeZone: 'America/New_York',
			weekday: 'long'
		});
		const date = getColloquialDate(threeDaysOut + ' 14:00:00');
		expect(date).toBe(weekday + ' at 2:00 PM');
	});
	it('Get >6 days away', () => {
		const tenDaysOut = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { timeZone: 'America/New_York' });
		const expectedDate = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
			timeZone: 'America/New_York',
			month: 'long',
			day: 'numeric'
		});
		const date = getColloquialDate(tenDaysOut + ' 14:00:00');
		expect(date).toBe(expectedDate + ' at 2:00 PM');
	});
});

describe('Test Start/End Date Parsing', () => {
	it('1. It should parse start and end dates into the correct format', () => {
		const input = { start: '2021-09-12 14:00:00', end: '2021-09-12 15:00:00' };
		const output = { start: '2021-09-12 14:00:00', end: '2021-09-12 15:00:00' };
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});
	it('2. It should parse of different formats', () => {
		const input = { start: 'September 25, 2023 5pm', end: 'September 25, 2023 10pm' };
		const output = { start: '2023-09-25 17:00:00', end: '2023-09-25 22:00:00' };
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});
	it('3. If no end date is provided, then end should be 1h after start', () => {
		const input = { start: 'October 25 5pm', end: '' };
		const output = { start: '2023-10-25 17:00:00', end: '2023-10-25 18:00:00' };
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});
	it('4. If no start date is specified, then return empty strings', () => {
		const input = { start: '', end: '' };
		const output = { start: '', end: '' };
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});
	it('5. Should return empty strings if start date is invalid', () => {
		const input = { start: 'Invalid Date', end: '2023-10-25 18:00:00' };
		const output = { start: '', end: '' };
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});

	it('6. Should use only start date if end date is invalid', () => {
		const input = { start: '2023-10-25 17:00:00', end: 'Invalid Date' };
		const output = { start: '2023-10-25 17:00:00', end: '2023-10-25 18:00:00' };
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});

	it('7. Should return end 1h after start if provided end is before start', () => {
		const input = { start: '2023-10-25 19:00:00', end: '2023-10-25 18:00:00' };
		const output = { start: '2023-10-25 19:00:00', end: '2023-10-25 20:00:00' };
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});

	it('8. Should handle minimum possible length for start and end dates', () => {
		const input = { start: '2023-10', end: '2023-11' };
		const output = { start: '', end: '' }; // Assuming you want to treat this as invalid
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});

	it('9. Should return empty strings if start and end dates are null', () => {
		const input = { start: null, end: '' };
		const output = { start: '', end: '' };
		const data = parseStartEndDates(input.start, input.end);
		expect(data).toStrictEqual(output);
	});
});
