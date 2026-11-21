import { InfiniteList } from "satin-ui/react";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset, size) => new Promise((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));

export default function ShotFeed() {
  // 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行；renderItem 返回一行的 React 节点（行元素复用，滚动时只改位置）
  return (
    <div className="sn-vl-wrap">
      <InfiniteList
        style={{ height: 320 }}
        loadPage={loadPage}
        rowHeight={56}
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
