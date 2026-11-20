// 统计库代码里写死的中文：字符串字面量和模板字符串（注释不算）
import fs from "node:fs"; import * as acorn from "acorn"; import * as walk from "acorn-walk";
const CJK = /[一-鿿]/;
let total = 0; const per = {};
for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, "utf8"), ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  let n = 0;
  walk.full(ast, (node) => {
    if (node.type === "Literal" && typeof node.value === "string" && CJK.test(node.value)) n++;
    if (node.type === "TemplateLiteral" && node.quasis.some((q) => CJK.test(q.value.cooked || ""))) n++;
  });
  per[f.split("/").pop()] = n; total += n;
}
console.log(total, JSON.stringify(per));
