---
name: subzero-coding-standards
description: >-
  Writes, edits, and reviews React/TypeScript UI that is 100% compliant with
  @am92/react-design-system (SubZero). Use when implementing a screen in code,
  generating or fixing JSX/TSX, mapping HTML or Figma to Ds* components,
  styling with the sx prop, choosing --ds-spacing/--ds-colour/--ds-radius
  tokens, using Code Connect, replacing raw HTML/hex/px, or wiring the 5-file
  Redux API pattern. Also use for DS code review and common sx mistakes.
  For chat / assistant UI, also load conversational-ui.md. Load
  subzero-principles first. Do not use to create or edit Figma files,
  generate Figma screens, or write PRDs — those use subzero-design-standards.
argument-hint: "[component or file to review/generate]"
license: Internal use
---

# SubZero coding standards

This skill teaches any coding agent how to write code that is 100% compliant
with `@am92/react-design-system` (internally called "SubZero" or "DS"). It is
framework-agnostic with respect to _orchestration_ — it does not assume any
particular agent runtime, tool names, or folder convention. It only assumes:

- The target project has `@am92/react-design-system` installed
- You are generating or editing React + TypeScript code

If you are also given Figma-derived HTML/mapping data as input, this skill
tells you what to do with the _design system_ parts of that data. It does not
cover Figma-specific tooling (MCP calls, node IDs, etc.) — that's a separate
concern from "is this code DS-compliant." Use `subzero-design-standards` for
Figma (including a demo from an existing PRD). Do not use this skill to write PRDs.

## Mandatory Skill Load Order

Before generating, editing, or reviewing any JSX/TSX code, agents must read:

1. `../subzero-principles/SKILL.md`
2. `../subzero-principles/reference/tokens.md`
3. `../subzero-principles/reference/components.md`
4. `../subzero-principles/reference/ux-guardrails.md`
5. `SKILL.md` (this file)
6. `reference/token-reference.md`
7. `reference/common-mistakes.md`
8. `reference/validation-checklist.md`
9. `reference/api-integration-pattern.md` (required for API-connected UI changes)
10. `../subzero-design-standards/reference/conversational-ui.md` when the UI is chat / assistant

Do not proceed with code changes until items 1-8 are loaded. If the task
includes API wiring, item 9 is also mandatory. Shared token/component language
lives in `subzero-principles`; this skill owns `sx`, HTML→JSX mapping, and the
Redux API pattern.

---

## Mandatory design-to-code gates

These gates are blocking requirements, not suggestions. For any Figma-to-React
task, complete them before writing JSX. If a gate cannot be completed, stop and
ask for clarification or approval rather than choosing a visually plausible
fallback.

### Gate 1 — Code Connect authority

If Figma provides a Code Connect snippet or mapped component, use that mapped
SubZero component. Preserve the snippet's component choice and explicitly
provided props while adapting only imports, syntax, handlers, and local data.

Do not substitute a different DS component because its API is easier. Do not
add omitted `variant`, `color`, `size`, or state props based on generic MUI
conventions. An omitted prop is intentionally unspecified until verified from
the Figma variant metadata, the installed component types, or an existing local
usage.

Before editing, record these decisions in the working response or plan:

```text
Code Connect component: <component or NONE>
Preserved props: <props copied from the snippet>
Verified additions: <props confirmed by Figma/local DS evidence>
Unresolved choices: <NONE or question requiring approval>
```

### Gate 2 — Specific-component precedence

When a specific SubZero component exists for the design intent, use it before a
generic component:

```text
Search control -> DsSearchbar before DsTextField
Status/filter pill -> DsChip or DsTag before DsBox
Image -> DsImage before DsBox component='img'
Table -> DsTable family before flex/grid rows
```

A simpler API is not evidence for a substitution. If the specific component
API differs from the Code Connect example, adapt the handler and props to the
local API and verify its type declaration; do not replace the component without
approval.

### Gate 3 — DS component styling approval

Do not use `sx` to override a SubZero component's visual treatment by default.
First use the component's documented props, variants, colors, and states. If
the design cannot be expressed through those props, inspect the installed type
declaration and local usage, then stop for explicit approval before adding a
visual `sx` override.

Layout `sx` on a DS component remains allowed where this skill permits it.
Visual overrides include `color`, `backgroundColor`, `border`,
`borderColor`, `borderRadius`, typography, elevation, opacity, and pseudo-state
rules. Tokenizing an override does not make it automatically approved.

### Gate 4 — Final evidence check

Before finishing, verify all four conditions:

- Code Connect components were preserved where provided.
- No DS component was replaced by a generic component for convenience.
- No variant, color, size, or state was inferred without evidence.
- Every visual `sx` override on a DS component is either absent, documented by
  the component API, or explicitly approved.

