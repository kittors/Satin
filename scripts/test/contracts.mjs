// 组件的手写 API 契约（spec/components/_api/<id>.mjs，合并进 spec/components/<id>.json）和类型声明（packages/satin-ui/types/*.d.ts）逐项比对：
// · createXxx 的选项（或 dts.options 写的选项接口）↔ 契约里 names.js 的属性 + names.js 的事件（onXxx）：名字、类型、是否可选
// · createXxx 返回的实例（SatinFactory 的第二个类型参数）↔ 契约的 methods：名字、签名
// · dts.functions 里的函数 ↔ 契约的 functions：签名
// · React 组件的属性（react.d.ts，重组件在 react-<子路径>.d.ts）↔ 契约 names.react（属性、事件、子元素）；Vue 组件的属性（vue.d.ts、vue-<子路径>.d.ts）↔ names.vue（v-model 算 modelValue）
// · Svelte 组件的属性（svelte.d.ts、svelte-<名字>.d.ts 里的 Component<属性>）↔ names.svelte（属性、事件、片段；bind:value 算 value）
// · 自定义元素 <sn-xxx> 能写的属性（elements/index.js）↔ names.element
// · 上面这些声明用到的、我们导出的类型（顺着引用一路找下去）↔ 契约的 types
// 多了、少了都报错。没填契约的组件列为"未填"，不算失败；合并出来的 JSON 和 _api 源文件对不上（忘了重跑生成）也报错。
// 用法：node scripts/test/contracts.mjs [--only id,id]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const ROOT = path.resolve(import.meta.dirname, "../..");
const TYPES = path.join(ROOT, "packages/satin-ui/types"), SPEC = path.join(ROOT, "spec/components"), API_DIR = path.join(SPEC, "_api");
const onlyArg = process.argv.indexOf("--only"), ONLY = onlyArg > 0 ? new Set(process.argv[onlyArg + 1].split(",")) : null;

