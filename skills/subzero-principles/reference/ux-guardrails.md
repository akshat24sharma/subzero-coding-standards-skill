# Shared UX guardrails

Applies to design and code. Does not replace the one rule (DS component +
token). Does not cover legal or compliance process (consent logs, model-risk
kill switches, audit workflows).

Read this as decision rules. Product copy, device size, and feature set come
from the brief.

## Expressive behaviour

- Informative before expressive. Motion and tone explain state; they do not
  decorate.
- Never colour alone. Pair every status with an icon, label, or shape change
  (colour-blind safe).
- Calm by default. Banking is high-stakes; stay subtle unless the moment
  needs more. Calm is not flat: step surfaces, elevate sheets, and use one
  accent family (see conversational colour stack when the UI is chat).
- Reduced motion is first-class. Every animated state has a static
  equivalent.
- Tokens only. No hex, no raw px that maps to a token.
- One behaviour, three platforms. Shared state logic; native rendering may
  differ.

## Safety in the UI

- Confirm before any irreversible or money-moving action. Show the facts
  that matter (amount, payee, or equivalent) plus a proceed control and a
  dismiss control. Labels come from the brief.
- Never invent an account or financial fact. Loading and empty copy state
  uncertainty instead of a guessed number or insight.
- The customer can dismiss or opt out of proactive prompts when the product
  offers them.
- Escalation to a human, when the product has it, is one control and carries
  context. Do not invent a handoff if the brief does not include one.

## Accessibility

- WCAG 2.2 AA is the floor.
- Works for low literacy, low bandwidth, and assistive tech. Do not rely on
  motion or colour to carry meaning.
