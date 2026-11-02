# Platform JSON schema for learning modules

A module reuses the exact schema the CTF files use: a JSON array containing one
**page** object whose `children` are ordered **task** objects. Here the page is
a module and the tasks are lessons and quizzes.

```json
[
  {
    "id": 2000,
    "text": "Enumeration",
    "type": "page",
    "children": [ { ...lesson or quiz task... }, ... ]
  }
]
```

- `page.text` — the **module** title (e.g. `"Enumeration"`).
- Mention the **parent path** (e.g. "Penetration Testing") in the intro task's
  body, since the schema has one page per module.

## Task fields (same as the CTF schema)

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Unique within the file. Assign fresh, non-colliding ids. |
| `text` / `Question_Title` | string | Lesson or quiz title; keep them equal. |
| `type` | string | `"task"`. |
| `Question` | string (HTML) | The lesson content, or the quiz prompt. |
| `Answer` | string (JSON-encoded) | `"[]"` for lessons; the correct answer(s) for quizzes. |
| `Camouflage` | string (JSON-encoded) | `"[]"` for lessons; the decoy/wrong options for choice quizzes. |
| `Category` | string | Platform category id (opaque; see note). |
| `Task_Type` | string | `"5"` for lessons; quiz codes below. |
| `Score` | string | `"0"` for lessons; points for quizzes. |
| `Lose`, `PartialCredit`, `Visibility` | | Keep platform defaults (`"0"`, `0`, `1`). |
| `Hints` | array | `[]` unless you add penalty hints. |
| `Choices` | array | `[]` under the default encoding (see below). |

**String-encoding trap (same as CTF):** `Answer` and `Camouflage` are JSON
*encoded as strings*; `Choices` and `Hints` are *real arrays*. Keep that exact.

```jsonc
"Answer": "[{\"value\": \"TCP SYN scan\"}]",   // STRING containing JSON
"Camouflage": "[\"UDP scan\", \"ACK scan\"]",   // STRING containing JSON
"Choices": [],                                    // real array
"Hints": []                                        // real array
```

`Category`: the CTF samples use numeric ids per topic. If the platform has
category ids for course content, use them; otherwise reuse a reasonable existing
id and tell the user it is a placeholder to map.

## Lesson task (the teaching content)

An informational task that renders the lesson. No answer.

```jsonc
{
  "id": 2001,
  "text": "What a Port Scan Actually Does",
  "type": "task",
  "Question_Title": "What a Port Scan Actually Does",
  "Question": "<h3>Objectives</h3> … <h3>Lab</h3> … <h3>Summary</h3> …",
  "Answer": "[]",
  "Camouflage": "[]",
  "Category": "35",
  "Task_Type": "5",
  "Score": "0",
  "Lose": "0",
  "PartialCredit": 0,
  "Visibility": 1,
  "Hints": [],
  "Choices": []
}
```

## Quiz encodings (DEFAULT — confirm with the user)

The samples contain only free-text (`Task_Type` `1`/`2`) and info (`5`) tasks,
and the field named **`Camouflage`** is empty in them. The most consistent
reading of the existing fields is: **`Answer` holds the correct option(s) and
`Camouflage` holds the wrong options (the decoys)**; the platform renders them
shuffled together as the choices. The skill uses that as the default. Because
the quiz feature is new, treat the `Task_Type` numbers below as placeholders and
confirm them with the user — they are easy to change here in one place.

### Short answer — `Task_Type` `"1"` (or `"2"`)

Free text; list every accepted spelling as a `value`. No decoys.

```jsonc
"Question": "<p style=\"font-size:12pt;\"><strong>Question:</strong> Which Nmap flag enables service/version detection?</p><p style=\"font-size:12pt;\"><strong>Answer Format:</strong> a flag, e.g. <code>-xY</code></p>",
"Answer": "[{\"value\": \"-sV\"}, {\"value\": \"sV\"}]",
"Camouflage": "[]",
"Task_Type": "1"
```

### Multiple choice (one correct) — `Task_Type` `"3"` (placeholder)

Correct option in `Answer`; the wrong options in `Camouflage`.

```jsonc
"Question": "<p style=\"font-size:12pt;\">Which scan type completes the full TCP handshake?</p>",
"Answer": "[{\"value\": \"TCP connect scan (-sT)\"}]",
"Camouflage": "[\"SYN / half-open scan (-sS)\", \"UDP scan (-sU)\", \"FIN scan (-sF)\"]",
"Task_Type": "3"
```

### Multi-select (several correct) — `Task_Type` `"4"` (placeholder)

Every correct option is a `value` in `Answer`; wrong options in `Camouflage`.
Make the prompt say "select all that apply".

```jsonc
"Question": "<p style=\"font-size:12pt;\">Select all protocols Nmap can version-detect. (Choose all that apply.)</p>",
"Answer": "[{\"value\": \"HTTP\"}, {\"value\": \"SSH\"}, {\"value\": \"FTP\"}]",
"Camouflage": "[\"A MAC address\", \"A CPU model\"]",
"Task_Type": "4"
```

### True / False — `Task_Type` `"3"` with two choices (placeholder)

```jsonc
"Question": "<p style=\"font-size:12pt;\">True or False: a closed TCP port replies with a RST packet.</p>",
"Answer": "[{\"value\": \"True\"}]",
"Camouflage": "[\"False\"]",
"Task_Type": "3"
```

### Alternative encoding (if the platform uses `Choices`)

If the platform instead expects a populated `Choices` array, the convention is a
list of option objects with a correctness flag, and `Answer`/`Camouflage` stay
`"[]"`. Switch to this only if the user confirms it:

```jsonc
"Choices": [
  {"id": 1, "text": "TCP connect scan (-sT)", "correct": true},
  {"id": 2, "text": "SYN / half-open scan (-sS)", "correct": false}
]
```

Keep whichever encoding the user confirms consistent across the whole module.

## HTML conventions (match the CTF files)

- Body: `<p style="font-size:12pt;">…</p>`; headings `<h3>/<h4>`; code `<code>`.
- Command blocks: `<pre class="language-bash"><code>┌──(kali㉿kali)-[~]\n└─$ <cmd></code></pre>`.
- Escape `&` as `&amp;` inside command/output blocks.
- End graded quiz prompts with the `<strong>Question:</strong>` and, for free
  text, `<strong>Answer Format:</strong>` lines, as the CTF tasks do.
