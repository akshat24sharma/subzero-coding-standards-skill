# Screen composition

Use with [discovery-protocol.md](discovery-protocol.md). Outer device frame
is fixed; inner content scrolls. Do **not** put auto-layout on the outer
mobile frame.

```
Outer Frame (375×812, layoutMode='NONE', clipsContent=true)
├── Header / App_bar (width 375, y=0, constraints: STRETCH / MIN)
├── Scroll Content Frame (375×700, y=56, overflowDirection='VERTICAL',
│                          layoutMode='VERTICAL',
│                          primaryAxisSizingMode='AUTO',
│                          counterAxisSizingMode='FIXED',
│                          clipsContent=true,
│                          constraints: STRETCH / STRETCH)
│   └── cards / forms (height hugs DS instances)
└── DS bottom_navigation (width 375, y=756, constraints: STRETCH / MAX)
```

iPhone 14 Pro alternative: outer **390×844**. Recalc header/scroll/nav `y`
to keep chrome pinned.

Inner scroll uses `primaryAxisSizingMode = 'AUTO'` so it grows with content.
The visible area clips it, which makes prototype scroll work.

## Chat / assistant (no tab bar)

When the screen is a full-screen assistant, pin an app bar and a composer.
Do **not** add `bottom_navigation` unless the brief already has tab chrome.
Measure chrome after probing instances; do not copy a demo’s y/height.

```
Outer Frame (device size from this skill or the brief, layoutMode='NONE')
├── App_bar (pinned top, y=0, width=device, STRETCH / MIN)
├── Scroll Content (y = appBar.bottom, height = composer.y - appBar.bottom,
│                   VERTICAL, hug content, clipsContent=true for scroll)
│   └── greeting / filters / prompts / thread (hug DS instances)
└── Composer (pinned bottom, STRETCH / MAX)
```

### Chat chrome + hug (required)

Visual crop of chrome is a fail. Full audit:
[visual-layout-qa.md](visual-layout-qa.md).

- **App bar:** fully inside the device (`y=0`, width = device width).
- **Composer:** fully inside (`composer.y + composer.height <= device.height`).
  Counter axis (vertical) is `AUTO` / hug — never a shorter FIXED height
  than tallest child + padding. `clipsContent` must not hide children.
  After hug, `composer.y = device.height - composer.height`.
- **Scroll:** height = `composer.y - appBar.bottom`. No overlap with chrome.
- **Bubbles / cards:** wrap in VERTICAL auto-layout with
  `primaryAxisSizingMode = AUTO`. Never `resize(287, 10)` or FIXED 24px
  with `clipsContent=true`.
- **Chat field:** prefer 3.0 `Ai Search`. If the fallback is V.2.0
  `Text_Input`, hide `label_wrapper` (not just `label_text`) so the field
  hugs ~44px. Then hug the composer around field + send + padding.
- **Suggestion_list:** do not place the open/default expanded variant in
  a 375 column if it collides with the composer.

Slots, colour stack, and overlap (bar/composer float over the thread):
[conversational-ui.md](conversational-ui.md).

## Placement

- Probe natural width/height and AUTO vs FIXED before placing
- Append to the auto-layout parent **before** setting fill sizing
- Axis modes are `FIXED` or `AUTO` only
- Never force-resize an AUTO-sized instance; pick a smaller size variant
- Never give a wrapping card a fixed height that will clip DS inputs
- Never FIXED-width wrapping body copy wider than the parent content box
- `DsContainer` / constrained wrappers only for centered forms/cards — not page chrome
- Before done: geometry + screenshot every device frame
  ([visual-layout-qa.md](visual-layout-qa.md))

## Required states

Show or explicitly mark: default, loading/skeleton, empty, error, disabled,
and success if an action exists. Empty = missing + why + next step. Error =
problem + recovery. Semantic status uses support color tokens plus icon or
label.

## Search pattern reminder

At least three queries per UI need. Full table:
[discovery-protocol.md](discovery-protocol.md).
