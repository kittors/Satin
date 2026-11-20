# 文字链接与文字按钮 · Link · TextButton

> 组件 id：`link`　分组：按钮

放在句子里的是链接：一条淡下划线，悬停时变实。独立的纯文字操作是文字按钮：平时只有文字，悬停时出现一层底色，按下再深一档并缩一下；带箭头的悬停时箭头右移 2px。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<p class="sn-t-body">登录即表示你同意<a class="sn-link" href="#link">用户协议</a>和<a class="sn-link" href="#link">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
<div class="sn-row" style="gap:28px"><button class="sn-textbtn">查看全部项目<span data-i="arrow-right:after"></span></button><button class="sn-textbtn">编辑</button><button class="sn-textbtn sn-quiet">忘记密码？</button><button class="sn-textbtn sn-quiet">取消</button><button class="sn-textbtn sn-danger-text">去处理<span data-i="arrow-right:after"></span></button></div>
```

