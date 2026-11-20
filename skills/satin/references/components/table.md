# 表格 · Table

> 组件 id：`table`　分组：数据展示

后台的主力组件。点表头排序，行按新顺序移到位，不是一下子跳过去；勾选后底部浮出批量操作条；行操作悬停时才出现；数字列右对齐、用等宽数字。两种密度：舒适 48、紧凑 36；行线 / 网格两种线（合并只在网格里）。多级树：项目 → 分集 → 场次，展开时下面的行滑开、下级在让出来的地方露出来，收起时下面的行滑上来把下级盖住；"合并相同负责人"时连续相同的负责人合成一格。按住左边的把手拖行，被拖的行跟着指针走，别的行让开，空位就是落点；按住表头拖列，整列浮起来跟着走，别的列从空位上滑过去；拖表头右边缘改宽、双击按内容定宽；单击格子选中、双击项目名改名；任何一行的下边线都能拖行高。

## 验收要点

- 表头 12/500、tertiary 色，下面一条线；行之间一条 line.subtle；悬停只叠一层填充，不改字色。
- 排序：箭头只在当前列显示，切换方向时转过去；行移动 300ms ease.open，相邻行错开 15ms；每一格的底都不透明，行交叉时一行盖住另一行，不叠字。
- 展开收起：推开 / 合上，外框高度和合计行一起过渡，中间不会空一块；合并格的内容一直看得见。
- 批量操作条从底部升起 260ms，显示已选数量，数量变化时数字滚动。

## 用法

