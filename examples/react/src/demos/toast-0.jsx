import { useEffect, useRef } from "react";
import { setup, enhance, initSeg } from "satin-ui";
import { toast, setToastPos } from "satin-ui/components";
import "./toast-0.css";

export default function ToastDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 不用写标记：第一次调 toast() 时在 body 末尾建一个 .sn-toasts 容器。这里四个按钮各演示一种
      const exportToast = (name) => {
        const t = toast({ kind: "progress", text: `正在导出 ${name}` }); let p = 0;
        const iv = setInterval(() => { // 换成你的导出进度
          p = Math.min(1, p + 0.06 + Math.random() * 0.05); t.update({ progress: p });
          if (p >= 1) { clearInterval(iv); setTimeout(() => t.update({ kind: "status", text: '已导出到"下载"', action: { label: "打开", run: (x) => x.close() }, duration: 5000, done: true }), 260); }
        }, 200);
      };
      const DEMO = {
        status: () => toast({ text: "链接已复制" }), // 对勾 + 一句话，3 秒后自己收起
        action: () => toast({ kind: "action", text: '已归档"雨夜车站"', action: { label: "撤销", run: (t) => t.update({ kind: "status", text: '已恢复"雨夜车站"', done: true, duration: 2000 }) } }), // 倒计时环 + 按钮
        progress: () => exportToast("第三集.mp4"), // 进度环 + 百分比，直到 update 成结果
        fail: () => toast({ icon: "circle-x", tone: "danger", text: "复制失败，请再试一次", alert: true }), // 读屏立即播报
      };
      for (const [kind, show] of Object.entries(DEMO)) root.querySelector(`[data-toast="${kind}"]`)?.addEventListener("click", show);
      // 位置：后台放顶部居中（默认），客户端放底部居中
      const pos = root.querySelector('[data-seg="toastpos"]');
      if (pos) initSeg(pos, (v) => setToastPos(v));
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="grid-m lc">
        <span className="sn-cap">位置</span>
        <div className="row">
          <div className="sn-seg sn-sm" data-seg="toastpos">
            <span className="sn-thumb"></span>
            <button data-v="top">后台：顶部居中</button>
            <button data-v="bottom">客户端：底部居中</button>
          </div>
        </div>
        <span className="sn-cap">三种</span>
        <div className="row">
          <button className="sn-btn sn-secondary" data-toast="status" data-i="link:before">复制链接</button>
          <button className="sn-btn sn-secondary" data-toast="action" data-i="archive:before">归档项目</button>
          <button className="sn-btn sn-secondary" data-toast="progress" data-i="download:before">导出第三集</button>
          <button className="sn-btn sn-secondary" data-toast="fail">模拟复制失败</button>
        </div>
      </div>
    </div>
  );
}
