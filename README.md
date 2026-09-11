# subzero-coding-standards

Agent Plugins 1.0 package for the `subzero-coding-standards` skill: teaches
coding agents to write React/TypeScript code that is 100% compliant with
`@am92/react-design-system` ("SubZero" / "DS") — design tokens, `sx` prop
rules, HTML-to-DS component mapping, and the 5-file Redux API pattern.

## Prerequisites

- A target project with `@am92/react-design-system` installed.
- VS Code with `chat.plugins.enabled` set to `true` (default).

This is a skills-only plugin: it does not bundle MCP servers, hooks, custom
agents, or slash commands.

## Structure

```
plugin.json
skills/
  subzero-coding-standards/
    SKILL.md
    reference/
      token-reference.md
      common-mistakes.md
      validation-checklist.md
      api-integration-pattern.md
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

Reload the window, then check **Chat: Configure Skills** to confirm
`subzero-coding-standards` is listed and enabled.

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
- All required `reference/` files for `subzero-coding-standards` are
  present.

## Troubleshooting: skill does not appear

- Confirm `chat.plugins.enabled` is `true`.
- Run `node scripts/validate-plugin.mjs` and fix any reported errors.
- Confirm `skills/subzero-coding-standards/SKILL.md`'s frontmatter `name`
  field is exactly `subzero-coding-standards` (plain kebab-case, no
  namespace prefix) and matches the folder name.
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