If any condition fails, the implementation is not SubZero-compliant.

## The one rule that matters most

> **If a UI element can be expressed with a SubZero component, a SubZero
> token, or a typography variant — it must be. Raw HTML elements, hex colors,
> raw pixel spacing that maps to a token, and inline shadows are violations,
> not style choices.**

Everything below is a refinement of this one rule for specific cases.

## Component API verification

Before using a SubZero component, verify its installed type declaration or an
existing local usage. Do not infer behavior from the component name. Record
the verified component and props in the evidence record required by Gate 4.

Use the verified API to resolve ambiguous patterns:

- Binary visual switch: verify whether the package provides `DsToggle` or
  `DsSwitch` for the intended interaction.
- Images: verify that `DsImage` uses `srcSet` and provide entries in the
  package's expected shape, such as `srcSet={[{ src, alt }]}`.
- Tabs: prefer the `DsTabs` + `DsTab` composition when supported by the
  installed API.
- Icons: use semantic `color` props where the component exposes them.

If the declaration and local usage disagree, follow the installed declaration
for the target package version and flag the conflict for review.

---

## 1. HTML → Design System component mapping

Never emit raw HTML elements in JSX. Always check this table first.

| Raw HTML / pattern                                                        | Use instead                                                                                                     | Notes                                                                                                                                                                                            |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<div>`                                                                   | `DsBox`                                                                                                         | Generic container. Use `DsContainer` only for constrained/centered content — never for full-width content (see §6).                                                                              |
| `<div style="display:flex; flex-direction:column/row">`                   | `DsStack`                                                                                                       | Primary flex layout primitive. `direction` defaults to `'column'` — **never** set it explicitly to `'column'`. Gap via `sx={{ gap: 'var(--ds-spacing-*)' }}` only — never a bare number. See §4. |
| `<span>`, `<p>`, `<h1>`–`<h6>`                                            | `DsTypography`                                                                                                  | Style via the `variant` prop only. Cannot carry layout props — wrap in `DsBox` if layout is needed.                                                                                              |
| `<button>`                                                                | `DsButton`                                                                                                      | Text content in `children`, **not** a `label` prop. Icon-only buttons → `DsIconButton`. See §4.                                                                                                  |
| `<input>`                                                                 | `DsTextField`                                                                                                   | Forms use `DsTextField` (or Formik/RHF-wrapped equivalents — see techStack adaptation below).                                                                                                    |
| `<select>` / dropdown                                                     | `DsSelect`                                                                                                      | Use `options={[{label, value}]}` prop. **Never** `<option>` children. See §4.                                                                                                                    |
| `<input type="checkbox">`                                                 | `DsCheckbox`                                                                                                    |                                                                                                                                                                                                  |
| `<i>`, `<svg>` (icons)                                                    | `DsRemixIcon`                                                                                                   | **Font-based icon** — `className="ri-icon-name"` sets the icon (no `icon` prop). Size with `fontSize`, never `width`/`height`. See §4.                                                           |
| Filter chips, status badges, category pills                               | `DsChip`                                                                                                        | Use `type`, `color`, `outlined` props. Never build pill shapes with `DsBox` + raw `borderRadius`.                                                                                                |
| Status labels, category tags                                              | `DsTag`                                                                                                         | Requires both `label` (display text) **and** `value` (internal key). `selected` prop for selection state. See §4.                                                                                |
| Step indicator / wizard                                                   | `DsProgressTracker`                                                                                             | Do not use a deprecated `DsStepper`.                                                                                                                                                             |
| Tabular data                                                              | `DsTable`                                                                                                       | Never build tables out of flex/grid layouts.                                                                                                                                                     |
| Top navigation shell                                                      | `DsHeader`                                                                                                      | Full-bleed top bar. Do not build custom.                                                                                                                                                         |
| Secondary nav bar with back / action icons                                | `DsAppBar`                                                                                                      | `navigation` prop: back icon node. `actions` prop: array of icon nodes. See §4.                                                                                                                  |
| Tooltip / `title` attribute                                               | `DsTooltip`                                                                                                     |                                                                                                                                                                                                  |
| Collapsible section / `<details>`                                         | `DsAccordion`                                                                                                   |                                                                                                                                                                                                  |
| Slider, modal, autocomplete, date picker, file uploader, pagination, tabs | `DsSlider`, `DsModal`, `DsDialog`, `DsAutocomplete`, `DsDatePicker`, `DsFileUploader`, `DsPagination`, `DsTabs` | Never hand-build these. If no DS component exists, stop and ask before writing 50+ lines of custom positioning logic.                                                                            |
| `<img>` / images                                                          | `DsImage`                                                                                                       | DS image component — use instead of raw `<img>`. Verify the installed API; this package uses `srcSet={[{ src, alt }]}`.                                                                                                                                    |
| `<hr>` / divider line                                                     | `DsDivider`                                                                                                     |                                                                                                                                                                                                  |
| `<a>` / hyperlink                                                         | `DsLink`                                                                                                        |                                                                                                                                                                                                  |
| Loading spinner / full-page loader                                        | `DsLoader`                                                                                                      | Drop-in loading state. Do not build a custom spinner.                                                                                                                                            |
| Progress bar                                                              | `DsLinearProgress`                                                                                              |                                                                                                                                                                                                  |
| Toast / snackbar notification                                             | `DsNotistack` + `DsToast`                                                                                       | Wrap your app root with `DsNotistackProvider`. Trigger toasts via the `enqueueSnackbar` / `useSnackbar` hook. Do not build custom overlays.                                                      |
| Bottom sheet                                                              | `DsBottomSheet`                                                                                                 | Mobile-first drawer anchored to bottom. Wraps `DsDrawer` internally.                                                                                                                             |
| Side panel / drawer                                                       | `DsDrawer`                                                                                                      |                                                                                                                                                                                                  |
| `<input type="radio">` / radio group                                      | `DsRadio` inside `DsRadioGroup`                                                                                 | `DsRadioGroup` provides the `value` + `onChange` contract; `DsRadio` is the individual option.                                                                                                   |
| Avatar / profile picture                                                  | `DsAvatar`                                                                                                      | Prop `ds-size`: `'XS'` \| `'S'` \| `'M'` \| `'L'` \| `'XL'`. Never build circular avatars with `DsBox` + `borderRadius: '50%'`.                                                                  |
| Badge / notification dot                                                  | `DsBadge`                                                                                                       |                                                                                                                                                                                                  |
| FAB / floating action button                                              | `DsFab`                                                                                                         |                                                                                                                                                                                                  |
| Context menu / popup menu                                                 | `DsMenu` + `DsMenuItem`                                                                                         | Never build a custom positioned dropdown.                                                                                                                                                        |

**Import pattern** — all DS components and types are named exports from one package:

```tsx
import {
  DsBox,
  DsStack,
  DsTypography,
  DsButton
} from '@am92/react-design-system'
import type { DsBoxProps, SxProps } from '@am92/react-design-system'
```

Never import from sub-paths (`@am92/react-design-system/DsBox`) — the barrel export is the only supported entry point.

**Default when a component type is unrecognized**: fall back to `DsBox`,
and flag it (a comment or a structured note, depending on what your
environment supports) rather than guessing a specific DS component.

---

## 2. Design tokens — the only acceptable styling values

SubZero ships five token categories. **Token names are fixed and finite.**
Never invent, infer, or approximate a token name.

### Token source policy (MANDATORY)

1. **Primary source (always required):** read `reference/token-reference.md`
   before mapping any style value. This file is the authoritative token list
   for this project.
2. **Secondary source (fallback only):** if the reference file is missing,
   incomplete, or a token cannot be resolved, verify directly from the installed
   package:

```bash
cat node_modules/@am92/react-design-system/dist/tokens/spacing.js
cat node_modules/@am92/react-design-system/dist/tokens/colors.js
cat node_modules/@am92/react-design-system/dist/tokens/radius.js
```

**The complete token list for every category lives in
`reference/token-reference.md` — 20 spacing tokens, 10 radius tokens, 12
elevation tokens, 61 color tokens, and 28 verified typography composites
(a 29th may exist in later package versions — verify against the live package
if you need an uncommon variant). Read that file before mapping any style
value to a token.** The summary below is oriented, not exhaustive — do not
treat it as the full list.

### Spacing tokens (`--ds-spacing-*`) — 20 total, see full list in reference file

```
var(--ds-spacing-glacial)     8px
var(--ds-spacing-bitterCold)  16px
var(--ds-spacing-mild)        24px
var(--ds-spacing-warm)        32px
```

These four are common cases, not the full set. The complete list of 20
(including `deepFreeze`, `quickFreeze`, `gelid`, `frostbite`, `cool`,
`pleasant`, `tepid`, `tropical`, `hot`, `blazing`, `molten`, `superheated`,
`meltdown`, `whiteHot`, `plasma`, and `zero`) is in
`reference/token-reference.md`. **If a px value isn't an exact match to one
of the 20, there is no token for it — don't guess a name, don't round to the
nearest one.**

### Color tokens (`--ds-colour-*`) — 61 total, see full list in reference file

```
var(--ds-colour-typoPrimary)
var(--ds-colour-typoSecondary)
var(--ds-colour-actionPrimary)
var(--ds-colour-surfacePrimary)
```

These four are common cases, not the full set. The complete list of 61
(grouped by purpose: action, surface, typography, neutral, icon, stroke,
support/semantic, state, overlay) is in `reference/token-reference.md`.
Never hardcode a hex value when a token exists for that semantic role —
check the full list before assuming none does.

### Radius tokens (`--ds-radius-*`) — 10 total, see full list in reference file

```
--ds-radius-zero         0px
--ds-radius-deepFreeze   2px
--ds-radius-quickFreeze  4px
--ds-radius-gelid        6px
--ds-radius-glacial      8px
--ds-radius-frostbite    12px
--ds-radius-bitterCold   16px
--ds-radius-cool         20px
--ds-radius-mild         24px
--ds-radius-pleasant     28px   ← maximum
```

This is the full list — 10 of 10. There is **no** `--ds-radius-circular`,
`--ds-radius-round`, or `--ds-radius-pill` — these names do not exist and
must never be emitted, no matter how visually appropriate they sound.
(`plasma`, `hot`, `warm` are _spacing_ tokens, not radius tokens — a common
confusion to avoid.)

For circular avatars, pills, or any radius beyond 28px, use a raw value with
an explanatory comment:

```tsx
sx={{ borderRadius: '100px' /* Pill shape - no DS token */ }}
sx={{ borderRadius: '50%' /* Circular avatar - no DS token */ }}
```

### Elevation tokens (`--ds-elevation-*`) — 12 total, note the prefix exception

```
--ds-elevation--1   inset shadow
--ds-elevation-0    flat / none
--ds-elevation-1    subtle shadow
--ds-elevation-2    cards, raised elements
--ds-elevation-3
--ds-elevation-4    modals, overlays
--ds-elevation-6
--ds-elevation-8    navigation, floating elements
--ds-elevation-9
--ds-elevation-12
--ds-elevation-16
--ds-elevation-24   maximum depth
```

This is the full list — 12 of 12 (keys are bare numbers, not names like
spacing/radius). Never hardcode a `boxShadow` value. Always use an elevation
token instead.

> ⚠️ Some codebases may carry a legacy `--sz-elevation-*` series alongside
> `--ds-*`. If your project's RULES-ENGINE / equivalent doc says elevation
> tokens specifically keep the `--sz-` prefix (a documented exception), follow
> that local override. Otherwise default to `--ds-elevation-*`. This is the
> **one** token category where you should check local project docs before
> assuming the `--ds-` prefix applies — every other token category uses
> `--ds-` exclusively.

### Typography — variants, never manual font properties — 29 total, see full list in reference file

```tsx
variant = 'headingBoldLarge' // h1-equivalent
variant = 'headingBoldMedium' // h2-equivalent
variant = 'bodyRegularMedium' // p-equivalent
variant = 'supportRegularMetadata' // small/caption-equivalent
```

These four are common cases, not the full set. The complete list of 28
verified composites (display/heading/subheading/body/support families,
including italic variants) is in `reference/token-reference.md`. `variant`
controls
font-size, font-weight, line-height, and letter-spacing together — never set
these individually via sx.

### When no token matches

If a value genuinely doesn't map to any token after checking the complete
list in `reference/token-reference.md` (e.g. a one-off 15px gap from a
design), use the raw value with a comment marking it as a gap, not a silent
override:

```tsx
sx={{ gap: '15px' /* awaiting token */ }}
```

Never approximate to the _nearest_ token if the values don't match exactly —
that silently corrupts the design system's spacing scale. And never invent a
plausible-sounding name for a category that has a fixed, finite list — check
`reference/token-reference.md` first, every time, not just when a name
"feels" uncertain.

---

## 3. The `sx` prop — allowed vs forbidden

### ✅ Allowed in `sx`

- Layout: `display`, `flexDirection`, `justifyContent`, `alignItems`, `gap`
- Positioning: `position`, `top`, `left`, `right`, `bottom`, `zIndex`
- Sizing: `width: '100%'`, `height: '100%'`, `minWidth: 0`, `flex: '1 0 0'`
- Viewport units — **page shell wrapper only**: `height: '100vh'`, `width: '100vw'`
- On `DsTypography` specifically: `color` is the _only_ sx property allowed

### ❌ Forbidden in `sx`

- **`backgroundColor` with a raw hex/rgba** — if a background colour is genuinely needed, use a `--ds-colour-*` token: `backgroundColor: 'var(--ds-colour-surfaceBackground)'` ✅ vs `backgroundColor: '#FFFFFF'` ❌
- `color` on components other than `DsTypography` and `DsRemixIcon` — text colour belongs on `DsTypography`; icon colour belongs on `DsRemixIcon` via `sx={{ color: 'var(--ds-colour-icon*)' }}`
- `border` as a raw value — use stroke tokens and annotate the reason if a border is necessary outside a DS component
- `borderRadius` as raw px when a DS radius token exists — use `var(--ds-radius-*)` (see §2 for the 10 valid names)
- Typography properties: `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` — these belong to `variant`, never to `sx`
- Pseudo-states: `'&:hover'`, `'&:focus'`, `'&:active'` — trust the component's built-in states
- Raw `padding: '16px'` or `margin: '16px'` as plain px strings — use MUI spacing shorthand props **with DS tokens**: `px: 'var(--ds-spacing-bitterCold)'`, `py: 'var(--ds-spacing-mild)'` etc. The shorthands (`px`, `py`, `pt`, `pb`, `pl`, `pr`) are valid when paired with a token
- Fixed pixel sizes on layout containers: `width: '328px'`, `height: '400px'`, `minHeight`, `maxHeight` — use `'100%'`, `flex: '1 0 0'`, or let content drive height (exception: annotate a structural sidebar with `/* Figma sidebar: NNNpx */`)
- Viewport units on **inner** containers — `100vh`/`100vw` causes scroll bugs on mobile; reserve for the single outermost page-shell wrapper only
- Hardcoded `boxShadow` values — use elevation tokens (`var(--ds-elevation-0)` through `var(--ds-elevation-24)`)
- Visual overrides on DS components without explicit approval — use the
  component API first; see the mandatory design-to-code gates above

```tsx
// ✅ correct — layout only in sx
<DsButton variant="contained" color="primary" sx={{ display: 'flex' }}>Save</DsButton>
<DsTypography variant="bodyBoldMedium" sx={{ color: 'var(--ds-colour-typoPrimary)' }}>Text</DsTypography>

