// 前缀改写第二遍：模板字符串里 class="… ${表达式} …" 的表达式中直接写的字符串（cond ? "me" : "ai"、x || "secondary"），
// 是库类的就加前缀。第一遍只认 class 属性里静态的部分；这一遍补上占位符里的字面量。
import fs from "node:fs";
import * as acorn from "acorn";
import * as walk from "acorn-walk";
import MagicString from "magic-string";

const PFX = "sn-", rep = JSON.parse(fs.readFileSync(".parity/prefix-report.json", "utf8")), P = new Set(rep.classes);
// 所有 JS（第一版只看了报告里列出的文件，漏了 class="sn-pg${x === page ? " on" : ""}" 这种静态部分有前缀、占位里还有类名的写法）
const files = process.argv.slice(2).length ? process.argv.slice(2) : [...new Set(rep.dynamicClass.map(([w]) => w.split(":")[0].replace(/<script>$/, "")))].filter((f) => f.endsWith(".js"));
let n = 0; const log = [];
for (const f of files) {
  const src = fs.readFileSync(f, "utf8"), ms = new MagicString(src);
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  walk.full(ast, (node) => {
    if (node.type !== "TemplateLiteral") return;
    node.expressions.forEach((ex, i) => {
      // 这个占位前面的文字：最后一个 class=" 之后没有收尾的引号 → 占位在 class 属性里
      const before = node.quasis.slice(0, i + 1).map((q) => q.value.raw).join("\u0000");
      const k = before.lastIndexOf('class="'); if (k < 0 || before.slice(k + 7).includes('"')) return;
      const cmp = new Set(); walk.full(ex, (b) => { if (b.type === "BinaryExpression" && /^[!=]==?$/.test(b.operator)) { cmp.add(b.left); cmp.add(b.right); } if (b.type === "CallExpression") for (const a of b.arguments) cmp.add(a); });
      walk.full(ex, (lit) => {
        if (lit.type !== "Literal" || typeof lit.value !== "string" || !lit.value || cmp.has(lit)) return;
        const out = lit.value.split(/(\s+)/).map((t) => (P.has(t) ? PFX + t : t)).join("");
        if (out !== lit.value) { ms.overwrite(lit.start + 1, lit.end - 1, out); n++; log.push(`${f}:${src.slice(0, lit.start).split("\n").length} "${lit.value}" → "${out}"`); }
      });
    });
  });
  fs.writeFileSync(f, ms.toString());
}
console.log(log.join("\n")); console.log(`补了 ${n} 处`);
