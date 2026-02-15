"use server";

import "server-only";
import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend() {
    if (resendInstance) return resendInstance;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
        resendInstance = new Resend(resendApiKey);
        return resendInstance;
    }
    
    console.warn("RESEND_API_KEY is not set. Resend functionality will be disabled.");
    return null;
}


/**
 * Adds a contact to the configured Resend audience.
 * @param email The email of the contact to add.
 * @returns The result of the create contact operation.
 */
export async function addContact(email: string) {
    const resend = getResend();
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!resend || !audienceId) {
        console.error("Resend is not configured. Missing RESEND_API_KEY or RESEND_AUDIENCE_ID.");
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[DEV ONLY] Simulating Resend contact add for ${email}.`);
            return { id: 'dev-simulated-contact' };
        }
        throw new Error("Resend ist auf dem Server nicht konfiguriert.");
    }
    
    const { data, error } = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
    });

    if (error) {
        // Re-throw to be handled by the action
        throw error;
    }

    return data;
}

/**
 * Sends a campaign email to the configured Resend audience.
 * @param subject The subject of the email.
 * @param htmlContent The HTML content of the email.
 */
export async function sendCampaign(subject: string, htmlContent: string) {
    const resend = getResend();
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!resend || !audienceId) {
        console.error("Resend is not configured. Missing RESEND_API_KEY or RESEND_AUDIENCE_ID.");
        throw new Error("Resend ist auf dem Server nicht konfiguriert.");
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Paulik & Reisch <newsletter@paulik-reisch.de>',
            to: [audienceId],
            subject: subject,
            html: htmlContent,
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