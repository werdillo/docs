#!/usr/bin/env node
/**
 * check-urls.mjs — детерминированная проверка внешних ссылок в Markdown.
 * Node.js 18+, без зависимостей, Windows / Linux / macOS.
 *
 *   node check-urls.mjs <файл.md | папка> [...] [--timeout 10000]
 *
 * Что делает:
 *   - берёт ссылки из [текст](url), <url> и голых URL; пропускает code-блоки, `инлайн-код` и <!-- комментарии -->;
 *   - понимает скобки внутри URL (Википедия), срезает хвостовую пунктуацию и разметку ** _ ~;
 *   - пропускает example.com/.org/.net, localhost, 127.0.0.1, *.local;
 *   - делает GET (без HEAD: часть серверов отвечает на HEAD неверно) и читает до 64 КБ HTML ради <title>;
 *   - не больше 2 одновременных запросов к одному хосту и 8 всего.
 *
 * Статусы — это коды, а не оценка содержания:
 *   OK      2xx: страница существует. Подтверждает ли она тезис, скрипт не знает (это шлюз 3 скилла).
 *   WARN    подтвердить не удалось: 401/403/429/451/999/5xx, таймаут, сетевая ошибка, редирект на главную
 *           или на логин, похоже на soft-404, ссылка через шлюз-редирект или с трекинг-параметрами.
 *           Открой страницу вручную.
 *   BROKEN  404/410, домен не существует или URL невалиден.
 *
 * Код выхода: 0 — всё OK; 1 — есть BROKEN; 3 — BROKEN нет, но есть WARN; 2 — ошибка запуска.
 */
import fs from "node:fs";
import path from "node:path";

const USAGE = "Использование: node check-urls.mjs <файл.md | папка> [...] [--timeout 10000]";
const MAX_TOTAL = 8;
const MAX_PER_HOST = 2;
const TITLE_BYTES = 64 * 1024;
const UA = "Mozilla/5.0 (compatible; check-urls/2.0; markdown link audit)";

if (typeof fetch !== "function") {
  console.error(`Нужен Node.js 18+ (нет встроенного fetch), сейчас ${process.version}.`);
  process.exit(2);
}

// ---------- аргументы ----------
const argv = process.argv.slice(2);
let timeoutMs = 10000;
const inputs = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--help" || a === "-h") {
    console.log(USAGE);
    process.exit(0);
  } else if (a === "--timeout") {
    timeoutMs = Number(argv[++i]) || timeoutMs;
  } else if (a.startsWith("--")) {
    console.error(`Неизвестный флаг ${a}\n${USAGE}`);
    process.exit(2);
  } else {
    inputs.push(a);
  }
}
if (inputs.length === 0) {
  console.error(USAGE);
  process.exit(2);
}

function collectFiles(p) {
  const abs = path.resolve(p);
  if (!fs.existsSync(abs)) {
    console.error(`Не найдено: ${abs}`);
    process.exit(2);
  }
  if (fs.statSync(abs).isFile()) return [abs];
  const out = [];
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const full = path.join(abs, e.name);
    if (e.isDirectory()) out.push(...collectFiles(full));
    else if (e.name.toLowerCase().endsWith(".md")) out.push(full);
  }
  return out;
}
const files = [...new Set(inputs.flatMap(collectFiles))];

// ---------- извлечение ссылок ----------
const blank = (s) => s.replace(/[^\n]/g, " ");

/** Заменяет пробелами code-блоки, инлайн-код и HTML-комментарии, сохраняя номера строк. */
function maskNonProse(text) {
  const lines = text.split("\n");
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    if (fence) {
      const close = lines[i].match(/^ {0,3}(`{3,}|~{3,})\s*$/);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length) fence = null;
      lines[i] = blank(lines[i]);
      continue;
    }
    const open = lines[i].match(/^ {0,3}(`{3,}|~{3,})/);
    if (open) {
      fence = open[1];
      lines[i] = blank(lines[i]);
    }
  }
  return lines
    .join("\n")
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/(`+)[^`\n]+?\1/g, blank);
}

const count = (s, ch) => s.split(ch).length - 1;

