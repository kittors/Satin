# 间距 · Spacing

> 组件 id：`spacing`　分组：基础

16 以下每 2px 一档，只在控件内部用（图标和字之间、控件内边距）；再往上逐级放大，用在组件之间、区块之间。越相关越近：组和组之间至少是组内的两倍。页面和组件只写语义令牌（--gap-*、--pad-*），换密度时它们一起换档。

## 验收要点

- 只用刻度上的值。不在刻度上的（给图标让位的内边距、负外边距居中、字的视觉居中）要在那一行写清原因（/* sp-ok: … */）；node scripts/lint-spacing.mjs 检查全部样式。
- 越相关越近：组和组之间至少是组内的两倍（8 和 16、12 和 24）；标题离它下面的内容比离上面的近。
- 控件内部用 2～14；组件之间从 8 起；区块之间 24 起。
- 语义令牌（标准密度）：--gap-tight 4、--gap-inline 8、--gap-stack 12、--gap-group 16、--gap-section 32；--pad-card 16、--pad-panel 24、--pad-page 32。
- 三档密度：紧凑（表格、后台、工具）、标准（默认）、宽松（阅读、欢迎页）。容器上写 data-density，里面的语义令牌一起换档，刻度不变。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 越相关越近

```html
<div>
<figure class="sn-bad"><div><b>通知</b><span>新评论</span><span>生成完成</span><b>隐私</b><span>公开主页</span><span>允许搜索到我</span></div><figcaption class="sn-c-danger">都是 16：看不出哪几行是一组</figcaption></figure>
<figure><div><div><b>通知</b><span>新评论</span><span>生成完成</span></div><div><b>隐私</b><span>公开主页</span><span>允许搜索到我</span></div></div><figcaption>组内 8、组和组之间 24：一眼分成两组</figcaption></figure>
</div>
```

### 实例与标注

```html
<div><span class="sn-cap">密度</span><div class="sn-seg sn-sm" data-seg="spdensity"><span class="sn-thumb"></span><button data-v="compact">紧凑</button><button data-v="default">标准</button><button data-v="comfortable">宽松</button></div>
<label class="sn-check" data-c=""><input type="checkbox" data-sp-show="" checked>显示间距标注（绿：内边距，紫：间隙）</label></div>
<div id="spStage" data-density="default">
<article data-sp-pad="" data-sp-gap=""><div></div><div data-sp-gap=""><b>雨夜车站</b><span>第三集 · 48 个镜头 · 3 分钟前改过</span></div><div data-sp-gap=""><span class="sn-tag">电影感</span><span class="sn-tag">16:9</span><span class="sn-tag">林夏</span></div><div data-sp-gap=""><button class="sn-btn sn-secondary sn-sm">预览</button><button class="sn-btn sn-primary sn-sm">继续编辑</button></div></article>
<section data-sp-pad="" data-sp-gap=""><div data-sp-gap=""><b>导出</b><div><span>分辨率</span><span>1080p</span></div><div><span>帧率</span><span>24</span></div></div><div data-sp-gap=""><b>字幕</b><div><span>语言</span><span>中英双语</span></div><div><span>位置</span><span>底部居中</span></div></div></section>
<div aria-hidden="true"></div>
</div>
```

### 控件内边距

```html
<div data-sa="x"><table><thead><tr><th>尺寸</th><th>高度</th><th>左右内边距</th><th>胶囊形</th><th>图标和字</th><th>用在哪里</th></tr></thead><tbody>
<tr><td>sm</td><td class="sn-num">28</td><td class="sn-num">10</td><td class="sn-num">12</td><td class="sn-num">6</td><td>表格里、工具条、紧凑的筛选</td></tr>
<tr><td>md</td><td class="sn-num">32</td><td class="sn-num">12</td><td class="sn-num">14</td><td class="sn-num">8</td><td>默认</td></tr>
<tr><td>lg</td><td class="sn-num">36～40</td><td class="sn-num">16</td><td class="sn-num">16</td><td class="sn-num">8</td><td>主要表单、主要按钮</td></tr>
</tbody></table></div>
```

## 规则

- 只用刻度上的值。不在刻度上的（给图标让位的内边距、负外边距居中、字的视觉居中）要在那一行写清原因（`/* sp-ok: … */`）；`node scripts/lint-spacing.mjs` 检查全部样式。
- 越相关越近：组和组之间至少是组内的两倍（8 和 16、12 和 24）；标题离它下面的内容比离上面的近。
- 控件内部用 2～14；组件之间从 8 起；区块之间 24 起。
- 语义令牌（标准密度）：`--gap-tight` 4、`--gap-inline` 8、`--gap-stack` 12、`--gap-group` 16、`--gap-section` 32；`--pad-card` 16、`--pad-panel` 24、`--pad-page` 32。
- 三档密度：紧凑（表格、后台、工具）、标准（默认）、宽松（阅读、欢迎页）。容器上写 `data-density`，里面的语义令牌一起换档，刻度不变。

