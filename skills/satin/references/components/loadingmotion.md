# 内容加载与过渡 · Loading & transitions

> 组件 id：`loadingmotion`　分组：基础

切换内容时不立刻清空画面：300ms 内返回直接原位交叉显影；超时才展示逐行对齐的同构骨架，且至少驻留 500ms 防闪，全程容器高度不变。

## 验收要点

- 导航悬停（`pointerenter` / `focusin`）静默预取目标数据，在点击落定前完成准备。
- 路由切换设置 180ms 原子提交宽限期：数据及时到位则连同正文与目录一次性提交过渡，不闪空壳。
- 局部加载 300ms 内完成不显示骨架；超过 300ms 才展示与真列表尺寸一致的同构骨架，并至少驻留 500ms，最后通过 `opacity` 与 4px 位移平滑交叉显影，外框高度始终锁定不变。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div id="lmCompare">
<div>
<div class="sn-seg sn-sm" data-seg="lmnav" role="tablist" aria-label="切换分集">
<span class="sn-thumb"></span>
<button type="button" data-v="ep3">第三集</button>
<button type="button" data-v="ep4">第四集</button>
<button type="button" data-v="ep5">第五集</button>
</div>
<div>
<span class="sn-cap">模拟延迟</span>
<div class="sn-seg sn-sm" data-seg="lmdelay" role="tablist" aria-label="模拟延迟">
<span class="sn-thumb"></span>
<button type="button" data-v="160">160ms</button>
<button type="button" data-v="420">420ms</button>
<button type="button" data-v="850">850ms</button>
</div>
</div>
</div>
<div>
<div>
<div><b>直接清空</b><span data-lm-raw-stat="">160ms</span></div>
<div data-lm-raw=""></div>
</div>
<div>
<div><b>Satin 过渡</b><span data-lm-satin-stat="">160ms</span></div>
<div data-lm-satin=""></div>
</div>
</div>
</div>
```

## 规则

- 导航悬停（`pointerenter` / `focusin`）静默预取目标数据，在点击落定前完成准备。
- 路由切换设置 180ms 原子提交宽限期：数据及时到位则连同正文与目录一次性提交过渡，不闪空壳。
- 局部加载 300ms 内完成不显示骨架；超过 300ms 才展示与真列表尺寸一致的同构骨架，并至少驻留 500ms，最后通过 `opacity` 与 4px 位移平滑交叉显影，外框高度始终锁定不变。

