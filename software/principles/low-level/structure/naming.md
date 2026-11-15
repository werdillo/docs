# Naming

A good name is a small, exact model of the thing. Getting it right takes
time, and the time is repaid at every place the name is read.

## Nouns and verbs

- **A thing is a noun, an action is a verb**, and the two are chosen to work
  together: a `pool` is `acquire`d from and `release`d to; a `request` is
  `parse`d.
- **A noun is better than an adjective or a participle** for a thing that
  will be talked about: `pipeline`, not `preparing`. A noun can be a heading,
  a field and a prefix — `pipeline_max` — without being rephrased.
- **One word, one meaning.** A word that already names something in the
  program is not reused for something else, however well it fits. If a new
  thing wants a taken word, the new thing needs a better one.
- **The name says the meaning, not the type.** `gpa` and `arena` say who
  frees; `allocator` says only what the type already said.

## Case

| What | Case | Example |
|---|---|---|
| a function, a variable, a field, a constant | `snake_case` | `parse_range`, `free_count`, `connections_max` |
| a type | `TitleCase` | `ConnectionPool`, `Range` |
| a file | `snake_case.zig` | `static_allocator.zig` |
| an acronym | keeps its capitals in a type | `HTTPRequest`, not `HttpRequest`; `http_request` in snake case |
| an error | `TitleCase`, says what happened | `RangeUnsatisfiable` |

Functions are `snake_case`, as in TigerStyle and unlike the standard library,
which uses `camelCase`. One case for everything that is not a type means a
call into the project's own code is visible as such, and the underscore
leaves room for long, exact names
([where this departs](../sources/README.md#where-these-documents-depart)).

## No abbreviations

`connection`, not `conn`; `buffer`, not `buf`; `source` and `target`, not
`src` and `dst`. An abbreviation saves its author a second and costs each
reader a guess.

The exceptions are few and fixed: an integer in a sort or a matrix (`i`,
`j`), and names that are terms in their own right — `gpa`, `http`, `id`,
`ms`.

In scripts and commands, the long form of a flag: `--force`, not `-f`.

## Units and qualifiers go last

A name starts with the most significant word and ends with the least: the
subject, then the unit, then the qualifier.

```zig
const latency_ms_max: u64 = 500;
const latency_ms_min: u64 = 1;
const header_size_max: u32 = 8 * 1024;
const idle_timeout_ms: u64 = 30_000;
```

Not `max_latency_ms`. With the subject first, everything about latency sorts
together and lines up, and the unit is never left out.

**A number always carries its unit**: `_ms`, `_ns`, `_size` for bytes,
`_count`, `_index`. The last three are different things and never share a
name ([index, count and size](../safety/limits.md#index-count-and-size)).

## Names that line up

Related names of the same length make the code symmetrical, and symmetrical
code shows its mistakes:

```zig
@memcpy(target[target_offset..][0..size], source[source_offset..][0..size]);
```

`source` and `target` are both six letters; `src` and `dest` are not. It is a
small thing to look for when choosing between two good names, and not a
reason to choose a worse one.

## Helpers and callbacks

- **A helper called from one function is prefixed with that function's
  name**: `read_request` and `read_request_headers`. The call history is in
  the name, and the two sort together.
- **A callback is named after what it completes**, with `_callback` last:
  `read_sector` and `read_sector_callback`. It is the last parameter, as it
  is the last thing to run.

## Outside the code

A name is used in a log line, a metric, a document and a conversation. The
same word is used in all of them: what the code calls a `connection` is not a
`session` in the log and a `client` in the dashboard.
