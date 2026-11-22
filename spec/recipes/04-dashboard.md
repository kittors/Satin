# 仪表盘

结构：页头（标题、时间范围、切换周期）→ 一个面板里放 3～4 个指标（`.sn-stats`）→ 两栏：左边主要内容（表格 / 分布），右边最近动态。
不做"指标墙"（八九张彩色 KPI 卡片），不给每个数字配一个彩色图标。彩色只用在涨跌和状态上：分布条按状态上色，和表格里状态标签的圆点同一套颜色——完成 `sn-ok`（绿）、生成中 `sn-run`（主色）、待审核 `sn-warn`（橙）、失败 `sn-bad`（红）。没有图表组件时，用进度条做分布、用表格列数字，比花哨的图更清楚。

```html
<div class="sn-page">
  <header class="sn-page-hd">
    <div><h1>概览</h1><p>11&nbsp;月&nbsp;14&nbsp;日 – 11&nbsp;月&nbsp;20&nbsp;日</p></div>
    <div class="sn-acts"><sn-segmented items='["本周","本月","全年"]' value="本周"></sn-segmented></div>
  </header>
  <div class="sn-stack sn-gap-24">
    <section class="sn-panel">
      <div class="sn-stats">
        <div class="sn-stat"><span>生成的镜头</span><b>1,284</b><small class="sn-up">比上周 +12%</small></div>
        <div class="sn-stat"><span>完成的项目</span><b>36</b><small>比上周 +4</small></div>
        <div class="sn-stat"><span>平均生成时长</span><b>2&nbsp;分&nbsp;18&nbsp;秒</b><small class="sn-down">比上周慢 9&nbsp;秒</small></div>
        <div class="sn-stat"><span>本月用量</span><b>68%</b><small>还剩 3,200&nbsp;次</small></div>
      </div>
    </section>
    <div class="sn-with-aside" style="--sn-aside: 340px">
      <section class="sn-panel">
        <div class="sn-panel-hd"><div><h2>各状态的项目</h2><p>共 128&nbsp;个</p></div><a class="sn-link" href="/projects">全部项目</a></div>
        <div class="sn-stack sn-gap-16">
          <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>已完成</span><span class="sn-num sn-c-secondary">58</span></div><div class="sn-pbar sn-ok" style="--sn-p: .45"><i></i></div></div>
          <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>生成中</span><span class="sn-num sn-c-secondary">31</span></div><div class="sn-pbar sn-run" style="--sn-p: .24"><i></i></div></div>
          <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>待审核</span><span class="sn-num sn-c-secondary">27</span></div><div class="sn-pbar sn-warn" style="--sn-p: .21"><i></i></div></div>
          <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>失败</span><span class="sn-num sn-c-secondary">12</span></div><div class="sn-pbar sn-bad" style="--sn-p: .09"><i></i></div></div>
        </div>
      </section>
      <section class="sn-panel">
        <div class="sn-panel-hd"><h2>最近动态</h2></div>
        <div class="sn-stack sn-gap-16">
          <div class="sn-row sn-gap-12"><sn-avatar seed="u3" name="林夏" size="32" decorative></sn-avatar><div class="sn-grow">林夏完成了「雨夜车站」<div class="sn-t-caption sn-c-tertiary">3&nbsp;分钟前</div></div></div>
          <div class="sn-row sn-gap-12"><sn-avatar seed="u4" name="周屿" size="32" decorative></sn-avatar><div class="sn-grow">周屿上传了 12&nbsp;张素材<div class="sn-t-caption sn-c-tertiary">1&nbsp;小时前</div></div></div>
          <div class="sn-row sn-gap-12"><sn-avatar seed="u11" name="许诺" size="32" decorative></sn-avatar><div class="sn-grow">许诺重新生成了「长夜」的第 12&nbsp;个镜头<div class="sn-t-caption sn-c-tertiary">昨天 18:40</div></div></div>
          <div class="sn-row sn-gap-12"><sn-avatar seed="u8" name="陈默" size="32" decorative></sn-avatar><div class="sn-grow">陈默加入了团队<div class="sn-t-caption sn-c-tertiary">11&nbsp;月&nbsp;18&nbsp;日</div></div></div>
        </div>
      </section>
    </div>
  </div>
</div>
```

指标用 `.sn-stats` 排：宽屏一行放下全部（4 个就是一行 4 个），页面窄于 720（平板、手机）两列，4 个是 2 × 2，不会在中等宽度排成 3 + 1。数字 22px，不放大成 KPI 大字卡。
手机上（窄于 640）：页头变成吸顶的导航栏（标题居中、时间范围是标题下面一行小字），周期切换换到导航栏下面一行、撑满；面板铺满左右、去掉圆角和描边；两栏变成上下两块。
"全部项目"这种文字链接用 `sn-link`，只套排版类（`sn-t-callout`）会露出浏览器默认的蓝色下划线。
最近动态不加粗名字、不放徽标；每行最前面放 `<sn-avatar seed="…" name="…" decorative>`（React `<Avatar>` / Vue `<SnAvatar>`），不要用名字里的一个字当头像。
表格放在左栏时用 `.sn-panel.sn-flush` 包住 `.sn-tbl-wrap.sn-plain`（无外框的表格），不要卡片里再套一圈边框。
