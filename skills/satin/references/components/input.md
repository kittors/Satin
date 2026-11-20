# 输入框 · TextField

> 组件 id：`input`　分组：表单

四种高度：28 用在表格和工具条，32 默认，36 用在主要表单，40 只用在登录和欢迎页。聚焦时边框加深，外加 3px 的柔环。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 状态

```html
<div class="sn-cols" style="--sn-min:200px;gap:20px 20px;align-items:start" id="inputStates"></div>
```

### 尺寸

```html
<div class="sn-cols" style="--sn-min:150px;gap:16px">
<div class="sn-field"><span class="sn-cap">sm 28</span><input class="sn-input sn-sm" placeholder="表格、工具条"></div>
<div class="sn-field"><span class="sn-cap">md 32（默认）</span><input class="sn-input" placeholder="大多数地方"></div>
<div class="sn-field"><span class="sn-cap">lg 36</span><input class="sn-input sn-lg" placeholder="主要表单"></div>
<div class="sn-field"><span class="sn-cap">xl 40</span><input class="sn-input sn-xl" placeholder="登录、欢迎页"></div>
</div>
```

### 前缀、后缀、清除

```html
<div class="sn-cols" style="--sn-min:200px;gap:16px">
<span class="sn-ib sn-has-pre"><span class="sn-pre" data-i="mail"></span><input class="sn-input" placeholder="带前缀图标"></span>
<span class="sn-ib sn-has-post"><input class="sn-input sn-num" value="1080" aria-label="高度"><span class="sn-post"><span class="sn-unit">px</span></span></span>
<span class="sn-ib sn-has-post sn-filled" data-clearable=""><input class="sn-input" value="输入后右侧出现清除"><span class="sn-post"><button class="sn-clear" aria-label="清除" data-i="x"></button></span></span>
</div>
```

