/* ══════════════════════════════════════════════════════════════
   NagarSeva KIOSK — Application Logic (MVP Demo)
   SUVIDHA 2026 | Team CoralX | SVNIT Surat
   All data is hardcoded mock data for demo purposes.
══════════════════════════════════════════════════════════════ */

"use strict";

// ═══════════════════════════════════════════════════════════════
// MOCK DATABASE — Rich demo data (no backend needed)
// ═══════════════════════════════════════════════════════════════

const MOCK_DB = {
  // Consumer profiles keyed by consumer ID
  consumers: {
    "ELEC-2024-00123": {
      name: "Ramesh Kumar",
      mobile: "9876543210",
      address: "B-14, Adajan Patia, Surat - 395009",
      zone: "Zone B",
      avatar: "RK",
    },
    "ELEC-2023-00456": {
      name: "Priya Sharma",
      mobile: "9812345678",
      address: "F-7, Vesu Society, Surat - 395007",
      zone: "Zone A",
      avatar: "PS",
    },
    "GAS-2024-00789": {
      name: "Amit Patel",
      mobile: "9067891234",
      address: "Plot 22, Katargam, Surat - 395004",
      zone: "Zone C",
      avatar: "AP",
    },
  },

  // Active consumer session (set on login)
  activeConsumer: null,

  // Bills: electricity
  electricity: {
    consumerId: "ELEC-2024-00123",
    meterId: "M-78234",
    currentBill: {
      period: "Feb 2026",
      amount: 1240,
      dueDate: "March 10, 2026",
      status: "unpaid",
      units: 342,
      unitsDiff: +18,
    },
    history: [
      { period: "Sep 2025", amount: 1080, units: 295, status: "paid" },
      { period: "Oct 2025", amount: 1155, units: 318, status: "paid" },
      { period: "Nov 2025", amount: 1020, units: 277, status: "paid" },
      { period: "Dec 2025", amount: 1245, units: 337, status: "paid" },
      { period: "Jan 2026", amount: 1180, units: 324, status: "paid" },
      { period: "Feb 2026", amount: 1240, units: 342, status: "unpaid" },
    ],
    tariff: "₹3.62/unit (0–200 units) + ₹4.89/unit (above 200)",
  },

  // Bills: gas
  gas: {
    consumerId: "GAS-2024-00789",
    lastBill: {
      period: "Jan 2026",
      amount: 948,
      paidOn: "Jan 18, 2026",
      status: "paid",
      scm: 34,
      scmDiff: -3,
    },
    nextDue: "Feb 28, 2026",
    cylinder: {
      lastBooking: "Jan 5, 2026",
      deliveryStatus: "Delivered",
      nextBookingAllowed: "Feb 5, 2026",
    },
    history: [
      { period: "Sep 2025", amount: 876, scm: 31, status: "paid" },
      { period: "Oct 2025", amount: 921, scm: 33, status: "paid" },
      { period: "Nov 2025", amount: 869, scm: 30, status: "paid" },
      { period: "Dec 2025", amount: 998, scm: 37, status: "paid" },
      { period: "Jan 2026", amount: 948, scm: 34, status: "paid" },
    ],
  },

  // Bills: water
  water: {
    consumerId: "WTR-2023-04521",
    currentBill: {
      period: "Feb 2026",
      amount: 580,
      penalty: 58,
      dueDate: "Feb 15, 2026",
      status: "overdue",
      kl: 18.4,
      klDiff: +2.1,
    },
    history: [
      { period: "Sep 2025", amount: 490, kl: 15.2, status: "paid" },
      { period: "Oct 2025", amount: 520, kl: 16.1, status: "paid" },
      { period: "Nov 2025", amount: 505, kl: 15.7, status: "paid" },
      { period: "Dec 2025", amount: 545, kl: 16.9, status: "paid" },
      { period: "Jan 2026", amount: 530, kl: 16.3, status: "paid" },
      { period: "Feb 2026", amount: 580, kl: 18.4, status: "overdue" },
    ],
    qualityReport: { turbidity: "0.3 NTU ✅", pH: "7.2 ✅", chlorine: "0.5 mg/L ✅", lastTested: "Feb 20, 2026" },
  },

  // Property tax
  property: {
    propertyId: "PROP-SRT-2019-11892",
    ownerName: "Ramesh Kumar",
    address: "B-14, Adajan Patia, Surat - 395009",
    propertyType: "Residential",
    area: 145,
    zone: "Zone B",
    currentTax: {
      fy: "2025–26",
      amount: 8400,
      deadline: "March 31, 2026",
      status: "unpaid",
      penaltyRate: "2%",
      penaltyIfLate: 168,
    },
    history: [
      { fy: "2021–22", amount: 7200, status: "paid", paidOn: "Mar 12, 2022" },
      { fy: "2022–23", amount: 7500, status: "paid", paidOn: "Feb 28, 2023" },
      { fy: "2023–24", amount: 7800, status: "paid", paidOn: "Feb 10, 2024" },
      { fy: "2024–25", amount: 8100, status: "paid", paidOn: "Mar 05, 2025" },
      { fy: "2025–26", amount: 8400, status: "unpaid" },
    ],
  },

  // Grievance tickets by ID
  grievances: {
    "GRV-00234": {
      dept: "Water",
      type: "Low Water Pressure",
      submitted: "20 Feb 2026",
      status: "in_progress",
      progress: 60,
      assignedTo: "Field Team — Zone B",
      expectedResolution: "28 Feb 2026",
      updates: [
        { date: "20 Feb", note: "Complaint registered. Ticket raised." },
        { date: "21 Feb", note: "Assigned to field team. Inspection scheduled." },
        { date: "23 Feb", note: "Inspection done. Pipeline blockage identified." },
      ],
    },
    "GRV-00198": {
      dept: "Electricity",
      type: "Billing Dispute",
      submitted: "10 Feb 2026",
      status: "resolved",
      progress: 100,
      assignedTo: "Billing Dept.",
      expectedResolution: "—",
      updates: [
        { date: "10 Feb", note: "Complaint received." },
        { date: "12 Feb", note: "Bill recalculated. Error confirmed." },
        { date: "15 Feb", note: "Adjusted bill issued. Case closed." },
      ],
    },
    "GRV-00315": {
      dept: "Gas",
      type: "Delayed Cylinder Delivery",
      submitted: "22 Feb 2026",
      status: "open",
      progress: 20,
      assignedTo: "Gas Distribution Centre",
      expectedResolution: "27 Feb 2026",
      updates: [
        { date: "22 Feb", note: "Complaint registered." },
        { date: "23 Feb", note: "Forwarded to distribution centre." },
      ],
    },
  },

  // Transaction history
  transactions: [
    { id: "TXN2026012367821", service: "Electricity", period: "Jan 2026", amount: 1180, mode: "UPI", date: "Jan 19, 2026", status: "success" },
    { id: "TXN2025121289034", service: "Water", period: "Dec 2025", amount: 545, mode: "Card", date: "Dec 22, 2025", status: "success" },
    { id: "TXN2025120978213", service: "Gas", period: "Dec 2025", amount: 998, mode: "Net Banking", date: "Dec 20, 2025", status: "success" },
    { id: "TXN2025112056781", service: "Property Tax", period: "FY 24–25", amount: 8100, mode: "UPI", date: "Mar 05, 2025", status: "success" },
  ],
};

