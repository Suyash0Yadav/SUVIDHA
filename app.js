/* ══════════════════════════════════════════════
   NagarSeva KIOSK — Application Logic
   SUVIDHA 2026 | Team CoralX | SVNIT Surat
══════════════════════════════════════════════ */

"use strict";

// ── STATE ──────────────────────────────────────
const state = {
  language: "en",
  languageLabel: "English",
  currentScreen: "screen-welcome",
  seniorMode: false,
  voiceEnabled: false,
  sessionActive: false,
  sessionSeconds: 300, // 5 min default
  sessionWarningShown: false,
  otpAttempts: 3,
  otpTimerSeconds: 60,
  otpTimerInterval: null,
  sessionInterval: null,
  qrTimerSeconds: 299,
  qrTimerInterval: null,
  paymentMethod: "upi",
  isOnline: navigator.onLine,
};

// ── TRANSLATIONS (subset for demo) ─────────────
const i18n = {
  en: {
    proceed: "Proceed →",
    welcome: "Welcome",
    verifyId: "Verify Your Identity",
  },
  hi: {
    proceed: "आगे बढ़ें →",
    welcome: "स्वागत है",
    verifyId: "अपनी पहचान सत्यापित करें",
  },
  gu: {
    proceed: "આગળ વધો →",
    welcome: "સ્વાગત છે",
    verifyId: "તમારી ઓળખ ચકાસો",
  },
  mr: {
    proceed: "पुढे जा →",
    welcome: "स्वागत आहे",
    verifyId: "आपली ओळख पडताळा",
  },
  ta: {
    proceed: "தொடரவும் →",
    welcome: "வரவேற்கிறோம்",
    verifyId: "உங்கள் அடையாளத்தை சரிபார்க்கவும்",
  },
  te: {
    proceed: "కొనసాగించు →",
    welcome: "స్వాగతం",
    verifyId: "మీ గుర్తింపును ధృవీకరించండి",
  },
  kn: {
    proceed: "ಮುಂದುವರಿಯಿರಿ →",
    welcome: "ಸ್ವಾಗತ",
    verifyId: "ನಿಮ್ಮ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಿ",
  },
  ml: {
    proceed: "തുടരുക →",
    welcome: "സ്വാഗതം",
    verifyId: "നിങ്ങളുടെ ഐഡന്റിറ്റി പരിശോധിക്കുക",
  },
  bn: {
    proceed: "এগিয়ে যান →",
    welcome: "স্বাগতম",
    verifyId: "আপনার পরিচয় যাচাই করুন",
  },
  pa: {
    proceed: "ਅੱਗੇ ਵਧੋ →",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    verifyId: "ਆਪਣੀ ਪਛਾਣ ਦੀ ਜਾਂਚ ਕਰੋ",
  },
  or: {
    proceed: "ଆଗକୁ ଯାଆ →",
    welcome: "ସ୍ୱାଗତ",
    verifyId: "ଆପଣଙ୍କ ପରିଚୟ ଯାଞ୍ଚ କରନ୍ତୁ",
  },
  as: {
    proceed: "আগবাঢ়ক →",
    welcome: "স্বাগতম",
    verifyId: "আপোনাৰ পৰিচয় পৰীক্ষা কৰক",
  },
};

// ── INIT ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
  checkConnectivity();
  window.addEventListener("online", () => setConnectivity(true));
  window.addEventListener("offline", () => setConnectivity(false));
  // Reset session on any touch/click
  document.addEventListener("touchstart", resetSessionTimer);
  document.addEventListener("click", resetSessionTimer);
});

// ── CLOCK ──────────────────────────────────────
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById("header-clock");
  const dateEl = document.getElementById("header-date");
  if (timeEl)
    timeEl.textContent = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  if (dateEl)
    dateEl.textContent = now.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
}

// ── CONNECTIVITY ───────────────────────────────
function checkConnectivity() {
  setConnectivity(navigator.onLine);
}
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

// ── SCREEN NAVIGATION ──────────────────────────
function goToScreen(screenId) {
  const current = document.getElementById(state.currentScreen);
  const next = document.getElementById(screenId);
  if (!next) return;
  if (current) current.classList.remove("active");
  next.classList.add("active");
  state.currentScreen = screenId;
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Start session timer when entering services area
  if (
    [
      "screen-services",
      "screen-electricity",
      "screen-gas",
      "screen-water",
      "screen-property",
      "screen-grievance",
      "screen-traffic",
      "screen-certificates",
    ].includes(screenId)
  ) {
    startSessionTimer();
  }
}

