# Conversational UI

Pattern for an in-app assistant: greeting, optional shortcuts, a thread, and
a pinned composer. Use this file to learn the **slots and intents**. Do not
clone a demo’s copy, art, tag list, or pixel size unless the brief says so.

Load this when the task is chat, assistant, or “ask me anything.” Skip it for
unrelated screens.

A worked example (optional, open only when placing or pixel-checking):

https://www.figma.com/design/zMSPR1WbEYhvPHDkXP00S1/Demo-Avinash?node-id=63-29545

Conversational instances come from **Subzero 3.0 Design System** first:

https://www.figma.com/design/YBhe8vnUvSgR8KzbruzafR/Subzero-3.0-Design-System

Search that library by name. Demo layer names are hints, not a frozen
inventory. Use V.2.0 (`App_bar`, `Text_Input`, `tag`, …) only when 3.0 has
no match for that slot. Do not paste per-component node URLs.

## When to use

Full-screen or full-bleed assistant. Not find-in-app search. Not a form
wizard. Not a tab-root home unless the brief puts chat behind a tab.

## Chrome

Pin **app bar** at the top and **composer** at the bottom. The body scrolls
between them. See [screen-composition.md](screen-composition.md) for the
chat tree.

- Device size follows this skill’s mobile frames, or the brief (for example
  Android 360). Do not copy a demo frame “because the reference is 360×800.”
- Do **not** add `bottom_navigation` unless the product already has tab
  chrome. Do not invent a custom tab bar either.
- Page and chrome fills follow the colour stack below. Probe the file or
  library; do not invent hex.

## Slots

Fill only the slots the brief needs. Order is typical, not mandatory.

Search **Subzero 3.0 Design System** for the names below. Probe variants
before placing. Fall back to V.2.0 / `Ds*` only if 3.0 has no match.

| Slot | Search in 3.0 | Do not |
| ---- | ------------- | ------ |
| Assistant header | `Header Logo` | Custom bar when this exists |
| Composer | `Ai Search` (optional `Ai Search Entry`) | `DsSearchbar`, V.2.0 `Text_Input` |
| User turn | `Chat bubble user` | Hex rounded box |
| Agent turn | `Chat bubble agent` | Hex rounded box |
| Timestamp | `Message Time` | Raw caption |
| Quick prompts | `Quick selection cards` | Homemade pills |
| Quick actions | `Quick actions` | Extra buttons assembled from atoms |
| Nudge / insight | `Nudge` / `Ai Nudge` | Untokened banner |
| Thinking / pending | `Thinking State` / `Loading text` | Fabricated result card |
| Category filter | `tag` (3.0 or V.2.0 equivalent) | Raw pill |

### App bar

Prefer 3.0 `Header Logo` on a conversational screen. If 3.0 has no header
for this brief, use V.2.0 `App_bar` / `DsAppBar`. Title and trailing
actions come from the product. Back is common; omit if the shell already
provides it.

### Greeting (empty)

Optional. Illustration or approved DS image if the brief has one — do not
invent a mascot.

- Heading: personalised or generic welcome from the brief (DS heading
  style).
- Supporting line: what the assistant can help with (DS body style).
- Do not imply the assistant is a human.

### Category filters

Optional. Horizontal 3.0 `tag` / `DsTag` (or the V.2.0 equivalent Code
Connect maps). Selected uses the DS selected variant. Overflow scrolls.
Icons come from the DS set that matches the category — do not copy
placeholder icons from a Code Connect snippet.

`DsChip` only if search/Code Connect says the control is a chip, not a tag.

### Quick prompts

Optional. Tappable suggestions that send that prompt into the thread.

Prefer 3.0 `Quick selection cards` (and `Quick actions` when the brief
needs tap chips). Compose from `DsBox` + `DsTypography` only after search
finds nothing in 3.0 then V.2.0.

Emphasis (bold span, icon) is fine when it clarifies the ask. No urgency
manufacturing, no countdown, no gamified pressure on money.

Count, wording, and layout (stack vs wrap) come from the brief.

### Thread

User turns, assistant turns, and pending status.

- Outgoing / incoming: 3.0 `Chat bubble user` / `Chat bubble agent`.
  Right/left alignment follows the product, not a hardcoded width.
  Timestamp: `Message Time` if the brief shows time.
- **Bubble slot (layout):** VERTICAL auto-layout, `primaryAxisSizingMode =
  AUTO` (hug height). Never `resize(w, 10)` / FIXED 24px with
  `clipsContent=true` — that crops long copy mid-sentence.
