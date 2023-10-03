import { describe, it, expect } from 'vitest';

import { validatePhoneNumber } from './phoneNumber';

//wrap these 5 tests in a describe block
describe('validatePhoneNumber', () => {
	//write a test to validate that the output of the validatePhotoNumber function is a boolean
	it('output is a boolean', () => {
		expect(typeof validatePhoneNumber('703-244-3494')).toBe('boolean');
	});

	//write a test to validate that 703-244-3494 is a valid phone number
	it('703-244-3494 is a valid phone number', () => {
		expect(validatePhoneNumber('703-244-3494')).toBe(true);
	});

	//write a test to validate that (703) 244-3494 is a valid phone number
	it('(703) 244-3494 is a valid phone number', () => {
		expect(validatePhoneNumber('(703) 244-3494')).toBe(true);
	});

	//write a test to validate that +1 703-244-3494 is a valid phone number
	it('+1 703-244-3494 is a valid phone number', () => {
		expect(validatePhoneNumber('+1 703-244-3494')).toBe(true);
	});

	//write a test to validate that 7032443494 is a valid phone number
	it('7032443494 is a valid phone number', () => {
		expect(validatePhoneNumber('7032443494')).toBe(true);
	});

	//write a test to validate that (703)-244-349 is not a valid phone number
	it('(703)-244-349 is not a valid phone number', () => {
		expect(validatePhoneNumber('(703)-244-349')).toBe(false);
	});
});