// ── LANGUAGE SELECTION ─────────────────────────
function setLanguage(code, label) {
  state.language = code;
  state.languageLabel = label;
  // Highlight selected
  document
    .querySelectorAll(".lang-btn")
    .forEach((b) => b.classList.remove("active"));
  const btn = document.getElementById("lang-" + code);
  if (btn) btn.classList.add("active");
  // Update proceed button
  const proceedEl = document.getElementById("proceed-label");
  const t = i18n[code] || i18n["en"];
  if (proceedEl) proceedEl.textContent = t.proceed;
  showToast("Language set: " + label);
}

// ── SESSION MANAGEMENT ─────────────────────────
function startSessionTimer() {
  stopSessionTimer();
  state.sessionSeconds = state.seniorMode ? 600 : 300;
  state.sessionWarningShown = false;
  state.sessionActive = true;
  state.sessionInterval = setInterval(sessionTick, 1000);
  updateSessionDisplay();
}

function stopSessionTimer() {
  if (state.sessionInterval) {
    clearInterval(state.sessionInterval);
    state.sessionInterval = null;
  }
  state.sessionActive = false;
}

function resetSessionTimer() {
  if (state.sessionActive) {
    state.sessionSeconds = state.seniorMode ? 600 : 300;
    state.sessionWarningShown = false;
    const warnModal = document.getElementById("session-warning-modal");
    if (warnModal && !warnModal.classList.contains("hidden")) {
      closeModal("session-warning-modal");
    }
    updateSessionDisplay();
  }
}

function sessionTick() {
  if (state.sessionSeconds <= 0) {
    endSession();
    return;
  }
  state.sessionSeconds--;
  updateSessionDisplay();
  // Show warning at 60s
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
  el.textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  el.style.color = state.sessionSeconds < 60 ? "#f87171" : "var(--accent)";
}

function showSessionWarning() {
  const modal = document.getElementById("session-warning-modal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function extendSession() {
  closeModal("session-warning-modal");
  resetSessionTimer();
}

function endSession() {
  stopSessionTimer();
  closeModal("session-warning-modal");
  showToast("Session ended. Redirecting to Welcome screen…");
  setTimeout(() => goToScreen("screen-welcome"), 1500);
}

// ── AUTH FLOW ──────────────────────────────────
function sendOTP() {
  const cid = document.getElementById("consumer-id").value.trim();
  const mobile = document.getElementById("mobile-number").value.trim();
  if (!cid) {
    showToast("Please enter your Consumer ID");
    return;
  }
  if (mobile.length !== 10 || isNaN(mobile)) {
    showToast("Please enter a valid 10-digit mobile number");
    return;
  }

  // Show step 2
  document.getElementById("auth-step-1").classList.add("hidden");
  document.getElementById("auth-step-2").classList.remove("hidden");
  const displayEl = document.getElementById("otp-mobile-display");
  if (displayEl)
    displayEl.textContent = mobile.substring(0, 5) + "·" + mobile.substring(5);
  showToast(
    "OTP sent to +91 " + mobile.substring(0, 5) + "·" + mobile.substring(5),
  );
  startOTPTimer();

  // Auto-fill demo OTP
  setTimeout(() => {
    const digits = ["1", "2", "3", "4", "5", "6"];
    digits.forEach((d, i) => {
      const inp = document.getElementById("otp-" + i);
      if (inp) {
        inp.value = d;
        inp.classList.add("filled");
      }
    });
  }, 600);
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
  showToast("OTP resent!");
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
  if (el.value) el.classList.add("filled");
  else el.classList.remove("filled");
}

function verifyOTP() {
  const otp = [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const el = document.getElementById("otp-" + i);
      return el ? el.value : "";
    })
    .join("");

  if (otp.length < 6) {
    showToast("Please enter the complete 6-digit OTP");
    return;
  }

  // Demo: any OTP works
  showToast("✅ Verified! Welcome, Ramesh Kumar");
  clearInterval(state.otpTimerInterval);
  setTimeout(() => goToScreen("screen-services"), 800);
}

function backToStep1() {
  document.getElementById("auth-step-2").classList.add("hidden");
  document.getElementById("auth-step-1").classList.remove("hidden");
  clearInterval(state.otpTimerInterval);
}

// ── PAYMENT FLOW ───────────────────────────────
function selectPayment(method) {
  state.paymentMethod = method;
  document
    .querySelectorAll(".payment-method-card")
    .forEach((c) => c.classList.remove("active"));
  const el = document.getElementById("pay-" + method);
  if (el) el.classList.add("active");

  const upiSection = document.getElementById("upi-section");
  if (method === "upi") {
    if (upiSection) upiSection.style.display = "";
    startQRTimer();
  } else {
    if (upiSection) upiSection.style.display = "none";
    stopQRTimer();
    showToast(
      method === "card"
        ? "Card payment widget will open on Proceed"
        : "Net Banking portal will open on Proceed",
    );
  }
}

