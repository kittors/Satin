import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function Landing() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <header className="sn-page sn-wide" style={{ paddingBlock: "var(--sn-sp-16)" }}>
        <div className="sn-row sn-between">
          <b className="sn-t-title3">分镜工作台</b>
          <nav className="sn-row sn-gap-4">
            <a className="sn-btn sn-ghost sn-sm" href="#features">功能</a>
            <a className="sn-btn sn-ghost sn-sm" href="#pricing">价格</a>
            <a className="sn-btn sn-ghost sn-sm" href="/docs">文档</a>
          </nav>
          <div className="sn-row sn-gap-8">
            <a className="sn-btn sn-ghost" href="/login">登录</a>
            <a className="sn-btn sn-primary" href="/signup">免费试用</a>
          </div>
        </div>
      </header>
      <main>
        <section className="sn-page sn-wide" style={{ paddingBlock: "var(--sn-sp-64) var(--sn-sp-48)" }}>
          <div className="sn-stack sn-gap-16" style={{ maxWidth: "640px" }}>
            <h1 className="sn-t-display">把剧本变成可以拍的分镜</h1>
            <p className="sn-t-body sn-c-secondary">导入一集剧本，几分钟得到每个镜头的景别、时长和画面描述；导演改一句，后面的镜头跟着调整。</p>
            <div className="sn-row sn-gap-8">
              <a className="sn-btn sn-primary sn-lg" href="/signup">免费试用 14 天</a>
              <a className="sn-btn sn-secondary sn-lg" href="/demo">看 2 分钟演示</a>
            </div>
          </div>
          <img src="/screenshot-editor.png" alt="分镜编辑器：左边剧本，右边按镜头排好的画面" style={{ marginTop: "var(--sn-sp-40)", width: "100%", borderRadius: "var(--sn-r-xl)", border: "1px solid var(--sn-line)" }} />
        </section>
        <section id="features" className="sn-page sn-wide" style={{ paddingBlock: "var(--sn-sp-48)" }}>
          <div className="sn-cols sn-gap-32" style={{ "--sn-min": "240px" }}>
            <div className="sn-stack sn-gap-8">
              <span data-i="clapperboard"></span>
              <h2 className="sn-t-title3">按镜头拆好</h2>
              <p className="sn-t-callout sn-c-secondary">每场戏拆成镜头，标好景别、时长和机位，导出给摄影直接用。</p>
            </div>
            <div className="sn-stack sn-gap-8">
              <span data-i="users"></span>
              <h2 className="sn-t-title3">多人一起改</h2>
              <p className="sn-t-callout sn-c-secondary">导演、编剧、美术在同一份分镜上批注，谁改了什么都留着记录。</p>
            </div>
            <div className="sn-stack sn-gap-8">
              <span data-i="download"></span>
              <h2 className="sn-t-title3">导出成片脚本</h2>
              <p className="sn-t-callout sn-c-secondary">导出 PDF 分镜本、Excel 拍摄表，或者直接生成 30 秒的样片。</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="sn-page sn-wide sn-t-caption sn-c-tertiary" style={{ borderTop: "1px solid var(--sn-line)", paddingBlock: "var(--sn-sp-24)" }}>© 2026 分镜工作台 · <a className="sn-link" href="/privacy">隐私</a> · <a className="sn-link" href="/terms">条款</a></footer>
    </div>
  );
}
