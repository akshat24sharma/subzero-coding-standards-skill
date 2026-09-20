#!/usr/bin/env node
// Thin MCP adapter over skills/*. Does not copy or rewrite standards.
// Speaks MCP JSON-RPC over stdio (Content-Length framing). Node built-ins only.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PLUGIN_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(PLUGIN_ROOT, "skills");
const SERVER_NAME = "subzero-standards";
const SERVER_VERSION = readPluginVersion();
const PROTOCOL_VERSIONS = [
  "2024-11-05",
  "2025-03-26",
  "2025-06-18",
  "2025-11-25",
];

function readPluginVersion() {
  try {
    const plugin = JSON.parse(readFileSync(join(PLUGIN_ROOT, "plugin.json"), "utf8"));
    return plugin.version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function parseFrontmatter(md) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { attributes: {}, body: md };
  const attributes = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    if (value === ">-" || value === "|") value = "";
    attributes[key] = value;
  }
  const folded = match[1].match(/^description:\s*>-?\n((?:[ \t]+.+\n)+)/m);
  if (folded) {
    attributes.description = folded[1]
      .split(/\r?\n/)
      .map((l) => l.replace(/^[ \t]+/, ""))
      .filter(Boolean)
      .join(" ");
  }
  return { attributes, body: match[2] };
}

function listSkillNames() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(SKILLS_DIR, d.name, "SKILL.md")))
    .map((d) => d.name)
    .sort();
}

function skillDir(name) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`Invalid skill name: ${name}`);
  }
  const dir = join(SKILLS_DIR, name);
  if (!existsSync(join(dir, "SKILL.md"))) {
    throw new Error(`Unknown skill: ${name}. Try list_skills.`);
  }
  return dir;
}

