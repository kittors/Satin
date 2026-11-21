"use client"; // Next.js 里是客户端组件（用到了 useEffect）；Vite 里这一行没有影响
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";

export default function PickerRegion() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-field">
        <span className="sn-lbl">寄送地址</span>
        <div className="sn-pk" data-pk="region" style={{ minWidth: "250px" }}>
          <button className="sn-pk-trigger" type="button" aria-haspopup="dialog">
            <span className="sn-val sn-ph" data-ph="选择省 / 市 / 区">选择省 / 市 / 区</span>
            <span className="sn-end sn-swap">
              <span className="sn-a" data-i="map-pin"></span>
              <span className="sn-b" data-i="x" role="button" aria-label="清除"></span>
            </span>
          </button>
          <div className="sn-pk-panel sn-rg" role="dialog" aria-label="选择地址">
            <div className="sn-rg-search">
              <input className="sn-input sn-sm" type="text" enterKeyHint="search" placeholder="搜索省、市、区，比如：西湖" aria-label="搜索地址" />
            </div>
            <div className="sn-rg-hot">常用<button type="button" data-path="北京市/北京市">北京</button><button type="button" data-path="上海市/上海市">上海</button><button type="button" data-path="广东省/广州市">广州</button><button type="button" data-path="广东省/深圳市">深圳</button><button type="button" data-path="浙江省/杭州市">杭州</button><button type="button" data-path="四川省/成都市">成都</button></div>
            <div className="sn-rg-tabs" role="tablist">
              <span className="sn-ink"></span>
            </div>
            <div className="sn-rg-vp">
              <div className="sn-rg-res sn-sa-vp sn-fy" role="listbox" hidden></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
