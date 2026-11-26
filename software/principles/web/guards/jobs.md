# Jobs

**The rule.** Work that outlives a request is a job, never a request: the
request answers quickly, the job runs in the background and records its result
([long work](../architecture/data.md#long-work-is-a-job-never-a-request);
[the principles](../rules.md), rule 9).

The guard pins the routes that were converted. It does not prove that no other
route belongs in a job — that is review — but it proves that a route answering
with a job keeps doing so, and that a new route in those routers which queues
work is added to the list.

## An export is a job

An export is a job whose file the admin downloads. The request queues it and
answers 202, and the file is read back once the job is done.

Every cell goes through one CSV writer, which defuses a value a spreadsheet
would read as a formula — one starting with `=`, `+`, `-`, `@`, a tab or a
carriage return — with a leading apostrophe. A plain number or phone is left as
it is, since no spreadsheet reads one as a formula. The writer's cases are
pinned by a test beside it.

## What it checks

The route list, one entry per route, and each entry is read end to end:

- **The router registers the handler** on the POST path — through a route
  declaration or inline.
- **The handler is where the entry says**, following the router's barrels to the
  declaring file.
- **The declaration answers 202 with the job response** — directly, or through a
  shared responses object the file imports.
- **The enqueuing file** imports the enqueue function from the jobs door, names a
  kind a job definition registers, calls the enqueue function, and answers 202.
- **A delegated enqueue** names the file and the reason; the registered handler
  must call it.

## The list only grows

A discovery pass reads the listed routers, finds every POST that answers 202 with
the job schema or runs an inline handler that enqueues, and fails on one that is
not in the list. An inline registration is listed with its reason, and fails
when it is no longer a route.

```ts
test("a new route that queues work is added to the job-route list", () => {
  const routes = JOB_ROUTES.map((entry) => entry.route);
  assertEquals(routes.filter((route, i) => routes.indexOf(route) !== i), []);
  const listed = new Set(JOB_ROUTES.map((entry) => `${entry.router} ${entry.path}`));
  const discovered = new Set(JOB_ROUTES.flatMap((entry) => jobPaths(entry.router).map((path) => `${entry.router} ${path}`)));
  assertEquals(
    [...discovered].filter((key) => !listed.has(key)).sort(),
    [],
    "a route in one of these routers answers 202 with a job: add it to JOB_ROUTES",
  );
  assertEquals(
    Object.keys(REGISTERED_INLINE).filter((route) => !routes.includes(route)).sort(),
    [],
    "REGISTERED_INLINE names a route that is no longer in JOB_ROUTES: remove it",
  );
});
```

## The failure

`POST /path (router): finding`, one per problem: the router does not register
the handler on the path; the handler comes from another file; the route does not
answer 202 with the job schema; the file does not import the enqueue function
from the jobs door; the kind is not one a job definition registers.

## What it cannot see

- **A router not yet in the list.** Discovery reads the routers the list names;
  a new router that queues work is found when it is added, not before.
- **Long work that never became a job.** A route that runs it inline is
  invisible; that is the rule plus review.
- **A delegation more than one hop away.** The guard follows the registered
  handler to the file it calls; a second hop is not followed.
- **A 202 written some other way.** The marker is the route's job response and
  the handler's `202`; a status chosen dynamically is not seen.
