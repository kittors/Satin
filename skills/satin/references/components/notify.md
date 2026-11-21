# 通知 · Notification

> 组件 id：`notify`　分组：反馈

不是用户刚才的操作引起的：后台任务完成或失败、额度、更新、审核。显示在右上角，直到用户处理或关闭；铃铛和窗口标题都显示数量，铃铛里能找回全部。新的一条从上方落到旧的上面，旧的后退、每层露出 12px，最多 3 层；指针移上去就展开成列表。

## 验收要点

- 宽 360，圆角 12；标题 13/600，正文 13，时间 12。操作按钮在右下角，主按钮放最后，最多两个。
- 落下 560ms ease.open；关掉一条时，下面的补上来。
- 客户端来源：生成完成或失败、导出完成、额度不足、版本更新、公告；后台：待审核、举报、系统告警、导出完成。

## 写法

### notify(选项)

| 选项 | 说明 |
|---|---|
| icon / tone | lucide 图标名 / "ok" \| "bad" \| "warn" \| "" |
| title / body / time | 标题、正文（文件名不拆开）、时间（默认现在） |
| actions | [{ label, variant, run(card) }]：按钮；没写 run 就是关闭 |

### 返回值和其他

| 名称 | 说明 |
|---|---|
| close() | 关掉这一条 |
| notify 事件 | 每来一条在 document 上发，detail 是传进来的选项 |
| .sn-notifs | 容器（没有就自己建），里面的 [data-clear-all] 全部清除 |

## 用法

```js
import { notify, toast } from "satin-ui/components";

// 卡片在右上角叠起来：后面的底边露出 12px、最多 3 层；指针移上去展开成列表；可以一键全部清除
const NOTES = [
  { icon: "circle-check", tone: "ok", title: "第三集生成完成", body: "12 个镜头都生成好了，可以开始剪辑。", actions: [{ label: "查看", variant: "secondary", run: (card) => { toast({ text: "打开第三集" }); card.close(); } }] },
  { icon: "circle-x", tone: "bad", title: "镜头 11 没有生成", body: "画面描述里有不允许的内容，改一下再试。" },
  { icon: "user-plus", tone: "", title: "周屿加入了项目", body: "可以编辑分镜和配音。" },
];
let i = 0;
for (const b of document.querySelectorAll("[data-notify]")) b.addEventListener("click", () => notify(NOTES[i++ % NOTES.length]));
// 每来一条都会在 document 上发 notify 事件，铃铛这类地方可以跟着记未读：document.addEventListener("notify", (e) => …)
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row">
<button class="sn-btn sn-secondary" data-notify="" data-i="bell-ring:before">来一条通知</button>
<span class="sn-note">连点几次看堆叠；把指针移到右上角的通知上看展开，悬停时左上角出现关闭</span>
<span style="flex:1"></span>
<button class="sn-btn sn-ghost sn-ibtn" id="bellBtn" data-pop="pop-bell" data-tip="通知" data-i="bell"></button>
</div>
```

## 规则

- 宽 360，圆角 12；标题 13/600，正文 13，时间 12。操作按钮在右下角，主按钮放最后，最多两个。
- 落下 560ms `ease.open`；关掉一条时，下面的补上来。
- 客户端来源：生成完成或失败、导出完成、额度不足、版本更新、公告；后台：待审核、举报、系统告警、导出完成。