// ✅ correct — backgroundColor with a DS colour token is valid
<DsBox sx={{ backgroundColor: 'var(--ds-colour-surfaceBackground)', px: 'var(--ds-spacing-bitterCold)' }}>
  ...
</DsBox>

// ❌ wrong — raw hex in backgroundColor
<DsBox sx={{ backgroundColor: '#FFFFFF' }}>...</DsBox>

// ❌ wrong — appearance override + pseudo-state in sx
<DsButton sx={{ backgroundColor: 'red', '&:hover': { opacity: 0.8 } }}>Save</DsButton>

// ❌ wrong — typography properties in sx instead of variant
<DsTypography sx={{ fontSize: '16px', fontWeight: 'bold', flex: '1 0 0' }}>Text</DsTypography>
```

### Typography layout exception

`DsTypography` cannot carry layout props at all — not even `flex` or
`display`. If a text element needs layout behavior, wrap it:

```tsx
// ✅ correct
<DsBox sx={{ flex: '1 0 0', display: 'flex', justifyContent: 'flex-end' }}>
  <DsTypography
    variant='bodyBoldMedium'
    sx={{ color: 'var(--ds-colour-typoActionSecondary)' }}
  >
    Text
  </DsTypography>
</DsBox>
```

### Icon sizing

```tsx
// ✅ correct — font-based icon, size with fontSize; color with a DS icon token
<DsRemixIcon className="ri-check-line" sx={{ fontSize: '20px', color: 'var(--ds-colour-iconPositive)' }} />

