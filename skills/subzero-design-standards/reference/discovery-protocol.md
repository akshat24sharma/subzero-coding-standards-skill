# Discovery protocol (Figma)

Never build a primitive until search confirms no SubZero component exists.
Never settle on the first `search_design_system` result — it may be another
library or the wrong type (`Date_input` instead of `Text_Input`).

## Filter

Same intent, first match wins:

1. `libraryName: "Subzero 3.0 Design System"`
2. Only if 3.0 has no component for that **intent**:
   `libraryName: "Subzero V.2.0 Design System"`
3. Remix Icons — glyphs only

Drop `null`, Material, community kits, and other libraries.

3.0 is the published conversational library (one Components page). Source:

https://www.figma.com/design/YBhe8vnUvSgR8KzbruzafR/Subzero-3.0-Design-System

Optional: pass `includeLibraryKeys` from `get_libraries` / a prior search
to scope `search_design_system`. Refresh keys if a known name returns empty.

Do **not** paste per-component Figma node URLs. Search by name; import with
the returned `componentKey`. Probe variants with `use_figma`.

Variables (`$sz-*`) and text styles: search 3.0 first. If none publish,
bind from V.2.0. Do not paint hex.

## Baseline searches (run in parallel)

**Components** (`includeComponents: true`):

- Navigation: `"button"`, `"bottom_nav"`, `"bottom navigation"`, `"App_bar"`, `"header"`, `"nav"`, `"sidebar"`, `"tab bar"`
- Content: `"card"`, `"input"`, `"search"`, `"chip"`, `"avatar"`, `"table"`, `"badge"`, `"tag"`, `"modal"`, `"drawer"`, `"accordion"`, `"list item"`, `"divider"`
- Chat (when the brief is conversational): `"Ai Search"`, `"Chat bubble user"`, `"Chat bubble agent"`, `"Quick selection cards"`, `"Quick actions"`, `"Nudge"`, `"Thinking State"`, `"Header Logo"`, `"tag"`
- Layout: `"container"`, `"section"`, `"banner"`, `"hero"`

**Variables** (`includeVariables: true`), `$sz-` names:

`"sz-colour-action"`, `"sz-colour-surface"`, `"sz-colour-typo"`,
`"sz-colour-stroke"`, `"sz-colour-support"`, `"sz-spacing-8"`,
`"sz-spacing-16"`, `"sz-spacing-24"`

**Text styles** (`includeStyles: true`): `"heading"`, `"body"`, `"caption"`, `"label"`

## 3-term search (every UI need)

SubZero name + generic name + use-case. Apply the same pattern to anything
not listed.

| UI need | Term 1 (SubZero) | Term 2 (generic) | Term 3 (use-case) |
| ------- | ---------------- | ---------------- | ----------------- |
| Text entry | `Text_Input` | `input` | `text field` |
| OTP | `OTP` | `pin` | `digit input` |
| Date | `Date_input` | `date picker` | `calendar input` |
| Amount / phone | `Phone_number_input` | `number input` | `prefixed field` |
| Password | `Password_input` | `password` | `secure field` |
| Multi-line | `Description_Input` | `textarea` | `multiline` |
| Select | `Suggestion_list` | `dropdown` | `select field` |
| Header | `App_bar` | `header` | `app bar` |
| Primary action | `Button` | `button` | `cta` |
| Text action | `text_button` | `link` | `hyperlink` |
| Icon action | `Icon_button` | `icon button` | `fab` |
| Bottom bar | `bottom_navigation` | `bottom_nav` | `tab bar` |
| Step indicator | `horizontal_step` | `stepper` | `progress step` |
| Progress | `Progress tracker_New` | `progress` | `tracker` |
| Status | `chip` | `badge` | `tag` |
| Separator | `divider` | `separator` | `hr` |
| Loading | `shimmer` | `skeleton` | `loading` |
| Toggle | `toggle` | `switch` | `on off` |
| Checkbox | `checkbox_button` | `checkbox` | `multi select` |
| Radio | `radio_button` | `radio` | `single select` |
| Image | `avatar` | `image` | `thumbnail` |
| Chat composer | `Ai Search` | `chat input` | `ask` / `AI input` |
| Chat composer field | `Ai Search Entry` | `chat field` | `composer input` |
| Chat tag | `tag` | `chip` | `category` |
| Chat prompt | `Quick selection cards` | `prompt card` | `quick selection` |
| Chat quick action | `Quick actions` | `chip action` | `suggestion` |
| Chat bubble (user) | `Chat bubble user` | `outgoing bubble` | `user message` |
| Chat bubble (agent) | `Chat bubble agent` | `incoming bubble` | `assistant message` |
| Chat nudge | `Nudge` / `Ai Nudge` | `banner` | `insight card` |
| Chat thinking | `Thinking State` | `loading` | `pending steps` |
| Chat header | `Header Logo` | `header` | `assistant bar` |
| Chat time | `Message Time` | `timestamp` | `message time` |

**Selection:** after all three searches, prefer the most complete
pre-assembled SubZero component over assembling atoms. Example:
`Progress tracker_New` beats a row of `horizontal_step` unless per-step
state control is required. When uncertain, probe both (Step 2b) and pick
the one that matches intent with the least manual assembly.

## Step 2b — variant probe (mandatory before placement)

For every component you intend to use:

```js
const set = await figma.importComponentSetByKeyAsync('COMPONENT_KEY')
const variants = set.children.map(c => c.name)
const inst = set.defaultVariant.createInstance()
const props = Object.entries(inst.componentProperties).reduce((acc, [k, v]) => {
  acc[k] = { type: v.type, value: v.value }
  return acc
}, {})
const textNodes = inst
  .findAll(n => n.type === 'TEXT')
  .map(n => ({ name: n.name, chars: n.characters }))
const size = { w: inst.width, h: inst.height }
const sizing = {
  primary: inst.primaryAxisSizingMode,
  counter: inst.counterAxisSizingMode
}
inst.remove()
return { variants, props, textNodes, size, sizing }
```

Before placing:

1. Compare `inst.width` / `inst.height` to the container.
2. If an axis is `'AUTO'`, do not resize that axis — pick a size variant that fits (e.g. `Size=S` instead of stretching `Size=M`).
3. Never hardcode property keys like `"label_text"` — read them from `componentProperties` and TEXT nodes.

If the file already has SubZero screens, inspect existing instances first:

```js
const frame = figma.currentPage.findOne(
  n => n.name.includes('SubZero') || n.name.includes('DS')
)
// walk frame.findAll(n => n.type === 'INSTANCE') to build a component map
```
