const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');

if (toggle) {
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
}

function submitDemo(e) {
  e.preventDefault();

  const s = document.getElementById('form-status');

  if (s) {
    s.textContent =
      "Thank you. Your request has been captured in this demo form.";
  }

  e.target.reset();
  return false;
}

/* V5 Appointment Enquiry Workflow */
(function () {
  const form = document.querySelector('[data-appointment-form]');

  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const endpoint =
    form.dataset.endpoint ||
    window.DR_SPAWAR_API_ENDPOINT ||
    "";

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    const data = Object.fromEntries(
      new FormData(form).entries()
    );

    try {
      if (!endpoint) {
        throw new Error("Appointment endpoint is not configured.");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to submit appointment request."
        );
      }

      if (status) {
        status.textContent =
          "Thank you. Your appointment enquiry has been received. The clinic will contact you to confirm the appointment.";
      }

      form.reset();

    } catch (error) {

      console.error("Appointment submission error:", error);

      const clinicMessage =
        `New appointment request\n\n` +
        `Patient: ${data.name || ""}\n` +
        `Mobile: ${data.phone || ""}\n` +
        `Doctor: ${data.doctor || ""}\n` +
        `Clinic: ${data.clinic || ""}\n` +
        `Preferred date: ${data.date || ""}\n` +
        `Preferred time: ${data.time || ""}\n` +
        `Consultation: ${data.consultation || "Clinic visit"}\n` +
        `Message: ${data.message || ""}`;

      if (status) {
        status.textContent =
          "We couldn't submit the enquiry automatically. Please send it to the clinic through WhatsApp.";
      }

      window.open(
        `https://wa.me/919125262756?text=${encodeURIComponent(clinicMessage)}`,
        "_blank",
        "noopener"
      );

    } finally {

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Request Online Consultation";
      }
    }
  });
})();
