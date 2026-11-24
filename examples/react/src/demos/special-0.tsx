import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createPassword, createEmail, createSearch } from "satin-ui/components";
import "./special-0.css";

export default function SpecialDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 密码：四段强度条 + 文字，不到 8 位提示还差几位；大写锁定开着时提示
      createPassword(root.querySelector("input[data-pw]"));

      // 邮箱：停手 400ms 再判断，对了画对勾；离开时还不对才报错
      createEmail(root.querySelector("input[data-email]"));

      // 搜索：等待超过 300ms 才转圈、转了至少 500ms；search 返回结果数量（或 Promise）。换成你的搜索接口
      const SHOTS = ["车站外，雨刚停", "林夏走进候车厅", "站台上的最后一班车", "车窗里的倒影", "雨夜的公交站"];
      createSearch(root.querySelector("[data-search]"), {
        search: (q?: any) => new Promise((done?: any) => window.setTimeout(() => done(SHOTS.filter((s?: any) => s.includes(q)).length), 400)),
      });
      // 清除按钮（[data-clearable]）有内容时出现、点了清空，显示密码（[data-eye]）切换明文——这两个 enhance() 已经接上
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m auto" style={{ "--min": "200px", gap: "20px", alignItems: "start" }}>
        <div className="sn-field">
          <span className="sn-lbl">搜索</span>
          <span className="sn-ib sn-has-pre sn-has-post sn-search" data-clearable="" data-search="">
            <span className="sn-pre">
              <span className="sn-swap">
                <span className="sn-a" data-i="search"></span>
                <span className="sn-b">
                  <span className="sn-spin-ic"></span>
                </span>
              </span>
            </span>
            <input className="sn-input" placeholder="搜索镜头、角色" />
            <span className="sn-post">
              <span className="sn-res-count"></span>
              <span className="sn-kbd">/</span>
              <button className="sn-clear" aria-label="清除" data-i="x"></button>
            </span>
          </span>
          <div className="sn-help">试试输入"雨"或"站台"，按 / 也能直接跳到这里。</div>
        </div>
        <div className="sn-field">
          <label className="sn-lbl" htmlFor="pw1">设置密码</label>
          <span className="sn-ib sn-has-post">
            <input className="sn-input" type="password" id="pw1" placeholder="至少 8 位，字母加数字更安全" data-pw="" />
            <span className="sn-post">
              <button className="sn-eye" data-eye="" aria-label="显示密码">
                <span className="sn-swap">
                  <span className="sn-a" data-i="eye"></span>
                  <span className="sn-b" data-i="eye-off"></span>
                </span>
              </button>
            </span>
          </span>
          <div className="sn-pw-meter" data-level="0" aria-live="polite">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <span className="sn-pw-label">
              <span className="sn-roll">
                <span></span>
              </span>
            </span>
          </div>
          <div className="sn-caps">
            <span><span data-i="triangle-alert"></span>大写锁定已打开</span>
          </div>
        </div>
        <div className="sn-field">
          <label className="sn-lbl" htmlFor="em1">通知邮箱</label>
          <span className="sn-ib sn-has-post">
            <input className="sn-input" type="email" id="em1" placeholder="name@example.com" data-email="" />
            <span className="sn-post">
              <svg className="sn-ok-mark" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 8.5l3 3 6-7"></path>
              </svg>
            </span>
          </span>
          <div className="sn-err">
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
