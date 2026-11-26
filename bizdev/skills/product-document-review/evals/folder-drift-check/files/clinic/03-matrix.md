# 3. Matrix

## 10. Domains and boxes

### 10.1 Domains
- `scheduling` — dentist calendars and open slots.
- `visits` — appointments and their lifecycle.
- `notifications` — SMS messages sent to patients.

### 10.2 Boxes
| Box | Domain | Purpose | Keeps | Reads | Writes |
|---|---|---|---|---|---|
| `slots` | `scheduling` | Manages dentist availability and slot reservation | `slot` | — | `slot` |
| `appointments` | `visits` | Keeps appointments and enforces visit states | `appointment` | `slots` | `appointment` |
| `sms` | `notifications` | Dispatches appointment confirmation and cancellation SMS | `sms_delivery` | — | `sms_delivery` |

## 11. Processes and lifecycles

### 11.1 Processes
- **`request-appointment`** (carries S1): `slots` (reserve) → `appointments` (create `requested`). All-or-nothing: yes — if creating the appointment fails, release the slot.
- **`confirm-appointment`** (carries S2): `appointments` (set `confirmed`) → `sms` (send confirmation). All-or-nothing: no — appointment stays `confirmed` if SMS fails; delivery retries asynchronously.
- **`cancel-appointment`** (carries S3): `appointments` (set `cancelled`) → `slots` (release) → `sms` (send cancellation). All-or-nothing: appointment + slot release are atomic; SMS retries asynchronously.

### 11.2 Lifecycles
- **Appointment:** `requested` → `confirmed` → `completed` (final); `requested` | `confirmed` → `cancelled` (final).
- **Slot:** `open` ↔ `reserved`.

### 11.3 Roles to actions
| Role | Actions |
|---|---|
| Patient | S1, S2 (view status), S3 |
| Receptionist | S2 (confirm), S3, S4 |

## 12. Checks on paper
- **12.1 Ownership:** `slot` kept by `slots`; `appointment` kept by `appointments`; `sms_delivery` kept by `sms`.
- **12.2 Grid:** no cycles (`appointments` reads `slots`; cross-box writes go through processes).
- **12.3 Rules:** R1 kept by `slots` + `request-appointment`; R2 kept by `appointments`.
- **12.4 Lifecycles:** every appointment state is reached and leads to final `completed` or `cancelled`.
- **12.5 Findings from first pass:** none yet.
