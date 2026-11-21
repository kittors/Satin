# 标签页、面包屑、分页、步骤 · Tabs · Breadcrumb · Pagination · Steps

> 组件 id：`tabs`　分组：导航

标签页的下划线和分页的当前页，都是前缘先走、后缘跟上（和分段控件同一套）；新内容从所选标签那一侧滑进来。

## 写法

### 函数

| 名称 | 说明 |
|---|---|
| createTabs(.sn-tabs, { tabs, value, onChange(i) }) | 空容器按 tabs（[{ label, badge, content 或 html }]）渲染；实例上有 select(i)、value |
| createPager(.sn-pager, { total, page, count, onChange(p) }) | 实例上有 go(p)、page |
| stepsHTML({ steps, current }) | 步骤条的标记 |
| setStep(.sn-steps, i) | 第 i 步是当前，前面的都完成 |

## 用法

```js
import { createTabs, createPager, setStep } from "satin-ui/components";

// 标签页：下划线前缘先走、后缘跟上；新内容从所选标签那一侧滑进来；← → 切换
createTabs(document.querySelector(".sn-tabs"), { onChange: (i) => console.log("切到第", i + 1, "个标签") });

// 分页：当前页的底色滑到新页码；页码多时中间用省略（onChange 里换成你的取数）
createPager(document.querySelector(".sn-pager"), { total: 13, onChange: (p) => console.log("第", p, "页") });

// 步骤：第 i 步是当前，前面的都完成
const steps = document.querySelector(".sn-steps"), max = steps.querySelectorAll(".sn-st").length - 1;
let cur = 1;
for (const b of document.querySelectorAll("[data-step]")) b.addEventListener("click", () => { cur = Math.max(0, Math.min(max, cur + Number(b.dataset.step))); setStep(steps, cur); });
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-tabs" id="tabsDemo"><div class="sn-tab-list" role="tablist"><button class="sn-on" role="tab">概览</button><button role="tab">镜头 <span class="sn-badge sn-soft">48</span></button><button role="tab">配音</button><button role="tab">导出记录</button><button role="tab">设置</button><span class="sn-ink"></span></div>
<div class="sn-tab-panels"><div class="sn-tab-panel">项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。</div><div class="sn-tab-panel" hidden>镜头列表：按集分组，可以拖动排序。</div><div class="sn-tab-panel" hidden>配音：林夏、周屿两个角色，6 段。</div><div class="sn-tab-panel" hidden>导出记录：最近一次导出是第三集，1080p。</div><div class="sn-tab-panel" hidden>项目设置：画面比例、默认景别、协作者。</div></div></div>
<nav class="sn-crumbs" aria-label="位置"><a data-i="house:before">全部项目</a><span data-i="chevron-right"></span><a>雨夜车站</a><span data-i="chevron-right"></span><a>第三集</a><span data-i="chevron-right"></span><b>分镜</b></nav>
<div class="sn-pager" id="pager"><span class="sn-total">共 128 条</span><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-pg="prev" aria-label="上一页" data-i="chevron-left"></button><div class="sn-pages"></div><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-pg="next" aria-label="下一页" data-i="chevron-right"></button></div>
<div class="sn-stack" style="gap:14px"><div class="sn-steps" id="steps"><span class="sn-st sn-done"><span class="sn-n">1</span>导入原文</span><span class="sn-ln sn-done"><i></i></span><span class="sn-st sn-cur"><span class="sn-n">2</span>拆分章节</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">3</span>生成分镜</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">4</span>导出成片</span></div>
<div class="sn-row"><button class="sn-btn sn-secondary sn-sm" data-step="-1">上一步</button><button class="sn-btn sn-primary sn-sm" data-step="1">下一步</button></div></div>
```

