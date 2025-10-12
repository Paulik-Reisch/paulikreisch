
"use server";

import "server-only";
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY;
const audienceId = process.env.RESEND_AUDIENCE_ID;

let resend: Resend | null = null;
if (resendApiKey) {
    resend = new Resend(resendApiKey);
} else {
    console.warn("RESEND_API_KEY is not set. Resend functionality will be disabled.");
}

/**
 * Adds a contact to the configured Resend audience.
 * @param email The email of the contact to add.
 * @returns The result of the create contact operation.
 */
export async function addContact(email: string) {
    if (!resend || !audienceId) {
        console.error("Resend is not configured. Missing RESEND_API_KEY or RESEND_AUDIENCE_ID.");
        throw new Error("Resend ist auf dem Server nicht konfiguriert.");
    }
    
    try {
        const { data, error } = await resend.contacts.create({
            email,
            audienceId,
            unsubscribed: false,
        });

        if (error) {
            // Handle cases where the contact might already exist gracefully
            if (error.name === 'validation_error' && error.message.includes('`email` must be unique')) {
                 console.log(`Contact ${email} already exists in audience.`);
                 // Consider this a success from the user's perspective
                 return { success: true, message: 'Contact already exists.' };
            }
            throw error;
        }

        return data;
    } catch (e: any) {
        console.error(`Failed to add contact ${email} to Resend:`, e);
        // Re-throw to be handled by the action
        throw new Error(e.message || 'Could not add contact to Resend.');
    }
}
