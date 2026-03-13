const ENQUIRY_KEY = "svp-enquiries";
const LEGACY_ENQUIRY_KEY = "svp-bookings";
const ADMIN_AUTH_KEY = "svp-admin-auth";
const ADMIN_USER = "8507374062";
const ADMIN_PASS = "Raushan123@";

// Vivah Muhurat dates 2026 (SmartPuja list verified with Drik Panchang).
const MUHURAT_2026 = {
  "2026-01-14": { nakshatra: "Anuradha" },
  "2026-01-23": { nakshatra: "Uttara Bhadrapada" },
  "2026-01-25": { nakshatra: "Revati" },
  "2026-01-28": { nakshatra: "Rohini" },
  "2026-02-05": { nakshatra: "Uttara Phalguni" },
  "2026-02-06": { nakshatra: "Hasta" },
  "2026-02-08": { nakshatra: "Swati" },
  "2026-02-10": { nakshatra: "Anuradha" },
  "2026-02-12": { nakshatra: "Mula" },
  "2026-02-14": { nakshatra: "Uttara Ashadha" },
  "2026-02-19": { nakshatra: "Uttara Bhadrapada" },
  "2026-02-20": { nakshatra: "Uttara Bhadrapada" },
  "2026-02-21": { nakshatra: "Revati" },
  "2026-02-24": { nakshatra: "Rohini" },
  "2026-02-25": { nakshatra: "Mrigashira" },
  "2026-02-26": { nakshatra: "Mrigashira" },
  "2026-03-01": { nakshatra: "Magha" },
  "2026-03-03": { nakshatra: "Purva Phalguni" },
  "2026-03-04": { nakshatra: "Uttara Phalguni" },
  "2026-03-07": { nakshatra: "Swati" },
  "2026-03-08": { nakshatra: "Swati" },
  "2026-03-09": { nakshatra: "Anuradha" },
  "2026-03-11": { nakshatra: "Mula" },
  "2026-03-12": { nakshatra: "Mula" },
  "2026-04-15": { nakshatra: "Uttara Bhadrapada" },
  "2026-04-20": { nakshatra: "Rohini" },
  "2026-04-21": { nakshatra: "Mrigashira" },
  "2026-04-25": { nakshatra: "Magha" },
  "2026-04-26": { nakshatra: "Magha" },
  "2026-04-27": { nakshatra: "Uttara Phalguni" },
  "2026-04-28": { nakshatra: "Uttara Phalguni" },
  "2026-04-29": { nakshatra: "Hasta" },
  "2026-05-01": { nakshatra: "Swati" },
  "2026-05-03": { nakshatra: "Anuradha" },
  "2026-05-05": { nakshatra: "Mula" },
  "2026-05-06": { nakshatra: "Mula" },
  "2026-05-07": { nakshatra: "Uttara Ashadha" },
  "2026-05-08": { nakshatra: "Uttara Ashadha" },
  "2026-05-13": { nakshatra: "Uttara Bhadrapada" },
  "2026-05-14": { nakshatra: "Revati" },
  "2026-06-21": { nakshatra: "Uttara Phalguni" },
  "2026-06-22": { nakshatra: "Uttara Phalguni" },
  "2026-06-23": { nakshatra: "Hasta" },
  "2026-06-24": { nakshatra: "Chitra" },
  "2026-06-25": { nakshatra: "Swati" },
  "2026-06-26": { nakshatra: "Swati" },
  "2026-06-27": { nakshatra: "Anuradha" },
  "2026-06-29": { nakshatra: "Mula" },
  "2026-07-01": { nakshatra: "Uttara Ashadha" },
  "2026-07-06": { nakshatra: "Uttara Bhadrapada" },
  "2026-07-07": { nakshatra: "Uttara Bhadrapada" },
  "2026-07-11": { nakshatra: "Rohini" },
  "2026-11-21": { nakshatra: "Revati" },
  "2026-11-24": { nakshatra: "Rohini" },
  "2026-11-25": { nakshatra: "Rohini" },
  "2026-11-26": { nakshatra: "Mrigashira" },
  "2026-12-02": { nakshatra: "Uttara Phalguni" },
  "2026-12-03": { nakshatra: "Hasta" },
  "2026-12-04": { nakshatra: "Chitra" },
  "2026-12-05": { nakshatra: "Swati" },
  "2026-12-06": { nakshatra: "Swati" },
  "2026-12-11": { nakshatra: "Mula" },
  "2026-12-12": { nakshatra: "Uttara Ashadha" }
};