- **Message text:** after append, `layoutSizingHorizontal = FILL` and
  `textAutoResize = HEIGHT`. Never `WIDTH_AND_HEIGHT` for wrapping body
  copy (consent rows, success lines, bubble text).
- **`clipsContent=false`** on bubbles/cards unless overflow is a designed
  scroll region.
- Find bubbles by **structure** (frame + only TEXT children, width ~287,
  inside scroll), not only layer name `"AI turn"`. Later screens often
  use unnamed Frames.
- Bubble fill, radius, and time style bind tokens. If a demo painted a
  brand hex, **do not ship the hex** — bind a documented `$sz-colour-*` /
  `--ds-colour-*` (ask if no chat-outgoing token exists).
- Pending: 3.0 `Thinking State` or `Loading text`, else `DsLoader` **plus**
  a status line that is true (“checking…”, “fetching {the thing the user
  asked}”). Never a fabricated balance, insight, or account fact.
- Reduced motion: drop cycling placeholders and spinners; keep the text.

### Composer

Use 3.0 `Ai Search` (states include Default / Typing / Filled / Disabled,
with and without Upload). That is **not** `DsSearchbar` and **not** V.2.0
`Text_Input` unless 3.0 has no composer for this brief.

- Placeholder and send/voice/attach actions come from the brief. 3.0 has
  `Upload`, `Input actions`, and `Fab buttons` when those slots are needed.
- Send stays disabled until there is something to send, unless the brief
  says otherwise.
- Accents (focus stroke, send enabled) use action / surface tokens, not a
  new pink or purple.
- **Hug, then pin.** Composer counter axis (vertical) is `AUTO`. Never
  FIXED 80 (or AUTO collapsing to 24) while the field is taller. After hug:
  `composer.y = device.height - composer.height`. Children must fully
  paint; `clipsContent` must not hide the field or send.
- **Label slot (V.2.0 fallback only):** do not use a labelled `Text_Input`
  as a chat field without hiding `label_wrapper` (not just `label_text`).
  After hide, the field should hug ~44px so the composer can hug the
  visible control.
- **Suggestion_list:** do not use the open/default expanded variant inline
  in a 375 frame if it collides with the composer. Use a closed select or
  keep `Ai Search`. Never let the menu eat the composer.
- App bar and composer stay fully inside the device. Scroll height =
  `composer.y - appBar.bottom`.

Before done, run [visual-layout-qa.md](visual-layout-qa.md) on every
device frame. If it is clipped or overflows the device, it is not done.

## Intelligence on this surface

Follow `../../subzero-principles/reference/ux-guardrails.md`:
Explain → Recommend → Confirm → Act → Recover.

Name the states the brief implies (do not invent extra product features):

```text
Idle → receiving → thinking → generating → answer
  → explanation (if consequence needs it) → action
  → confirm → success or recovery
```

- The customer can tell listening vs thinking vs waiting for approval vs
  unable.
- A suggestion is not a debit. Execution is a separate control after
  confirm.
- Pending copy is honest. Do not present an uncertain figure as a balance.
- If the assistant cannot finish: keep the thread, explain the limit, offer
  another path. Do not reset to empty.

## Colour, depth, and overlap

The worked example stays interesting because surfaces **step**, chrome
**floats over** the thread, and **one** action colour marks what is live.
A single fill for page, cards, bar, and composer is what makes a chat look
bland. Still tokens only — rearrange roles, do not invent hex.

### Surface stack (back to front)

Use at least three steps. Names are roles; bind the closest `$sz-colour-*`.

| Role | Typical token | What sits here |
| ---- | ------------- | -------------- |
| Page | `neutral-1` (cool wash) | Full-bleed canvas behind everything |
| Raised | `surface-background` / `surface-primary` | Prompt cards, composer field, app bar |
| Recessed control | `surface-secondary` | Disabled send, idle icon wells |
| Selected / live | `action-primary` (and DS selected tag) | Active filter, composer accent |
| Contrast turn | Documented chat-outgoing token | User bubble (not a second brand hex) |

The example uses a cool page (`neutral-1`) so white cards and the composer
read as sheets. If you put white cards on a white page, add elevation or
change the page step — do not “fix” it with a random grey hex.

### One accent family

- Unselected tags sit on the page (quiet stroke / surface).
- **One** selected tag uses the DS selected variant (action fill +
  `typo-` / `icon-on-surface`).
- Composer focus or leading stroke uses the same action family, not a new
  pink or purple.
