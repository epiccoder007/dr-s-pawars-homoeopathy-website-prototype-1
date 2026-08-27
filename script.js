
const toggle=document.querySelector('.menu-toggle');
const links=document.querySelector('.nav-links');
if(toggle) toggle.addEventListener('click',()=>links.classList.toggle('open'));
function submitDemo(e){
  e.preventDefault();
  const s=document.getElementById('form-status');
  if(s) s.textContent="Thank you. Your request has been captured in this demo form. Connect this form to your email/CRM before publishing.";
  e.target.reset();
  return false;
}

/* V5 appointment enquiry workflow */
(function () {
  const form = document.querySelector('[data-appointment-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const endpoint = form.dataset.endpoint || window.DR_SPAWAR_API_ENDPOINT || "";

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const clinic = data.clinic || "Clinic";
    const doctor = data.doctor || "Doctor";
    const message =
      `New appointment request%0A%0A` +
      `Patient: ${encodeURIComponent(data.name || "")}%0A` +
      `Mobile: ${encodeURIComponent(data.phone || "")}%0A` +
      `Doctor: ${encodeURIComponent(doctor)}%0A` +
      `Clinic: ${encodeURIComponent(clinic)}%0A` +
      `Preferred date: ${encodeURIComponent(data.date || "")}%0A` +
      `Preferred time: ${encodeURIComponent(data.time || "")}%0A` +
      `Consultation: ${encodeURIComponent(data.consultation || "Clinic visit")}%0A` +
      `Message: ${encodeURIComponent(data.message || "")}`;

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Request failed");
        if (status) status.textContent = "Thank you. Your appointment request has been received. The clinic will contact you to confirm it.";
        form.reset();
        return;
      } catch (e) {
        if (status) status.textContent = "We couldn't submit the form automatically. Please use the WhatsApp button below.";
      }
    }

    window.open(`https://wa.me/919125262756?text=${message}`, "_blank", "noopener");
    if (status) status.textContent = "WhatsApp opened with your appointment details. Please send the prepared message to the clinic.";
  });
})();
