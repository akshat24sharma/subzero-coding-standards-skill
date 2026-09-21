# UX review

Run before treating a SubZero screen as done. Tokens and components still
use the deal-breaker. This list is the experience bar from
`../subzero-principles/reference/ux-guardrails.md`. Copy uses
`../subzero-principles/reference/content-design.md`.

Visual crop/overflow/chrome is a **separate blocking gate**, not covered
by token checks. After this review, run
[visual-layout-qa.md](visual-layout-qa.md) A + B on every device frame.
If it is clipped or overflows the device, it is not done.

## Understandable

- [ ] User goal and page purpose are obvious
- [ ] One primary action; secondaries are quieter
- [ ] Language is plain; controls name the outcome
- [ ] Voice stays Simple / Trustworthy / Purposeful; tone matches screen
      type × new vs existing (`content-design.md`)
- [ ] Hierarchy: purpose → facts → primary action → support

## Interaction

- [ ] Affordances are visible (tap, select, disabled, expand)
- [ ] Patterns are familiar (no novelty-only gestures)
- [ ] Meaningful states are designed (not happy-path only)
- [ ] Errors are recoverable (problem + next step)
- [ ] Feedback is immediate; the system “heard” them

## Visual (SubZero)

- [ ] Hierarchy and spacing from tokens
- [ ] Colour and type from the DS; no hex
- [ ] Surfaces step (page ≠ every sheet); not one flat fill
- [ ] Visual noise controlled; one accent family

## Visual layout QA (blocking — every device frame)

Token/DS-component checks passing is **not** sufficient. Full procedure:
[visual-layout-qa.md](visual-layout-qa.md).

- [ ] Geometry audit (`use_figma`) on every 375×812 / 390×844 frame
- [ ] App bar fully inside (`y=0`, width = device width)
- [ ] Composer fully inside: `y + height <= device.height`; hug then
      `y = device.height - height`; `clipsContent` must not hide children
- [ ] No TEXT/INSTANCE absolute right edge > device right + 1px
- [ ] No TEXT width > parent content width
- [ ] Bubbles/cards/consent rows hug height (`primaryAxisSizingMode = AUTO`);
      never FIXED shorter than the text with `clipsContent=true`
- [ ] Message text FILL + `textAutoResize = HEIGHT` (not `WIDTH_AND_HEIGHT`)
- [ ] Bubbles found by structure (frame + TEXT children, width ~287), not
      only layer name `"AI turn"`
- [ ] Chat composer is 3.0 `Ai Search` when it exists; if V.2.0
      `Text_Input` is the fallback, `label_wrapper` is hidden (not just
      `label_text`)
- [ ] No open `Suggestion_list` colliding with the composer
- [ ] Screenshot **every** device frame (`get_screenshot`): no cropped
      bubble copy, clipped composer/send, overflow past the phone, open
      dropdown covering chrome, or progress/buttons clipped
- [ ] Fail / fix loop completed; no further screens added on a broken shell

## Accessibility

- [ ] Meaning not by colour alone
- [ ] Contrast, focus, labels, keyboard (web), touch targets
- [ ] Reduced-motion twin for animated states

## Responsive

- [ ] Reflow, wrap, and chrome adapt; not a cropped desktop
- [ ] Dense data has a mobile behaviour (summary, sheet, or stack)
- [ ] Wrapping body copy uses parent width; no FIXED text wider than 375/390

## Trust

- [ ] Fees, limits, and consequences are findable
- [ ] Confirm matches consequence (not every tap, not never)
- [ ] Transaction / journey status is clear
- [ ] Interruption: progress can be restored where the brief allows

## AI (when present)

- [ ] AI influence is visible if the brief requires it
- [ ] Recommend ≠ execute
- [ ] Uncertainty shown when it affects the decision
- [ ] Recovery without restarting the journey

## System

- [ ] Closest DS component and tokens used
- [ ] New pattern justified, not a one-off decoration
