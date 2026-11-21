// 组件文档完整度检查：逐个组件查官网组件页要的七部分齐不齐、各框架的示例源码文件在不在、API 表有没有类型 / 默认值 / 说明，缺什么列出来。
// 数据来自合并后的组件契约（spec/components/<id>.json；手写部分在 spec/components/_api/<id>.mjs，格式见那里的 README.md），
// 示例源码文件的路径按 site/frameworks.js 的 demo(slug) 找（比如 examples/react/src/demos/button-basic.jsx）。
// 七部分：
//   1 说明     title、lead、什么时候用、什么时候别用
//   2 引入     7 个框架各一行（html、react、vue、svelte、angular、solid、preact）
//   3 示例     至少 3 个、第一个是 <id>-basic、每个有 why 和标记；有受控写法的组件要有 *-controlled；每个示例在 7 个框架里都有源码文件
//   4 API      属性（类型、默认值、是否必填、说明）、事件（参数、触发时机、各框架写法）、插槽、实例方法（签名、返回值）、样式（CSS 变量、类名）、导出类型
//   5 键盘与无障碍
//   6 设计规范 该这样做、不要这样做、文案、动效（曲线令牌、时长）
//   7 相关组件 id 要真的存在
// 基础的 8 块（颜色、排版……）只查适用的：说明、样式、设计规范、相关。
// 用法：node scripts/docs-completeness.mjs [--only id,id] [--quiet]（--quiet 只打汇总）。有缺项时退出码 1
import fs from "node:fs";
import path from "node:path";
import { FRAMEWORKS } from "../site/frameworks.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const SPEC = path.join(ROOT, "spec/components");
const arg = (k) => { const i = process.argv.indexOf("--" + k); return i < 0 ? null : process.argv[i + 1]; };
const ONLY = arg("only") ? new Set(arg("only").split(",")) : null, QUIET = process.argv.includes("--quiet");
const FWS = FRAMEWORKS.map((f) => f.id); // html react vue svelte angular solid preact
const index = JSON.parse(fs.readFileSync(path.join(SPEC, "index.json"), "utf8"));
const IDS = new Set(index.map((x) => x.id));
const has = (v) => (Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== "");
const exists = (f) => fs.existsSync(path.join(ROOT, f));

