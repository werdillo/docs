# Gates

**The rule.** The owner decides access, every read is scoped, absence and denial
look the same, and every public write is limited
([fail closed](../architecture/access.md#fail-closed); [the principles](../rules.md),
rule 5). The audit reads the composed route table, so it proves the routes the
app actually serves — not the ones a file says it has.

## Every route behind a gate

- **A gate is marked.** The middleware that decides access marks itself, so the
  audit tells it from ordinary middleware; CORS and the error handler are
  catch-all entries that are not gates.
- **A gate covers by pattern.** A gate registered at a wildcard covers every path
  below its prefix, and a gate at a mount root covers the root itself, not only
  its children — the audit pins the router's own matching rather than assuming
  it.
- **An exempt path carries a reason.** The exempt list holds the paths that
  answer without a gate — a health check, a sign-in, a webhook whose signature
  is the gate, a capability link whose token is the credential. Each has its
  reason beside it; everything else is expected behind a gate.
- **A public write is limited.** The throttle audit fails an anonymous write, a
  capability link or a credential route with no rate limit; the exempt list
  names the ones that do not need one, with a reason.

## A public write with no account

A visitor may write without an account (a review, a comment), and such a write
is the one public write that carries its own contact. The gate accepts a session
or a guest body, and the write then:

- **carries a name and an address**, and is limited per caller and per address;
- **refuses a filled honeypot** outright;
- **is held for moderation**: it is pending, shown to no one and counted in no
  rating until staff approve it.

The address stays on the row, so the personal-data registry finds the writer by
it. The names of the gate and the write are in the API's convention
([api](../../conventions/api.md)).

## A gate belongs to the router that is mounted

The mount audit holds the rule that a gate belongs to the router that is
mounted, not to the prefix it happens to sit under
([fail closed](../architecture/access.md#fail-closed)): a router mounted outside its gated
parent carries its own gate.

`mount(app, path, router)` calls the framework's route mount and records the
pair. The mount audit then runs the same route audit over each router's **own**
table, reading app-level exempt paths from inside the mount (`/auth/login` at
`/auth` is `/login`):

```ts
export function auditMounts(mounts: readonly MountedRouter[]): UngatedMount[] {
  return mounts
    .map(({ path, router }) => ({
      path,
      ungated: auditRoutes(
        router,
        UNGATED.map((exempt) => under(path, exempt)).filter((exempt): exempt is string => exempt !== null),
      ),
    }))
    .filter((mount) => mount.ungated.length > 0);
}
```

Why a second audit: the flat one proves a route is covered **somewhere**. A
route can be covered by a gate on a different router mounted at the same prefix,
and that cover disappears when either moves. The mount audit proves the router
itself is fully gated, so moving it cannot leave a route behind.

Failure:

```
Routers that would lose their gate if mounted elsewhere:
  /things
    GET /thing
```

## A route a browser is sent to

A browser's redirect carries neither the project header nor a host the API
knows, so a route a browser is sent to is mounted at the API root and finds its
project another way. A sign-in with a third party is the case:

- **The start and the callback are mounted at the root**, beside the payment
  webhook.
- **The project comes from the signed state** on the callback, and on the start
  from the return address's host, which must be one of the project's own sites.
- **Each is listed in the access-audit exceptions** with its reason. The
  callback is also in the throttle list, since it creates an account.

The project's own instance of this is in the API's convention
([api](../../conventions/api.md)).

## The route failure

`Ungated routes:`, then one `METHOD /path` per line; the message says to mount
the router behind a gate or add the path to the exempt list with a reason. The
throttle audit names the route and why it expected a limit — `public write`,
`capability token`, `credential`.

## The audit pins itself

- a route no gate covers is reported, on a table small enough to read;
- an ordinary middleware is not mistaken for a gate;
- a mount-path gate covers the collection root, not only its children;
- the throttle audit sees the limits that exist, so it cannot pass on an empty
  table;
- the section a gate enforces is pinned for the routes where it is not the
  path's echo.

## What it cannot see

- **A hand-written gate with no marker.** It reads as ungated; the fix is to
  mark the middleware, not to exempt the route.
- **A route registered directly on the app.** The flat audit sees it; the mount
  audit does not, because it reads the routers the mount recorded.
- **A limit applied inside a handler.** The audit reads the middleware table; a
  limit written in a handler is invisible.
- **The whole section map.** Only the routes where the section is not the path's
  echo are pinned; the rest is review.
