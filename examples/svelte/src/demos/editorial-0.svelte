<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  defineElements();

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <article class="sn-ed">
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
            <div>
              <b>林夏 · 摄影指导</b>
              <span>2026 年 11 月 19 日 · 4 分钟阅读</span>
            </div>
          </div>
          <div class="sn-ed-acts">
            <button type="button" class="sn-btn sn-primary sn-sm" data-i="play:before">看第三集样片</button>
            <button type="button" class="sn-btn sn-secondary sn-sm" data-i="star:before">收藏手记</button>
          </div>
        </div>
      </div>
      <div class="sn-ed-frame" data-ed-zoom="">
        <img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&amp;fit=crop&amp;w=960&amp;h=640&amp;q=80" alt="雨夜车站广场灯光倒影" decoding="async">
        <span class="sn-ed-scrim" aria-hidden="true"></span>
        <div class="sn-ed-exif">
          <span class="sn-ed-glass">35mm · f/1.8 · 5200K · 1/60s</span>
          <span class="sn-ed-cap-light">图 01 · 站前广场雨后倒影（点图放大）</span>
        </div>
      </div>
    </header>
    <div class="sn-ed-article">
      <div class="sn-ed-prose">
        <div class="sn-ed-lead">开场前四十秒几乎没有人物近景。摄影机贴在离地六十厘米的湿润石板上方，让路灯在积水里拉出长而克制的纵向倒影，观众在看见林夏之前，先听见远处最后一班列车进站的制动低鸣。</div>
        <figure class="sn-ed-quote">
          <blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote>
          <cite>— 导演分镜批注 · 第三集定稿评审</cite>
        </figure>
        <div class="sn-ed-p">进入候车厅以后，色温从室外的 5200K 缓慢滑向 3400K。长椅选用带有磨损木纹的旧松木，扶手反光刚好接住顶灯余晖；整段六分钟实拍素材最终剪入五个镜头，用一次十二帧叠化把雨声无缝送进站台。</div>
        <div class="sn-ed-metrics">
          <div class="sn-ed-metric">
            <b>48</b>
            <span>全集精修镜头</span>
          </div>
          <div class="sn-ed-metric">
            <b>5200K</b>
            <span>雨夜冷调基线</span>
          </div>
          <div class="sn-ed-metric">
            <b>02:48</b>
            <span>第三集成片时长</span>
          </div>
          <div class="sn-ed-metric">
            <b>12</b>
            <span>实景机位方案</span>
          </div>
        </div>
      </div>
      <aside class="sn-ed-aside">
        <figure class="sn-ed-fig">
          <div class="sn-ed-fig-img" data-ed-zoom="">
            <img src="https://images.unsplash.com/photo-1554103577-c0d26e9b90e0?auto=format&amp;fit=crop&amp;w=560&amp;h=420&amp;q=80" alt="候车厅暖光实景参考" decoding="async">
          </div>
          <figcaption><b>图 02 · 候车厅中景</b>：暖黄顶灯与冷色雨夜玻璃门形成天然画幅分割。</figcaption>
        </figure>
        <figure class="sn-ed-fig">
          <div class="sn-ed-fig-img" data-ed-zoom="">
            <img src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&amp;fit=crop&amp;w=560&amp;h=420&amp;q=80" alt="夜间铁道站台灯光" decoding="async">
          </div>
          <figcaption><b>图 03 · 站台九盏灯</b>：长镜头慢摇过七盏灯，车灯恰好切入画框。</figcaption>
        </figure>
      </aside>
    </div>
    <div class="sn-ed-bento">
      <div class="sn-ed-tile sn-ed-wide" data-ed-zoom="">
        <img src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&amp;fit=crop&amp;w=960&amp;h=560&amp;q=80" alt="夜色街道与雨幕高光分析" decoding="async">
        <span class="sn-ed-scrim" aria-hidden="true"></span>
        <button type="button" class="sn-ed-pin sn-on" style="--sn-x:30%;--sn-y:42%" aria-label="查看主光标注" aria-pressed="true"></button>
        <button type="button" class="sn-ed-pin" style="--sn-x:72%;--sn-y:34%" aria-label="查看构图标注" aria-pressed="false"></button>
        <div class="sn-ed-note" id="edPinNote">
          <b>5200K 冷雨夜主光</b>
          <span>站前广场积水反射冷白钠灯，压低高光饱和度，与后景候车厅 3400K 暖灯形成冷暖纵深。</span>
        </div>
      </div>
      <div class="sn-ed-tile sn-ed-tall" data-ed-zoom="">
        <img src="https://images.unsplash.com/photo-1541702467897-41915a07d3a7?auto=format&amp;fit=crop&amp;w=640&amp;h=900&amp;q=80" alt="竖幅夜雨光影特写" decoding="async">
        <span class="sn-ed-scrim" aria-hidden="true"></span>
        <div class="sn-ed-exif">
          <span class="sn-ed-cap-light">镜 09 · 车灯切过侧脸的 1.4 秒停顿</span>
        </div>
      </div>
      <div class="sn-ed-tile sn-ed-palette">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px">
          <b class="sn-t-body-strong">本场实景采样色板</b>
          <span class="sn-t-caption sn-c-tertiary">点色块复制</span>
        </div>
        <div class="sn-ed-swatches">
          <button type="button" class="sn-ed-swatch" data-hex="#1C2733" style="--sn-c:#1C2733">
            <i></i>
            <span>#1C2733</span>
          </button>
          <button type="button" class="sn-ed-swatch" data-hex="#4A6274" style="--sn-c:#4A6274">
            <i></i>
            <span>#4A6274</span>
          </button>
          <button type="button" class="sn-ed-swatch" data-hex="#C8935B" style="--sn-c:#C8935B">
            <i></i>
            <span>#C8935B</span>
          </button>
          <button type="button" class="sn-ed-swatch" data-hex="#7D2932" style="--sn-c:#7D2932">
            <i></i>
            <span>#7D2932</span>
          </button>
        </div>
      </div>
      <div class="sn-ed-tile sn-ed-sound" id="edSound">
        <div class="sn-ed-sound-top">
          <div>
            <b>站台雨夜环境音 · 01:14</b>
            <span>同期双声道 · 降噪后压低 6dB</span>
          </div>
          <button type="button" class="sn-btn sn-primary sn-round sn-ibtn" data-ed-play="" aria-label="播放环境音" aria-pressed="false">
            <span class="sn-swap">
              <span class="sn-a" data-i="play"></span>
              <span class="sn-b" data-i="pause"></span>
            </span>
          </button>
        </div>
        <div class="sn-ed-wave" aria-hidden="true"></div>
      </div>
    </div>
  </article>
</div>
