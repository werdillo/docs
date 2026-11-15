# A screen reads top-down

A screen file is read far more often than it is written, so it is arranged to be
read.

- **The exported component shows the screen's shape** in a few lines: its
  sections, its tables, its dialogs — named. The blocks it is made of follow it
  as **private components** in the same file, named after what they show
  (`SpecialistsTable`, `ProjectRow`, `DuplicateGroup`), in the order they
  appear.
- **A file may hold several components; it exports exactly one.** A part used
  once and small enough to sit beside its parent belongs in the parent's file,
  not in a file of its own. A component is split for a reason, not a line count
  ([the sizes](../structure/sizes.md#flat-when-small-and-the-sizes)).
- **Depth is the signal, not length.** A block worth naming — a row, a table, a
  card section — or one sitting five levels deep becomes a private component;
  the exported component stays within about eight levels of nesting. A file
  that grew a few lines from the extraction and lost half its depth is the
  better file.
- **A private component takes what it renders as props** and its handlers as
  callbacks; the state stays where it was created.
- **Data is read where it is shown.** A query used by one component lives in
  that component; a hook is for state or behaviour that is reused, shared or
  outlives it ([inside a box](../structure/inside-a-box.md#the-technical-slices)).

## The frame

The frame is the shell every screen sits in: the sidebar, the page bar, the
route guard and the not-found page. It belongs to the composition root, and
nothing below the root may import it, so a screen reaches the frame only through
a small seam in the infrastructure layer. Through that seam a screen publishes
the breadcrumb tail it shows while mounted, and a domain plugs its header
widgets into the sidebar's foot. The arrow is checked by a layer test on the
server; on the front end it is the rule and the review
([layers](../structure/interaction.md#how-matrices-interact-with-each-other)).
