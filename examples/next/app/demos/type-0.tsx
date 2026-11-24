"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./type-0.css";

export default function TypeDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="type-list" id="typeList">
        <div>
          <span className="sn-t-display sn-truncate">把故事，拍成画面</span>
          <span className="sn-meta">display</span>
          <span className="sn-meta">28 / 36 / 600</span>
        </div>
        <div>
          <span className="sn-t-title1 sn-truncate">页面标题：全部项目</span>
          <span className="sn-meta">title1</span>
          <span className="sn-meta">22 / 30 / 600</span>
        </div>
        <div>
          <span className="sn-t-title2 sn-truncate">区块标题：最近打开</span>
          <span className="sn-meta">title2</span>
          <span className="sn-meta">17 / 24 / 600</span>
        </div>
        <div>
          <span className="sn-t-title3 sn-truncate">卡片标题：雨夜车站</span>
          <span className="sn-meta">title3</span>
          <span className="sn-meta">15 / 22 / 600</span>
        </div>
        <div>
          <span className="sn-t-body sn-truncate">正文：从小说、剧本到成片，都在这台电脑上完成。</span>
          <span className="sn-meta">body</span>
          <span className="sn-meta">14 / 22 / 400</span>
        </div>
        <div>
          <span className="sn-t-body-strong sn-truncate">强调正文、按钮文字</span>
          <span className="sn-meta">bodyStrong</span>
          <span className="sn-meta">14 / 22 / 500</span>
        </div>
        <div>
          <span className="sn-t-callout sn-truncate">列表行、导航、表格</span>
          <span className="sn-meta">callout</span>
          <span className="sn-meta">13 / 20 / 400</span>
        </div>
        <div>
          <span className="sn-t-caption sn-truncate">副信息：3 分钟前 · 12 个镜头</span>
          <span className="sn-meta">caption</span>
          <span className="sn-meta">12 / 18 / 400</span>
        </div>
        <div>
          <span className="sn-t-micro sn-truncate">分组标题</span>
          <span className="sn-meta">micro</span>
          <span className="sn-meta">11 / 16 / 500</span>
        </div>
        <div>
          <span className="sn-t-code sn-truncate">project_7f3k2 · v1.4.0</span>
          <span className="sn-meta">code</span>
          <span className="sn-meta">12 / 18 / 400 等宽</span>
        </div>
      </div>
    </div>
  );
}
