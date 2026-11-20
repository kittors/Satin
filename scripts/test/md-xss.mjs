// Markdown 渲染的 XSS 测试：常见的绕过手法逐条渲染进页面，检查
//   · 页面上没有任何脚本被执行（alert / 自定义标记）
//   · 渲染结果里没有 script、iframe（"能动的 HTML"预览的沙箱 iframe 除外）、object、embed、form、base、meta、link、style、svg、math 元素
//   · 没有 on* 事件属性；href / src / srcset / poster / action / formaction / xlink:href 里没有 javascript:、vbscript:、data:text/html（图片允许 data:image/）
// 用法：先起服务，node scripts/test/md-xss.mjs
import { launch, newContext, SIDES } from "../parity/lib.mjs";
const V = [
  "<script>alert(1)</script>", "<SCRIPT SRC=//x.y/xss.js></SCRIPT>", "<img src=x onerror=alert(2)>", "<img src=x onerror=alert(3)", "<IMG SRC=\"jav\tascript:alert(4);\">",
  "<a href=\"javascript:alert(5)\">x</a>", "<a href=\"JaVaScRiPt:alert(6)\">x</a>", "<a href=\" javascript:alert(7)\">x</a>", "<a href=\"java\tscript:alert(8)\">x</a>", "<a href=\"java\nscript:alert(9)\">x</a>",
  "<a href=\"\u0001javascript:alert(10)\">x</a>", "<a href=\"&#106;avascript:alert(11)\">x</a>", "<a href=\"&#x6A;avascript:alert(12)\">x</a>", "<a href=\"javascript&colon;alert(13)\">x</a>", "<a href=\"jav&#x09;ascript:alert(14)\">x</a>",
  "<a href=\"&#14; javascript:alert(15)\">x</a>", "<a href=\"vbscript:msgbox(16)\">x</a>", "<a href=\"data:text/html;base64,PHNjcmlwdD5hbGVydCgxNyk8L3NjcmlwdD4=\">x</a>",
  "[x](javascript:alert(18))", "[x](JAVASCRIPT:alert(19))", "[x]( javascript:alert(20))", "[x](java%0ascript:alert(21))", "![x](javascript:alert(22))", "[x](data:text/html,<script>alert(23)</script>)",
  "<javascript:alert(24)>", "[x](http://a \"t\\\" onmouseover=\\\"alert(25)\")", "[x](<javascript:alert(26)>)", "[x](&#106;avascript:alert(27))",
  "<svg onload=alert(28)>", "<svg><script>alert(29)</script></svg>", "<math><mtext><table><mglyph><style><img src=x onerror=alert(30)>", "<iframe src=\"javascript:alert(31)\"></iframe>",
  "<object data=\"javascript:alert(32)\"></object>", "<embed src=\"javascript:alert(33)\">", "<details open ontoggle=alert(34)>x</details>", "<video><source onerror=alert(35)></video>", "<audio src=x onerror=alert(36)>",
  "<div style=\"background:url(javascript:alert(37))\">x</div>", "<div style=\"behavior:url(x.htc)\">x</div>", "<div style=\"-moz-binding:url(x)\">x</div>", "<div style=\"width:expression(alert(38))\">x</div>",
  "<a title='x\" onmouseover=\"alert(39)'>x</a>", "<img src=\"x\" alt=\"a\" onerror=\"alert(40)\"//>", "<base href=\"javascript:/\">", "<meta http-equiv=refresh content=\"0;url=javascript:alert(41)\">",
  "<form action=javascript:alert(42)><button>x</button></form>", "<button formaction=javascript:alert(43)>x</button>", "<!--<img src=\"--><img src=x onerror=alert(44)//\">", "<a href=\"//evil.example\">x</a>",
  "`<img src=x onerror=alert(45)>`", "```html\n<img src=x onerror=alert(46)>\n```", "<x onclick=alert(47)>x</x>", "<a href=x onclick=alert(48)>x</a>", "<img srcset=\"javascript:alert(49) 1x\">",
  "<video poster=javascript:alert(50)></video>", "<style>*{background:url(javascript:alert(51))}</style>", "<link rel=stylesheet href=javascript:alert(52)>", "<template><img src=x onerror=alert(53)></template>",
  "<noscript><p title=\"</noscript><img src=x onerror=alert(54)>\"></noscript>", "<textarea><img src=x onerror=alert(55)></textarea>", "<a href=\"javascript:alert(56)\" title=\"t\">*x*</a>",
  "<img src=\"data:image/svg+xml,<svg onload=alert(57)>\">", "<a href=\"data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoNTgpPg==\">x</a>", "<div onmouseover=\"alert(59)\" style=\"position:fixed;inset:0\">x</div>",
];
const browser = await launch(), ctx = await newContext(browser, { side: "cur" }), page = await ctx.newPage();
const errs = []; page.on("pageerror", (e) => errs.push(e.message));
await page.goto(SIDES.cur.url + "/tests/md-xss.html"); await page.waitForFunction(() => window.ready);
let bad = 0;
for (const [i, v] of V.entries()) {
  const r = await page.evaluate(async (md) => {
    const el = window.render(md); await new Promise((ok) => setTimeout(ok, 30));
    const probs = [];
    for (const n of el.querySelectorAll("*")) {
      const tag = n.tagName.toLowerCase();
      // Satin 自己画的图标（svg.sn-ic，比如"图片没加载出来"的提示）不算
      if (["script", "object", "embed", "form", "base", "meta", "link", "style", "svg", "math", "template", "noscript"].includes(tag) && !n.closest("svg.sn-ic, .sn-md-img-bad")) probs.push("元素 " + tag);
      if (tag === "iframe" && !(n.getAttribute("sandbox") === "allow-scripts" && n.hasAttribute("srcdoc"))) probs.push("iframe 不是沙箱预览");
      for (const a of n.attributes) {
        if (/^on/i.test(a.name)) probs.push("事件属性 " + a.name);
        // 按浏览器的规则归一以后，开头是危险协议才算（相对地址里夹着 "javascript:" 字样不会执行）
        if (/^(href|src|srcset|poster|action|formaction|xlink:href|data)$/i.test(a.name)) { const v = a.value.replace(/^[\u0000-\u0020]+/, "").replace(/[\t\n\r]/g, "").toLowerCase(); if (/^(javascript|vbscript):|^data:(?!image\/)/.test(v) || (a.name === "srcset" && /(^|,)\s*(javascript|vbscript):/.test(v))) probs.push(`${a.name}=${a.value.slice(0, 40)}`); }
      }
      // 链接真的点下去（javascript: 才会执行）：读 href 解析后的协议
      if (tag === "a" && n.href && /^(javascript|vbscript):/i.test(new URL(n.href, location.href).protocol)) probs.push("链接协议 " + n.href.slice(0, 30));
    }
    return { probs, html: el.innerHTML.slice(0, 200) };
  }, v);
  const fired = await page.evaluate(() => window.__xss.splice(0));
  const fail = r.probs.length || fired.length;
  if (fail) { bad++; console.log(`✗ #${i} ${JSON.stringify(v).slice(0, 70)} → ${[...r.probs, ...fired].join("；")}\n     ${r.html}`); }
}
// 等一会儿：延迟执行的（onerror、onload、meta 刷新）也算
await page.waitForTimeout(800); const late = await page.evaluate(() => window.__xss); if (late.length) { bad++; console.log("✗ 延迟执行：", late); }
await browser.close();
console.log(`Markdown XSS：${V.length} 条向量，${bad ? bad + " 条没拦住" : "全部拦住"}${errs.length ? "；页面报错 " + errs.length : ""}`);
process.exitCode = bad ? 1 : 0;