// ═══════════════════════════════════════════════════════════════
// APP STATE
// ═══════════════════════════════════════════════════════════════

const state = {
  language: "en",
  languageLabel: "English",
  currentScreen: "screen-welcome",
  seniorMode: false,
  sessionActive: false,
  sessionSeconds: 300,
  sessionWarningShown: false,
  otpAttempts: 3,
  otpTimerSeconds: 60,
  otpTimerInterval: null,
  sessionInterval: null,
  qrTimerSeconds: 299,
  qrTimerInterval: null,
  paymentMethod: "upi",
  isOnline: navigator.onLine,
  currentPayment: null, // What we're paying right now
};

// ═══════════════════════════════════════════════════════════════
// TRANSLATIONS — 12 Indian Languages
// ═══════════════════════════════════════════════════════════════

const i18n = {
  en: { proceed: "Proceed →", welcome: "Welcome", verifyId: "Verify Your Identity" },
  hi: { proceed: "आगे बढ़ें →", welcome: "स्वागत है", verifyId: "अपनी पहचान सत्यापित करें" },
  gu: { proceed: "આગળ વધો →", welcome: "સ્વાગત છે", verifyId: "તમારી ઓળખ ચકાસો" },
  mr: { proceed: "पुढे जा →", welcome: "स्वागत आहे", verifyId: "आपली ओळख पडताळा" },
  ta: { proceed: "தொடரவும் →", welcome: "வரவேற்கிறோம்", verifyId: "உங்கள் அடையாளத்தை சரிபார்க்கவும்" },
  te: { proceed: "కొనసాగించు →", welcome: "స్వాగతం", verifyId: "మీ గుర్తింపును ధృవీకరించండి" },
  kn: { proceed: "ಮುಂದುವರಿಯಿರಿ →", welcome: "ಸ್ವಾಗತ", verifyId: "ನಿಮ್ಮ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಿ" },
  ml: { proceed: "തുടരുക →", welcome: "സ്വാഗതം", verifyId: "നിങ്ങളുടെ ഐഡന്റിറ്റി പരിശോധിക്കുക" },
  bn: { proceed: "এগিয়ে যান →", welcome: "স্বাগতম", verifyId: "আপনার পরিচয় যাচাই করুন" },
  pa: { proceed: "ਅੱਗੇ ਵਧੋ →", welcome: "ਜੀ ਆਇਆਂ ਨੂੰ", verifyId: "ਆਪਣੀ ਪਛਾਣ ਦੀ ਜਾਂਚ ਕਰੋ" },
  or: { proceed: "ଆଗକୁ ଯାଆ →", welcome: "ସ୍ୱାଗତ", verifyId: "ଆପଣଙ୍କ ପରିଚୟ ଯାଞ୍ଚ କରନ୍ତୁ" },
  as: { proceed: "আগবাঢ়ক →", welcome: "স্বাগতম", verifyId: "আপোনাৰ পৰিচয় পৰীক্ষা কৰক" },
};

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
  checkConnectivity();
  window.addEventListener("online", () => setConnectivity(true));
  window.addEventListener("offline", () => setConnectivity(false));
  document.addEventListener("touchstart", resetSessionTimer, { passive: true });
  document.addEventListener("click", resetSessionTimer);
  // Set default active consumer for demo
  MOCK_DB.activeConsumer = MOCK_DB.consumers["ELEC-2024-00123"];
});