// ❌ wrong — width/height do nothing on a font glyph
<DsRemixIcon sx={{ width: '24px', height: '24px' }} />
```

---

## 4. Component-specific prop rules

The DS components below have non-obvious prop APIs that models frequently get wrong. This is the authoritative reference — do not assume prop names based on analogy with HTML or other frameworks. Always check the actual component types file when unsure (`node_modules/@am92/react-design-system/dist/Components/{Component}/{Component}.Types.d.ts`).

### DsStack — flex layout container

`DsStack` is the primary flex layout primitive. It replaces `<div style="display:flex">`.

```tsx
// ✅ column stack (direction is 'column' by default — omit it)
<DsStack sx={{ gap: 'var(--ds-spacing-mild)' }}>
  <ChildA />
  <ChildB />
</DsStack>

// ✅ row stack
<DsStack direction='row' sx={{ gap: 'var(--ds-spacing-glacial)', alignItems: 'center' }}>
  <ChildA />
  <ChildB />
</DsStack>

// ✅ responsive direction
<DsStack direction={{ xs: 'column', lg: 'row' }} sx={{ gap: 'var(--ds-spacing-mild)' }}>
  ...
</DsStack>

// ❌ wrong — direction='column' is the default, setting it explicitly is redundant
<DsStack direction='column'>...</DsStack>

