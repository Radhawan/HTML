# Rephrasing questions — craft and examples

Goal: take a task that reads like a lab instruction and turn it into a short,
in-world challenge that asks for **the same fact** while revealing **none of the
method**. The student should feel like an operator piecing together a story, not
a learner following numbered steps.

## The shape of a rephrased question

Keep it tight — usually two short paragraphs of HTML:

1. **A beat of story** (1–3 sentences): advance the narrative and point, through
   the fiction, at *where* to look next — never at *how*.
2. **The ask**: a `<strong>Question:</strong> …` line that requests the original
   fact, phrased indirectly, followed by the `<strong>Answer Format:</strong>`
   line copied/adapted from the original.

Drop every "Begin with reconnaissance", "Run a scan", "Use tool X" style lead-in.
Drop tool names, flags, filenames-as-hints, and step numbers.

## The one rule that protects the answer

Before you write, read the task's `Answer`. Your new question must be answerable
by exactly that value. Rephrase the *framing*, not the *target*. Changing the
target (ports → version, count → name) changes the answer and breaks grading —
which the platform owner has explicitly ruled out.

## Before / after

**Example 1 — keep the fact, lose the instructions.**

Original:
> Begin with reconnaissance and map the target's attack surface.
> **Question:** How many TCP ports are open on the target?
> **Answer Format:** a single number, e.g. `2`

Rephrased (answer is still the port count):
> The roastery's setup was stood up in a hurry and nobody counted the doors
> they left unlocked. Before you touch anything, take stock of how exposed the
> host really is.
> **Question:** How many doors did they leave open to the network?
> **Answer Format:** a single number, e.g. `2`

**Example 2 — the robots.txt case (the user's own example).**

Original:
> Enumerate the web server — its robots.txt is a good place to start.
> **Question:** What hidden path is revealed by the web server's robots.txt?
> **Answer Format:** `/path/`

Rephrased (no mention of robots.txt or any tool):
> Whoever built the site tried to keep one area out of sight — they even asked
> the web crawlers politely to stay away from it. That request is still sitting
> there in plain view for anyone who thinks to look.
> **Question:** Which off-limits area were the crawlers told to avoid?
> **Answer Format:** `/path/`

**Example 3 — name the weakness without naming the technique.**

Original:
> Examine the staff login page you discovered.
> **Question:** What class of web vulnerability does the login form suffer from?

Rephrased:
> The login form was wired up on the last day before launch and never reviewed.
> Something you type into it changes how it behaves — as if your input is being
> trusted far more than it should be.
> **Question:** What class of flaw is the login form carrying?
> **Answer Format:** the vulnerability's name

## Handling hint leakage inside the original question

Originals sometimes bury the method in the prose ("point an automated tool at
it", "its robots.txt is a good place to start", "review what you may run as
root"). Rewrite those into story. The equivalent story cue for the last one
might be: "You are standing inside the building now, but only as a guest. Find
out which trusted errand the staff account is allowed to run on the owner's
behalf — that is your way up." It points at the idea (a trusted privileged
action) without naming `sudo -l`.

## Difficulty and tone

- Match the challenge's stated difficulty. An "Easy" room can have a slightly
  warmer, more guiding narrative; a "Hard" room stays terse and gives less.
- Keep the fiction consistent: reuse the org, people, and systems named in the
  intro so each task feels like the next scene.
- Never invent a new answer, a new flag, or a fact the lab can't produce. The
  story decorates the question; it does not add new truths.

## Keep, don't touch

- The `Answer`, `Camouflage`, `Hints`, scoring and all metadata.
- The `Answer Format` line (reword lightly only if the format itself is
  unchanged; keep the example).
- The task's position relative to the others (order carries the story).