- Do not paint a second decorative accent (the example’s untokened purple
  bubble is a **gap**, not a licence to add brand hex).

Accent is scarce. If everything is action-primary, nothing is.

### Type contrast (same screen)

| Role | Typical token | Example use |
| ---- | ------------- | ----------- |
| Primary | `typo-primary` | Greeting title, prompt body |
| Emphasis | same colour, DS **bold** style | Key noun in a prompt |
| Secondary | `typo-secondary` | Pending / status line |
| Tertiary | `typo-tertiary` | Composer placeholder |
| On contrast | `typo-on-surface` | Text on selected tag or outgoing bubble |

Bland screens use one body style and one colour for title, hint, and status.

### Elevation and overlap (not flat siblings)

Chrome **overlaps** the scroll; it is not a third white band stacked in
document flow with a huge empty gap.

```
Page (neutral wash)
├── App bar — raised surface + light elevation, pinned, content scrolls under it
├── Body (scrolls underneath both pins)
│   ├── Illustration can sit large in the greeting zone (mask / overlap OK)
│   ├── Tag row may clip and scroll sideways over the page
│   ├── Prompt cards — raised + low elevation (arctic / elevation 1)
│   └── Bubbles sit on the page; they do not flatten into it
└── Composer — raised + stronger elevation (zero / soft spread), pinned,
    casts over the last messages
```

Good practices from that arrangement:

- **Overlap with purpose.** Bar and composer share the page x-axis and sit
  above the mask. The thread disappears under them while scrolling.
- **Lift only what the user touches or reads as a sheet.** Cards, composer,
  bubbles. Do not elevate the page or every text node.
- **Illustration is a layer**, not a tiny icon in a blank field. If the
  brief has art, give it real size in the greeting zone; if not, do not
  invent a mascot — use type hierarchy instead.
- **Horizontal overlap is allowed** for tags (row wider than the canvas,
  clipped). Do not shrink five tags to fit and look sparse.
- **Disabled send is recessed** (`surface-secondary`) so the composer still
  has an inner step before it is active.
- **Reduced motion:** keep the surface stack and overlap; drop only the
  cycling placeholder / spinner.

### Bland vs alive (same components)

| Bland | Alive (example recipe) |
| ----- | ---------------------- |
| Page = cards = bar = composer, one white | Cool page, raised sheets, recessed send |
| No selected tag, or every tag selected | One selected, rest quiet |
| No elevation, everything flush | Cards + composer float on the wash |
| Composer in normal flow, big empty footer | Composer overlaps the thread |
| Title and placeholder the same grey | Primary / tertiary / on-surface steps |
| Action colour on the whole header | Action only on selected + live field |

### Do not

- Flatten the stack to one surface “to stay calm.” Calm is low motion and
  scarce accent, not a blank sheet.
- Add extra hues, gradients, or hex to “make it pop.”
- Use colour alone for selected or error (pair with variant, icon, or label).
- Copy an untokened demo fill. Bind a token or ask.

## States

Name every state the brief implies. Do not invent extra product features
to fill the table.

| State | Typical content |
| ----- | --------------- |
| Empty | Greeting and/or shortcuts; composer present; send disabled if empty |
| Composing | Send enabled |
| Pending | User turn + honest status line |
| Error | Support-negative + icon or label + recovery; no invented data |
| Success | Assistant turn using DS pieces the library has |
| Reduced motion | Static placeholder and static status |

## Money, identity, and handoff

If the thread can move money or change something irreversible, confirm
first (`DsModal` / `DsBottomSheet` + proceed + dismiss). See
`../subzero-principles/reference/ux-guardrails.md`.

If the brief requires AI disclosure or human escalation, add those
controls with DS components. If it does not, flag an `Open Question:` —
do not invent legal chrome.

## Do not

- Query Figma on every task to relearn this pattern. Load this file first.
- Treat one demo’s copy, tags, or illustration as the system.
- Use `DsSearchbar` or V.2.0 `Text_Input` for the composer when 3.0 `Ai Search` exists.
- Rebuild tags as raw pills.
- Paint hex on bubbles or the composer.
- Flatten page, cards, bar, and composer to one surface.
- Add a tab bar “to match other apps.”
- Fabricate assistant answers, balances, or screens the brief does not
  specify.
- Lock bubbles to a FIXED height that crops copy.
- Leave `label_wrapper` reserved when a V.2.0 `Text_Input` chat field has no label.
- Place an open `Suggestion_list` over the composer.
- Call the screen done from a single hero screenshot.
