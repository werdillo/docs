#!/usr/bin/env node
/**
 * tokens-to-css.mjs — compiles a three-tier W3C Design Tokens file (tokens.json)
 * into a single CSS theme file with light defaults on :root, dark overrides under
 * [data-theme="dark"] and prefers-color-scheme: dark, and public touch density
 * under [data-density="public"].
 *
 * Node.js 18+, zero dependencies.
 *
 * Usage:
 *   node shared/scripts/tokens-to-css.mjs [input.json] [--out theme.css]
 */
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");

const args = process.argv.slice(2);
let inputPath = path.join(repoRoot, "design", "system", "tokens.json");
let outPath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out" && args[i + 1]) {
    outPath = path.resolve(args[++i]);
  } else if (args[i] === "--help" || args[i] === "-h") {
    console.log("Usage: node shared/scripts/tokens-to-css.mjs [tokens.json] [--out theme.css]");
    process.exit(0);
  } else if (!args[i].startsWith("-")) {
    inputPath = path.resolve(args[i]);
  }
}

const tokens = JSON.parse(fs.readFileSync(inputPath, "utf8"));

function formatValue(node) {
  const val = node.$value;
  if (node.$type === "fontFamily" && Array.isArray(val)) {
    return val.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ");
  }
  if (node.$type === "cubicBezier" && Array.isArray(val)) {
    return `cubic-bezier(${val.join(", ")})`;
  }
  if (typeof val === "string") {
    // Convert {contract.space.3} style W3C references to var(--space-3)
    return val.replace(/\{([^}]+)\}/g, (_, ref) => {
      const parts = ref.split(".");
      if (parts[0] === "contract") {
        if (parts[1] === "color" && (parts[2] === "light" || parts[2] === "dark")) {
          return `var(--${parts.slice(3).join("-")})`;
        }
        if (parts[1] === "layout") {
          return `var(--${parts.slice(2).join("-")})`;
        }
        return `var(--${parts.slice(1).join("-")})`;
      }
      if (parts[0] === "extensions") {
        return `var(--${parts.slice(1).join("-")})`;
      }
      if (parts[0] === "components") {
        return `var(--${parts.slice(1).join("-")})`;
      }
      return `var(--${parts.join("-")})`;
    });
  }
  return String(val);
}

function tokenVarName(parts) {
  const joined = parts.join("-");
  if (joined === "motion-ease-standard") return "--ease-standard";
  if (joined === "nav-sidebar-width") return "--sidebar-width";
  if (joined === "nav-header-height") return "--header-height";
  return `--${joined}`;
}

function collectLeafDecls(obj, prefixParts = [], out = []) {
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    if (val && typeof val === "object" && "$value" in val) {
      const varName = tokenVarName([...prefixParts, key]);
      out.push(`  ${varName}: ${formatValue(val)};`);
    } else if (val && typeof val === "object") {
      collectLeafDecls(val, [...prefixParts, key], out);
    }
  }
  return out;
}

const rootDecls = [];
const darkDecls = [];
const publicDecls = [];

// Tier 1: contract
const contract = tokens.contract ?? {};
if (contract.color?.light) {
  rootDecls.push("  /* Tier 1 — OpenDesign contract (light) */");
  collectLeafDecls(contract.color.light, [], rootDecls);
}
if (contract.color?.dark) {
  darkDecls.push("  /* Tier 1 — OpenDesign contract (dark) */");
  collectLeafDecls(contract.color.dark, [], darkDecls);
}

const nonColorContract = [];
for (const [group, val] of Object.entries(contract)) {
  if (group.startsWith("$") || group === "color") continue;
  if (val && typeof val === "object" && "$value" in val) {
    nonColorContract.push(`  --${group}: ${formatValue(val)};`);
  } else if (val && typeof val === "object") {
    const prefix = group === "layout" ? [] : [group];
    collectLeafDecls(val, prefix, nonColorContract);
  }
}
if (nonColorContract.length > 0) {
  rootDecls.push("", "  /* Tier 1 — Scale, shape, depth, motion & layout */", ...nonColorContract);
}

// Tier 2: semantic extensions
if (tokens.extensions) {
  rootDecls.push("", "  /* Tier 2 — Semantic extensions */");
  collectLeafDecls(tokens.extensions, [], rootDecls);
}

// Tier 3: component tokens (internal dense defaults + public touch overrides)
if (tokens.components) {
  const { "public-overrides": publicOverrides, ...internalComponents } = tokens.components;
  rootDecls.push("", "  /* Tier 3 — Component tokens (internal dense defaults) */");
  collectLeafDecls(internalComponents, [], rootDecls);

  if (publicOverrides) {
    publicDecls.push("  /* Tier 3 — Public / touch-first density overrides (44 px minimum) */");
    collectLeafDecls(publicOverrides, [], publicDecls);
  }
}

const css = [
  "/* Generated from tokens.json by shared/scripts/tokens-to-css.mjs — do not edit by hand. */",
  "",
  ":root {",
  ...rootDecls,
  "}",
  "",
  "@media (prefers-color-scheme: dark) {",
  "  :root:not([data-theme=\"light\"]) {",
  ...darkDecls.map((l) => `  ${l}`),
  "  }",
  "}",
  "",
  "[data-theme=\"dark\"] {",
  ...darkDecls,
  "}",
  "",
  "[data-density=\"public\"] {",
  ...publicDecls,
  "}",
  "",
].join("\n");

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, css, "utf8");
  console.log(`wrote: ${outPath}`);
} else {
  process.stdout.write(css);
}
