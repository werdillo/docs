# From matrix to screens

How the matrix in [`bizdev/product-document/`](../../bizdev/product-document/README.md)
turns into navigation, screens and interactions. Design does not invent a
second structure beside the business's; it draws the same domains, boxes and
processes ([mapping](../../shared/mapping.md)).

## In one minute

- **Domains become top-level navigation** — ordered by daily use in the
  composition root.
- **Boxes become screen sets** — one canonical shape per screen
  ([patterns](../patterns/README.md)), never a screen with no box or process.
- **Processes become flows or read views** — a write across boxes is a `flow`;
  a read across boxes is a `list` or `canvas`.
- **Lifecycles become status badges and transitions** — every non-final state
  exposes its allowed moves, and no other moves.
- **Rules (`R1`, `R2`…) and *What if* rows become inline guards and messages**
  — every rule a person can break has a visible state on the screen where they
  could break it.

## The mapping, piece by piece

| In the product document | On the screens |
|---|---|
| **Domain** (`03-matrix.md` 10.1) | A top-level section of the navigation. |
| **Box** (`03-matrix.md` 10.2) | The screens of one subject (`list`, `record`, `form`, `settings`). A box people never see has no screen. |
| **Owner** (`shared/words.md`) | The one place a piece of data is edited. Another screen shows it read-only or links to its owner. |
| **Write process** (`03-matrix.md` 10.4) | A `flow` (or an explicit action button with its own confirmation/pending state) that spans boxes atomically. |
| **Read process** (`03-matrix.md` 10.4) | A `list` or `canvas` combining read-only data from several boxes (for example a catalogue or dashboard). |
| **Lifecycle** (`03-matrix.md` 11) | The status badge, the filter tabs, and the exact action buttons allowed from the current state. |
| **Role and access** (`02-behaviour.md` 6 & `03-matrix.md` 12.3) | Which screens exist in that deliverable and which actions are visible (never shown as broken buttons). |
| **Rule** (`02-behaviour.md` 9) | Inline validation, disabled/refused state, or explanatory message at the point of action. |
| ***What if* row** (`02-behaviour.md` 8) | Concrete edge states: double-click idempotency, stale-data refresh, conflict recovery, offline retry ([states](./states.md)). |
| **Business word** (`02-behaviour.md` 7) | The exact word used in headings, labels, statuses and error messages ([copy](./copy.md)). |

## Worked example: Small shop

Taking Small shop's [launch deliverables](../../bizdev/product-document/example/04-launch.md),
[design spec](../../bizdev/product-document/example/05-design.md) and
[matrix](../../bizdev/product-document/example/03-matrix.md):

1. **Two deliverables, two design languages, one shared token contract.** The
   *Shop site* is a public storefront ([public language](../languages/public.md));
   the *Admin* is a dense daily tool ([internal language](../languages/internal.md)).
   Both pull the same Tier 1 and Tier 2 tokens plus status enums from the
   `shared` deliverable ([sharing tokens](../system/tokens.md#sharing-tokens-across-deliverables-shared)),
   switching only Tier 3 density (`data-density="public"` on the site) while
   keeping the exact same business words (`order`, `in stock`, `withdrawn`).
2. **Lifecycles drive the order record.** An order has states `placed → paid`
   and `placed → cancelled` (both final). So on the Admin's `shop/orders`
   record, *Confirm payment* and *Cancel order* appear only while the order is
   `placed`; on a `paid` or `cancelled` order both actions disappear instead of
   failing on click.
3. **Rules drive line-level states.** Rule R1 (*stock never below zero*) and R4
   (*no withdrawn product in a new order*) land directly on the cart screen: a
   line whose product sold out or was withdrawn shows an inline danger badge
   and a *Remove* action, blocking *Place order* until resolved.
4. **A *What if* drives button behaviour.** S3's *"it is pressed twice"* (R3)
   means *Place order* enters a pending state immediately on click and refuses
   duplicate submission while the request is in flight.

## Specification before code

Before a screen is coded — whether by a person or an agent — four things are
written down in one short specification:

1. **Source box or process** and **role** (from `03-matrix.md` and `05-design.md`).
2. **Design language** (`internal` or `public`) and **screen shape**
   (`list`, `record`, `form`, `settings`, `canvas`, `flow`).
3. **States covered** — default, loading, empty, error, and every rule or
   *What if* state that lands on this screen ([states](./states.md)).
4. **Components and variants** from the kit — no raw colours, no unnamed sizes
   ([tokens](../system/tokens.md)).

## Not this

- Designing a screen that belongs to no box or process in the matrix — that is
  a missing product decision, fixed in `bizdev/` first.
- Editing the same data on three screens owned by different boxes — every piece
  of data has one owner.
- Drawing only the happy path and leaving loading, empty and refusal states to
  "implementation" — those states are half the product's behaviour.
- Copying raw database table columns onto a screen — screens speak the words of
  section 7 (`02-behaviour.md`), not column names.