// ═══════════════════════════════════════════════════════════════
// CLOCK
// ═══════════════════════════════════════════════════════════════

function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById("header-clock");
  const dateEl = document.getElementById("header-date");
  if (timeEl) timeEl.textContent = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (dateEl) dateEl.textContent = now.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}

// ═══════════════════════════════════════════════════════════════
// CONNECTIVITY
// ═══════════════════════════════════════════════════════════════

function checkConnectivity() { setConnectivity(navigator.onLine); }

function setConnectivity(online) {
  state.isOnline = online;
  const badge = document.getElementById("connectivity-badge");
  const banner = document.getElementById("offline-banner");
  if (!badge) return;
  if (online) {
    badge.className = "connectivity-badge online";
    badge.innerHTML = '<span class="dot"></span> Online';
    banner && banner.classList.add("hidden");
  } else {
    badge.className = "connectivity-badge offline";
    badge.innerHTML = '<span class="dot"></span> Offline';
    banner && banner.classList.remove("hidden");
  }
}

// ═══════════════════════════════════════════════════════════════
// SCREEN NAVIGATION
// ═══════════════════════════════════════════════════════════════

const SESSION_SCREENS = [
  "screen-services", "screen-electricity", "screen-gas",
  "screen-water", "screen-property", "screen-grievance",
  "screen-traffic", "screen-certificates", "screen-payment",
];

function goToScreen(screenId) {
  const current = document.getElementById(state.currentScreen);
  const next = document.getElementById(screenId);
  if (!next) return;
  if (current) current.classList.remove("active");
  next.classList.add("active");
  state.currentScreen = screenId;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (SESSION_SCREENS.includes(screenId) && !state.sessionActive) {
    startSessionTimer();
  }

  // Populate dynamic content on screen entry
  if (screenId === "screen-services") populateServicesScreen();
  if (screenId === "screen-electricity") populateElectricityScreen();
  if (screenId === "screen-gas") populateGasScreen();
  if (screenId === "screen-water") populateWaterScreen();
  if (screenId === "screen-property") populatePropertyScreen();
  if (screenId === "screen-payment") initPaymentScreen();
}

// ═══════════════════════════════════════════════════════════════
// SCREEN POPULATION — Mock data rendered into DOM
// ═══════════════════════════════════════════════════════════════

function populateServicesScreen() {
  const consumer = MOCK_DB.activeConsumer;
  if (!consumer) return;
  // Update greeting
  const nameEl = document.getElementById("user-name-display");
  const idEl = document.getElementById("user-id-display");
  const avatarEl = document.getElementById("user-avatar-display");
  if (nameEl) nameEl.textContent = "Welcome, " + consumer.name;
  if (idEl) idEl.textContent = "Consumer ID: ELEC-2024-00123 | Authenticated ✅";
  if (avatarEl) avatarEl.textContent = consumer.avatar;
}

