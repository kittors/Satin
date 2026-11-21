# 轻提示 · Toast

> 组件 id：`toast`　分组：反馈

只回应用户刚做的事。三种：状态（确认结果，3 秒消失）、操作（能撤销的事直接做，给 5 秒撤销，一圈倒计时）、进度（先显示进度，完成后原地变成结果）。进入时下落 10px、从模糊变清晰；悬停或聚焦时暂停计时。

## 验收要点

- 和 Tooltip 同一种反色底，一眼能和页面内容分开；最多同时 3 条，新的在最靠边的位置，旧的让开。
- 离开 200ms ease.in；光泽只在"完成"的那一刻扫过一次。
- 不用 Toast 的情况：必须修好的问题（失败留在条目上）、不可撤销的操作（事前确认）、不是刚才的操作引起的（用通知）。

## 写法

### toast(选项)

| 选项 | 取值 | 说明 |
|---|---|---|
| kind | "status" \| "action" \| "progress" | 状态（3 秒）/ 操作（倒计时环 + 按钮，5 秒）/ 进度（直到 update 成结果） |
| text | 文字 | 文件名会自动包起来，不被拆开 |
| icon / tone | lucide 图标名 / "ok" \| "info" \| "danger" | 状态类默认对勾 |
| action | { label, run(t) } | 按钮 |
| progress | 0 ~ 1 | 进度 |
| duration | 毫秒 | 多久收起（悬停、聚焦时暂停计时） |
| alert | true | 读屏立即播报（失败用） |
| done | true | update 成结果时扫一道光 |

### 返回值和其他

| 名称 | 说明 |
|---|---|
| update(选项) | 原地变形：图标换、文字模糊换、宽度跟着走 |
| close() | 收起 |
| setToastPos("top" \| "bottom") | 位置（记在本机） |
| 同时最多 | 3 条，新的在最前 |

## 用法

```js
import { initSeg } from "satin-ui";
import { toast, setToastPos } from "satin-ui/components";

// 不用写标记：第一次调 toast() 时在 body 末尾建一个 .sn-toasts 容器。这里四个按钮各演示一种
const exportToast = (name) => {
  const t = toast({ kind: "progress", text: `正在导出 ${name}` }); let p = 0;
  const iv = setInterval(() => { // 换成你的导出进度
    p = Math.min(1, p + 0.06 + Math.random() * 0.05); t.update({ progress: p });
    if (p >= 1) { clearInterval(iv); setTimeout(() => t.update({ kind: "status", text: '已导出到"下载"', action: { label: "打开", run: (x) => x.close() }, duration: 5000, done: true }), 260); }
  }, 200);
};
const DEMO = {
  status: () => toast({ text: "链接已复制" }), // 对勾 + 一句话，3 秒后自己收起
  action: () => toast({ kind: "action", text: '已归档"雨夜车站"', action: { label: "撤销", run: (t) => t.update({ kind: "status", text: '已恢复"雨夜车站"', done: true, duration: 2000 }) } }), // 倒计时环 + 按钮
  progress: () => exportToast("第三集.mp4"), // 进度环 + 百分比，直到 update 成结果
  fail: () => toast({ icon: "circle-x", tone: "danger", text: "复制失败，请再试一次", alert: true }), // 读屏立即播报
};
for (const [kind, show] of Object.entries(DEMO)) document.querySelector(`[data-toast="${kind}"]`)?.addEventListener("click", show);
// 位置：后台放顶部居中（默认），客户端放底部居中
const pos = document.querySelector('[data-seg="toastpos"]');
if (pos) initSeg(pos, (v) => setToastPos(v));
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-cols">
<span class="sn-cap">位置</span>
<div class="sn-row"><div class="sn-seg sn-sm" data-seg="toastpos"><span class="sn-thumb"></span><button data-v="top">后台：顶部居中</button><button data-v="bottom">客户端：底部居中</button></div></div>
<span class="sn-cap">三种</span>
<div class="sn-row">
<button class="sn-btn sn-secondary" data-toast="status" data-i="link:before">复制链接</button>
<button class="sn-btn sn-secondary" data-toast="action" data-i="archive:before">归档项目</button>
<button class="sn-btn sn-secondary" data-toast="progress" data-i="download:before">导出第三集</button>
<button class="sn-btn sn-secondary" data-toast="fail">模拟复制失败</button>
</div>
</div>
```

## 规则

- 和 Tooltip 同一种反色底，一眼能和页面内容分开；最多同时 3 条，新的在最靠边的位置，旧的让开。
- 离开 200ms `ease.in`；光泽只在"完成"的那一刻扫过一次。
- 不用 Toast 的情况：必须修好的问题（失败留在条目上）、不可撤销的操作（事前确认）、不是刚才的操作引起的（用通知）。

