# V5 Appointment Enquiry Setup

The website now has a structured appointment form.

## Current behavior
Until a secure form endpoint is configured, submission opens WhatsApp to the official clinic number (9125262756) with the appointment details pre-filled. This prevents enquiries from disappearing.

## Recommended production setup
Connect `data-endpoint` on the appointment form to a secure HTTPS form endpoint or backend that:
1. Validates the fields server-side.
2. Sends an email notification to the clinic.
3. Optionally appends the enquiry to a private Google Sheet/CRM.
4. Returns a success response.
5. Never exposes email credentials, API keys, or Google credentials in the website JavaScript.

## Google Meet
Do not automatically issue a Meet link on form submission. The clinic should confirm the appointment first, then send the confirmed Meet link.
