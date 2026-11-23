# 内容加载与过渡 · Loading & transitions

> 组件 id：`loadingmotion`　分组：基础

消灭「点一下先白屏闪空壳，几十毫秒后再硬砸进 DOM」的割裂体验。本官网文档页切换已完整实装悬停预取、180ms 原子提交宽限期、300/500ms 骨架防闪律与微位移交叉显影。

## 验收要点

- 导航悬停（`pointerenter` / `focusin`）静默预取目标元数据，在用户点击落定前完成 90% 的数据就绪。
- 路由切换设置 180ms 原子提交宽限期：数据及时到位则连同正文、右侧目录一次性提交过渡，杜绝空壳闪烁。
- 局部异步加载 300ms 内完成绝不展示转圈或骨架；一旦露出骨架至少平稳驻留 500ms，再用 `opacity` + `translateY(6px)` 平滑交叉显影。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 路由切换体验对比（点左侧目录项切换，调不同延迟感受差距）

```html
<div id="lmCompare">
<div>
<div role="tablist" aria-label="切换页面">
<button type="button" class="sn-btn sn-ghost sn-sm sn-on" data-lm-nav="button">按钮</button>
<button type="button" class="sn-btn sn-ghost sn-sm" data-lm-nav="grid">数据表格</button>
<button type="button" class="sn-btn sn-ghost sn-sm" data-lm-nav="charts">数据图表与 3D</button>
</div>
<div>
<span class="sn-cap">模拟网络</span>
<div class="sn-seg sn-sm" data-seg="lmdelay"><span class="sn-thumb"></span><button data-v="80">80ms</button><button data-v="240">240ms</button><button data-v="620">620ms</button></div>
</div>
</div>
<div>
<div>
<div><b>传统方式（清空 → 砸屏）</b><span class="sn-note" data-lm-raw-stat="">点击上方页签对比</span></div>
<div data-lm-raw=""></div>
</div>
<div>
<div><b>Satin（原子提交 + 同构骨架显影）</b><span class="sn-note" data-lm-satin-stat="">零白闪 · 平滑落定</span></div>
<div data-lm-satin=""></div>
</div>
</div>
</div>
```

### 300ms 宽限与 500ms 最小驻留实验

```html
<div id="lmGrace">
<div class="sn-row" style="gap:8px;flex-wrap:wrap">
<button type="button" class="sn-btn sn-secondary sn-sm" data-lm-run="120">快速响应（120ms · 不出骨架）</button>
<button type="button" class="sn-btn sn-secondary sn-sm" data-lm-run="420">临界耗时（420ms · 驻留满 500ms）</button>
<button type="button" class="sn-btn sn-secondary sn-sm" data-lm-run="900">慢速请求（900ms · 平滑交叉）</button>
</div>
<div>
<span data-lm-step="0">就绪</span><span data-lm-step="1">0–300ms 静默宽限</span><span data-lm-step="2">≥ 500ms 同构骨架</span><span data-lm-step="3">交叉淡入落定</span>
</div>
<div data-lm-stage=""></div>
<p class="sn-note" data-lm-log="" style="margin-top:8px">点击上方按钮模拟不同耗时下的状态流转。</p>
</div>
```

## 规则

- 导航悬停（`pointerenter` / `focusin`）静默预取目标元数据，在用户点击落定前完成 90% 的数据就绪。
- 路由切换设置 180ms 原子提交宽限期：数据及时到位则连同正文、右侧目录一次性提交过渡，杜绝空壳闪烁。
- 局部异步加载 300ms 内完成绝不展示转圈或骨架；一旦露出骨架至少平稳驻留 500ms，再用 `opacity` + `translateY(6px)` 平滑交叉显影。

