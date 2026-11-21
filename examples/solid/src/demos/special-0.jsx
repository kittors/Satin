import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createPassword, createEmail, createSearch } from "satin-ui/components";
import "./special-0.css";

export default function SpecialDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      // 密码：四段强度条 + 文字，不到 8 位提示还差几位；大写锁定开着时提示
      createPassword(root.querySelector("input[data-pw]"));

      // 邮箱：停手 400ms 再判断，对了画对勾；离开时还不对才报错
      createEmail(root.querySelector("input[data-email]"));

      // 搜索：等待超过 300ms 才转圈、转了至少 500ms；search 返回结果数量（或 Promise）。换成你的搜索接口
      const SHOTS = ["车站外，雨刚停", "林夏走进候车厅", "站台上的最后一班车", "车窗里的倒影", "雨夜的公交站"];
      createSearch(root.querySelector("[data-search]"), {
        search: (q) => new Promise((done) => setTimeout(() => done(SHOTS.filter((s) => s.includes(q)).length), 400)),
      });
      // 清除按钮（[data-clearable]）有内容时出现、点了清空，显示密码（[data-eye]）切换明文——这两个 enhance() 已经接上
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="grid-m auto" style="--min:200px;gap:20px;align-items:start">
        <div class="sn-field">
          <span class="sn-lbl">搜索</span>
          <span class="sn-ib sn-has-pre sn-has-post sn-search" data-clearable="" data-search="">
            <span class="sn-pre">
              <span class="sn-swap">
                <span class="sn-a" data-i="search"></span>
                <span class="sn-b">
                  <span class="sn-spin-ic"></span>
                </span>
              </span>
            </span>
            <input class="sn-input" placeholder="搜索镜头、角色" />
            <span class="sn-post">
              <span class="sn-res-count"></span>
              <span class="sn-kbd">/</span>
              <button class="sn-clear" aria-label="清除" data-i="x"></button>
            </span>
          </span>
          <div class="sn-help">试试输入"雨"或"站台"，按 / 也能直接跳到这里。</div>
        </div>
        <div class="sn-field">
          <label class="sn-lbl" for="pw1">设置密码</label>
          <span class="sn-ib sn-has-post">
            <input class="sn-input" type="password" id="pw1" placeholder="至少 8 位，字母加数字更安全" data-pw="" />
            <span class="sn-post">
              <button class="sn-eye" data-eye="" aria-label="显示密码">
                <span class="sn-swap">
                  <span class="sn-a" data-i="eye"></span>
                  <span class="sn-b" data-i="eye-off"></span>
                </span>
              </button>
            </span>
          </span>
          <div class="sn-pw-meter" data-level="0" aria-live="polite">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <span class="sn-pw-label">
              <span class="sn-roll">
                <span></span>
              </span>
            </span>
          </div>
          <div class="sn-caps">
            <span><span data-i="triangle-alert"></span>大写锁定已打开</span>
          </div>
        </div>
        <div class="sn-field">
          <label class="sn-lbl" for="em1">通知邮箱</label>
          <span class="sn-ib sn-has-post">
            <input class="sn-input" type="email" id="em1" placeholder="name@example.com" data-email="" />
            <span class="sn-post">
              <svg class="sn-ok-mark" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3.5 8.5l3 3 6-7"></path>
              </svg>
            </span>
          </span>
          <div class="sn-err">
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
