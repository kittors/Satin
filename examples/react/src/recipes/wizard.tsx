import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Segmented } from "satin-ui/react";

export default function Wizard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-page sn-narrow sn-screen">
        <header className="sn-page-hd">
          <a className="sn-nav-back" href="/projects" data-i="chevron-left:before">全部项目</a>
          <div>
            <h1>新建项目</h1>
          </div>
        </header>
        <div className="sn-steps" style={{ marginBottom: "var(--sn-sp-24)" }}>
          <span className="sn-st sn-done"><span className="sn-n">1</span>基本信息</span>
          <span className="sn-ln sn-done">
            <i></i>
          </span>
          <span className="sn-st sn-cur"><span className="sn-n">2</span>导入原文</span>
          <span className="sn-ln">
            <i></i>
          </span>
          <span className="sn-st"><span className="sn-n">3</span>生成设置</span>
        </div>
        <form className="sn-panel sn-grow" noValidate>
          <div className="sn-form" style={{ maxWidth: "none" }}>
            <div className="sn-field" data-f="src">
              <span className="sn-lbl">从哪里开始</span>
              <Segmented items={["小说改编","原创剧本","空白项目"]} defaultValue="小说改编" />
            </div>
            <div className="sn-field" data-f="text">
              <label className="sn-lbl" htmlFor="w-text">粘贴原文</label>
              <textarea className="sn-input" id="w-text" rows={5} placeholder="把第一集的原文贴在这里" />
              <div className="sn-help">最多 2&nbsp;万字；更长的分几集导入。</div>
              <div className="sn-err">
                <span></span>
              </div>
            </div>
          </div>
          <div className="sn-bottom-bar" style={{ justifyContent: "space-between" }}>
            <button type="button" className="sn-btn sn-ghost sn-lg" data-i="arrow-left:before">上一步</button>
            <button type="submit" className="sn-btn sn-primary sn-lg">下一步</button>
          </div>
        </form>
      </div>
    </div>
  );
}
