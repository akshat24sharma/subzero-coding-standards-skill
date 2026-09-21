# SubZero validation checklist

Run through this before treating any generated or edited code as final.
Rules are grouped by tier — token-correctness and component-substitution
rules include a fix snippet because guessing wrong here is easy; mechanical
rules don't need one.

## Tier 0 — Design-to-code decision gates

These checks are blocking. Do not mark a Figma-derived implementation final if
any answer is negative or unknown.

### 0.0 Component API was verified

- Each SubZero component was checked against its installed type declaration or
  an existing local usage before implementation.
- Component behavior was not inferred from the component name.
- Binary visual switches use the verified `DsToggle` or `DsSwitch` API that
  matches the intended interaction.
- `DsImage` uses the verified source-set contract, such as
  `srcSet={[{ src, alt }]}`, when required by the installed package.
- Tabs use the verified `DsTabs` + `DsTab` composition when supported.
- Icons use semantic `color` props where the installed component exposes them;
  icon color was not forced through `sx` when that would be overridden.

### 0.1 Code Connect was honored

- If Code Connect provided a component, the implementation uses that exact DS
  component.
- Explicit Code Connect props were preserved.
- Omitted props were not filled in from generic MUI conventions.

### 0.2 Specific DS components were preferred

- `DsSearchbar` was used for a search control when available or mapped by Code
  Connect; `DsTextField` was not chosen only for API convenience.
- An assistant composer was **not** implemented as `DsSearchbar` when the
  library or Code Connect maps a dedicated chat / AI / ask input.
- `DsChip`/`DsTag`, `DsImage`, and the `DsTable` family were used for their
  corresponding patterns before generic DS primitives. Chat category filters
  follow the tag mapping when that is what Code Connect or the library uses.
- Any substitution is supported by an unavailable-component check and explicit
  approval.

### 0.3 DS visual overrides were approved

- DS component `sx` contains layout only unless the component API explicitly
  documents the visual property.
- No unapproved `color`, `backgroundColor`, `border`, `borderColor`,
  `borderRadius`, typography, elevation, opacity, or pseudo-state override was
  added to a DS component.
- A tokenized override is still an override and still requires approval.

### 0.4 Evidence record exists

The implementation notes or working response identify:

```text
Component API evidence:
Code Connect component:
Preserved props:
Verified additions:
Substitutions and approval:
Visual overrides and approval:
```

If this evidence cannot be produced, stop and ask before editing or finishing.

---

## Tier 1 — Token correctness (snippet included)

These are the highest-risk category: an agent without real SubZero context
will often invent a plausible-sounding token name or fall back to a raw
value. Always verify against the actual package source when unsure.

### 1. Hex/rgba color instead of a color token

```tsx
// ❌
sx={{ color: '#1A1A1A' }}

// ✅
sx={{ color: 'var(--ds-colour-typoPrimary)' }}
```

### 2. Raw pixel spacing where a token exists

```tsx
// ❌
sx={{ padding: '16px', gap: '24px' }}

// ✅
sx={{ gap: 'var(--ds-spacing-bitterCold)' }}
// padding should not be in sx at all — use component props (see Tier 3, #16)
```

### 3. Invalid or invented radius token name

```tsx
// ❌ — none of these names exist
sx={{ borderRadius: 'var(--ds-radius-circular)' }}
sx={{ borderRadius: 'var(--ds-radius-pill)' }}
sx={{ borderRadius: 'var(--ds-radius-round)' }}

// ✅ — one of the 10 real tokens (see token-reference.md), or a commented raw value
sx={{ borderRadius: 'var(--ds-radius-glacial)' }}
sx={{ borderRadius: '100px' /* Pill shape - no DS token */ }}
```

### 4. Hardcoded box-shadow instead of an elevation token

```tsx
// ❌
sx={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}

// ✅
sx={{ boxShadow: 'var(--ds-elevation-2)' }}
```

### 5. Fallback value left in a converted token

```tsx
// ❌ — fallback values defeat the purpose of migrating to a token
var(--ds-spacing-bitterCold, 16px)

// ✅
var(--ds-spacing-bitterCold)
```

### 6. Legacy `--sz-*` token not converted

```tsx
// ❌
sx={{ color: 'var(--sz-colour-typo-primary)' }}

// ✅
sx={{ color: 'var(--ds-colour-typoPrimary)' }}
```
Exception: elevation tokens may legitimately stay `--sz-elevation-*` if
that's the documented convention for the project — check local docs first.

### 6a. Figma color mapped to visually similar token instead of exact token

**MANDATORY for Figma → code workflows:**

