
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Webhook } from 'svix';

// This is your webhook secret, which you can find in your Resend dashboard.
// It's recommended to store this in an environment variable.
const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

if (!webhookSecret) {
    console.error("RESEND_WEBHOOK_SECRET is not set. Webhook verification will fail.");
}

export async function POST(req: NextRequest) {
    if (!webhookSecret) {
        return new NextResponse("Webhook secret not configured.", { status: 500 });
    }

    const payload = await req.text();
    const headers = req.headers;
    const svix_id = headers.get("svix-id");
    const svix_timestamp = headers.get("svix-timestamp");
    const svix_signature = headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Missing Svix headers", { status: 400 });
    }

    const wh = new Webhook(webhookSecret);
    let event;

    try {
        event = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as { type: string; data: any };
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new NextResponse("Webhook verification failed", { status: 400 });
    }

    const { type, data } = event;

    // Here you can handle the event type
    switch (type) {
        case 'email.sent':
            console.log('Email sent:', data);
            // You could update your database record for the email here
            break;
        case 'email.delivered':
            console.log('Email delivered:', data);
            break;
        case 'email.bounced':
            console.log('Email bounced:', data);
            // Handle bounced email, e.g., add to a suppression list
            break;
        case 'email.complained':
            console.log('Email complained:', data);
            // Handle complaint, e.g., unsubscribe the user
            break;
        case 'email.opened':
            console.log('Email opened:', data);
            break;
        case 'email.clicked':
            console.log('Email clicked:', data);
            break;
        default:
            console.warn(`Unhandled event type: ${type}`);
    }

    return new NextResponse("Webhook received", { status: 200 });
}
