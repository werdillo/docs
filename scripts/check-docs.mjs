#!/usr/bin/env node
/**
 * check-docs.mjs — deterministic repository checks for this documentation tree.
 * Node.js 18+, zero dependencies.
 *
 * Checks:
 *   1. Every documentation folder has a README.md (or SKILL.md).
 *   2. Every relative Markdown link and #anchor resolves cleanly.
 *   3. Every skill's references/ matches its source documents (in sync with build.sh).
 *   4. Prose follows shared/writing.md: British spelling and no "should" in rules.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const IGNORE_DIRS = new Set([".git", "node_modules", "test-data"]);

function isIgnoredRel(relPath) {
  const parts = relPath.split(path.sep);
  if (parts.some((p) => p.startsWith(".") || IGNORE_DIRS.has(p))) return true;
  if (parts.includes("evals")) return true;
  if (parts.includes("skills") && parts.includes("references")) return true;
  return false;
}

function walk(dir, out = { dirs: [], files: [] }) {
  const relDir = path.relative(repoRoot, dir);
  if (relDir && isIgnoredRel(relDir)) return out;
  out.dirs.push(dir);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(repoRoot, full);
    if (isIgnoredRel(rel)) continue;
    if (entry.isDirectory()) walk(full, out);
    else out.files.push(full);
  }
  return out;
}

function stripCode(markdown) {
  // Remove fenced code blocks while preserving line count
  let out = markdown.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ""));
  // Remove inline code spans
  out = out.replace(/(`+)[^`\n]+?\1/g, (m) => " ".repeat(m.length));
  return out;
}

function slugify(heading) {
  let text = heading.trim().toLowerCase();
  text = text.replace(/`([^`]*)`/g, "$1");
  text = text.replace(/\*\*([^*]*)\*\*/g, "$1");
  text = text.replace(/\*([^*]*)\*/g, "$1");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  text = text.replace(/[^\p{L}\p{N}\s_-]/gu, "");
  text = text.replace(/\s+/g, "-");
  return text;
}

const anchorsCache = new Map();
function getAnchors(filePath) {
  if (anchorsCache.has(filePath)) return anchorsCache.get(filePath);
  const raw = fs.readFileSync(filePath, "utf8");
  const text = raw.replace(/```[\s\S]*?```/g, "");
  const anchors = new Set();
  const counts = new Map();
  for (const match of text.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const base = slugify(match[1]);
    const n = counts.get(base) ?? 0;
    counts.set(base, n + 1);
    anchors.add(n === 0 ? base : `${base}-${n}`);
  }
  anchorsCache.set(filePath, anchors);
  return anchors;
}

const failures = [];
const warnings = [];

const { dirs, files } = walk(repoRoot);
const mdFiles = files.filter((f) => f.endsWith(".md")).sort();

// 1. Folder README check
for (const dir of dirs) {
  if (dir === repoRoot) continue;
  const entries = fs.readdirSync(dir);
  if (!entries.includes("README.md") && !entries.includes("SKILL.md")) {
    failures.push(`[readme] Missing README.md in ${path.relative(repoRoot, dir)}/`);
  }
}

// 2. Relative links and heading anchors check
const linkRe = /!?\[[^\]]*\]\(([^)]+)\)/g;
for (const file of mdFiles) {
  const relFile = path.relative(repoRoot, file);
  const prose = stripCode(fs.readFileSync(file, "utf8"));
  const lines = prose.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const match of lines[i].matchAll(linkRe)) {
      const href = match[1].trim();
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("obsidian://")
      ) {
        continue;
      }
      let targetFile;
      let anchor = null;
      if (href.startsWith("#")) {
        targetFile = file;
        anchor = href.slice(1);
      } else {
        const [relTarget, hash] = href.split("#", 2);
        anchor = hash ?? null;
        targetFile = path.resolve(path.dirname(file), relTarget);
      }
      if (!fs.existsSync(targetFile)) {
        failures.push(`[link] ${relFile}:${i + 1} -> ${href} (target not found)`);
      } else if (anchor && fs.statSync(targetFile).isFile()) {
        const anchors = getAnchors(targetFile);
        if (!anchors.has(anchor)) {
          failures.push(`[anchor] ${relFile}:${i + 1} -> ${href} (anchor #${anchor} not found)`);
        }
      }
    }
  }
}