function populateElectricityScreen() {
  const d = MOCK_DB.electricity;
  const b = d.currentBill;

  setText("elec-period", "Current Bill — " + b.period);
  setText("elec-amount", "₹" + b.amount.toLocaleString("en-IN") + ".00");
  setText("elec-due", b.dueDate);
  setText("elec-units", b.units);
  setText("elec-unit-diff", (b.unitsDiff > 0 ? "↑ " : "↓ ") + Math.abs(b.unitsDiff) + " units vs last month");
  setText("elec-meter", "Consumer: " + d.consumerId + " | Meter: " + d.meterId);
  setText("elec-tariff-info", d.tariff);

  // Update pay button with amount
  const payBtn = document.getElementById("pay-electricity-btn");
  if (payBtn) payBtn.innerHTML = "💳 Pay Bill ₹" + b.amount.toLocaleString("en-IN");

  // Render bill history table
  const tbody = document.getElementById("elec-history-body");
  if (tbody) {
    tbody.innerHTML = d.history.map(h => `
      <tr>
        <td>${h.period}</td>
        <td>${h.units} kWh</td>
        <td>₹${h.amount.toLocaleString("en-IN")}</td>
        <td class="${h.status === 'paid' ? 'status-paid' : 'status-unpaid'}">${h.status === 'paid' ? '✅ Paid' : '⚠ Unpaid'}</td>
      </tr>
    `).join("");
  }

  // Compute chart bar heights relative to max
  const maxUnits = Math.max(...d.history.map(h => h.units));
  d.history.forEach((h, i) => {
    const bar = document.getElementById("bar-" + i);
    const val = document.getElementById("bar-val-" + i);
    const lbl = document.getElementById("bar-lbl-" + i);
    if (bar) bar.style.height = ((h.units / maxUnits) * 85 + 10) + "%";
    if (val) val.textContent = h.units;
    if (lbl) lbl.textContent = h.period.split(" ")[0]; // e.g. "Sep"
  });
}

function populateGasScreen() {
  const d = MOCK_DB.gas;
  const b = d.lastBill;
  setText("gas-period", "Last Bill — " + b.period);
  setText("gas-amount", "₹" + b.amount.toLocaleString("en-IN") + " PAID");
  setText("gas-paid-on", b.paidOn);
  setText("gas-scm", b.scm);
  setText("gas-scm-diff", (b.scmDiff > 0 ? "↑ " : "↓ ") + Math.abs(b.scmDiff) + " SCM vs last month");
  setText("gas-next-due", d.nextDue);
  setText("gas-cyl-last", d.cylinder.lastBooking);
  setText("gas-cyl-status", d.cylinder.deliveryStatus);
  setText("gas-cyl-next-allowed", d.cylinder.nextBookingAllowed);
}

function populateWaterScreen() {
  const d = MOCK_DB.water;
  const b = d.currentBill;
  const total = b.amount + b.penalty;
  setText("water-period", "Current Bill — " + b.period);
  setText("water-amount", "₹" + b.amount.toLocaleString("en-IN") + " OVERDUE");
  setText("water-due", b.dueDate);
  setText("water-penalty", "⛔ Penalty Applied: ₹" + b.penalty);
  setText("water-kl", b.kl);
  setText("water-kl-diff", (b.klDiff > 0 ? "↑ " : "↓ ") + Math.abs(b.klDiff) + " KL vs last month");
  const payBtn = document.getElementById("pay-water-btn");
  if (payBtn) payBtn.innerHTML = "💳 Pay ₹" + total + " (incl. penalty)";
  // Quality
  const q = d.qualityReport;
  setText("water-quality-turbidity", q.turbidity);
  setText("water-quality-ph", q.pH);
  setText("water-quality-chlorine", q.chlorine);
  setText("water-quality-date", q.lastTested);
}

