# 🏛 NagarSeva KIOSK — How to Run the Prototype

**SUVIDHA 2026 | Team CoralX | SVNIT Surat**

---

## ⚡ Quick Start (Under 30 Seconds)

This is a **zero-dependency HTML/CSS/JS prototype** — no npm, no build tools, no server required.

### Option 1 — Open Directly in Browser (Simplest)

```
Double-click  →  index.html
```

Works in **Chrome, Edge, Firefox, Safari** (any modern browser).

### Option 2 — Use Live Server (Recommended for Development)

If you have VS Code installed:

1. Install the **Live Server** extension (by Ritwick Dey)
2. Right-click `index.html` → **"Open with Live Server"**
3. Browser opens at `http://127.0.0.1:5500`

Auto-reloads on every file save ✅

### Option 3 — Python Local Server

```bash
# Python 3
python -m http.server 8080

# Then open:
# http://localhost:8080
```

### Option 4 — Node.js `serve` Package

```bash
npx serve .

# Then open the URL shown in the terminal
```

---

## 📁 File Structure

```
SUVIDHA/
├── index.html        ← Main prototype (all 11 screens)
├── styles.css        ← Complete stylesheet (dark theme, responsive)
├── app.js            ← Application logic (navigation, timers, state)
├── README.md         ← Full developer build guide
└── HOW_TO_RUN.md     ← This file
```

---

## 🖥 Prototype Screens & Navigation Flow

```
[Welcome / Language Selector]
        ↓  Click "Proceed"
[Authentication — Consumer ID + OTP]
        ↓  Enter any 10-digit mobile + submit (OTP auto-fills: 123456)
[Services Dashboard]
        ↓  Tap any service tile
    ┌───┬───────┬───────┬──────────┬───────────┬──────────┬──────────┐
    ▼   ▼       ▼       ▼          ▼           ▼          ▼          ▼
  Elec  Gas   Water  Property  Grievance  Certificates  Traffic  (more)
    ↓
[Payment Flow]  →  Processing  →  Success + Receipt
```

---

## 🎮 Interactive Demo Walkthrough

Follow these steps to see all major features:

### 1. Language Selection

- Click any language button on the welcome screen
- The "Proceed" button text changes to that language
- 12 Indian languages available

### 2. Login — OTP Authentication

- Click **Proceed** on welcome screen
- Enter any **Consumer ID** (e.g., `ELEC-2024-00123`)
- Enter any **10-digit mobile number** (e.g., `9876543210`)
- Click **Send OTP via SMS**
- OTP digits (`1 2 3 4 5 6`) auto-fill for demo
- Click **Verify OTP** → You're logged in!

### 3. Services Dashboard

- See 10 service tiles with real-time bill alerts
- **Red/Orange badge** = payment pending or overdue
- **Green badge** = all clear

### 4. Electricity → Pay Bill

- Click ⚡ **Electricity** tile
- See your current bill summary + 6-month consumption bar chart
- Click **💳 Pay Bill ₹1,240**
- Choose a payment method (UPI / Card / Net Banking)
- UPI: see mock QR code with 5-minute countdown timer
- Click **Confirm Payment** → Watch the payment processing spinner
- See success screen with ✅ receipt and Transaction ID

### 5. Grievance Portal

- Click 📋 **Grievance** tile
- **Track existing complaint**: Enter `GRV-00234` → see ticket status and progress bar
- **Submit new complaint**: Fill the form → get a unique Ticket ID

### 6. Traffic Challans

- Click 🚦 **Traffic Challans** → see pending challan with **Pay Now** button

### 7. Accessibility Features

- **👴 Senior Mode**: Enlarges all touch targets and fonts
- **🎙 Voice**: Activates voice navigation (uses browser TTS if available)
- **❓ Help**: Shows helpline numbers
- **Session Timer**: Counts down from 5 minutes (auto-warns at 60s, auto-logs out at 0s)

---

