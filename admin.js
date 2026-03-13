const STORAGE_KEY = "svp-booking-calendar";
const BOOKINGS_KEY = "svp-bookings";
const ADMIN_AUTH_KEY = "svp-admin-auth";
const ADMIN_USER = "8507374062";
const ADMIN_PASS = "Raushan123@";

const adminLogin = document.getElementById("adminLogin");
const adminLoginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");
const adminDashboard = document.getElementById("adminDashboard");
const logoutBtn = document.getElementById("logoutBtn");
const adminNav = document.getElementById("adminNav");

const adminForm = document.getElementById("adminForm");
const calendarList = document.getElementById("calendarList");
const bookingList = document.getElementById("bookingList");
const clearDateButton = document.getElementById("clearDate");
const reportSummary = document.getElementById("reportSummary");
const reportTable = document.getElementById("reportTable");
const downloadReport = document.getElementById("downloadReport");

function isAuthenticated() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

function setAuthenticated(value) {
  localStorage.setItem(ADMIN_AUTH_KEY, value ? "true" : "false");
}

function showDashboard() {
  adminLogin.hidden = true;
  adminDashboard.hidden = false;
  if (adminNav) adminNav.style.display = "flex";
}

function showLogin() {
  adminLogin.hidden = false;
  adminDashboard.hidden = true;
  if (adminNav) adminNav.style.display = "none";
}

function loadCalendarData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveCalendarData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith("91")) {
    return digits;
  }
  return digits;
}

function buildConfirmationMessage(booking, lang) {
  if (lang === "hi") {
    return `नमस्ते,\n\nआपकी बुकिंग सफलतापूर्वक कन्फर्म हो गई है।\n\nबुकिंग विवरण:\n\nनाम: ${booking.name}\nमोबाइल नंबर: ${booking.phone}\nइवेंट प्रकार: ${booking.eventType}\nइवेंट की तारीख: ${booking.eventDate}\nस्थान: ${booking.location}\n\nहमारी टीम आपके इस खास अवसर को यादगार बनाने के लिए पूरी तरह तैयार है।\n\nधन्यवाद,\nShyam Videography and Photography`;
  }

  return `Hello,\n\nYour booking has been successfully confirmed.\n\nBooking Details:\n\nName: ${booking.name}\nPhone Number: ${booking.phone}\nEvent Type: ${booking.eventType}\nEvent Date: ${booking.eventDate}\nLocation: ${booking.location}\n\nOur team is ready to make your special occasion memorable.\n\nThank you,\nShyam Videography and Photography`;
}

function openWhatsApp(phone, message) {
  const normalized = normalizePhone(phone);
  if (!normalized) return;
  const url = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function getStatusLabel(status) {
  if (status === "booked") return "Booked";
  if (status === "available") return "Available";
  if (status === "shubh") return "Shubh Vivah Tithi";
  if (status === "normal") return "Normal Date";
  return "Available";
}

function renderCalendarList() {
  const data = loadCalendarData();
  const entries = Object.entries(data).sort(([a], [b]) => (a > b ? 1 : -1));
  calendarList.innerHTML = "";

  if (entries.length === 0) {
    calendarList.innerHTML = '<div class="admin-item">No calendar entries yet.</div>';
    return;
  }

  entries.forEach(([date, entry]) => {
    const item = document.createElement("div");
    item.className = "admin-item";
    const statusLabel = getStatusLabel(entry.status);
    item.innerHTML = `
      <strong>${date}</strong>
      <span>Status: ${statusLabel}</span>
      <span>${entry.details || "No details"}</span>
    `;
    calendarList.appendChild(item);
  });
}

function updateCalendarForConfirmed(booking) {
  const calendarData = loadCalendarData();
  calendarData[booking.eventDate] = {
    status: "booked",
    details: `${booking.name} - ${booking.eventType}`
  };
  saveCalendarData(calendarData);
}

function updateBookingStatus(bookingId, status, sendWhatsApp, lang) {
  const bookings = loadBookings();
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return;

  bookings[index].status = status;
  saveBookings(bookings);

  if (status === "confirmed") {
    updateCalendarForConfirmed(bookings[index]);

    if (sendWhatsApp) {
      const msg = buildConfirmationMessage(bookings[index], lang);
      openWhatsApp(bookings[index].phone, msg);
    }
  }

  renderBookingList();
  renderCalendarList();
  renderReport();
}

function updateBookingDate(bookingId) {
  const bookings = loadBookings();
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index === -1) return;

  const current = bookings[index];
  const newDate = window.prompt("Enter new event date (YYYY-MM-DD)", current.eventDate);
  if (!newDate) return;

  const calendarData = loadCalendarData();
  const oldEntry = calendarData[current.eventDate];
  if (oldEntry && oldEntry.status === "booked" && String(oldEntry.details || "").includes(current.name)) {
    delete calendarData[current.eventDate];
  }

  bookings[index].eventDate = newDate;
  saveBookings(bookings);

  if (bookings[index].status === "confirmed") {
    calendarData[newDate] = {
      status: "booked",
      details: `${bookings[index].name} - ${bookings[index].eventType}`
    };
    saveCalendarData(calendarData);
  }

  renderBookingList();
  renderCalendarList();
  renderReport();
}

