import { onSettled } from "solid-js";
import { createInfiniteList } from "satin-ui";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset, size) => new Promise((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
// renderRow(行元素, 数据)：行元素会复用（滚动时只改位置和内容），子元素缓存在 row._d 上
const renderRow = (row, it) => {
  if (!row._d) { row.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span>'; row._d = { th: row.firstChild, b: row.querySelector("b"), s: row.querySelector(".sn-tx span") }; }
  row._d.th.style.setProperty("--sn-g", `url(${it.thumb}) center / cover`);
  row._d.b.textContent = it.title; row._d.s.textContent = it.sub;
};

export default function ShotFeedTotal() {
  let host;
  // 知道一共多少条时给 total：加载到这么多条就停，不用再多要一页空的来确认到底了；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createInfiniteList(host, { loadPage, renderRow, rowHeight: 56, total: 300 });
    return () => it.destroy();
  });
  return <div class="sn-vl-wrap"><div ref={(el) => (host = el)} class="sn-vl" style="height:320px"></div></div>;
}
