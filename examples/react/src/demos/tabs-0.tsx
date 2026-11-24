import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createTabs, createPager, setStep } from "satin-ui/components";
import "./tabs-0.css";

export default function TabsDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 标签页：下划线前缘先走、后缘跟上；新内容从所选标签那一侧滑进来；← → 切换
      createTabs(root.querySelector(".sn-tabs"), { onChange: (i?: any) => console.log("切到第", i + 1, "个标签") });

      // 分页：当前页的底色滑到新页码；页码多时中间用省略（onChange 里换成你的取数）
      createPager(root.querySelector(".sn-pager"), { total: 13, onChange: (p?: any) => console.log("第", p, "页") });

      // 步骤：第 i 步是当前，前面的都完成
      const steps = root.querySelector(".sn-steps"), max = steps.querySelectorAll(".sn-st").length - 1;
      let cur = 1;
      for (const b of root.querySelectorAll("[data-step]")) b.addEventListener("click", () => { cur = Math.max(0, Math.min(max, cur + Number(b.dataset.step))); setStep(steps, cur); });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-tabs" id="tabsDemo">
        <div className="sn-tab-list" role="tablist">
          <button className="sn-on" role="tab">概览</button>
          <button role="tab">镜头 <span className="sn-badge sn-soft">48</span></button>
          <button role="tab">配音</button>
          <button role="tab">导出记录</button>
          <button role="tab">设置</button>
          <span className="sn-ink"></span>
        </div>
        <div className="sn-tab-panels">
          <div className="sn-tab-panel">项目概览：48&nbsp;个镜头，12&nbsp;分 36&nbsp;秒，最后更新 3&nbsp;分钟前。</div>
          <div className="sn-tab-panel" hidden>镜头列表：按集分组，可以拖动排序。</div>
          <div className="sn-tab-panel" hidden>配音：林夏、周屿两个角色，6&nbsp;段。</div>
          <div className="sn-tab-panel" hidden>导出记录：最近一次导出是第三集，1080p。</div>
          <div className="sn-tab-panel" hidden>项目设置：画面比例、默认景别、协作者。</div>
        </div>
      </div>
      <nav className="sn-crumbs" aria-label="位置">
        <a data-i="house:before">全部项目</a>
        <span data-i="chevron-right"></span>
        <a>雨夜车站</a>
        <span data-i="chevron-right"></span>
        <a>第三集</a>
        <span data-i="chevron-right"></span>
        <b>分镜</b>
      </nav>
      <div className="sn-pager" id="pager">
        <span className="sn-total">共 128 条</span>
        <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-pg="prev" aria-label="上一页" data-i="chevron-left"></button>
        <div className="sn-pages"></div>
        <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-pg="next" aria-label="下一页" data-i="chevron-right"></button>
      </div>
      <div className="stack" style={{ gap: "14px" }}>
        <div className="sn-steps" id="steps">
          <span className="sn-st sn-done"><span className="sn-n">1</span>导入原文</span>
          <span className="sn-ln sn-done">
            <i></i>
          </span>
          <span className="sn-st sn-cur"><span className="sn-n">2</span>拆分章节</span>
          <span className="sn-ln">
            <i></i>
          </span>
          <span className="sn-st"><span className="sn-n">3</span>生成分镜</span>
          <span className="sn-ln">
            <i></i>
          </span>
          <span className="sn-st"><span className="sn-n">4</span>导出成片</span>
        </div>
        <div className="row">
          <button className="sn-btn sn-secondary sn-sm" data-step="-1">上一步</button>
          <button className="sn-btn sn-primary sn-sm" data-step="1">下一步</button>
        </div>
      </div>
    </div>
  );
}