function populatePropertyScreen() {
  const d = MOCK_DB.property;
  const t = d.currentTax;
  setText("prop-fy", "FY " + t.fy + " Property Tax");
  setText("prop-amount", "₹" + t.amount.toLocaleString("en-IN") + ".00");
  setText("prop-deadline", t.deadline);
  setText("prop-area", d.area);
  setText("prop-zone", d.propertyType + " — " + d.zone);
  setText("prop-penalty-warn", "⚠ Pay before " + t.deadline + " to avoid " + t.penaltyRate + " penalty (₹" + t.penaltyIfLate + ")");
  const payBtn = document.getElementById("pay-property-btn");
  if (payBtn) payBtn.innerHTML = "💳 Pay ₹" + t.amount.toLocaleString("en-IN");

  // History
  const tbody = document.getElementById("prop-history-body");
  if (tbody) {
    tbody.innerHTML = d.history.map(h => `
      <tr>
        <td>FY ${h.fy}</td>
        <td>₹${h.amount.toLocaleString("en-IN")}</td>
        <td class="${h.status === 'paid' ? 'status-paid' : 'status-unpaid'}">${h.status === 'paid' ? '✅ Paid' : '⚠ Pending'}</td>
        <td>${h.paidOn || '—'}</td>
      </tr>
    `).join("");
  }
}

function initPaymentScreen() {
  // Reset to step 1
  showPaymentStep(1);
  selectPayment("upi");
}

// ═══════════════════════════════════════════════════════════════
// LANGUAGE SELECTION
// ═══════════════════════════════════════════════════════════════

function setLanguage(code, label) {
  state.language = code;
  state.languageLabel = label;
  document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
  const btn = document.getElementById("lang-" + code);
  if (btn) btn.classList.add("active");
  const proceedEl = document.getElementById("proceed-label");
  const t = i18n[code] || i18n["en"];
  if (proceedEl) proceedEl.textContent = t.proceed;
  showToast("Language set: " + label);
}

// ═══════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function startSessionTimer() {
  stopSessionTimer();
  state.sessionSeconds = state.seniorMode ? 600 : 300;
  state.sessionWarningShown = false;
  state.sessionActive = true;
  state.sessionInterval = setInterval(sessionTick, 1000);
  updateSessionDisplay();
}

function stopSessionTimer() {
  if (state.sessionInterval) { clearInterval(state.sessionInterval); state.sessionInterval = null; }
  state.sessionActive = false;
}

function resetSessionTimer() {
  if (!state.sessionActive) return;
  state.sessionSeconds = state.seniorMode ? 600 : 300;
  state.sessionWarningShown = false;
  const warnModal = document.getElementById("session-warning-modal");
  if (warnModal && !warnModal.classList.contains("hidden")) closeModal("session-warning-modal");
  updateSessionDisplay();
}

function sessionTick() {
  if (state.sessionSeconds <= 0) { endSession(); return; }
  state.sessionSeconds--;
  updateSessionDisplay();
  if (state.sessionSeconds === 60 && !state.sessionWarningShown) {
    state.sessionWarningShown = true;
    showSessionWarning();
  }
  if (state.sessionWarningShown) {
    const el = document.getElementById("warning-seconds");
    if (el) el.textContent = state.sessionSeconds;
  }
}

function updateSessionDisplay() {
  const el = document.getElementById("session-countdown");
  if (!el) return;
  const m = Math.floor(state.sessionSeconds / 60);
  const s = state.sessionSeconds % 60;
  el.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  el.style.color = state.sessionSeconds < 60 ? "#f87171" : "var(--accent)";
}

function showSessionWarning() {
  const modal = document.getElementById("session-warning-modal");
  if (modal) modal.classList.remove("hidden");
}

function extendSession() { closeModal("session-warning-modal"); resetSessionTimer(); }

function endSession() {
  stopSessionTimer();
  closeModal("session-warning-modal");
  showToast("Session ended. Returning to Welcome screen…");
  setTimeout(() => goToScreen("screen-welcome"), 1500);
}

// ═══════════════════════════════════════════════════════════════
// AUTH FLOW
// ═══════════════════════════════════════════════════════════════

function sendOTP() {
  const cid = document.getElementById("consumer-id").value.trim();
  const mobile = document.getElementById("mobile-number").value.trim();
  if (!cid) { showToast("⚠ Please enter your Consumer ID"); return; }
  if (mobile.length !== 10 || isNaN(mobile)) { showToast("⚠ Enter a valid 10-digit mobile number"); return; }

  // Lookup consumer — any valid ID works in demo
  const consumerKey = Object.keys(MOCK_DB.consumers).find(k =>
    k.toLowerCase() === cid.toLowerCase()
  ) || Object.keys(MOCK_DB.consumers)[0]; // fallback to first for demo
  MOCK_DB.activeConsumer = MOCK_DB.consumers[consumerKey];

  document.getElementById("auth-step-1").classList.add("hidden");
  document.getElementById("auth-step-2").classList.remove("hidden");
  const displayEl = document.getElementById("otp-mobile-display");
  if (displayEl) displayEl.textContent = mobile.substring(0, 5) + "·" + mobile.substring(5);
  showToast("📱 OTP sent to +91 " + mobile.substring(0, 5) + "·" + mobile.substring(5));
  startOTPTimer();

  // Auto-fill OTP after short delay for demo
  setTimeout(() => {
    ["1","2","3","4","5","6"].forEach((d, i) => {
      const inp = document.getElementById("otp-" + i);
      if (inp) { inp.value = d; inp.classList.add("filled"); }
    });
  }, 700);
}