// ———— 读类型声明 ————
const files = {};
for (const f of fs.readdirSync(TYPES).filter((x) => x.endsWith(".d.ts"))) {
  const sf = ts.createSourceFile(f, fs.readFileSync(path.join(TYPES, f), "utf8"), ts.ScriptTarget.Latest, true);
  const decls = new Map();
  for (const st of sf.statements) {
    const exported = !!st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) decls.set(st.name.text, { kind: "type", node: st, exported, sf });
    else if (ts.isFunctionDeclaration(st) && st.name) { if (!decls.has(st.name.text)) decls.set(st.name.text, { kind: "fn", node: st, exported, sf }); }
    else if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) decls.set(d.name.getText(sf), { kind: "const", node: d, exported, sf });
  }
  files[f] = { sf, decls };
}
const FALLBACK = ["components.d.ts", "heavy.d.ts", "index.d.ts", "theme.d.ts", "icons.d.ts", "elements.d.ts"];
// 名字先在本文件里找，找不到再到 components.d.ts、heavy.d.ts…（react.d.ts、vue.d.ts 从 ./components 引类型）
const lookup = (name, file) => files[file]?.decls.get(name) || FALLBACK.map((f) => files[f]?.decls.get(name)).find(Boolean) || null;
const fileOf = (d) => Object.keys(files).find((f) => files[f].sf === d.sf);
const EXPORTED_TYPES = new Set(Object.values(files).flatMap(({ decls }) => [...decls].filter(([, d]) => d.kind === "type" && d.exported).map(([n]) => n)));
const INFRA = new Set(["SatinFactory", "SatinInstance"]); // 所有组件共用的外壳，不算进某一个组件的类型
const norm = (s) => String(s ?? "").replace(/\s+/g, "").replace(/;+$/, "").replace(/;}/g, "}");
const lead = (s) => String(s ?? "").split("（")[0].trim(); // "PickDetail（{ text: string }）" → "PickDetail"（只认全角括号：半角的是函数类型里的）
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// 一个类型展开成成员表：name → { optional, text, method, params }；顺手记下用到了哪些导出的类型
function membersOf(node, file, refs = new Set(), seen = new Set()) {
  const out = new Map();
  const add = (m) => { for (const [k, v] of m) out.set(k, v); };
  if (!node) return out;
  if (ts.isParenthesizedTypeNode(node)) return membersOf(node.type, file, refs, seen);
  if (ts.isIntersectionTypeNode(node)) { for (const t of node.types) add(membersOf(t, file, refs, seen)); return out; }
  if (ts.isTypeLiteralNode(node)) { add(fromMembers(node.members, file, refs, seen)); return out; }
  if (ts.isTypeReferenceNode(node)) return fromRef(node.typeName.getText(), node.typeArguments || [], file, refs, seen);
  return out;
}
function fromMembers(members, file, refs, seen) {
  const out = new Map();
  {
    for (const m of members) {
      if (!m.name) continue;
      const name = m.name.getText(), optional = !!m.questionToken;
      if (ts.isMethodSignature(m)) out.set(name, { optional, method: true, text: m.getText(), params: m.parameters.map((p) => p.type?.getText() ?? "any"), node: m });
      else if (ts.isPropertySignature(m)) out.set(name, { optional, method: false, text: m.getText(), type: m.type?.getText() ?? "any", node: m });
      collectRefs(m, file, refs, seen);
    }
  }
  return out;
}
// 按名字展开：Controlled<T, K>、Omit / Pick / Partial、DefineComponent / ForwardRefExoticComponent、本文件或 components.d.ts 里的接口和别名
function fromRef(name, args, file, refs, seen) {
  const out = new Map();
  const add = (m) => { for (const [k, v] of m) out.set(k, v); };
  {
    const tail = name.split(".").pop();
    if (tail === "DefineComponent" || tail === "ForwardRefExoticComponent") return membersOf(args[0], file, refs, seen); // 组件的外壳：看它的属性类型
    if (name.startsWith("React.") || name.startsWith("import(")) return out; // 框架自带的（原生属性、ref）
    if (tail === "Base" || tail === "Ref") return out; // react.d.ts 里所有组件都有的 className、style、id
    if (/^svelte/.test(file) && (tail === "Attrs" || tail === "Inst")) return out; // svelte.d.ts 里所有组件都有的 class、style、id、data-*、bind:instance
    if (tail === "Component" && /^svelte/.test(file)) return membersOf(args[0], file, refs, seen); // Svelte 组件的外壳 Component<属性, 导出, 能绑定的>：看属性
    if (tail === "Controlled") {
      const k = args[1] && ts.isLiteralTypeNode(args[1]) ? args[1].literal.text : "value", text = args[0]?.getText() ?? "unknown";
      collectRefs(args[0], file, refs, seen);
      out.set(k, { optional: true, method: false, type: text, text: `${k}?: ${text}` });
      out.set("default" + cap(k), { optional: true, method: false, type: text, text: `default${cap(k)}?: ${text}` });
      return out;
    }
    if (tail === "Omit" || tail === "Pick" || tail === "Partial") {
      const inner = membersOf(args[0], file, refs, seen);
      const keys = args[1] ? [...args[1].getText().matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
      for (const [k, v] of inner) if (tail === "Partial" || (tail === "Omit" ? !keys.includes(k) : keys.includes(k))) out.set(k, tail === "Partial" ? { ...v, optional: true } : v);
      return out;
    }
    const d = lookup(name, file);
    if (!d || d.kind !== "type") return out; // HTMLElement 这类浏览器的类型
    if (d.exported && !INFRA.has(name)) refs.add(name);
    const key = fileOf(d) + ":" + name; if (seen.has(key)) return out; seen.add(key);
    const df = fileOf(d);
    if (ts.isInterfaceDeclaration(d.node)) {
      for (const h of d.node.heritageClauses || []) for (const t of h.types) add(fromRef(t.expression.getText(d.sf), t.typeArguments || [], df, refs, seen));
      add(fromMembers(d.node.members, df, refs, seen));
      return out;
    }
    // 类型别名：vue.d.ts 的 C<P> = DefineComponent<P & { modelValue?: any }>
    if (tail === "C" && args[0]) { add(membersOf(args[0], file, refs, seen)); out.set("modelValue", { optional: true, method: false, type: "any", text: "modelValue?: any" }); return out; }
    return membersOf(d.node.type, df, refs, seen);
  }
}
// 只收集引用（函数参数、返回值、成员类型里出现的导出类型）
function collectRefs(node, file, refs, seen) {
  if (!node) return;
  const visit = (n) => {
    if (ts.isTypeReferenceNode(n)) {
      const name = n.typeName.getText();
      const d = lookup(name, file);
      if (d && d.kind === "type") {
        if (d.exported && !INFRA.has(name)) refs.add(name);
        const key = fileOf(d) + ":" + name;
        if (!seen.has(key)) { seen.add(key); collectRefs(d.node, fileOf(d), refs, seen); }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
}
// 函数签名写成 "name(参数): 返回"
const sigOf = (d) => `${d.node.name.text}(${d.node.parameters.map((p) => p.getText(d.sf)).join(", ")}): ${d.node.type?.getText(d.sf) ?? "void"}`;

// 自定义元素能写的属性：elements/index.js 的 COMPONENTS 表
const elSrc = fs.readFileSync(path.join(ROOT, "packages/satin-ui/elements/index.js"), "utf8");
const ELEMENTS = Object.fromEntries([...elSrc.matchAll(/^\s*"?([\w-]+)"?: \[S\.create\w+, \[([^\]]*)\]\]/gm)].map((m) => [m[1], [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1])]));

// 契约里各写法的名字：把 "value / defaultValue"、"items（写成 JSON）"、"v-model / value" 拆成能比的名字
const ident = (s) => /^[A-Za-z_$][\w$]*$/.test(s);
const tokens = (s) => String(s ?? "").split("/").map((x) => lead(x).trim()).filter(Boolean);
const reactNames = (s) => tokens(s).filter(ident);
const vueNames = (s) => tokens(s).map((x) => (x === "v-model" ? "modelValue" : x.startsWith("v-model:") ? x.slice(8) : x)).filter(ident);
const svelteNames = (s) => tokens(s).map((x) => (x.startsWith("bind:") ? x.slice(5) : x)).filter(ident);
// 组件声明在哪个文件：先找主入口的（react.d.ts），再找子路径的（react-grid.d.ts……）
const findIn = (prefix, name) => { for (const f of [prefix + ".d.ts", ...Object.keys(files).filter((x) => x.startsWith(prefix + "-")).sort()]) { const d = files[f]?.decls.get(name); if (d) return [d, f]; } return [null, null]; };
const elNames = (s) => tokens(s).filter((x) => /^[a-z][\w-]*$/.test(x));
const diffSets = (want, have, label, out) => {
  const a = [...want].filter((x) => !have.has(x)), b = [...have].filter((x) => !want.has(x));
  if (a.length) out.push(`${label}：契约里有、类型里没有 ${a.join("、")}`);
  if (b.length) out.push(`${label}：类型里有、契约里没写 ${b.join("、")}`);
};

// ———— 逐个组件比 ————
const ids = fs.readdirSync(SPEC).filter((f) => f.endsWith(".json") && f !== "index.json" && !f.startsWith("_")).map((f) => f.slice(0, -5)).sort();
let bad = 0; const filled = [], unfilled = [];
for (const id of ids) {
  if (ONLY && !ONLY.has(id)) continue;
  const json = JSON.parse(fs.readFileSync(path.join(SPEC, id + ".json"), "utf8"));
  const srcFile = path.join(API_DIR, id + ".mjs");
  if (!json.contract && !fs.existsSync(srcFile)) { unfilled.push(id); continue; }
  filled.push(id);
  const errs = [];
  const src = fs.existsSync(srcFile) ? (await import(pathToFileURL(srcFile).href)).default : null;
  if (!src) errs.push("spec/components/" + id + ".json 带 contract，但 _api/" + id + ".mjs 不见了");
  else if (!json.contract) errs.push("有 _api/" + id + ".mjs，但 " + id + ".json 里还没合并进去：跑 node scripts/spec/build.mjs --components");
  else { const keys = Object.keys(src); const stale = keys.filter((k) => JSON.stringify(json[k]) !== JSON.stringify(src[k])); if (stale.length) errs.push(`${id}.json 和 _api/${id}.mjs 对不上（${stale.join("、")}）：跑 node scripts/spec/build.mjs --components`); }
  const c = src || json, dts = c.dts || {};
  if (!c.dts) errs.push("契约里没写 dts（去类型声明里找哪些声明）");
  const props = c.props || [], events = c.events || [], slots = c.slots || [], methods = c.methods || [];
  const refs = new Set();

  // 1. 选项：createXxx 的第一个类型参数，或者 dts.options 写的接口
  let optNode = null, instNode = null, optFile = "components.d.ts";
  if (dts.factory) {
    const d = lookup(dts.factory, "components.d.ts");
    const t = d?.kind === "const" ? d.node.type : null;
    if (!t || !ts.isTypeReferenceNode(t) || t.typeName.getText() !== "SatinFactory") errs.push(`类型里找不到 ${dts.factory}: SatinFactory<…>`);
    else { optNode = t.typeArguments?.[0]; instNode = t.typeArguments?.[1]; optFile = fileOf(d); }
  } else if (dts.options) {
    const d = lookup(dts.options, "components.d.ts");
    if (!d || d.kind !== "type") errs.push(`类型里找不到选项接口 ${dts.options}`);
    else { optNode = { byName: dts.options }; optFile = fileOf(d); }
  }
  if (optNode) {
    const m = optNode.byName ? fromRef(optNode.byName, [], optFile, refs, new Set()) : membersOf(optNode, optFile, refs);
    const wantProps = new Map(props.filter((p) => p.names?.js).map((p) => [p.names.js, p]));
    const wantEvents = new Map(events.filter((e) => e.names?.js && !e.markupOnly).map((e) => [e.names.js, e]));
    diffSets(new Set([...wantProps.keys(), ...wantEvents.keys()]), new Set(m.keys()), "选项", errs);
    for (const [k, p] of wantProps) {
      const t = m.get(k); if (!t || t.method) continue;
      if (norm(lead(p.type)) !== norm(t.type)) errs.push(`选项 ${k} 的类型：契约写 ${p.type}，类型里是 ${t.type}`);
      if (!dts.react && !!p.required === t.optional) errs.push(`选项 ${k}：契约写${p.required ? "必填" : "可选"}，类型里是${t.optional ? "可选" : "必填"}`);
    }
    for (const [k, e] of wantEvents) {
      const t = m.get(k); if (!t) continue;
      const pay = lead(e.payload);
      if (t.method && pay && pay !== "—" && norm(pay) !== norm(t.params[0] ?? "")) errs.push(`事件 ${k} 的参数：契约写 ${e.payload}，类型里是 ${t.params[0] ?? "（没有参数）"}`);
    }
  }
  // 2. 实例：SatinFactory 的第二个类型参数 ↔ methods
  {
    const m = instNode ? membersOf(instNode, optFile, refs) : new Map();
    diffSets(new Set(methods.map((x) => x.name)), new Set(m.keys()), "实例方法", errs);
    for (const x of methods) { const t = m.get(x.name); if (t && norm(x.signature) !== norm(t.text)) errs.push(`实例方法 ${x.name} 的签名：契约写 ${x.signature}，类型里是 ${t.text}`); }
  }
  // 3. 函数
  {
    const want = new Set((dts.functions || []));
    const listed = new Set((c.functions || []).map((f) => f.name));
    diffSets(listed, want, "函数（契约 functions ↔ dts.functions）", errs);
    for (const f of c.functions || []) {
      const d = Object.values(files).map(({ decls }) => decls.get(f.name)).find((x) => x?.kind === "fn");
      if (!d) { errs.push(`类型里找不到函数 ${f.name}`); continue; }
      collectRefs(d.node, fileOf(d), refs, new Set());
      if (norm(f.signature) !== norm(sigOf(d))) errs.push(`函数 ${f.name} 的签名：契约写 ${f.signature}，类型里是 ${sigOf(d)}`);
      if (f.returns && norm(f.returns) !== norm(d.node.type?.getText(d.sf) ?? "void")) errs.push(`函数 ${f.name} 的返回值：契约写 ${f.returns}，类型里是 ${d.node.type?.getText(d.sf)}`);
    }
  }
  // 4. React 组件
  if (dts.react) {
    const [d, rf] = findIn("react", dts.react);
    let pNode = null;
    if (d?.kind === "const" && d.node.type) pNode = d.node.type;
    else if (d?.kind === "fn") pNode = d.node.parameters[0]?.type;
    if (!pNode) errs.push(`react.d.ts（和 react-*.d.ts）里找不到组件 ${dts.react}`);
    else {
      const m = membersOf(pNode, rf, refs);
      const want = new Set([
        ...props.filter((p) => !(p.native || []).includes("react")).flatMap((p) => reactNames(p.names?.react)),
        ...events.filter((e) => !e.native && !e.markupOnly).flatMap((e) => reactNames(e.names?.react)),
        ...slots.filter((x) => !(x.native || []).includes("react")).flatMap((x) => reactNames(x.names?.react)),
      ]);
      diffSets(want, new Set(m.keys()), `React ${dts.react} 的属性`, errs);
      for (const p of props) for (const k of reactNames(p.names?.react)) { const t = m.get(k); if (t && k === p.names.react.split("/")[0].trim() && !!p.required === t.optional) errs.push(`React ${dts.react} 的 ${k}：契约写${p.required ? "必填" : "可选"}，类型里是${t.optional ? "可选" : "必填"}`); }
    }
  }
  // 5. Vue 组件
  if (dts.vue) {
    const [d, vf] = findIn("vue", dts.vue);
    if (!d?.node.type) errs.push(`vue.d.ts（和 vue-*.d.ts）里找不到组件 ${dts.vue}`);
    else {
      const m = membersOf(d.node.type, vf, refs);
      const want = new Set(props.filter((p) => !(p.native || []).includes("vue")).flatMap((p) => vueNames(p.names?.vue))); // native: ["vue"]：从原生属性透传（类型里不单独声明）
      diffSets(want, new Set(m.keys()), `Vue ${dts.vue} 的属性`, errs);
    }
  }
  // 5b. Svelte 组件
  if (dts.svelte) {
    const [d, sf] = findIn("svelte", dts.svelte);
    if (!d?.node.type) errs.push(`svelte.d.ts（和 svelte-*.d.ts）里找不到组件 ${dts.svelte}`);
    else {
      const m = membersOf(d.node.type, sf, refs);
      const want = new Set([
        ...props.filter((p) => !(p.native || []).includes("svelte")).flatMap((p) => svelteNames(p.names?.svelte)),
        ...events.filter((e) => !e.native && !e.markupOnly).flatMap((e) => svelteNames(e.names?.svelte)),
        ...slots.filter((x) => !(x.native || []).includes("svelte")).flatMap((x) => svelteNames(x.names?.svelte)),
      ]);
      diffSets(want, new Set(m.keys()), `Svelte ${dts.svelte} 的属性`, errs);
    }
  }
  // 6. 自定义元素
  if (dts.element) {
    const have = ELEMENTS[dts.element];
    if (!have) errs.push(`elements/index.js 里没有 sn-${dts.element}`);
    else diffSets(new Set(props.flatMap((p) => elNames(p.names?.element))), new Set(have), `<sn-${dts.element}> 的属性`, errs);
  }
  // 7. 导出的类型
  diffSets(new Set(c.types || []), refs, "导出的类型", errs);
  for (const t of c.types || []) if (!EXPORTED_TYPES.has(t)) errs.push(`导出的类型 ${t} 在 .d.ts 里没有导出`);

  if (errs.length) { bad++; console.log(`✗ ${id}`); for (const e of errs) console.log(`    ${e}`); }
  else console.log(`✓ ${id}：选项、实例方法、函数、${[dts.react && "React", dts.vue && "Vue", dts.svelte && "Svelte", dts.element && "自定义元素"].filter(Boolean).join("、") || "（没有框架组件）"}、类型都和 .d.ts 一致`);
}
if (!ONLY) console.log(`未填契约（不算失败）：${unfilled.length} 个`);
console.log(bad ? `契约 ↔ 类型：${bad} 个组件对不上（共填了 ${filled.length} 个）` : `契约 ↔ 类型：填了契约的 ${filled.length} 个组件全部一致`);
process.exitCode = bad ? 1 : 0;
