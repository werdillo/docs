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
 *   5. design/system/tokens.json parses cleanly, resolves every alias/var(), and meets WCAG 2.1 contrast floors in light and dark.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");

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

function compareDirSync(srcDir, dstDir, labelPrefix) {
  const srcEntries = fs.readdirSync(srcDir, { withFileTypes: true }).filter((e) => !e.name.startsWith("."));
  const dstEntries = fs.existsSync(dstDir)
    ? fs.readdirSync(dstDir, { withFileTypes: true }).filter((e) => !e.name.startsWith("."))
    : [];
  const srcNames = new Set(srcEntries.map((e) => e.name));
  for (const d of dstEntries) {
    if (!srcNames.has(d.name)) {
      failures.push(`[refs] Extra file in built copy: ${path.relative(repoRoot, path.join(dstDir, d.name))} (run shared/scripts/build-skills.sh)`);
    }
  }
  for (const s of srcEntries) {
    const sp = path.join(srcDir, s.name);
    const dp = path.join(dstDir, s.name);
    if (s.isDirectory()) {
      if (!fs.existsSync(dp) || !fs.statSync(dp).isDirectory()) {
        failures.push(`[refs] Missing built folder ${path.relative(repoRoot, dp)} (run shared/scripts/build-skills.sh)`);
      } else {
        compareDirSync(sp, dp, labelPrefix);
      }
    } else if (!fs.existsSync(dp)) {
      failures.push(`[refs] Missing built copy ${path.relative(repoRoot, dp)} (run shared/scripts/build-skills.sh)`);
    } else if (!fs.readFileSync(sp).equals(fs.readFileSync(dp))) {
      failures.push(
        `[refs] Out of sync: ${path.relative(repoRoot, dp)} differs from ${path.relative(repoRoot, sp)} (run shared/scripts/build-skills.sh)`
      );
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
  // Parse cp / cp -R "$repo/<src>" "$refs/<dst>" lines in build.sh
  const scriptText = fs.readFileSync(buildScript, "utf8");
  let currentRefs = null;
  for (const rawLine of scriptText.split("\n")) {
    const line = rawLine.trim();
    const refsMatch = line.match(/^refs="\$here\/([^"]+)"/);
    if (refsMatch) {
      currentRefs = path.join(repoRoot, section.name, "skills", refsMatch[1]);
      continue;
    }
    const cpMatch = line.match(/^cp(?:\s+-R)?\s+"\$repo\/([^"]+)"\s+"\$refs\/([^"]+)"/);
    if (cpMatch && currentRefs) {
      const src = path.join(repoRoot, cpMatch[1]);
      const dst = path.join(currentRefs, cpMatch[2]);
      if (!fs.existsSync(src)) {
        failures.push(`[refs] Missing source ${cpMatch[1]} referenced by ${section.name}/skills/build.sh`);
      } else if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dst) || !fs.statSync(dst).isDirectory()) {
          failures.push(`[refs] Missing built folder ${path.relative(repoRoot, dst)} (run shared/scripts/build-skills.sh)`);
        } else {
          compareDirSync(src, dst, cpMatch[1]);
        }
      } else if (!fs.existsSync(dst)) {
        failures.push(`[refs] Missing built copy ${path.relative(repoRoot, dst)} (run shared/scripts/build-skills.sh)`);
      } else if (!fs.readFileSync(src).equals(fs.readFileSync(dst))) {
        failures.push(
          `[refs] Out of sync: ${path.relative(repoRoot, dst)} differs from ${cpMatch[1]} (run shared/scripts/build-skills.sh)`
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

// 5. Design tokens integrity and WCAG 2.1 contrast check
const tokensPath = path.join(repoRoot, "design", "system", "tokens.json");
if (fs.existsSync(tokensPath)) {
  try {
    const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));

    // Collect all declared CSS custom property names across Tier 1 & Tier 2
    const declaredVars = new Set();
    const contract = tokens.contract ?? {};
    for (const k of Object.keys(contract.color?.light ?? {})) {
      if (!k.startsWith("$")) declaredVars.add(`--${k}`);
    }
    for (const [group, val] of Object.entries(contract)) {
      if (group.startsWith("$") || group === "color") continue;
      if (val && typeof val === "object" && "$value" in val) {
        declaredVars.add(`--${group}`);
      } else if (val && typeof val === "object") {
        const prefix = group === "layout" ? "" : `${group}-`;
        for (const k of Object.keys(val)) {
          if (k.startsWith("$")) continue;
          const rawName = `${prefix}${k}`;
          declaredVars.add(rawName === "motion-ease-standard" ? "--ease-standard" : `--${rawName}`);
        }
      }
    }
    for (const k of Object.keys(tokens.extensions ?? {})) {
      if (!k.startsWith("$")) declaredVars.add(`--${k}`);
    }

    // Verify light and dark define the exact same contract colour slots
    const lightKeys = Object.keys(contract.color?.light ?? {}).filter((k) => !k.startsWith("$")).sort();
    const darkKeys = Object.keys(contract.color?.dark ?? {}).filter((k) => !k.startsWith("$")).sort();
    if (lightKeys.join(",") !== darkKeys.join(",")) {
      failures.push(`[tokens] design/system/tokens.json light and dark colour slots differ`);
    }

    // Verify all {a.b.c} aliases and var(--x) references resolve
    function lookupPath(root, dotted) {
      let cur = root;
      for (const part of dotted.split(".")) {
        if (!cur || typeof cur !== "object" || !(part in cur)) return undefined;
        cur = cur[part];
      }
      return cur;
    }

    function walkTokens(obj, trail = []) {
      for (const [k, v] of Object.entries(obj)) {
        if (k.startsWith("$")) continue;
        if (v && typeof v === "object" && "$value" in v) {
          if (typeof v.$value === "string") {
            for (const m of v.$value.matchAll(/\{([^}]+)\}/g)) {
              const target = lookupPath(tokens, m[1]);
              if (!target || !("$value" in target)) {
                failures.push(`[tokens] ${[...trail, k].join(".")} references missing alias {${m[1]}}`);
              }
            }
            for (const m of v.$value.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
              if (!declaredVars.has(m[1])) {
                failures.push(`[tokens] ${[...trail, k].join(".")} references undeclared CSS var ${m[1]}`);
              }
            }
          }
        } else if (v && typeof v === "object") {
          walkTokens(v, [...trail, k]);
        }
      }
    }
    walkTokens(tokens);

    // OKLCH & color-mix(in oklab, ...) -> linear sRGB -> WCAG 2.1 contrast ratio
    function parseOklchToOklab(str) {
      const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/);
      if (!m) return null;
      const L = Number(m[1]);
      const C = Number(m[2]);
      const h = (Number(m[3]) * Math.PI) / 180;
      return [L, C * Math.cos(h), C * Math.sin(h)];
    }

    function resolveOklab(expr, modeColors) {
      if (expr.startsWith("oklch(")) return parseOklchToOklab(expr);
      const varOnly = expr.match(/^var\(--([a-z0-9-]+)\)$/);
      if (varOnly) {
        const raw = modeColors[varOnly[1]]?.$value ?? tokens.extensions?.[varOnly[1]]?.$value;
        return raw ? resolveOklab(raw, modeColors) : null;
      }
      const mix = expr.match(
        /^color-mix\(\s*in\s+oklab\s*,\s*var\(--([a-z0-9-]+)\)\s+([\d.]+)%\s*,\s*var\(--([a-z0-9-]+)\)\s+([\d.]+)%\s*\)$/
      );
      if (mix) {
        const c1 = resolveOklab(`var(--${mix[1]})`, modeColors);
        const c2 = resolveOklab(`var(--${mix[3]})`, modeColors);
        if (!c1 || !c2) return null;
        const w1 = Number(mix[2]) / 100;
        const w2 = Number(mix[4]) / 100;
        return [c1[0] * w1 + c2[0] * w2, c1[1] * w1 + c2[1] * w2, c1[2] * w1 + c2[2] * w2];
      }
      return null;
    }

    function oklabToLinearSrgb([L, a, b]) {
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
      const l = l_ ** 3;
      const m = m_ ** 3;
      const s = s_ ** 3;
      const clamp = (x) => Math.min(1, Math.max(0, x));
      return [
        clamp(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        clamp(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
      ];
    }

    function relLum([r, g, b]) {
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function contrastRatio(c1, c2) {
      const l1 = relLum(oklabToLinearSrgb(c1));
      const l2 = relLum(oklabToLinearSrgb(c2));
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    const contrastPairs = [
      ["fg", "bg", 4.5],
      ["fg-2", "bg", 4.5],
      ["muted", "bg", 4.5],
      ["meta", "bg", 3.0],
      ["fg", "surface", 4.5],
      ["fg-2", "surface", 4.5],
      ["muted", "surface", 4.5],
      ["meta", "surface", 3.0],
      ["accent", "bg", 4.5],
      ["accent", "surface", 4.5],
      ["accent-on", "accent", 4.5],
      ["accent-on", "danger", 4.5],
      ["success", "bg", 4.5],
      ["success", "surface", 4.5],
      ["warn", "bg", 4.5],
      ["warn", "surface", 4.5],
      ["danger", "bg", 4.5],
      ["danger", "surface", 4.5],
      ["border-strong", "bg", 3.0],
      ["border-strong", "surface", 3.0],
    ];

    for (const mode of ["light", "dark"]) {
      const modeColors = contract.color?.[mode] ?? {};
      for (const [fgName, bgName, minRatio] of contrastPairs) {
        const fgCol = resolveOklab(`var(--${fgName})`, modeColors);
        const bgCol = resolveOklab(`var(--${bgName})`, modeColors);
        if (!fgCol || !bgCol) {
          failures.push(`[tokens] Could not resolve contrast pair ${fgName} on ${bgName} in ${mode} mode`);
          continue;
        }
        const ratio = contrastRatio(fgCol, bgCol);
        if (ratio < minRatio) {
          failures.push(
            `[tokens] Contrast failure in ${mode} mode: --${fgName} on --${bgName} is ${ratio.toFixed(2)}:1 (min ${minRatio}:1)`
          );
        }
      }
    }
  } catch (err) {
    failures.push(`[tokens] Failed to parse design/system/tokens.json: ${err.message}`);
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
