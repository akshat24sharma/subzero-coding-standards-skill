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

## Placement

- Probe natural width/height and AUTO vs FIXED before placing
- Append to the auto-layout parent **before** setting fill sizing
- Axis modes are `FIXED` or `AUTO` only
- Never force-resize an AUTO-sized instance; pick a smaller size variant
- Never give a wrapping card a fixed height that will clip DS inputs
- `DsContainer` / constrained wrappers only for centered forms/cards — not page chrome

## Required states

Show or explicitly mark: default, loading/skeleton, empty, error, disabled,
and success if an action exists. Semantic status uses support color tokens.

## Search pattern reminder

At least three queries per UI need. Full table:
[discovery-protocol.md](discovery-protocol.md).
