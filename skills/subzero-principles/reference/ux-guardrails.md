# Shared UX guardrails

Applies to **every** design and code task that uses these skills. Does not
replace the one rule (DS component + token). Does not cover legal process
(consent logs, model-risk kill switches, audit workflows).

Copy, amounts, and feature set come from the brief. These rules decide
behaviour when the brief is silent or principles collide.

Source: Axis Experience System v1.0 (Proposed), distilled. Subzero still
owns tokens, components, and implementation.

## When principles conflict

Use this order. It is a sequence, not a score.

```text
1. Safety and customer protection
2. Clarity and comprehension
3. Customer agency and control
4. Accessibility and inclusion
5. Task efficiency
6. Consistency and reuse
7. Expression and delight
```

If expression or novelty reduces clarity on a high-stakes money action,
clarity wins. If reuse conflicts with a safer recovery path, safety wins.

## Task first

Before drawing or coding a screen, name: user goal, primary task, key
decision, critical facts, success, and failure/recovery. Design the task,
then the screen.

## Hierarchy and action

- One clear **page purpose**, then primary information, then **one**
  primary action, then supporting info and secondary actions.
- Do not give unequal actions equal visual weight. Secondary uses a quieter
  DS variant.
- Progressive disclosure: show what is needed for this decision. Hide
  complexity, **not** fees, limits, eligibility, permissions, or
  consequences — those stay discoverable.
- Related things sit close; unrelated things get more space. Use spacing
  tokens to say that, not one-off px.

## Trust and agency

- Confirm when the action is financially consequential, destructive,
  irreversible, hard to recover, or unexpected. Skip confirm for routine
  reversible taps (avoid confirm fatigue).
- Confirm surfaces show the facts that matter plus proceed and dismiss.
- **Default for convenience; confirm for consequence.** Do not pre-select
  payees, amounts, investments, or consent.
- Suggestion is not execution. AI and automation may recommend; the
  customer approves before money or irreversible change.
- Undo, cancel, edit, retry, or escalate when the product has those paths.
  Do not invent a handoff the brief does not include.
- Never invent an account or financial fact. Loading and empty copy state
  uncertainty.
- No false urgency, no hidden consequences, no security theatre, no
  overuse of warning colour.
- Security copy is specific and calm. Do not scare to look “safe.”

## Every state is the product

Name more than the happy path. Minimum: default, focus/active, loading,
success, error, empty, disabled, offline/unavailable, permission/consent,
recovery.

For money also consider: pending, failed, reversed, expired, timed out,
partial, duplicate, limit exceeded, auth required.

Never leave the customer wondering whether the system heard them.

- **Empty:** what is missing, why it matters, what they can do.
- **Error:** what happened + why (if useful) + what they can do now.
  Not “Something went wrong.” Not “Invalid {field}” with no format help.
- **Loading:** the system is working; say what is loading when it helps;
  skeleton for known structure; do not use motion to hide slowness.
- Preserve entered data after errors. Avoid duplicate submit on retry.

## Content

- Clear, concise, contextual, human, action-oriented, transparent,
  respectful.
- Plain language. No internal or backend terms. No blame for system
  failure.
- Controls name the **outcome** (pay the bill, add a beneficiary), not
  Submit / Proceed / Click here / a vague Continue.
- Dates, currency, and amounts are unambiguous.

## Forms and dialogs

- Ask only what is needed. Group related fields. Right input type (OTP ≠
  text ≠ amount). Validate at the useful moment. Required vs optional is
  obvious.
- For regulated fields, explain why when the brief requires it.
- Use a modal only when the user must decide before continuing. Not for
  long content, routine info, or comparing with the page. Prefer inline,
  sheet, or a dedicated step.

## Journey, not only the screen

- Consider before and after this step. Progress visible on long or
  consequential flows (`DsProgressTracker` when that is the control).
- Design for interruption: network loss, auth expiry, backgrounding.
  Preserve progress, restore context, avoid duplicate transactions.
- Show the **decision** before a raw dataset (summary, then detail).
- Localisation: layouts survive longer copy, Indian languages, wrapping,
  and dynamic names/amounts. Do not design to a fixed string length.

## Accessibility (floor)

- WCAG 2.2 AA. Design the accessible path first.
- Never colour alone for error, success, status, selection, required, or
  risk.
- Visible focus, logical order, accessible names, keyboard on web.
- Comfortable touch targets; the hit area may be larger than the icon.
- Reduced motion is first-class. Every animated state has a static twin.
- Gesture-only actions need an alternative.
- Low literacy, low bandwidth, assistive tech.

## Motion and expression

- Every movement has a reason: change, cause, hierarchy, feedback.
- Motion must not delay a money task, hide state, or decorate.
- Informative before expressive. Calm is not flat: step surfaces, elevate
  sheets, one accent family.
- Tokens only. One behaviour, three platforms (shared state; native
  render may differ).

## Intelligence (any AI or automation)

```text
Explain → Recommend → Confirm → Act → Recover
```

Not: Predict → Act → Inform.

- Visible when AI materially affects an outcome (if the brief requires
  disclosure, do not hide it).
- Explanation scales with consequence.
- Show uncertainty when it affects the decision. Do not manufacture
  confidence.
- Recovery: correct, retry, stop, or escalate with context. Never “AI
  failed → restart the whole journey.”

Full chat slots and colour stack:
[../../subzero-design-standards/reference/conversational-ui.md](../../subzero-design-standards/reference/conversational-ui.md)
when the UI is conversational.

More “design for / avoid” on journeys and copy:
[experience-behaviours.md](experience-behaviours.md).
