# Room booking

| | |
|---|---|
| **Status** | Discovery |
| **Owner** | Operations lead |
| **Updated** | 2026-11-12 |

## Stage 2 — Discovery

### 3. The people

| Role | Who they are | What they come for | How often |
|---|---|---|---|
| Member | Someone with a coworking membership | To book a meeting room | Weekly |
| Front desk | Staff at reception | To check members in | Daily |

### 4. Value and success

| Outcome | Measured by | Target | By when |
|---|---|---|---|
| Rooms are used | Booked hours / open hours | 60% | Q2 2027 |

**We stop or rethink if:** use stays under 30% after three months.

### 5. Scope

| In the first version | Later | Not this product |
|---|---|---|
| Booking a room by the hour | Recurring bookings | Desk booking |
| Paying for hours over the membership allowance | Invoices | Catering |
| Checking in at the front desk | | Visitor badges |

### 6. Words

| Word | Means | Does not mean |
|---|---|---|
| Booking | A room held for a member for a time | A visit to the building |

### 7. Scenarios

#### S1. Book a room
- **Who:** Member
- **Starts when:** the member picks a room and a time.
- **Steps:** 1. The room's free time is checked. 2. The booking is made. 3. If the hours go over the allowance, the member pays.
- **Ends with:** a confirmed booking.
- **Must not:** book a room twice for the same time; confirm a booking that needed payment and was not paid.
- **What if:**

  | Case | Then |
  |---|---|
  | two members book the same time at once | One gets it; the other is told it is taken. |
  | the payment fails | The booking is not made. |

#### S2. Check in
- **Who:** Front desk
- **Starts when:** a member arrives for a booking.
- **Steps:** 1. Find the booking. 2. Mark it checked in.
- **Ends with:** the booking is checked in.

### 8. Rules

| Rule | Must always be true | Kept by |
|---|---|---|
| R1 | A room has at most one booking at a time. | |
| R2 | A booking over the allowance is confirmed only once paid. | |

## Stage 3 — Matrix

### 9. The matrix

#### 9.1 Domains

| Domain | The subject, in one sentence |
|---|---|
| `spaces` | Renting rooms to members. |

#### 9.2 Boxes

**Domain `spaces`**

| Box | What it is for | What it keeps | What it lets others read |
|---|---|---|---|
| `rooms` | The rooms and their bookings. | Rooms, bookings | A room, its bookings |
| `bookings` | Who holds which room when. | Bookings | A booking |
| `allowances` | How many hours a member has left. | Allowances | Hours left |
| `payments` | Paying for extra hours. | Payments | A payment |

#### 9.4 Processes

| Process | Scenario | The line — boxes, in order | All or nothing? | Afterwards |
|---|---|---|---|---|
| `book-room` | S1 | `rooms` → `bookings` → `allowances` | | |

#### 9.5 The grid

| may reach → | `shared` | `rooms` | `bookings` | `allowances` | `payments` |
|---|---|---|---|---|---|
| **processes** | yes | door | door | door | |
| **`rooms`** | yes | | door | | |
| **`bookings`** | yes | door | | | |
| **`allowances`** | yes | | | | |
| **`payments`** | yes | | changes the booking to confirmed | | |

### 10. Lifecycles

**Booking** — kept by `bookings`

| From | To | By | Final? |
|---|---|---|---|
| — | pending | S1 | |
| pending | confirmed | S1 | |
| confirmed | checked in | S2 | |
