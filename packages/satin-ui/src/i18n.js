// 多语言：组件里所有给人看的文字都走 t(键, 参数)。默认简体中文（locales/zh-CN.js），另带英文（satin-ui/locales/en，按需引入，不用的不打包）。
//   import en from "satin-ui/locales/en"; addLocale("en", en); setLocale("en");   // 换整套
//   setLocale({ "pager.0": "上一页" });                                // 只改几条（没给的用默认）
//   addLocale("ja", { ... }); setLocale("ja");                         // 加一套
// 缺的键回到中文；参数用 {p0} {p1} 占位。导入本身没有副作用。
// 中文原文分散在各组件自己的语言表里（locales/zh-CN/<组件>.js），组件用 scoped(自己的表) 拿到 t；
// 这里只放"当前语言"的覆盖表：setLocale 换语言、改几条，都写进 cur
const packs = { "zh-CN": {} };
let cur = {}, lang = "zh-CN";
const fmt = (s, params) => (params ? s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m)) : s);
export const scoped = (defaults) => (key, params) => fmt(cur[key] ?? defaults[key] ?? key, params);
const subs = new Set();
// 全局查：当前语言里有就用，没有就原样返回键（组件内部用 scoped，不用这个）
export const t = (key, params) => fmt(cur[key] ?? key, params);
export function addLocale(name, messages) { packs[name] = messages; }
// 换语言：名字（"zh-CN"、"en"、addLocale 加过的）或者一份消息表（在当前语言上覆盖）。已经渲染出来的组件不会自己重画：换语言后重新创建组件，或者在应用启动时先设好
export function setLocale(nameOrMessages) {
  if (typeof nameOrMessages === "string") { cur = { ...(packs[nameOrMessages] ?? {}) }; lang = packs[nameOrMessages] ? nameOrMessages : "zh-CN"; }
  else if (nameOrMessages) cur = { ...cur, ...nameOrMessages };
  for (const f of subs) f(lang);
}
export const getLocale = () => lang;
// 数字、日期格式化用的 BCP 47 语言标记（toLocaleString、Intl.DateTimeFormat）
export const intlLocale = () => (lang === "zh-CN" ? "zh-CN" : lang);
export const onLocaleChange = (f) => (subs.add(f), () => subs.delete(f));
