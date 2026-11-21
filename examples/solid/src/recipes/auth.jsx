import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";

export default function Auth() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <main class="sn-auth">
        <div class="sn-panel">
          <h1>登录分镜工作台</h1>
          <p>用工作邮箱登录，团队成员会自动加入你的空间。</p>
          <form class="sn-form" style="margin-top: var(--sn-sp-24)" novalidate>
            <div class="sn-field" data-f="mail">
              <label class="sn-lbl" for="l-mail">邮箱</label>
              <input class="sn-input sn-lg" id="l-mail" type="email" autocomplete="email" placeholder="name@company.com" />
              <div class="sn-err">
                <span></span>
              </div>
            </div>
            <div class="sn-field" data-f="pwd">
              <label class="sn-lbl" for="l-pwd">密码 <a class="sn-aside sn-link" href="/forgot">忘记密码？</a></label>
              {" "}
              <span class="sn-ib sn-has-post">
                <input class="sn-input sn-lg" id="l-pwd" type="password" autocomplete="current-password" />
                <span class="sn-post">
                  <button type="button" class="sn-eye" data-eye="" aria-label="显示密码">
                    <span class="sn-swap">
                      <span class="sn-a" data-i="eye"></span>
                      <span class="sn-b" data-i="eye-off"></span>
                    </span>
                  </button>
                </span>
              </span>
              <div class="sn-err">
                <span></span>
              </div>
            </div>
            <label class="sn-check"><input type="checkbox" checked /><span class="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span class="sn-bar"></span>
</span>30 天内保持登录</label>
            {" "}
            <button class="sn-btn sn-primary sn-lg" type="submit" style="width: 100%">登录</button>
          </form>
          <p class="sn-t-callout sn-c-tertiary" style="margin-top: var(--sn-sp-20); text-align: center">还没有账号？<a class="sn-link" href="/signup">注册</a></p>
        </div>
      </main>
    </div>
  );
}
