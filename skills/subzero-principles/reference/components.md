# SubZero component inventory (shared)

Use the most specific DS component that matches intent. Do not rebuild it
from `DsBox`, frames, or HTML. If nothing matches, stop and ask — do not
ship a 50-line custom control.

Names below are the code (`Ds*`) names. Figma library names often differ
(`App_bar`, `Text_Input`, `Ai Search`, `bottom_navigation`). Designers
must search SubZero libraries for the equivalent instance; they must not
treat a third-party or unnamed library hit as SubZero.

**Figma library precedence:** search `Subzero 3.0 Design System` first.
Use `Subzero V.2.0 Design System` only when 3.0 has no match for that
intent. 3.0 currently covers conversational slots (composer, bubbles,
prompts, thinking). Chrome such as `App_bar`, form inputs, and tokens
usually still come from V.2.0.

| Intent | Use | Do not |
| ------ | --- | ------ |
| Generic container / full-width shell | `DsBox` | `DsContainer` for full-bleed content |
| Constrained / centered content (forms, cards) | `DsContainer` | `DsContainer` for page-width chrome |
| Flex column/row layout | `DsStack` | raw flex `div` / frames of boxes |
| Text, headings, captions | `DsTypography` | raw `p` / `h1` / text with manual font size |
| Button with label | `DsButton` | raw `button`; do not put label in a `label` prop in code |
| Icon-only button | `DsIconButton` | `DsButton` without text |
| Text field | `DsTextField` | raw `input` |
| Select / dropdown | `DsSelect` | raw `select` / homemade menu |
| Checkbox | `DsCheckbox` | raw checkbox |
| Radio | `DsRadio` + `DsRadioGroup` | raw radio |
| Icons | `DsRemixIcon` | inline SVG / `<i>` |
| Filter / status pill | `DsChip` | `DsBox` + radius to fake a pill |
| Tag / category | `DsTag` | chip used as a tag without checking API |
| Stepper / wizard | `DsProgressTracker` | deprecated stepper; hand-built steps |
| Table | `DsTable` family | flex/grid rows pretending to be a table |
| Top chrome | `DsHeader` | custom full-bleed bar |
| Secondary app bar (back + actions) | `DsAppBar` | custom header row |
| Tooltip | `DsTooltip` | `title` attribute / floating text |
| Accordion | `DsAccordion` | homemade collapse |
| Slider | `DsSlider` | custom track |
| Modal / dialog | `DsModal` / `DsDialog` | overlay `DsBox` |
| Autocomplete | `DsAutocomplete` | text field + custom list |
| Date picker | `DsDatePicker` | text field used as a date |
| File uploader | `DsFileUploader` | custom drop zone |
| Pagination | `DsPagination` | custom page buttons |
| Tabs | `DsTabs` + `DsTab` | stacked buttons |
| Image | `DsImage` | raw `img` |
| Divider | `DsDivider` | 1px box as a line |
| Link | `DsLink` | raw `a` for in-app actions that should be DS links |
| Loader | `DsLoader` | custom spinner |
| Progress bar | `DsLinearProgress` | custom bar |
| Toast | `DsNotistack` + `DsToast` | custom overlay |
| Bottom sheet | `DsBottomSheet` | custom drawer |
| Side drawer | `DsDrawer` | custom panel |
| Avatar | `DsAvatar` | circular `DsBox` |
| Badge | `DsBadge` | notification dot frame |
| FAB | `DsFab` | absolutely positioned button |
| Menu | `DsMenu` + `DsMenuItem` | custom popup |
| Search | `DsSearchbar` (before `DsTextField`) | text field used as search |
| Chat / assistant composer | 3.0 `Ai Search` | `DsSearchbar` or V.2.0 `Text_Input` used as a chat box |
| Chat category filter | 3.0 `tag` / `DsTag` when Code Connect maps tag | raw pill; `DsChip` without checking the mapping |
| Chat quick prompt | 3.0 `Quick selection cards` | raw `DsBox` pill when a card instance exists |
| Chat bubble | 3.0 `Chat bubble user` / `Chat bubble agent` | hex rounded box |
| Chat pending | 3.0 `Thinking State` / `Loading text`, else `DsLoader` | fabricated result card |
| Card | DS card instance if one exists | generic framed box when a card component exists |

## Layout rule

- **Full width / page chrome:** `DsBox` (code may need `maxWidth: 'none'` where `DsContainer` defaults constrain)
- **Centered form/card column:** `DsContainer`
- **Typography is not a layout node.** If text needs flex/alignment, wrap it in `DsBox` / `DsStack`

## Substitution rule

Specific beats generic. Composite beats atom. First search hit is not proof.

```text
Search control     → DsSearchbar before DsTextField
Chat composer      → 3.0 Ai Search, not DsSearchbar or V.2.0 Text_Input
Status/filter pill → DsChip or DsTag before DsBox
Chat category      → DsTag when that is the mapping, not a homemade pill
Image              → DsImage before DsBox as img
Table              → DsTable before flex rows
OTP                → OTP / Ds OTP input, not six boxes or a text field
Date               → DsDatePicker / Date_input, not a text field
Phone / amount     → dedicated prefixed input, not a text field
Password           → Password_input, not a text field
Bottom nav         → DS bottom navigation, not circles + labels
Stepper            → DsProgressTracker / Progress tracker_New before step atoms
```

If Code Connect or an existing Figma instance already maps a node to a DS
component, keep that component.

## Figma library names (design surface)

Code uses `Ds*`. Figma names often differ. Treat these as the same intent,
not as interchangeable widgets.

Search **Subzero 3.0 Design System** first, then **Subzero V.2.0 Design
System** only if 3.0 has no match. Source for 3.0:

https://www.figma.com/design/YBhe8vnUvSgR8KzbruzafR/Subzero-3.0-Design-System

Do not catalog every node URL. Search by name; use the returned
`componentKey`.

| Intent | Code | Figma (search these) |
| ------ | ---- | -------------------- |
| Text field | `DsTextField` | V.2.0 `Text_Input` |
| OTP | dedicated OTP | V.2.0 `OTP` / `OTP_digit_input` |
| Date | `DsDatePicker` | V.2.0 `Date_input` |
| Phone / amount | dedicated field | V.2.0 `Phone_number_input` |
| Password | dedicated field | V.2.0 `Password_input` |
| Multiline | `DsTextField` multiline | V.2.0 `Description_Input` |
| Select | `DsSelect` | V.2.0 `Suggestion_list` |
| App bar | `DsAppBar` | 3.0 `Header Logo` on chat; else V.2.0 `App_bar` |
| Bottom nav | DS nav | V.2.0 `bottom_navigation` |
| Chat composer | dedicated assistant input | 3.0 `Ai Search` |
| Chat tag | `DsTag` | `tag` |
| Chat prompt | DS card / prompt card | 3.0 `Quick selection cards` |
| Chat bubble | library bubble | 3.0 `Chat bubble user` / `Chat bubble agent` |
| Chat thinking | loader + status | 3.0 `Thinking State` |
| Progress | `DsProgressTracker` | V.2.0 `Progress tracker_New` |

Designers must keep 3.0 hits over V.2.0 for the same intent. Remix Icons
are glyphs only.

## When nothing exists

1. Confirm no DS wrapper exists in **Subzero 3.0**, then **V.2.0**.
2. Confirm it is not a native control the DS should wrap (autocomplete, date, rating, etc.).
3. Confirm it cannot be composed from `DsBox` + `DsTypography` + existing controls.
4. Only then ask to introduce something new. Do not silently invent it.
