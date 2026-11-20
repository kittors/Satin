# 浏览器支持

Satin 只面向现代浏览器（常青版本）。下面的最低版本由库里实际用到、而且没有替代写法的特性决定；其余新特性都做了渐进增强（不支持时退回到能用的样子，不报错）。

## 最低版本

| 浏览器 | 最低版本 | 卡在哪个特性 |
| --- | --- | --- |
| Chrome / Edge（含安卓 Chrome、WebView） | 117 | `@starting-style`（浮层出现的起始状态）、Popover API（114）、`color-mix()`（111） |
| Safari（macOS、iOS / iPadOS，含 iOS 上的所有浏览器） | 17.5 | `@starting-style`；Popover API（17） |
| Firefox | 129 | `@starting-style`；`@property`（128）、Popover API（125） |

不支持 IE、旧版 Edge（EdgeHTML）。

## 用到的特性和退路

| 特性 | 用在哪 | 不支持时 |
| --- | --- | --- |
| 滚动驱动动画（`animation-timeline: scroll()`） | 滚动区域的边缘渐隐、滚动条位置；表格滚动条 | 用 JS 跟着 scroll 事件写同样的值（`CSS.supports` 检测，`scroll.js`、`grid-bars.js`），画面一样 |
| `text-autospace` | 中英文、数字之间自动留空 | 不留空，不影响排版 |
| `interpolate-size` | 个别高度过渡 | 直接跳到目标高度 |
| `text-wrap: balance / pretty` | 标题换行均衡 | 普通换行 |
| `Intl.Segmenter` | 输入框按"字"计数（表情算一个字） | 按码点计数 |
| View Transitions | 展示页换主题时整页交叉淡化 | 直接换（库本身不依赖） |
| `requestPictureInPicture`、全屏 | 视频播放器 | 按钮不显示 / 不可用 |
| 剪贴板 `navigator.clipboard` | 复制按钮 | 需要 HTTPS 或 localhost；失败时提示 |

## 移动端

- iOS Safari 17.5+、安卓 Chrome 117+。触摸、窄屏、安全区（`env(safe-area-inset-*)`）、软键盘的处理见 `docs/mobile.md`。

## 怎么验

- Chrome：效果对比工具（`scripts/parity/`）和三个巡检脚本都用本机 Chrome。
- WebKit：Playwright 的 WebKit 引擎跑一遍移动端用例（阶段 4，见 `docs/report.md`）。
