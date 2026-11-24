import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function Auth() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <main className="sn-auth">
        <div className="sn-panel">
          <h1>登录分镜工作台</h1>
          <p>用工作邮箱登录，团队成员会自动加入你的空间。</p>
          <form className="sn-form" noValidate>
            <div className="sn-field" data-f="mail">
              <label className="sn-lbl" htmlFor="l-mail">邮箱</label>
              <input className="sn-input sn-lg" id="l-mail" type="email" autoComplete="email" placeholder="name@company.com" />
              <div className="sn-err">
                <span></span>
              </div>
            </div>
            <div className="sn-field" data-f="pwd">
              <label className="sn-lbl" htmlFor="l-pwd">密码 <a className="sn-aside sn-link" href="/forgot">忘记密码？</a></label>
              <span className="sn-ib sn-has-post">
                <input className="sn-input sn-lg" id="l-pwd" type="password" autoComplete="current-password" />
                <span className="sn-post">
                  <button type="button" className="sn-eye" data-eye="" aria-label="显示密码">
                    <span className="sn-swap">
                      <span className="sn-a" data-i="eye"></span>
                      <span className="sn-b" data-i="eye-off"></span>
                    </span>
                  </button>
                </span>
              </span>
              <div className="sn-err">
                <span></span>
              </div>
            </div>
            <label className="sn-check"><input type="checkbox" defaultChecked /><span className="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span className="sn-bar"></span>
</span>30&nbsp;天内保持登录</label>
            <button className="sn-btn sn-primary sn-lg" type="submit" style={{ width: "100%" }}>登录</button>
          </form>
          <p className="sn-auth-ft">还没有账号？<a className="sn-link" href="/signup">注册</a></p>
        </div>
      </main>
    </div>
  );
}
