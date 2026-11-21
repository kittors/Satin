"use client";
import { InfiniteList } from "satin-ui/react";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// 第二页第一次会失败：末尾那一行变成"重试"，点了再要一次
let failed = false;
const loadPage = (offset, size) => new Promise((ok, fail) => setTimeout(() => (offset === 30 && !failed ? ((failed = true), fail(new Error("网络断了"))) : ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] })))), 400));

export default function ShotFeed() {
  // 加载失败那一行变成"重试"；全部加载完显示"已经到底了"；renderItem 返回一行的 React 节点（行元素复用，滚动时只改位置）
  return (
    <div className="sn-vl-wrap">
      <InfiniteList
        style={{ height: 320 }}
        loadPage={loadPage}
        rowHeight={56}
      pageSize={30}
        renderItem={(it) => (
          <>
            <span className="sn-th" style={{ "--sn-g": `url(${it.thumb}) center / cover` }} />
            <span className="sn-tx"><b>{it.title}</b><span>{it.sub}</span></span>
          </>
        )}
      />
    </div>
  );
}
