# Figma Plugin API gotchas and lessons

Production failures. Do not repeat them.

## Wrong vs correct

| Property / operation | Wrong | Correct |
| -------------------- | ----- | ------- |
| Auto-layout primary axis | `primaryAxisSizingMode = 'FILL'` | `'FIXED'` or `'AUTO'` |
| Auto-layout counter axis | `counterAxisSizingMode = 'HUG'` | `'FIXED'` or `'AUTO'` |
| Child fill in auto-layout | Set fill before append | Append first, then `layoutSizingHorizontal = 'FILL'` |
| Prototype reactions | `reactions = [{ action: {...}, trigger }]` | `actions` is an **array** |
| Prototype start node | `figma.currentPage.prototypeStartNode = frame` | Read-only — set in Figma UI |
| Flow starting points | `frame.flowStartingPoints = [...]` | Does not exist on FRAME in Plugin API |
| Page switching | `figma.currentPage = page` | `await figma.setCurrentPageAsync(page)` |
| Inter Semi Bold | `{ style: 'SemiBold' }` | `{ style: 'Semi Bold' }` (space) |
| Inter Extra Bold | `{ style: 'ExtraBold' }` | `{ style: 'Extra Bold' }` (space) |
| Color bind | Direct hex fill | `figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: fallback }, 'color', variable)` |

## Prototype wiring

```js
node.reactions = [{
  actions: [{
    type: 'NODE',
    destinationId: '...',
    navigation: 'NAVIGATE',
    transition: { type: 'MOVE_IN', direction: 'LEFT' },
    preserveScrollPosition: false
  }],
  trigger: { type: 'ON_CLICK' }
}]
```

- Forward: `MOVE_IN` / `LEFT`. Back: `MOVE_OUT` / `RIGHT`.
- Set flow start in the UI: select top frame → Prototype → **+** Flow starting point.
- Scrollable screens: `overflowDirection = 'VERTICAL'` on the inner frame; outer `clipsContent = true` and fixed device height (812 or 844).
- Header + bottom nav: parent `layoutMode = 'NONE'`. Header constraints `STRETCH` / `MIN`. Bottom nav `STRETCH` / `MAX`.

## Lessons learned

| # | Mistake | Fix |
| - | ------- | --- |
| 1 | Custom bottom nav from ellipses + text | Search `"bottom_nav"` — `bottom_navigation` exists |
| 2 | `primaryAxisSizingMode = 'FILL'` | Only `'FIXED'` / `'AUTO'`; fill on the child |
| 3 | `counterAxisSizingMode = 'HUG'` | Only `'FIXED'` / `'AUTO'` |
| 4 | Fill sizing before append | Append first, then set layout sizing |
| 5 | Singular `action: {}` in reactions | `actions: []` |
| 6 | Set `prototypeStartNode` via API | Set flow start in the Figma UI |
| 7 | `frame.flowStartingPoints` | Property does not exist on FRAME |
| 8 | Sidebar items as frames + circles | Search DS nav / list item first |
| 9 | Outer wrapper grew to 384×1140 | `layoutMode = 'NONE'` on the device frame |
| 10 | Searched only "button" and "search" | Run the full Step 2 search list |
| 11 | Same `actionPrimary` fill on every card image | Distinct placeholder fills; tokens on real content |
| 12 | Card image stuck on DS burgundy | SOLID RGB placeholders are OK for empty media; content uses tokens |
| 13 | `Date_input` used for text, email, amounts | Distinct components per field type |
| 14 | 6 OTP boxes hand-drawn | Search `"OTP"` — `OTP_digit_input` has Digit=4 / Digit=6 |
| 15 | OTP Size=M Digit=6 (376px) in a 375px frame | Probe width; Size=S Digit=6 ≈ 280px |
| 16 | Fixed 388px height on a form card | Wrappers around DS instances use `primaryAxisSizingMode = 'AUTO'` |
| 17 | Assembled `horizontal_step` when `Progress tracker_New` exists | Prefer the composite after all 3 searches |
