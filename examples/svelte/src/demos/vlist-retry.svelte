<script lang="ts">
  import { createInfiniteList } from "satin-ui";
  const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
  // 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
  let failed = false;
  const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));
  // renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
  const renderRow = (row: HTMLElement & { _d?: { th: HTMLElement; b: HTMLElement; s: HTMLElement } }, it: { title: string; sub: string; thumb: string }) => {
    if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild as HTMLElement, b: row.querySelector("b")!, s: row.querySelector(".sn-tx span")! }; }
    row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
    row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
  };

  // 加载失败那一行变成"重试"；全部加载完显示"已经到底了"；挂上以后建，卸载时 destroy()
  let host!: HTMLDivElement;
  $effect(() => {
    const it = createInfiniteList(host, { loadPage, renderRow, rowHeight: 56, pageSize: 30 });
    return () => it.destroy();
  });
</script>

<div class="sn-vl-wrap"><div class="sn-vl" bind:this={host} style="height:320px"></div></div>
