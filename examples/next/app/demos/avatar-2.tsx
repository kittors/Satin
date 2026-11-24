"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Avatar } from "satin-ui/react";

export default function AvatarDemo2() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-set-list" style={{ maxWidth: "420px" }}>
        <div className="sn-set-row">
          <Avatar name="何慧" decorative online />
          <div className="sn-tx">
            <b>何慧</b>
            <span>前端开发</span>
          </div>
        </div>
        <div className="sn-set-row">
          <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" name="黄磊" decorative />
          <div className="sn-tx">
            <b>黄磊</b>
            <span>产品设计</span>
          </div>
        </div>
        <div className="sn-set-row">
          <Avatar name="徐丽" decorative />
          <div className="sn-tx">
            <b>徐丽</b>
            <span>财务顾问</span>
          </div>
        </div>
      </div>
    </div>
  );
}
