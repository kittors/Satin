import { useEffect, useRef } from "react";
import { setup, enhance, initSeg } from "satin-ui";
import { LOADER_VARIANTS, loaderHTML } from "satin-ui/components";
import "./loading-0.css";

export default function LoadingDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 8 款几何物理动感加载器：尺寸、速度与色彩令牌均可实时定制
      const ldBox = root.querySelector("#ldGallery");
      const META = new Map([
        ["matrix", ["波纹点阵", "AI 思考 · 工具调用"]],
        ["dots", ["弹性三点", "对话首字节 · 轻等待"]],
        ["arc", ["可变弧环", "按钮等待 · 局部刷新"]],
        ["orbit", ["行星微环", "同步 · 检索运行"]],
        ["bars", ["声纹四柱", "语音 · 流式渲染"]],
        ["grid", ["接力方块", "结构构建 · 批处理"]],
        ["radar", ["同心涟漪", "连接 · 实时发现"]],
        ["morph", ["几何呼吸", "沉浸态 · 极简微核"]],
      ]);
      const SIZES = new Map([["sm", 16], ["md", 20], ["lg", 28], ["xl", 36]]);
      const TONES = new Map([
        ["label", "var(--sn-label)"],
        ["accent", "var(--sn-accent)"],
        ["success", "var(--sn-success)"],
        ["warning", "var(--sn-warning)"],
      ]);
      let sizeKey = "lg", speed = 1, toneKey = "label";
      const paint = () => {
        if (!ldBox) return;
        ldBox.innerHTML = LOADER_VARIANTS.map((variant?: any) => {
          const [name, use] = META.get(variant) || [variant, ""];
          return `<div class="ld-cell"><div class="ld-stage">${loaderHTML({ variant, size: SIZES.get(sizeKey) ?? 28, speed, color: TONES.get(toneKey), label: name })}</div><b>${name}</b><span>${use}</span><code>${variant}</code></div>`;
        }).join("");
      };
      paint();
      const sz = root.querySelector('[data-seg="ldsize"]');
      const sp = root.querySelector('[data-seg="ldspeed"]');
      const tn = root.querySelector('[data-seg="ldtone"]');
      if (sz) initSeg(sz, (v?: any) => { sizeKey = v; paint(); }, 2);
      if (sp) initSeg(sp, (v?: any) => { speed = Number(v) || 1; paint(); }, 1);
      if (tn) initSeg(tn, (v?: any) => { toneKey = v; paint(); }, 0);
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="ld-cfg">
        <span className="ld-cfg-g">
          <span className="sn-cap">尺寸</span>
          <div className="sn-seg sn-sm" data-seg="ldsize">
            <span className="sn-thumb"></span>
            <button data-v="sm">16</button>
            <button data-v="md">20</button>
            <button data-v="lg">28</button>
            <button data-v="xl">36</button>
          </div>
        </span>
        <span className="ld-cfg-g">
          <span className="sn-cap">节奏</span>
          <div className="sn-seg sn-sm" data-seg="ldspeed">
            <span className="sn-thumb"></span>
            <button data-v="0.7">舒缓</button>
            <button data-v="1">标准</button>
            <button data-v="1.5">疾速</button>
          </div>
        </span>
        <span className="ld-cfg-g">
          <span className="sn-cap">色调</span>
          <div className="sn-seg sn-sm" data-seg="ldtone">
            <span className="sn-thumb"></span>
            <button data-v="label">中性墨</button>
            <button data-v="accent">主色</button>
            <button data-v="success">成功</button>
            <button data-v="warning">琥珀</button>
          </div>
        </span>
      </div>
      <div className="ld-grid" id="ldGallery"></div>
    </div>
  );
}
