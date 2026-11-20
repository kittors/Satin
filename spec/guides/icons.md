# 图标（Icons）

> 统一的线性图标，线宽 1.5，颜色跟随文字。

统一的线性图标，线宽 1.5，颜色跟随文字。16 放在正文旁，20 用在工具栏，24 用在空状态。不用 emoji，不用彩色图标。

## 放在哪

- 图标只用在导航、工具条、空状态和图标按钮里。
- 按钮以文字为主；只有"新建""导入"这类主按钮带一个前置图标。
- 警告列表、区块标题、键值对的标签前面都不放图标。
- 没有文字的图标按钮必须有名称：悬停 500ms 后用 Tooltip 显示，读屏也读这个名称。

```html
<span data-i="search"></span>                     <!-- 单独一个图标 -->
<button class="sn-btn sn-secondary" data-i="upload:before">导入</button>  <!-- 文字前 -->
<button class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置"></button>
```
