# Visual layout QA

Blocking phase. Run **after nodes exist**, **before** declaring any Figma
(or chat) screen done. Token/DS-component checks passing is not enough.

> **If it is clipped or overflows the device, it is not done.**

A conversational journey that uses DS instances can still be unusable:
24px bubbles that crop copy, a composer shorter than `Ai Search` (or
fallback `Text_Input`), body text FIXED wider than the 375px phone,
unnamed bubble frames missed by name-based fixes, or an open
`Suggestion_list` covering the composer.

Do not mark the screen done if content is cropped, overflowing, or chrome
is clipped.

## When

After Step 5 (sections built) and the DS compliance audit. Before Deliver.
If any check fails: **STOP**. Fix. Re-run geometry + screenshots. Do not
add more screens on a broken shell.

Failures found in this run must not be able to recur without this
checklist catching them.

## Definition of done (screen)

A screen is done only if:

1. DS compliance (existing deal-breaker) passes
2. Visual layout QA **A + B** pass on **every** device frame in the set
3. Failures found in this run cannot recur without the checklist catching them

A single hero screenshot is not enough.

---

## A. Geometry audit (`use_figma`, required)

For every mobile device frame (**375×812** or **390×844**):

### Device chrome

- [ ] App bar fully inside the frame (`y=0`, width = device width).
- [ ] Composer (or bottom chrome) fully inside the frame:
  - `composer.y + composer.height <= device.height`
  - `composer.clipsContent` must not hide children
  - composer counter axis (vertical) is `AUTO` / hug, not a shorter FIXED
    height than its tallest child + padding
  - After hug, set `composer.y = device.height - composer.height`
  - Scroll height = `composer.y - appBar.bottom` (no overlap)
- [ ] No TEXT or INSTANCE may have absolute right edge > device right + 1px.
- [ ] No TEXT width > its auto-layout parent’s content width
      (`parent.width - horizontal padding`).

### Bubbles / cards / consent rows

Applies to every message bubble, card, and consent row. **Not** DS atoms
like Button, tag, App_bar, Ai Search, Text_Input field, OTP, Progress tracker.

- [ ] Vertical auto-layout: `primaryAxisSizingMode = AUTO` (hug height).
      Never FIXED 24px (or any height shorter than the text) with
      `clipsContent=true`.
- [ ] Message text: `textAutoResize = HEIGHT` and
      `layoutSizingHorizontal = FILL` after append. Never
      `WIDTH_AND_HEIGHT` for wrapping body copy.
- [ ] `clipsContent=false` on bubbles/cards unless overflow is a designed
      scroll region.
- [ ] Find bubbles by **structure**, not only by layer name `"AI turn"`:
      frame + only TEXT children, width ~287, inside scroll. Also match
      unnamed frames that are message bubbles.

### Composer-specific

- [ ] Prefer 3.0 `Ai Search` for the chat field. Do not use V.2.0
      `Text_Input` when `Ai Search` exists.
- [ ] If the fallback is a labelled `Text_Input`, hide `label_wrapper`
      (not just `label_text`). After hide, field should hug ~44px.
- [ ] Composer padding + field + send must fully paint. If hug height <
      child heights + padding, it is a fail.
- [ ] Do not use `Suggestion_list`’s open/default expanded variant inline
      in a 375 frame if it collides with the composer; use a closed select
      or keep `Ai Search`.

### Geometry script (adapt IDs)

Walk every device FRAME. Fail closed; print node id + reason.

