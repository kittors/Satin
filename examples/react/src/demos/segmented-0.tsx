import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createSegmented } from "satin-ui/components";
import "./segmented-0.css";

export default function SegmentedDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 在已有的标记上接交互；给空容器时按 items、value 渲染
      const segEl = root.querySelector(".sn-seg");
      if (segEl) {
        const seg = createSegmented(segEl, {
          onChange: (value?: any) => console.log("选中了", value),
        });
        seg.select("9:16"); // 从外面切过去
      }
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ gap: "24px" }}>
        <div className="sn-seg" data-seg="a">
          <span className="sn-thumb"></span>
          <button>验证码登录</button>
          <button>密码登录</button>
        </div>
        <div className="sn-seg" data-seg="b">
          <span className="sn-thumb"></span>
          <button>网格</button>
          <button>列表</button>
          <button>时间线</button>
        </div>
        <div className="sn-seg sn-sm" data-seg="c">
          <span className="sn-thumb"></span>
          <button>7 天</button>
          <button>30 天</button>
          <button>90 天</button>
          <button>全部</button>
        </div>
      </div>
    </div>
  );
}
