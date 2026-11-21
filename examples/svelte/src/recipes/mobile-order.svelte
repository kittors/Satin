<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  defineElements();

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <main class="sn-page sn-narrow" style="padding-bottom: calc(var(--sn-sp-80) + env(safe-area-inset-bottom))">
    <header class="sn-page-hd">
      <div>
        <h1>确认订单</h1>
      </div>
    </header>
    <div class="sn-stack sn-gap-16">
      <section class="sn-panel">
        <div class="sn-row sn-gap-12">
          <img src="/p/lamp.jpg" alt="" width="64" height="64" style="border-radius: var(--sn-r-md); object-fit: cover">
          <div class="sn-grow">
            <b>折叠台灯 · 暖白</b>
            <div class="sn-t-caption sn-c-tertiary">三档亮度 · USB-C 充电</div>
          </div>
          <b class="sn-num">¥189.00</b>
        </div>
      </section>
      <section class="sn-panel sn-flush">
        <div class="sn-set-list" style="border: 0; border-radius: 0">
          <div class="sn-set-row" tabindex="0">
            <span class="sn-ico" data-i="map-pin"></span>
            <div class="sn-tx">
              <b>林夏 138 0000 1234</b>
              <span>上海市徐汇区漕溪北路 88 号 12 楼</span>
            </div>
            <span class="sn-end" data-i="chevron-right"></span>
          </div>
          <div class="sn-set-row" tabindex="0">
            <span class="sn-ico" data-i="clock"></span>
            <div class="sn-tx">
              <b>配送时间</b>
            </div>
            <span class="sn-val">明天 9:00–12:00</span>
            <span class="sn-end" data-i="chevron-right"></span>
          </div>
        </div>
      </section>
      <section class="sn-panel">
        <div class="sn-form" style="max-width: none">
          <div class="sn-field">
            <span class="sn-lbl">颜色</span>
            <sn-segmented items="[&quot;暖白&quot;,&quot;冷白&quot;,&quot;木纹&quot;]" value="暖白"></sn-segmented>
          </div>
          <div class="sn-field">
            <span class="sn-lbl">数量</span>
            <sn-stepper value="1" min="1" max="9" unit="件"></sn-stepper>
          </div>
          <div class="sn-field">
            <label class="sn-lbl" for="o-note">备注 <span class="sn-opt">可选</span></label>
            <textarea class="sn-input" id="o-note" rows="2" placeholder="比如：放门口，不用打电话"></textarea>
          </div>
        </div>
      </section>
      <section class="sn-panel">
        <dl class="sn-kv">
          <dt>商品</dt>
          <dd class="sn-num">¥189.00</dd>
          <dt>运费</dt>
          <dd class="sn-num">¥0.00</dd>
          <dt>优惠</dt>
          <dd class="sn-num sn-c-success">−¥20.00</dd>
        </dl>
      </section>
    </div>
  </main>
  <div class="sn-bottom-bar" style="position: fixed; left: 0; right: 0">
    <div class="sn-grow">
      <span class="sn-t-caption sn-c-tertiary">合计</span> <b class="sn-t-title2 sn-num">¥169.00</b>
    </div>
    <button class="sn-btn sn-primary sn-lg">提交订单</button>
  </div>
</div>
