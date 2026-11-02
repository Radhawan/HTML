---
name: ctf-challenge-writer
description: >-
  Use when the user wants to rewrite or author CTF challenge questions and/or
  their walkthrough (solution) for a training platform, starting from a
  questions JSON and an optional solution in JSON or PDF. It rephrases each task
  into an engaging, indirect, story-driven challenge WITHOUT changing the stored
  answers, and writes a matching step-by-step walkthrough — both in the
  platform's exact JSON schema (a page whose children are tasks with Question,
  Answer, and Task_Type fields). Trigger whenever the user mentions CTF questions, challenge
  rephrasing, making a question less direct, walkthroughs, solutions, lab tasks,
  "rooms", or uploads a JSON that has Question/Answer/Camouflage/Task_Type
  fields — even if they don't say the word "skill". Do not use it for building
  courses or learning modules; that is the learning-path-builder skill.
---

# CTF Challenge Writer

This skill turns raw CTF material into polished challenge content for the
user's platform. The user is a security professional authoring authorized
training labs, so the work is purely editorial: you rewrite the *wording* of
tasks and author teaching text. You never change what a task tests or what its
correct answer is.

## The two kinds of file

Both files use one identical JSON schema (see `references/platform-json.md`).
The only thing that differs is the content of each task's `Question` field.

1. **Questions file** — what the student sees. Each task is framed as an
   indirect, in-world challenge that reveals *nothing* about the method.
2. **Walkthrough file** — the solution. Each task teaches exactly how to reach
   the answer, with the real commands and what they do.

A single challenge is these two files kept in lockstep: same tasks, same order,
same storyline, same answers.

## Three modes

- **Questions only** — rephrase an existing questions JSON.
- **Walkthrough only** — write a walkthrough (from a questions JSON plus a
  solution in JSON or PDF, or from a questions JSON alone if you can solve it).
- **Both together (preferred for a new challenge)** — produce the questions
  file and the walkthrough in one pass so the storyline and the task list match
  by construction.

Ask the user which they want only if it is unclear from what they gave you. If
they hand you a questions file and a solution, assume they want both refreshed.

## Golden rules — read before touching anything

These are the constraints that make the output safe to import straight into the
platform. Breaking any one of them creates silent grading bugs.

1. **Answers never change.** The `Answer` field (and `Camouflage`, `Score`,
   `Category`, `Task_Type`, every id, etc.) is copied through byte-for-byte. Your
   rewritten question must still ask for the *exact same fact*, so the stored
   answer stays correct. If the original asks "how many open ports?" (answer
   `3`), your version still asks for that count — you may hide it inside a story,
   but you may not switch it to "what version runs on port 80?", because that
   would change the answer. When in doubt, re-read the `Answer` and make sure a
   student who produces that value is answering your new wording.

2. **Structure is immutable.** Keep every field, every key name, and the exact
   JSON types. In particular `Answer` and `Camouflage` are JSON *encoded as
   strings* (e.g. `"[{\"value\": \"3\"}]"`), while `Choices` and `Hints` are
   real arrays. Preserve that difference exactly. Details and the field-by-field
   table are in `references/platform-json.md`.

3. **No method hints in the question body.** The student should not be able to
   read the task and know which tool, command, protocol, or technique to use.
   Name no tools (`nmap`, `sqlmap`, `ftp`, …), no flags, no file names that give
   the game away. Point at *where to look* only through the story. The separate
   `Hints` array is the platform's opt-in, penalty-bearing hint system — leave
   it as-is unless the user asks otherwise. The "Answer Format" line stays
   (it describes the shape of the answer, not the method).

4. **Every file opens with a storyline.** Both files begin with an
   introduction/overview task that sets the scene. See "The introduction" below.

5. **The two files correspond 1:1.** The walkthrough has the same number of
   tasks as the questions file, in the same order, with the same titles. Every
   graded question maps to exactly one solution task. If you add a framing task
   (intro or wrap-up) to one file, add the identical task to the other so the
   counts stay equal.

## Workflow

