# Module design — structure, lesson anatomy, labs, quizzes

This is how to turn source material (a PDF, references, or a bare topic) into a
module that teaches a skill from the ground up.

## Where the module sits

A **learning path** is a sequence of **modules**; a **module** is a sequence of
**lessons** with quizzes. You build one module at a time, but always name the
path it belongs to and where this module falls in it (what comes before, what
comes after). State that in the module intro so the student has a map.

Example path — "Penetration Testing": `Networking Refresher → Reconnaissance →
Enumeration → Exploitation → Privilege Escalation → Post-Exploitation →
Reporting`. If asked for "Enumeration", you build that module and reference its
neighbours.

## Module skeleton (order of tasks)

1. **Module intro** (info task): the path, this module's place in it, who it is
   for, the prerequisites, what the student will be able to do by the end, and
   how it is organized. 1 task.
2. **Lessons**, ordered fundamentals → advanced. Each is one lesson task
   (optionally followed by its own quiz task). N tasks.
3. **End-of-module quiz** (optional): a few items spanning the whole module.
4. **Module summary / what's next** (info task): recap the key skills, point to
   the next module, and suggest practice. 1 task.

Decide whether quizzes come after each lesson, at the end, or both. After-lesson
quizzes reinforce immediately; an end quiz tests integration. For most modules,
a short quiz after each substantive lesson plus a small end quiz works well.

## Lesson anatomy

Each lesson task's `Question` HTML follows this order. Keep headings so the page
is scannable, but write the body as connected prose, not bullet soup.

1. **Objectives** (`<h3>Objectives</h3>`): 2–4 bullets — concrete, verb-first,
   what the student will be able to do ("Run a version scan and read its
   output", not "Understand scanning").
2. **Theory / concept**: explain the idea in accessible language, building on
   earlier lessons. Define terms the first time they appear. Use a short example
   or an analogy where it genuinely clarifies — but keep it accurate; do not
   dumb the material down to the point of being wrong. Depth target: enough that
   the student understands *why* the upcoming command behaves as it does.
3. **Hands-on lab** (`<h3>Lab</h3>`): the student does the thing. Give the real
   command(s) in the kali block, then the representative output, then explain:
   - what each command does, and what each notable **flag** does,
   - how to read the output and what to look for,
   - common variations or pitfalls (one or two, not a dump).
   Keep targets generic/lab-style (e.g. `scanme.nmap.org`, `10.10.10.0/24`,
   `MACHINE_IP`) and commands current — verify syntax during the research step.
4. **Summary** (`<h3>Summary</h3>`): 2–4 sentences of key takeaways — the
   durable facts and the command(s) worth remembering.

Aim for roughly 1,500–2,500 words per lesson for a focused topic, more for a
dense one. Length serves completeness, not word count — cut anything that does
not teach.

### Worked lesson sketch ("What a Port Scan Actually Does")

- Objectives: explain what an open/closed/filtered port means; run a basic scan;
  read the state column.
- Theory: a port is an endpoint a service listens on; scanning sends crafted
  packets and infers state from the reply (SYN→SYN/ACK = open, SYN→RST =
  closed, no reply = filtered). Plain, correct, no hand-waving.
- Lab: `nmap -sV scanme.nmap.org`; show the PORT/STATE/SERVICE/VERSION table;
  explain `-sV` (probe for service + version), the state column, and why version
  detection matters for the next lesson. Note `-p-` scans all 65535 ports.
- Summary: open vs closed vs filtered; `-sV` gives you the service and version
  that drive everything after recon.

## Lab command sourcing and safety

- Use standard, well-documented commands. Verify flags/syntax against current
  official docs in the research step — tools change.
- Targets are lab or explicitly-safe hosts. Never imply the student should run
  scans or attacks against systems they do not own or have permission to test;
  a one-line note that practice happens in the lab/authorized scope is good
  practice to include where relevant.
- Output shown should be representative of what the lab produces. Mark it as
  example output; do not fabricate implausible results.

## Quiz design

Write quizzes that test understanding of the lesson(s) just taught — never
trivia the lesson didn't cover. Mix types to match what you are testing:

- **Multiple choice** — one best answer among plausible distractors. Make decoys
  believable (common misconceptions, adjacent-but-wrong tools), not absurd.
- **Multi-select** — "choose all that apply"; several correct, some wrong. Say
  how many or "all that apply".
- **True / False** — one clear proposition; avoid double negatives.
- **Short answer** — an exact fact (a flag, a port, a term). List every accepted
  spelling in `Answer` (`-sV`, `sV`), as the CTF files do for alternates.

Per substantive lesson, 2–4 items is plenty. Keep each item answerable from the
material; put the encodings in `references/platform-json.md`. Write a brief,
correct prompt — the quiz is a check, not a trick.

## Using the source PDF

- Follow the PDF's conceptual coverage and, where sensible, its ordering — the
  user chose that material for a reason.
- Fill gaps the PDF leaves (missing fundamentals, outdated commands, absent
  practice) from research, and say in your report what you added beyond the PDF.
- Do not copy the PDF's text verbatim; teach the same concepts in your own clear
  words, at the depth this skill calls for.

## Report back

After building, lead with the outcome, then give the module outline: the path
and module title, the ordered lesson list with a one-line objective each, the
quiz count and types, and a note of anything you researched or added beyond the
provided material (and any placeholder — e.g. quiz `Task_Type` codes,
`Category` ids — the user should map to the platform).
