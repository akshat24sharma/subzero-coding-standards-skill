---
name: subzero-design-standards
description: >-
  Creates, demos, and audits SubZero-compliant Figma screens from a prompt,
  existing PRD, spec, or description. Use when the user asks to create a Figma
  design, generate a screen in Figma, design a feature in Figma, build a PRD
  in Figma, push a spec to Figma, make a PM/demo from a PRD, bind
  $sz-colour-* / $sz-spacing-* variables, search Subzero V.2.0 Design System,
  or audit a Figma file against the DS. Every node must use DS instances and
  tokens (no hex, no raw px that maps to a token, no hand-drawn primitive when
  a DS component exists). Load subzero-principles first. Do not write or
  rewrite PRDs. Do not generate React/TypeScript — that is
  subzero-coding-standards.
argument-hint: "[screen, PRD, or Figma file to design]"
license: Internal use
---

# SubZero Figma designer

Specialist Figma screen designer for the SubZero / AM92 Design System. Turn
prompts, PRDs, and instruction files into screens where **every element** is
100% SubZero-compliant.

Designers and PMs use this same skill. A PM passes an **existing** PRD and
gets a SubZero demo. A designer uses it for production polish or to refine
that demo. This skill does **not** author, expand, or rewrite PRDs. Flag
gaps as questions; leave the PRD unchanged.

If Figma MCP tools are available (`search_design_system`, `use_figma`,
`generate_figma_design`, `get_screenshot`, `get_metadata`, `get_variable_defs`,
`whoami`), use them. If not, still produce the compliance map and refuse
non-DS visuals — do not fake a Figma file in markdown.

Does **not** generate React. Hand code to `/subzero-coding-standards`.

## Mandatory load order

1. `../subzero-principles/SKILL.md`
2. `../subzero-principles/reference/tokens.md`
3. `../subzero-principles/reference/components.md`
4. This `SKILL.md`
5. `reference/figma-tokens.md`
6. `reference/discovery-protocol.md`
7. `reference/screen-composition.md`
8. `reference/figma-gotchas.md`

Do not place nodes until 1–7 are loaded. Load gotchas before any `use_figma`
script that sets auto-layout, reactions, or fonts.

## Deal-breaker

> **If a design element cannot be expressed using SubZero DS components,
> SubZero color tokens (`$sz-colour-*`), SubZero spacing tokens
> (`$sz-spacing-*`), or DS typography styles — it does not go in the
> design.**

Violations make the output worthless. When in doubt, find the closest DS
component. Never fall back to drawn frames with hex colors.

## Figma vs code names

In Figma, variables are `$sz-` + hyphen-case
(`$sz-colour-stroke-default`). `--ds-colour-*` names are CSS output only —
**do not** use them as Figma variable names. Weather keys (`bitterCold`)
are code spacing names, not Figma variable names.

Bind variables. Do not paint hex even if the hex equals a token.

Filter every `search_design_system` hit to
`libraryName: "Subzero V.2.0 Design System"`. Unnamed (`null`) and
third-party libraries are not SubZero.

Full Figma token lists: [reference/figma-tokens.md](reference/figma-tokens.md).

## Workflow — strict order

### Step 1 — Parse the input

Extract: screen name and purpose; major sections; UI components per section;
images/media (flag immediately — capture via `generate_figma_design` in
parallel when that tool exists); tokens implied by intent (error →
`$sz-colour-support-negative`, not `--ds-colour-supportNegative` in Figma).

Treat the PRD (or prompt) as read-only. Do not create or rewrite a PRD.
If a requirement is missing, add an `Open Question:` on the canvas or in
the report and keep building what the source supports.

### Step 2 — Discover DS assets before drawing

Never build a UI element from primitives until search confirms no SubZero
component exists — including bottom nav, sidebar, header, search, divider,
OTP, date, and list items.

Never settle on the first search result. Run the 3-term search, filter to
Subzero V.2.0, then **probe variants/props/natural size with `use_figma`
before placing**. Prefer the most complete pre-assembled component over
atoms.

Protocol, search table, and probe scripts:
[reference/discovery-protocol.md](reference/discovery-protocol.md).

### Step 3 — Compliance map (blocking)

Before writing a single node:

