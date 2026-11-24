"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Avatar } from "satin-ui/react";
import "./avatar-1.css";

export default function AvatarDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ gap: "12px" }}>
        <Avatar name="张伟" size={40} />
        <Avatar name="何慧" size={40} />
        <Avatar name="徐丽" size={40} />
        <Avatar name="梁静" size={40} />
        <Avatar name="冯磊" size={40} />
        <Avatar name="赵敏" size={40} />
        <Avatar name="陈静" size={40} />
        <Avatar name="罗军" size={40} />
        <Avatar name="潘涛" size={40} />
        <Avatar name="赵启航" size={40} />
        <Avatar name="沈念" size={40} />
        <Avatar name="黄磊" size={40} />
      </div>
    </div>
  );
}
