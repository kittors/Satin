<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { createInfiniteList } from "satin-ui/components";
  import "./vlist-0.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root, (root: any) => {
      // 行高固定：只画看得见的几十行，一万条照样流畅；滚到离底部 400px 自动要下一页（勾上"模拟加载失败"看失败后的重试）
      const vl = root.querySelector("#vl"), countEl = root.querySelector("#vlCount"), topBtn = root.querySelector("[data-vl-top]"), failBox = root.querySelector("#vlFail");
      const wait = (ms?: any) => new Promise((r?: any) => window.setTimeout(r, ms)), TOTAL = 10000;
      const list = createInfiniteList(vl, {
        total: TOTAL, pageSize: 400, rowHeight: 56,
        // 换成你的接口：返回这一页的数据数组
        loadPage: async (offset?: any, size?: any) => { await wait(offset === 0 ? 200 : 500 + Math.random() * 700); if (failBox.checked && offset > 0) throw new Error("加载失败"); return Array.from({ length: size }, (_?: any, k?: any) => offset + k); },
        // 行元素会复用：子元素缓存在 el._d 上，每次只改文字
        renderRow: (el?: any, i?: any) => {
          if (!el._d) { el.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span><span class="sn-no"></span>'; el._d = { b: el.querySelector("b"), m: el.querySelector(".sn-tx span"), no: el.children[2] }; }
          el._d.b.textContent = `镜头 ${i + 1}`; el._d.m.textContent = `第 ${Math.floor(i / 40) + 1} 集 · ${3 + (i % 6)} 秒`; el._d.no.textContent = String(i + 1);
        },
        // 已加载的条数变了调（参数只有这一个；总数就是上面给的 total）
        onCount: (n?: any) => { countEl.textContent = n >= TOTAL ? `已全部加载 · ${n.toLocaleString("zh-CN")} 条` : `已加载 ${n.toLocaleString("zh-CN")} 条 · 共 ${TOTAL.toLocaleString("zh-CN")} 条`; },
      });
      vl.addEventListener("vlscroll", (e?: any) => topBtn.classList.toggle("sn-on", e.detail.top > vl.clientHeight));
      topBtn.addEventListener("click", () => list.scrollTop());
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="row sn-vl-head">
    <span class="sn-t-callout" id="vlCount">已加载 0 条</span>
    <span style="flex:1"></span>
    <label class="sn-check" data-c=""><input type="checkbox" id="vlFail">下一页模拟加载失败</label>
    <button class="sn-btn sn-secondary sn-sm" data-vl-reset="">重新开始</button>
  </div>
  <div class="sn-vl-wrap">
    <div class="sn-vl" id="vl">
      <div class="sn-vl-space"></div>
    </div>
    <button class="sn-btn sn-secondary sn-sm sn-vl-top" data-vl-top="" data-i="arrow-up:before">回到顶部</button>
  </div>
</div>
