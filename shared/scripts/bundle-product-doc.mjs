#!/usr/bin/env node
/**
 * bundle-product-doc.mjs — compiles a product document folder (README.md,
 * numbered files or subfolders 01..08, and log.md) into one clean Markdown
 * document for sharing or PDF export.
 *
 * Usage:
 *   node ./shared/scripts/bundle-product-doc.mjs <product-folder> [--business | --all] [--out <file.md>]
 *
 * Flags:
 *   --business   Include only the business half (01..04) + log.md.
 *   --all        Include business (01..04) + technical (05..08) + log.md (default).
 *   --out <path> Write output to <path> instead of stdout.
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
let folderArg = null;
let mode = "all";
let outPath = null;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--business") mode = "business";
  else if (a === "--all") mode = "all";
  else if (a === "--out") outPath = argv[++i];
  else if (a === "-h" || a === "--help") {
    console.log(
      "Usage: node shared/scripts/bundle-product-doc.mjs <folder> [--business | --all] [--out <file.md>]"
    );
    process.exit(0);
  } else if (!folderArg) {
    folderArg = a;
  } else {
    console.error(`Unknown argument: ${a}`);
    process.exit(2);
  }
}

if (!folderArg) {
  console.error("Missing <product-folder> argument.");
  process.exit(2);
}

const root = path.resolve(folderArg);
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Not a directory: ${root}`);
  process.exit(2);
}

function demoteHeadings(md, levels = 1) {
  const prefix = "#".repeat(levels);
  let inFence = false;
  return md
    .split("\n")
    .map((line) => {
      if (/^ {0,3}(`{3,}|~{3,})/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line.replace(/^(#{1,5}) /, (_, hashes) => `${prefix}${hashes} `);
    })
    .join("\n")
    .trim();
}

function collectEntry(entryPath, demoteBy = 1) {
  const stat = fs.statSync(entryPath);
  if (stat.isFile()) {
    return [demoteHeadings(fs.readFileSync(entryPath, "utf8"), demoteBy)];
  }
  const chunks = [];
  const subReadme = path.join(entryPath, "README.md");
  if (fs.existsSync(subReadme)) {
    chunks.push(demoteHeadings(fs.readFileSync(subReadme, "utf8"), demoteBy));
  }
  const children = fs
    .readdirSync(entryPath, { withFileTypes: true })
    .filter((e) => !e.name.startsWith(".") && e.name !== "README.md")
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const child of children) {
    const childPath = path.join(entryPath, child.name);
    if (child.isDirectory() || child.name.endsWith(".md")) {
      chunks.push(...collectEntry(childPath, demoteBy + 1));
    }
  }
  return chunks;
}

const parts = [];

const readmePath = path.join(root, "README.md");
if (fs.existsSync(readmePath)) {
  const raw = fs.readFileSync(readmePath, "utf8");
  // Keep title, intro and metadata table; drop section index tables regardless of language
  const beforeIndex = raw.split(/\n## /)[0].trim();
  parts.push(beforeIndex);
}

const entries = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((e) => !e.name.startsWith("."))
  .filter((e) => /^\d{2}-/.test(e.name) && (e.isDirectory() || e.name.endsWith(".md")))
  .sort((a, b) => a.name.localeCompare(b.name));

for (const entry of entries) {
  const num = Number(entry.name.slice(0, 2));
  if (mode === "business" && num > 4) continue;
  parts.push(...collectEntry(path.join(root, entry.name), 1));
}

const logMd = path.join(root, "log.md");
const logDir = path.join(root, "log");
if (fs.existsSync(logMd)) {
  parts.push(...collectEntry(logMd, 1));
} else if (fs.existsSync(logDir) && fs.statSync(logDir).isDirectory()) {
  parts.push(...collectEntry(logDir, 1));
}

const output = parts.filter(Boolean).join("\n\n---\n\n") + "\n";

if (outPath) {
  fs.writeFileSync(path.resolve(outPath), output, "utf8");
  console.log(`bundled (${mode}): ${outPath}`);
} else {
  process.stdout.write(output);
}