Before implementing any design, extract **all** `var(--sz\/colour\/[name],[hex])`
patterns from the full Figma context into a lookup table:

```
Parsed from Figma:
{
  '#282828': 'typoPrimary',
  '#575757': 'typoSecondary',
  '#165964': 'typoTypical'  ← NOT 'typoPrimary' — different semantic role
}
```

Then resolve ONLY using this map. If `#165964` appears in the design:

```tsx
// ❌ — guessed similarity, missing the real token
sx={{ color: 'var(--ds-colour-typoPrimary)' }}  // #282828, wrong

// ✅ — exact match from parsed map
sx={{ color: 'var(--ds-colour-typoTypical)' }}  // #165964, correct
```

If a hex in the design doesn't appear in the parsed map, flag it for review
instead of guessing.

### 7. Typography styled with raw font properties instead of `variant`

```tsx
// ❌
<DsTypography sx={{ fontSize: '24px', fontWeight: 'bold' }}>Title</DsTypography>

// ✅
<DsTypography variant="headingBoldLarge">Title</DsTypography>
```

---

## Tier 2 — Component substitution (snippet included)

These are "Lessons Learned" mistakes — patterns that look reasonable in
isolation but bypass the design system.

### 8. Raw HTML element instead of DS component

```tsx
// ❌
<div className="card">
  <p>Total balance</p>
  <button onClick={handleSubmit}>Submit</button>
</div>

// ✅
<DsBox>
  <DsTypography variant="bodyRegularMedium">Total balance</DsTypography>
  <DsButton onClick={handleSubmit}>Submit</DsButton>
</DsBox>
```

### 9. Icon sized with `width`/`height` instead of `fontSize`

```tsx
// ❌ — font-based icon, width/height does nothing
<DsRemixIcon className="ri-user-line" sx={{ width: '24px', height: '24px' }} />

// ✅
<DsRemixIcon className="ri-user-line" sx={{ fontSize: '24px' }} />
```

### 10. Hand-built custom UI instead of an existing DS component

```tsx
// ❌ — 50+ lines reinventing a slider with absolute positioning
<DsBox sx={{ position: 'relative' }}>
  <DsBox sx={{ position: 'absolute', left: `${percentage}%` }} />
</DsBox>

// ✅
<DsSlider value={value} onChange={handleChange} />
```
If no DS component covers the pattern, stop and ask before building a
custom one — don't assume it's missing without checking.

### 11. `DsContainer` used for full-width content

```tsx
// ❌ — squeezes a wide table into a ~584px constraint
<DsContainer><WideTable /></DsContainer>

// ✅
<DsBox sx={{ width: '100%', maxWidth: 'none !important' }}>
  <WideTable />
</DsBox>
```

### 12. Tabular data built from flex/grid instead of `DsTable`

```tsx
// ❌
<DsStack sx={{ flexDirection: 'row' }}>{/* manually laid-out rows/columns */}</DsStack>

// ✅
<DsTable columns={columns} rows={rows} />
```

### 13. Deprecated stepper component

```tsx
// ❌
<DsStepper activeStep={step} steps={steps} />

// ✅
<DsProgressTracker ds-variant="steps" activeStep={step} steps={steps} />
```

### 14. Typography needing layout props left unwrapped

```tsx
// ❌ — DsTypography cannot carry layout props
<DsTypography sx={{ flex: '1 0 0', display: 'flex', justifyContent: 'flex-end' }}>
  Text
</DsTypography>

// ✅
<DsBox sx={{ flex: '1 0 0', display: 'flex', justifyContent: 'flex-end' }}>
  <DsTypography variant="bodyBoldMedium">Text</DsTypography>
</DsBox>
```

### 15. Pseudo-state styling overridden in sx

```tsx
// ❌
<DsButton sx={{ '&:hover': { opacity: 0.8 } }}>Save</DsButton>

// ✅ — trust the component's built-in hover state, or use a documented prop if one exists
<DsButton>Save</DsButton>
```

### 16. `DsStack` gap uses a bare number instead of a token

```tsx
// ❌ — numeric gap bypasses the token system
<DsStack gap={8}>...</DsStack>
<DsStack sx={{ gap: 16 }}>...</DsStack>

// ✅
<DsStack sx={{ gap: 'var(--ds-spacing-glacial)' }}>...</DsStack>
```

### 17. `DsStack` with redundant `direction='column'`

```tsx
// ❌ — column is the default, setting it explicitly is a violation
<DsStack direction='column'>...</DsStack>

// ✅ — omit direction entirely for column; only set for row or responsive
<DsStack>...</DsStack>
<DsStack direction='row'>...</DsStack>
<DsStack direction={{ xs: 'column', lg: 'row' }}>...</DsStack>
```

