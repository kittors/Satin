import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { bindPickers } from "satin-ui/components";
import "satin-ui/css/picker.css";
import "./picker-0.css";

export default function PickerDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 写了 data-pk 的都接上：date（日期）| range（范围，两个月并排、快捷预设）| time（时、分两列）
      //                       | datetime（定时发布：日历 + 时间）| region（省 / 市 / 区，可跨级搜索）
      bindPickers(document);

      document.addEventListener("pick", (e?: any) => {
        console.log(e.target.dataset.pk, e.detail.text); // 比如 "date"、"11 月 21 日 星期六"
      });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
        <div className="sn-field">
          <span className="sn-lbl">交付日期</span>
          <div className="sn-pk" data-pk="date">
            <button className="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span className="sn-val sn-ph" data-ph="选择日期">选择日期</span>
              <span className="sn-end sn-swap">
                <span className="sn-a" data-i="calendar"></span>
                <span className="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div className="sn-pk-panel" role="dialog" aria-label="选择日期">
              <div className="sn-cal-slot"></div>
              <div className="sn-pk-foot">
                <button className="sn-btn sn-ghost sn-sm" type="button" data-today="">今天</button>
                <span className="sn-grow"></span>
                <button className="sn-btn sn-ghost sn-sm" type="button" data-clear="">清除</button>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-lbl">统计范围</span>
          <div className="sn-pk" data-pk="range" style={{ minWidth: "260px" }}>
            <button className="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span className="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span>
              <span className="sn-end sn-swap">
                <span className="sn-a" data-i="calendar"></span>
                <span className="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div className="sn-pk-panel" role="dialog" aria-label="选择日期范围">
              <div className="sn-pk-range">
                <div className="sn-pk-presets">
                  <button type="button" data-p="today">今天</button>
                  <button type="button" data-p="d7">最近 7 天</button>
                  <button type="button" data-p="d30">最近 30 天</button>
                  <button type="button" data-p="month">本月</button>
                  <button type="button" data-p="last">上个月</button>
                </div>
                <div className="sn-cal-slot"></div>
              </div>
              <div className="sn-pk-foot">
                <button className="sn-btn sn-ghost sn-sm" type="button" data-reset="">重置</button>
                <span className="sn-note"></span>
                <span className="sn-grow"></span>
                <button className="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-lbl">每天提醒</span>
          <div className="sn-pk" data-pk="time" style={{ minWidth: "140px" }}>
            <button className="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span className="sn-val sn-ph" data-ph="选择时间">选择时间</span>
              <span className="sn-end sn-swap">
                <span className="sn-a" data-i="clock"></span>
                <span className="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div className="sn-pk-panel" role="dialog" aria-label="选择时间">
              <div className="sn-tc-slot"></div>
              <div className="sn-pk-foot">
                <button className="sn-btn sn-ghost sn-sm" type="button" data-now="">此刻</button>
                <span className="sn-grow"></span>
                <button className="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
              </div>
            </div>
          </div>
        </div>
        <div className="sn-field">
          <span className="sn-lbl">定时发布</span>
          <div className="sn-pk" data-pk="datetime" style={{ minWidth: "250px" }}>
            <button className="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span className="sn-val sn-ph" data-ph="选择发布时间">选择发布时间</span>
              <span className="sn-end sn-swap">
                <span className="sn-a" data-i="calendar"></span>
                <span className="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div className="sn-pk-panel" role="dialog" aria-label="选择发布时间">
              <div className="sn-pk-dt">
                <div className="sn-cal-slot"></div>
                <div className="sn-tside">
                  <span className="sn-cap">时间</span>
                  <div className="sn-tc-slot"></div>
                </div>
              </div>
              <div className="sn-pk-foot">
                <span className="sn-note"></span>
                <span className="sn-grow"></span>
                <button className="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
}