const MUHURAT_YEAR = 2026;
const MUHURAT_MONTH_MIN = 0;
const MUHURAT_MONTH_MAX = 11;

const adminLogin = document.getElementById("adminLogin");
const adminLoginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");
const adminDashboard = document.getElementById("adminDashboard");
const logoutBtn = document.getElementById("logoutBtn");
const adminNav = document.getElementById("adminNav");

const enquiryList = document.getElementById("enquiryList");

const adminCalendarTitle = document.getElementById("adminCalendarTitle");
const adminCalendarWeekdays = document.getElementById("adminCalendarWeekdays");
const adminCalendarGrid = document.getElementById("adminCalendarGrid");
const adminCalendarNote = document.getElementById("adminCalendarNote");
const adminCalendarDetail = document.getElementById("adminCalendarDetail");
const adminCalPrev = document.querySelector("[data-admin-cal-prev]");
const adminCalNext = document.querySelector("[data-admin-cal-next]");

let adminCalendarMonth = new Date();
let adminSelectedDate = "";

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

function padDate(value) {
  return String(value).padStart(2, "0");
}

function clampCalendarMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (year < MUHURAT_YEAR) {
    return new Date(MUHURAT_YEAR, MUHURAT_MONTH_MIN, 1);
  }
  if (year > MUHURAT_YEAR) {
    return new Date(MUHURAT_YEAR, MUHURAT_MONTH_MAX, 1);
  }
  const safeMonth = Math.min(Math.max(month, MUHURAT_MONTH_MIN), MUHURAT_MONTH_MAX);
  return new Date(MUHURAT_YEAR, safeMonth, 1);
}

function isMuhuratDate(key) {
  return Boolean(MUHURAT_2026[key]);
}

function loadEnquiries() {
  try {
    const raw = localStorage.getItem(ENQUIRY_KEY) || localStorage.getItem(LEGACY_ENQUIRY_KEY);
    const data = raw ? JSON.parse(raw) : [];
    if (!localStorage.getItem(ENQUIRY_KEY) && raw) {
      localStorage.setItem(ENQUIRY_KEY, raw);
    }
    return data;
  } catch (error) {
    return [];
  }
}

function saveEnquiries(enquiries) {
  localStorage.setItem(ENQUIRY_KEY, JSON.stringify(enquiries));
}

function getCalendarStatus(key) {
  return isMuhuratDate(key) ? "shubh" : "normal";
}

function getStatusLabel(status, enquiredCount) {
  const labels = [];
  if (status === "shubh") {
    labels.push("Shubh Vivah Tithi");
  } else {
    labels.push("Normal Date");
  }

  if (enquiredCount > 0) {
    labels.push("Enquired");
  }

  return labels.join(" • ");
}

function getDateKey(date) {
  return `${date.getFullYear()}-${padDate(date.getMonth() + 1)}-${padDate(date.getDate())}`;
}

function getDisplayDate(key) {
  if (!key) return "";
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function renderWeekdays(targetEl) {
  if (!targetEl) return;
  targetEl.innerHTML = "";
  const base = new Date(Date.UTC(2024, 0, 7));
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(base.getTime() + i * 86400000);
    const label = day.toLocaleDateString("en-IN", { weekday: "short" });
    const span = document.createElement("span");
    span.textContent = label;
    targetEl.appendChild(span);
  }
}

function getEnquiryMap(enquiries) {
  return enquiries.reduce((acc, enquiry) => {
    if (!enquiry.eventDate) return acc;
    if (!acc[enquiry.eventDate]) {
      acc[enquiry.eventDate] = [];
    }
    acc[enquiry.eventDate].push(enquiry);
    return acc;
  }, {});
}

