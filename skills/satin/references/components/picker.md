# 日期、时间、地址 · DatePicker · TimePicker · RegionPicker

> 组件 id：`picker`　分组：表单

触发框和下拉选择同一个样子，面板和菜单同一种开合。日历换月时网格往所去的方向滑，点标题切到月份；时间两列滚动吸附到中间的选中带；地址按省、市、区三级走，选完一级自动滑到下一级，也可以跨级搜索。有值时悬停，右边的图标换成清除。

## 验收要点

- 日历一格 36px、圆 32px；今天在数字下面一个小点；范围内铺一条连续的浅色带，起止两天是实心圆。周一开头。
- 键盘：方向键按天 / 周移动，PageUp / PageDown 换月，Home / End 到周一 / 周日，回车选中，Esc 收起并把焦点还给触发框。时间列：上下键一格、翻页键五格。
- 定时发布早于现在时"确定"不可点，原因写在面板底部，不弹提示。地址的直辖市只写一次（"北京市 / 东城区"）。

## 写法

### bindPickers(root, 选项)

| 选项 / 事件 | 说明 |
|---|---|
| today / now | 今天、现在（默认真实时间；设计稿里固定成 2026-11-19 15:42） |
| pick 事件 | 值变了在宿主上冒泡，detail: { text } |

### 标记

| 写法 | 说明 |
|---|---|
| data-pk="date" | 日期：换月时网格往所去方向滑；点标题切月份视图；键盘按天 / 周 / 月走 |
| data-pk="range" | 日期范围：两个月并排、左边快捷预设；窄屏换成上下叠 |
| data-pk="time" | 时间：时、分两列，滚动吸附到中间的选中带 |
| data-pk="datetime" | 定时发布：日历 + 时间；早于现在的不能确定 |
| data-pk="region" | 地址：省 → 市 → 区三级，可跨级搜索 |

## 用法

```js
import { setup } from "satin-ui";
import { bindPickers } from "satin-ui/components";
import "satin-ui/css/picker.css";

setup(); // 页面级行为（Esc、点外面关上），整页调一次

// 写了 data-pk 的都接上：date（日期）| range（范围，两个月并排、快捷预设）| time（时、分两列）
//                       | datetime（定时发布：日历 + 时间）| region（省 / 市 / 区，可跨级搜索）
bindPickers(document);

document.addEventListener("pick", (e) => {
  console.log(e.target.dataset.pk, e.detail.text); // 比如 "date"、"11 月 21 日 星期六"
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="align-items:flex-start;gap:16px;flex-wrap:wrap">
<div class="sn-field"><span class="sn-lbl">交付日期</span>
<div class="sn-pk" data-pk="date"><button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
<div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today="">今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear="">清除</button></div></div></div></div>
<div class="sn-field"><span class="sn-lbl">统计范围</span>
<div class="sn-pk" data-pk="range" style="min-width:260px"><button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
<div class="sn-pk-panel" role="dialog" aria-label="选择日期范围"><div class="sn-pk-range"><div class="sn-pk-presets"><button type="button" data-p="today">今天</button><button type="button" data-p="d7">最近 7 天</button><button type="button" data-p="d30">最近 30 天</button><button type="button" data-p="month">本月</button><button type="button" data-p="last">上个月</button></div><div class="sn-cal-slot"></div></div>
<div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-reset="">重置</button><span class="sn-note"></span><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button></div></div></div></div>
<div class="sn-field"><span class="sn-lbl">每天提醒</span>
<div class="sn-pk" data-pk="time" style="min-width:140px"><button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择时间">选择时间</span><span class="sn-end sn-swap"><span class="sn-a" data-i="clock"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
<div class="sn-pk-panel" role="dialog" aria-label="选择时间"><div class="sn-tc-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-now="">此刻</button><span class="sn-grow"></span><button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button></div></div></div></div>
<div class="sn-field"><span class="sn-lbl">定时发布</span>
<div class="sn-pk" d
<!-- ……后面还有，略 -->
```

## 规则

- 日历一格 36px、圆 32px；今天在数字下面一个小点；范围内铺一条连续的浅色带，起止两天是实心圆。周一开头。
- 键盘：方向键按天 / 周移动，PageUp / PageDown 换月，Home / End 到周一 / 周日，回车选中，Esc 收起并把焦点还给触发框。时间列：上下键一格、翻页键五格。
- 定时发布早于现在时"确定"不可点，原因写在面板底部，不弹提示。地址的直辖市只写一次（"北京市 / 东城区"）。