function startOTPTimer() {
  state.otpTimerSeconds = 60;
  updateOTPTimer();
  if (state.otpTimerInterval) clearInterval(state.otpTimerInterval);
  state.otpTimerInterval = setInterval(() => {
    state.otpTimerSeconds--;
    updateOTPTimer();
    if (state.otpTimerSeconds <= 0) {
      clearInterval(state.otpTimerInterval);
      const resendBtn = document.getElementById("resend-btn");
      const timerEl = document.getElementById("otp-timer");
      if (resendBtn) resendBtn.style.display = "inline";
      if (timerEl) timerEl.classList.add("hidden");
    }
  }, 1000);
}

function updateOTPTimer() {
  const el = document.getElementById("otp-countdown");
  if (el) el.textContent = state.otpTimerSeconds;
}

function resendOTP() {
  showToast("📱 OTP resent!");
  startOTPTimer();
  const resendBtn = document.getElementById("resend-btn");
  const timerEl = document.getElementById("otp-timer");
  if (resendBtn) resendBtn.style.display = "none";
  if (timerEl) timerEl.classList.remove("hidden");
}

function otpInput(el, index) {
  el.value = el.value.replace(/\D/g, "");
  if (el.value && index < 5) {
    const next = document.getElementById("otp-" + (index + 1));
    if (next) next.focus();
  }
  el.classList.toggle("filled", !!el.value);
}

function verifyOTP() {
  const otp = [0,1,2,3,4,5].map(i => {
    const el = document.getElementById("otp-" + i);
    return el ? el.value : "";
  }).join("");
  if (otp.length < 6) { showToast("⚠ Please enter the complete 6-digit OTP"); return; }
  const consumer = MOCK_DB.activeConsumer;
  showToast("✅ Verified! Welcome, " + (consumer ? consumer.name : "User"));
  clearInterval(state.otpTimerInterval);
  setTimeout(() => goToScreen("screen-services"), 900);
}

function backToStep1() {
  document.getElementById("auth-step-2").classList.add("hidden");
  document.getElementById("auth-step-1").classList.remove("hidden");
  clearInterval(state.otpTimerInterval);
}

// ═══════════════════════════════════════════════════════════════
// PAYMENT FLOW
// ═══════════════════════════════════════════════════════════════

function initiatePayment(service, amount, period) {
  state.currentPayment = { service, amount, period };
  // Update payment screen with correct amounts
  setText("pay-service-label", service + " — " + period);
  setText("pay-amount-display", "₹" + Number(amount).toLocaleString("en-IN") + ".00");
  setText("pay-summary-amount", "₹" + Number(amount).toLocaleString("en-IN") + ".00");
  setText("upi-amount-display", "₹" + Number(amount).toLocaleString("en-IN") + ".00");
  goToScreen("screen-payment");
}

function selectPayment(method) {
  state.paymentMethod = method;
  document.querySelectorAll(".payment-method-card").forEach(c => c.classList.remove("active"));
  const el = document.getElementById("pay-" + method);
  if (el) el.classList.add("active");
  const upiSection = document.getElementById("upi-section");
  const cardSection = document.getElementById("card-section");
  const nbSection = document.getElementById("nb-section");
  [upiSection, cardSection, nbSection].forEach(s => s && (s.style.display = "none"));
  if (method === "upi") {
    if (upiSection) { upiSection.style.display = ""; startQRTimer(); }
  } else if (method === "card") {
    if (cardSection) cardSection.style.display = "";
    stopQRTimer();
  } else if (method === "netbanking") {
    if (nbSection) nbSection.style.display = "";
    stopQRTimer();
  }
}

function startQRTimer() {
  stopQRTimer();
  state.qrTimerSeconds = 299;
  updateQRTimer();
  state.qrTimerInterval = setInterval(() => {
    state.qrTimerSeconds--;
    updateQRTimer();
    if (state.qrTimerSeconds <= 0) { stopQRTimer(); showToast("⚠ QR code expired. Refresh to regenerate."); }
  }, 1000);
}