1. **Read the input(s).** Parse the questions JSON. If a solution was given as
   PDF, read it (use the `pdf` skill if needed) and map its steps onto the
   tasks. Identify which task (if any) is already an introduction — it is
   usually the first child, with `Task_Type` `5`, a title like "Lab Overview",
   and an empty `Answer` (`"[]"`).

2. **Build the storyline.** From the scenario, write a short narrative that ties
   the tasks together (a believable org, a motive, a goal). The intro states it;
   each later task nods to it so the challenge reads as one story, not a list.

3. **Transform task by task.** For the questions file, rewrite each `Question`
   per `references/question-craft.md`. For the walkthrough, rewrite each
   `Question` per `references/walkthrough-craft.md`. Keep everything else in the
   task untouched.

4. **Validate.** Run the checker (see "Validation"). Fix anything it flags.

5. **Write the output file(s)** next to the inputs (or where the user asked),
   named clearly (e.g. `CTF.rephrased.json`, `Walkthrough.rephrased.json`).
   Report what changed, and list every task so the user can confirm the answers
   were preserved.

## The introduction

Every file must start with a scene-setting task. Handle it like this so the
original structure is respected:

- **If task 1 is already an introduction** (info task, `Task_Type` `5`, empty
  answer): rewrite its `Question` HTML into a stronger overview + storyline.
  Keep its id and all metadata.
- **If there is no introduction**: insert a new intro task at position 1 and
  shift every other task down by one. Give the new task a fresh unique integer
  `id` that does not collide with any existing id, `Task_Type` `"5"`,
  `Score` `"0"`, `Answer` `"[]"`, `Camouflage` `"[]"`, empty `Hints` and
  `Choices`, and a sensible `Category` (reuse the platform's overview category —
  `27` in the reference sample). Flag the inserted task to the user.

A good intro overview names the target scope, the rules of engagement, what the
student will walk away able to do, the flag format, and the scoring — then hands
off with a line that launches the story. Keep it in the same HTML style as the
rest of the file (`<h2>/<h3>` headings, `<p style="font-size:12pt;">`, `<code>`,
`<ul>/<ol>`).

## Rephrasing questions (summary)

The craft, with worked before/after examples, is in
`references/question-craft.md`. In short: replace the instructional lead-in with
a line or two of story, then ask for the same fact indirectly. Keep the
`<strong>Question:</strong>` and `<strong>Answer Format:</strong>` lines so the
student knows what to submit. Strip anything that names a tool or spells out the
steps.

## Writing walkthroughs (summary)

The craft, with a worked example and the house style, is in
`references/walkthrough-craft.md`. In short: for each task, carry the story
forward one beat, state plainly what you are about to do, show the real
command(s) in the kali code-block style, show the observed output, then explain
in simple language what each command and flag did and what the output means —
ending by restating the question and answer format. Write direct explanations;
do **not** add rhetorical asides such as "Why this matters" or "Why is this
important" — the user has explicitly asked for these to be left out. Explain the
*how* and the *what*, not the pep talk.

## Validation

Before you hand anything back, run the parity checker. It confirms the two files
line up and that no answer or structural field drifted:

```bash
python3 -I .claude/skills/ctf-challenge-writer/scripts/validate_pair.py \
  <questions.json> [<walkthrough.json>] [--original <source_questions.json>]
```

- One file: checks it is well-formed and schema-valid.
- Two files: also checks equal task count, matching titles/order, and identical
  `Answer` values task-by-task.
- `--original`: confirms no `Answer` changed versus the file you started from —
  the strongest guard for "answers never change". Use it whenever you rephrase
  in place.

The checker cannot judge whether a question leaked a method hint or still asks
for the same fact in spirit — that is your editorial job. Re-read each rewritten
question against its answer before finishing.

## Output format

Emit valid JSON that re-imports cleanly: the top-level array, the `page` object,
and `children` in order. Preserve the string-encoding of `Answer`/`Camouflage`.
Do not pretty-print in a way that changes those encoded strings. When you report
back, lead with the outcome (e.g. "Rephrased 14 tasks; answers unchanged; added
1 intro task"), then give a short per-task list.
