import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { toast } from "satin-ui/components";

export default function SidebarDemo0() {
  let root!: HTMLDivElement;
  let off = () => {};
  onSettled(() => {
    if (!root) return;
    const unsetup = setup();
    const done = enhance(root, (root: any) => {
      // 侧栏布局 enhance() 已经接上：选中的底色 / 指示条在条目之间滑动（.sn-app 上 data-navfx="slide | bar | fade | text"）；
      // [data-collapse] 收起 / 展开（⌘\ 也行），主区宽度连续变，卡片按新列数从原位置滑过去；窄于 720 自动收成图标栏（data-collapse-below 可改）
      // 点导航：换成你的路由跳转
      root.querySelector(".sn-side-nav").addEventListener("click", (e?: any) => {
        const a = e.target.closest("a[href]"); if (!a) return;
        e.preventDefault(); toast({ text: `打开"${a.textContent.trim()}"` });
      });
      // 自己创建也行：createSidebar(元素, { collapseBelow: 720, onNavigate(a) {} })，返回 { toggle(), select(a) }
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el: HTMLDivElement) => (root = el)}>
      <div class="sn-app" id="app" data-navfx="slide">
        <aside class="sn-side">
          <div class="sn-side-top">
            <span class="sn-logo"></span>
            <b>Satin</b>
            <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse="" data-tip="收起侧栏" data-kbd={"⌘\\"} data-i="panel-left"></button>
          </div>
          <nav class="sn-side-nav">
            <span class="sn-hl-bar"></span>
            <span class="sn-hl-ind"></span>
            <a class="sn-on" data-i="layout-grid:before">
              <span class="sn-lbl">全部项目</span>
            </a>
            <a data-i="image:before">
              <span class="sn-lbl">素材库</span>
            </a>
            <a data-i="clock:before">
              <span class="sn-lbl">任务</span>
              <span class="sn-badge sn-soft">3</span>
            </a>
            <a data-i="users:before">
              <span class="sn-lbl">团队</span>
            </a>
            <p>最近打开</p>
            <a data-i="folder:before">
              <span class="sn-lbl">雨夜车站</span>
            </a>
            <a data-i="folder:before">
              <span class="sn-lbl">海边的第七天</span>
            </a>
          </nav>
          <div class="sn-side-foot">
            <a data-i="settings:before">
              <span class="sn-lbl">设置</span>
            </a>
          </div>
        </aside>
        <main class="sn-app-main">
          <div class="sn-app-head">
            <b>全部项目</b>
            <span class="sn-note">8&nbsp;个</span>
          </div>
          <div class="sn-app-grid" id="appGrid">
            <div class="sn-gc">
              <span></span>
              <b>雨夜车站</b>
            </div>
            <div class="sn-gc">
              <span></span>
              <b>海边的第七天</b>
            </div>
            <div class="sn-gc">
              <span></span>
              <b>城南旧事</b>
            </div>
            <div class="sn-gc">
              <span></span>
              <b>长夜</b>
            </div>
            <div class="sn-gc">
              <span></span>
              <b>山那边的学校</b>
            </div>
            <div class="sn-gc">
              <span></span>
              <b>最后一班地铁</b>
            </div>
            <div class="sn-gc">
              <span></span>
              <b>雾港</b>
            </div>
            <div class="sn-gc">
              <span></span>
              <b>春天的信</b>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
