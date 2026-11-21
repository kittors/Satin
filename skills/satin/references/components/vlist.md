# 无限列表 · VirtualList · InfiniteList

> 组件 id：`vlist`　分组：数据展示

一万条也不卡：只渲染看得见的几十行，行节点循环复用，滚动时只改位置。滚到离底部 400px 时自动加载下一页，底部先出骨架行（300ms 内回来就不出）；加载失败那一行变成"重试"；全部加载完显示"已经到底了"。往下滚过一屏后，右下角浮出"回到顶部"。

## 验收要点

- 行高固定（56）时直接按下标算位置；行高不定的列表（聊天）用逐条 content-visibility: auto，让浏览器跳过视口外的渲染。
- 每次只追加一页（60 条），不一次性拉全部；加载中再滚到底不会重复请求。

## 写法

### createInfiniteList(容器, 选项)

| 选项 | 说明 |
|---|---|
| loadPage | (offset, size) => Promise：要一页；失败（reject）末尾出“重试” |
| renderRow | (行元素, 数据, 下标)：画一行；行元素复用，子元素缓存在 el._d 上（换成骨架行时会清掉） |
| rowHeight / total / pageSize | 行高（固定）/ 总数 / 每页几条 |
| onCount | (已加载) => {}；同时在容器上冒泡 sn-count |
| 返回 | 实例：reload()、scrollTop()、count，以及 update / destroy / on |

## 用法

```js
import { createInfiniteList } from "satin-ui/components";

// 行高固定：只画看得见的几十行，一万条照样流畅；滚到离底部 400px 自动要下一页（勾上"模拟加载失败"看失败后的重试）
const vl = document.querySelector("#vl"), countEl = document.querySelector("#vlCount"), topBtn = document.querySelector("[data-vl-top]"), failBox = document.querySelector("#vlFail");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const list = createInfiniteList(vl, {
  total: 10000, pageSize: 400, rowHeight: 56,
  // 换成你的接口：返回这一页的数据数组
  loadPage: async (offset, size) => { await wait(offset === 0 ? 200 : 500 + Math.random() * 700); if (failBox.checked && offset > 0) throw new Error("加载失败"); return Array.from({ length: size }, (_, k) => offset + k); },
  // 行元素会复用：子元素缓存在 el._d 上，每次只改文字
  renderRow: (el, i) => {
    if (!el._d) { el.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span><span class="sn-no"></span>'; el._d = { b: el.querySelector("b"), m: el.querySelector(".sn-tx span"), no: el.children[2] }; }
    el._d.b.textContent = `镜头 ${i + 1}`; el._d.m.textContent = `第 ${Math.floor(i / 40) + 1} 集 · ${3 + (i % 6)} 秒`; el._d.no.textContent = String(i + 1);
  },
  onCount: (n, total) => { countEl.textContent = n >= total ? `已全部加载 · ${n.toLocaleString("zh-CN")} 条` : `已加载 ${n.toLocaleString("zh-CN")} 条 · 共 ${total.toLocaleString("zh-CN")} 条`; },
});
vl.addEventListener("vlscroll", (e) => topBtn.classList.toggle("sn-on", e.detail.top > vl.clientHeight));
topBtn.addEventListener("click", () => list.scrollTop());
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row sn-vl-head"><span class="sn-t-callout" id="vlCount">已加载 0 条</span><span style="flex:1"></span><label class="sn-check" data-c=""><input type="checkbox" id="vlFail">下一页模拟加载失败</label><button class="sn-btn sn-secondary sn-sm" data-vl-reset="">重新开始</button></div>
<div class="sn-vl-wrap"><div class="sn-vl" id="vl"><div class="sn-vl-space"></div></div><button class="sn-btn sn-secondary sn-sm sn-vl-top" data-vl-top="" data-i="arrow-up:before">回到顶部</button></div>
```

## 规则

- 行高固定（56）时直接按下标算位置；行高不定的列表（聊天）用逐条 `content-visibility: auto`，让浏览器跳过视口外的渲染。
- 每次只追加一页（60 条），不一次性拉全部；加载中再滚到底不会重复请求。

