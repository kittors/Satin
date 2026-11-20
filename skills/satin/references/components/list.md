# 列表与键值 · List · Description

> 组件 id：`list`　分组：数据展示

设置页、详情页用。行高 44，左边图标、中间标题和说明、右边是值或开关；能点进去的行末尾有箭头，悬停时箭头往右挪 2px。

## 验收要点

- 键值：标签列 tertiary 色、固定宽度，值列左对齐；能复制的值旁边放复制按钮，复制后图标原地变对勾。
- 危险行（退出登录、删除账号）放最后，文字和图标用红色。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-list-grid">
<div class="sn-set-list">
<div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="user"></span><div class="sn-tx"><b>个人资料</b><span>头像、昵称、邮箱</span></div><span class="sn-end" data-i="chevron-right"></span></div>
<div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="bell"></span><div class="sn-tx"><b>生成完成时提醒</b><span>在桌面右上角显示通知</span></div><label class="sn-switch"><input type="checkbox" checked><span class="sn-track"><span class="sn-knob"></span></span></label></div>
<div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="layout-grid"></span><div class="sn-tx"><b>默认画面比例</b></div><span class="sn-val">16:9</span><span class="sn-end" data-i="chevron-right"></span></div>
<div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="key-round"></span><div class="sn-tx"><b>修改密码</b></div><span class="sn-end" data-i="chevron-right"></span></div>
<div class="sn-set-row sn-danger" tabindex="0"><span class="sn-ico" data-i="log-out"></span><div class="sn-tx"><b>退出登录</b></div></div>
</div>
<dl class="sn-kv">
<dt>项目</dt><dd>雨夜车站</dd>
<dt>负责人</dt><dd><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</dd>
<dt>状态</dt><dd><span class="sn-tag sn-ok"><i></i>已完成</span></dd>
<dt>镜头</dt><dd class="sn-num">48 个 · 12 分 36 秒</dd>
<dt>项目 ID</dt><dd><code class="k">project_7f3k2q</code><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-copy="" data-tip="复制"><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button></dd>
<dt>创建时间</dt><dd class="sn-num">2026-11-02 14:20</dd>
</dl>
</div>
```

## 规则

- 键值：标签列 tertiary 色、固定宽度，值列左对齐；能复制的值旁边放复制按钮，复制后图标原地变对勾。
- 危险行（退出登录、删除账号）放最后，文字和图标用红色。

