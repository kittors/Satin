# 交互质感 · Interaction feel

> 组件 id：`feel`　分组：基础

把悬停按压、半路打断、4px 起拖与乐观回退放进四个可动手试的真实交互，直接感受手感差异。

## 验收要点

- 按钮按压缩至 97%（100ms），列表行只叠底色不缩放；键盘聚焦仅在 `:focus-visible` 显示 2px 焦点环。
- 连续切换目标时从此刻实时坐标接续过渡，绝不跳回起点或排队等待。
- 拖拽满 4px 才浮起并实时补位，按 Esc 原路取消；乐观操作保存失败时左右轻抖两下并恢复原状。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div id="feelLab">
<div>
<div><b>悬停与按下</b><span data-fl-press-stat="">按钮 97% · 行不缩放</span></div>
<div>
<div>
<button type="button" class="sn-btn sn-primary sn-sm" data-fl-primary="">保存修改</button>
<button type="button" class="sn-btn sn-secondary sn-sm">另存副本</button>
</div>
<button type="button" data-fl-row="" aria-pressed="false">
<b>第三集 · 雨夜车站</b>
<span class="sn-num">12 个镜头</span>
</button>
</div>
</div>
<div>
<div><b>中途打断</b><span data-fl-int-stat="">快速连点体验折返</span></div>
<div>
<div role="tablist" aria-label="视图切换">
<span data-fl-thumb="" aria-hidden="true"></span>
<button type="button" role="tab" data-fl-tab="0" aria-selected="true" class="sn-on">分镜</button>
<button type="button" role="tab" data-fl-tab="1" aria-selected="false">时间线</button>
<button type="button" role="tab" data-fl-tab="2" aria-selected="false">调色</button>
<button type="button" role="tab" data-fl-tab="3" aria-selected="false">混音</button>
</div>
<div data-fl-track="" aria-hidden="true">
<span data-fl-puck=""></span>
</div>
</div>
</div>
<div>
<div><b>拖拽重排</b><span data-fl-drag-stat="">拖过 4px 浮起 · Esc 取消</span></div>
<div>
<div class="sn-drag-list" data-fl-drag=""></div>
</div>
</div>
<div>
<div><b>乐观更新</b><span data-fl-opt-stat="">先响应再保存</span></div>
<div>
<div class="sn-opt-row" data-fl-opt-row="">
<span class="sn-nm">雨夜车站 · 精选场次</span>
<button type="button" class="sn-btn sn-secondary sn-sm" data-fl-star="" aria-pressed="false">
<span data-i="star"></span>
<span class="sn-num" data-fl-num="">18</span>
</button>
</div>
<label class="sn-check" data-c=""><input type="checkbox" data-fl-fail="">模拟保存失败（抖动并回退）</label>
</div>
</div>
</div>
```

## 规则

- 按钮按压缩至 97%（100ms），列表行只叠底色不缩放；键盘聚焦仅在 `:focus-visible` 显示 2px 焦点环。
- 连续切换目标时从此刻实时坐标接续过渡，绝不跳回起点或排队等待。
- 拖拽满 4px 才浮起并实时补位，按 Esc 原路取消；乐观操作保存失败时左右轻抖两下并恢复原状。