function renderAdminCalendar() {
  if (!adminCalendarGrid || !adminCalendarTitle) return;
  const enquiries = loadEnquiries();
  const enquiryMap = getEnquiryMap(enquiries);

  adminCalendarGrid.innerHTML = "";
  adminCalendarMonth = clampCalendarMonth(adminCalendarMonth);
  const monthStart = new Date(adminCalendarMonth.getFullYear(), adminCalendarMonth.getMonth(), 1);
  const monthEnd = new Date(adminCalendarMonth.getFullYear(), adminCalendarMonth.getMonth() + 1, 0);
  const startDay = monthStart.getDay();
  const totalDays = monthEnd.getDate();

  adminCalendarTitle.textContent = monthStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  renderWeekdays(adminCalendarWeekdays);

  for (let i = 0; i < startDay; i += 1) {
    const empty = document.createElement("div");
    empty.className = "calendar-day is-muted";
    adminCalendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(adminCalendarMonth.getFullYear(), adminCalendarMonth.getMonth(), day);
    const key = getDateKey(date);
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "calendar-day";
    cell.textContent = String(day);

    const status = getCalendarStatus(key);
    const enquiredCount = enquiryMap[key]?.length || 0;

    if (status === "shubh") {
      cell.classList.add("is-shubh");
    } else {
      cell.classList.add("is-normal");
    }

    if (enquiredCount > 0) {
      cell.classList.add("is-enquired");
    }

    if (adminSelectedDate === key) {
      cell.classList.add("is-selected");
    }

    cell.addEventListener("click", () => {
      adminSelectedDate = key;
      updateAdminCalendarDetail(key, enquiryMap[key] || []);
      renderAdminCalendar();
    });

    adminCalendarGrid.appendChild(cell);
  }

  if (!adminSelectedDate) {
    updateAdminCalendarDetail("", []);
  }

  updateAdminNavState();
}

function updateAdminNavState() {
  if (!adminCalPrev || !adminCalNext) return;
  adminCalPrev.disabled =
    adminCalendarMonth.getFullYear() === MUHURAT_YEAR && adminCalendarMonth.getMonth() === MUHURAT_MONTH_MIN;
  adminCalNext.disabled =
    adminCalendarMonth.getFullYear() === MUHURAT_YEAR && adminCalendarMonth.getMonth() === MUHURAT_MONTH_MAX;
}

function updateAdminCalendarDetail(key, enquiries) {
  if (!adminCalendarNote || !adminCalendarDetail) return;
  if (!key) {
    adminCalendarNote.textContent = "Select a date to view muhurat and enquiries.";
    adminCalendarDetail.innerHTML = "";
    return;
  }

  const status = getCalendarStatus(key);
  const statusLabel = getStatusLabel(status, enquiries.length);
  const muhurat = MUHURAT_2026[key] ? `Nakshatra: ${MUHURAT_2026[key].nakshatra}` : "-";
  const enquiryNames = enquiries.length
    ? enquiries.map((e) => `${e.name} (${e.eventType})`).join(", ")
    : "No enquiries";

  adminCalendarNote.textContent = statusLabel;
  adminCalendarDetail.innerHTML = `
    <div><strong>Date:</strong> ${getDisplayDate(key)}</div>
    <div><strong>Status:</strong> ${statusLabel}</div>
    <div><strong>Muhurat:</strong> ${muhurat}</div>
    <div><strong>Enquiries:</strong> ${enquiryNames}</div>
  `;
}

function updateEnquiryStatus(enquiryId, status) {
  const enquiries = loadEnquiries();
  const index = enquiries.findIndex((e) => e.id === enquiryId);
  if (index === -1) return;

  enquiries[index].status = status;
  saveEnquiries(enquiries);
  renderEnquiryList();
  renderAdminCalendar();
}

function updateEnquiryDate(enquiryId) {
  const enquiries = loadEnquiries();
  const index = enquiries.findIndex((e) => e.id === enquiryId);
  if (index === -1) return;

  const current = enquiries[index];
  const newDate = window.prompt("Enter new event date (YYYY-MM-DD)", current.eventDate);
  if (!newDate) return;

  enquiries[index].eventDate = newDate;
  saveEnquiries(enquiries);
  renderEnquiryList();
  renderAdminCalendar();
}

