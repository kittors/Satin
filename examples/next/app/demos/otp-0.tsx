"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createOtp, toast } from "satin-ui/components";

export default function OtpDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 自动跳格、退格回上一格、粘贴自动分配；填进去的数字从下面淡入
      const otp = createOtp(root.querySelector("[data-otp]"), {
        onComplete: (code?: any) => { // 6 位都填满时调：换成你的校验请求
          toast({ text: `已提交验证码 ${code}` });
          window.setTimeout(() => otp.clear(), 1200); // 清空、焦点回第一格
        },
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-otp" data-otp="">
        <input inputMode="numeric" maxLength={1} aria-label="第 1 位" />
        <input inputMode="numeric" maxLength={1} aria-label="第 2 位" />
        <input inputMode="numeric" maxLength={1} aria-label="第 3 位" />
        <span className="sn-gap"></span>
        <input inputMode="numeric" maxLength={1} aria-label="第 4 位" />
        <input inputMode="numeric" maxLength={1} aria-label="第 5 位" />
        <input inputMode="numeric" maxLength={1} aria-label="第 6 位" />
      </div>
    </div>
  );
}
