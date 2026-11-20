// 重组件放进空容器（createChat、createMarkdown、createFlow、createDataGrid、createCanvasGrid、createThemePanel）：
// 深浅 × 桌面截图，记页面报错，再把设计稿里对应那块的截图放在旁边，人眼对着看（标记是同一份，接上以后应该一模一样，只差内容）。
// 用法：先起服务（python3 serve.py 5192 .），node scripts/test/heavy-shots.mjs [--out 目录]
import fs from "node:fs";
import path from "node:path";
import { launch, newContext, arg, SIDES, ensureDir } from "../parity/lib.mjs";

const OUT = path.resolve(arg("out", "/tmp/satin-heavy-shots"));
ensureDir(OUT);
const CASES = [["chat", "chat"], ["md", "md"], ["flow", "flow"], ["grid", "grid"], ["cgrid", "cgrid"], ["theme", null]];
const browser = await launch();
let bad = 0;
for (const theme of ["light", "dark"]) {
  const ctx = await newContext(browser, { side: "cur", theme, size: [1200, 900] }), page = await ctx.newPage();
  const errs = []; page.on("pageerror", (e) => errs.push(e.message)); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await page.goto(SIDES.cur.url + "/tests/heavy.html"); await page.waitForFunction(() => window.ready, null, { timeout: 15000 }).catch(() => errs.push("页面没跑起来"));
  await page.waitForTimeout(1500);
  for (const [id] of CASES) {
    const el = await page.$("#c-" + id); if (!el) { bad++; console.log(`  ✗ ${theme} ${id} 没有`); continue; }
    await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
    await el.screenshot({ path: path.join(OUT, `${theme}-${id}.png`) });
  }
  // 设计稿里对应的那块（?embed=区块）
  for (const [id, sec] of CASES) {
    if (!sec) continue;
    const p2 = await ctx.newPage(); await p2.goto(SIDES.cur.url + "/index.html?embed=" + sec); await p2.waitForTimeout(1500);
    const box = await p2.$(".demo"); if (box) await box.screenshot({ path: path.join(OUT, `${theme}-${id}-design.png`) }); await p2.close();
  }
  if (errs.length) { bad++; console.log(`  ✗ ${theme} 页面报错：`, errs.slice(0, 5)); } else console.log(`  ✓ ${theme} 6 个重组件放进空容器，没有报错`);
  await ctx.close();
}
await browser.close();
console.log(bad ? `重组件空容器：${bad} 处有问题（截图在 ${OUT}）` : `重组件空容器：深浅都没有报错（截图在 ${OUT}，和 *-design.png 对着看）`);
process.exitCode = bad ? 1 : 0;
