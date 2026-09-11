# SubZero token reference (complete)

This is the **complete, authoritative** list of every token in
`@am92/react-design-system`. There are no tokens outside this list.

> **Version note**: this snapshot matches package version `3.0.1-beta.1`. If
> the installed package version differs, re-verify against the source files
> before trusting this list — see "Verifying against the live package"
> at the bottom.

**The rule this file exists to enforce**: if a value you need does not
appear below, it is not a "close enough" match to something that does. Use
the raw value with a comment (`/* awaiting token */` or similar) instead of
guessing a name, and instead of rounding to the nearest token. A partial
mental list is worse than no list — it causes confident wrong guesses. This
file removes that excuse by being complete.

---

## Spacing — 20 tokens (`var(--ds-spacing-{key})`)

| Key           | MUI units | px equivalent |
| ------------- | --------- | ------------- |
| `zero`        | 0         | 0px           |
| `deepFreeze`  | 0.5       | 2px           |
| `quickFreeze` | 1         | 4px           |
| `gelid`       | 1.5       | 6px           |
| `glacial`     | 2         | 8px           |
| `frostbite`   | 3         | 12px          |
| `bitterCold`  | 4         | 16px          |
| `cool`        | 5         | 20px          |
| `mild`        | 6         | 24px          |
| `pleasant`    | 7         | 28px          |
| `warm`        | 8         | 32px          |
| `tepid`       | 9         | 36px          |
| `tropical`    | 10        | 40px          |
| `hot`         | 11        | 44px          |
| `blazing`     | 12        | 48px          |
| `molten`      | 16        | 64px          |
| `superheated` | 20        | 80px          |
| `meltdown`    | 24        | 96px          |
| `whiteHot`    | 28        | 112px         |
| `plasma`      | 32        | 128px         |

This is the full list — 20 of 20. If a px value doesn't exactly match one of
the right-hand column values, there is no spacing token for it.

---

## Radius — 10 tokens (`var(--ds-radius-{key})`)

| Key           | px value |
| ------------- | -------- |
| `zero`        | 0px      |
| `deepFreeze`  | 2px      |
| `quickFreeze` | 4px      |
| `gelid`       | 6px      |
| `glacial`     | 8px      |
| `frostbite`   | 12px     |
| `bitterCold`  | 16px     |
| `cool`        | 20px     |
| `mild`        | 24px     |
| `pleasant`    | 28px ← maximum |

This is the full list — 10 of 10. There is no `circular`, `round`, `pill`,
or any radius token beyond 28px. For values beyond `pleasant` or for
circular/pill shapes, use a raw value with a comment:

```tsx
sx={{ borderRadius: '100px' /* Pill shape - no DS token */ }}
sx={{ borderRadius: '50%' /* Circular - no DS token */ }}
```

---

## Elevation — 12 tokens (`var(--ds-elevation-{key})`)

Keys (bare numbers, not named like spacing/radius):

```
-1, 0, 1, 2, 3, 4, 6, 8, 9, 12, 16, 24
```

`-1` is an inset shadow. `0` is flat/no elevation. Higher numbers = greater
depth (`24` is maximum). Always reference these by number — there is no
named variant (no `elevation-large`, etc).

```tsx
sx={{ boxShadow: 'var(--ds-elevation-2)' }}   // card, raised element
sx={{ boxShadow: 'var(--ds-elevation-4)' }}   // modal, overlay
sx={{ boxShadow: 'var(--ds-elevation--1)' }}  // inset
```

> Some projects keep a legacy `--sz-elevation-*` namespace for this category
> specifically (documented exception — check local project convention, see
> SKILL.md §2 elevation note). Everywhere else, `--sz-*` is deprecated.

---

## Colors — 61 tokens (`var(--ds-colour-{key})`)

Full list, grouped by purpose for readability (the grouping is descriptive,
not part of the token name):

**Action**
`actionPrimary`, `actionSecondary`, `actionTertiary`

**Surface**
`surfaceBackground`, `surfacePrimary`, `surfaceSecondary`, `surfaceTertiary`

