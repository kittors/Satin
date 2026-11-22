# 移动端 H5 下单

结构：导航栏（返回 + 标题）→ 收货地址 → 商品和规格、数量 → 配送时间、优惠券 → 备注 → 支付方式 → 费用明细 → 底部贴边操作栏（合计 + 主按钮）。
外层 `.sn-page.sn-narrow.sn-screen`（整屏页面）：手机上（窄于 640）页头变成吸顶的导航栏，各块白底铺满左右（不是四周留白的圆角卡片），`.sn-bottom-bar` 贴在屏幕底部、让出底部横条，键盘弹出时停在键盘上面，内容不会被它盖住；宽屏上同一份标记是一栏窄页面，操作栏就是内容末尾的一行。
手机上：可点区域至少 44×44（`sn-btn sn-lg` 高 40，再加外边距；图标按钮用 `sn-lg`）；输入框字号不小于 16px 防止 iOS 放大（触屏上 `sn-input` 已经是 16px）。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<main class="sn-page sn-narrow sn-screen">
  <header class="sn-page-hd"><a class="sn-nav-back" href="/cart" data-i="chevron-left:before">购物车</a><div><h1>确认订单</h1></div></header>
  <div class="sn-stack sn-gap-12">
    <section class="sn-panel sn-flush">
      <div class="sn-set-list" style="border: 0; border-radius: 0">
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="map-pin"></span><div class="sn-tx"><b>林夏 138 0000 1234</b><span>上海市徐汇区漕溪北路 88&nbsp;号 12&nbsp;楼</span></div><span class="sn-end" data-i="chevron-right"></span></div>
      </div>
    </section>
    <section class="sn-panel">
      <div class="sn-row sn-gap-12">
        <img src="https://images.unsplash.com/photo-1534105615256-13940a56ff44?auto=format&fit=crop&w=160&h=160&q=80" alt="" width="64" height="64" style="border-radius: var(--sn-r-md); object-fit: cover">
        <div class="sn-grow"><b>折叠台灯</b><div class="sn-t-caption sn-c-tertiary">三档亮度 · USB-C 充电</div></div>
        <b class="sn-num">¥189.00</b>
      </div>
      <div class="sn-form" style="max-width: none; margin-top: var(--sn-sp-20)">
        <div class="sn-field"><span class="sn-lbl">颜色</span><sn-segmented items='["暖白","冷白","木纹"]' value="暖白"></sn-segmented></div>
        <div class="sn-row sn-between"><span class="sn-lbl">数量</span><sn-stepper value="1" min="1" max="9" unit="件"></sn-stepper></div>
      </div>
    </section>
    <section class="sn-panel sn-flush">
      <div class="sn-set-list" style="border: 0; border-radius: 0">
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="clock"></span><div class="sn-tx"><b>配送时间</b></div><span class="sn-val">明天 9:00–12:00</span><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="tag"></span><div class="sn-tx"><b>优惠券</b></div><span class="sn-val">满 150 减 20</span><span class="sn-end" data-i="chevron-right"></span></div>
      </div>
    </section>
    <section class="sn-panel">
      <div class="sn-field"><label class="sn-lbl" for="o-note">备注 <span class="sn-opt">可选</span></label><textarea class="sn-input" id="o-note" rows="2" placeholder="比如：放门口，不用打电话"></textarea></div>
    </section>
    <section class="sn-panel sn-flush">
      <div class="sn-set-list" role="radiogroup" aria-label="支付方式" style="border: 0; border-radius: 0">
        <label class="sn-set-row"><span class="sn-ico" data-i="credit-card"></span><div class="sn-tx"><b>微信支付</b></div><span class="sn-radio"><input type="radio" name="pay" checked><span class="sn-box"></span></span></label>
        <label class="sn-set-row"><span class="sn-ico" data-i="credit-card"></span><div class="sn-tx"><b>支付宝</b></div><span class="sn-radio"><input type="radio" name="pay"><span class="sn-box"></span></span></label>
      </div>
    </section>
    <section class="sn-panel">
      <div class="sn-stack sn-gap-8">
        <div class="sn-row sn-between"><span class="sn-c-secondary">商品</span><span class="sn-num">¥189.00</span></div>
        <div class="sn-row sn-between"><span class="sn-c-secondary">运费</span><span class="sn-num">¥0.00</span></div>
        <div class="sn-row sn-between"><span class="sn-c-secondary">优惠</span><span class="sn-num sn-c-success">−¥20.00</span></div>
      </div>
    </section>
  </div>
  <div class="sn-bottom-bar">
    <div class="sn-grow"><span class="sn-t-caption sn-c-tertiary">合计</span> <b class="sn-t-title2 sn-num">¥169.00</b></div>
    <button class="sn-btn sn-primary sn-lg">提交订单</button>
  </div>
</main>
```

`.sn-bottom-bar` 放在 `.sn-screen` 里面（最后一个），不要再自己写 `position: fixed` 和给页面垫底部内边距：贴底、安全区、内容不被盖住都由骨架类处理。
商品图用真实的照片（这里是 Unsplash 的外链，上线换成自己的商品图），不要灰块占位。数量用紧凑的步进器放在这一行右边，标签在左，不要拉成整行宽。
金额右对齐、用等宽数字（`sn-num`）；规格写在选择器里，商品名就不再带"· 暖白"，同一件事不说两遍。支付方式只有两三种时直接列出来单选（整行可点），不用再点进去选。
提交时 `busy(按钮, 请求)`；失败用 `toast({ text: "库存不足，换个颜色试试", tone: "danger" })`，不要 `alert()`。
地址、配送时间、优惠券的选择用底部抽屉（`openDrawer`）或选择器（`createPicker`），不要跳新页面再跳回来。
