import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { busy } from "satin-ui/components";

export default function BannerDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current, (root: any) => {
      // 横幅里的 [data-dismiss]：enhance() 已经接上——点了给 .sn-banner-wrap 加 .sn-closing，高度过渡收起，下面的内容跟着上来

      // 网络断了：点"重新连接"，等待结束后原地变成成功，过一会儿自己收起
      const net = root.querySelector("[data-retry-net]");
      net.addEventListener("click", async () => {
        const banner = net.closest(".sn-banner");
        await busy(net, 1000); // 换成你的重连请求（Promise）
        banner.classList.replace("sn-bad", "sn-ok"); banner.setAttribute("role", "status");
        banner.querySelector(".sn-msg").innerHTML = "<b>已重新连接</b>，改动都同步好了。";
        net.remove();
        window.setTimeout(() => banner.parentElement.classList.add("sn-closing"), 1600);
      });

      // 条目上的失败：点"修改后重新生成"，成功后整行恢复正常
      const fix = root.querySelector("[data-fix]");
      fix?.addEventListener("click", async () => {
        const row = fix.closest(".sn-shot-row");
        await busy(fix, 1100); // 换成你的重新生成请求
        row.classList.remove("sn-failed");
        fix.parentElement.classList.add("sn-off");
      });
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-banner-wrap">
        <div class="sn-banner sn-warn" role="status">
          <span data-i="triangle-alert"></span>
          <div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div>
          <button class="sn-btn sn-secondary sn-sm">查看额度</button>
          <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-dismiss="" data-tip="关闭" data-i="x"></button>
        </div>
      </div>
      <div class="sn-banner-wrap">
        <div class="sn-banner sn-bad" role="alert">
          <span data-i="wifi-off"></span>
          <div class="sn-msg"><b>网络断开了</b>，改动先存在这台电脑上，恢复后自动同步。</div>
          <button class="sn-btn sn-ghost sn-sm" data-retry-net="">重新连接</button>
        </div>
      </div>
      <div class="sn-banner-wrap">
        <div class="sn-banner" role="status">
          <span data-i="download"></span>
          <div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
          <button class="sn-btn sn-secondary sn-sm">重启</button>
          <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-dismiss="" data-tip="关闭" data-i="x"></button>
        </div>
      </div>
      <div class="sn-card-list">
        <div class="sn-shot-row sn-failed" id="failRow">
          <span class="sn-thumb" style="--sn-g:linear-gradient(135deg,#4b5d73,#1d2530)">
            <span data-i="image-off"></span>
          </span>
          <div class="sn-meta">
            <b>镜头 11 · 雨夜里的公交站</b>
            <span class="sn-state">
              <span class="sn-bad-line"><span data-i="circle-alert"></span>没有生成：画面描述里有不允许的内容</span>
              <span class="sn-ok-line">近景 · 4 秒 · 已生成</span>
            </span>
          </div>
          <div class="sn-acts">
            <button class="sn-btn sn-secondary sn-sm">修改描述</button>
            <button class="sn-btn sn-ghost sn-sm" data-act="" data-fix="">重试</button>
          </div>
        </div>
      </div>
    </div>
  );
}
