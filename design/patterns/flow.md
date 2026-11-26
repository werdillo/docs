# Flow

How a multi-step process spanning boxes — checkout, onboarding or a batch import
wizard — guides a person from start to an irreversible commit without losing
data or executing twice.

## In one minute

- **Focused chrome, visible steps**: strip distracting navigation and show a
  step indicator of `3–5` steps (orienting signal; fewer is a `form`, more needs
  grouping).
- **Back never loses data**: moving backward preserves every entered field and
  lets users jump back from the review step.
- **Review summary before an irreversible commit**: display every line, price,
  consequence and policy right next to the final action.
- **Idempotent commit button (hard rule)**: lock the trigger immediately to a
  pending label (*Placing order…*) at the same width so double-clicks never
  double-write.
- **Concrete completion and honest failure recovery**: confirm exact business
  state with a durable reference, and fix mid-flow conflicts in place without
  wiping earlier inputs.

## Anatomy and layout

```text
+------------------------------------------------------------------------+
| Small shop                                      [ Return to cart ]     |  <- Minimal header
+------------------------------------------------------------------------+
|  (1) Contact & delivery   --->   [2] Review & place   --->  (3) Done   |  <- Step indicator (3-5)
+------------------------------------------------------------------------+
|                                         |                              |
|  Review your order                      |  Order summary               |
|                                         |  --------------------------- |
|  Delivery  [Edit]                       |  Speckled mug    x2   £48.00 |
|  Hannah Cole · hannah@mail.test         |  Pouring jug     x1   £38.00 |
|  14 Elm Street, Bristol, BS1 4AB        |  --------------------------- |
|                                         |  Total                £86.00 |
|  Payment method                         |                              |
|  Paid by bank transfer after placing.   |  Transfer details are shown  |  <- Trust & policy
|  Unpaid orders cancel after 3 days.     |  on the next screen and      |     next to commit
|                                         |  sent by email.              |
|  -------------------------------------  |                              |
|  [ Back ]             [ Place order ]   |                              |  <- Verb+object CTA
+------------------------------------------------------------------------+
      Step body (520-640 px)                  Summary rail (300-360 px)
```

- **Focused header.** Replace the full site header or admin sidebar with the
  brand mark and one quiet exit link (*Return to cart*) so attention stays on
  the sequence without trapping the user.
- **Visible step indicator.** Shows completed steps, the current step, and
  remaining steps in plain words (`1. Contact & delivery · 2. Review & place ·
  3. Order placed`). **`3–5` steps is an orienting signal**: `1–2` steps belong
  on a single [`form`](./form.md) page; `6+` steps signal that related fields
  need grouping or redundant steps can be dropped.