// ❌ wrong — gap must be a token string, never a bare number
<DsStack gap={8}>...</DsStack>
<DsStack sx={{ gap: 16 }}>...</DsStack>
```

### DsSelect — dropdown

```tsx
// ✅ correct
<DsSelect
  label="Account type"
  options={[
    { label: 'Savings', value: 'savings' },
    { label: 'Current', value: 'current' }
  ]}
  value={selected}
  onChange={handleChange}
/>

// ❌ wrong — <option> children are not supported by DsSelect
<DsSelect>
  <option value="savings">Savings</option>
</DsSelect>
```

### DsTag — status / category label

```tsx
// ✅ correct — both label and value are required
<DsTag label="Active" value="active" />

// ✅ with selection state
<DsTag
  label="Statement"
  value="statement"
  selected={activeFilter === 'statement'}
  onClick={() => setActiveFilter('statement')}
/>

// ❌ wrong — label is required; value alone is not sufficient
<DsTag value="active" />
```

### DsChip — filter chip / badge

```tsx
// ✅ correct
<DsChip label="Low Stock" type="nudge" color="warning" />
<DsChip label="Active" type="status" outlined />

// ❌ wrong — never hand-build chip shapes with DsBox + hard-coded border-radius
<DsBox sx={{ borderRadius: '100px', px: 'var(--ds-spacing-glacial)' }}>
  <DsTypography>Low Stock</DsTypography>