function stopQRTimer() {
  if (state.qrTimerInterval) { clearInterval(state.qrTimerInterval); state.qrTimerInterval = null; }
}

function updateQRTimer() {
  const el = document.getElementById("qr-timer");
  if (!el) return;
  const m = Math.floor(state.qrTimerSeconds / 60);
  const s = state.qrTimerSeconds % 60;
  el.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function proceedPayment() {
  showPaymentStep(2);
  stopQRTimer();
  // Simulate gateway processing (2.5 seconds)
  setTimeout(() => {
    const p = state.currentPayment || { service: "Service", amount: 0, period: "—" };
    // Generate receipt details
    const txnId = "TXN" + Date.now().toString().slice(-11);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
    setText("receipt-txn-id", txnId);
    setText("receipt-amount", "₹" + Number(p.amount).toLocaleString("en-IN") + ".00");
    setText("receipt-service", p.service + " — " + p.period);
    setText("receipt-consumer", "ELEC-2024-00123");
    setText("receipt-datetime", dateStr + ", " + timeStr);
    setText("receipt-mode", state.paymentMethod.toUpperCase());
    const pstep3 = document.getElementById("pstep-3");
    if (pstep3) { pstep3.classList.add("done"); pstep3.classList.remove("active"); }
    showPaymentStep(3);
    showToast("✅ Payment processed successfully!");
  }, 2500);
}

function showPaymentStep(step) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById("payment-step-" + i);
    const prog = document.getElementById("pstep-" + i);
    if (el) el.classList.add("hidden");
    if (prog) prog.classList.remove("active", "done");
  }
  const active = document.getElementById("payment-step-" + step);
  const progActive = document.getElementById("pstep-" + step);
  if (active) active.classList.remove("hidden");
  if (progActive) progActive.classList.add("active");
}

function printReceipt() {
  showToast("🖨 Sending to printer… Please collect your receipt.");
}

// ═══════════════════════════════════════════════════════════════
// GRIEVANCE PORTAL
// ═══════════════════════════════════════════════════════════════

function trackTicket() {
  const val = document.getElementById("track-ticket-input").value.trim().toUpperCase();
  const result = document.getElementById("ticket-result");
  if (!val) { showToast("⚠ Please enter a Ticket ID"); return; }

  const ticket = MOCK_DB.grievances[val];
  if (!ticket) {
    showToast("❌ Ticket " + val + " not found. Try: GRV-00234, GRV-00198, GRV-00315");
    if (result) result.classList.add("hidden");
    return;
  }

  // Populate ticket data
  setText("ticket-id-display", val);
  const statusEl = document.getElementById("ticket-status-display");
  if (statusEl) {
    const map = { resolved: "🟢 Resolved", in_progress: "🟡 In Progress", open: "🔵 Open" };
    statusEl.textContent = map[ticket.status] || ticket.status;
    statusEl.className = "ticket-status " + ticket.status;
  }
  setText("ticket-dept-display", ticket.dept + " | " + ticket.type);
  setText("ticket-date-display", "Submitted: " + ticket.submitted);
  setText("ticket-assigned-display", "Assigned: " + ticket.assignedTo);
  const barFill = document.getElementById("ticket-bar-fill");
  if (barFill) {
    barFill.style.width = ticket.progress + "%";
    barFill.textContent = ticket.progress + "%";
  }
  setText("ticket-eta", ticket.status === "resolved" ? "✅ Resolved" : "Expected: " + ticket.expectedResolution);

  // Updates timeline
  const timeline = document.getElementById("ticket-timeline");
  if (timeline && ticket.updates) {
    timeline.innerHTML = ticket.updates.map(u => `
      <div class="timeline-item">
        <span class="timeline-date">${u.date}</span>
        <span class="timeline-note">${u.note}</span>
      </div>
    `).join("");
  }

  if (result) result.classList.remove("hidden");
  showToast("📋 Ticket " + val + " found!");
}

function submitGrievance() {
  const dept = document.getElementById("griev-dept").value;
  const cat = document.getElementById("griev-cat").value;
  const desc = document.getElementById("griev-desc").value.trim();
  if (!desc) { showToast("⚠ Please describe your issue"); return; }
  const ticketId = "GRV-" + String(Math.floor(10000 + Math.random() * 90000));
  const modal = document.getElementById("griev-modal");
  const ticketEl = document.getElementById("griev-ticket-id");
  const summaryEl = document.getElementById("griev-summary");
  if (ticketEl) ticketEl.textContent = ticketId;
  if (summaryEl) summaryEl.textContent = dept + " → " + cat;
  if (modal) modal.classList.remove("hidden");
}