function deleteEnquiry(enquiryId) {
  const enquiries = loadEnquiries();
  const filtered = enquiries.filter((e) => e.id !== enquiryId);
  saveEnquiries(filtered);
  renderEnquiryList();
  renderAdminCalendar();
}

function renderEnquiryList() {
  const enquiries = loadEnquiries();
  enquiryList.innerHTML = "";

  if (enquiries.length === 0) {
    enquiryList.innerHTML = '<div class="admin-item">No enquiries yet.</div>';
    return;
  }

  enquiries.forEach((enquiry) => {
    const card = document.createElement("div");
    card.className = "booking-card";

    const statusClass = enquiry.status === "contacted" ? "status-confirmed" : "status-pending";
    const statusLabel = enquiry.status === "contacted" ? "Contacted" : "Pending";
    const createdAt = enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString("en-IN") : "-";

    card.innerHTML = `
      <div class="booking-header">
        <strong>${enquiry.name}</strong>
        <span class="status-pill ${statusClass}">${statusLabel}</span>
      </div>
      <div class="booking-meta">Phone: ${enquiry.phone}</div>
      <div class="booking-meta">Event: ${enquiry.eventType}</div>
      <div class="booking-meta">Date: ${enquiry.eventDate}</div>
      <div class="booking-meta">Location: ${enquiry.location}</div>
      <div class="booking-meta">Message: ${enquiry.message || "-"}</div>
      <div class="booking-meta">Enquiry Date: ${createdAt}</div>
    `;

    const actions = document.createElement("div");
    actions.className = "booking-actions";

    const markContacted = document.createElement("button");
    markContacted.className = "btn btn-primary";
    markContacted.type = "button";
    markContacted.textContent = "Mark Contacted";
    markContacted.addEventListener("click", () => updateEnquiryStatus(enquiry.id, "contacted"));

    const markPending = document.createElement("button");
    markPending.className = "btn btn-outline";
    markPending.type = "button";
    markPending.textContent = "Mark Pending";
    markPending.addEventListener("click", () => updateEnquiryStatus(enquiry.id, "pending"));

    const updateDate = document.createElement("button");
    updateDate.className = "btn btn-outline";
    updateDate.type = "button";
    updateDate.textContent = "Update Date";
    updateDate.addEventListener("click", () => updateEnquiryDate(enquiry.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-outline";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete Enquiry";
    deleteBtn.addEventListener("click", () => deleteEnquiry(enquiry.id));

    actions.appendChild(markContacted);
    actions.appendChild(markPending);
    actions.appendChild(updateDate);
    actions.appendChild(deleteBtn);

    card.appendChild(actions);
    enquiryList.appendChild(card);
  });
}

function spawnParticles(target) {
  if (!target) return;
  const count = 12;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    const angle = Math.random() * Math.PI * 2;
    const distance = 16 + Math.random() * 22;
    const size = 3 + Math.random() * 3;
    const duration = 500 + Math.random() * 300;
    const dx = `${Math.cos(angle) * distance}px`;
    const dy = `${Math.sin(angle) * distance}px`;
    particle.style.setProperty("--dx", dx);
    particle.style.setProperty("--dy", dy);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--duration", `${duration}ms`);
    target.appendChild(particle);
    window.setTimeout(() => particle.remove(), duration + 80);
  }
}

document.addEventListener("click", (event) => {
  const btn = event.target.closest(".btn");
  if (btn) {
    spawnParticles(btn);
  }
});

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
      renderEnquiryList();
      renderAdminCalendar();
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

if (adminCalPrev) {
  adminCalPrev.addEventListener("click", () => {
    adminCalendarMonth = clampCalendarMonth(
      new Date(adminCalendarMonth.getFullYear(), adminCalendarMonth.getMonth() - 1, 1)
    );
    renderAdminCalendar();
  });
}

if (adminCalNext) {
  adminCalNext.addEventListener("click", () => {
    adminCalendarMonth = clampCalendarMonth(
      new Date(adminCalendarMonth.getFullYear(), adminCalendarMonth.getMonth() + 1, 1)
    );
    renderAdminCalendar();
  });
}

if (isAuthenticated()) {
  showDashboard();
  renderEnquiryList();
  renderAdminCalendar();
} else {
  showLogin();
}

