# subzero-coding-standards

Agent Plugins 1.0 package for SubZero (`@am92/react-design-system`) standards.
One plugin install, three skills:

| Skill | Who | Slash command |
| ----- | --- | ------------- |
| Shared DS language (tokens, component inventory) | Everyone | `/subzero-principles` |
| React/TypeScript coding (`sx`, HTML→`Ds*`, Redux 5-file API) | Developers | `/subzero-coding-standards` |
| SubZero Figma screens from a prompt or existing PRD | Designers and PMs | `/subzero-design-standards` |

Role skills load `subzero-principles` first so tokens and component names stay
aligned. There is no separate product-manager skill: a PM who wants a demo
from a PRD uses `/subzero-design-standards`. This plugin does not write PRDs.

## Prerequisites

- **Coding skill:** a target project with `@am92/react-design-system` installed.
- **Design skill:** a Figma file with the SubZero V.2.0 library (MCP optional).
  PMs use this same skill with an existing PRD to get a demo — they do not
  need a separate skill.
- VS Code / Cursor with plugins enabled (`chat.plugins.enabled` is `true` by default).

Skills stay the source of truth. A thin MCP server in `mcp-server/` exposes
the same files to any MCP client (Cursor, Claude Desktop, Copilot, custom
agents) without copying the markdown.

## Usage after install

Install the plugin once. Then invoke the role you need:

```text
/subzero-coding-standards Build this screen with DS components
/subzero-design-standards Create this screen in Figma from the PRD, SubZero only
```

The agent should also auto-pick from the prompt (React/JSX → coding, Figma/PRD
demo → design) because each skill `description` lists WHAT, WHEN, and trigger
phrases. Slash commands are optional. In Cursor, skills stay on **Agent
Decides** (do not set them to Manual-only) so auto-invocation works.

## MCP (any client)

Same standards, served over MCP stdio. No `npm install`. Requires Node.js.
Stdout is one JSON-RPC object per line (what Cursor expects). To use
LSP `Content-Length` framing instead, set `MCP_STDIO_FRAMING=lsp`.

| Tool | Purpose |
| ---- | ------- |
| `list_skills` | Catalog + descriptions + reference file names |
| `load_skill` | One `SKILL.md` (`include_references` optional) |
| `load_reference` | One `reference/*.md` file |
| `load_skill_bundle` | Skill + every reference in one call |

Resources: `subzero://skills`, `subzero://skill/<name>`,
`subzero://skill/<name>/reference/<file>.md`.

Prompts: `apply-subzero-principles`, `apply-subzero-coding-standards`,
`apply-subzero-design-standards`.

Print a ready-to-paste config with absolute paths:

```sh
node mcp-server/index.mjs --print-config
```

**Cursor / Claude Desktop / any stdio MCP host** — merge that JSON into:

- Cursor user: `~/.cursor/mcp.json` under `mcpServers`
- Cursor project: `.cursor/mcp.json` (already in this repo)
- Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json`

Example:

```json
{
  "mcpServers": {
    "subzero-standards": {
      "command": "node",
      "args": [
        "/absolute/path/to/subzero-coding-standards-skill/mcp-server/index.mjs"
      ]
    }
  }
}
```

Reload the client. On a SubZero React or Figma task the agent should call
`list_skills` then `load_skill_bundle`.

This repo also ships Agent Plugins `mcp.json`, so plugin-aware clients can
start the same server from the package.

## Structure

```
plugin.json
mcp.json
mcp-server/
  index.mjs
skills/
  subzero-principles/
    SKILL.md
    reference/
      tokens.md
      components.md
      ux-guardrails.md
  subzero-coding-standards/
    SKILL.md
    reference/
      token-reference.md
      common-mistakes.md
      validation-checklist.md
      api-integration-pattern.md
  subzero-design-standards/
    SKILL.md
    reference/
      figma-tokens.md
      discovery-protocol.md
      screen-composition.md
      figma-gotchas.md
      conversational-ui.md
scripts/
  validate-plugin.mjs
```

## Local testing

Clone or download this repository, then register it as a local plugin in
your VS Code user settings:

```json
// settings.json
"chat.pluginLocations": {
  "/absolute/path/to/subzero-coding-standards-skill": true
}
```

In Cursor, you can also copy the repo into `~/.cursor/plugins/local/` and
reload the window.

Reload, then confirm these skills are listed and enabled:

- `subzero-principles`
- `subzero-coding-standards`
- `subzero-design-standards`

## Installing from a Git source

1. Run **Chat: Install Plugin From Source** from the Command Palette.
2. Enter this repository's Git URL, e.g.
   `https://github.com/akshat24sharma/subzero-coding-standards-skill.git`.
3. VS Code clones and installs the plugin; verify it under
   **Extensions → Agent Plugins - Installed**.

## Distribution via an internal marketplace

To distribute through an internal Agent Plugin marketplace, add an entry for
this plugin to the marketplace's `marketplace.json` (source pointing at this
repository), then register the marketplace in team settings:

```json
// settings.json or .github/copilot/settings.json
"chat.plugins.marketplaces": [
  "your-org/internal-plugin-marketplace"
]
```

Team members can then discover and install it via
**Extensions → @agentPlugins**.

Cursor team marketplaces can import the same Git repo from Dashboard →
Plugins. One install still exposes all three skills.

## Releasing an update

For every release:

1. Bump `version` in [plugin.json](plugin.json) (Semantic Versioning).
2. Update the corresponding plugin entry's `version` in the marketplace
   repository's `marketplace.json` (if distributed via marketplace).
3. Commit and push. Consumers pick up the update the next time VS Code
   checks for extension updates (**Extensions: Check for Extension
   Updates**, or automatically every 24 hours).

## Validation

Run the built-in validator (Node.js built-ins only, no dependencies) before
publishing:

```sh
node scripts/validate-plugin.mjs
```

It checks that:

- `plugin.json` exists, declares the Agent Plugins 1.0 `$schema`, and has a
  valid lowercase kebab-case `name` and a `version`.
- Each folder under `skills/` matches the plain kebab-case `name` field in
  its `SKILL.md` YAML frontmatter.
- Required `reference/` files for every skill are present.
- If `mcp.json` exists, it is valid and `mcp-server/index.mjs` is present.

## Troubleshooting: skill does not appear

- Confirm `chat.plugins.enabled` is `true`.
- Run `node scripts/validate-plugin.mjs` and fix any reported errors.
- Confirm each `skills/<name>/SKILL.md` frontmatter `name` is plain kebab-case
  and matches the folder name (no namespace prefix).
- Confirm `plugin.json` is at the repository root and its `$schema` is
  exactly `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`.
- If installed from source and stuck, remove the cached clone and reinstall:
  - macOS: `~/Library/Application Support/Code/agentPlugins/github.com/{org}/{repo}`
  - Linux: `~/.config/Code/agentPlugins/github.com/{org}/{repo}`
  - Windows: `%APPDATA%\Code\agentPlugins\github.com\{org}\{repo}`

## Placeholders to replace before publishing

- `author.name` in [plugin.json](plugin.json) is set to a generic
  `"SubZero Team"` placeholder — replace with a real author/team name if
  desired.
- The internal marketplace name/URL in this README is illustrative
  (`your-org/internal-plugin-marketplace`) — replace with your actual
  marketplace repository once one exists.
