#!/usr/bin/env node
// Validates plugin.json, the skill folder/frontmatter name match, and required reference files.
// Uses only Node.js built-ins (no dependencies).

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function fail(msg) {
  errors.push(msg);
}

// 1. plugin.json must exist and declare the Agent Plugins 1.0 schema.
const pluginJsonPath = join(ROOT, "plugin.json");
if (!existsSync(pluginJsonPath)) {
  fail("plugin.json is missing at the repo root.");
} else {
  let plugin;
  try {
    plugin = JSON.parse(readFileSync(pluginJsonPath, "utf8"));
  } catch (e) {
    fail(`plugin.json is not valid JSON: ${e.message}`);
  }
  if (plugin) {
    if (plugin.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") {
      fail("plugin.json $schema must be the canonical Agent Plugins 1.0 schema URL.");
    }
    if (!plugin.name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(plugin.name)) {
      fail(`plugin.json "name" must be lowercase kebab-case (got: ${plugin.name}).`);
    }
    if (!plugin.version) {
      fail('plugin.json is missing a "version" field.');
    }
  }
}

// 2. Every skill folder name must match the "name" in its SKILL.md frontmatter.
const skillsDir = join(ROOT, "skills");
const expectedSkills = [
  "subzero-principles",
  "subzero-coding-standards",
  "subzero-design-standards",
];

if (!existsSync(skillsDir)) {
  fail("skills/ directory is missing.");
} else {
  const skillFolders = readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (skillFolders.length === 0) {
    fail("skills/ directory contains no skill folders.");
  }

  for (const expected of expectedSkills) {
    if (!skillFolders.includes(expected)) {
      fail(`skills/${expected}/ is missing.`);
    }
  }

  for (const folder of skillFolders) {
    const skillMdPath = join(skillsDir, folder, "SKILL.md");
    if (!existsSync(skillMdPath)) {
      fail(`skills/${folder}/SKILL.md is missing.`);
      continue;
    }
    const content = readFileSync(skillMdPath, "utf8");
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
      fail(`skills/${folder}/SKILL.md has no YAML frontmatter.`);
      continue;
    }
    const nameMatch = frontmatterMatch[1].match(/^name:\s*(.+)$/m);
    if (!nameMatch) {
      fail(`skills/${folder}/SKILL.md frontmatter is missing a "name" field.`);
      continue;
    }
    const name = nameMatch[1].trim();
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
      fail(`skills/${folder}/SKILL.md "name: ${name}" must be plain kebab-case with no namespace prefix.`);
    }
    if (name !== folder) {
      fail(`skills/${folder} folder name does not match SKILL.md "name: ${name}".`);
    }
  }
}

// 3. Required reference files per skill.
const requiredBySkill = {
  "subzero-principles": [
    "reference/tokens.md",
    "reference/components.md",
    "reference/ux-guardrails.md",
    "reference/experience-behaviours.md",
  ],
  "subzero-coding-standards": [
    "reference/token-reference.md",
    "reference/common-mistakes.md",
    "reference/validation-checklist.md",
    "reference/api-integration-pattern.md",
  ],
  "subzero-design-standards": [
    "reference/figma-tokens.md",
    "reference/discovery-protocol.md",
    "reference/screen-composition.md",
    "reference/figma-gotchas.md",
    "reference/conversational-ui.md",
    "reference/ux-review.md",
  ],
};

for (const [skill, relPaths] of Object.entries(requiredBySkill)) {
  const skillDir = join(skillsDir, skill);
  if (!existsSync(skillDir)) continue;
  for (const relPath of relPaths) {
    if (!existsSync(join(skillDir, relPath))) {
      fail(`skills/${skill}/${relPath} is missing.`);
    }
  }
}

// 4. MCP adapter (optional but required if mcp.json is present).
const mcpJsonPath = join(ROOT, "mcp.json");
const mcpServerPath = join(ROOT, "mcp-server", "index.mjs");
if (existsSync(mcpJsonPath)) {
  let mcp;
  try {
    mcp = JSON.parse(readFileSync(mcpJsonPath, "utf8"));
  } catch (e) {
    fail(`mcp.json is not valid JSON: ${e.message}`);
  }
  if (mcp) {
    if (mcp.$schema !== "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json") {
      fail("mcp.json $schema must be the canonical Agent Plugins MCP schema URL.");
    }
    if (!mcp.mcpServers || !mcp.mcpServers["subzero-standards"]) {
      fail('mcp.json must declare mcpServers["subzero-standards"].');
    }
  }
  if (!existsSync(mcpServerPath)) {
    fail("mcp-server/index.mjs is missing.");
  }
}

if (errors.length > 0) {
  console.error("Plugin validation failed:\n");
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log("Plugin validation passed.");
