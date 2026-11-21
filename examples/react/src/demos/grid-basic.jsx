"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

export default function GridBasic() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      const grid = createDataGrid(root.querySelector('[data-ex="grid"]'), { rows: 100000 });
      // 不用了（换页、卸载）记得：grid.destroy();
      void grid;
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div data-ex="grid"></div>
    </div>
  );
}
