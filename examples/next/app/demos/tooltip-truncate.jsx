"use client";
export default function LongTitle() {
  // data-tip-full：只有文字被截断时，悬停才显示全文
  return <span className="sn-truncate" style={{ maxWidth: 180 }} data-tip-full>第三集 · 雨夜车站 · 第二场 · 长镜头版本</span>;
}