</DsBox>
```

Do not add `sx` to change a chip's color, border, radius, typography, or
opacity merely to match a Figma screenshot. First resolve the state through
`type`, `color`, and `outlined` or the component's documented API. If the DS
API cannot represent the design, stop and request approval for the override.

### DsButton — text content via children

Valid `variant` values: `"contained"` | `"outlined"` | `"text"`
Valid `color` values: `"primary"` | `"secondary"` | `"warning"` (and other MUI palette keys)

```tsx
// ✅ correct
<DsButton color="primary">Primary CTA</DsButton>
<DsButton color="secondary">Secondary Action</DsButton>
<DsButton variant="text" color="primary">Text / Link-style</DsButton>

// ❌ wrong — DsButton has no label prop
<DsButton label="Save" variant="contained" />

// ❌ wrong — these variant names do not exist
<DsButton variant="filled" />
<DsButton variant="primary" />
```

When Code Connect supplies a button snippet, preserve its `variant`, `color`,
`size`, and state props exactly. Do not infer `variant='outlined'` for a
secondary action from MUI convention or visual similarity. If Code Connect
omits a prop, verify it from Figma variant metadata, installed types, or a
local usage before adding it; otherwise leave it omitted or ask for approval.

### DsRemixIcon — className carries the icon, not an icon prop

```tsx
// ✅ correct — className sets the icon; fontSize sets the size
<DsRemixIcon className="ri-arrow-left-line" sx={{ fontSize: '24px' }} />

// ❌ wrong — there is no icon prop
<DsRemixIcon icon="ri-arrow-left-line" />

// ❌ wrong — width/height do nothing on a font glyph
<DsRemixIcon className="ri-arrow-left-line" sx={{ width: '24px', height: '24px' }} />
```

### DsAppBar — navigation shell with named slots

```tsx
// ✅ correct
<DsAppBar
  color="default"
  navigation={<DsRemixIcon className="ri-arrow-left-line" />}
  actions={[
    <DsRemixIcon key="search" className="ri-search-line" />,
    <DsRemixIcon key="notification" className="ri-notification-3-line" />
  ]}
/>

// ❌ wrong — DsAppBar uses navigation/actions props, not children
<DsAppBar>
  <DsRemixIcon className="ri-arrow-left-line" />
</DsAppBar>
```

### DsTextField — always controlled

```tsx
// ✅ correct — always controlled: value + onChange together
<DsTextField
  label="PAN Number"
  value={pan}
  onChange={e => setPan(e.target.value)}
  helperText="10-character alphanumeric"
  fullWidth
/>

// ✅ with end adornment (icon uses DS icon colour token)
<DsTextField
  label="Mobile Number"
  value={mobile}
  success
  readOnly
  endAdornment={
    <DsRemixIcon
      className="ri-check-line"
      sx={{ color: 'var(--ds-colour-iconPositive)' }}
    />
  }
  fullWidth
/>

// ❌ wrong — uncontrolled (no value + onChange pair)
<DsTextField label="PAN Number" defaultValue="" />

