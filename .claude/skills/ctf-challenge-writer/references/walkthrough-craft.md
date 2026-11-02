# Writing walkthroughs — craft and house style

Goal: a student who finished the challenge (or got stuck) can read the
walkthrough task and understand *exactly* how the answer was reached — the real
commands, what each one does, what the output means, and how this step connects
to the last. Plain language, no gaps, no pep talk.

## What the user asked for, and what to avoid

Write **direct explanations**. The platform owner has specifically asked you to
drop rhetorical framing — no "Why this matters", no "Why is this important",
no motivational asides. Those add words without teaching. Instead, fold the
reason into the plain description of what you are doing ("The scan listed the
services; the next thing we need from the web server is its exact version, so we
read the response headers"). Teach the *how* and the *what*.

Also keep the language simple and the transitions smooth. Each task should read
as the next move in one continuous operation, picking up a thread from the task
before it.

## Per-task structure

Use this order. It mirrors the house style already in the platform's files, with
the editorializing removed.

1. **Lead-in (1–2 sentences).** Connect from the previous step and say what you
   are about to find out now. Plain and concrete.
2. **A short, direct explanation of the idea**, only as much as the step needs.
   State it as fact, not as a "Background" lecture. One or two sentences.
3. **The command(s)**, each in its own kali block:
   ```html
   <pre class="language-bash"><code>┌──(kali㉿kali)-[~]
   └─$ <command></code></pre>
   ```
4. **Observed output**, in its own block, trimmed to the relevant lines:
   ```html
   <p style="font-size:12pt;">Observed result:</p>
   <pre class="language-bash"><code><output></code></pre>
   ```
5. **Command notes** — a short list explaining each command and flag in plain
   words, so a beginner knows what every part did:
   ```html
   <h4>Command notes</h4>
   <ul>
     <li style="font-size:12pt;"><code>-sV</code> — probe each open port to
       identify the service and its version.</li>
   </ul>
   ```
6. **Restate the question and answer format**, matching the questions file so
   the two stay aligned:
   ```html
   <p style="font-size:12pt;"><strong>Question:</strong> …</p>
   <p style="font-size:12pt;"><strong>Answer Format:</strong> <code>…</code></p>
   ```

Not every task needs all six parts — a one-command lookup can be lead-in,
command, output, one note. A multi-step task (enumerate, then pivot) can repeat
parts 3–5 per command. Use judgement; keep it complete but not padded.

## Worked example (one task)

```html
<p style="font-size:12pt;">The scan told us a web server is listening on port
80. Before we open the site, we read its response headers to learn exactly which
software and version it runs — that version guides everything we try against the
web application.</p>
<pre class="language-bash"><code>┌──(kali㉿kali)-[~]
└─$ curl -sI http://172.16.20.10/</code></pre>
<p style="font-size:12pt;">Observed result (the line that matters):</p>
<pre class="language-bash"><code>Server: Apache/2.4.52 (Ubuntu)</code></pre>
<h4>Command notes</h4>
<ul>
  <li style="font-size:12pt;"><code>curl</code> — a command-line web client.</li>
  <li style="font-size:12pt;"><code>-s</code> — silent; hides the progress meter.</li>
  <li style="font-size:12pt;"><code>-I</code> — request only the headers (a HEAD request), because the version is in the <code>Server</code> header.</li>
</ul>
<p style="font-size:12pt;"><strong>Question:</strong> What is the web server software and version?</p>
<p style="font-size:12pt;"><strong>Answer Format:</strong> <code>Software/X.Y.Z (Ubuntu)</code></p>
```

## Where the commands come from

- If the user gave a solution (JSON or PDF), use *its* commands and outputs as
  the source of truth. Clean up the prose and structure, but do not invent
  different commands or different output than the lab actually produces.
- If you are writing the walkthrough from the questions file alone, use the
  standard, well-known command for each step and make clear the output shown is
  the expected/representative result for this lab. Keep every command consistent
  with the answers in the file (the command must actually yield the stored
  answer).
- Keep IPs, hostnames, usernames, paths, and flag values identical to what the
  questions file and answers imply. Consistency across tasks is what makes the
  walkthrough trustworthy.

## Intro and wrap-up tasks

- The walkthrough's **intro** is the same storyline/overview as the questions
  file's intro (same task, same id/metadata). It can add a line about the format
  of the walkthrough (guided, N tasks, difficulty, rough time) — but it must not
  change the task count relationship with the questions file.
- A **wrap-up / remediation** task is optional. If you include one, keep it in
  *both* files so the counts stay equal, and make it a `Task_Type` `5` info task
  with an empty answer. A good wrap-up recaps the attack chain in order, lists
  concrete fixes for each weakness, and can map steps to MITRE ATT&CK — stated
  plainly, still no "why this matters" framing.

## Final check

Re-read the walkthrough against the questions file: same number of tasks, same
order, same titles, and every stored `Answer` is actually produced by the
commands you show. Then run `scripts/validate_pair.py` on the pair.
