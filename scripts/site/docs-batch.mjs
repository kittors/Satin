// 组件文档页分批视觉验收：库会话每铺一批契约页，官网这边逐页看渲染。
// 每页 8 种组合：React / Vue × 桌面 1440 / 手机 390 × 浅 / 深。每种组合自动量：
//   代码块头部的框架名、文件后缀对不对；API 一节和表格（有 columnProps 的还要"列定义"子表）；示例框（现场演示）载好没有、有没有空白（框高异常）；
//   本页目录（桌面）；上一页 / 下一页；整页横向溢出；页面报错。
// 每种组合截四处：页面顶部（标题、本页目录）、第一个示例（代码块头部 + 示例框）、API 表开头、上一页 / 下一页。
// 每批拼四张总览（top / code / api / pager）：每行一页，每列一种组合，列的顺序见 COMBOS。
// 用法（5192 起着）：node scripts/site/docs-batch.mjs --batch b1 --ids button,iconbutton,… [--out /tmp/site-docs-qa]
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pw = require(process.env.PLAYWRIGHT || "/Users/kittors/Developer/freelance/TaleFrame/apps/admin/node_modules/playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : true; };
const ROOT = new URL("../..", import.meta.url).pathname, BATCH = String(arg("batch", "b")), OUT = `${arg("out", "/tmp/site-docs-qa")}/${BATCH}`, B = "http://127.0.0.1:5192/site/next-docs.html";
const all = [...new Set(JSON.parse(fs.readFileSync(ROOT + "examples/shared/demos.json", "utf8")).filter((x) => x.contract).map((x) => x.id))];
const ids = arg("ids", "") ? String(arg("ids")).split(",") : all;
// 列的顺序：React 桌面浅、React 桌面深、React 手机浅、React 手机深、Vue 桌面浅、Vue 桌面深、Vue 手机浅、Vue 手机深
const COMBOS_ALL = ["react", "vue"].flatMap((fw) => ["desktop", "phone"].flatMap((dev) => ["light", "dark"].map((theme) => [fw, dev, theme])));
// --combos 2,3,6,7：只跑其中几种（修完复查用；总览按全部 8 列拼，没跑的那几列沿用目录里已有的图）
const COMBOS = arg("combos", "") ? String(arg("combos")).split(",").map((k) => COMBOS_ALL[+k]) : COMBOS_ALL;
const SHOTS = ["top", "code", "api", "pager"];
const EXT = { react: /\.(jsx|tsx)$/, vue: /\.vue$/ }, NAME = { react: "React", vue: "Vue" };
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await pw.chromium.launch({ channel: "chrome", headless: true });
const rows = [];
for (const [fw, dev, theme] of COMBOS) {
  const phone = dev === "phone", tag = `${fw}-${dev}-${theme}`;
  const ctx = await b.newContext({ viewport: phone ? { width: 390, height: 844 } : { width: 1440, height: 900 }, colorScheme: theme, isMobile: phone, hasTouch: phone, deviceScaleFactor: 1 });
  await ctx.addInitScript(([t, f]) => { localStorage.setItem("satin-theme", t); localStorage.setItem("satin-fw", f); }, [theme, fw]);
  const page = await ctx.newPage(), errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
  for (const id of ids) {
    errs.length = 0;
    await page.goto(`${B}#/c/${id}?fw=${fw}`, { waitUntil: "load" }).catch(() => {});
    await page.waitForFunction(() => !document.querySelector("[data-async]"), null, { timeout: 8000 }).catch(() => {}); await sleep(1200);
    // 滚过整页：示例框、代码区都载好
    await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += innerHeight) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 140)); } scrollTo({ top: 0, behavior: "instant" }); });
    await sleep(900);
    const m = await page.evaluate(([fwName]) => {
      const vis = (el) => !!el && el.getBoundingClientRect().height > 0 && getComputedStyle(el).display !== "none";
      const heads = [...document.querySelectorAll(".d-main .cx")].filter(vis).map((cx) => ({ fw: cx.querySelector(".cx-hd .s-fw-btn")?.textContent.trim() || "", file: [...cx.querySelectorAll(".cx-tabs button, .cx-name")].map((x) => x.textContent.trim()).filter(Boolean)[0] || "" }));
      const wrongFw = [...new Set(heads.map((h) => h.fw).filter((x) => x && !x.startsWith(fwName)))];
      const frames = [...document.querySelectorAll(".dx .d-frame")], notReady = frames.filter((f) => !f.classList.contains("sn-ready") && !f.classList.contains("ready")).length;
      const tiny = frames.filter((f) => { const h = f.getBoundingClientRect().height; return h > 0 && h < 40; }).length;
      const api = document.getElementById("api"), tables = [...document.querySelectorAll(".d-main .d-tablewrap")].filter((t) => api && (api.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING));
      const cols = document.getElementById("api-columns");
      const toc = document.querySelector(".d-toc"), tocN = toc ? toc.querySelectorAll("a").length : 0;
      const pager = document.querySelector(".d-pager"), pagerN = pager ? pager.querySelectorAll("a").length : 0;
      const pagerText = pager ? [...pager.querySelectorAll("a .t")].map((t) => getComputedStyle(t).fontSize + "/" + getComputedStyle(t).fontWeight).join(",") : "";
      // API 一节（到"键盘与无障碍"或"设计规范"为止）的文字：看有没有另一个框架的写法串进来
      let apiText = ""; if (api) { for (let n = api.nextElementSibling; n && !(n.matches("h2") && n.id !== "api"); n = n.nextElementSibling) apiText += " " + n.textContent; }
      const cross = fwName === "Vue" ? [...new Set(apiText.match(/ReactNode|className|JSX\.Element|\bref=\{|onClick=\{/g) || [])] : [...new Set(apiText.match(/v-model|v-bind|#default|@click|defineProps/g) || [])];
      return { cross, h1: document.querySelector(".d-h1")?.textContent.trim(), codeHeads: heads.length, files: heads.map((h) => h.file).filter(Boolean).slice(0, 4), wrongFw, frames: frames.length, notReady, tiny, api: !!api, apiTables: tables.length, apiRows: tables[0] ? tables[0].querySelectorAll("tbody tr").length : 0, columns: !!cols, toc: vis(toc), tocN, pagerN, pagerText, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    }, [NAME[fw]]);
    const badFile = m.files.filter((f) => !EXT[fw].test(f) && !/\.(css|ts|js)$/.test(f));
    const probs = [m.wrongFw.length && `代码块头部不是 ${NAME[fw]}：${m.wrongFw.join("、")}`, badFile.length && `文件不是 ${NAME[fw]} 写法：${badFile.join("、")}`, !m.codeHeads && "没有代码块", m.cross.length && `API 表里有${fw === "vue" ? " React " : " Vue "}的写法：${m.cross.join("、")}（内容，库会话）`,
      m.notReady && `${m.notReady}/${m.frames} 个示例框没载好`, m.tiny && `${m.tiny} 个示例框高度不到 40px（空白）`, !m.api && "没有 API 一节", m.api && !m.apiRows && "API 表是空的",
      !phone && !m.toc && "桌面没有本页目录", !phone && m.toc && m.tocN < 3 && `本页目录只有 ${m.tocN} 项`, m.pagerN < 1 && "没有上一页 / 下一页", m.overflow && "整页横向溢出", errs.length && "报错 " + [...new Set(errs)].join(" | ")].filter(Boolean);
    rows.push({ id, tag, ...m, probs });
    // 精确滚动：标题类（示例、API）顶到顶栏下面；上一页 / 下一页放到视口下半截
    const shot = async (name, sel, at = "top") => {
      const f = `${OUT}/${id}-${tag}-${name}.png`;
      const ok = await page.evaluate(([sel, at, ph]) => {
        if (!sel) { scrollTo({ top: 0, behavior: "instant" }); return true; }
        const el = document.querySelector(sel); if (!el) return false;
        const r = el.getBoundingClientRect(), y = scrollY + r.top;
        scrollTo({ top: Math.max(0, at === "top" ? y - (ph ? 64 : 84) : y + r.height - innerHeight + 140), behavior: "instant" }); return true;
      }, [sel, at, phone]);
      if (!ok) { fs.rmSync(f, { force: true }); return; }
      await sleep(420); await page.screenshot({ path: f });
    };
    await shot("top", null); await shot("code", "#examples"); await shot("api", "#api"); await shot("pager", ".d-pager", "bottom");
    process.stdout.write(`\r${BATCH} ${tag.padEnd(22)} ${id.padEnd(12)} ${probs.length ? "✗ " + probs[0].slice(0, 40) : "✓"}                    `);
  }
  await ctx.close();
}
await b.close();
fs.writeFileSync(`${OUT}/report${arg("combos", "") ? "-" + String(arg("combos")).replace(/,/g, "") : ""}.json`, JSON.stringify(rows, null, 1));
// 总览：每种截图一张，每行一页、每列一种组合（缺图用灰块占位）
for (const s of SHOTS) {
  const files = [];
  for (const id of ids) for (const [fw, dev, theme] of COMBOS_ALL) { const f = `${OUT}/${id}-${fw}-${dev}-${theme}-${s}.png`; files.push(fs.existsSync(f) ? f : "xc:#bbbbbb"); }
  try { execFileSync("magick", ["montage", ...files, "-tile", `${COMBOS_ALL.length}x`, "-geometry", "300x200+3+3", "-background", "#d0d0d0", `${OUT}/overview-${s}.png`], { stdio: "ignore" }); } catch {}
}
const bad = rows.filter((r) => r.probs.length);
fs.writeFileSync(`${OUT}/README.txt`, [`批次 ${BATCH}：${ids.join("、")}`, `每张总览每行一页（顺序同上），每列一种组合：${COMBOS_ALL.map((c) => c.join("·")).join(" ｜ ")}`, `overview-top：页面顶部（标题、本页目录）；overview-code：第一个示例（代码块头部 + 示例框）；overview-api：API 表开头；overview-pager：上一页 / 下一页`, "", bad.length ? `${bad.length} 处问题：` : "自动检查没有问题", ...bad.map((r) => `✗ ${r.id} ${r.tag}：${r.probs.join("；")}`)].join("\n"));
console.log(`\n${BATCH}：${ids.length} 页 × ${COMBOS.length} 种组合，${bad.length ? bad.length + " 处问题" : "自动检查没有问题"}（${OUT}）`);
for (const r of bad) console.log(`  ✗ ${r.id} ${r.tag}：${r.probs.join("；")}`);