## 🔑 Key Technical Points

| Feature               | Implementation                                             |
| --------------------- | ---------------------------------------------------------- |
| **Architecture**      | Pure HTML5 + Vanilla CSS + Vanilla JS (no dependencies)    |
| **Multilingual**      | 12 Indian languages — button text changes dynamically      |
| **Session Timeout**   | 5 min auto-logout with 60s warning modal                   |
| **Senior Mode**       | CSS class toggle enlarges all UI elements                  |
| **Offline Banner**    | Browser `navigator.onLine` detection                       |
| **OTP Flow**          | 3-attempt limit, 60s resend timer, auto-fill for demo      |
| **Payment Flow**      | 3-step wizard (Select → Processing → Success)              |
| **QR Timer**          | 5-minute countdown on UPI QR code                          |
| **Grievance Tracker** | Ticket status + visual progress bar                        |
| **Live Clock**        | Updates every second in header                             |
| **Touch Targets**     | All buttons min 56×56px (WCAG / Material Design compliant) |
| **Keyboard Support**  | `Escape` closes modals, `Enter` triggers focused buttons   |
| **Responsive**        | Adapts from 1920px desktop down to 480px mobile            |

---

## ⚙️ Customization Guide

### Change the Demo User

In `index.html`, search for `Ramesh Kumar` and update to your preferred demo name.

### Add More Languages

In `app.js`, add a key to the `i18n` object:

```js
i18n.xx = {
  proceed: "Your Translation",
  welcome: "Welcome",
  verifyId: "Verify...",
};
```

### Change Session Timeout

In `app.js`, update state defaults:

```js
sessionSeconds: 300,  // 5 minutes (in seconds)
// Senior mode: 600 = 10 minutes
```

### Modify Service Tiles

In `index.html`, find `#service-grid` and add/edit `.service-card` blocks.

### Change Color Theme

In `styles.css`, edit the CSS variables in `:root`:

```css
:root {
  --primary: #1a6fc4; /* Main blue — change to your brand color */
  --accent: #f5a623; /* Orange highlights */
  --bg: #0d1117; /* Dark background */
}
```

---

## 🧪 Testing Checklist

- [ ] Welcome screen loads with clock and connectivity badge
- [ ] All 12 language buttons work and update "Proceed" text
- [ ] OTP flow completes and reaches Services dashboard
- [ ] All 10 service tiles are clickable and navigate correctly
- [ ] Electricity → Payment flow works end to end
- [ ] Grievance ticket tracking shows result
- [ ] Grievance submission generates a Ticket ID
- [ ] Senior Mode visually enlarges UI elements
- [ ] Session countdown timer works and shows warning at 60s
- [ ] Toast notifications appear for all interactive actions
- [ ] Back button on every screen works
- [ ] Home button returns to Welcome screen
- [ ] Offline banner appears when network disconnected (test in DevTools)

---

## 🚀 What Comes Next (Full Stack Implementation)

This prototype demonstrates the UI/UX. The full production system (per `README.md`) requires:

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| Frontend       | React 18 + TypeScript + Redux Toolkit + i18next               |
| Backend        | Node.js microservices (Auth, Billing, Payment, Notification…) |
| Databases      | PostgreSQL + Redis + MongoDB + Elasticsearch                  |
| Payments       | Razorpay / Paytm gateway integration                          |
| Auth           | Aadhaar OTP via UIDAI API                                     |
| Infrastructure | Docker + Kubernetes + CI/CD pipeline                          |
| PWA            | Workbox service workers for offline support                   |

---

## 📞 Support

| Contact  | Details                         |
| -------- | ------------------------------- |
| Helpline | 1800-599-0019 (Toll Free, 24/7) |
| Email    | help@nagarseva.in               |
| Team     | CoralX — SVNIT Surat            |
| Event    | SUVIDHA 2026                    |

---

_NagarSeva KIOSK — Transforming Civic Service Delivery_
