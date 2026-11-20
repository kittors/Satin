# 字数统计 · Counter · LongText

> 组件 id：`count`　分组：表单

单行：聚焦或有内容时，右边淡入"已写/上限"，数字滚动变化；写到 90% 变成提醒色，写满再敲时计数抖一下。长文本：输入框随内容平滑长高，到上限高度后在里面滚动，上下边缘渐隐；右下角一圈用量环，快满时显示"还剩几字"，超出时整个框变红、显示"超出几字"。

## 验收要点

- 按"字"计数（字形簇），不按字节；上限写在计数里，不藏在帮助文字中。
- 单行用 maxlength 硬上限；长文本允许先写超，超出的部分不能保存，计数变红提示删减。
- 高度变化 140ms ease.out；超过 7 行在框内滚动，不把页面撑长。

## 写法

### 函数

| 名称 | 说明 |
|---|---|
| createCount(input[data-count]) | 单行计数，maxlength 是上限 |
| createLongText([data-ta], { onSubmit }) | 自动长高 + 量环计数（data-max）；⌘↵ 提交 |
| bindInputs(root) | 按标记一次接上（data-count / data-ta / data-pw / data-email / data-tagin / data-stepper / data-composer） |

## 用法

```js
import { createCount, createLongText, bindInputs } from "satin-ui/components";

// 单行：<input maxlength="20" data-count>，右边的计数跟着滚动，快满变色，写满还在敲时抖一下
createCount(document.querySelector("input[data-count]"));

// 长文本：<div data-ta data-max="200">…<textarea>…</div>
// 自动长高 + 量环计数；快满"还剩 N 字"，超出"超出 N 字"并整框变红；⌘↵ 提交
createLongText(document.querySelector("[data-ta]"), { onSubmit: (text) => save(text) });

// 或者按标记一次接上页面上所有的
bindInputs(document);
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-cols" style="--sn-min:260px;gap:24px;align-items:start">
<div class="sn-stack" style="gap:18px">
<div class="sn-field"><label class="sn-lbl" for="c-title">镜头标题</label>
<span class="sn-ib sn-has-post sn-has-count"><input class="sn-input sn-lg" id="c-title" maxlength="20" placeholder="一句话说清这个镜头" data-count=""><span class="sn-post"><span class="sn-counter"><span class="sn-roll"><span>0</span></span><span>/20</span></span></span></span></div>
<div class="sn-field"><label class="sn-lbl" for="c-name">角色名</label>
<span class="sn-ib sn-has-post sn-has-count"><input class="sn-input" id="c-name" maxlength="8" value="林夏" data-count=""><span class="sn-post"><span class="sn-counter"><span class="sn-roll"><span>0</span></span><span>/8</span></span></span></span></div>
</div>
<div class="sn-field"><label class="sn-lbl" for="c-desc">画面描述</label>
<div class="sn-box-in" data-ta="" data-max="120" data-max-lines="7">
<textarea id="c-desc" rows="3" placeholder="写清楚人物、动作和光线，生成会更准。可以一直往下写，框会跟着长高。"></textarea>
<div class="sn-ta-foot"><span class="sn-hint">⇧↵ 换行 · ⌘↵ 保存</span><span class="sn-ta-count"><svg class="sn-uring" viewBox="0 0 16 16"><circle class="sn-bg" cx="8" cy="8" r="6" /><circle class="sn-fg" cx="8" cy="8" r="6" /></svg><span class="sn-txt"><span class="sn-roll"><span>0</span></span> / 120</span></span></div>
</div>
<div class="sn-help">中文、英文、标点都按一个字算；表情按一个字算。</div></div>
</div>
```

## 规则

- 按"字"计数（字形簇），不按字节；上限写在计数里，不藏在帮助文字中。
- 单行用 maxlength 硬上限；长文本允许先写超，超出的部分不能保存，计数变红提示删减。
- 高度变化 140ms `ease.out`；超过 7 行在框内滚动，不把页面撑长。

