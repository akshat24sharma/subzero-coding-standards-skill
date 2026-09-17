# Figma token usage

Use with `../subzero-principles/reference/tokens.md`. This file is Figma-only
naming. CSS `--ds-*` names are **not** Figma bind names.

## Prefix

Always `$sz-` + hyphen-case (e.g. `$sz-colour-stroke-default`). Search and
bind these in `search_design_system` / `use_figma`.

## Color (`$sz-colour-*`)

```
Actions:    $sz-colour-action-primary / action-secondary / action-tertiary
Typography: $sz-colour-typo-primary / typo-secondary / typo-tertiary / typo-disabled
Surfaces:   $sz-colour-surface-background / surface-primary / surface-secondary / surface-tertiary
Icons:      $sz-colour-icon-default / icon-disabled / icon-action-primary / icon-action-secondary
Support:    $sz-colour-support-negative / support-positive / support-warning / support-typical
Strokes:    $sz-colour-stroke-default / stroke-disabled / stroke-hover
```

Bind the library variable. Do not duplicate as local hex styles.

## Spacing (`$sz-spacing-*`)

```
$sz-spacing-0   → 0px
$sz-spacing-2   → 2px
$sz-spacing-4   → 4px
$sz-spacing-8   → 8px
$sz-spacing-12  → 12px
$sz-spacing-16  → 16px
$sz-spacing-20  → 20px
$sz-spacing-24  → 24px
$sz-spacing-28  → 28px
$sz-spacing-32  → 32px
$sz-spacing-36  → 36px
$sz-spacing-40  → 40px
$sz-spacing-48  → 48px
$sz-spacing-64  → 64px
```

Non-standard values (6px, 10px, 15px, 44px, …): use px directly — do **not**
approximate to the nearest token.

Border widths (1px, 2px) always use raw px — never a spacing token.

Code still has weather-named tokens for 6 / 44 / 80 / 96 / 112 / 128px. If
Figma has no matching `$sz-spacing-*`, treat as a gap: raw px, labeled
non-standard.

## Typography

Use DS text styles imported from the design system library. Never hardcode
font family, weight, or size. If a style is missing, flag it — do not fake
a heading with Inter 24 Bold.

Inter style names that do get set (only if a DS style cannot be applied)
need a space: `Semi Bold`, `Extra Bold` — not `SemiBold` / `ExtraBold`.

## Components (Figma)

Prefer DS component instances (`Button`, `App_bar`, `chip`, `avatar`,
`bottom_navigation`, table/card sets) over hand-drawn frames. Full-width
chrome is a box/unconstrained frame. `DsContainer` / constrained layout
only for centered forms and cards.
