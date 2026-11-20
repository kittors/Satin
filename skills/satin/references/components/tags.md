# 标签、徽标与头像 · Tag · Badge · Avatar

> 组件 id：`tags`　分组：数据展示

标签只用中性底，靠前面的小圆点表示状态，不做大面积彩色块。头像没有照片时用名字的第一个字，底色从几种低饱和色里按名字固定取一种。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-cols">
<span class="sn-cap">状态标签</span><div class="sn-row"><span class="sn-tag"><i></i>草稿</span><span class="sn-tag sn-run"><i></i>生成中</span><span class="sn-tag sn-ok"><i></i>已完成</span><span class="sn-tag sn-warn"><i></i>待审核</span><span class="sn-tag sn-bad"><i></i>失败</span><span class="sn-tag sn-sm sn-ok"><i></i>小号</span></div>
<span class="sn-cap">数量与圆点</span><div class="sn-row" style="gap:20px"><span class="sn-badge">3</span><span class="sn-badge">99+</span><span class="sn-badge sn-soft">12</span><button class="sn-btn sn-ghost sn-ibtn" data-tip="通知" data-i="bell"><span class="sn-dot"></span></button><span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left:6px">新</span></span></div>
<span class="sn-cap">头像</span><div class="sn-row" style="gap:14px"><span class="sn-av sn-xs" style="--sn-h:210">林</span><span class="sn-av sn-sm" style="--sn-h:30">周</span><span class="sn-av" style="--sn-h:150">陈</span><span class="sn-av sn-lg" style="--sn-h:280">许</span><span class="sn-av sn-lg sn-online" style="--sn-h:340">李<i></i></span></div>
<span class="sn-cap">头像组</span><div class="sn-row"><div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默、许诺 等 7 人"><span class="sn-av sn-sm" style="--sn-h:210">林</span><span class="sn-av sn-sm" style="--sn-h:30">周</span><span class="sn-av sn-sm" style="--sn-h:150">陈</span><span class="sn-av sn-sm" style="--sn-h:280">许</span><span class="sn-av sn-sm sn-more">+3</span></div><span class="sn-note">悬停时散开，能看清每一个</span></div>
</div>
```

