# 分段控件 · Segmented

> 组件 id：`segmented`　分组：表单

滑块的左右两条边各走一条曲线：前缘先到，后缘跟上，落定时纵向轻压一下。客户端也用它做页内分页签。方向键可以切换。

## 写法

### createSegmented(元素, 选项)

| 选项 / 返回 | 说明 |
|---|---|
| items / value / size / label | 空容器按它渲染：选项（字符串或 { value, label }）、选中哪个、"sm" 小号、读屏名称 |
| onChange | (value) => {}；value 取按钮的 data-v，没写就用文字；同时冒泡 sn-change |
| 返回 value / select(v) / update({ value }) | 当前值 / 切到某一项 |
| 放不下 | 比容器宽时横着滑（左右渐隐，竖滚轮也横向滚） |

### 底层：initSeg(元素, 回调, 起始格)（satin-ui）

| 参数 / 返回 | 说明 |
|---|---|
| 回调 | (value, index, animate) => {} |
| 起始格 | 一开始选中第几格（默认 0） |
| 返回 go(n, focus, instant) | 切到第 n 格 |

### 标记

| 写法 | 说明 |
|---|---|
| .sn-seg > .sn-thumb + button… | 滑块 + 各格 |
| .sn-seg.sn-sm | 小号（高 28） |

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="gap:24px">
<div class="sn-seg" data-seg="a"><span class="sn-thumb"></span><button>验证码登录</button><button>密码登录</button></div>
<div class="sn-seg" data-seg="b"><span class="sn-thumb"></span><button>网格</button><button>列表</button><button>时间线</button></div>
<div class="sn-seg sn-sm" data-seg="c"><span class="sn-thumb"></span><button>7 天</button><button>30 天</button><button>90 天</button><button>全部</button></div>
</div>
```

