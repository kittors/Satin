# 图片 · Image

> 组件 id：`image`　分组：媒体与上传

先占位再淡入，不让图片一块块刷出来；加载失败给图标和"重试"。点缩略图放大：图片从缩略图的位置长到铺满窗口的看图层，关闭时沿原路缩回。看图层里能放大缩小（滚轮、捏合、双击、按钮）、拖动查看、左右旋转、一键还原，左右键或左右拖动翻页，Esc 关闭；视频也在里面直接播放。

## 验收要点

- 占位是浅灰底加骨架光带；图片到了，300ms 从 8px 模糊淡入到清晰。
- 放大 380ms ease.open，背景压暗 70%；关闭 260ms，缩回到缩略图原位。
- 比例只用 16:9、9:16、1:1、4:3，图片用 cover 铺满，不拉伸变形。

## 写法

### openLightbox(items, 第几张, 选项)（satin-ui/lightbox）

| 参数 / 选项 | 说明 |
|---|---|
| items[i].src / bg | 图片地址；或者直接给 CSS 背景（"url(…) center / cover"、渐变、颜色） |
| items[i].size / ratio | 原图宽高 [宽, 高]（适应窗口时不放大超过原图）/ 只知道比例时给宽 ÷ 高 |
| items[i].type | "video"：在看图层里直接播放（src 是视频地址，poster 是封面），没有缩放和旋转 |
| items[i].alt | 说明文字（读屏用） |
| thumbOf(i) | 第 i 张的缩略图：从它那里放大，关上时沿原路缩回去（打开期间缩略图藏起来）；不给就在中间淡入淡出 |
| enabled(i) | 左右翻页能不能停在这一张（加载失败的跳过） |
| onClose() | 关上以后 |
| 返回 | { close(), step(±1), zoom(±1), rotate(±1), reset() }；closeLightbox() 关上当前打开的 |

### 看图层里的操作

| 操作 | 说明 |
|---|---|
| 滚轮 / 触控板捏合 | 以鼠标位置为中心缩放，50%～800%（100% 是适应窗口），跟手、不跳 |
| 双击 | 在适应窗口和 2 倍之间切换，以双击的位置为中心 |
| 拖动 | 放大以后拖动查看；拖出边会被拉住，松手弹回边界里。没放大时左右拖动翻页 |
| 工具条 | 上一张 / 下一张、缩小 / 放大（按 50、75、100、150、200、300、400、600、800% 走）、向左 / 向右旋转、还原、关闭 |
| 旋转 | 每次 90°，转完重新适应窗口（横图转成竖的也完整显示）；平移跟着一起转 |
| 键盘 | ← → 翻页，+ − 缩放，R 向右转、⇧R 向左转，0 还原，Esc 关闭；Tab 只在工具条里转 |
| 点空白处 | 关上（点图片本身不关，免得想放大时误关） |

### 缩略图状态

| 写法 | 说明 |
|---|---|
| .sn-im | 缩略图（--sn-g 是背景） |
| .sn-loaded / .sn-failed | 加载好（模糊淡入）/ 失败（显示重试） |

## 用法

```js
import { openLightbox } from "satin-ui/lightbox";

// 缩略图：加载中显示骨架，加载好淡入（.sn-loaded），失败显示重试（.sn-failed）。这里用定时器模拟加载，第 4 张模拟失败
const grid = document.querySelector("#imgGrid");
const ims = () => [...grid.querySelectorAll(".sn-im")];
function load() {
  ims().forEach((im, i) => { im.classList.remove("sn-loaded", "sn-failed"); setTimeout(() => im.classList.add(i === 3 ? "sn-failed" : "sn-loaded"), 400 + i * 260 + Math.random() * 300); });
}
load();
document.querySelector("[data-img-reload]").addEventListener("click", load);

// 点开：从缩略图那里放大到铺满窗口，关上时缩回去；能放大缩小、拖动、旋转、还原，← → 翻页、Esc 关闭
// 每一项：src（图片地址）+ size（原图宽高）；这里的缩略图是 CSS 背景，就传 bg + ratio
const RATIO = new Map([["16:9", 16 / 9], ["1:1", 1], ["4:3", 4 / 3], ["9:16", 9 / 16]]);
const items = () => ims().map((im) => ({ bg: getComputedStyle(im).getPropertyValue("--sn-g") || im.style.getPropertyValue("--sn-g"), ratio: RATIO.get(im.querySelector(".sn-tag-ratio")?.textContent.trim()) || 16 / 9 }));
const thumbOf = (i) => grid.querySelector(`.sn-im[data-n="${i}"]`), enabled = (i) => thumbOf(i)?.classList.contains("sn-loaded");
grid.addEventListener("click", (e) => {
  const retry = e.target.closest("[data-img-retry]"), im = e.target.closest(".sn-im");
  if (retry) { im.classList.remove("sn-failed"); setTimeout(() => im.classList.add("sn-loaded"), 700); return; } // 换成真的重新请求
  if (im?.classList.contains("sn-loaded")) openLightbox(items(), Number(im.dataset.n), { thumbOf, enabled });
});
grid.addEventListener("keydown", (e) => { const im = e.target.closest(".sn-im"); if (im && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); im.click(); } });
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-img-grid" id="imgGrid"></div><div class="sn-row" style="margin-top:14px"><button class="sn-btn sn-secondary" data-img-reload="" data-i="refresh-cw:before">重新加载</button><span class="sn-note">第 4 张模拟加载失败</span></div>
```

## 规则

- 占位是浅灰底加骨架光带；图片到了，300ms 从 8px 模糊淡入到清晰。
- 放大 380ms `ease.open`，背景压暗 70%；关闭 260ms，缩回到缩略图原位。
- 比例只用 16:9、9:16、1:1、4:3，图片用 cover 铺满，不拉伸变形。

