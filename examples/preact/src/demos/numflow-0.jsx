import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { createNumberFlow } from "satin-ui/components";
import "./numflow-0.css";

export default function NumflowDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      // 只滚动变了的那几位；style："roll"（滚动）| "blur"（滚动带模糊）| "push"（推入）| "fade"（淡入）
      const views = createNumberFlow(root.querySelector("#views"), {
        value: 12840,
        style: "roll",
        format: (v) => Number(v).toLocaleString("zh-CN"),
      });
      views.set(12841);
      views.value;                     // 12841
      views.update({ style: "fade" }); // 换样式
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-nf-card">
        <span class="sn-cap">已生成镜头</span>
        <span class="sn-nf-big" data-nf="shots"></span>
        <div class="row">
          <button class="sn-btn sn-secondary sn-sm" data-nf-add="1">+1</button>
          <button class="sn-btn sn-secondary sn-sm" data-nf-add="18">+18</button>
          <button class="sn-btn sn-secondary sn-sm" data-nf-add="-7">−7</button>
          <button class="sn-btn sn-ghost sn-sm" data-nf-add="rand">随机</button>
        </div>
      </div>
      <div class="sn-nf-card">
        <span class="sn-cap">套餐价格（每月）</span>
        <span class="sn-nf-big" data-nf="price"></span>
        <div class="row">
          <button class="sn-btn sn-secondary sn-sm" data-nf-plan="">换个套餐</button>
        </div>
      </div>
      <div class="sn-nf-card">
        <span class="sn-cap">本月生成时长</span>
        <span class="sn-nf-mid" data-nf="live"></span>
        <span class="sn-note">每 1.2 秒自动更新一次</span>
      </div>
      <div class="sn-nf-card">
        <span class="sn-cap">未读消息</span>
        <span class="sn-nf-bell">
          <span data-i="bell"></span>
          <span class="sn-badge-n">
            <span data-nf="badge"></span>
          </span>
        </span>
        <div class="row">
          <button class="sn-btn sn-secondary sn-sm" data-nf-badge="">来新消息</button>
        </div>
      </div>
    </div>
  );
}
