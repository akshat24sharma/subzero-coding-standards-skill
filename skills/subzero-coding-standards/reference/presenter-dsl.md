# Presenter TEXT templates

Load this file and `presenter-catalog.json` when the user asks about a
presenter layer, ML-chosen UI, DSL, `responseBlock`, configurable UI,
server-driven UI, or TEXT strings that embed component keys (for example
`PIE`).

Keep the product’s **one TEXT string**. Do not replace it with a nested
`DsStack` JSON tree. Today the string contains product keys (`PIE`). Swap
those keys for **catalog component ids**. The frontend splits the string,
**replaces each key with a component**, and **renders the rest of the
copy unchanged**.

## What stays the same

```text
{ "type": "TEXT", "data": "<string with keys>" }
```

The list may live at any path the product already uses (QnA example:
`data.response.responseBlock`). This skill does not own the HTTP envelope
(`statusCode`, `fileQnAId`, …). Domain fields stay beside the list.
Services return the body **unchanged**. Split/replace is UI-only.

No HTML in the TEXT string.

## What changes

| Today | SubZero presenter |
| ----- | ----------------- |
| Token is a product id (`PIE`) | Token is a catalog `id` (`DsChip`, `DsSlider`, …) or an **instance key** whose embed `type` is a catalog id |
| Transformer special-cases `PIE` | Transformer looks up the catalog / embed and renders that `Ds*` (or a `dsGap` host chart) |
| Rest of the string | Unchanged → `DsTypography` segments |

Recommended delimiter: `{{id}}` (avoids the English word “pie”). If the
product already uses bare tokens (`PIE`), keep that delimiter in an app
overlay — only the **id vocabulary** must move to the catalog.

## Payload

Prose only (placeholder needs no extra props):

```json
{
  "type": "TEXT",
  "data": "Your spending by category is {{txnBreakdown}}. There was a brown crow."
}
```

With **props** (labels, chart data, button copy), add `embeds` keyed by the
same id:

```json
{
  "type": "TEXT",
  "data": "Your spending by category is {{txnBreakdown}}. {{continueCta}}",
  "embeds": {
    "txnBreakdown": {
      "type": "PIE",
      "dsGap": true,
      "props": {
        "title": "Transaction breakdown by category",
        "labels": ["Education", "Food"],
        "values": [349994, 491398.1]
      }
    },
    "continueCta": {
      "type": "DsButton",
      "props": {
        "color": "primary",
        "children": "Continue"
      }
    }
  }
}
```

Rules:

- `{{DsDivider}}` with no props: omit `embeds`; catalog defaults are enough.
- The same widget twice: two instance keys (`{{txnBreakdown}}`,
  `{{incomeBreakdown}}`), not two raw `{{DsChip}}`.
- `PIE` is a **dsGap** embed type (no `DsPie` in the inventory). Do not put
  the magic word `PIE` in the string unless the product overlay still aliases
  it.
- `props` must use catalog keys only, with **concrete values** already filled.
- No functions, `sx`, hex, or HTML in `props`.

## Transformer (replicate current behaviour)

1. Split `data` on `{{...}}` (or the product delimiter).
2. **Text runs** → `DsTypography`, substring **as-is**. Do not rewrite copy
   on the client. (When *generating* the string, follow
   `../subzero-principles/reference/content-design.md`.)
3. **Placeholder** → `embeds[id]` if present, else `type: id` from
   `presenter-catalog.json`. Render via the existing transformer map.
   Pass only catalog-allowlisted `props`.
4. Unknown id → `DsBox` (or a short `DsTypography` flag), not a leftover
   `{{id}}` and not a guessed chart.
5. Result is `[Typography][Component][Typography]…` — same as replacing
   `PIE` with a chart today.

Import components only from the `@am92/react-design-system` barrel.

## How to fill props (backend / ML)

Catalog cards list every payload-safe prop. Fields with `"copy": true`
(`label`, `children`, `helperText`, tag `label`/`value`) must not be empty.

1. **Design / Code Connect present** — copy visible text into copy props.
   Copy variant/state enums from the instance. Do not invent
   `variant: "filled"`. Do not guess Figma property keys.
2. **Requirement / question only** — generate copy with `content-design.md`.
   Pick the smallest catalog enum that matches intent (`DsButton` primary
   CTA → `color: "primary"`; omit `variant` if unspecified).
3. **Required copy still missing** — do not emit that embed; ask.
   Example: `DsTag` needs both `label` and `value`.

Controlled `value` on `DsTextField` / `DsSlider` / `DsSelect` is **not**
sent on every keystroke. The transformer keeps it in local state. Prefill
once with `props.defaultValue` if the design shows a value.

Optional events on an embed: `events: { "onClick": "submitKyc" }` (string
action id). The page ActionMap handles it. Do not put functions in JSON.
Typing uses local `onChange`; do not put `onChange` in the payload.

## What ML should emit

Write the sentence first. Insert `{{instanceKey}}` where a widget belongs.
Attach `embeds` with catalog `type` + filled `props`.

| Requirement | Placeholder |
| ----------- | ----------- |
| One numeric range | one `DsSlider` embed |
| One typed field | one `DsTextField` embed |
| Search | `DsSearchbar`, not `DsTextField` |
| Date | `DsDatePicker` |
| Several related fields + Continue | several placeholders in the same TEXT (or extra `responseBlock` items if the product already does that) |
| Read-only prose | no placeholder — leave the words in the string |
| Status / filter pill | `DsChip` or `DsTag` |
| Table | `DsTable` |
| Chart / pie | dsGap embed (`PIE` or product type), chrome copy in `props.title` |

Prefer Subzero 3.0 conversational cards for chat slots. If the catalog
`code` is `null` (Figma-only), do not invent a `Ds*` name.

## Wrong vs right

```text
❌ type: "TEXT", data: "see PIE below"          // product magic word
✅ data: "see {{txnBreakdown}} below" + embeds.txnBreakdown

❌ embeds.cta.props.label = "Continue" on DsButton
✅ props.children = "Continue"

❌ HTML in the TEXT string
✅ plain text + placeholders

❌ Transform the TEXT in the HTTP service
✅ Store raw; split/replace in the UI transformer

❌ type: "DsPie"
✅ dsGap embed (PIE / host chart inside DsBox)
```

## Catalog file

Legal placeholder / embed types, props, enums, and copy flags:
[presenter-catalog.json](presenter-catalog.json).
