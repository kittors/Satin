"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { busy, succeed } from "satin-ui/components";
import "./button-0.css";

export default function ButtonDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const save = root.querySelector("#save");
      save.addEventListener("click", async () => {
        // 300ms 内回来不转圈；转圈出现后至少留 500ms
        await busy(save, fetch("/api/projects/42", { method: "PUT" }));
        succeed(save);
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="btnSizes">
        <div className="mx-h">
          <span></span>
          <span className="sn-cap">sm 28</span>
          <span className="sn-cap">md 32（默认）</span>
          <span className="sn-cap">lg 40</span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">主按钮</span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-sm">保存修改</button>
            <small>sm 28</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-primary">保存修改</button>
            <small>md 32（默认）</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-lg">保存修改</button>
            <small>lg 40</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">次按钮（默认）</span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-sm">导入原文</button>
            <small>sm 28</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary">导入原文</button>
            <small>md 32（默认）</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-lg">导入原文</button>
            <small>lg 40</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">更灰一档</span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-sm">跳过</button>
            <small>sm 28</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary">跳过</button>
            <small>md 32（默认）</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-lg">跳过</button>
            <small>lg 40</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">无边框</span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-sm">取消</button>
            <small>sm 28</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost">取消</button>
            <small>md 32（默认）</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-lg">取消</button>
            <small>lg 40</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">危险</span>
          <span className="mx-c">
            <button className="sn-btn sn-danger sn-sm">删除项目</button>
            <small>sm 28</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger">删除项目</button>
            <small>md 32（默认）</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger sn-lg">删除项目</button>
            <small>lg 40</small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">次要危险</span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft sn-sm">移除</button>
            <small>sm 28</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft">移除</button>
            <small>md 32（默认）</small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-danger-soft sn-lg">移除</button>
            <small>lg 40</small>
          </span>
        </div>
      </div>
    </div>
  );
}