```js
import { createScrollArea } from "satin-ui/components";
import "satin-ui/css/data.css";
import "satin-ui/css/scroll.css";

// .sn-tbl-sc 限高（--sn-tbl-max）以后在框里滚；表头 position: sticky 吸在顶上
// 不加边缘渐隐（fade: "none"），免得表头被淡掉；表格不回弹：滚到头就停住，再滚一次交给页面
createScrollArea(document.querySelector(".sn-tbl-sc"), { fade: "none" });
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 基础

```html
<div class="sn-tbl-wrap"><div class="sn-tbl-sc"><table class="sn-tbl" aria-label="项目列表"><thead><tr><th>项目</th><th>负责人</th><th>状态</th><th class="sn-r">镜头</th><th class="sn-r">时长</th></tr></thead><tbody><tr><td><b>雨夜车站</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span></td><td><span class="sn-tag sn-ok"><i></i>已完成</span></td><td class="sn-r sn-num">48</td><td class="sn-r sn-num">12:36</td></tr><tr><td><b>海边的第七天</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span></td><td><span class="sn-tag sn-run"><i></i>生成中</span></td><td class="sn-r sn-num">32</td><td class="sn-r sn-num">8:32</td></tr><tr><td><b>城南旧事（第二版）</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:150">陈</span>陈默</span></td><td><span class="sn-tag"><i></i>草稿</span></td><td class="sn-r sn-num">12</td><td class="sn-r sn-num">3:00</td></tr><tr><td><b>长夜</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:280">许</span>许诺</span></td><td><span class="sn-tag sn-bad"><i></i>失败</span></td><td class="sn-r sn-num">20</td><td class="sn-r sn-num">5:00</td></tr></tbody></table></div></div>
```

### 斑马纹

```html
<div class="sn-tbl-wrap sn-striped"><div class="sn-tbl-sc"><table class="sn-tbl" aria-label="项目列表"><thead><tr><th>项目</th><th>负责人</th><th>状态</th><th class="sn-r">镜头</th><th class="sn-r">时长</th></tr></thead><tbody><tr><td><b>雨夜车站</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span></td><td><span class="sn-tag sn-ok"><i></i>已完成</span></td><td class="sn-r sn-num">48</td><td class="sn-r sn-num">12:36</td></tr><tr><td><b>海边的第七天</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span></td><td><span class="sn-tag sn-run"><i></i>生成中</span></td><td class="sn-r sn-num">32</td><td class="sn-r sn-num">8:32</td></tr><tr><td><b>城南旧事（第二版）</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:150">陈</span>陈默</span></td><td><span class="sn-tag"><i></i>草稿</span></td><td class="sn-r sn-num">12</td><td class="sn-r sn-num">3:00</td></tr><tr><td><b>长夜</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:280">许</span>许诺</span></td><td><span class="sn-tag sn-bad"><i></i>失败</span></td><td class="sn-r sn-num">20</td><td class="sn-r sn-num">5:00</td></tr><tr><td><b>山那边的学校</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:340">李</span>李然</span></td><td><span class="sn-tag sn-warn"><i></i>待审核</span></td><td class="sn-r sn-num">64</td><td class="sn-r sn-num">17:02</td></tr></tbody></table></div></div>
```

### 网格线

```html
<div class="sn-tbl-wrap" data-lines="grid"><div class="sn-tbl-sc"><table class="sn-tbl" aria-label="项目列表"><thead><tr><th>项目</th><th>负责人</th><th>状态</th><th class="sn-r">镜头</th><th class="sn-r">时长</th></tr></thead><tbody><tr><td><b>雨夜车站</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span></td><td><span class="sn-tag sn-ok"><i></i>已完成</span></td><td class="sn-r sn-num">48</td><td class="sn-r sn-num">12:36</td></tr><tr><td><b>海边的第七天</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span></td><td><span class="sn-tag sn-run"><i></i>生成中</span></td><td class="sn-r sn-num">32</td><td class="sn-r sn-num">8:32</td></tr><tr><td><b>城南旧事（第二版）</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:150">陈</span>陈默</span></td><td><span class="sn-tag"><i></i>草稿</span></td><td class="sn-r sn-num">12</td><td class="sn-r sn-num">3:00</td></tr><tr><td><b>长夜</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:280">许</span>许诺</span></td><td><span class="sn-tag sn-bad"><i></i>失败</span></td><td class="sn-r sn-num">20</td><td class="sn-r sn-num">5:00</td></tr></tbody></table></div></div>
```

### 紧凑

```html
<div class="sn-tbl-wrap sn-compact"><div class="sn-tbl-sc"><table class="sn-tbl" aria-label="项目列表"><thead><tr><th>项目</th><th>负责人</th><th>状态</th><th class="sn-r">镜头</th><th class="sn-r">时长</th></tr></thead><tbody><tr><td><b>雨夜车站</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span></td><td><span class="sn-tag sn-ok"><i></i>已完成</span></td><td class="sn-r sn-num">48</td><td class="sn-r sn-num">12:36</td></tr><tr><td><b>海边的第七天</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span></td><td><span class="sn-tag sn-run"><i></i>生成中</span></td><td class="sn-r sn-num">32</td><td class="sn-r sn-num">8:32</td></tr><tr><td><b>城南旧事（第二版）</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:150">陈</span>陈默</span></td><td><span class="sn-tag"><i></i>草稿</span></td><td class="sn-r sn-num">12</td><td class="sn-r sn-num">3:00</td></tr><tr><td><b>长夜</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:280">许</span>许诺</span></td><td><span class="sn-tag sn-bad"><i></i>失败</span></td><td class="sn-r sn-num">20</td><td class="sn-r sn-num">5:00</td></tr><tr><td><b>山那边的学校</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:340">李</span>李然</span></td><td><span class="sn-tag sn-warn"><i></i>待审核</span></td><td class="sn-r sn-num">64</td><td class="sn-r sn-num">17:02</td></tr></tbody></table></div></div>
```

## 规则

- 表头 12/500、tertiary 色，下面一条线；行之间一条 line.subtle；悬停只叠一层填充，不改字色。
- 排序：箭头只在当前列显示，切换方向时转过去；行移动 300ms `ease.open`，相邻行错开 15ms；每一格的底都不透明，行交叉时一行盖住另一行，不叠字。
- 展开收起：推开 / 合上，外框高度和合计行一起过渡，中间不会空一块；合并格的内容一直看得见。
- 批量操作条从底部升起 260ms，显示已选数量，数量变化时数字滚动。

