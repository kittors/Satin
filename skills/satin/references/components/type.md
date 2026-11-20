# 排版 · Text

> 组件 id：`type`　分组：基础

Text 组件 = 层级 × 色调。页面不直接写字号字重，只选层级和色调。一页最多四级字号，字重只用 400、500、600。

## 验收要点

- 计数、价格、时间、表格里的数字一律等宽，变化时不会左右跳。
- 文字被截断时，悬停显示全文；没被截断就不显示提示。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 色调

```html
<div class="sn-row" id="tones"></div>
```

### 数字与截断

```html
<div class="sn-cols" style="--lc:120px">
<span class="sn-cap">比例数字</span><span class="sn-t-title2">1,111 · 8,888 · 2,017</span>
<span class="sn-cap">等宽数字</span><span class="sn-t-title2 sn-num">1,111 · 8,888 · 2,017</span>
<span class="sn-cap">截断 · 悬停看全文</span><span class="sn-t-callout sn-truncate" style="max-width:280px" data-tip-full="">第三集 · 雨夜的车站：主角在末班车开走之后，才发现手里的信封是空的</span>
</div>
```

## 规则

- 计数、价格、时间、表格里的数字一律等宽，变化时不会左右跳。
- 文字被截断时，悬停显示全文；没被截断就不显示提示。