### 18. `DsSelect` using `<option>` children instead of `options` prop

```tsx
// ❌
<DsSelect>
  <option value="a">Option A</option>
</DsSelect>

// ✅
<DsSelect options={[{ label: 'Option A', value: 'a' }]} value={v} onChange={h} />
```

### 19. `DsTag` missing `label` prop

```tsx
// ❌ — value alone is insufficient
<DsTag value="active" />

// ✅ — both label and value are required; selected for selection state
<DsTag label="Active" value="active" selected={isActive} />
```

### 20. `DsButton` using `label` prop instead of `children`

```tsx
// ❌ — DsButton has no label prop
<DsButton label="Save" />

// ✅
<DsButton>Save</DsButton>
```

### 21. `DsRemixIcon` using `icon` prop instead of `className`

```tsx
// ❌ — there is no icon prop
<DsRemixIcon icon="ri-user-line" />

// ✅ — className carries the Remix icon class
<DsRemixIcon className="ri-user-line" sx={{ fontSize: '24px' }} />
```

---

## Tier 3 — Mechanical / structural rules (no snippet needed)

- [ ] No `padding`/`margin` as plain px strings in `sx` — use MUI spacing shorthand props with DS tokens (`px`, `py`, `pt`, `pb`, `pl`, `pr`) or component spacing props
- [ ] `backgroundColor` in `sx` only with a `var(--ds-colour-*)` token, never raw hex/rgba
- [ ] No fixed pixel `width`/`height`/`minHeight`/`maxHeight` on layout containers — use `'100%'`, `flex: '1 0 0'`, or let content size it (exception: annotate a structural sidebar width with `/* Figma sidebar: NNNpx */`)
- [ ] No `100vh`/`100vw` outside the single outermost page-shell wrapper
- [ ] `DsStack direction='column'` not set (it's the default — omit it)
- [ ] `DsStack` gap uses a DS spacing token string, not a bare number
- [ ] `DsSelect` uses `options={[{label, value}]}` prop — not `<option>` children
- [ ] `DsTag` has both `label` and `value` props
- [ ] `DsButton` text is in `children`, not a `label` prop
- [ ] `DsRemixIcon` uses `className="ri-*"` — not an `icon` prop
- [ ] Interactive components have explicit state — no static/uncontrolled component standing in for something interactive
- [ ] No component file exceeds ~200 lines — extract sections into their own files
- [ ] Sub-components are wrapped in `React.memo`
- [ ] No manual `isLoading` state when the project's service layer already tracks it (ServiceTracker)
- [ ] No direct `fetch`/`axios` calls when the project has an HTTP client convention (e.g. `@am92/web-http`)
- [ ] No business-logic transformation inside a service file — services return raw API responses
- [ ] No generic interface names (`ApiRequest`, `ApiResponse`) — use descriptive ones (`I_GET_INVOICES_REQ`, `I_GET_INVOICES_RES`)
- [ ] No `useEffect` directly calling `fetch`/`axios` — API calls go through the project's established service/hook layer
- [ ] Unused imports removed
- [ ] No raw numeric-looking strings passed where a token reference was expected
- [ ] Chat composer is not `DsSearchbar` or a generic text field when 3.0 `Ai Search` / the library AI input exists
- [ ] Chat bubbles and composer accents use colour tokens — no hex
- [ ] Loading / empty copy does not invent account or financial facts
- [ ] Empty states explain missing + why + next step
- [ ] Errors use problem + recovery, not “Something went wrong”
- [ ] User-facing strings follow content-design.md (voice + tone for this
      screen × new vs existing user)
- [ ] Primary control names the outcome (not Submit / Proceed / Click here)
- [ ] One primary action; secondaries use a quieter DS variant
- [ ] Confirm matches consequence (money / irreversible / unexpected) — not every tap
- [ ] Defaults do not pre-commit payees, amounts, consent, or investments
- [ ] AI recommendation is not a silent execute; confirm before act
- [ ] Irreversible or money-moving actions go through a confirm surface from the brief

---

## Tier 4 — Visual layout QA (crop / overflow / chrome)

Blocking. Token-correct code can still be unusable if copy is cropped or
chrome is clipped. If it is clipped or overflows the device, it is not done.

### 22. Message bubble or card clips copy

```tsx
// ❌ — FIXED height + overflow hidden crops long assistant/user copy
<DsBox sx={{ height: '24px', overflow: 'hidden' }}>
  <DsTypography variant="bodyRegularMedium">{message}</DsTypography>
</DsBox>

// ✅ — hug height; wrap inside parent; overflow hidden only on designed scrollers
<DsBox sx={{ width: '100%', maxWidth: '287px' }}>
  <DsTypography variant="bodyRegularMedium">{message}</DsTypography>
</DsBox>
```

### 23. Body / consent text wider than the parent (no wrap)

```tsx
// ❌ — measured unwrapped width (482px, 494–785px) overflows a 375 phone
<DsTypography variant="bodyRegularMedium" sx={{ width: '482px' }}>
  I agree to the terms
</DsTypography>

// ✅ — fill parent, wrap; minWidth 0 so flex items can shrink
<DsBox sx={{ width: '100%', minWidth: 0 }}>
  <DsTypography variant="bodyRegularMedium">{label}</DsTypography>
</DsBox>
```

### 24. Composer shorter than the field / send clipped

```tsx
// ❌ — labelled DsTextField still reserves label space; composer shorter than the field
<DsBox sx={{ position: 'fixed', bottom: 0, height: '24px', overflow: 'hidden' }}>
  <DsTextField label="Message" value={v} onChange={onChange} fullWidth />
</DsBox>

// ✅ — chat field has no label slot; composer hugs field + send + padding; pins to bottom
<DsBox
  sx={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    px: 'var(--ds-spacing-bitterCold)',
    py: 'var(--ds-spacing-glacial)',
    gap: 'var(--ds-spacing-glacial)'
  }}
>
  <DsTextField value={v} onChange={onChange} fullWidth placeholder="Ask…" />
  <DsIconButton aria-label="Send">{/* send */}</DsIconButton>
</DsBox>
```

Do not pass `label=""` and leave the label wrapper occupying ~24px. Omit
the label (or use the library chat/AI input) so the field hugs ~44px.

### 25. Open suggestion list covering the composer

Do not render an expanded `DsSelect` / suggestion menu inline in a 375
column if it collides with the pinned composer. Use a closed field;
open the menu in a sheet or so it does not eat the composer.

### Visual layout checklist (implemented UI)

- [ ] No `overflow: 'hidden'` on bubbles/cards unless the region is a designed scroller
- [ ] No FIXED height on a bubble/card shorter than the text
- [ ] Wrapping body copy uses parent width (`width: '100%'`, `minWidth: 0`, `flex: '1 0 0'`) — not a px width wider than the viewport content box
- [ ] Composer hugs visible field + send + padding; not shorter than `DsTextField`
- [ ] Chat `DsTextField` does not reserve a hidden label slot
- [ ] Composer and send fully paint inside the viewport (no clipped sliver)
- [ ] Open dropdowns / `Suggestion_list` do not cover the composer
- [ ] Consent checkboxes and long labels wrap inside the phone
- [ ] Progress / primary actions are not clipped by the composer
- [ ] Every screen in the set was checked (empty, long copy, focused composer, success) — not a single hero state
- [ ] Fail / fix loop: if any item fails, STOP, fix, re-check; do not call done

---

## Quick grep-based self-check

If you have shell access to the project, these patterns catch the most
common violations quickly (adjust paths/dirs to the project's source root):

```bash
grep -rn "<div"                  src/   # raw HTML containers
grep -rn "<button"               src/   # raw HTML buttons
grep -rn "fontSize:\s*'[0-9]"    src/   # raw px on typography-adjacent sx (check context)
grep -rn "&:hover"               src/   # pseudo-state overrides
grep -rn "boxShadow:\s*'[0-9]"   src/   # hardcoded shadows
grep -rn "borderRadius:\s*'[0-9]" src/  # hardcoded radius (verify token doesn't exist before flagging)
grep -rn "\-\-sz\-"              src/   # legacy tokens not yet converted (elevation may be exempt)
grep -rn ", #"                   src/   # leftover fallback values on var()
grep -rn "DsRemixIcon" src/ | grep -v "className=" # DsRemixIcon possibly missing className
grep -rn "direction='column'"    src/   # DsStack redundant direction
grep -rn 'icon="ri-'             src/   # DsRemixIcon wrong prop (use className)
grep -rn "<DsTag " src/ | grep -v "label=" # DsTag missing label prop
grep -rn "gap={[0-9]"            src/   # DsStack numeric gap
grep -rn "overflow:\s*'hidden'"  src/   # crop risk on bubbles/cards (review context)
```

These are signals, not proof — review each hit in context before "fixing" it,
since some (like an annotated `/* awaiting token */` raw value) are
intentional and correct.
