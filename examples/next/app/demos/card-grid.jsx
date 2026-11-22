"use client";
import { Avatar } from "satin-ui/react";

export default function CardGrid() {
  return (
    <div className="sn-pcards">
    <div className="sn-pc" tabIndex="0" aria-label="雨夜车站">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">12:36</span></div>
      <div className="sn-meta"><b>雨夜车站</b><span className="sn-sub">48 个镜头 · 3 分钟前<span className="sn-av-group"><Avatar seed="u3" name="林夏" size={20} decorative /><Avatar seed="u4" name="周屿" size={20} decorative /></span></span></div>
    </div>
    <div className="sn-pc" tabIndex="0" aria-label="候车厅">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">04:12</span></div>
      <div className="sn-meta"><b>候车厅</b><span className="sn-sub">16 个镜头 · 昨天<span className="sn-av-group"><Avatar seed="u4" name="周屿" size={20} decorative /></span></span></div>
    </div>
    <div className="sn-pc" tabIndex="0" aria-label="积水里的城市">
      <div className="sn-cover"><img className="sn-art" src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=480&q=72" alt="" /><span className="sn-len">08:50</span></div>
      <div className="sn-meta"><b>积水里的城市</b><span className="sn-sub">30 个镜头 · 上周<span className="sn-av-group"><Avatar seed="u11" name="许诺" size={20} decorative /><Avatar seed="u3" name="林夏" size={20} decorative /><Avatar seed="u8" name="陈默" size={20} decorative /></span></span></div>
    </div>
    </div>
  );
}