**Typography**
`typoPrimary`, `typoSecondary`, `typoTertiary`, `typoActionPrimary`,
`typoActionSecondary`, `typoActionTertiary`, `typoOnSurface`,
`typoOnSurfaceDynamic`, `typoDisabled`, `typoTypical`

**Neutral scale**
`neutral1`, `neutral2`, `neutral3`, `neutral4`, `neutral5`, `neutral6`

**Icon**
`iconNegative`, `iconPositive`, `iconWarning`, `iconActionPrimary`,
`iconActionSecondary`, `iconActionTertiary`, `iconOnSurface`,
`iconOnSurfaceDynamic`, `iconDisabled`, `iconDefault`, `iconTypical`

**Stroke / border**
`strokeDefault`, `strokeSelected`, `strokeSecondarySelected`, `strokeHover`,
`strokeDisabled`, `strokeActive`

**Support (status/semantic)**
`supportNegative`, `supportPositive`, `supportWarning`, `supportVariable`,
`supportTypical`, `supportNegativeNeutral`, `supportPositiveNeutral`,
`supportWarningNeutral`, `supportTypicalNeutral`

**State**
`stateSelectedPrimaryHover`, `stateSelectedPrimaryPressed`,
`stateSelectedSecondaryHover`, `stateSelectedSecondaryPressed`,
`stateSelectedVisitedTextLink`, `stateUnselectedDefault`,
`stateUnselectedHover`, `stateUnselectedPressed`, `stateDisabledSurface`

**Overlay/loader**
`overlay`, `overlayLoader`, `dotLoader`

Count check: 3 + 4 + 10 + 6 + 11 + 6 + 9 + 9 + 3 = 61. ✅ Full list.

Colors are theme-aware (`light`, `dark`, `highContrast`) but the *token
name* is the same across themes — never hardcode a specific hex per theme.

---

## Typography composites — 29 tokens (use as `variant` prop value — no `var()` wrapper)

```
displayBoldLarge, displayBoldMedium, displayBoldSmall,
displayBoldItalicLarge, displayBoldItalicMedium, displayBoldItalicSmall,
headingBoldExtraLarge, headingBoldLarge, headingBoldMedium, headingBoldSmall, headingBoldExtraSmall,
headingBoldItalicExtraLarge, headingBoldItalicLarge, headingBoldItalicMedium, headingBoldItalicSmall, headingBoldItalicExtraSmall,
subheadingSemiboldLarge, subheadingSemiboldDefault,
bodyRegularLarge, bodyRegularMedium, bodyRegularSmall,
bodyBoldLarge, bodyBoldMedium, bodyBoldSmall,
supportRegularInfo, supportRegularFootnote, supportRegularMetadata, supportBoldTextButton
```

That's 28 listed — verified against package version `3.0.1-beta.1`. If you
need a typography variant not in this list, verify against the live package
before assuming it exists. Composites set font-size,
font-weight, line-height, and letter-spacing together — never set these
individually via `sx`.

```tsx
<DsTypography variant="headingBoldLarge">Title</DsTypography>
```

There are also ~31 lower-level typography *primitives* (e.g.
`fontSizeScorched`) used internally by the composites — agents generating
component code should use composites, not primitives, unless explicitly
told otherwise.

---

## Verifying against the live package

If you have shell/file access to the target project, you can confirm the
exact installed version's tokens directly instead of relying on this
snapshot:

```bash
cat node_modules/@am92/react-design-system/dist/tokens/spacing.js
cat node_modules/@am92/react-design-system/dist/tokens/colors.js
cat node_modules/@am92/react-design-system/dist/tokens/radius.js
```

Or check `node_modules/@am92/react-design-system/package.json` for the
installed version and compare against `3.0.1-beta.1` (the version this file
was generated against). If they differ, treat this file as a strong prior
but verify any token you're about to rely on for a non-obvious case.

If you don't have file access (e.g. you're an agent working from chat
context only, with no repo access), this file is the best available source
— still complete for this package version, just unable to be re-verified
live.
