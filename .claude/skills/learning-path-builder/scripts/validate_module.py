#!/usr/bin/env python3
"""Validate a learning-path module in the platform JSON schema.

Usage:
    python3 -I validate_module.py MODULE.json

Checks:
  * array -> page -> children shape; unique task ids.
  * Answer / Camouflage are JSON-encoded strings; Choices / Hints are arrays.
  * Lesson tasks (Task_Type 5) have an empty Answer.
  * Graded quiz tasks carry at least one answer value.
  * Choice-style quizzes (decoys present) have both a correct answer and at
    least one decoy.
Then prints a module map (lesson vs quiz tasks and quiz types) so the
theory/practice/quiz balance is easy to eyeball.

Read-only; safe on untrusted input.
"""
import argparse
import json
import sys

REQUIRED = [
    "id", "text", "type", "Question_Title", "Question", "Answer",
    "Camouflage", "Category", "Task_Type", "Score", "Lose",
    "PartialCredit", "Visibility", "Hints", "Choices",
]
LESSON_TYPE = "5"


def fail(msg):
    print(f"  FAIL  {msg}")


def note(msg):
    print(f"  info  {msg}")


def parse_encoded(task, field):
    """Parse a string-encoded JSON field; return (ok, value, message)."""
    val = task.get(field)
    if val is None:
        return True, None, None
    if not isinstance(val, str):
        return False, None, (f"'{field}' must be a STRING containing JSON, "
                             f"got {type(val).__name__}")
    try:
        return True, json.loads(val), None
    except json.JSONDecodeError:
        return False, None, f"'{field}' string is not valid JSON: {val!r}"


def values_of(parsed):
    out = []
    if isinstance(parsed, list):
        for item in parsed:
            if isinstance(item, dict) and "value" in item:
                out.append(item["value"])
            else:
                out.append(item)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("module")
    args = ap.parse_args()

    errors = 0
    try:
        with open(args.module, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        fail(f"file not found: {args.module}")
        sys.exit(1)
    except json.JSONDecodeError as exc:
        fail(f"not valid JSON: {exc}")
        sys.exit(1)

    if not isinstance(data, list) or not data:
        fail("top level must be a non-empty JSON array")
        sys.exit(1)
    page = data[0]
    if not isinstance(page, dict) or page.get("type") != "page":
        fail("first element must be a page object (type=='page')")
        sys.exit(1)
    children = page.get("children")
    if not isinstance(children, list):
        fail("page.children must be an array")
        sys.exit(1)

    note(f"module title: {page.get('text')!r}")
    note(f"{len(children)} task(s)")

    seen = {}
    rows = []  # (title, kind, detail)
    for i, task in enumerate(children):
        where = f"task #{i} (id={task.get('id', '?')!r}, title={task.get('text', '?')!r})"
        if not isinstance(task, dict):
            fail(f"{where}: not an object")
            errors += 1
            continue
        for field in REQUIRED:
            if field not in task:
                fail(f"{where}: missing field '{field}'")
                errors += 1

        tid = task.get("id")
        if tid in seen:
            fail(f"{where}: duplicate id (also task #{seen[tid]})")
            errors += 1
        else:
            seen[tid] = i

        # string-encoded fields
        ok_a, answer, msg_a = parse_encoded(task, "Answer")
        if not ok_a:
            fail(f"{where}: {msg_a}")
            errors += 1
        ok_c, camo, msg_c = parse_encoded(task, "Camouflage")
        if not ok_c:
            fail(f"{where}: {msg_c}")
            errors += 1

        # array fields
        for field in ("Hints", "Choices"):
            if field in task and not isinstance(task[field], list):
                fail(f"{where}: '{field}' must be an array, got "
                     f"{type(task[field]).__name__}")
                errors += 1

        ttype = str(task.get("Task_Type"))
        ans_vals = values_of(answer) if ok_a else []
        camo_vals = camo if (ok_c and isinstance(camo, list)) else []

        if ttype == LESSON_TYPE:
            if ans_vals:
                fail(f"{where}: lesson task (Task_Type 5) should have empty "
                     f"Answer, found {ans_vals!r}")
                errors += 1
            rows.append((task.get("text", ""), "lesson", ""))
        else:
            # graded quiz task
            if not ans_vals:
                fail(f"{where}: graded quiz task has no Answer value")
                errors += 1
            if camo_vals:  # choice-style quiz (has decoys)
                kind = "quiz/choice"
                detail = f"{len(ans_vals)} correct, {len(camo_vals)} decoy(s)"
                if not ans_vals:
                    fail(f"{where}: choice quiz has decoys but no correct answer")
                    errors += 1
            else:
                kind = "quiz/short-answer"
                detail = f"{len(ans_vals)} accepted value(s)"
            rows.append((task.get("text", ""), kind, f"Task_Type {ttype}; {detail}"))

    # Module map
    print("\n  Module map:")
    n_lessons = sum(1 for r in rows if r[1] == "lesson")
    n_quiz = sum(1 for r in rows if r[1].startswith("quiz"))
    for title, kind, detail in rows:
        print(f"    - [{kind:<16}] {title}" + (f"  ({detail})" if detail else ""))
    print(f"\n  {n_lessons} lesson task(s), {n_quiz} quiz task(s)")

    if errors == 0:
        print("\nPASS — module is schema-valid.")
        sys.exit(0)
    print(f"\nFAILED with {errors} error(s).")
    sys.exit(1)


if __name__ == "__main__":
    main()
