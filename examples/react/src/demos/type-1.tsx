import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./type-1.css";

export default function TypeDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" id="tones">
        <span className="sn-t-body sn-c-primary">主文字</span>
        <span className="sn-t-body sn-c-secondary">副信息</span>
        <span className="sn-t-body sn-c-tertiary">时间、占位</span>
        <span className="sn-t-body sn-c-off">禁用</span>
        <span className="sn-t-body sn-c-danger">失败、删除</span>
        <span className="sn-t-body sn-c-success">成功（瞬时反馈）</span>
        <span className="sn-t-body sn-c-warning">系统警告</span>
      </div>
    </div>
  );
}
