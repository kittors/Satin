"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Segmented } from "satin-ui/react";

export default function Settings() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-page sn-narrow">
        <header className="sn-page-hd">
          <div>
            <h1>设置</h1>
            <p>账户、通知和默认的生成参数</p>
          </div>
        </header>
        <div className="sn-panel">
          <section className="sn-setting">
            <div>
              <h3>个人资料</h3>
              <p>团队成员会看到你的名字和头像。</p>
            </div>
            <form className="sn-form" noValidate>
              <div className="sn-field" data-f="name">
                <label className="sn-lbl" htmlFor="s-name">名字</label>
                <input className="sn-input" id="s-name" defaultValue="林夏" />
                <div className="sn-err">
                  <span></span>
                </div>
              </div>
              <div className="sn-field" data-f="mail">
                <label className="sn-lbl" htmlFor="s-mail">邮箱</label>
                <input className="sn-input" id="s-mail" type="email" defaultValue="linxia@example.com" />
                <div className="sn-help">用来登录和接收通知。</div>
                <div className="sn-err">
                  <span></span>
                </div>
              </div>
              <div className="sn-form-ft">
                <button className="sn-btn sn-primary" type="submit">保存修改</button>
              </div>
            </form>
          </section>
          <section className="sn-setting">
            <div>
              <h3>通知</h3>
              <p>改了马上生效。</p>
            </div>
            <div className="sn-stack sn-gap-12">
              <label className="sn-switch"><input type="checkbox" role="switch" defaultChecked /><span className="sn-track">
  <span className="sn-knob"></span>
</span>生成完成时提醒我</label>
              <label className="sn-switch"><input type="checkbox" role="switch" /><span className="sn-track">
  <span className="sn-knob"></span>
</span>每周发一封项目周报</label>
            </div>
          </section>
          <section className="sn-setting">
            <div>
              <h3>默认画面比例</h3>
              <p>新建项目时用这个比例。</p>
            </div>
            <div>
              <Segmented items={["16:9 横屏","9:16 竖屏","1:1 方形"]} defaultValue="16:9 横屏" />
            </div>
          </section>
          <section className="sn-setting">
            <div>
              <h3>删除账户</h3>
              <p>所有项目和素材会一起删除，不能恢复。</p>
            </div>
            <div>
              <button className="sn-btn sn-danger-soft">删除账户…</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
