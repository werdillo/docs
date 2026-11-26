# 2. Behaviour

## 6. Words
- **Slot:** a 30-minute bookable time window for one dentist on one date.
- **Appointment:** a booked visit linking one patient to one slot.

## 7. Roles
- **Patient:** browses open slots, requests an appointment, cancels own appointment.
- **Receptionist:** confirms, reschedules or cancels appointments and manages dentist schedules.

## 8. Scenarios

### S1. Patient requests an appointment
- **Role:** Patient
- **Trigger:** patient selects an available slot and enters contact details.
- **Steps:**
  1. The client sends `POST /api/visits` with a `JWT` session token.
  2. The system checks the slot is still open in `PostgreSQL`, locks it, and creates an appointment in `requested` state.
- **Result:** appointment exists in `requested` state and the slot is no longer offered to other patients.
- **Must not:** two patients book the same slot.
- **What if:**
  - *Two people at once:* second request is rejected with a clear prompt to pick another slot.
  - *Done twice:* duplicate submission with the same idempotency key returns the existing appointment.

### S2. Confirm appointment and track status
- **Role:** Receptionist and Patient
- **Trigger:** receptionist opens a `requested` appointment on the desk queue.
- **Steps:**
  1. Receptionist clicks confirm; the appointment moves to `confirmed`.
  2. The system sends an SMS confirmation and the patient opens their link to see the `confirmed` status and clinic address.
- **Result:** appointment is `confirmed` and patient sees the updated status.
- **Must not:** confirm an already cancelled appointment.
- **What if:**
  - *External SMS fails:* appointment stays `confirmed`; retry SMS up to 3 times and flag for receptionist if all fail.

### S3. Cancel an appointment
- **Role:** Patient (or Receptionist on patient's behalf)
- **Trigger:** actor cancels a `requested` or `confirmed` appointment.
- **Steps:**
  1. Appointment moves to `cancelled`.
  2. Slot becomes open again if the visit has not started.
- **Result:** appointment is `cancelled` and slot is released.
- **Must not:** cancel a `completed` appointment.

### S4. Mark visit completed
- **Role:** Receptionist
- **Trigger:** patient finishes the dental visit.
- **Steps:**
  1. Receptionist marks the `confirmed` appointment as `completed`.
- **Result:** appointment is in final state `completed`.

## 9. Rules
- **R1:** A slot belongs to at most one active (`requested` or `confirmed`) appointment at a time.
- **R2:** Only `requested` or `confirmed` appointments can be cancelled.
