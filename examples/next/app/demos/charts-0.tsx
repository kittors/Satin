"use client";
import { useEffect, useRef } from "react";
import { setup, enhance, initSeg } from "satin-ui";
import { createAreaChart } from "satin-ui/charts";
import "satin-ui/css/charts.css";
import "./charts-0.css";

export default function ChartsDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 平滑趋势面积图：周期切换自动平滑 Morph 形变，悬停带阻尼准星
      const DATA = new Map([
        ["week", {
          labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          series: [
            { name: "生成镜头", color: "accent", values: [168, 214, 196, 268, 312, 284, 342] },
            { name: "一次通过", color: "success", values: [134, 178, 162, 224, 266, 241, 298] },
          ],
        }],
        ["month", {
          labels: ["第 1 周", "第 2 周", "第 3 周", "第 4 周"],
          series: [
            { name: "生成镜头", color: "accent", values: [1120, 1480, 1690, 1940] },
            { name: "一次通过", color: "success", values: [890, 1210, 1420, 1685] },
          ],
        }],
        ["quarter", {
          labels: ["9 月", "10 月", "11 月", "12 月"],
          series: [
            { name: "生成镜头", color: "accent", values: [4280, 5610, 6230, 7480] },
            { name: "一次通过", color: "success", values: [3310, 4620, 5290, 6510] },
          ],
        }],
      ]);
      const areaEl = root.querySelector("#chArea");
      const init = DATA.get("week");
      if (areaEl && init) {
        const chart = createAreaChart(areaEl, { ...init, height: 244, unit: " 镜" });
        const seg = root.querySelector('[data-seg="charea"]');
        if (seg) initSeg(seg, (v?: any) => chart.update(DATA.get(v) || init), 0);
        root.querySelector("[data-ch-area-replay]")?.addEventListener("click", () => chart.replay());
      }
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="ch-demo-bar">
        <div className="sn-seg sn-sm" data-seg="charea">
          <span className="sn-thumb"></span>
          <button data-v="week">本周</button>
          <button data-v="month">本月</button>
          <button data-v="quarter">季度</button>
        </div>
        <button type="button" className="sn-btn sn-ghost sn-sm" data-ch-area-replay="" data-i="refresh-cw:before">重播入场</button>
      </div>
      <div id="chArea"></div>
    </div>
  );
}
