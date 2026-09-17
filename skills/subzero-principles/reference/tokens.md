# SubZero tokens (shared)

Authoritative token categories for every role. Package snapshot:
`@am92/react-design-system` `3.0.1-beta.1`. If the installed package or Figma
library differs, verify live before trusting an uncommon name.

**Rule:** if a value is not in these lists, it is not a token. Do not invent a
name. Do not round to the nearest token. Use the raw value and mark it as a
gap (`awaiting token` / non-standard spacing).

---

## Spacing

Code uses weather keys (`--ds-spacing-*`). Figma uses numeric `$sz-spacing-*`
where a matching px value exists.

| px | Code key | CSS | Figma (if published) |
| -- | -------- | --- | -------------------- |
| 0 | `zero` | `var(--ds-spacing-zero)` | `$sz-spacing-0` |
| 2 | `deepFreeze` | `var(--ds-spacing-deepFreeze)` | `$sz-spacing-2` |
| 4 | `quickFreeze` | `var(--ds-spacing-quickFreeze)` | `$sz-spacing-4` |
| 6 | `gelid` | `var(--ds-spacing-gelid)` | none — use 6px, do not round |
| 8 | `glacial` | `var(--ds-spacing-glacial)` | `$sz-spacing-8` |
| 12 | `frostbite` | `var(--ds-spacing-frostbite)` | `$sz-spacing-12` |
| 16 | `bitterCold` | `var(--ds-spacing-bitterCold)` | `$sz-spacing-16` |
| 20 | `cool` | `var(--ds-spacing-cool)` | `$sz-spacing-20` |
| 24 | `mild` | `var(--ds-spacing-mild)` | `$sz-spacing-24` |
| 28 | `pleasant` | `var(--ds-spacing-pleasant)` | `$sz-spacing-28` |
| 32 | `warm` | `var(--ds-spacing-warm)` | `$sz-spacing-32` |
| 36 | `tepid` | `var(--ds-spacing-tepid)` | `$sz-spacing-36` |
| 40 | `tropical` | `var(--ds-spacing-tropical)` | `$sz-spacing-40` |
| 44 | `hot` | `var(--ds-spacing-hot)` | none — use 44px, do not round |
| 48 | `blazing` | `var(--ds-spacing-blazing)` | `$sz-spacing-48` |
| 64 | `molten` | `var(--ds-spacing-molten)` | `$sz-spacing-64` |
| 80 | `superheated` | `var(--ds-spacing-superheated)` | none |
| 96 | `meltdown` | `var(--ds-spacing-meltdown)` | none |
| 112 | `whiteHot` | `var(--ds-spacing-whiteHot)` | none |
| 128 | `plasma` | `var(--ds-spacing-plasma)` | none |

20 of 20 code tokens. Border widths (1px, 2px) stay raw px — never a spacing token.

---

## Radius (`--ds-radius-*`)

| Key | px | Note |
| --- | -- | ---- |
| `zero` | 0 | |
| `deepFreeze` | 2 | |
| `quickFreeze` | 4 | |
| `gelid` | 6 | |
| `glacial` | 8 | |
| `frostbite` | 12 | |
| `bitterCold` | 16 | |
| `cool` | 20 | |
| `mild` | 24 | |
| `pleasant` | 28 | maximum named radius |

There is no `circular`, `round`, or `pill` token. Circles/pills use raw
`50%` / large px and must be marked as non-token.

---

## Elevation

Keys: `-1, 0, 1, 2, 3, 4, 6, 8, 9, 12, 16, 24`

- Code: `var(--ds-elevation-2)` (legacy `--sz-elevation-*` only if the local repo documents that exception)
- Typical: `2` cards, `4` modals, `-1` inset, `0` flat, `24` max

Never a freeform shadow.

---

## Color (`--ds-colour-*` / `$sz-colour-*`)

Figma names are hyphen-case after `$sz-colour-`. Code names are camelCase
after `--ds-colour-`. Same semantics.

**Action:** `actionPrimary` / `$sz-colour-action-primary`, `actionSecondary`, `actionTertiary`

**Surface:** `surfaceBackground`, `surfacePrimary`, `surfaceSecondary`, `surfaceTertiary`

**Typography:** `typoPrimary`, `typoSecondary`, `typoTertiary`, `typoActionPrimary`, `typoActionSecondary`, `typoActionTertiary`, `typoOnSurface`, `typoOnSurfaceDynamic`, `typoDisabled`, `typoTypical`

**Neutral:** `neutral1` … `neutral6`

**Icon:** `iconNegative`, `iconPositive`, `iconWarning`, `iconActionPrimary`, `iconActionSecondary`, `iconActionTertiary`, `iconOnSurface`, `iconOnSurfaceDynamic`, `iconDisabled`, `iconDefault`, `iconTypical`

**Stroke:** `strokeDefault`, `strokeSelected`, `strokeSecondarySelected`, `strokeHover`, `strokeDisabled`, `strokeActive`

**Support:** `supportNegative`, `supportPositive`, `supportWarning`, `supportVariable`, `supportTypical`, plus `*Neutral` variants

**State:** `stateSelectedPrimaryHover`, `stateSelectedPrimaryPressed`, `stateSelectedSecondaryHover`, `stateSelectedSecondaryPressed`, `stateSelectedVisitedTextLink`, `stateUnselectedDefault`, `stateUnselectedHover`, `stateUnselectedPressed`, `stateDisabledSurface`

**Overlay:** `overlay`, `overlayLoader`, `dotLoader`

61 color tokens. Token names do not change across light/dark/highContrast —
never hardcode hex per theme.

---

## Typography

Use DS composites as a single style — never independent font-size, weight,
line-height, or letter-spacing.

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

- Code: `DsTypography variant="headingBoldLarge"`
- Figma: imported SubZero text styles (heading / body / support), never manual Inter sizes

---

## Live verification

Code (when the package is installed):

```bash
cat node_modules/@am92/react-design-system/dist/tokens/spacing.js
cat node_modules/@am92/react-design-system/dist/tokens/colors.js
cat node_modules/@am92/react-design-system/dist/tokens/radius.js
```

Figma: search the library **Subzero V.2.0 Design System** for `$sz-colour-*`,
`$sz-spacing-*`, and text styles. Do not use tokens from other libraries.
