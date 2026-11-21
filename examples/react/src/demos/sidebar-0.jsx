"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { toast } from "satin-ui/components";

export default function SidebarDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 侧栏布局 enhance() 已经接上：选中的底色 / 指示条在条目之间滑动（.sn-app 上 data-navfx="slide | bar | fade | text"）；
      // [data-collapse] 收起 / 展开（⌘\ 也行），主区宽度连续变，卡片按新列数从原位置滑过去；窄于 720 自动收成图标栏（data-collapse-below 可改）
      // 点导航：换成你的路由跳转
      root.querySelector(".sn-side-nav").addEventListener("click", (e) => {
        const a = e.target.closest("a[href]"); if (!a) return;
        e.preventDefault(); toast({ text: `打开"${a.textContent.trim()}"` });
      });
      // 自己创建也行：createSidebar(元素, { collapseBelow: 720, onNavigate(a) {} })，返回 { toggle(), select(a) }
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-app" id="app" data-navfx="slide">
        <aside className="sn-side">
          <div className="sn-side-top">
            <span className="sn-logo"></span>
            <b>Satin</b>
            <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse="" data-tip="收起侧栏" data-kbd={"⌘\\"} data-i="panel-left"></button>
          </div>
          <nav className="sn-side-nav">
            <span className="sn-hl-bar"></span>
            <span className="sn-hl-ind"></span>
            <a className="sn-on" data-i="layout-grid:before">
              <span className="sn-lbl">全部项目</span>
            </a>
            <a data-i="image:before">
              <span className="sn-lbl">素材库</span>
            </a>
            <a data-i="clock:before">
              <span className="sn-lbl">任务</span>
              <span className="sn-badge sn-soft">3</span>
            </a>
            <a data-i="users:before">
              <span className="sn-lbl">团队</span>
            </a>
            <p>最近打开</p>
            <a data-i="folder:before">
              <span className="sn-lbl">雨夜车站</span>
            </a>
            <a data-i="folder:before">
              <span className="sn-lbl">海边的第七天</span>
            </a>
          </nav>
          <div className="sn-side-foot">
            <a data-i="settings:before">
              <span className="sn-lbl">设置</span>
            </a>
          </div>
        </aside>
        <main className="sn-app-main">
          <div className="sn-app-head">
            <b>全部项目</b>
            <span className="sn-note">8 个</span>
          </div>
          <div className="sn-app-grid" id="appGrid">
            <div className="sn-gc">
              <span></span>
              <b>雨夜车站</b>
            </div>
            <div className="sn-gc">
              <span></span>
              <b>海边的第七天</b>
            </div>
            <div className="sn-gc">
              <span></span>
              <b>城南旧事</b>
            </div>
            <div className="sn-gc">
              <span></span>
              <b>长夜</b>
            </div>
            <div className="sn-gc">
              <span></span>
              <b>山那边的学校</b>
            </div>
            <div className="sn-gc">
              <span></span>
              <b>最后一班地铁</b>
            </div>
            <div className="sn-gc">
              <span></span>
              <b>雾港</b>
            </div>
            <div className="sn-gc">
              <span></span>
              <b>春天的信</b>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
