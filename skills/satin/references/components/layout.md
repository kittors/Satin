# 布局与响应式 · Layout

> 组件 id：`layout`　分组：基础

断点按容器宽度划分，不按窗口宽度：compact 小于 720、regular 720～1199、wide 1200 及以上。页面级布局跟着主区宽度变，组件跟着自己所在的容器变（容器查询），同一个组件放在侧栏里和放在主区里各自合适。下面的预览框可以拉到任意宽度（太宽时缩小显示），切换六种常见布局，可以叠加栅格。

## 验收要点

- 断点按容器宽度：页面级布局的容器是主区，组件用容器查询（@container）跟着自己所在的容器变，不按窗口宽度写死。
- 栅格 4、8、12 列；内容块按列数跨（仪表盘的统计卡：compact 占满一行，regular 半行，wide 四分之一）。
- 阅读型页面最大宽 960 居中；表单最大宽 640，720 起标签在左（120），更窄时标签在上。
- 卡片网格不写死列数：最小卡宽（项目卡 260、资产卡 200）加 auto-fill，列间距 16、行间距 24。
- 检查器 320，1280 起和主区并排，更窄时变成盖在上面的抽屉。
- 跨断点是换一套布局，不加动画；同一套布局里连续的变化（比如手动展开收起侧栏）才过渡 200ms。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-lo-tools">
<div class="sn-seg sn-sm" data-seg="lomode"><span class="sn-thumb"></span><button data-v="shell">应用外壳</button><button data-v="split">三栏</button><button data-v="cards">卡片网格</button><button data-v="dash">仪表盘</button><button data-v="read">阅读页</button><button data-v="form">表单</button></div>
<label class="sn-check" data-c=""><input type="checkbox" data-lo-grid="">显示栅格</label>
</div>
<div class="sn-lo-tools">
<span class="sn-cap">宽度</span><div class="sn-slider" data-slider="" data-max="1600" id="loW" tabindex="0" role="slider" aria-label="预览宽度" aria-valuemin="0" aria-valuemax="1600" aria-valuenow="960" style="width:280px"><span class="sn-rail"></span><span class="sn-fillbar"></span><span class="sn-knob"></span><span class="sn-bubble"></span></div>
<div class="sn-lo-presets"><button class="sn-btn sn-ghost sn-sm" data-lo-preset="375">手机 375</button><button class="sn-btn sn-ghost sn-sm" data-lo-preset="768">平板 768</button><button class="sn-btn sn-ghost sn-sm" data-lo-preset="1100">笔记本 1100</button><button class="sn-btn sn-ghost sn-sm" data-lo-preset="1440">桌面 1440</button><button class="sn-btn sn-ghost sn-sm" data-lo-preset="1920">大屏 1920</button></div>
</div>
<div class="sn-lo-info" data-lo-info=""></div>
<div class="sn-lo-frame"><div class="sn-lo-vp"><div class="sn-lo-in" data-mode="shell"></div></div></div>
```

### 断点与栅格

```html
<div data-sa="x"><table><thead><tr><th>断点</th><th>容器宽度</th><th>栅格</th><th>列间距</th><th>主区边距</th><th>侧栏</th><th>二级栏</th></tr></thead><tbody>
<tr><td>compact</td><td class="sn-num">&lt; 720</td><td class="sn-num">4 列</td><td class="sn-num">16</td><td class="sn-num">16</td><td>收进抽屉，顶栏左边出菜单按钮</td><td>只剩列表，点开详情盖上来</td></tr>
<tr><td>regular</td><td class="sn-num">720～1199</td><td class="sn-num">8 列</td><td class="sn-num">24</td><td class="sn-num">24（1100 起 32）</td><td>图标栏 64（1100 起展开 232）</td><td class="sn-num">240</td></tr>
<tr><td>wide</td><td class="sn-num">≥ 1200</td><td class="sn-num">12 列</td><td class="sn-num">24</td><td class="sn-num">32（1440 起 40）</td><td class="sn-num">232</td><td class="sn-num">240（1280 起 280）</td></tr>
</tbody></table></div>
```

## 规则

- 断点按容器宽度：页面级布局的容器是主区，组件用容器查询（`@container`）跟着自己所在的容器变，不按窗口宽度写死。
- 栅格 4、8、12 列；内容块按列数跨（仪表盘的统计卡：compact 占满一行，regular 半行，wide 四分之一）。
- 阅读型页面最大宽 960 居中；表单最大宽 640，720 起标签在左（120），更窄时标签在上。
- 卡片网格不写死列数：最小卡宽（项目卡 260、资产卡 200）加 auto-fill，列间距 16、行间距 24。
- 检查器 320，1280 起和主区并排，更窄时变成盖在上面的抽屉。
- 跨断点是换一套布局，不加动画；同一套布局里连续的变化（比如手动展开收起侧栏）才过渡 200ms。