// ❌ wrong — raw <input> instead of DsTextField
<input type="text" value={pan} onChange={e => setPan(e.target.value)} />
```

For a search control, use `DsSearchbar` when it exists or when Figma Code
Connect maps the design to it. Use `DsTextField` only for a genuine text-field
pattern or when `DsSearchbar` is unavailable and the substitution is recorded
and approved. Do not choose `DsTextField` solely because its controlled API is
simpler.

An assistant composer is a different intent: use the library / Code Connect
chat or AI input when one exists. Do not reuse `DsSearchbar` because it is
nearby. See `../subzero-design-standards/reference/conversational-ui.md`.

---

## 5. Component architecture rules

- **200-line limit per component.** Beyond that, extract sections into their
  own files (`ComponentHeader.tsx`, `ComponentForm.tsx`, `ComponentTable.tsx`)
  with single responsibility each.
- **Sub-components wrapped in `React.memo`.**
- **Logic extracted into custom hooks**, not left inline in the component body.
- **Interactive elements always have explicit state** (`useState`,
  controlled value + onChange) — never a static/uncontrolled DS component
  standing in for something interactive.

```tsx
export const ComponentHeader = React.memo<HeaderProps>(({ title, onBack }) => {
  return <DsBox>{/* ... */}</DsBox>
})

// hooks/useComponentState.ts
export const useComponentState = () => {
  const [state, setState] = useState(initialState)
  const handlers = useMemo(
    () => ({ handleUpdate: data => setState(prev => ({ ...prev, ...data })) }),
    []
  )
  return { state, handlers }
}
```

---

## 6. Layout container rules

`DsContainer` constrains width (commonly to something like 584px) — never
use it for full-width content like wide tables.

```tsx
// ❌ wrong — squeezes a wide table into a constrained container
<DsContainer><WideTable /></DsContainer>

// ✅ correct — full-width content uses DsBox
<DsBox sx={{ width: '100%', maxWidth: 'none !important' }}>
  <WideTable />
</DsBox>

// ✅ correct — DsContainer is fine for genuinely constrained content
<DsContainer maxWidth="lg"><FormContent /></DsContainer>
```

---

## 7. Legacy SubZero (`--sz-*`) → Design System (`--ds-*`) conversion

If you encounter or are asked to migrate older SubZero token references,
apply this conversion:

```tsx
--sz-colour-typo-primary           → --ds-colour-typoPrimary
--sz-spacing-16                    → --ds-spacing-bitterCold   // only if px matches exactly
$sz-typo-heading-bold-large        → variant="headingBoldLarge"

// Never keep a fallback value when converting
var(--sz-spacing-16, 16px)         → var(--ds-spacing-bitterCold)   // NOT var(--ds-spacing-bitterCold, 16px)
```

Elevation is the **documented exception** — check whether your project keeps
`--sz-elevation-*` as the canonical elevation namespace (see §2) before
converting those specifically.

---

## 8. Responsive design

Two mechanisms are available. Use the right one for the job.

### DS breakpoints

| Key | px value | Typical target |
| --- | -------- | -------------- |
| xs  | 0px      | Mobile         |
| sm  | 414px    | Large mobile   |
| md  | 744px    | Tablet         |
| lg  | 1280px   | Desktop        |
| xl  | 1440px   | Wide desktop   |

Primary pair: **`xs` + `lg`** covers most mobile/desktop splits.

### Mechanism 1: `withBreakpoints` HOC — show/hide whole component trees

Use when different devices need completely different component trees. Imported directly from `@am92/react-design-system` — no local HOC file needed.

```tsx
import type { IwithBreakpoints } from '@am92/react-design-system'
import { withBreakpoints } from '@am92/react-design-system'

interface IMyComponentProps extends IwithBreakpoints {
  // component-specific props
}

const MyComponent = ({ breakpoints }: IMyComponentProps) => {
  // Derive convenience flags from the injected breakpoints map
  const isMobile = breakpoints.xs || breakpoints.sm // 0–743px
  const isDesktop = breakpoints.lg || breakpoints.xl // ≥1280px

  return (
    <DsBox>
      {isMobile ? <MobileView /> : <DesktopView />}
      {!isMobile && <DesktopOnlySection />}
    </DsBox>
  )
}

export default withBreakpoints(MyComponent)
```

`breakpoints` is a map of `{ xs, sm, md, lg, xl }` booleans where each is `true` only when the viewport is **currently** in that exact range. Derive higher-level flags yourself (`isMobile`, `isDesktop`, etc.).

### Mechanism 2: `sx` breakpoint objects — CSS responsive values

Use when the same component renders at all sizes but values differ.

```tsx
// ✅ correct — token values at each breakpoint
<DsStack
  direction={{ xs: 'column', lg: 'row' }}
  sx={{
    gap: { xs: 'var(--ds-spacing-mild)', lg: 'var(--ds-spacing-warm)' },
    width: { xs: '100%', lg: '63.64%' }
  }}
