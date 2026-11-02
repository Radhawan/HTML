#!/usr/bin/env python3
"""Validate CTF platform JSON files and check questions/walkthrough parity.

Usage:
    python3 -I validate_pair.py QUESTIONS.json [WALKTHROUGH.json] [--original SRC.json]

Checks performed:
  * Each file parses and matches the platform schema (array -> page -> children).
  * Answer / Camouflage are JSON-encoded strings; Choices / Hints are arrays.
  * No required task field is missing.
With two files:
  * Same number of tasks, in the same order, with matching titles.
  * Identical Answer value for every task (answers preserved across the pair).
With --original:
  * No Answer changed versus the source file you started from.

Exit code is 0 when everything passes, 1 otherwise. Designed to be safe to run
on untrusted input: it only reads and compares, never executes anything.
"""
import argparse
import json
import sys

REQUIRED_TASK_FIELDS = [
    "id", "text", "type", "Question_Title", "Question", "Answer",
    "Camouflage", "Category", "Task_Type", "Score", "Lose",
    "PartialCredit", "Visibility", "Hints", "Choices",
]
# Fields whose value is itself a JSON document stored as a string.
STRING_ENCODED_JSON = ["Answer", "Camouflage"]
# Fields that must be real JSON arrays.
ARRAY_FIELDS = ["Hints", "Choices"]


class Report:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.info = []

    def err(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    def note(self, msg):
        self.info.append(msg)

    def ok(self):
        return not self.errors


def load(path, rep, label):
    try:
        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        rep.err(f"[{label}] file not found: {path}")
        return None
    except json.JSONDecodeError as exc:
        rep.err(f"[{label}] not valid JSON: {exc}")
        return None
    return data


def get_tasks(data, rep, label):
    """Return the ordered list of task children, validating the outer shape."""
    if not isinstance(data, list) or not data:
        rep.err(f"[{label}] top level must be a non-empty JSON array")
        return []
    page = data[0]
    if not isinstance(page, dict) or page.get("type") != "page":
        rep.err(f"[{label}] first element must be a page object (type=='page')")
        return []
    children = page.get("children")
    if not isinstance(children, list):
        rep.err(f"[{label}] page.children must be an array")
        return []
    return children


def validate_file(data, rep, label):
    tasks = get_tasks(data, rep, label)
    seen_ids = {}
    for i, task in enumerate(tasks):
        where = f"[{label}] task #{i} (id={task.get('id', '?')!r}, "\
                f"title={task.get('text', '?')!r})"
        if not isinstance(task, dict):
            rep.err(f"{where}: not an object")
            continue
        for field in REQUIRED_TASK_FIELDS:
            if field not in task:
                rep.err(f"{where}: missing field '{field}'")
        # id uniqueness
        tid = task.get("id")
        if tid in seen_ids:
            rep.err(f"{where}: duplicate id (also task #{seen_ids[tid]})")
        else:
            seen_ids[tid] = i
        # string-encoded JSON fields
        for field in STRING_ENCODED_JSON:
            val = task.get(field)
            if val is None:
                continue
            if not isinstance(val, str):
                rep.err(f"{where}: '{field}' must be a STRING containing JSON, "
                        f"got {type(val).__name__}")
                continue
            try:
                json.loads(val)
            except json.JSONDecodeError:
                rep.err(f"{where}: '{field}' string is not valid JSON: {val!r}")
        # real-array fields
        for field in ARRAY_FIELDS:
            if field in task and not isinstance(task[field], list):
                rep.err(f"{where}: '{field}' must be a JSON array, "
                        f"got {type(task[field]).__name__}")
    rep.note(f"[{label}] {len(tasks)} task(s) found")
    return tasks


def answer_values(task):
    """Return the accepted answer *values*, ignoring editor-only metadata.

    The inner Answer is a list of objects like {"value": "...", "__isValid":
    true, "__tagId": "..."}. Only `value` is the real answer; `__tagId` and
    `__isValid` are editor artifacts that legitimately differ between files and
    across re-exports, so they are excluded from the comparison.
    """
    raw = task.get("Answer", "[]")
    try:
        parsed = json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return raw  # fall back to raw string; comparison will catch drift
    if isinstance(parsed, list):
        out = []
        for item in parsed:
            if isinstance(item, dict) and "value" in item:
                out.append(item["value"])
            else:
                out.append(item)
        return out
    return parsed


def title_of(task):
    return task.get("Question_Title") or task.get("text") or ""


def compare_pair(q_tasks, w_tasks, rep):
    if len(q_tasks) != len(w_tasks):
        rep.err(f"task count differs: questions={len(q_tasks)} "
                f"walkthrough={len(w_tasks)} (the two files must match 1:1)")
    n = min(len(q_tasks), len(w_tasks))
    for i in range(n):
        q, w = q_tasks[i], w_tasks[i]
        qt, wt = title_of(q), title_of(w)
        if qt != wt:
            rep.warn(f"task #{i}: title differs — questions={qt!r} "
                     f"walkthrough={wt!r} (titles should match)")
        qa, wa = answer_values(q), answer_values(w)
        if qa != wa:
            rep.err(f"task #{i} ({qt!r}): Answer differs between files.\n"
                    f"    questions   : {q.get('Answer')!r}\n"
                    f"    walkthrough : {w.get('Answer')!r}")


def compare_original(new_tasks, orig_tasks, rep, label):
    """Confirm no Answer changed versus the original source file."""
    orig_by_id = {t.get("id"): t for t in orig_tasks}
    matched = 0
    for t in new_tasks:
        o = orig_by_id.get(t.get("id"))
        if o is None:
            continue  # inserted task (e.g. new intro) — nothing to compare
        matched += 1
        if answer_values(t) != answer_values(o):
            rep.err(f"[{label}] task id={t.get('id')} ({title_of(t)!r}): "
                    f"Answer changed versus original.\n"
                    f"    original : {o.get('Answer')!r}\n"
                    f"    now      : {t.get('Answer')!r}")
    rep.note(f"[{label}] compared answers of {matched} task(s) against original")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("questions")
    ap.add_argument("walkthrough", nargs="?")
    ap.add_argument("--original", help="source questions file to diff answers against")
    args = ap.parse_args()

    rep = Report()

    q_data = load(args.questions, rep, "questions")
    q_tasks = validate_file(q_data, rep, "questions") if q_data is not None else []

    w_tasks = []
    if args.walkthrough:
        w_data = load(args.walkthrough, rep, "walkthrough")
        w_tasks = validate_file(w_data, rep, "walkthrough") if w_data is not None else []
        if q_tasks and w_tasks:
            compare_pair(q_tasks, w_tasks, rep)

    if args.original:
        o_data = load(args.original, rep, "original")
        if o_data is not None:
            o_tasks = get_tasks(o_data, rep, "original")
            if q_tasks:
                compare_original(q_tasks, o_tasks, rep, "questions")
            if w_tasks:
                compare_original(w_tasks, o_tasks, rep, "walkthrough")

    # Print report
    for m in rep.info:
        print(f"  info  {m}")
    for m in rep.warnings:
        print(f"  WARN  {m}")
    for m in rep.errors:
        print(f"  FAIL  {m}")

    if rep.ok():
        print("\nPASS — files are schema-valid"
              + (" and consistent" if (args.walkthrough or args.original) else "")
              + ".")
        sys.exit(0)
    print(f"\nFAILED with {len(rep.errors)} error(s).")
    sys.exit(1)


if __name__ == "__main__":
    main()
