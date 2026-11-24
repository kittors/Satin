import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./choice-0.css";

export default function ChoiceDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 复选、单选、开关都是纯标记：勾上时方框轻轻弹一下是 setup() 装好的页面级行为，不用另外接
      // 标记可以照着手写，也可以用标记函数生成，两种一模一样：
      //   import { checkHTML, switchHTML } from "satin-ui/components";
      //   box.innerHTML = checkHTML({ label: "自动保存草稿", checked: true }) + switchHTML({ label: "生成完成后提醒我" });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m auto" style={{ "--min": "200px", alignItems: "start", gap: "24px" }}>
        <div className="stack" style={{ gap: "10px" }}>
          <label className="sn-check"><input type="checkbox" defaultChecked /><span className="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span className="sn-bar"></span>
</span>自动保存草稿</label>
          <label className="sn-check"><input type="checkbox" /><span className="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span className="sn-bar"></span>
</span>生成完成后提醒我</label>
          <label className="sn-check"><input type="checkbox" data-indeterminate="" /><span className="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span className="sn-bar"></span>
</span>全选（部分选中）</label>
          <label className="sn-check"><input type="checkbox" disabled /><span className="sn-box">
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.2l2.4 2.4 4.6-5"></path>
  </svg>
  <span className="sn-bar"></span>
</span>不可用</label>
        </div>
        <div className="stack" style={{ gap: "10px" }} role="radiogroup">
          <label className="sn-radio"><input type="radio" name="q" defaultChecked /><span className="sn-box"></span>标准画质</label>
          <label className="sn-radio"><input type="radio" name="q" /><span className="sn-box"></span>高画质</label>
          <label className="sn-radio"><input type="radio" name="q" /><span className="sn-box"></span>最高画质（更慢）</label>
          <label className="sn-radio"><input type="radio" name="q" disabled /><span className="sn-box"></span>不可用</label>
        </div>
        <div className="stack" style={{ gap: "12px" }}>
          <label className="sn-switch"><input type="checkbox" defaultChecked /><span className="sn-track">
  <span className="sn-knob"></span>
</span>跟随系统外观</label>
          <label className="sn-switch"><input type="checkbox" /><span className="sn-track">
  <span className="sn-knob"></span>
</span>启动时打开上次的项目</label>
          <label className="sn-switch"><input type="checkbox" disabled /><span className="sn-track">
  <span className="sn-knob"></span>
</span>不可用</label>
        </div>
      </div>
    </div>
  );
}