// 3. Skill references/ sync check
for (const section of fs.readdirSync(repoRoot, { withFileTypes: true })) {
  if (!section.isDirectory() || section.name.startsWith(".") || IGNORE_DIRS.has(section.name)) {
    continue;
  }
  const buildScript = path.join(repoRoot, section.name, "skills", "build.sh");
  if (!fs.existsSync(buildScript)) continue;
  // Parse cp "$repo/<src>" "$refs/<dst>" lines in build.sh
  const scriptText = fs.readFileSync(buildScript, "utf8");
  let currentRefs = null;
  for (const rawLine of scriptText.split("\n")) {
    const line = rawLine.trim();
    const refsMatch = line.match(/^refs="\$here\/([^"]+)"/);
    if (refsMatch) {
      currentRefs = path.join(repoRoot, section.name, "skills", refsMatch[1]);
      continue;
    }
    const cpMatch = line.match(/^cp\s+"\$repo\/([^"]+)"\s+"\$refs\/([^"]+)"/);
    if (cpMatch && currentRefs) {
      const src = path.join(repoRoot, cpMatch[1]);
      const dst = path.join(currentRefs, cpMatch[2]);
      if (!fs.existsSync(src)) {
        failures.push(`[refs] Missing source ${cpMatch[1]} referenced by ${section.name}/skills/build.sh`);
      } else if (!fs.existsSync(dst)) {
        failures.push(`[refs] Missing built copy ${path.relative(repoRoot, dst)} (run scripts/build-skills.sh)`);
      } else if (!fs.readFileSync(src).equals(fs.readFileSync(dst))) {
        failures.push(
          `[refs] Out of sync: ${path.relative(repoRoot, dst)} differs from ${cpMatch[1]} (run scripts/build-skills.sh)`
        );
      }
    }
  }
}

// 4. Writing style checks (British spelling & "should" in prose)
const US_SPELLING = [
  "behavior",
  "behaviors",
  "color",
  "colors",
  "colored",
  "coloring",
  "catalog",
  "catalogs",
  "realization",
  "organization",
  "organizations",
  "optimize",
  "optimized",
  "optimizing",
  "standardize",
  "standardized",
  "serialize",
  "serialized",
  "normalize",
  "normalized",
  "center",
  "defense",
  "gray",
  "grays",
  "favor",
  "favors",
  "modeling",
  "canceled",
  "canceling",
  "labeled",
];
const usRe = new RegExp(`\\b(${US_SPELLING.join("|")})\\b`, "gi");
const shouldRe = /\bshould\b/gi;

for (const file of mdFiles) {
  const relFile = path.relative(repoRoot, file);
  // Skip verbatim external source copies (e.g. tiger-style.md)
  if (relFile.includes(`${path.sep}sources${path.sep}`)) continue;
  const prose = stripCode(fs.readFileSync(file, "utf8"));
  const lines = prose.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const match of line.matchAll(usRe)) {
      failures.push(`[spelling] ${relFile}:${i + 1} uses US spelling "${match[0]}"`);
    }
    if (relFile !== path.join("shared", "writing.md")) {
      if (shouldRe.test(line)) {
        warnings.push(`[style] ${relFile}:${i + 1} contains "should" — verify it is not a rule`);
      }
      shouldRe.lastIndex = 0;
    }
  }
}

if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  ${w}`);
}

if (failures.length > 0) {
  console.error(`Failures (${failures.length}):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log(`OK: checked ${mdFiles.length} markdown files across ${dirs.length} folders.`);