function renderBookingList() {
  const bookings = loadBookings();
  bookingList.innerHTML = "";

  if (bookings.length === 0) {
    bookingList.innerHTML = '<div class="admin-item">No bookings yet.</div>';
    return;
  }

  bookings.forEach((booking) => {
    const card = document.createElement("div");
    card.className = "booking-card";

    const statusClass = booking.status === "confirmed" ? "status-confirmed" : booking.status === "rejected" ? "status-rejected" : "status-pending";
    const statusLabel = booking.status === "confirmed" ? "Confirmed" : booking.status === "rejected" ? "Rejected" : "Pending";

    card.innerHTML = `
      <div class="booking-header">
        <strong>${booking.name}</strong>
        <span class="status-pill ${statusClass}">${statusLabel}</span>
      </div>
      <div class="booking-meta">Phone: ${booking.phone}</div>
      <div class="booking-meta">Event: ${booking.eventType}</div>
      <div class="booking-meta">Date: ${booking.eventDate}</div>
      <div class="booking-meta">Location: ${booking.location}</div>
      <div class="booking-meta">Message: ${booking.message || "-"}</div>
    `;

    const actions = document.createElement("div");
    actions.className = "booking-actions";

    const confirmHi = document.createElement("button");
    confirmHi.className = "btn btn-primary";
    confirmHi.type = "button";
    confirmHi.textContent = "Confirm (Hindi)";
    confirmHi.addEventListener("click", () => updateBookingStatus(booking.id, "confirmed", true, "hi"));

    const confirmEn = document.createElement("button");
    confirmEn.className = "btn btn-outline";
    confirmEn.type = "button";
    confirmEn.textContent = "Confirm (English)";
    confirmEn.addEventListener("click", () => updateBookingStatus(booking.id, "confirmed", true, "en"));

    const editDate = document.createElement("button");
    editDate.className = "btn btn-outline";
    editDate.type = "button";
    editDate.textContent = "Update Date";
    editDate.addEventListener("click", () => updateBookingDate(booking.id));

    const rejectBtn = document.createElement("button");
    rejectBtn.className = "btn btn-outline";
    rejectBtn.type = "button";
    rejectBtn.textContent = "Reject";
    rejectBtn.addEventListener("click", () => updateBookingStatus(booking.id, "rejected", false));

    actions.appendChild(confirmHi);
    actions.appendChild(confirmEn);
    actions.appendChild(editDate);
    actions.appendChild(rejectBtn);

    card.appendChild(actions);
    bookingList.appendChild(card);
  });
}

function renderReport() {
  const bookings = loadBookings();
  const total = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const rejected = bookings.filter((b) => b.status === "rejected").length;

  reportSummary.innerHTML = "";
  const summaryItems = [
    { label: "Total Bookings", value: total },
    { label: "Confirmed", value: confirmed },
    { label: "Pending", value: pending },
    { label: "Rejected", value: rejected }
  ];

  summaryItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `<h4>${item.label}</h4><p>${item.value}</p>`;
    reportSummary.appendChild(card);
  });

  reportTable.innerHTML = "";
  if (bookings.length === 0) {
    reportTable.innerHTML = '<div class="report-row">No bookings available.</div>';
    return;
  }

  bookings.forEach((booking) => {
    const row = document.createElement("div");
    row.className = "report-row";
    row.innerHTML = `
      <strong>${booking.name}</strong>
      <span>Phone: ${booking.phone}</span>
      <span>Event Type: ${booking.eventType}</span>
      <span>Event Date: ${booking.eventDate}</span>
      <span>Location: ${booking.location}</span>
      <span>Status: ${booking.status}</span>
      <span>Message: ${booking.message || "-"}</span>
    `;
    reportTable.appendChild(row);
  });
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(adminLoginForm);
    const loginId = String(formData.get("loginId") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (loginId === ADMIN_USER && password === ADMIN_PASS) {
      setAuthenticated(true);
      if (loginError) loginError.textContent = "Login successful.";
      showDashboard();
      renderCalendarList();
      renderBookingList();
      renderReport();
      return;
    }

    if (loginError) {
      loginError.textContent = "Invalid credentials. Please try again.";
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    setAuthenticated(false);
    showLogin();
  });
}

if (adminForm) {
  adminForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(adminForm);
    const date = String(formData.get("date") || "").trim();
    const status = String(formData.get("status") || "available").trim();
    const details = String(formData.get("details") || "").trim();

    if (!date) return;

    const data = loadCalendarData();
    data[date] = { status, details };
    saveCalendarData(data);
    renderCalendarList();
    adminForm.reset();
  });
}

if (clearDateButton) {
  clearDateButton.addEventListener("click", () => {
    const formData = new FormData(adminForm);
    const date = String(formData.get("date") || "").trim();
    if (!date) return;

    const data = loadCalendarData();
    delete data[date];
    saveCalendarData(data);
    renderCalendarList();
  });
}

if (downloadReport) {
  downloadReport.addEventListener("click", () => {
    window.print();
  });
}

if (isAuthenticated()) {
  showDashboard();
  renderCalendarList();
  renderBookingList();
  renderReport();
} else {
  showLogin();
}
