
import "server-only";
import { Resend } from 'resend';

/**
 * Adds a contact to the configured Resend audience.
 * @param email The email of the contact to add.
 * @returns The result of the create contact operation.
 */
export async function addContact(email: string) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!resendApiKey || !audienceId) {
        console.error("Resend is not configured. Missing RESEND_API_KEY or RESEND_AUDIENCE_ID.");
        throw new Error("Resend ist auf dem Server nicht konfiguriert.");
    }
    
    const resend = new Resend(resendApiKey);

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

/**
 * Sends a campaign to the configured Resend audience.
 * @param subject The subject of the email campaign.
 * @param html The HTML content of the email.
 * @returns The result of the send email operation.
 */
export async function sendCampaign(subject: string, html: string) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!resendApiKey || !audienceId) {
        console.error("Resend is not configured. Missing RESEND_API_KEY or RESEND_AUDIENCE_ID.");
        throw new Error("Resend ist auf dem Server nicht konfiguriert.");
    }

    const resend = new Resend(resendApiKey);

    try {
        const { data, error } = await resend.emails.send({
            from: 'Hallo Welt <hallo-welt@paulik-reisch.de>',
            to: audienceId, // Send to the entire audience ID directly
            subject: subject,
            html: html,
        });
        
        if (error) {
            throw error;
        }

        return data;

    } catch (e: any) {
        console.error(`Failed to send campaign:`, e);
        throw new Error(e.message || 'Could not send campaign via Resend.');
    }
}

    