/** Срезает хвостовую пунктуацию, разметку и непарную закрывающую скобку. */
function trimTail(u) {
  let prev;
  do {
    prev = u;
    u = u.replace(/[.,;:!?*_~'"]+$/, "");
    if (u.endsWith(")") && count(u, "(") < count(u, ")")) u = u.slice(0, -1);
  } while (u !== prev);
  return u;
}

/** Достаёт URL из одной строки: [x](url), <url>, голые URL. */
function extractFromLine(line) {
  const found = [];
  let rest = line;

  // [текст](url "title") — со сбалансированными скобками внутри url
  let idx = rest.indexOf("](");
  while (idx !== -1) {
    let j = idx + 2;
    while (rest[j] === " ") j++;
    let url = "";
    let end = j;
    if (rest[j] === "<") {
      const close = rest.indexOf(">", j);
      if (close !== -1) {
        url = rest.slice(j + 1, close);
        end = close + 1;
      }
    } else {
      let depth = 0;
      let k = j;
      for (; k < rest.length; k++) {
        const c = rest[k];
        if (c === "\\" && k + 1 < rest.length) {
          k++;
          continue;
        }
        if (/\s/.test(c)) break;
        if (c === "(") depth++;
        else if (c === ")") {
          if (depth === 0) break;
          depth--;
        }
      }
      url = rest.slice(j, k).replace(/\\([()_*[\]])/g, "$1");
      end = k;
    }
    if (/^https?:\/\//i.test(url)) {
      found.push(url);
      rest = rest.slice(0, j) + " ".repeat(end - j) + rest.slice(end);
    }
    idx = rest.indexOf("](", idx + 2);
  }

  // <https://...>
  rest = rest.replace(/<(https?:\/\/[^\s>]+)>/gi, (m, u) => {
    found.push(u);
    return " ".repeat(m.length);
  });

  // голые URL
  for (const m of rest.matchAll(/https?:\/\/[^\s<>"'`|[\]{}]+/gi)) {
    const u = trimTail(m[0]);
    if (u.length > "https://".length) found.push(u);
  }
  return found;
}

// ---------- классификация URL до запроса ----------
const GATEWAYS = [
  [/^(www\.)?google\.[a-z.]+$/, /^\/url/],
  [/^vertexaisearch\.cloud\.google\.com$/, /^\/grounding-api-redirect/],
  [/^(t\.co|bit\.ly|goo\.gl|tinyurl\.com|lnkd\.in|clck\.ru|ow\.ly|buff\.ly|is\.gd|cutt\.ly)$/, null],
  [/^l\.facebook\.com$/, null],
  [/^(m\.)?vk\.com$/, /^\/away\.php/],
  [/^away\.vk\.com$/, null],
  [/^out\.reddit\.com$/, null],
  [/^(www\.)?duckduckgo\.com$/, /^\/l\//],
  [/^(www\.)?bing\.com$/, /^\/ck\/a/],
  [/^(www\.)?youtube\.com$/, /^\/redirect/],
];
const TRACKING = /^(utm_[a-z]+|fbclid|gclid|yclid|mc_cid|mc_eid|igshid)$/i;

function skipReason(host) {
  if (/(^|\.)example\.(com|org|net)$/.test(host)) return "example";
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return "local";
  if (host === "127.0.0.1" || host === "0.0.0.0" || host === "[::1]") return "local";
  return null;
}

const entries = new Map(); // url -> { url, fetchUrl, host, gateway, tracking, where[] }
let skipped = 0;
for (const file of files) {
  const masked = maskNonProse(fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n"));
  const lines = masked.split("\n");
  lines.forEach((line, i) => {
    for (const url of extractFromLine(line)) {
      const rel = path.relative(process.cwd(), file);
      const where = `${rel && !rel.startsWith("..") ? rel : file}:${i + 1}`;
      if (entries.has(url)) {
        entries.get(url).where.push(where);
        continue;
      }
      let parsed = null;
      try {
        parsed = new URL(url);
      } catch {
        /* невалидный URL — отметим ниже */
      }
      const host = parsed ? parsed.hostname.toLowerCase() : "";
      if (parsed && skipReason(host)) {
        skipped++;
        continue;
      }
      const fetchUrl = parsed ? parsed.href.replace(/#.*$/, "") : url;
      const gateway = parsed
        ? GATEWAYS.some(([h, p]) => h.test(host) && (!p || p.test(parsed.pathname)))
        : false;
      const tracking = parsed ? [...parsed.searchParams.keys()].filter((k) => TRACKING.test(k)) : [];
      entries.set(url, { url, fetchUrl, host, valid: Boolean(parsed), gateway, tracking, where: [where] });
    }
  });
}

if (entries.size === 0) {
  console.log(`Внешних ссылок не найдено (файлов: ${files.length}, пропущено example/localhost: ${skipped}).`);
  process.exit(0);
}

// ---------- запросы ----------
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

async function readTitle(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8");
  let html = "";
  let size = 0;
  try {
    while (size < TITLE_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (/<\/title>/i.test(html)) break;
    }
  } finally {
    reader.cancel().catch(() => {});
  }
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]).replace(/\s+/g, " ").trim().slice(0, 100) : "";
}

async function probe(fetchUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en,ru;q=0.8",
      },
    });
    const type = res.headers.get("content-type") || "";
    let title = "";
    if (res.ok && type.includes("html") && res.body) title = await readTitle(res.body);
    else await res.body?.cancel().catch(() => {});
    return { status: res.status, finalUrl: res.url || fetchUrl, title };
  } catch (err) {
    const code = err?.name === "AbortError" ? "TIMEOUT" : err?.cause?.code || err?.code || err?.message || "ERR";
    return { error: String(code) };
  } finally {
    clearTimeout(timer);
  }
}

function runPool(items, worker) {
  const results = new Map();
  const active = new Map();
  const queue = [...items];
  let running = 0;
  return new Promise((resolve) => {
    const pump = () => {
      if (queue.length === 0 && running === 0) return resolve(results);
      for (let i = 0; i < queue.length && running < MAX_TOTAL; ) {
        const item = queue[i];
        if ((active.get(item.host) || 0) >= MAX_PER_HOST) {
          i++;
          continue;
        }
        queue.splice(i, 1);
        running++;
        active.set(item.host, (active.get(item.host) || 0) + 1);
        worker(item)
          .then((r) => results.set(item.key, r))
          .catch((e) => results.set(item.key, { error: String(e) }))
          .finally(() => {
            running--;
            active.set(item.host, active.get(item.host) - 1);
            pump();
          });
      }
    };
    pump();
  });
}

// ---------- оценка ответа ----------
const SOFT_404 = /(^|[^\w])(404|not found|page not found|страница не найдена|не найдена|не найдено|no longer available|doesn.t exist)([^\w]|$)/i;
const LOGIN_PATH = /(^|[/._-])(login|signin|sign-in|sign_in|authwall|consent|captcha|challenge)([/._?-]|$)/i;
const LOGIN_HOST = /^(login|auth|accounts|consent|sso|signin)\./i;
const norm = (u) => `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}${u.search}`;

function classify(entry, r) {
  const notes = [];
  if (!entry.valid) return { level: "BROKEN", status: "INVALID", notes: ["невалидный URL"] };
  if (entry.gateway) notes.push("шлюз-редирект: сохрани прямой URL");
  if (entry.tracking.length) notes.push(`трекинг-параметры: ${entry.tracking.join(", ")}`);

  if (r.error) {
    const dead = r.error === "ENOTFOUND";
    notes.push(dead ? "домен не найден" : "сеть / таймаут — повтори или открой вручную");
    return { level: dead ? "BROKEN" : "WARN", status: r.error, notes };
  }

  const s = r.status;
  let level = s === 404 || s === 410 ? "BROKEN" : s >= 200 && s < 300 ? "OK" : "WARN";
  if (level === "WARN" && [401, 403, 429, 451, 999].includes(s)) notes.push("блок бота или нужен вход — открой вручную");
  else if (level === "WARN" && s >= 500) notes.push("ошибка сервера или анти-бот (Cloudflare) — открой вручную");

  if (level === "OK") {
    const from = new URL(entry.fetchUrl);
    const to = new URL(r.finalUrl);
    if (norm(from) !== norm(to)) {
      const toRoot = to.pathname.replace(/\/+$/, "") === "" && from.pathname.replace(/\/+$/, "") !== "";
      if (toRoot) {
        level = "WARN";
        notes.push(`редирект на главную (${to.origin}) — страницу, вероятно, удалили`);
      } else if (LOGIN_PATH.test(to.pathname) || LOGIN_HOST.test(to.hostname)) {
        level = "WARN";
        notes.push(`редирект на вход или согласие: ${to.href}`);
      } else {
        notes.push(`редирект → ${to.href} (сохрани итоговый URL)`);
      }
    }
    if (r.title && SOFT_404.test(r.title)) {
      level = "WARN";
      notes.push(`похоже на soft-404, title: «${r.title}»`);
    }
  }
  if (level === "OK" && (entry.gateway || entry.tracking.length)) level = "WARN";
  return { level, status: s, notes };
}

// ---------- запуск ----------
const all = [...entries.values()];
const uniqueFetch = [...new Map(all.filter((e) => e.valid).map((e) => [e.fetchUrl, e])).values()];
console.log(`Проверяю ${uniqueFetch.length} адрес(ов) из ${files.length} файл(ов)…\n`);

const responses = await runPool(
  uniqueFetch.map((e) => ({ key: e.fetchUrl, host: e.host })),
  (item) => probe(item.key),
);

const ORDER = { BROKEN: 0, WARN: 1, OK: 2 };
const rows = all
  .map((e) => ({ e, ...classify(e, responses.get(e.fetchUrl) || { error: "INVALID" }) }))
  .sort((a, b) => ORDER[a.level] - ORDER[b.level]);

const tally = { OK: 0, WARN: 0, BROKEN: 0 };
for (const { e, level, status, notes } of rows) {
  tally[level]++;
  const more = e.where.length > 1 ? ` (+${e.where.length - 1})` : "";
  console.log(`${level.padEnd(6)} ${String(status).padEnd(9)} ${e.url}`);
  console.log(`       ${e.where[0]}${more}${notes.length ? " — " + notes.join("; ") : ""}`);
}

console.log(
  `\nИтог: OK=${tally.OK}, WARN=${tally.WARN}, BROKEN=${tally.BROKEN}, пропущено example/localhost=${skipped}.`,
);
console.log("OK значит только «страница существует». Совпадение тезиса с текстом проверяй по шлюзу 3.");
// exitCode + короткий таймер: stdout успевает дописаться в pipe, а keep-alive сокеты не держат процесс.
const exitCode = tally.BROKEN > 0 ? 1 : tally.WARN > 0 ? 3 : 0;
process.exitCode = exitCode;
setTimeout(() => process.exit(exitCode), 200).unref();
