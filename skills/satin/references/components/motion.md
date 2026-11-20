# 动效曲线 · 09 号 §1

> 组件 id：`motion`　分组：基础

全系统只有这几条曲线。先看动效类型再选：进入先快后慢，离开先慢后快，换位两端慢中间快。点一下每张卡片看它怎么动。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 时长

```html
<div class="sn-cols" style="grid-template-columns:minmax(0,160px) minmax(0,160px) 1fr" id="durations"></div>
```

