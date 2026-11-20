// 调试：两边同一个区块，落定前后某些元素的 style 属性
import { launch, newContext, embedURL } from "./lib.mjs";
const id = process.argv[2] || "image", sel = process.argv[3] || ".sn-pic, .pic";
const b = await launch({ soft: true });
for (const side of ["base", "cur"]) {
  const ctx = await newContext(b, { side, still: true }), p = await ctx.newPage();
  await p.goto(embedURL(side, id), { waitUntil: "load" });
  const before = await p.evaluate((s) => [...document.querySelectorAll(s)].slice(0, 3).map((e) => e.getAttribute("style")), sel);
  await p.evaluate(() => window.__parity.settle(800, 12000, 1500));
  const after = await p.evaluate((s) => [...document.querySelectorAll(s)].slice(0, 3).map((e) => e.getAttribute("style")), sel);
  console.log(side, JSON.stringify(before), JSON.stringify(after));
  await ctx.close();
}
await b.close();
