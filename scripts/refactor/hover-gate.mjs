// 悬停样式只给有悬停的设备：把选择器里正着用了 :hover 的那部分挪进 @media (hover: hover)。
// 触屏上点一下会留下 :hover（iOS Safari 尤其明显：按钮点完一直是加深的颜色），这样就没有了；鼠标设备上完全不变：
// · 一条规则里有的选择器带 :hover、有的不带：带的那部分单独抄一份放进 @media，紧跟在原规则后面（同样的声明、同样的位置，层叠顺序不变）
// · :not(:hover) 这种"没悬停时"的不动（触屏上永远成立，挪进去反而错）
// · 已经在 @media (hover: hover) 里的不再包
// 用法：node scripts/refactor/hover-gate.mjs 文件.css ...   （直接改文件；再跑一遍不会重复包）
import fs from "node:fs";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

const positiveHover = (sel) => {
  let hit = false;
  selectorParser((root) => {
    root.walkPseudos((p) => {
      if (p.value !== ":hover") return;
      // 在 :not() 里的不算
      for (let a = p.parent; a; a = a.parent) if (a.type === "pseudo" && a.value === ":not") return;
      hit = true;
    });
  }).processSync(sel);
  return hit;
};
const inHoverMedia = (node) => { for (let a = node.parent; a; a = a.parent) if (a.type === "atrule" && a.name === "media" && /hover:\s*hover/.test(a.params)) return true; return false; };
const inKeyframes = (node) => { for (let a = node.parent; a; a = a.parent) if (a.type === "atrule" && /keyframes$/.test(a.name)) return true; return false; };

let total = 0;
for (const f of process.argv.slice(2)) {
  const root = postcss.parse(fs.readFileSync(f, "utf8"), { from: f });
  let n = 0;
  root.walkRules((rule) => {
    if (inKeyframes(rule) || inHoverMedia(rule) || !rule.selector.includes(":hover")) return;
    const sels = rule.selectors, hov = sels.filter(positiveHover);
    if (!hov.length) return;
    const media = postcss.atRule({ name: "media", params: "(hover: hover)" });
    if (hov.length === sels.length) {
      rule.replaceWith(media); media.append(rule);
    } else {
      const copy = rule.clone({ selectors: hov });
      rule.selectors = sels.filter((s) => !hov.includes(s));
      media.append(copy); rule.after(media);
    }
    // 紧挨着放：raws 跟原规则一样（换行、缩进）
    media.raws.before = rule.raws.before ?? "\n"; media.raws.between = " "; media.raws.after = " ";
    n++;
  });
  if (n) fs.writeFileSync(f, root.toString());
  total += n; console.log(`${f}：${n} 条`);
}
console.log(`共 ${total} 条悬停规则挪进 @media (hover: hover)`);
