# Content design (voice and tone)

Applies to **every** design and code task that writes user-facing words:
labels, buttons, errors, loaders, empty states, success, OTP, notifications,
modals, help. Tokens and components stay in the other principle files.

Facts, amounts, and feature set still come from the brief. This file
decides **how** we say those facts.

Source: Content Design System 2.0 (Tone, Tone mapping — Retail, Voice).
Retail wording (PAN, mobile number, ₹) is the default for SubZero.

Companion: [ux-guardrails.md](ux-guardrails.md) (what the UI must do),
[experience-behaviours.md](experience-behaviours.md) (journey behaviour).

## How to apply

1. Keep **voice** the same on every screen (Simple, Trustworthy, Purposeful).
2. Pick **tone** from the table: screen type × **new** vs **existing** user.
   If the brief does not say, assume **new** for first-run / KYC / OTP
   first time, and **existing** for logged-in repeat tasks.
3. Write to the “How to write” column. Do not invent account or money facts.
4. Guardrails still win on conflict: safety and clarity before delight.
   No jokes on loaders. No moral tone on warnings. No blame on errors.

Voice is the stable personality. Tone is how we say it in this situation.

## Voice

Three qualities stay recognizable even when tone changes.

**Simple.** Warm, usable language. Short. No banking jargon unless the
customer already uses that term (PAN, OTP, IFSC). Invite, do not lecture.

**Trustworthy.** Clear and honest. Say what is happening and why when we
ask for data. Do not manufacture confidence or hide consequence.

**Purposeful.** Every line earns its place. Lead with what the customer
needs to do or know. Cut filler.

## Tone by screen

### Onboarding / login

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Curious, cautious, confused, hopeful, overwhelmed (login: doubtful, unsure about safety) | Welcoming, simple, confidence-building (login: reassuring + clear) | Short steps (1–2 lines). Avoid jargon. Explain **why** for every detail you ask. Verbs first (“Add PAN”). |
| Existing | Impatient, goal-focused, expecting continuity | Direct, respectful of time | Skip introductions. Minimal instructions. Show progress (“2 steps left”). |

### Loader / waiting

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Anxious, afraid of errors | Calming + guiding | Human reassurance (“We are verifying your details”). No jokes. Timeframe if known. |
| Existing | Impatient | Neutral, time-aware | State what is happening. Keep it short (“Almost done…”). |

### Help and feedback

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Lost, hesitant, afraid to make mistakes | Supportive, friendly | Clear ways to get help. Plain words. No technical terms. |
| Existing | Seeking confirmation, slight frustration | Empathetic, solution-focused | Answers to the point. Link to action (“Try again”, “Update details”). |

### Warning messages

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Alarmed, confused | Supportive, friendly | Clear help path. Plain words. No technical terms. |
| Existing | Alert, wants a quick fix | Direct + corrective | Clear consequence. Clear action. No moral tone. |

### Information messages

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Curious, unsure | Clear + educational | Everyday language. One fact per message. |
| Existing | Seeking clarity | Neutral + factual | Straight to the point. Highlight important numbers (₹, %). |

### Error messages

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Stressed, embarrassed, stuck | Soft, non-blaming | What went wrong, simply. Give a fix. No technical words. |
| Existing | Irritated, in a hurry | Straightforward, solution-first | Next step first. Keep text minimal. |

Still pair with guardrails: problem + recovery, never “Something went
wrong” or “Invalid {field}” with no format help.

### Notifications

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Curious, cautious | Friendly + concise | Start with benefit. One line. |
| Existing | Routine, selective attention | Value-first | Why it matters. No fluff. |

### Labels (fields and buttons)

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Confused, seeking clarity | Literal + simple | Common Indian terms (mobile number, PAN). Avoid abbreviations. |
| Existing | Familiar, skimming | Precise | Short, verb-first CTAs (“Add PAN”, “View details”). |

Controls still name the **outcome** (ux-guardrails): not Submit / Proceed
/ Click here / a vague Continue unless the table’s action is truly
continue-after-decision.

### Empty states

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Unsure, confused | Guiding, encouraging | Tell them what to do. Short sentences. |
| Existing | Neutral, exploring | Helpful + instructive | One action point. No philosophical lines. |

### Modals (benefits or consequences)

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Curious but overwhelmed | Simplified + benefit-first | Start with why it matters. Bullet-style phrasing. |
| Existing | Quick decision-maker | Crisp, high-value | Key benefit. One clear action (“Continue”). |

Use a modal only when the user must decide before continuing (ux-guardrails).

### Task completion (success)

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Relief, confidence, happiness | Positive + reassuring | Acknowledge (“Well done”). State what is done. Show what’s next. |
| Existing | Quick confirmation, moving on | Short + affirming | Short copy (“Done”). Optional next action. |

### OTP flow

| User | Emotional range | Tone | How to write |
| ---- | --------------- | ---- | ------------ |
| New | Nervous, unsure about safety | Trust-building + clear | Why OTP is needed. Mention it is secure. Simple instructions. |
| Existing | Routine, impatient | Direct, predictable | Show timer. Simple CTA (“Verify OTP”). |
