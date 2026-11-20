# 复选、单选、开关 · Checkbox · Radio · Switch

> 组件 id：`choice`　分组：表单

勾选时对勾一笔画出来并轻轻弹一下；单选的内点弹出；开关的圆钮弹到另一边，按住时圆钮横向拉长。都能用 Tab 聚焦、空格切换。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-cols" style="--sn-min:200px;align-items:start;gap:24px">
<div class="sn-stack" style="gap:10px">
<label class="sn-check"><input type="checkbox" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>自动保存草稿</label>
<label class="sn-check"><input type="checkbox"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>生成完成后提醒我</label>
<label class="sn-check"><input type="checkbox" data-indeterminate=""><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>全选（部分选中）</label>
<label class="sn-check"><input type="checkbox" disabled><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>不可用</label>
</div>
<div class="sn-stack" style="gap:10px" role="radiogroup">
<label class="sn-radio"><input type="radio" name="q" checked><span class="sn-box"></span>标准画质</label>
<label class="sn-radio"><input type="radio" name="q"><span class="sn-box"></span>高画质</label>
<label class="sn-radio"><input type="radio" name="q"><span class="sn-box"></span>最高画质（更慢）</label>
<label class="sn-radio"><input type="radio" name="q" disabled><span class="sn-box"></span>不可用</label>
</div>
<div class="sn-stack" style="gap:12px">
<label class="sn-switch"><input type="checkbox" checked><span class="sn-track"><span class="sn-knob"></span></span>跟随系统外观</label>
<label class="sn-switch"><input type="checkbox"><span class="sn-track"><span class="sn-knob"></span></span>启动时打开上次的项目</label>
<label class="sn-switch"><input type="checkbox" disabled><span class="sn-track"><span class="sn-knob"></span></span>不可用</label>
</div>
</div>
```

