# Experience behaviours

Companion to [ux-guardrails.md](ux-guardrails.md). Same rules, with the
small asks and avoids consumers should apply on every journey, form, and
AI surface. Still Subzero for tokens and components. Copy comes from the
brief.

## Simplify

**Ask:** Can they understand this without knowing how the bank works?

Design for: hierarchy over density; plain language; disclosure over
dumping everything; meaningful defaults; one primary action; steps for
complex processes.

Avoid: internal terms; long instruction walls; extra choices; forms that
expose backend shape; making the customer decode system states.

## Trust

**Ask:** Would they feel confident doing this with their money?

Design for: clear transaction states; confirm consequence; visible fees
and limits; honest uncertainty; error prevention then recovery.

Avoid: vague confirms; hidden side effects; fake urgency; warning colour
as decoration; reassurance with no facts.

## Agency

**Ask:** Does this help them act, or only follow the system?

Design for: clear choices; undo/cancel/edit/retry; consent for
consequence; human escalation when the product has it; recommendations
visibly different from actions.

## Useful before expressive

**Ask:** Does this motion, colour, or flourish make it clearer, safer, or
easier to continue? If not, remove it.

High-stakes moments stay calmer, not louder.

## Meaningful states

Immediate feedback. Actionable errors. Useful empty. Clear completion.
Recovery path. Pending money is a first-class state, not a spinner on the
happy path.

## Whole journey

**Ask:** What do they need immediately before and after this?

Context continuity, saved progress, no re-asking known facts, clear
handoffs across steps or channels when the brief has them.

## Meet people where they are

Consistency is shared foundations, not identical screens. Adapt density
and chrome to mobile, web, assisted, or internal — same tokens and
components.

## Clear before clever

New patterns only when they solve a real problem. Familiar
nav/search/forms/sheets/confirms. If it is only different, it is not
better.

## Inclusive confidence

If it only works for the ideal user, it is not finished. Contrast, focus,
targets, type, screen reader, reduced motion, colour independence, simple
language, resilient layout.

## Intelligence

People should know: what the system knows, what it is doing, why it
recommended something, how sure it is when that matters, what needs
approval, what they can change, what happens next.

The more consequential the decision, the more visible the reasoning,
control, and recovery.

## Calm confidence

Prefer: stable layout, clear progress, focused CTA, human language.
Avoid: alert spam, aggressive urgency, visual noise, decorative motion,
overloaded dashboards, fear-driven copy.

## Progress visible

Where they are, what remains, how to resume after interruption. Use the
DS progress control when the journey is stepped.

## Content (write like this)

| Do | Do not |
| -- | ------ |
| Short, active, specific | Jargon, internal names, unexplained abbrev. |
| Next step in the control | Submit / Proceed / Click here |
| Format hint before or with the field | “Invalid account number” only |
| Empty: missing + why + action | “No data” |
| Error: problem + recovery | “Something went wrong” |
| “We couldn’t complete {action}” | Blame the customer |

## Forms

- Necessary fields only; logical order; group related.
- Preserve input after error; autofill when appropriate.
- Examples and constraints up front for account numbers, IFSC, amounts.
- Do not repeat the same password/rule wall on every field.

## Affordances

Clickable, selected, disabled, and expandable must look it. Do not hide
an important action in a gesture. Icon-only controls still need a name
for assistive tech.

## Data

Summary and decision first; table, filters, and search when they need
the set. Meaningful units and dates. Do not dump a raw ledger as the
first view if a safe summary exists.

## Performance is UX

First meaningful content, progressive load, stable layout (no surprise
shift), feedback on tap. Offline or degraded when the brief has it.

## AI surface (small rules)

Idle → receiving → thinking → generating → answer → explanation if
needed → action → confirm → success or recovery.

Users can tell listening vs thinking vs waiting for approval vs unable.

Recommendation copy stays a suggestion. Execution copy is a separate
control after confirm.

If stuck: explain the limit, keep context, offer another path, escalate
when the product allows — do not reset the thread.

## System first (reminder)

Search Subzero → compose → extend only if needed → ask before inventing.
One-off UI needs a reason. Repeating problems belong in the system, not
a custom control.
