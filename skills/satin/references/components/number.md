# 数字步进 · Stepper

> 组件 id：`number`　分组：表单

点加减数字滚动变化；按住会连发、越按越快；到边界时那一侧的按钮变灰，再按抖一下。在数字上左右拖动可以直接调，上下方向键也行，按住 Shift 一次走 10。

## 写法

### createStepper(容器, 选项)

| 选项 / 返回 | 说明 |
|---|---|
| onChange | (value) => {} |
| value / min / max / unit / label | 空容器按它渲染；已有标记时写成 data-value / data-min / data-max |
| 返回 value / set(v) | 现在的值 / 改值（超出范围抖一下） |

## 用法

```js
import { createStepper } from "satin-ui/components";

// <div class="sn-stepper" data-stepper data-min="1" data-max="60" data-value="4">…</div>
// 按住连发（400ms 起、越来越快，最快 50ms 一次）；在数字上左右拖每 8px 一格；方向键一格、Shift 十格
const dur = createStepper(document.querySelector("[data-stepper]"), {
  onChange: (v) => console.log("时长", v),
});
dur.set(10);
dur.value; // 10

// 不写标记也行：给一个空容器，按选项渲染
createStepper(document.querySelector("#dur"), { value: 4, min: 1, max: 60, unit: "秒", label: "镜头时长" });
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="gap:28px">
<div class="sn-field"><span class="sn-lbl">镜头时长</span><div class="sn-stepper" data-stepper="" data-min="1" data-max="60" data-value="4"><button class="sn-st-btn" data-d="-1" aria-label="减少" data-i="minus"></button><span class="sn-st-val" tabindex="0" role="spinbutton" aria-label="镜头时长"><span class="sn-roll"><span>4</span></span></span><span class="sn-st-unit">秒</span><button class="sn-st-btn" data-d="1" aria-label="增加" data-i="plus"></button></div></div>
<div class="sn-field"><span class="sn-lbl">生成数量</span><div class="sn-stepper" data-stepper="" data-min="1" data-max="4" data-value="2"><button class="sn-st-btn" data-d="-1" aria-label="减少" data-i="minus"></button><span class="sn-st-val" tabindex="0" role="spinbutton" aria-label="生成数量"><span class="sn-roll"><span>2</span></span></span><span class="sn-st-unit">张</span><button class="sn-st-btn" data-d="1" aria-label="增加" data-i="plus"></button></div></div>
</div>
```

