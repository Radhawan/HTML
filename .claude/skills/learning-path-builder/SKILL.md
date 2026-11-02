---
name: learning-path-builder
description: >-
  Use when the user wants to build a cybersecurity learning path, course, or
  training module — from a PDF they provide, from reference material, or from
  just a topic (e.g. "create a course on Nmap", "turn this enumeration PDF into
  a module", "build a Penetration Testing path"). It studies the source
  material, researches the topic to fill gaps, and produces a structured module
  — lessons from fundamentals to advanced, each with objectives, theory,
  hands-on labs (real commands + expected output + explanation), a summary, and
  a quiz (multiple-choice, true/false, short-answer, multi-select) — emitted in
  the platform's JSON schema (a page whose children are tasks). Trigger on "learning
  path", "course", "module", "curriculum", "lesson", "teach me or build training
  on a security topic", or a PDF of training material, even if the user doesn't
  say "skill". Do not use it for rephrasing CTF questions or writing a single
  challenge walkthrough; that is the ctf-challenge-writer skill.
---

# Learning Path Builder

This skill builds a teaching **module** that lives inside a broader **learning
path**. For example, an "Enumeration" module inside a "Penetration Testing"
path. The output is JSON in the same platform schema the CTF files use (see
`references/platform-json.md`), so modules import alongside the labs.

The audience is a student working up from the basics. Content must be detailed
and genuinely instructional — not a skim — and must balance theory with
hands-on practice. The user is a security professional building authorized
training, so labs use real tools and commands against lab/example targets.

## What you produce

A module is one **page** object whose `children` are ordered tasks. Two kinds of
task carry the module:

- **Lesson tasks** (`Task_Type` `"5"`, informational): the teaching content —
  objectives, theory, hands-on lab, summary.
- **Quiz tasks** (graded): knowledge checks after a lesson or at the end of the
  module. Encodings for each quiz type are in `references/platform-json.md`.

The module opens with an **introduction** task that places it in its path and
sets expectations, and ends with a short **module summary / what's next** task.

## Workflow

1. **Gather the source.**
   - If the user gave a PDF (or several), read them thoroughly (use the `pdf`
     skill if the file is large or scanned). Pull out the concepts, commands,
     diagrams-in-words, and the order the material teaches them in.
   - If the user gave only a topic, start from what the topic obviously needs.
   - Either way, **research to fill gaps and verify currency** with `WebSearch`:
     confirm current tool flags and syntax, official documentation, and standard
     practice. Prefer primary sources (tool man pages, official docs, RFCs,
     vendor/maintainer sites). Note anything version-specific.

2. **Plan the module.** Decide the path it belongs to and the module title.
   Draft the lesson list from fundamentals to advanced (see "How big" and
   `references/module-design.md`). Sketch, for each lesson, its objectives, the
   core theory, the lab, and the quiz items. Show the user this outline before
   writing the full module if the scope is large or ambiguous — it is cheap to
   adjust an outline and expensive to redo a full module.

3. **Write each lesson** following the lesson anatomy in
   `references/module-design.md`: objectives → theory → hands-on lab (real
   commands, expected output, and a plain explanation of each) → summary. Keep
   the language accessible but do not oversimplify; a student should come away
   able to *do* the thing, not just recognize the word.

4. **Write the quizzes** using the question types the platform supports
   (multiple-choice, true/false, short-answer, multi-select). Encode them per
   `references/platform-json.md`. Keep every quiz answerable purely from the
   lesson(s) before it.

5. **Assemble and validate.** Build the JSON, then run the validator (see
   "Validation"). Fix anything it flags. Write the file where the user asked and
   report the module outline and lesson/quiz counts.

## How big is a module

Size to the topic, roughly 5–12 lessons:

- A focused tool or technique (e.g. "Nmap", "robots.txt & web content
  discovery"): ~5–8 lessons, ~1,500–2,500 words of teaching each.
- A broad domain (e.g. "Enumeration" across services): ~8–12 lessons, with
  several labs across the module and more depth per lesson.

Prefer more, shorter, well-sequenced lessons over a few giant ones — each lesson
should teach one idea well and build on the last. When unsure, confirm the
intended depth with the user during the outline step.

## Theory ↔ practice balance

Every lesson pairs an idea with doing it. A lesson that is all prose has not
taught a skill; a lesson that is all commands has not taught understanding. The
lab should let the student run the thing the theory just described and see the
result the theory predicted. Keep commands real and current (that is what the
research step is for), show representative output, and explain what each command
and each notable flag does and what the output means.

## Validation

```bash
python3 -I .claude/skills/learning-path-builder/scripts/validate_module.py <module.json>
```

It checks the schema (array -> page -> children), the string-encoding of
`Answer`/`Camouflage`, that `Choices`/`Hints` are arrays, that graded quiz tasks
actually carry an answer, and that choice-type quizzes have both a correct
answer and at least one decoy. It also prints a quick table of the module —
lesson vs. quiz tasks and the quiz type of each — so you can eyeball the
theory/practice/quiz balance.

## Output format

Valid, re-importable JSON: the top-level array, the `page` object (its `text` is
the module title), and `children` in teaching order. Preserve the
string-encoding of `Answer`/`Camouflage`. Lead your report with the outcome
(e.g. "Built the Enumeration module: 8 lessons, 6 quizzes, inside the
Penetration Testing path"), then the lesson list.

## One thing to confirm with the user

The platform's quiz feature is new, so the exact encoding of multiple-choice /
multi-select / true-false tasks (which `Task_Type` code, and whether decoys live
in `Camouflage` or `Choices`) may not be finalized. This skill uses a documented
default (correct answers in `Answer`, decoys in `Camouflage`) that follows the
existing field names — see `references/platform-json.md`. If the platform
expects something different, that reference file is the single place to adjust,
and the change is mechanical.