function listReferences(name) {
  const refDir = join(skillDir(name), "reference");
  if (!existsSync(refDir) || !statSync(refDir).isDirectory()) return [];
  return readdirSync(refDir)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function loadSkillMarkdown(name) {
  return readFileSync(join(skillDir(name), "SKILL.md"), "utf8");
}

function loadReferenceMarkdown(name, file) {
  const base = String(file).replace(/\\/g, "/").split("/").pop();
  if (!base || !/^[A-Za-z0-9._-]+\.md$/.test(base)) {
    throw new Error(`Invalid reference file: ${file}`);
  }
  const path = resolve(join(skillDir(name), "reference", base));
  const root = resolve(join(skillDir(name), "reference")) + sep;
  if (!path.startsWith(root) && path !== root.slice(0, -1)) {
    throw new Error(`Reference path escapes skill folder: ${file}`);
  }
  if (!existsSync(path)) {
    throw new Error(
      `Missing reference ${base} for ${name}. Available: ${listReferences(name).join(", ") || "(none)"}`
    );
  }
  return { file: base, markdown: readFileSync(path, "utf8") };
}

function skillSummary(name) {
  const { attributes } = parseFrontmatter(loadSkillMarkdown(name));
  return {
    name,
    description: attributes.description || "",
    references: listReferences(name),
  };
}

function catalog() {
  return listSkillNames().map(skillSummary);
}

const TOOLS = [
  {
    name: "list_skills",
    description:
      "List SubZero skills (principles, coding, design) with descriptions and reference files. Call first when the user mentions SubZero, AM92, @am92/react-design-system, Ds* components, $sz- tokens, or design-system work, so you can pick the right skill.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "load_skill",
    description:
      "Load one SubZero SKILL.md (unchanged). Use subzero-principles for tokens/components/ux-guardrails/experience-behaviours, subzero-coding-standards for React/JSX/sx/Redux, subzero-design-standards for Figma/PRD demos, conversational UI, and ux-review. Call before doing that work. Set include_references true to also attach every reference/*.md.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Skill folder name: subzero-principles | subzero-coding-standards | subzero-design-standards",
        },
        include_references: {
          type: "boolean",
          description: "If true, append all reference/*.md files after SKILL.md",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "load_reference",
    description:
      "Load one reference markdown file from a skill (for example token-reference.md or figma-tokens.md). Call after load_skill when that skill's load order names the file.",
    inputSchema: {
      type: "object",
      properties: {
        skill: { type: "string", description: "Skill name that owns the file" },
        file: {
          type: "string",
          description: "File name under skills/<skill>/reference/, e.g. tokens.md",
        },
      },
      required: ["skill", "file"],
      additionalProperties: false,
    },
  },
  {
    name: "load_skill_bundle",
    description:
      "Load SKILL.md plus every reference file for one skill in a single call. Prefer this when starting a SubZero coding or Figma task so the agent has the full contract.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Skill folder name: subzero-principles | subzero-coding-standards | subzero-design-standards",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
];

function toolText(text) {
  return { content: [{ type: "text", text }] };
}

function toolError(message) {
  return { isError: true, content: [{ type: "text", text: message }] };
}

function formatSkill(name, includeReferences) {
  const markdown = loadSkillMarkdown(name);
  const { attributes } = parseFrontmatter(markdown);
  const refs = listReferences(name);
  const parts = [
    `# ${name}`,
    attributes.description ? `Description: ${attributes.description}` : "",
    `References: ${refs.join(", ") || "(none)"}`,
    "",
    markdown,
  ];
  if (includeReferences) {
    for (const file of refs) {
      const { markdown: refMd } = loadReferenceMarkdown(name, file);
      parts.push("", `---`, "", `# Reference: ${file}`, "", refMd);
    }
  }
  return parts.filter((line, i) => line !== "" || i > 1).join("\n");
}

function callTool(name, args = {}) {
  switch (name) {
    case "list_skills":
      return toolText(JSON.stringify({ skills: catalog() }, null, 2));
    case "load_skill":
      return toolText(formatSkill(args.name, Boolean(args.include_references)));
    case "load_reference": {
      const { file, markdown } = loadReferenceMarkdown(args.skill, args.file);
      return toolText(`# Reference ${args.skill}/${file}\n\n${markdown}`);
    }
    case "load_skill_bundle":
      return toolText(formatSkill(args.name, true));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function listResources() {
  const resources = [
    {
      uri: "subzero://skills",
      name: "SubZero skill catalog",
      mimeType: "application/json",
    },
  ];
  for (const name of listSkillNames()) {
    resources.push({
      uri: `subzero://skill/${name}`,
      name: `${name} SKILL.md`,
      mimeType: "text/markdown",
    });
    for (const file of listReferences(name)) {
      resources.push({
        uri: `subzero://skill/${name}/reference/${file}`,
        name: `${name}/${file}`,
        mimeType: "text/markdown",
      });
    }
  }
  return resources;
}

function readResource(uri) {
  if (uri === "subzero://skills") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify({ skills: catalog() }, null, 2),
        },
      ],
    };
  }
  const skillOnly = uri.match(/^subzero:\/\/skill\/([a-z0-9-]+)$/);
  if (skillOnly) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: loadSkillMarkdown(skillOnly[1]),
        },
      ],
    };
  }
  const ref = uri.match(/^subzero:\/\/skill\/([a-z0-9-]+)\/reference\/([A-Za-z0-9._-]+\.md)$/);
  if (ref) {
    const { markdown } = loadReferenceMarkdown(ref[1], ref[2]);
    return {
      contents: [{ uri, mimeType: "text/markdown", text: markdown }],
    };
  }
  throw new Error(`Unknown resource: ${uri}`);
}

function listPrompts() {
  return listSkillNames().map((name) => {
    const { description } = skillSummary(name);
    return {
      name: `apply-${name}`,
      description: `Apply the ${name} SubZero skill. ${description}`,
    };
  });
}

function getPrompt(name) {
  const match = String(name).match(/^apply-([a-z0-9-]+)$/);
  if (!match) throw new Error(`Unknown prompt: ${name}`);
  const skill = match[1];
  return {
    description: skillSummary(skill).description,
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text:
            `Follow this SubZero skill exactly. Load listed references as needed.\n\n` +
            formatSkill(skill, true),
        },
      },
    ],
  };
}

