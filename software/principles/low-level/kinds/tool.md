# A tool

A program that starts, does one job and exits: a CLI, a converter, a code
generator, a script. It is closest to the [overkill](../README.md#scope)
line, and keeps the rules that cost nothing: limits, assertions, error
handling, the 70 lines.

## Memory

Its life is one job, so memory can be sized from the job: `main` reads the
input's size, checks it against a limit, and allocates once. When that is
not known up front, an arena for the whole run is honest — it is freed at
exit, and the limit on the input bounds it.

## The outside

The command line, the files it is given and the environment are input, and
are parsed once, at the start, into a type
([input is parsed once](../safety/errors.md#input-is-parsed-once-at-the-boundary)).
A missing file or a bad flag is an operating error: a message that says what
was wrong and what to do, and a non-zero exit code. A trace is for the
tool's own bugs.

- **Long flags**: `--output`, not `-o`, in scripts and documentation
  ([no abbreviations](../structure/naming.md#no-abbreviations)).
- **Output that another program reads is a format**, stated and stable;
  messages for a person go to standard error.

## Scripts are tools

A project's scripts are Zig tools run by its build, not shell scripts
([one language](../toolchain/README.md#one-language-one-pinned-toolchain)),
and follow the same rules — a script that fails silently costs as much as a
program that does.