function startQRTimer() {
  stopQRTimer();
  state.qrTimerSeconds = 299;
  updateQRTimer();
  state.qrTimerInterval = setInterval(() => {
    state.qrTimerSeconds--;
    updateQRTimer();
    if (state.qrTimerSeconds <= 0) {
      stopQRTimer();
      showToast("QR code expired. Please refresh.");
    }
  }, 1000);
}

function stopQRTimer() {
  if (state.qrTimerInterval) {
    clearInterval(state.qrTimerInterval);
    state.qrTimerInterval = null;
  }
}

function updateQRTimer() {
  const el = document.getElementById("qr-timer");
  if (!el) return;
  const m = Math.floor(state.qrTimerSeconds / 60);
  const s = state.qrTimerSeconds % 60;
  el.textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function proceedPayment() {
  showPaymentStep(2);
  stopQRTimer();
  // Simulate processing delay
  setTimeout(() => {
    showPaymentStep(3);
    const pstep3 = document.getElementById("pstep-3");
    if (pstep3) {
      pstep3.classList.add("done");
      pstep3.classList.remove("active");
    }
  }, 2800);
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
  showToast("🖨 Receipt printing… Check the printer.");
}

// ── GRIEVANCE ──────────────────────────────────
function trackTicket() {
  const val = document.getElementById("track-ticket-input").value.trim();
  const result = document.getElementById("ticket-result");
  if (!val) {
    showToast("Please enter a Ticket ID");
    return;
  }
  if (result) result.classList.remove("hidden");
  showToast("Ticket found: " + val);
}

function submitGrievance() {
  const desc = document.getElementById("griev-desc").value.trim();
  if (!desc) {
    showToast("Please describe your issue");
    return;
  }
  const ticketId = "GRV-" + String(Math.floor(10000 + Math.random() * 90000));
  const modal = document.getElementById("griev-modal");
  const ticketEl = document.getElementById("griev-ticket-id");
  if (ticketEl) ticketEl.textContent = ticketId;
  if (modal) modal.classList.remove("hidden");
}

function closeGrievModal() {
  closeModal("griev-modal");
  goToScreen("screen-services");
}

// ── SERVICE REQUEST ────────────────────────────
function showServiceRequest(type) {
  const ticketId = "SR-" + String(Math.floor(10000 + Math.random() * 90000));
  const modal = document.getElementById("sr-modal");
  const titleEl = document.getElementById("sr-modal-title");
  const ticketEl = document.getElementById("sr-ticket-id");
  if (titleEl) titleEl.textContent = type + " Request Submitted!";
  if (ticketEl) ticketEl.textContent = ticketId;
  if (modal) modal.classList.remove("hidden");
}

function closeSRModal() {
  closeModal("sr-modal");
}

// ── ACCESSIBILITY ──────────────────────────────
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
  showToast(
    state.seniorMode
      ? "👴 Senior Mode ON — Larger text & buttons!"
      : "👓 Senior Mode OFF",
  );
}

function toggleVoice() {
  state.voiceEnabled = !state.voiceEnabled;
  const btn = document.getElementById("voice-toggle");
  if (btn) btn.classList.toggle("active-mode", state.voiceEnabled);
  showToast(
    state.voiceEnabled
      ? '🎙 Voice navigation ON — Say "Hey NagarSeva"'
      : "🔇 Voice navigation OFF",
  );
  // Demo: speak if browser supports TTS
  if (state.voiceEnabled && "speechSynthesis" in window) {
    const utt = new SpeechSynthesisUtterance(
      "Hey NagarSeva is active. How can I help you?",
    );
    utt.lang = "en-IN";
    speechSynthesis.speak(utt);
  }
}

function showHelp() {
  const modal = document.getElementById("help-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeHelp() {
  closeModal("help-modal");
}

// ── MODAL HELPERS ──────────────────────────────
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("hidden");
}

// ── TOAST ──────────────────────────────────────
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  const textEl = document.getElementById("toast-text");
  if (!toast || !textEl) return;
  if (toastTimeout) clearTimeout(toastTimeout);
  textEl.textContent = msg;
  toast.classList.remove("hidden");
  toastTimeout = setTimeout(() => toast.classList.add("hidden"), 3000);
}

// ── KEYBOARD SUPPORT ───────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close any open modal
    document
      .querySelectorAll(".modal-overlay:not(.hidden)")
      .forEach((m) => m.classList.add("hidden"));
  }
  if (e.key === "Enter") {
    // Trigger focused button
    if (document.activeElement && document.activeElement.tagName === "BUTTON") {
      document.activeElement.click();
    }
  }
});

// ── INIT PAYMENT STATE ─────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Start QR timer when payment screen first shown (handled by selectPayment)
  // Default payment step visible = 1
});
