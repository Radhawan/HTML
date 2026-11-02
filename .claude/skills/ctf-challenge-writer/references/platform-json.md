# Platform JSON schema

Both the questions file and the walkthrough file use this one schema. A file is
a JSON array containing a single **page** object, whose `children` are the
**task** objects shown to the student in order.

```json
[
  {
    "id": 1000,
    "text": "Challenge Title (Easy)",
    "type": "page",
    "children": [ { ...task... }, { ...task... } ]
  }
]
```

## Task object — field by field

| Field | Type | What it is | Rule when rewriting |
|---|---|---|---|
| `id` | integer | Unique task id | Keep. For a task you insert, assign a new integer that collides with nothing in the file. |
| `text` | string | Short task title | May be reworded for flavour, but keep it identical between the questions and walkthrough files. |
| `type` | string | Always `"task"` for children | Keep. |
| `Question_Title` | string | Title shown above the task | Keep in sync with `text`. |
| `Question` | string (HTML) | The task body | **This is the only field you transform.** |
| `Answer` | string (JSON-encoded) | Accepted answers | **Copy verbatim. Never change.** |
| `Camouflage` | string (JSON-encoded) | Decoy / wrong options shown alongside the answer (used by choice-type tasks) | Copy verbatim unless the user asks to edit choices. |
| `Category` | string | Platform category id | Keep. |
| `Task_Type` | string | Task/answer type code | Keep. |
| `Score` | string | Points for the task | Keep. |
| `Lose` | string | Points lost (penalty config) | Keep. |
| `PartialCredit` | integer | Partial-credit flag | Keep. |
| `Visibility` | integer | Visible flag | Keep. |
| `Hints` | array of objects | Penalty hints: `{id, text, penalty}` | Keep the array as-is by default. These are the platform's opt-in hints, separate from the "no hints in the body" rule. |
| `Choices` | array | Choice options (empty for free-text tasks) | Keep. |

## The string-encoding trap (important)

`Answer` and `Camouflage` are **JSON encoded inside a string** — their value is
text that itself parses as JSON. `Choices` and `Hints` are **real JSON arrays**.

```jsonc
"Answer": "[{\"value\": \"3\"}]",     // a STRING containing JSON
"Camouflage": "[]",                    // a STRING containing JSON
"Choices": [],                          // a real array
"Hints": [ { "id": 10276, "text": "…", "penalty": 3 } ]  // a real array
```

When you emit the file, keep that exactly. If you load the file, parse `Answer`
with a second `json.loads` on the string; when you write it back, `json.dumps`
the inner value into a string again. Never turn `Answer` into a real array or
turn `Choices` into a string — the platform import relies on these types.

## `Answer` value shapes seen in real files

The inner JSON is an array of objects, each with a `value`. Multiple objects
mean multiple accepted answers (any one is correct). Some carry editor metadata
(`__isValid`, `__tagId`) — keep whatever is there.

```jsonc
// free text, one accepted answer
"[{\"value\": \"staff-memo.txt\"}]"

// several accepted spellings — all correct
"[{\"value\": \"Apache/2.4.52 (Ubuntu)\"}, {\"value\": \"Apache/2.4.52\"}, {\"value\": \"2.4.52\"}]"

// with editor metadata — preserve it
"[{\"value\":\"3\",\"__isValid\":true,\"__tagId\":\"1a08e962-…\"}]"

// informational task — no answer
"[]"
```

## Task types observed

- `Task_Type` `"5"` — informational task (overview, wrap-up). `Score` often
  `"0"`, `Answer` is `"[]"`. Use this for the introduction.
- `Task_Type` `"1"` and `"2"` — graded free-text / short-answer tasks (a number,
  a string, a flag, a path, a version). Both appear in real files; preserve
  whichever the source used — do not "normalize" them.

`Category` is a numeric platform id that varies per task (e.g. `27`, `35`, `79`,
`11`, `5`, `33`, `25`, `12`, `13`, `23`). Treat it as an opaque value to keep.

## HTML conventions

Questions are HTML fragments. Match the existing house style so the rendered
page looks consistent:

- Body text: `<p style="font-size:12pt;">…</p>`.
- Section headings in the intro/walkthrough: `<h2>`, `<h3>`, `<h4>`.
- Inline code, paths, formats: `<code>…</code>`.
- Lists: `<ul><li style="font-size:12pt;">…</li></ul>` / `<ol>…</ol>`.
- The graded question ends with two lines:
  `<p style="font-size:12pt;"><strong>Question:</strong> …</p>` and
  `<p style="font-size:12pt;"><strong>Answer Format:</strong> <code>…</code></p>`.
- Command blocks (walkthrough only):
  `<pre class="language-bash"><code>┌──(kali㉿kali)-[~]\n└─$ <command></code></pre>`.
- Escape `&` as `&amp;` inside command blocks (e.g. POST bodies with `&`).
