import { describe, it, expect } from 'vitest';
import { getColloquialDate } from './dates';

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
