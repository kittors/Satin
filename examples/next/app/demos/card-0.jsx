"use client";
import { useEffect, useRef } from "react";
import { setup, enhance, injectIcons } from "satin-ui";
import { openMenu, toast } from "satin-ui/components";

export default function CardDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 卡片本身是标记：封面、标题、元信息；左上角的勾选框多选，右上角"更多"弹菜单
      const cards = root.querySelector("#pcards");
      const menu = document.createElement("div"); // 菜单也可以直接写在标记里
      menu.className = "sn-menu sn-float"; menu.setAttribute("role", "menu");
      menu.innerHTML = '<div class="sn-item" data-i="pencil:before">重命名</div><div class="sn-item" data-i="copy:before">复制一份</div><div class="sn-sep"></div><div class="sn-item sn-danger-item" data-i="trash-2:before">移到回收站</div>';
      injectIcons(menu); cards.after(menu);
      menu.addEventListener("menuselect", (e) => toast({ text: e.detail.label }));

      cards.addEventListener("change", (e) => e.target.closest(".sn-pc")?.classList.toggle("sn-sel", e.target.checked));
      cards.addEventListener("click", (e) => {
        const more = e.target.closest("[data-card-more]");
        if (more) { e.stopPropagation(); openMenu(menu, { trigger: more, anchor: more, align: "end" }); return; }
        if (e.target.closest(".sn-pick")) return;
        const card = e.target.closest(".sn-pc"); if (card) toast({ icon: "info", text: `这里会打开"${card.getAttribute("aria-label")}"` });
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-pcards" id="pcards">
        <div className="sn-pc" data-card="0" aria-label="雨夜车站">
          <div className="sn-cover">
            <span className="sn-art"></span>
            <label className="sn-check sn-pick" aria-label="选择">
              <input type="checkbox" />
              <span className="sn-box">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                </svg>
                <span className="sn-bar"></span>
              </span>
            </label>
            <button className="sn-btn sn-ibtn sn-sm sn-more" data-card-more="" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <span className="sn-len">12:36</span>
          </div>
          <div className="sn-meta">
            <b>雨夜车站</b>
            <span className="sn-sub">48 个镜头 · 3 分钟前<span className="sn-av-group">
  <span className="sn-av sn-xs">林</span>
</span></span>
          </div>
        </div>
        <div className="sn-pc" data-card="1" aria-label="海边的第七天">
          <div className="sn-cover">
            <span className="sn-art"></span>
            <label className="sn-check sn-pick" aria-label="选择">
              <input type="checkbox" />
              <span className="sn-box">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                </svg>
                <span className="sn-bar"></span>
              </span>
            </label>
            <button className="sn-btn sn-ibtn sn-sm sn-more" data-card-more="" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <span className="sn-len">8:32</span>
          </div>
          <div className="sn-meta">
            <b>海边的第七天</b>
            <span className="sn-sub">32 个镜头 · 12 分钟前<span className="sn-av-group">
  <span className="sn-av sn-xs">周</span>
  <span className="sn-av sn-xs">陈</span>
</span></span>
          </div>
        </div>
        <div className="sn-pc" data-card="2" aria-label="城南旧事（第二版）">
          <div className="sn-cover">
            <span className="sn-art"></span>
            <label className="sn-check sn-pick" aria-label="选择">
              <input type="checkbox" />
              <span className="sn-box">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                </svg>
                <span className="sn-bar"></span>
              </span>
            </label>
            <button className="sn-btn sn-ibtn sn-sm sn-more" data-card-more="" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <span className="sn-len">3:00</span>
          </div>
          <div className="sn-meta">
            <b>城南旧事（第二版）</b>
            <span className="sn-sub">12 个镜头 · 1 小时前<span className="sn-av-group">
  <span className="sn-av sn-xs">陈</span>
  <span className="sn-av sn-xs">许</span>
  <span className="sn-av sn-xs">李</span>
</span></span>
          </div>
        </div>
        <div className="sn-pc" data-card="3" aria-label="长夜">
          <div className="sn-cover">
            <span className="sn-art"></span>
            <label className="sn-check sn-pick" aria-label="选择">
              <input type="checkbox" />
              <span className="sn-box">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                </svg>
                <span className="sn-bar"></span>
              </span>
            </label>
            <button className="sn-btn sn-ibtn sn-sm sn-more" data-card-more="" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <span className="sn-len">5:00</span>
          </div>
          <div className="sn-meta">
            <b>长夜</b>
            <span className="sn-sub">20 个镜头 · 昨天<span className="sn-av-group">
  <span className="sn-av sn-xs">许</span>
</span></span>
          </div>
        </div>
        <div className="sn-pc" data-card="4" aria-label="山那边的学校">
          <div className="sn-cover">
            <span className="sn-art"></span>
            <label className="sn-check sn-pick" aria-label="选择">
              <input type="checkbox" />
              <span className="sn-box">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                </svg>
                <span className="sn-bar"></span>
              </span>
            </label>
            <button className="sn-btn sn-ibtn sn-sm sn-more" data-card-more="" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <span className="sn-len">17:02</span>
          </div>
          <div className="sn-meta">
            <b>山那边的学校</b>
            <span className="sn-sub">64 个镜头 · 昨天<span className="sn-av-group">
  <span className="sn-av sn-xs">李</span>
  <span className="sn-av sn-xs">林</span>
</span></span>
          </div>
        </div>
        <div className="sn-pc" data-card="5" aria-label="最后一班地铁">
          <div className="sn-cover">
            <span className="sn-art"></span>
            <label className="sn-check sn-pick" aria-label="选择">
              <input type="checkbox" />
              <span className="sn-box">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
                </svg>
                <span className="sn-bar"></span>
              </span>
            </label>
            <button className="sn-btn sn-ibtn sn-sm sn-more" data-card-more="" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <span className="sn-len">7:00</span>
          </div>
          <div className="sn-meta">
            <b>最后一班地铁</b>
            <span className="sn-sub">28 个镜头 · 11 月 14 日<span className="sn-av-group">
  <span className="sn-av sn-xs">林</span>
  <span className="sn-av sn-xs">周</span>
  <span className="sn-av sn-xs">陈</span>
</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
