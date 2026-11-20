# 滑块 · Slider

> 组件 id：`slider`　分组：表单

悬停时圆钮放大，拖动时再放大一点，并在上方显示数值。方向键每次走一格，按住 Shift 走十格。

## 写法

### createSlider(元素, 选项)

| 写法 / 事件 | 说明 |
|---|---|
| value / max / label | 空容器按它渲染；已有标记时写成 aria-valuenow / data-max |
| onChange | (value) => {}：拖动、点轨道、方向键改值时调（元素上同时发 slide、sn-change 事件） |
| 返回 value / update({ value }) | 当前值 / 从外面改值 |

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="gap:40px">
<div class="sn-field"><span class="sn-lbl">画面强度</span><div class="sn-slider" data-slider="" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52"><span class="sn-rail"></span><span class="sn-fillbar"></span><span class="sn-knob"></span><span class="sn-bubble"></span></div></div>
<div class="sn-field"><span class="sn-lbl">镜头时长（秒）</span><div class="sn-slider" data-slider="" data-max="12" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="12" aria-valuenow="4"><span class="sn-rail"></span><span class="sn-fillbar"></span><span class="sn-knob"></span><span class="sn-bubble"></span></div></div>
</div>
```