function check(c, foundation) {
  const miss = {}; const add = (part, what) => (miss[part] ||= []).push(what);
  if (!c.contract) { add("全部", "还没填手写契约（spec/components/_api/" + c.id + ".mjs）"); return miss; }
  // 1 说明
  if (!has(c.title)) add("1 说明", "title");
  if (!has(c.lead)) add("1 说明", "一句话说明 lead");
  if (!foundation) {
    if (!has(c.whenToUse)) add("1 说明", "什么时候用");
    if (!has(c.whenNotToUse)) add("1 说明", "什么时候别用");
  }
  // 2 引入
  if (!foundation) for (const fw of FWS) if (!has(c.import?.[fw])) add("2 引入", fw);
  // 3 示例
  if (!foundation) {
    const ex = c.examples || [];
    if (ex.length < 3) add("3 示例", `至少 3 个（现在 ${ex.length} 个）`);
    if (ex[0] && ex[0].slug !== c.id + "-basic") add("3 示例", `第一个示例应该是 ${c.id}-basic（基础用法）`);
    const stateful = (c.props || []).some((p) => / \/ default|^default/.test(p.names?.react || "") || /v-model/.test(p.names?.vue || ""));
    if (stateful && !ex.some((e) => /controlled/.test(e.slug))) add("3 示例", `有受控写法（value / v-model），缺 ${c.id}-controlled 示例`);
    for (const e of ex) {
      if (!e.slug?.startsWith(c.id + "-")) add("3 示例", `slug "${e.slug}" 要以 ${c.id}- 开头`);
      for (const k of ["title", "why", "html"]) if (!has(e[k])) add("3 示例", `${e.slug} 缺 ${k}`);
      const lack = FRAMEWORKS.filter((f) => !exists(path.join(f.dir, f.demo(e.slug)))).map((f) => f.id);
      if (lack.length) add("3 示例源码", `${e.slug}：${lack.length === FWS.length ? "7 个框架都还没有" : "缺 " + lack.join("、")}`);
    }
  }
  // 4 API
  if (!foundation) {
    if (!c.dts) add("4 API", "dts（契约测试去类型里找哪些声明）");
    for (const p of c.props || []) {
      const lack = ["type", "default", "desc"].filter((k) => !has(p[k])).concat(typeof p.required === "boolean" ? [] : ["required"]);
      if (lack.length) add("4 API", `属性 ${p.name} 缺 ${lack.join("、")}`);
      if (!p.names || !Object.keys(p.names).length) add("4 API", `属性 ${p.name} 没写各写法里的叫法（names）`);
    }
    for (const e of c.events || []) {
      const lack = ["payload", "when"].filter((k) => !has(e[k]));
      if (lack.length) add("4 API", `事件 ${e.name} 缺 ${lack.join("、")}`);
      if (!e.markupOnly && !e.native) for (const fw of ["react", "vue"]) if (!has(e.names?.[fw])) add("4 API", `事件 ${e.name} 没写 ${fw} 的写法`);
    }
    for (const s of c.slots || []) if (!has(s.desc)) add("4 API", `插槽 ${s.name} 缺说明`);
    for (const m of c.methods || []) { const lack = ["signature", "returns", "desc"].filter((k) => !has(m[k])); if (lack.length) add("4 API", `实例方法 ${m.name} 缺 ${lack.join("、")}`); }
    for (const f of c.functions || []) { const lack = ["signature", "returns", "desc"].filter((k) => !has(f[k])); if (lack.length) add("4 API", `函数 ${f.name} 缺 ${lack.join("、")}`); }
    // 纯样式组件（没有框架组件、没有函数：链接、卡片、空状态……）的 API 就是类名；有组件或函数的还要有导出的类型
    const pureCss = !c.dts?.react && !c.dts?.vue && !c.dts?.svelte && !c.dts?.factory && !c.dts?.options && !has(c.functions);
    if (!has(c.props) && !has(c.functions) && !pureCss) add("4 API", "属性和函数都没有");
    if (!has(c.classes)) add("4 API", "纯 HTML 写法的类名、data 属性（classes）");
    if (!has(c.types) && !pureCss) add("4 API", "导出的 TS 类型名（types）");
  }
  if (!has(c.cssVars)) add("4 API", "能改的 CSS 变量、令牌（cssVars）");
  for (const v of c.cssVars || []) { const lack = ["desc", "default"].filter((k) => !has(v[k])); if (lack.length) add("4 API", `CSS 变量 ${v.name} 缺 ${lack.join("、")}`); }
  // 5 键盘与无障碍
  if (!foundation) {
    if (!has(c.keyboard)) add("5 键盘与无障碍", "按键表");
    for (const k of c.keyboard || []) if (!has(k.keys) || !has(k.does)) add("5 键盘与无障碍", `按键 ${k.keys || "?"} 缺 keys 或 does`);
    if (!has(c.a11y?.roles)) add("5 键盘与无障碍", "ARIA 角色");
    if (!has(c.a11y?.focus)) add("5 键盘与无障碍", "焦点怎么走");
  }
  // 6 设计规范
  const d = c.design || {};
  if (!has(d.do)) add("6 设计规范", "该这样做");
  if (!has(d.dont)) add("6 设计规范", "不要这样做");
  if (!foundation && !has(d.copy)) add("6 设计规范", "文案建议");
  if (!foundation && !has(d.motion)) add("6 设计规范", "动效（曲线和时长）");
  for (const m of d.motion || []) if (!has(m.what) || !has(m.easing) || !has(m.duration)) add("6 设计规范", `动效"${m.what || "?"}"缺 easing 或 duration`);
  // 7 相关组件
  if (!has(c.related)) add("7 相关组件", "至少一个");
  for (const r of c.related || []) { if (!IDS.has(r.id)) add("7 相关组件", `${r.id} 不存在`); if (!has(r.diff)) add("7 相关组件", `${r.id} 缺区别说明`); }
  for (const w of c.whenNotToUse || []) if (w.use && !IDS.has(w.use)) add("1 说明", `什么时候别用里的 ${w.use} 不存在`);
  return miss;
}

let ok = 0, bad = 0, noContract = 0, fileMiss = 0;
for (const { id, group } of index) {
  if (ONLY && !ONLY.has(id)) continue;
  const c = JSON.parse(fs.readFileSync(path.join(SPEC, id + ".json"), "utf8")), foundation = group === "基础";
  const miss = check(c, foundation), parts = Object.keys(miss);
  if (!parts.length) { ok++; if (!QUIET) console.log(`✓ ${id}`); continue; }
  bad++; if (!c.contract) noContract++;
  fileMiss += (miss["3 示例源码"] || []).length;
  if (QUIET) continue;
  if (!c.contract) { console.log(`✗ ${id}：还没填手写契约`); continue; }
  console.log(`✗ ${id}`);
  for (const p of parts) console.log(`    ${p}：${miss[p].join("；")}`);
}
console.log(`文档完整度：齐全 ${ok} 个，有缺项 ${bad} 个（其中没填契约 ${noContract} 个；示例源码文件缺 ${fileMiss} 组）`);
process.exitCode = bad ? 1 : 0;