function closeGrievModal() {
  closeModal("griev-modal");
  document.getElementById("griev-desc").value = "";
  document.getElementById("track-ticket-input").value = "";
  document.getElementById("ticket-result").classList.add("hidden");
}

// ═══════════════════════════════════════════════════════════════
// SERVICE REQUESTS
// ═══════════════════════════════════════════════════════════════

function showServiceRequest(type) {
  const ticketId = "SR-" + String(Math.floor(10000 + Math.random() * 90000));
  const modal = document.getElementById("sr-modal");
  const titleEl = document.getElementById("sr-modal-title");
  const ticketEl = document.getElementById("sr-ticket-id");
  if (titleEl) titleEl.textContent = type + " Request Submitted!";
  if (ticketEl) ticketEl.textContent = ticketId;
  if (modal) modal.classList.remove("hidden");
  showToast("📋 Request registered: " + ticketId);
}

function closeSRModal() { closeModal("sr-modal"); }

// ═══════════════════════════════════════════════════════════════
// GAS — CYLINDER BOOKING FLOW
// ═══════════════════════════════════════════════════════════════

function bookCylinder() {
  const modal = document.getElementById("cylinder-modal");
  if (modal) modal.classList.remove("hidden");
  // Set delivery date to 2 days from now
  const d = new Date();
  d.setDate(d.getDate() + 2);
  setText("cylinder-delivery-date", d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }));
  const refId = "CYL-" + String(Math.floor(10000 + Math.random() * 90000));
  setText("cylinder-ref-id", refId);
}

function closeCylinderModal() { closeModal("cylinder-modal"); }

// ═══════════════════════════════════════════════════════════════
// WATER — QUALITY REPORT MODAL
// ═══════════════════════════════════════════════════════════════

function showWaterQuality() {
  const modal = document.getElementById("water-quality-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeWaterQuality() { closeModal("water-quality-modal"); }

// ═══════════════════════════════════════════════════════════════
// BILL HISTORY MODAL (transactions)
// ═══════════════════════════════════════════════════════════════

function showTransactionHistory() {
  const modal = document.getElementById("txn-modal");
  const tbody = document.getElementById("txn-history-body");
  if (tbody) {
    tbody.innerHTML = MOCK_DB.transactions.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.service}</td>
        <td>₹${t.amount.toLocaleString("en-IN")}</td>
        <td>${t.mode}</td>
        <td>${t.date}</td>
        <td class="status-paid">✅ ${t.status}</td>
      </tr>
    `).join("");
  }
  if (modal) modal.classList.remove("hidden");
}

function closeTransactionModal() { closeModal("txn-modal"); }

// ═══════════════════════════════════════════════════════════════
// ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════

function toggleSeniorMode() {
  state.seniorMode = !state.seniorMode;
  document.body.classList.toggle("senior-mode", state.seniorMode);
  const badge = document.getElementById("senior-badge");
  const btn = document.getElementById("senior-toggle");
  if (badge) badge.classList.toggle("hidden", !state.seniorMode);
  if (btn) btn.classList.toggle("active-mode", state.seniorMode);
  if (state.seniorMode && state.sessionActive) {
    state.sessionSeconds = 600;
    updateSessionDisplay();
  }
  showToast(state.seniorMode ? "👴 Senior Mode ON — Larger text & buttons!" : "👓 Senior Mode OFF");
}

function showHelp() {
  const modal = document.getElementById("help-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeHelp() { closeModal("help-modal"); }

// ═══════════════════════════════════════════════════════════════
// MODAL & TOAST HELPERS
// ═══════════════════════════════════════════════════════════════

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  const textEl = document.getElementById("toast-text");
  if (!toast || !textEl) return;
  if (toastTimeout) clearTimeout(toastTimeout);
  textEl.textContent = msg;
  toast.classList.remove("hidden");
  toastTimeout = setTimeout(() => toast.classList.add("hidden"), 3200);
}

// ═══════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD SUPPORT
// ═══════════════════════════════════════════════════════════════

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay:not(.hidden)").forEach(m => m.classList.add("hidden"));
  }
  if (e.key === "Enter" && document.activeElement && document.activeElement.tagName === "BUTTON") {
    document.activeElement.click();
  }
});
