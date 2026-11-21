import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { busy } from "satin-ui/components";

export default function BannerDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // 横幅里的 [data-dismiss]：enhance() 已经接上——点了给 .sn-banner-wrap 加 .sn-closing，高度过渡收起，下面的内容跟着上来

      // 网络断了：点"重新连接"，等待结束后原地变成成功，过一会儿自己收起
      const net = root.querySelector("[data-retry-net]");
      net.addEventListener("click", async () => {
        const banner = net.closest(".sn-banner");
        await busy(net, 1000); // 换成你的重连请求（Promise）
        banner.classList.replace("sn-bad", "sn-ok"); banner.setAttribute("role", "status");
        banner.querySelector(".sn-msg").innerHTML = "<b>已重新连接</b>，改动都同步好了。";
        net.remove();
        setTimeout(() => banner.parentElement.classList.add("sn-closing"), 1600);
      });

      // 条目上的失败：点"修改后重新生成"，成功后整行恢复正常
      const fix = root.querySelector("[data-fix]");
      fix?.addEventListener("click", async () => {
        const row = fix.closest(".sn-shot-row");
        await busy(fix, 1100); // 换成你的重新生成请求
        row.classList.remove("sn-failed");
        fix.parentElement.classList.add("sn-off");
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-banner-wrap">
        <div className="sn-banner sn-warn" role="status">
          <span data-i="triangle-alert"></span>
          <div className="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div>
          <button className="sn-btn sn-secondary sn-sm">查看额度</button>
          <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-dismiss="" data-tip="关闭" data-i="x"></button>
        </div>
      </div>
      <div className="sn-banner-wrap">
        <div className="sn-banner sn-bad" role="alert">
          <span data-i="wifi-off"></span>
          <div className="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div>
          <button className="sn-btn sn-ghost sn-sm" data-retry-net="">重新连接</button>
        </div>
      </div>
      <div className="sn-banner-wrap">
        <div className="sn-banner" role="status">
          <span data-i="download"></span>
          <div className="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
          <button className="sn-btn sn-secondary sn-sm">重启</button>
          <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-dismiss="" data-tip="关闭" data-i="x"></button>
        </div>
      </div>
      <div className="sn-card-list">
        <div className="sn-shot-row sn-failed" id="failRow">
          <span className="sn-thumb" style={{ "--sn-g": "linear-gradient(135deg,#4b5d73,#1d2530)" }}>
            <span data-i="image-off"></span>
          </span>
          <div className="sn-meta">
            <b>镜头 11 · 雨夜里的公交站</b>
            <span className="sn-state">
              <span className="sn-bad-line"><span data-i="circle-alert"></span>没有生成：画面描述里有不允许的内容</span>
              <span className="sn-ok-line">近景 · 4 秒 · 已生成</span>
            </span>
          </div>
          <div className="sn-acts">
            <button className="sn-btn sn-secondary sn-sm">修改描述</button>
            <button className="sn-btn sn-ghost sn-sm" data-act="" data-fix="">重试</button>
          </div>
        </div>
      </div>
    </div>
  );
}
