import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Avatar } from "satin-ui/react";
import "./avatar-0.css";

export default function AvatarDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ gap: "14px" }}>
        <Avatar seed="u4" name="周屿" size={16} />
        <Avatar seed="u4" name="周屿" size={20} />
        <Avatar seed="u4" name="周屿" size={24} />
        <Avatar seed="u4" name="周屿" />
        <Avatar seed="u4" name="周屿" size={40} />
        <Avatar seed="u4" name="周屿" size={64} />
      </div>
    </div>
  );
}
