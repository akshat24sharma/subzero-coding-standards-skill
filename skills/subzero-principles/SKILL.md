---
name: subzero-principles
description: >-
  Shared SubZero / AM92 (@am92/react-design-system) language: which token,
  which Ds* component, typography, and loading/empty/error/disabled states.
  Use when the user asks what spacing/color/radius to use, $sz- vs --ds-
  names, DsButton vs DsChip vs DsBox, bottom nav, OTP vs date vs text input,
  or the canonical component inventory. Also covers shared UX guardrails,
  experience behaviours, and content design (voice Simple / Trustworthy /
  Purposeful; tone by screen and new vs existing user). Shared rule: if it
  is clipped or overflows the device, it is not done. Also load first
  whenever applying subzero-coding-standards or subzero-design-standards.
  Does not generate React/JSX or Figma nodes by itself.
argument-hint: "[screen, component, or token question]"
license: Internal use
---

# SubZero principles (shared)

This skill is the shared SubZero / `@am92/react-design-system` contract.
It is **not** a coding or Figma workflow. Role skills load this first,
then apply their own job.

| Role | Then load | Slash command |
| ---- | --------- | ------------- |
| Developer writing React/TS | `subzero-coding-standards` | `/subzero-coding-standards` |
| Designer, or PM making a demo from an existing PRD | `subzero-design-standards` | `/subzero-design-standards` |

## Mandatory load order

Before making product, design, or code decisions that touch SubZero UI:

1. This `SKILL.md`
2. `reference/tokens.md`
3. `reference/components.md`
4. `reference/ux-guardrails.md`
5. `reference/experience-behaviours.md`
6. `reference/content-design.md`

Then load the role skill for the current task.

## The one rule

> **If a UI element can be expressed with a SubZero component, a SubZero
> token, or a DS typography style — it must be.** Raw HTML, hand-drawn
> primitives, hex colors, and raw pixel spacing that maps to a token are
> violations, not style choices.

When in doubt, find the closest DS component. Never invent a new primitive,
token name, or typography variant.

> **If it is clipped or overflows the device, it is not done.** Token and
> component compliance does not excuse cropped copy, overflowing text, or
> clipped chrome.

## What is shared vs role-specific

**Shared (this skill)**

- Token categories and exact-match rule (no rounding, no invented names)
- Canonical component inventory (intent → `Ds*` / Figma DS equivalent)
- Layout rule: `DsBox` for full-width; `DsContainer` only for constrained/centered content
- Required UI states: default, loading, empty, error, disabled, success where relevant
- Shared UX guardrails, experience behaviours, and content design (voice,
  tone by screen × new vs existing user)
- Speak in DS language (`DsButton` primary, `$sz-spacing-16` / `--ds-spacing-bitterCold`)

**Not shared**

- React `sx` rules, HTML-to-JSX mapping, Redux 5-file API pattern → coding skill
- Figma screens (including PM demos from an existing PRD) → design skill

## Naming systems (same tokens, two surfaces)

| Surface | Color example | Spacing example |
| ------- | ------------- | --------------- |
| Code / CSS | `var(--ds-colour-actionPrimary)` | `var(--ds-spacing-bitterCold)` (16px) |
| Figma | `$sz-colour-action-primary` | `$sz-spacing-16` |

Do not mix systems. Designers never write `--ds-*` into Figma variables.
Developers never write `$sz-*` into `sx`. Product copy may name either
surface, but each artifact stays consistent (Figma file vs code).

Full lists: [reference/tokens.md](reference/tokens.md).

## Component choice

Prefer the most specific DS component that matches intent. Prefer a complete
pre-assembled DS control over assembling atoms (a progress tracker beats a
row of step chips unless per-step state is required).

```text
Search          → DsSearchbar before DsTextField
Chat composer   → 3.0 Ai Search before DsSearchbar or V.2.0 Text_Input
Status / pill   → DsChip or DsTag before DsBox
Chat category   → DsTag when that is the library mapping
Image           → DsImage before a raw image frame
Table           → DsTable family before stacked rows
Button          → DsButton; icon-only → DsIconButton
Toggle          → DsToggle / DsSwitch (verify which exists)
Bottom nav      → DS bottom navigation, never circles + labels
```

**Do not reuse a component for a different purpose** because it was nearby
or first in search:

```text
Text entry  ≠ OTP ≠ date ≠ phone/amount ≠ password ≠ search
Figma names: Text_Input ≠ OTP ≠ Date_input ≠ Phone_number_input
             ≠ Password_input ≠ search field
```

A simpler API or a faster draw is not a reason to substitute. Full inventory:
[reference/components.md](reference/components.md).

## States every SubZero UI must name

If a screen has data, actions, or roles, the artifact (brief, design, or code)
must account for:

- Default, focus / active
- Loading / skeleton
- Empty (missing + why + next step)
- Error / negative support (problem + recovery)
- Disabled / permission-hidden / consent
- Success where an action completes
- Offline / unavailable and recovery where the brief has them
- Pending / failed / expired on money flows when relevant

Use support tokens for semantic status (`supportNegative`, `supportPositive`,
`supportWarning`, `supportTypical`) — never a one-off red/green hex. Pair
status with an icon, label, or shape, not colour alone.

Guardrails, behaviours, and copy (always):
[reference/ux-guardrails.md](reference/ux-guardrails.md),
[reference/experience-behaviours.md](reference/experience-behaviours.md),
[reference/content-design.md](reference/content-design.md).

**If it is clipped or overflows the device, it is not done.**

## Out of scope

This skill does not generate React, Figma nodes, or PRD files. After loading
it, continue in `/subzero-coding-standards` or `/subzero-design-standards`.
