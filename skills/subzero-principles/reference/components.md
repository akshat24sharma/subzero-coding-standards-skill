# SubZero component inventory (shared)

Use the most specific DS component that matches intent. Do not rebuild it
from `DsBox`, frames, or HTML. If nothing matches, stop and ask — do not
ship a 50-line custom control.

Names below are the code (`Ds*`) names. Figma library names often differ
(`App_bar`, `Text_Input`, `bottom_navigation`). Designers must search the
SubZero library for the equivalent instance; they must not treat a
third-party or unnamed library hit as SubZero.

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
| Chat / assistant composer | Library assistant / AI / ask input if one exists | `DsSearchbar` or `Text_Input` used as a chat box |
| Chat category filter | `DsTag` when Code Connect or the library maps tag | raw pill; `DsChip` without checking the mapping |
| Chat quick prompt | Library prompt-card / DS card | raw `DsBox` pill when a card instance exists |
| Chat bubble | Library user / assistant bubble | hex rounded box |
| Chat pending | `DsLoader` or DS icon + `DsTypography` | fabricated result card |
| Card | DS card instance if one exists | generic framed box when a card component exists |

## Layout rule

- **Full width / page chrome:** `DsBox` (code may need `maxWidth: 'none'` where `DsContainer` defaults constrain)
- **Centered form/card column:** `DsContainer`
- **Typography is not a layout node.** If text needs flex/alignment, wrap it in `DsBox` / `DsStack`

## Substitution rule

Specific beats generic. Composite beats atom. First search hit is not proof.

```text
Search control     → DsSearchbar before DsTextField
Chat composer      → dedicated assistant input, not DsSearchbar
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

Code uses `Ds*`. Figma V.2.0 often uses different instance names. Treat these
as the same intent, not as interchangeable widgets:

| Intent | Code | Figma (search these) |
| ------ | ---- | -------------------- |
| Text field | `DsTextField` | `Text_Input` |
| OTP | dedicated OTP | `OTP` / `OTP_digit_input` |
| Date | `DsDatePicker` | `Date_input` |
| Phone / amount | dedicated field | `Phone_number_input` |
| Password | dedicated field | `Password_input` |
| Multiline | `DsTextField` multiline | `Description_Input` |
| Select | `DsSelect` | `Suggestion_list` |
| App bar | `DsAppBar` | `App_bar` |
| Bottom nav | DS nav | `bottom_navigation` |
| Chat composer | dedicated assistant input if it exists | AI / ask / chat input (search; names vary) |
| Chat tag | `DsTag` | `tag` |
| Chat prompt | DS card / prompt card | `Quick selection` / prompt card (search) |
| Chat bubble | library bubble | user / assistant bubble (search) |
| Progress | `DsProgressTracker` | `Progress tracker_New` |

Designers must filter library hits to **Subzero V.2.0 Design System**.

## When nothing exists

1. Confirm no DS wrapper exists.
2. Confirm it is not a native control the DS should wrap (autocomplete, date, rating, etc.).
3. Confirm it cannot be composed from `DsBox` + `DsTypography` + existing controls.
4. Only then ask to introduce something new. Do not silently invent it.
