// 对话、流程图的 XSS 测试：历史消息（文字、说明、时长、文件名、扩展名、画面）、模型流出来的思考 / 步骤 / 卡片 / 正文 / 画面、
// 流程图节点的标题 / 说明 / 缩略图里都塞注入代码，检查没有脚本执行、没有多出来的元素和 on* 属性
// 模型的输出、服务器给的历史都当不可信的数据：库只当纯文本写进去
// 用法：先起服务（python3 serve.py 5192 .），node scripts/test/chat-xss.mjs
import { launch, newContext, SIDES } from "../parity/lib.mjs";
const browser = await launch(), ctx = await newContext(browser, { side: "cur" }), page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(e.message));
await page.goto(SIDES.cur.url + "/tests/chat-xss.html"); await page.waitForFunction(() => window.ready);
// 发一句，等模型的回答（思考、步骤、正文、卡片、画面）都出来
await page.evaluate(() => window.chat.send("测试"));
await page.waitForTimeout(4000);
const r = await page.evaluate(() => {
  const probs = [];
  if (window.__pwned) probs.push("脚本执行了");
  const roots = [document.getElementById("chat"), document.getElementById("flow")];
  for (const root of roots) for (const n of root.querySelectorAll("*")) {
    if (n.hasAttribute("data-x-injected")) probs.push(`多出来的元素：${root.id} 里的 <${n.tagName.toLowerCase()}>`);
    for (const a of n.attributes) if (/^on/i.test(a.name)) probs.push(`事件属性 ${a.name}（${root.id}）`);
  }
  const ai = document.querySelector("#chat .sn-ai-text, #chat .sn-ai-card");
  return { probs: [...new Set(probs)], aiRendered: !!ai, flowNodes: document.querySelectorAll("#flow .sn-fnode").length };
});
await browser.close();
const bad = r.probs.length || !r.aiRendered || r.flowNodes !== 2 || errs.length;
console.log(bad ? `对话、流程图 XSS：有问题\n  ${[...r.probs, ...(!r.aiRendered ? ["模型的回答没画出来"] : []), ...(r.flowNodes !== 2 ? [`流程图节点数 ${r.flowNodes}`] : []), ...errs.map((e) => "页面报错 " + e)].join("\n  ")}` : "对话、流程图 XSS：历史消息、模型输出、节点字段里的注入全部当纯文本");
process.exitCode = bad ? 1 : 0;