- **Single-column step body with optional summary rail.** Keep the active step
  body at `520–640 px` max width (orienting signal) following single-column
  [`form`](./form.md#anatomy-and-layout) rules. On desktop (`>= 960 px`), a
  read-only summary rail (`300–360 px` — orienting signal) may sit beside it;
  below `960 px`, the summary collapses into an expandable bar at the top of the
  step.
- **Consistent footer progression.** Quiet *Back* on the left, one verb+object
  primary button (`--accent`) on the right naming the exact step transition
  (*Continue to review*, then *Place order* on the final commit).

## Navigation, back and review

- **Back never loses entered data.** Pressing either the flow's *Back* button or
  the browser's Back button restores every value already entered on previous
  steps. Completed steps in the step indicator act as direct links back to edit.
- **Validate each step before advancing.** Stepping forward runs that step's
  validation (on blur and on *Continue*, matching
  [form validation](./form.md#validation-and-error-handling)) so errors are
  fixed while the fields are still in front of the user.
- **Review summary before an irreversible commit.** Whenever the process writes
  atomically across boxes (deducting stock, writing an order, charging a card,
  importing a file), the penultimate step lists every item, total, delivery
  address and policy beside the commit button, with inline *Edit* links to prior
  steps.
- **Trust signals beside the commit.** Payment terms, dispatch expectations and
  cancellation rules sit directly next to the commit trigger
  ([public language](../languages/public.md#storefronts-and-content-grids)).

## Idempotent commit and failure recovery

- **Idempotent submit button (hard limit).** On click, the commit trigger
  immediately disables itself, preserves its exact rendered width, sets
  `aria-busy="true"`, and updates its label to present participle (*Placing
  order…*). The client sends a stable idempotency key so a double-click or
  network retry never creates two orders (matching `bizdev` *What if: pressed
  twice*, R3).
- **Concrete completion screen.** The final step states exactly what succeeded in
  the product document's words (for Small shop: *"Order placed"*, never
  *"Payment complete"* — [copy](../process/copy.md#business-words-are-law)),
  shows the durable reference (`Order #1042`), prints every next instruction on
  screen (bank transfer details and 3-day payment window), and provides one
  clear exit action (*Browse catalogue*). Navigating Back from completion never
  re-submits the commit.
- **All-or-nothing mid-flow conflict recovery.** If a business rule refuses the
  commit (such as the last item selling out or being withdrawn while the user
  typed their address — R1, R4), the process rolls back cleanly on the server,
  keeps the user on the review step with all entered contact details preserved,
  flags the exact offending line with a `--danger` badge and three-part error
  message, and offers the direct resolution (*Remove stoneware mug*).
- **Non-blocking aftermath failure.** When the core atomic commit succeeds but
  an *Afterwards* step fails (for example, sending the confirmation email — S3
  *What if*), still land on the completion screen with the reference and full
  instructions visible on screen while the server retries the notification.

## Required states

Every flow implements all relevant states from
[`process/states.md`](../process/states.md#the-nine-states):

- **Loading between steps.** Under `100 ms` transition directly; `100–300 ms`
  hold the current step; past `300 ms` draw a skeleton matching the next step's
  layout.
- **Step validation error.** Inline field errors + top error summary, focus moved
  to the first invalid input.
- **Pending commit.** Disabled idempotent trigger with pending text, no layout
  jump; if the commit takes past `10 s` (orienting signal), display reassurance
  that the request is still checking without inviting a second submission.
- **Stale / conflict.** Inline `--danger` resolution right on the affected line
  while keeping the rest of the flow intact.
- **Empty or already-completed source.** Visiting a checkout flow URL with an
  empty cart redirects cleanly to the cart empty state; revisiting an
  already-placed cart displays the completed order reference instead of a
  generic error (R3).

## Example: Small shop

**Shop site — `place-order` (`flow`, S3)** spans `carts → products → stock →
orders → carts` atomically ([matrix](../../bizdev/product-document/example/03-matrix.md#104-processes)):

1. **Step 1 — Contact & delivery.** Name, email and delivery address in one
   `560 px` column; no forced account creation (shoppers have no accounts per
   [scope](../../bizdev/product-document/example/01-context.md#4-scope)).
   Primary button: *Continue to review*.
2. **Step 2 — Review & place.** Shows delivery details (*Edit*), every cart line
   with live current price (R2), total (`tabular-nums`), and *"Paid by bank
   transfer after placing. Unpaid orders are cancelled after 3 days."* Primary
   button: *Place order* (locks to *Placing order…* on click, R3).
   - *Sold out concurrently (R1)* or *withdrawn meanwhile (R4)*: Step 2 stays
     open, contact details remain intact, the affected line shows a `--danger`
     badge (*Sold out* / *Withdrawn*) and *Remove*, and *Place order* explains
     which line to remove.
3. **Step 3 — Order placed.** Displays *"Order #1042 placed"*, exact bank
   transfer account details and reference `#1042`, *"We have emailed these
   details to hannah@mail.test"* (or shows the details cleanly even if the email
   retries in the background), and *Browse catalogue*.

## Not this

- Forcing a `7`-step wizard when `3` grouped steps capture the same fields —
  past `5` steps abandonment climbs; group related inputs.
- Wiping the user's delivery address when they click *Back* or when one cart
  line sells out — preserve every valid input across back-navigation and
  conflicts.
- Allowing *Place order* to be clicked twice while the request is in flight —
  lock immediately to *Placing order…* with an idempotency key (R3).
- Saying *"Payment complete!"* on the completion screen when the order was only
  *placed* pending bank transfer — use the product document's exact lifecycle
  word.
- Trapping the user with no way back to their cart or catalogue — keep one quiet
  exit link in the minimal header.
