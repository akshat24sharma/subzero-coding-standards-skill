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
if (!existsSync(skillsDir)) {
  fail("skills/ directory is missing.");
} else {
  const skillFolders = readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (skillFolders.length === 0) {
    fail("skills/ directory contains no skill folders.");
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

// 3. Required reference files for the subzero-coding-standards skill.
const requiredReferenceFiles = [
  "reference/token-reference.md",
  "reference/common-mistakes.md",
  "reference/validation-checklist.md",
  "reference/api-integration-pattern.md",
];
const subzeroSkillDir = join(skillsDir, "subzero-coding-standards");
if (existsSync(subzeroSkillDir)) {
  for (const relPath of requiredReferenceFiles) {
    if (!existsSync(join(subzeroSkillDir, relPath))) {
      fail(`skills/subzero-coding-standards/${relPath} is missing.`);
    }
  }
}

if (errors.length > 0) {
  console.error("Plugin validation failed:\n");
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log("Plugin validation passed.");
