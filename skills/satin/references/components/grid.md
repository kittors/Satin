# 数据表格 · DOM · Data grid · 十万行

> 组件 id：`grid`　分组：数据展示

十万行，只渲染看得见的行。数据在后台线程（当作服务端）里筛选、排序，按 100 行一块懒加载，每块有 240～520ms 的网络延迟，还没到的行显示静止的占位条。点表头排序，拖表头换列的位置，拖表头右边缘改宽（双击按内容自适应），点表头的筛选按钮按列筛选；拖行左边的把手换行的位置；双击格子、回车或直接打字开始编辑。名称列和勾选列固定在左边，操作列固定在右边。单击格子是选中（贴边细线），双击、回车或直接打字才是编辑（白底输入框）；按住格子拖出一块可以合并单元格；名称前的小箭头展开详情；整行的下边线都能拖行高。工具条最前面能切到"树形"：项目 → 分集 → 场次 → 镜头四级，名称前的箭头展开下级，详情挪到操作列的按钮上。

## 验收要点

- 只渲染看得见的行加上下各 6 行：行池环形复用，位置 p 固定用第 p % 池大小 行，滚动时只有新进来的行换内容。
- 表头和每一行用同一套 CSS 网格轨道：列换位置只改一张 order 样式表，列宽只改一个变量，所有行一起变；拖表头放下时，看得见的格子用 FLIP 从旧位置滑过去（220ms）。
- 固定列用 sticky：格子都有不透明底色，盖住横着滚过去的内容；横着滚开时，固定列的边上出一道阴影。
- 懒加载：看到哪里要哪里，每 80ms 最多要一次，快速划过去的块不会一路要过去；筛选、排序换了视图，还没到的旧块作废。
- 拖行：其他行让位（150ms），拖到上下边上自动滚；排序或筛选时不能手动换顺序（会提示先清除）。键盘：Alt + 上下键挪当前行。
- 编辑：回车、Tab 提交，Esc 取消；不合法就红框加一句原因，不提交；提交后格子闪一下表示存上了。选项列（状态、负责人、类型）弹出选项，上下键选、回车确定。
- 键盘：方向键、Tab、Home/End、PageUp/PageDown 在格子间移动；空格勾选当前行；勾选支持 Shift 连选、表头全选。
- 树形：每深一级缩进 24px，竖向引导线，没有下级的是小圆点；收起时下级先原地淡出再让位，下级保留各自的展开状态；勾上一级 = 勾上下面所有的，下级勾了一部分上级半选；排序在每组兄弟里各自排；搜索显示命中的和它的所有上级（临时展开）；拖行只在同一组兄弟里换，连同展开着的下级一起走；名称格上右键展开、左键收起再回到上级。

## 写法

### mountDataGrid(.sn-grid, 选项)（satin-ui/grid）

| 选项 | 说明 |
|---|---|
| rows | 行数（演示数据，默认 10 万） |
| seed | 生成演示数据的种子 |

### 现在的限制

| 项目 | 说明 |
|---|---|
| 列和数据 | 内置的演示项目表（列定义、数据生成和“服务端”都在库里） |
| 接自己的数据 | 列定义、按块取数据、筛选、排序、树形的接口还在整理，暂时没有公开 |

## 用法

```js
import { mountDataGrid } from "satin-ui/grid";
import "satin-ui/css/grid.css";
import "satin-ui/css/data.css";

// 虚拟滚动、按需取块（筛选排序在后台线程）、固定列、拖列、改列宽行高、框选合并单元格、树形、编辑、拖行
mountDataGrid(document.querySelector(".sn-grid"), { rows: 100000 });
// 列和数据现在是内置的演示项目表；接自己的列和数据的接口还在整理，暂时没有公开
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-grid" id="gridDom">
<div class="sn-g-bar">
<span class="sn-ib sn-has-pre" style="width:220px"><span class="sn-pre" data-i="search"></span><input class="sn-input sn-sm" data-g-q="" placeholder="搜索名称，比如 站台" aria-label="搜索名称"></span>
<div class="sn-seg sn-sm" data-seg="gtree"><span class="sn-thumb"></span><button data-v="flat">平铺</button><button data-v="tree">树形</button></div>
<button class="sn-btn sn-ghost sn-sm" data-g-expand="" hidden data-i="chevrons-up-down:before">全部展开</button>
<div class="sn-seg sn-sm" data-seg="gmode"><span class="sn-thumb"></span><button data-v="known">按需加载</button><button data-v="append">滚到底再加载</button></div>
<div class="sn-seg sn-sm" data-seg="gsb"><span class="sn-thumb"></span><button data-v="gutter">常驻滚动条</button><button data-v="auto">自动隐藏</button></div>
<div class="sn-seg sn-sm" data-seg="glines"><span class="sn-thumb"></span><button data-v="row">行线</button><button data-v="grid">网格</button></div>
<span class="sn-g-filters" data-g-filters=""></span>
<span class="sn-g-info" data-g-info=""></span>
</div>
<div class="sn-g-frame"><div class="sn-g-vp" tabindex="0" role="grid" aria-label="数据表格，十万行"><div class="sn-g-head" role="row"></div><div class="sn-g-body" role="rowgroup"><div class="sn-g-foot" hidden></div></div></div><i class="sn-g-shade sn-l" aria-hidden="true"></i><i class="sn-g-shade sn-r" aria-hidden="true"></i></div>
</div>
```

## 规则

- 只渲染看得见的行加上下各 6 行：行池环形复用，位置 p 固定用第 p % 池大小 行，滚动时只有新进来的行换内容。
- 表头和每一行用同一套 CSS 网格轨道：列换位置只改一张 order 样式表，列宽只改一个变量，所有行一起变；拖表头放下时，看得见的格子用 FLIP 从旧位置滑过去（220ms）。
- 固定列用 sticky：格子都有不透明底色，盖住横着滚过去的内容；横着滚开时，固定列的边上出一道阴影。
- 懒加载：看到哪里要哪里，每 80ms 最多要一次，快速划过去的块不会一路要过去；筛选、排序换了视图，还没到的旧块作废。
- 拖行：其他行让位（150ms），拖到上下边上自动滚；排序或筛选时不能手动换顺序（会提示先清除）。键盘：Alt + 上下键挪当前行。
- 编辑：回车、Tab 提交，Esc 取消；不合法就红框加一句原因，不提交；提交后格子闪一下表示存上了。选项列（状态、负责人、类型）弹出选项，上下键选、回车确定。
- 键盘：方向键、Tab、Home/End、PageUp/PageDown 在格子间移动；空格勾选当前行；勾选支持 Shift 连选、表头全选。
- 树形：每深一级缩进 24px，竖向引导线，没有下级的是小圆点；收起时下级先原地淡出再让位，下级保留各自的展开状态；勾上一级 = 勾上下面所有的，下级勾了一部分上级半选；排序在每组兄弟里各自排；搜索显示命中的和它的所有上级（临时展开）；拖行只在同一组兄弟里换，连同展开着的下级一起走；名称格上右键展开、左键收起再回到上级。

