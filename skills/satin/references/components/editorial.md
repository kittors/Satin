# 图文编排与内容张力 · Editorial

> 组件 id：`editorial`　分组：数据展示

打破单调文字墙与 AI 模板卡：用大字阶非对称杂志头图、2px 拉引金句、去盒化极简数字带、不对称 Bento 视觉拼贴、交互悬浮标注点与调色/声波多元素组合，让文字、段落与影像自带张力与节奏。所有圆角、线宽、毛玻璃虚化与护字渐变均走统一令牌并可随时定制。

## 验收要点

- **层次张力**：非对称比例（1 : 1.32 头图、62ch 正文 + 232px 侧注、跨列/跨行 Bento 拼贴）打破呆板均分栅格，大字阶标题配合 `text-wrap: balance`。
- **去 KPI 盒化**：关键数据用纯大号 `tabular-nums` 与上下 1px 细线构成极简指标带，绝不套一排彩色小盒子。
- **统一材质规范**：摄影压字仅用 `--sn-grad-scrim` 护读，浮签仅用 `--sn-blur-md` 毛玻璃与 `--sn-glass-bg`，零装饰性彩色渐变。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<article class="sn-ed">
<!-- 1. 非对称杂志头图 -->
<header class="sn-ed-hero">
<div class="sn-ed-hero-copy">
<div>
<span class="sn-ed-kicker"><i></i>雨夜车站 · 第三集摄影手记</span>
<div class="sn-ed-title" role="heading" aria-level="3">把冷雨夜的光影层次，压进三分钟的留白里</div>
<div class="sn-ed-deck">在没有密集对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。我们把站前广场的冷蓝积水与候车厅的暖黄钨丝灯拆成两条互相牵引的情绪线。</div>
</div>
<div class="sn-ed-byline">
<div class="sn-ed-author">
<sn-avatar seed="u3" name="林夏" size="32" decorative=""></sn-avatar>
<div><b>林夏 · 摄影指导</b><span>2026 年 11 月 19 日 · 4 分钟阅读</span></div>
</div>
<div class="sn-ed-acts">
<button type="button" class="sn-btn sn-primary sn-sm" data-i="play:before">看第三集样片</button>
<button type="button" class="sn-btn sn-secondary sn-sm" data-i="star:before">收藏手记</button>
</div>
</div>
</div>
<div class="sn-ed-frame" data-ed-zoom="">
<img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&h=640&q=80" alt="雨夜车站广场灯光倒影" decoding="async">
<span class="sn-ed-scrim" aria-hidden="true"></span>
<div class="sn-ed-exif">
<span class="sn-ed-glass">35mm · f/1.8 · 5200K · 1/60s</span>
<span class="sn-ed-cap-light">图 01 · 站前广场雨后倒影（点图放大）</span>
</div>
</div>
</header>
<!-- 2. 杂志正文 + 2px 拉引金句 + 去盒化极简数字带 + 侧栏图注 -->
<div class="sn-ed-article">
<div class="sn-ed-prose">
<div class="sn-ed-lead">开场前四十秒几乎没有人物近景。摄影机贴在离地六十厘米的湿润石板上方，让路灯在积水里拉出长而克制的纵向倒影，观众在看见林夏之前，先听见远处最后一班列车进站的制动低鸣。</div>
<figure class="sn-ed-quote">
<blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
<cite>— 导演分镜批注 · 第三集定稿评审</cite>
</figure>
<div class="sn-ed-p">进入候车厅以后，色温从室外的 5200K 缓慢滑向 3400K。长椅选用带有磨损木纹的旧松木，扶手反光刚好接住顶灯余晖；整段六分钟实拍素材最终剪入五个镜头，用一次十二帧叠化把雨声无缝送进站台。</div>
<div class="sn-ed-metrics">
<div class="sn-ed-metric"><b>48</b><span>全集精修镜头</span></div>
<div class="sn-ed-metric"><b>5200K</b><span>雨夜冷调基线</span></div>
<div class="sn-ed-metric"><b>02:48</b><span>第三集成片时长</span></div>
<div class="sn-ed-metric"><b>12</b><span>实景机位方案</span></div>
</div>
</div>
<aside class="sn-ed-aside">
<figure class="sn-ed-fig">
<div class="sn-ed-fig-img" data-ed-zoom=""><img src="https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&fit=crop&w=560&h=420&q=80" alt="候车厅暖光实景参考" decoding="async"></div>
<figcaption><b>图 02 · 候车厅中景</b>：暖黄顶灯与冷色雨夜玻璃门形成天然画幅分割。</figcaption>
</figure>
<figure class="sn-ed-fig">
<div class="sn-ed-fig-img" data-ed-zoom=""><img src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=560&h=420&q=80" alt="夜间铁道站台灯光" decoding="async"></div>
<figcaption><b>图 03 · 站台九盏灯</b>：长镜头慢摇过七盏灯，车灯恰好切入画框。</figcaption>
</figure>
</aside>
</div>
<!-- 3. 不对称 Bento 拼贴画
<!-- ……后面还有，略 -->
```

## 规则

- **层次张力**：非对称比例（1 : 1.32 头图、62ch 正文 + 232px 侧注、跨列/跨行 Bento 拼贴）打破呆板均分栅格，大字阶标题配合 `text-wrap: balance`。
- **去 KPI 盒化**：关键数据用纯大号 `tabular-nums` 与上下 1px 细线构成极简指标带，绝不套一排彩色小盒子。
- **统一材质规范**：摄影压字仅用 `--sn-grad-scrim` 护读，浮签仅用 `--sn-blur-md` 毛玻璃与 `--sn-glass-bg`，零装饰性彩色渐变。

