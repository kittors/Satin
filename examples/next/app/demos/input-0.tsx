"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./input-0.css";

export default function InputDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m auto" style={{ "--min": "200px", gap: "20px 20px", alignItems: "start" }} id="inputStates">
        <div className="sn-field">
          <span className="sn-cap">默认</span>
          <input className="sn-input" defaultValue="" placeholder="name@example.com" />
          <div className="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-cap">悬停</span>
          <input className="sn-input sn-is-hover" defaultValue="owner@example.com" placeholder="name@example.com" />
          <div className="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-cap">聚焦</span>
          <input className="sn-input sn-is-focus" defaultValue="owner@example.com" placeholder="name@example.com" />
          <div className="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div className="sn-field sn-bad">
          <span className="sn-cap">错误</span>
          <input className="sn-input" defaultValue="owner@example.com" placeholder="name@example.com" />
          <div className="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-cap">禁用</span>
          <input className="sn-input sn-is-disabled" defaultValue="owner@example.com" placeholder="name@example.com" disabled />
          <div className="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-cap">只读</span>
          <input className="sn-input sn-is-readonly" defaultValue="owner@example.com" placeholder="name@example.com" readOnly />
          <div className="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
      </div>
    </div>
  );
}