>

// ✅ correct — spacing shorthands work too
<DsBox sx={{ px: { xs: 'var(--ds-spacing-bitterCold)', lg: 'var(--ds-spacing-mild)' } }}>

// ❌ wrong — raw px in breakpoint values
<DsBox sx={{ gap: { xs: '16px', lg: '32px' } }}>
```

Rules:

- Breakpoint values **must** use DS tokens — never raw px or bare numbers
- Only specify breakpoints where values actually change (MUI cascades upward)
- `100vh`/`100vw` in breakpoint objects follows the same rule as non-responsive sx — outermost shell wrapper only

---

## 9. API integration pattern (Redux + `@am92/web-http`)

When the project's `techStackManifest` (or equivalent local convention)
indicates Redux + `@am92/web-http`, new API integrations follow a fixed
5-file structure. See `reference/api-integration-pattern.md` for the full
template with working code for each file.

**ServiceTracker** is the project's automatic loading/error state system. When you dispatch an action created by `serviceActionCreator`, it tracks three states per service name: `LOADING`, `SUCCESS`, and `ERROR`. A selector like `serviceTrackerSelector(state, 'feature/actionName')` returns the current state. **Never** add a manual `useState<boolean>` for loading flags alongside ServiceTracker — doing so duplicates state and causes stale-flag bugs.

If the project instead uses React Query, Formik, Zod, or another stack —
adapt rather than forcing this pattern. See the techStackManifest table in
`reference/api-integration-pattern.md`.

---

## 10. Before you start coding

Quick gate to run before writing any JSX, not after:

- [ ] Checked the target component's actual props API in `reference/` or §4 of this skill rather than assuming prop names
- [ ] Verified any token you're about to use against the real token source files (§2) rather than recalling it from memory
- [ ] Planned state management for every interactive element up front
- [ ] Confirmed whether the data is tabular — if so, `DsTable` is mandatory, not optional
- [ ] For any API work: checked the actual request/response contract (Postman collection, OpenAPI spec, or equivalent) before writing types

## 11. Validation — what to check before calling code done

Full rule-by-rule checklist with fix snippets lives in
`reference/validation-checklist.md`. Always run through it before returning
generated or edited code as final. The condensed version:

- [ ] No raw HTML elements anywhere
- [ ] All colors, spacing, radius, and shadows use tokens — no hex, no raw px where a token matches, no inline shadow CSS
- [ ] `backgroundColor` only with a `var(--ds-colour-*)` token, never raw hex
- [ ] Typography uses `variant` only — `sx` on `DsTypography` contains `color` and nothing else
- [ ] Icons sized with `fontSize`, never `width`/`height`; `DsRemixIcon` uses `className`, not `icon` prop
- [ ] No pseudo-state overrides in `sx` (`&:hover`, `&:focus`, etc.)
- [ ] `DsStack` direction omitted when column (the default); gap uses a token string
- [ ] `DsSelect` uses `options={[{label, value}]}` prop, not `<option>` children
- [ ] `DsTag` has both `label` and `value` props
- [ ] `DsButton` text is in `children`, not a `label` prop
- [ ] Interactive components have explicit state
- [ ] Components stay under ~200 lines; sub-components extracted and wrapped in `React.memo`
- [ ] API services return raw responses with no transformation
- [ ] No manual `isLoading` `useState` when ServiceTracker is available
- [ ] No legacy `--sz-*` tokens left unconverted (elevation may be a documented exception — confirm locally)

**If something is unclear** — an API contract, where a reducer should live,
which folder a hook belongs in — ask rather than assume. Don't guess and
move forward silently.

---

## 12. Most common mistakes (read this if you only read one more file)

`reference/common-mistakes.md` documents the highest-frequency violations
seen in real usage, with the wrong version, the right version, and why. If
you're unsure whether something is a violation, check there first — it's
shorter than the full validation checklist and covers the cases that get
guessed wrong most often.

---

## Files in this skill

```
subzero-coding-standards/
├── SKILL.md                              ← you are here (12 sections: mapping, tokens, sx rules, component prop APIs, architecture, layout, legacy migration, responsive design, API pattern, pre-code checklist, validation, common mistakes)
└── reference/
    ├── token-reference.md                ← COMPLETE token list, all categories — check this before guessing any token name
    ├── validation-checklist.md           ← full rule list + fix snippets
    ├── common-mistakes.md                ← highest-frequency violations
    └── api-integration-pattern.md        ← 5-file Redux API template

Shared (load from `../subzero-principles/reference/`): `ux-guardrails.md`.
Chat screens also load `../subzero-design-standards/reference/conversational-ui.md`.
```
