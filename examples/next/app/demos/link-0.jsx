"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./link-0.css";

export default function LinkDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <p className="sn-t-body">登录即表示你同意<a className="sn-link" href="#link">用户协议</a>和<a className="sn-link" href="#link">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>
      <div className="row" style={{ gap: "28px" }}>
        <button className="sn-textbtn">查看全部项目<span data-i="arrow-right:after"></span></button>
        <button className="sn-textbtn">编辑</button>
        <button className="sn-textbtn sn-quiet">忘记密码？</button>
        <button className="sn-textbtn sn-quiet">取消</button>
        <button className="sn-textbtn sn-danger-text">去处理<span data-i="arrow-right:after"></span></button>
      </div>
    </div>
  );
}
