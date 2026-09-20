# Conversational UI

Pattern for an in-app assistant: greeting, optional shortcuts, a thread, and
a pinned composer. Use this file to learn the **slots and intents**. Do not
clone a demo’s copy, art, tag list, or pixel size unless the brief says so.

Load this when the task is chat, assistant, or “ask me anything.” Skip it for
unrelated screens.

A worked example (optional, open only when placing or pixel-checking):

https://www.figma.com/design/zMSPR1WbEYhvPHDkXP00S1/Demo-Avinash?node-id=63-29545

Search the live SubZero V.2.0 library for current instance names. Demo layer
names (`tag`, `Quick selection cards`, `User bubble`, `Ai Search input field`)
are hints, not a frozen inventory.

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

### App bar

`App_bar` / `DsAppBar`. Title and trailing actions come from the product.
Back is common; omit if the shell already provides it.

### Greeting (empty)

Optional. Illustration or approved DS image if the brief has one — do not
invent a mascot.

- Heading: personalised or generic welcome from the brief (DS heading
  style).
- Supporting line: what the assistant can help with (DS body style).
- Do not imply the assistant is a human.

### Category filters

Optional. Horizontal `DsTag` (or the library equivalent Code Connect maps).
Selected uses the DS selected variant. Overflow scrolls. Icons come from
the DS set that matches the category — do not copy placeholder icons from
a Code Connect snippet.

`DsChip` only if search/Code Connect says the control is a chip, not a tag.

### Quick prompts

Optional. Tappable suggestions that send that prompt into the thread.

Prefer a library “quick selection” / prompt-card instance or a DS card.
Compose from `DsBox` + `DsTypography` only after search finds nothing.

Emphasis (bold span, icon) is fine when it clarifies the ask. No urgency
manufacturing, no countdown, no gamified pressure on money.

Count, wording, and layout (stack vs wrap) come from the brief.

### Thread

User turns, assistant turns, and pending status.

- Outgoing / incoming: use the library bubble (or the closest DS composite).
  Right/left alignment follows the product, not a hardcoded width.
- Bubble fill, radius, and time style bind tokens. If a demo painted a
  brand hex, **do not ship the hex** — bind a documented `$sz-colour-*` /
  `--ds-colour-*` (ask if no chat-outgoing token exists).
- Pending: icon or `DsLoader` **plus** a status line that is true
  (“checking…”, “fetching {the thing the user asked}”). Never a fabricated
  balance, insight, or account fact.
- Reduced motion: drop cycling placeholders and spinners; keep the text.

### Composer

Dedicated assistant composer if the library has one (search: AI / ask /
chat input). That is **not** `DsSearchbar` and **not** a generic
`Text_Input` used as a search box.

- Placeholder and send/voice/attach actions come from the brief.
- Send stays disabled until there is something to send, unless the brief
  says otherwise.
- Accents (focus stroke, send enabled) use action / surface tokens, not a
  new pink or purple.

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
- Use `DsSearchbar` for the composer.
- Rebuild tags as raw pills.
- Paint hex on bubbles or the composer.
- Flatten page, cards, bar, and composer to one surface.
- Add a tab bar “to match other apps.”
- Fabricate assistant answers, balances, or screens the brief does not
  specify.