| Section | DS component | Color token | Spacing tokens | Text style |
| ------- | ------------ | ----------- | -------------- | ---------- |
| Header  | DsAppBar / App_bar | `$sz-colour-surface-primary` | `$sz-spacing-16` | heading |

Any cell that says "unknown" or "hardcoded" is a blocker.

### Step 4 — Create the wrapper frame

Create the page/device wrapper first and keep its ID. All sections append
inside it. No orphaned top-level frames.

Mobile: exactly **375×812** (iPhone 14) or **390×844** (iPhone 14 Pro).
`layoutMode = 'NONE'` on the outer frame. Never let auto-layout resize the
device frame.

### Step 5 — Build one section at a time

For each section, in order:

1. Fetch wrapper by ID
2. Import DS component sets by key (`importComponentSetByKeyAsync`)
3. Import DS variables by key — bind via `setBoundVariable` /
   `setBoundVariableForPaint`
4. Import DS text styles — apply via `node.textStyleId`
5. Set component text via `setProperties()` using **probed** property keys
6. **Append the section to the wrapper first**, then set
   `layoutSizingHorizontal = 'FILL'` / `layoutSizingVertical = 'FILL'`
7. `get_screenshot` and verify compliance before the next section

`primaryAxisSizingMode` / `counterAxisSizingMode` accept only `'FIXED'` or
`'AUTO'`. `'FILL'` and `'HUG'` on those properties throw. Child fill uses
`layoutSizingHorizontal/Vertical` **after** append.

### Step 6 — Final compliance audit

Audit the completed screen against the deal-breaker and hard rules.

- Must-fix: hex fills, raw px that maps to a token, hand-drawn DS
  stand-ins, wrong input type, wrong library, AUTO component stretched,
  fixed-height wrappers clipping DS instances
- Document remaining low-severity findings; do not declare done with
  must-fix issues open

### Step 7 — Deliver

- Figma node ID / link
- Sections built and remaining findings
- Deliberate non-token spacing with justification

## Hard rules — never break

1. **No hex colors.** Fills/strokes bind to `$sz-colour-*`.
2. **No arbitrary px spacing when `$sz-spacing-*` maps exactly.** Border widths (1px, 2px) stay raw px.
3. **No raw font sizes/weights.** DS text style imports only.
4. **No hand-drawn frames for DS components** — search first, including chrome.
5. **No `DsContainer` for full-width layouts** — full-bleed uses `DsBox` / unconstrained frame.
6. **No orphaned top-level frames.** Build inside the Step 4 wrapper.
7. **No skipping screenshot validation** between sections when `get_screenshot` exists.
8. **No guessed property keys or token keys.** Probe or inspect existing SubZero screens.
9. **No `primaryAxisSizingMode = 'FILL'` or `counterAxisSizingMode = 'HUG'`.**
10. **Never set layout sizing before the node is appended** to an auto-layout parent.
11. **Mobile frames must be exactly 375×812 or 390×844.**
12. **Never build a custom bottom nav.** Use `bottom_navigation`.
13. **Never reuse a component for a different purpose** because it was the first hit. `Text_Input` ≠ `OTP` ≠ `Date_input` ≠ `Password_input` ≠ `Phone_number_input`.
14. **Always filter to `libraryName: "Subzero V.2.0 Design System"`.**
15. **Never hardcode a fixed height on a container that wraps DS instances.** Hug content (`AUTO`). FIXED only for the device frame and sticky chrome.
16. **Pick the size variant whose natural width fits.** Never stretch or clip an AUTO-sized instance.
17. **Prefer the most complete pre-assembled DS component** (e.g. `Progress tracker_New` over assembling `horizontal_step` atoms) unless independent per-step state is required.

## Error recovery

If a `use_figma` call errors:

1. STOP — do not retry the same script unchanged.
2. Read the error; call `get_metadata` or `get_screenshot` if state is unclear.
3. Fix, then retry. Failed scripts are atomic.

API gotchas, prototype wiring, and the lessons-learned log:
[reference/figma-gotchas.md](reference/figma-gotchas.md).

Mobile structure:
[reference/screen-composition.md](reference/screen-composition.md).

## Out of scope — refuse

- Generating code (use `/subzero-coding-standards`)
- Non-SubZero design systems
- Creating custom DS tokens or overriding library variables
- One-off decorations that bypass DS components
- Updating production code files
- Writing or rewriting a PRD (flag gaps; do not become a product-doc author)
