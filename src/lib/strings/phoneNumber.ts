export function validatePhoneNumber(phone: string): boolean {
	// Define the valid format regex patterns
	const formats = [
		/^\d{3}-\d{3}-\d{4}$/,
		/^\(\d{3}\)\s?\d{3}-\d{4}$/,
		/^\d{10}$/,
		/^\+1\s?\d{3}-\d{3}-\d{4}$/,
		/^\+1\s?\(\d{3}\)\s?\d{3}-\d{4}$/
	];

	// Remove all non-digit characters from the input
	const digits = phone.replace(/\D/g, '');

	// Check if the length is exactly 10 or 11 (when country code is included)
	if (digits.length !== 10 && digits.length !== 11) return false;

	// Validate against all format patterns
	return formats.some((format) => format.test(phone));
}
