import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

/**
 * Validates a phone number and returns validation result
 * @param {string} phoneNumber - The phone number to validate
 * @param {string} defaultCountry - Default country code (e.g., 'US')
 * @returns {{ isValid: boolean, formatted?: string, error?: string }}
 */
export function validatePhoneNumber(phoneNumber, defaultCountry = 'US') {
    if (!phoneNumber || phoneNumber.trim() === '') {
        return { isValid: true }; // Allow empty phone numbers
    }

    try {
        // @ts-ignore - defaultCountry is a valid CountryCode
        const isValid = isValidPhoneNumber(phoneNumber, { defaultCountry });
        
        if (!isValid) {
            return {
                isValid: false,
                error: 'Please enter a valid phone number'
            };
        }

        // Parse and format the phone number
        // @ts-ignore - defaultCountry is a valid CountryCode
        const parsed = parsePhoneNumber(phoneNumber, { defaultCountry });
        return {
            isValid: true,
            formatted: parsed.formatInternational()
        };
    } catch (error) {
        return {
            isValid: false,
            error: 'Please enter a valid phone number'
        };
    }
}

/**
 * Formats a phone number for display
 * @param {string} phoneNumber - The phone number to format
 * @param {string} defaultCountry - Default country code
 * @returns {string} Formatted phone number or original if invalid
 */
export function formatPhoneNumber(phoneNumber, defaultCountry = 'US') {
    if (!phoneNumber) return '';
    
    try {
        // @ts-ignore - defaultCountry is a valid CountryCode
        const parsed = parsePhoneNumber(phoneNumber, { defaultCountry });
        return parsed.formatInternational();
    } catch {
        return phoneNumber; // Return original if parsing fails
    }
}

/**
 * Formats a phone number for storage (E.164 format)
 * @param {string} phoneNumber - The phone number to format
 * @param {string} defaultCountry - Default country code
 * @returns {string} E.164 formatted phone number or original if invalid
 */
export function formatPhoneForStorage(phoneNumber, defaultCountry = 'US') {
    if (!phoneNumber) return '';
    
    try {
        // @ts-ignore - defaultCountry is a valid CountryCode
        const parsed = parsePhoneNumber(phoneNumber, { defaultCountry });
        return parsed.format('E.164');
    } catch {
        return phoneNumber; // Return original if parsing fails
    }
}
