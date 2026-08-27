const nodemailer = require("nodemailer");

function clean(value, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  try {

    const {
      name,
      phone,
      doctor,
      clinic,
      date,
      time,
      message,
      consultation
    } = req.body || {};

    const patientName = clean(name, 120);
    const patientPhone = clean(phone, 30);
    const preferredDoctor = clean(doctor, 100);
    const preferredClinic = clean(clinic, 100);
    const preferredDate = clean(date, 30);
    const preferredTime = clean(time, 30);
    const patientMessage = clean(message, 2000);
    const consultationType =
      clean(consultation, 100) || "Clinic consultation";

    if (
      !patientName ||
      !patientPhone ||
      !preferredDoctor ||
      !preferredClinic ||
      !preferredDate ||
      !preferredTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required appointment fields."
      });
    }

    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.CLINIC_EMAIL
    ) {
      console.error("Missing required email environment variables.");

      return res.status(500).json({
        success: false,
        message: "Email service is not configured."
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const emailText = `
NEW APPOINTMENT ENQUIRY

Patient Name:
${patientName}

Mobile / WhatsApp:
${patientPhone}

Preferred Doctor:
${preferredDoctor}

Preferred Clinic:
${preferredClinic}

Preferred Date:
${preferredDate}

Preferred Time:
${preferredTime}

Consultation:
${consultationType}

Patient Message:
${patientMessage || "No message provided."}

--------------------------------
Dr. S. Pawar's Homoeopathy
Clinic enquiry generated from website.
`;

    await transporter.sendMail({
      from: `"Dr. S. Pawar's Homoeopathy" <${process.env.SMTP_USER}>`,
      to: process.env.CLINIC_EMAIL,
      replyTo: process.env.SMTP_USER,
      subject: `New Appointment Enquiry - ${patientName}`,
      text: emailText
    });

    return res.status(200).json({
      success: true,
      message: "Appointment enquiry received successfully."
    });

  } catch (error) {

    console.error("Appointment email error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send appointment enquiry."
    });
  }
};
