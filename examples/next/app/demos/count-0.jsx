"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createCount, createLongText, toast } from "satin-ui/components";
import "./count-0.css";

export default function CountDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 单行：<input maxlength="20" data-count>，右边的计数跟着滚动，快满变色，写满还在敲时抖一下
      for (const input of root.querySelectorAll("input[data-count]")) createCount(input);

      // 长文本：<div data-ta data-max="120">…<textarea>…</div>
      // 自动长高 + 量环计数；快满"还剩 N 字"，超出"超出 N 字"并整框变红；⌘↵ 提交
      createLongText(root.querySelector("[data-ta]"), { onSubmit: () => toast({ text: "画面描述已保存" }) });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m auto" style={{ "--min": "260px", gap: "24px", alignItems: "start" }}>
        <div className="stack" style={{ gap: "18px" }}>
          <div className="sn-field">
            <label className="sn-lbl" htmlFor="c-title">镜头标题</label>
            <span className="sn-ib sn-has-post sn-has-count">
              <input className="sn-input sn-lg" id="c-title" maxLength="20" placeholder="一句话说清这个镜头" data-count="" />
              <span className="sn-post">
                <span className="sn-counter">
                  <span className="sn-roll">
                    <span>0</span>
                  </span>
                  <span>/20</span>
                </span>
              </span>
            </span>
          </div>
          <div className="sn-field">
            <label className="sn-lbl" htmlFor="c-name">角色名</label>
            <span className="sn-ib sn-has-post sn-has-count">
              <input className="sn-input" id="c-name" maxLength="8" defaultValue="林夏" data-count="" />
              <span className="sn-post">
                <span className="sn-counter">
                  <span className="sn-roll">
                    <span>0</span>
                  </span>
                  <span>/8</span>
                </span>
              </span>
            </span>
          </div>
        </div>
        <div className="sn-field">
          <label className="sn-lbl" htmlFor="c-desc">画面描述</label>
          <div className="sn-box-in" data-ta="" data-max="120" data-max-lines="7">
            <textarea id="c-desc" rows="3" placeholder="写清楚人物、动作和光线，生成会更准。可以一直往下写，框会跟着长高。" />
            <div className="sn-ta-foot">
              <span className="sn-hint">⇧↵ 换行 · ⌘↵ 保存</span>
              <span className="sn-ta-count">
                <svg className="sn-uring" viewBox="0 0 16 16">
                  <circle className="sn-bg" cx="8" cy="8" r="6"></circle>
                  <circle className="sn-fg" cx="8" cy="8" r="6"></circle>
                </svg>
                <span className="sn-txt"><span className="sn-roll">
  <span>0</span>
</span> / 120</span>
              </span>
            </div>
          </div>
          <div className="sn-help">中文、英文、标点都按一个字算；表情按一个字算。</div>
        </div>
      </div>
    </div>
  );
}