```js
const DEVICES = new Set(['375x812', '390x844'])
const ATOM = /^(Button|tag|App_bar|Header Logo|Ai Search|Chat bubble|Text_Input|OTP|Progress tracker)/i

function right(n) { return n.absoluteTransform[0][2] + n.width }
function fail(n, msg) { throw new Error(`${n.name} (${n.id}): ${msg}`) }

function hugHeight(node) {
  if (node.layoutMode === 'VERTICAL') node.primaryAxisSizingMode = 'AUTO'
  else if (node.layoutMode === 'HORIZONTAL') node.counterAxisSizingMode = 'AUTO'
}

function isBubbleLike(n) {
  if (n.type !== 'FRAME' && n.type !== 'COMPONENT' && n.type !== 'INSTANCE') return false
  if (ATOM.test(n.name)) return false
  const kids = n.children || []
  const onlyText = kids.length > 0 && kids.every(c => c.type === 'TEXT')
  const chatWidth = n.width >= 240 && n.width <= 320
  return onlyText && chatWidth
}

for (const device of figma.currentPage.children) {
  if (device.type !== 'FRAME') continue
  const key = `${Math.round(device.width)}x${Math.round(device.height)}`
  if (!DEVICES.has(key) && !(device.width === 375 || device.width === 390)) continue

  const deviceRight = device.absoluteTransform[0][2] + device.width
  const appBar = device.findOne(n => /app.?bar/i.test(n.name))
  const composer = device.findOne(n => /composer|chat.?input|ask.?input/i.test(n.name))
    || [...device.children].sort((a, b) => b.y - a.y)[0]

  if (appBar) {
    if (Math.abs(appBar.y) > 1) fail(appBar, 'app bar must be y=0 inside the device')
    if (Math.abs(appBar.width - device.width) > 1) fail(appBar, 'app bar width must equal device width')
  }

  if (composer) {
    if (composer.y + composer.height > device.height + 1) {
      fail(composer, 'composer clipped: y+height > device.height')
    }
    hugHeight(composer)
    const tallest = Math.max(0, ...(composer.children || []).map(c => c.height))
    const pad = (composer.paddingTop || 0) + (composer.paddingBottom || 0)
    if (composer.height + 0.5 < tallest + pad) {
      fail(composer, 'composer shorter than tallest child + padding — hug then pin')
    }
    composer.y = device.height - composer.height
    const scroll = device.findOne(n => n.overflowDirection === 'VERTICAL' || /scroll/i.test(n.name))
    if (scroll && appBar) {
      const expected = composer.y - (appBar.y + appBar.height)
      if (Math.abs(scroll.height - expected) > 2) {
        fail(scroll, `scroll height must be composer.y - appBar.bottom (got ${scroll.height}, expected ${expected})`)
      }
    }
  }

  device.findAll(n => n.type === 'TEXT' || n.type === 'INSTANCE').forEach(n => {
    if (right(n) > deviceRight + 1) fail(n, `absolute right edge ${right(n)} > device right ${deviceRight}`)
  })

  device.findAll(n => n.type === 'TEXT').forEach(t => {
    const p = t.parent
    if (!p || p.layoutMode === 'NONE' || p.layoutMode === undefined) return
    const contentW = p.width - (p.paddingLeft || 0) - (p.paddingRight || 0)
    if (t.width > contentW + 1) fail(t, `TEXT width ${t.width} > parent content width ${contentW}`)
  })

  device.findAll(isBubbleLike).forEach(b => {
    if (b.layoutMode === 'VERTICAL' && b.primaryAxisSizingMode === 'FIXED' && b.clipsContent) {
      fail(b, 'bubble FIXED height + clipsContent crops copy; use primary AUTO, clipsContent false')
    }
    if (b.clipsContent && b.overflowDirection === 'NONE') {
      fail(b, 'clipsContent=false on bubbles/cards unless overflow is a designed scroll region')
    }
    for (const t of (b.children || []).filter(c => c.type === 'TEXT')) {
      if (t.textAutoResize === 'WIDTH_AND_HEIGHT') {
        fail(t, 'wrapping body copy must be HEIGHT + FILL, never WIDTH_AND_HEIGHT')
      }
    }
  })
}
```

Pin composer after hug:

```js
composer.counterAxisSizingMode = 'AUTO' // vertical hug when layoutMode is HORIZONTAL
composer.primaryAxisSizingMode = 'AUTO' // hug when layoutMode is VERTICAL
composer.y = device.height - composer.height
```

Hide the full label slot on a V.2.0 chat `Text_Input` (not only the text).
Skip this when the composer is 3.0 `Ai Search`:

```js
const labelWrapper = field.findOne(n => n.name === 'label_wrapper')
if (labelWrapper) labelWrapper.visible = false
```

---

## B. Screenshot audit (`get_screenshot`, required)

Screenshot **every** device frame (not only the first). Fail if you see:

- [ ] Text cut off on the right or bottom of a bubble
- [ ] Only a grey send circle / sliver of the composer
- [ ] Cards or checkboxes extending past the phone
- [ ] Open dropdowns covering the composer
- [ ] Progress / buttons clipped by the composer

A single hero screenshot is not enough.

---

## C. Fail / fix loop

1. If any A or B check fails: **STOP**.
2. Fix the failing nodes (see [figma-gotchas.md](figma-gotchas.md) lessons
   18–23).
3. Re-run geometry audit A.
4. Re-screenshot every device frame (B).
5. Do not add more screens on a broken shell.

## Known failure patterns (must catch)

| Symptom | Typical cause |
| ------- | ------------- |
| Copy cropped mid-sentence in a bubble | ~24px FIXED height + `clipsContent=true` |
| Input/send clipped at bottom of 375×812 | Composer FIXED 80 (or AUTO collapsing to 24) while `Ai Search` / `Text_Input` is taller |
| Composer never hugs the visible field | `label_wrapper` still 24px when label is hidden |
| Consent / success copy past the phone | `WIDTH_AND_HEIGHT` or HEIGHT + FIXED width (482px, 494–785px) |
| Name-based bubble fixes missed later screens | Unnamed Frame bubbles |
| List collides with composer | `Suggestion_list` default open variant |