function handleRequest(message) {
  const { id, method, params = {} } = message;
  switch (method) {
    case "initialize": {
      const requested = params.protocolVersion;
      const protocolVersion = PROTOCOL_VERSIONS.includes(requested)
        ? requested
        : "2025-03-26";
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion,
          capabilities: {
            tools: { listChanged: false },
            resources: { subscribe: false, listChanged: false },
            prompts: { listChanged: false },
          },
          serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
          instructions:
            "SubZero standards MCP. Call list_skills or load_skill_bundle before SubZero React or Figma work. Skills are served from disk unchanged.",
        },
      };
    }
    case "ping":
      return { jsonrpc: "2.0", id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
    case "tools/call":
      try {
        return {
          jsonrpc: "2.0",
          id,
          result: callTool(params.name, params.arguments || {}),
        };
      } catch (err) {
        return { jsonrpc: "2.0", id, result: toolError(err.message) };
      }
    case "resources/list":
      return { jsonrpc: "2.0", id, result: { resources: listResources() } };
    case "resources/read":
      return { jsonrpc: "2.0", id, result: readResource(params.uri) };
    case "resources/templates/list":
      return { jsonrpc: "2.0", id, result: { resourceTemplates: [] } };
    case "prompts/list":
      return { jsonrpc: "2.0", id, result: { prompts: listPrompts() } };
    case "prompts/get":
      return {
        jsonrpc: "2.0",
        id,
        result: getPrompt(params.name),
      };
    default:
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      };
  }
}

// Cursor (and several other hosts) parse stdout as one JSON-RPC object per
// line. LSP Content-Length headers then show up as:
//   Failed to parse message: "Content-Length: 410\r\n"
// Official MCP spec framing is still available via MCP_STDIO_FRAMING=lsp.
const forcedFraming = process.env.MCP_STDIO_FRAMING;
let framing = forcedFraming === "lsp" || forcedFraming === "ndjson" ? forcedFraming : "ndjson";

function writeMessage(obj) {
  const json = JSON.stringify(obj);
  if (framing === "lsp") {
    const body = Buffer.from(json, "utf8");
    process.stdout.write(`Content-Length: ${body.length}\r\n\r\n`);
    process.stdout.write(body);
    return;
  }
  process.stdout.write(`${json}\n`);
}

function printClientConfigs() {
  const serverPath = resolve(join(PLUGIN_ROOT, "mcp-server", "index.mjs"));
  const block = {
    mcpServers: {
      "subzero-standards": {
        command: "node",
        args: [serverPath],
      },
    },
  };
  process.stdout.write(`${JSON.stringify(block, null, 2)}\n`);
}

if (process.argv.includes("--print-config")) {
  printClientConfigs();
  process.exit(0);
}

if (process.argv.includes("--self-test")) {
  try {
    const names = listSkillNames();
    if (names.length === 0) throw new Error("No skills found.");
    const listed = JSON.parse(callTool("list_skills").content[0].text);
    if (!listed.skills?.length) throw new Error("list_skills returned empty.");
    callTool("load_skill", { name: names[0] });
    const refs = listReferences(names[0]);
    if (refs[0]) callTool("load_reference", { skill: names[0], file: refs[0] });
    callTool("load_skill_bundle", { name: names[0] });
    process.stderr.write(`MCP self-test passed (${names.join(", ")}).\n`);
    process.exit(0);
  } catch (err) {
    process.stderr.write(`MCP self-test failed: ${err.message}\n`);
    process.exit(1);
  }
}

let buffer = Buffer.alloc(0);

function consume() {
  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) {
      const nl = buffer.indexOf("\n");
      if (nl !== -1 && buffer[0] === 0x7b) {
        if (!forcedFraming) framing = "ndjson";
        const line = buffer.subarray(0, nl).toString("utf8").trim();
        buffer = buffer.subarray(nl + 1);
        if (line) dispatch(line);
        continue;
      }
      return;
    }
    const header = buffer.subarray(0, headerEnd).toString("utf8");
    const lengthMatch = header.match(/Content-Length:\s*(\d+)/i);
    if (!lengthMatch) {
      buffer = buffer.subarray(headerEnd + 4);
      continue;
    }
    const length = Number(lengthMatch[1]);
    const start = headerEnd + 4;
    if (buffer.length < start + length) return;
    const json = buffer.subarray(start, start + length).toString("utf8");
    buffer = buffer.subarray(start + length);
    if (!forcedFraming) framing = "ndjson";
    dispatch(json);
  }
}

function dispatch(json) {
  let message;
  try {
    message = JSON.parse(json);
  } catch (err) {
    writeMessage({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: `Parse error: ${err.message}` },
    });
    return;
  }
  if (message.method && message.id === undefined) return;
  if (!message.method) return;
  try {
    writeMessage(handleRequest(message));
  } catch (err) {
    writeMessage({
      jsonrpc: "2.0",
      id: message.id ?? null,
      error: { code: -32000, message: err.message },
    });
  }
}

process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  consume();
});
process.stdin.on("end", () => process.exit(0));
process.stdin.resume();
