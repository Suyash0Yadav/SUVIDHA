# NagarSeva KIOSK — Developer Build Guide
**Unified Smart Civic Services Platform**
*SUVIDHA 2026 | Team CoralX | SVNIT Surat*

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Repository Structure](#4-repository-structure)
5. [Frontend (Kiosk UI)](#5-frontend-kiosk-ui)
6. [Backend Microservices](#6-backend-microservices)
7. [Database Design](#7-database-design)
8. [Integration Layer](#8-integration-layer)
9. [Security Architecture](#9-security-architecture)
10. [Accessibility & Multilingual Support](#10-accessibility--multilingual-support)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Offline Mode](#12-offline-mode)
13. [Department Modules](#13-department-modules)
14. [Admin Dashboard](#14-admin-dashboard)
15. [Key Workflows (Step-by-Step)](#15-key-workflows-step-by-step)
16. [Hardware Setup](#16-hardware-setup)
17. [Environment Variables & Config](#17-environment-variables--config)
18. [Development Setup (Local)](#18-development-setup-local)
19. [Testing Strategy](#19-testing-strategy)
20. [Compliance & Standards](#20-compliance--standards)
21. [Future Roadmap](#21-future-roadmap)

---

## 1. Project Overview

**NagarSeva KIOSK** is an intelligent, multilingual, touch-first self-service platform that unifies citizen access to civic utility services — electricity, gas, water, sanitation, and municipal services — through a single secure interface.

### Core Goals

| Goal | Target |
|---|---|
| Reduce counter staff workload | 60% via self-service automation |
| Average transaction time | Under 3 minutes (from 15 min) |
| Availability | 24/7 with offline fallback |
| Language coverage | 12 Indian languages |
| Kiosk scale target | 1000+ deployments nationwide |

### Current Status
- **Stage:** Working Prototype
- **Frontend:** React-based touch-optimized UI ✅
- **Backend:** Microservices with Node.js ✅
- **Payment:** Integrated in test mode ✅
- **Languages:** 5 live (Hindi, English, Gujarati, Marathi, Tamil) ✅
- **Auth:** OTP-based with session management ✅
- **DB:** PostgreSQL with sample civic data ✅

---

## 2. System Architecture

The system is organized into four primary layers:

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                      │
│   React.js (TypeScript) │ PWA │ Touch-Optimized UI      │
│   Material-UI │ i18next │ Chart.js │ Redux Toolkit       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / WebSocket
┌────────────────────────▼────────────────────────────────┐
│                  APPLICATION LAYER                       │
│         API Gateway (Kong / NGINX)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │Auth Svc  │ │Bill Svc  │ │Payment   │ │Notif. Svc │  │
│  │          │ │          │ │Svc       │ │           │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │User Svc  │ │Doc Mgmt  │ │Svc Req   │ │Analytics  │  │
│  │          │ │Svc       │ │Svc       │ │Svc        │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│        (Docker + Kubernetes | Istio Service Mesh)        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  INTEGRATION LAYER                       │
│   ESB Pattern │ RabbitMQ / Kafka │ ETL Pipelines         │
│   Aadhaar API │ DigiLocker │ Payment Gateways            │
│   SMS (Twilio/MSG91) │ Email (SendGrid) │ Maps API        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    DATA LAYER                            │
│   PostgreSQL (primary) │ Redis (cache/sessions)          │
│   MongoDB (docs/logs)  │ Elasticsearch (search/analytics)│
└─────────────────────────────────────────────────────────┘
```

### Deployment Model: Hybrid Cloud + Edge

```
         ┌─────────────────────────────────┐
         │         CLOUD (AWS/Azure/GCP)    │
         │  - Central DB cluster            │
         │  - Kubernetes microservices      │
         │  - Admin dashboards              │
         │  - Analytics & backups           │
         └──────────────┬──────────────────┘
                        │ VPN Tunnel
         ┌──────────────▼──────────────────┐
         │         KIOSK EDGE NODE          │
         │  - Lightweight Node.js service   │
         │  - Redis cache (bills, profiles) │
         │  - Local PostgreSQL replica      │
         │  - Service Worker (PWA offline)  │
         │  - Auto-sync on reconnect        │
         └─────────────────────────────────┘
```

---

## 3. Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React.js 18.x + TypeScript | UI framework |
| Material-UI / Chakra UI | Component library |
| Redux Toolkit | State management |
| React Router | Navigation |
| i18next | Internationalization (12 languages) |
| Workbox (PWA) | Offline caching via Service Workers |
| Chart.js | Consumption analytics graphs |
| React Hook Form + Yup/Joi | Form validation |
| Axios | API requests |

### Backend
| Tool | Purpose |
|---|---|
| Node.js 18.x LTS | Runtime |
| Express.js | HTTP framework |
| gRPC | Inter-service communication |
| JWT + Passport.js | Auth (OAuth2) |
| bcrypt | Password hashing |
| Winston | Logging |
| Jest + Supertest | Unit & API testing |

### Databases
| DB | Usage |
|---|---|
| PostgreSQL 14.x | Primary transactional data |
| Redis 7.x | Sessions, caching (70% DB load reduction) |
| MongoDB 6.x | Uploaded documents, audit logs |
| Elasticsearch | Search & analytics |

### DevOps & Infrastructure
| Tool | Purpose |
|---|---|
| Docker | Containerization |
| Kubernetes | Orchestration + auto-scaling |
| Istio | Service mesh (mTLS, circuit breaking) |
| Jenkins / GitLab CI | CI/CD pipelines |
| Prometheus + Grafana | Metrics & dashboards |
| ELK Stack | Centralized logging |
| Terraform | Infrastructure as Code |
| HashiCorp Vault | Secrets management |

### External APIs
| API | Purpose |
|---|---|
| Razorpay / Paytm | Payment gateway |
| UIDAI Aadhaar API | Identity verification (OTP) |
| DigiLocker API | Document verification |
| Twilio / MSG91 | SMS notifications |
| SendGrid / AWS SES | Email notifications |
| Google Maps API | Location services |

---

## 4. Repository Structure

```
nagarseva-kiosk/
├── frontend/                     # React PWA (Kiosk UI)
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/           # Button, Modal, Toast, etc.
│   │   │   ├── kiosk/            # Touch-specific components
│   │   │   └── accessibility/    # Screen reader, voice UI
│   │   ├── pages/                # Route-level pages
│   │   │   ├── Home/
│   │   │   ├── Electricity/
│   │   │   ├── Gas/
│   │   │   ├── Water/
│   │   │   ├── Municipal/
│   │   │   ├── Payment/
│   │   │   └── Admin/
│   │   ├── services/             # API client functions
│   │   ├── store/                # Redux slices
│   │   ├── i18n/                 # Language files (12 langs)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Helpers (offline, session)
│   │   └── workers/              # Service Workers (offline)
│   └── package.json
│
├── services/                     # Backend Microservices
│   ├── auth-service/
│   ├── billing-service/
│   ├── payment-service/
│   ├── user-service/
│   ├── document-service/
│   ├── notification-service/
│   ├── service-request-service/
│   └── analytics-service/
│
├── api-gateway/                  # Kong / NGINX config
├── infrastructure/               # Terraform, Kubernetes YAMLs
│   ├── k8s/
│   ├── terraform/
│   └── monitoring/               # Prometheus, Grafana configs
├── scripts/                      # DB migrations, seed scripts
└── docs/                         # Architecture diagrams, API specs
```

---

## 5. Frontend (Kiosk UI)

### Touch Interface Design Principles

The UI is purpose-built for public kiosk use — standing users, no mouse, potentially first-time digital users.

**Touch Targets:** All interactive elements are minimum 48×48dp (Material Design) / 44×44px (Apple HIG), with 8px spacing between targets to prevent mis-taps.

**Navigation Depth:** Maximum 3 levels deep. Every screen has a prominent **Home** and **Back** button. Breadcrumbs show current location.

**Session Management:**
- Idle timeout: 5 minutes (10 min in Senior Mode)
- Warning shown at 1 minute remaining (large "Continue" button)
- On timeout: full session data purge + return to welcome screen

**Visual Design:**
- WCAG 2.1 AA compliant (minimum 4.5:1 contrast ratio for body text)
- Primary actions in accent blue; secondary in neutral tones
- Portrait orientation for standard kiosk form factor (21–32 inch)
- No hover states — everything accessible via direct tap

**Progressive Disclosure:**
Complex flows (new connection, complaint) broken into step-by-step wizards. Progress bar shown throughout.

### Key Frontend Files to Build

```
src/pages/Home/
  WelcomeScreen.tsx         # Language selector, idle screen
  ServiceCategoryGrid.tsx   # Electricity, Gas, Water, Municipal tiles

src/pages/Auth/
  ConsumerIDInput.tsx       # Consumer ID / Aadhaar entry
  OTPVerification.tsx       # OTP input with resend + 3-attempt limit

src/pages/Dashboard/
  UserDashboard.tsx         # Bills, requests, consumption at a glance
  ConsumptionChart.tsx      # Chart.js visualization

src/pages/Payment/
  PaymentOptions.tsx        # UPI / Card / Net Banking
  PaymentStatus.tsx         # Success / failure + receipt

src/components/accessibility/
  VoiceNavigator.tsx        # Wake word, TTS, STT
  ScreenReaderWrapper.tsx   # ARIA label injector
  SeniorModeToggle.tsx      # Larger buttons, simplified nav
```

---

## 6. Backend Microservices

Each service runs in its own Docker container, communicates via REST (external) or gRPC (internal), and has its own database schema.

### Auth Service
- Validates consumer ID + mobile number
- Integrates with UIDAI Aadhaar OTP API
- Issues JWT (5-minute expiry) + refresh token
- Rate limiting: 3 failed attempts → 15-minute lockout
- Session stored in Redis with auto-expiry

### Billing Service
- Fetches current and historical bills from utility DB
- Returns bill summary, due date, consumption data
- Caches in Redis; direct PostgreSQL query on cache miss
- Supports electricity, gas, water bill types

### Payment Service
- Integrates with Razorpay / Paytm gateway
- Handles UPI, card, net banking flows
- Webhook listener for real-time payment status
- On success: triggers receipt generation + notification
- On failure: initiates refund, logs failure reason
- PCI-DSS compliant — no card data stored (tokenization only)

### Document Service
- Accepts uploads (PDF, JPG, PNG) via multipart form
- Virus scanning before storage
- Stores in AWS S3 / Azure Blob with AES-256 encryption
- Generates signed download URLs (time-limited)
- Adds watermarks with transaction timestamps on downloads

### Notification Service
- Multi-channel: SMS (Twilio/MSG91), Email (SendGrid), on-screen push
- Triggered via message queue (RabbitMQ)
- Templates per language per event type
- Retry logic with exponential backoff

### Service Request Service
- Handles: new connections, complaints, meter issues, outage reports
- Creates ticket with unique ID
- Queues requests locally when offline (IndexedDB → background sync)
- Status tracking via ticket ID

### Analytics Service
- Logs all transactions and user interactions
- Feeds Elasticsearch for real-time search
- Generates admin reports: peak hours, popular services, error rates
- Anonymizes PII before storing analytics data

### API Gateway (Kong / NGINX)
- Single entry point for all frontend requests
- Enforces: authentication, rate limiting (100 req/min/user), CORS
- Routes to appropriate microservice
- SSL termination at gateway level

---

## 7. Database Design

### PostgreSQL — Core Transactional Tables

```sql
-- Users / Consumers
CREATE TABLE consumers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id VARCHAR(20) UNIQUE NOT NULL,
  mobile VARCHAR(10) NOT NULL,
  aadhaar_hash VARCHAR(64),            -- hashed, never plain
  name VARCHAR(100),
  address TEXT,
  preferred_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bills
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID REFERENCES consumers(id),
  department VARCHAR(20) NOT NULL,      -- electricity, gas, water
  billing_period VARCHAR(7) NOT NULL,   -- e.g., 2025-12
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE,
  status VARCHAR(10) DEFAULT 'unpaid', -- unpaid, paid, overdue
  units_consumed NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id),
  consumer_id UUID REFERENCES consumers(id),
  amount NUMERIC(10,2) NOT NULL,
  gateway VARCHAR(20),                  -- razorpay, paytm
  gateway_txn_id VARCHAR(100),
  status VARCHAR(10),                   -- success, failed, refunded
  receipt_url TEXT,
  paid_at TIMESTAMP
);

-- Service Requests
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID REFERENCES consumers(id),
  department VARCHAR(20),
  request_type VARCHAR(50),             -- new_connection, complaint, etc.
  description TEXT,
  status VARCHAR(20) DEFAULT 'open',
  ticket_id VARCHAR(12) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Audit Logs (append-only)
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50),
  actor_id UUID,
  resource_type VARCHAR(50),
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Redis — Cached Data Structure
```
session:{jwt_token}           → user session data (TTL: 5 min)
bills:{consumer_id}           → last 3 months bills (TTL: 1 hour)
otp:{mobile}                  → OTP + attempt count (TTL: 10 min)
tariffs:{department}          → static tariff info (TTL: 24 hours)
```

### MongoDB — Document Storage
```json
// Collection: uploaded_documents
{
  "_id": "ObjectId",
  "consumer_id": "UUID",
  "document_type": "id_proof",
  "file_url": "s3://...",
  "uploaded_at": "ISODate",
  "virus_scan_status": "clean",
  "service_request_id": "UUID"
}
```

---

## 8. Integration Layer

### Message Queue (RabbitMQ / Kafka)

Asynchronous tasks are pushed to queues to decouple services:

```
Exchanges / Topics:
  payments.completed     → notification-service, billing-service
  service_request.created → notification-service, analytics-service
  document.uploaded      → virus-scan-worker, document-service
  session.expired        → cleanup-worker
```

### External System Integration

**Legacy Utility Billing Systems:**
- REST adapters wrapping SOAP/legacy APIs
- ETL pipelines sync data nightly (incremental)
- CDC (Change Data Capture) for real-time updates where supported

**Aadhaar (UIDAI):**
- OTP trigger: POST to UIDAI Auth API with consumer's Aadhaar number
- OTP verify: UIDAI returns encrypted XML response
- Never store Aadhaar number — hash it immediately (SHA-256)

**DigiLocker:**
- OAuth2 flow for document fetch
- Pull verified documents directly (reduces manual upload friction)

**Payment Gateway (Razorpay):**
```
Flow:
1. Frontend requests order_id from Payment Service
2. Payment Service calls Razorpay API → gets order_id
3. Frontend renders Razorpay checkout widget (UPI/Card/Net Banking)
4. On payment, Razorpay sends webhook to Payment Service
5. Payment Service verifies webhook signature (HMAC-SHA256)
6. Updates bill status, triggers receipt + SMS
```

---

## 9. Security Architecture

Security is layered across six levels (Defense in Depth).

### Layer Overview

| Layer | Mechanism |
|---|---|
| Physical | Tamper-proof enclosure, TPM 2.0, CCTV, USB disabled |
| Application | MFA (Aadhaar OTP + mobile), JWT (5-min expiry), RBAC |
| Data | AES-256 at rest, TLS 1.3 in transit, tokenized payments |
| Network | WAF, DDoS mitigation, IDS/IPS, VPN kiosk-to-cloud |
| Microservices | mTLS between services (Istio), circuit breakers |
| Monitoring | 24/7 SIEM, ML anomaly detection, 72-hr breach notification |

### Authentication Flow

```
User enters Consumer ID + Mobile
        │
        ▼
Auth Service → UIDAI API → OTP sent to mobile
        │
        ▼
User enters OTP (max 3 attempts)
        │
        ▼
JWT issued (5-min expiry) + Refresh token (Redis)
        │
        ▼
Frontend stores token in memory only (never localStorage)
        │
        ▼
On session idle (5 min): token invalidated, Redis entry deleted,
UI cleared, kiosk returns to welcome screen
```

### Input Validation
- All inputs validated server-side (Joi/Yup schemas)
- Parameterized queries — no raw SQL concatenation
- File uploads: type whitelist (PDF/JPG/PNG), size limit, virus scan
- Rate limiting: 100 req/min/user via API gateway

### Data Privacy (DPDP Act 2023)
- Zero data retention on kiosk post-session
- PII encrypted at field level in DB
- Analytics data anonymized before storage
- User consent captured before data collection
- Right to erasure endpoint implemented
- Data breach notification pipeline: auto-alert within 72 hours

### Threat Model (STRIDE)

| Threat | Mitigation |
|---|---|
| Spoofing | MFA, device fingerprinting, short JWT expiry |
| Tampering | Digital signatures on receipts, immutable audit logs |
| Repudiation | Comprehensive audit trail, SMS confirmations, blockchain-anchored receipts |
| Information Disclosure | E2E encryption, zero kiosk retention, RBAC |
| Denial of Service | Rate limiting, DDoS protection, offline mode, auto-scaling |
| Elevation of Privilege | Least privilege, separate admin network, MFA for admin |

---

## 10. Accessibility & Multilingual Support

### Supported Languages (12)
Hindi, English, Gujarati, Marathi, Tamil, Telugu, Kannada, Malayalam, Bengali, Punjabi, Odia, Assamese

### i18next Setup
```
src/i18n/
  locales/
    en/translation.json
    hi/translation.json
    gu/translation.json
    ... (12 total)
  i18n.ts          # i18next config, language detector
```

All UI text, error messages, date formats, and help content are fully translated. Language can be switched at any point in the session.

### Voice Interface
- Wake word: **"Hey NagarSeva"**
- Natural language commands in all 12 languages
- Example commands: `"मेरा बिल दिखाओ"`, `"Pay electricity bill"`, `"நீர் இணைப்பு"`
- On-device speech processing (no audio stored in cloud)
- Headphone jack for private listening

### Screen Reader Support
- Full ARIA labels on all elements
- Compatible with NVDA, JAWS, Android TalkBack
- Semantic HTML5 structure for logical tab order
- Live regions for dynamic content announcements

### Senior Mode
Toggle activates:
- Minimum button size: 60×60px
- Font: 24px body, 36px headings
- Max 2 navigation levels
- Extended session timeout (10 min)
- Step-by-step wizards for all tasks
- Video tutorial option on each screen

### WCAG 2.1 AA Compliance Checklist
- [x] Alt text for all non-text content
- [x] Color contrast ≥ 4.5:1 (body), 3:1 (large text)
- [x] No information conveyed by color alone
- [x] All functionality accessible via touch / keyboard fallback
- [x] No keyboard traps
- [x] No flashing content > 3Hz
- [x] Consistent navigation and labeling
- [x] Error identification with clear correction guidance
- [x] Valid HTML5 + proper ARIA landmarks

---

## 11. Deployment Architecture

### Cloud (Per 1000 Kiosks)

| Resource | Spec |
|---|---|
| Kubernetes nodes | 20 × (8 vCPU, 32GB RAM), auto-scaling |
| PostgreSQL cluster | 3 primary nodes + 5 read replicas |
| Redis cluster | 6 nodes |
| Load balancers | 2 redundant across availability zones |
| Object storage | 10TB (documents, receipts, backups) |
| CDN | Static assets with edge caching |
| Monitoring | Prometheus + Grafana + ELK (3-node each) |

**Target SLA:** 99.9% uptime via multi-region redundancy + auto-failover

### Per Kiosk Edge Node

| Component | Spec |
|---|---|
| Industrial PC | Intel i5 8th gen+, 16GB RAM, 256GB SSD |
| Display | 21–32 inch capacitive touchscreen, IP65 rated |
| Printer | Thermal, 3-year print head warranty |
| Scanner | QR/barcode + optional document scanner |
| Power | UPS (2-hour backup) |
| Connectivity | 10 Mbps broadband (primary) + 4G LTE (failover) |
| Enclosure | Reinforced steel, tamper sensors, anti-vandal |

### Network
- Primary: 10 Mbps dedicated broadband per kiosk
- Failover: 4G LTE, 50GB/month
- Total for 1000 kiosks: 10 Gbps with 20 Gbps burst
- All kiosk-to-cloud traffic over VPN tunnel

### CI/CD Pipeline
```
Code Push → GitLab CI triggers:
  1. Lint + unit tests (Jest)
  2. SAST scan (SonarQube / Snyk)
  3. Build Docker image
  4. DAST on staging environment
  5. Deploy to staging (Kubernetes)
  6. Integration + E2E tests
  7. Manual approval → Deploy to production
  8. Smoke tests on production
  9. Monitoring alerts configured
```

---

## 12. Offline Mode

When internet is unavailable, the kiosk shows a clear connectivity banner and switches to cached operations.

### Available Offline
- View last 3 months of bill history (Redis / IndexedDB cache)
- Submit service requests (queued in IndexedDB, auto-sync on reconnect)
- Access user profile and consumption data
- View static content (FAQs, helplines, tariffs, office locations)
- Print previously generated receipts from local cache

### Not Available Offline (clearly communicated to user)
- Real-time bill payments (requires payment gateway)
- OTP generation (requires SMS gateway)
- Real-time complaint status updates
- New connection applications

### Technical Implementation
```javascript
// Service Worker caching strategy (Workbox)
// Network-first for API calls, cache-first for static assets

// IndexedDB stores:
// - Queued transactions (service requests, form submissions)
// - Cached bill data (last 3 months per consumer)
// - User profile snapshot
// - Static content (tariffs, FAQs)

// Background Sync API
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncQueuedTransactions());
  }
});
```

**Conflict resolution:** Last-write-wins with timestamp comparison. After sync, user receives SMS confirmation for all synced actions.

---

## 13. Department Modules

### A. Electricity Department
- Bill payment (UPI / Card / Net Banking) with instant receipt
- Consumption analytics (daily / monthly / yearly charts)
- New connection application with document upload
- Outage reporting with real-time restoration updates
- Meter malfunction / reading discrepancy reporting
- Tariff calculator and energy-saving tips

### B. Gas Department
- PNG / LPG bill payment
- New domestic / commercial gas connection
- Cylinder booking with delivery slot selection and real-time tracking
- Gas leakage emergency response activation
- Safety inspection booking
- Monthly consumption trends

### C. Municipal Corporation — Water Services
- Water bill payment and consumption history
- New water connection application
- Water supply issue / leakage reporting
- Tanker water supply booking
- Water quality test results

### D. Municipal Corporation — Property Tax
- View and pay property tax (with penalty calculation)
- Download property tax receipts and certificates
- Apply for tax assessment revision
- Check tax exemption eligibility

### E. Municipal Corporation — Waste Management
- Report garbage collection issues (with photo upload)
- Request bulk waste pickup
- View area waste collection schedule
- Report illegal dumping (with GPS location)

### F. Municipal Corporation — Road & Infrastructure
- Report potholes with GPS + photo
- Report damaged streetlights
- Track complaint resolution status

### G. Licenses & Permits
- Trade license application and renewal
- Building plan approval
- NOC applications
- Track application status

### H. Birth & Death Certificates
- Apply for birth / death certificate
- Request corrections in existing certificates
- Download digital certificates with QR verification

### I. Traffic Challans
- View pending challans by vehicle number
- Pay traffic fines with e-receipt
- Contest challan with supporting documents

### J. Public Grievance
- Submit complaints across all departments
- Unique ticket ID with SMS/email tracking
- Feedback and rating on resolution
- Escalation to senior authorities for unresolved complaints

---

## 14. Admin Dashboard

Accessible to authorized administrators only (separate network, MFA required).

### Features
- Real-time kiosk status map across all locations
- Transaction volumes by service type and time period
- Hardware health metrics (printer paper, connectivity, CPU)
- User satisfaction ratings and feedback analysis
- Error rates and failure point identification
- Content management: announcements, alerts, tariff updates

### Analytics Insights
- Peak usage hours per kiosk location
- Most-used services by region
- Revenue collection patterns
- Citizen demographic trends (anonymized)
- Predictive maintenance alerts

---

## 15. Key Workflows (Step-by-Step)

### Bill Payment Workflow
```
1. Citizen approaches kiosk → Welcome screen with language selector
2. Select preferred language (12 options)
3. Select department (e.g., Electricity)
4. Enter Consumer ID + registered mobile number
5. OTP sent via SMS → Enter OTP (3 attempts allowed)
6. Dashboard loads: current bill, due date, consumption chart
7. Tap "Pay Bill"
8. Select payment method (UPI / Card / Net Banking)
9. UPI: QR code displayed for scan-and-pay
   Card: PCI-DSS compliant card entry widget
10. Payment gateway processes transaction
11. Webhook received → bill status updated to "paid"
12. Receipt PDF generated with QR verification code
13. SMS + email confirmation sent
14. Option to print receipt
15. Session ends: all data purged, kiosk returns to welcome screen
```

### New Connection Application Workflow
```
1. Authenticate (Consumer ID + OTP)
2. Select "New Connection" under relevant department
3. Step-by-step wizard:
   Step 1: Applicant details (name, address, property type)
   Step 2: Upload documents (ID proof, address proof, property papers)
          → via integrated scanner or mobile QR upload link
   Step 3: Review charges and timeline estimate
   Step 4: Pay application fee
4. System generates reference number
5. SMS confirmation with reference number and estimated timeline
6. Track status via "My Service Requests" using reference number
```

### Grievance Submission Workflow
```
1. Authenticate
2. Select "Submit Complaint"
3. Select department and complaint category
4. Describe issue via text input or voice
5. Attach photo / video if applicable
6. Review and confirm submission
7. Ticket ID generated and displayed on screen
8. SMS sent with ticket ID and tracking URL
9. Track status anytime with ticket ID (no login required)
```

---

## 16. Hardware Setup

### Kiosk Startup Sequence
On boot, the kiosk app performs:
1. Hardware diagnostics (printer, scanner, touchscreen calibration)
2. Network connectivity check (broadband → 4G fallback)
3. Sync cached data from cloud (if online)
4. Display idle/welcome screen with digital signage carousel

### Recommended Hardware Vendors
- **Display:** ELO, iiyama (IP65-rated industrial touch displays)
- **Industrial PC:** Advantech, Kontron
- **Thermal Printer:** Epson TM series, Star Micronics
- **Biometric Reader:** SecuGen, Mantra (optional)
- **Enclosure:** Custom fabrication with tamper-detection sensors

### Physical Security
- Reinforced steel cabinet with anti-vandal coating
- Tamper sensors → immediate cloud alert on breach
- USB ports disabled in BIOS
- Secure Boot enabled
- CCTV coverage at each kiosk location

---

## 17. Environment Variables & Config

### Frontend (.env)
```env
REACT_APP_API_BASE_URL=https://api.nagarseva.in/v1
REACT_APP_PAYMENT_GATEWAY=razorpay
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxx
REACT_APP_GOOGLE_MAPS_KEY=AIza...
REACT_APP_DEFAULT_LANGUAGE=hi
REACT_APP_SESSION_TIMEOUT_MS=300000       # 5 minutes
REACT_APP_SENIOR_SESSION_TIMEOUT_MS=600000 # 10 minutes
```

### Auth Service (.env)
```env
PORT=3001
JWT_SECRET=<from HashiCorp Vault>
JWT_EXPIRY=300                            # 5 minutes in seconds
REFRESH_TOKEN_EXPIRY=86400
REDIS_URL=redis://redis-cluster:6379
UIDAI_API_URL=https://auth.uidai.gov.in
UIDAI_AUA_CODE=<AUA code>
UIDAI_ASA_LICENSE_KEY=<license key>
MAX_OTP_ATTEMPTS=3
OTP_LOCKOUT_DURATION_MIN=15
```

### Payment Service (.env)
```env
PORT=3004
RAZORPAY_KEY_ID=<from vault>
RAZORPAY_KEY_SECRET=<from vault>
RAZORPAY_WEBHOOK_SECRET=<from vault>
DATABASE_URL=postgresql://...
NOTIFICATION_SERVICE_URL=http://notification-service:3005
```

---

## 18. Development Setup (Local)

### Prerequisites
- Node.js 18.x LTS
- Docker + Docker Compose
- PostgreSQL 14.x (or via Docker)
- Redis 7.x (or via Docker)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/[your-team]/nagarseva-kiosk.git
cd nagarseva-kiosk

# 2. Start infrastructure (DB, Redis, message queue)
docker-compose up -d postgres redis rabbitmq

# 3. Start backend services
cd services/auth-service && npm install && npm run dev &
cd services/billing-service && npm install && npm run dev &
cd services/payment-service && npm install && npm run dev &
# ... repeat for other services

# 4. Start API Gateway (NGINX dev config)
docker-compose up -d api-gateway

# 5. Start frontend
cd frontend && npm install && npm start
```

### Docker Compose (Local Dev)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: nagarseva
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"    # Management UI
```

---

## 19. Testing Strategy

### Unit Tests (Jest)
- Each microservice has Jest tests for service logic
- Test coverage target: 80%+

### API Tests (Supertest)
- All REST endpoints tested with valid + invalid inputs
- Authentication flow end-to-end
- Payment webhook signature verification

### Frontend Tests (React Testing Library)
- Component rendering
- User interaction flows (touch simulation)
- Language switching
- Offline mode behavior

### Security Testing
- Quarterly penetration testing by CERT-empanelled firm
- Weekly automated vulnerability scans (Snyk / OWASP ZAP)
- OWASP Top 10 coverage verified
- DAST on staging environment before each major release

### Performance Testing
- Load testing with k6 (simulate 1000 concurrent kiosk sessions)
- Stress testing payment gateway integration
- Offline sync performance under low bandwidth

---

## 20. Compliance & Standards

| Standard | Status |
|---|---|
| WCAG 2.1 Level AA | Compliant |
| GIGW (Govt of India Guidelines for Indian Govt Websites) | Compliant |
| DPDP Act 2023 | Compliant (zero retention, consent, right to erasure) |
| IT Act 2000 | Compliant |
| CERT-In Security Guidelines | Compliant |
| PCI-DSS (Payment) | Compliant (tokenization, no card storage) |
| Data Localization | All citizen data stored within India |

---

## 21. Future Roadmap

### Phase 2 (6–12 months post-launch)
- **AI Chatbot:** GPT-powered natural language queries ("What's my bill due date?")
- **Computer Vision:** Automatic document verification on upload
- **Mobile Companion App:** Pre-authenticate, book kiosk slot, continue transactions
- **Video KYC:** Remote verification for new connections (no office visit)

### Phase 3 (12–24 months)
- **IoT Integration:** Direct smart meter connectivity → real-time consumption, auto meter reading
- **Blockchain Certificates:** Tamper-proof birth/death certificates, land records
- **AR Assistance:** Augmented reality overlays for meter reading help, appliance troubleshooting
- **Predictive Analytics:** ML models for demand forecasting, anomaly detection (pipe leaks, meter fraud)

### Expanded Service Portfolio
- Vehicle registration renewals
- Property mutation
- Scholarship applications
- Ration card services
- Electoral services

---

*NagarSeva KIOSK — Transforming Civic Service Delivery*
*Team CoralX | SVNIT Surat | SUVIDHA 2026*