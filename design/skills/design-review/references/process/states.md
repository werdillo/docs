# Screen and control states

How every screen and interactive control behaves across all of its states, not
only when data is loaded and valid. The happy path is one of nine states; the
other eight are where trust is built or lost.

## In one minute

- **Design all nine states up front** — default, loading, empty, error,
  no-access, optimistic/pending, dirty/unsaved, stale/conflict, and undoable
  success.
- **Loading follows three time thresholds**: under `100 ms` show nothing,
  `100–300 ms` keep the previous view or show a subtle indicator, past `300 ms`
  show a skeleton matching the final layout.
- **Empty states split in two**: *first-time empty* invites creation;
  *filtered-empty* offers a one-click filter reset.
- **Errors sit beside what failed**, never in a generic popup detached from the
  input.
- **Reversible writes undo; irreversible writes confirm.**

## The nine states

| State | When it appears | What the screen shows |
|---|---|---|
| **1. Default** | Data is loaded and valid. | The canonical screen shape ([patterns](../patterns/README.md)), with one clear focal point. |
| **2. Loading** | Waiting on a read past `300 ms` (orienting signal). | A skeleton matching the final geometry — same row heights, reserved media aspect ratio, zero layout shift. |
| **3. Empty** | Zero items exist, or zero items match active filters. | **First-time:** one sentence stating what lives here + the single primary action. **Filtered:** what matched nothing + *Clear filters*. |
| **4. Error** | A read failed, a rule refused a write, or a field is invalid. | **Field error:** directly below the field. **Action refusal:** inline banner near the action. **Full read failure:** message + *Try again* (preserving context). |
| **5. No access / unavailable** | Role lacks a grant, or an item's lifecycle forbids the action. | Actions a role never holds are omitted. Actions temporarily forbidden by state are omitted or disabled with a short reason right beside them. |
| **6. Pending / optimistic** | A write is in flight. | Low-risk writes (toggle, status, rename) update immediately and roll back with an error message on refusal. High-risk commits (*Place order*, *Pay*) disable the trigger and show a pending label (`Placing order…`). |
| **7. Dirty / unsaved** | Editable fields have unsubmitted changes. | An explicit visible indicator (*Unsaved changes*), never a silently disabled save button that hides why nothing saves. Navigating away warns before dropping work; drafts auto-save where appropriate. |
| **8. Stale / conflict** | What the screen relies on changed meanwhile (*What if* row). | Name what changed (`Stock dropped to 0`, `Price updated to £24`) and offer the direct resolution (*Remove line*, *Reload record*), never a blind overwrite. |
| **9. Undoable success** | A reversible action finished (archive, withdraw, move). | Immediate visual update + a quiet corner toast offering *Undo* for `5–8 seconds` (orienting signal). |

## Loading timing thresholds

These numbers are orienting signals from human perception:

- **`0–100 ms` — instant.** Show no spinner and no skeleton; flashing a loader
  for `40 ms` makes a fast app feel slower.
- **`100–300 ms` — keep the previous screen.** Hold the current screen while
  the next prepares so the viewport never flashes blank.
- **`300 ms–10 s` — skeleton or determinate progress.** Draw a skeleton of the
  exact shape that will arrive; use a determinate bar when progress is known
  (file uploads, batch imports).
- **Past `10 s` — explain and let them leave.** Say what is still running and
  offer cancel or background continuation.

## Real-time and offline screens

Screens that display a live queue or live order status (such as a staff order
panel or a guest tracking link) handle three connection states explicitly:

- **Live** — connected and receiving updates without manual reload; quiet
  resting state (no flashing green pulse unless the operator actively monitors
  connectivity).
- **Reconnecting / offline** — connection lost: show a persistent inline
  `warn` banner (*"Connection lost — reconnecting…"*) and freeze destructive
  triggers that require fresh state rather than failing silently.
- **Resynced** — once reconnected, fetch the full current state from the server
  (never assume missed events arrived) and clear the banner cleanly.

## Control-level states

Every interactive component in [`system/components/`](../system/components/README.md)
specifies all six control states:

1. **Default** — resting appearance.
2. **Hover** — subtle surface step (`--surface-hover`), pointer feedback only.
3. **Focus** — visible `:focus-visible` ring (`--focus-ring`), never removed.
4. **Pressed / active** — immediate tactile step while held.
5. **Disabled** — muted appearance (`--meta`), non-interactive, never the only
   explanation for a blocked form.
6. **Error / loading** — danger border + inline text for invalid inputs; busy
   label (`aria-busy="true"`) preserving button width so layout never jumps.

## Example: Small shop cart

On `shop/carts` (`record` shape):

- **First-time empty:** *"Your cart is empty."* + primary button *Browse catalogue*.
- **Stale stock (R1):** the affected line shows a `--danger` badge *Sold out*
  and *Remove*; *Place order* explains *"Remove unavailable items to place your
  order"*.
- **Pending submit (R3):** clicking *Place order* locks the button to *Placing
  order…* with the same width, preventing double orders.

## Not this

- A full-page spinner replacing the entire layout on every minor filter change —
  that destroys orientation and causes layout jump.
- One generic *"Something went wrong"* toast when a specific field or business
  rule failed — map the server refusal to the exact field or line.
- Showing a *First-time empty* message (*"No orders yet — create one"*) when
  the user merely filtered by a date range with zero matches.
- Disabling a *Save* button with no explanation when one required field out of
  sight is empty — validate on submit and scroll focus to the first error.
