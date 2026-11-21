import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { bindPickers } from "satin-ui/components";
import "satin-ui/css/picker.css";
import "./picker-0.css";

export default function PickerDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      // 写了 data-pk 的都接上：date（日期）| range（范围，两个月并排、快捷预设）| time（时、分两列）
      //                       | datetime（定时发布：日历 + 时间）| region（省 / 市 / 区，可跨级搜索）
      bindPickers(document);

      document.addEventListener("pick", (e) => {
        console.log(e.target.dataset.pk, e.detail.text); // 比如 "date"、"11 月 21 日 星期六"
      });
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="row" style="align-items:flex-start;gap:16px;flex-wrap:wrap">
        <div class="sn-field">
          <span class="sn-lbl">交付日期</span>
          <div class="sn-pk" data-pk="date">
            <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span class="sn-val sn-ph" data-ph="选择日期">选择日期</span>
              <span class="sn-end sn-swap">
                <span class="sn-a" data-i="calendar"></span>
                <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div class="sn-pk-panel" role="dialog" aria-label="选择日期">
              <div class="sn-cal-slot"></div>
              <div class="sn-pk-foot">
                <button class="sn-btn sn-ghost sn-sm" type="button" data-today="">今天</button>
                <span class="sn-grow"></span>
                <button class="sn-btn sn-ghost sn-sm" type="button" data-clear="">清除</button>
              </div>
            </div>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-lbl">统计范围</span>
          <div class="sn-pk" data-pk="range" style="min-width:260px">
            <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span class="sn-val sn-ph" data-ph="选择开始和结束日期">选择开始和结束日期</span>
              <span class="sn-end sn-swap">
                <span class="sn-a" data-i="calendar"></span>
                <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div class="sn-pk-panel" role="dialog" aria-label="选择日期范围">
              <div class="sn-pk-range">
                <div class="sn-pk-presets">
                  <button type="button" data-p="today">今天</button>
                  <button type="button" data-p="d7">最近 7 天</button>
                  <button type="button" data-p="d30">最近 30 天</button>
                  <button type="button" data-p="month">本月</button>
                  <button type="button" data-p="last">上个月</button>
                </div>
                <div class="sn-cal-slot"></div>
              </div>
              <div class="sn-pk-foot">
                <button class="sn-btn sn-ghost sn-sm" type="button" data-reset="">重置</button>
                <span class="sn-note"></span>
                <span class="sn-grow"></span>
                <button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
              </div>
            </div>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-lbl">每天提醒</span>
          <div class="sn-pk" data-pk="time" style="min-width:140px">
            <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span class="sn-val sn-ph" data-ph="选择时间">选择时间</span>
              <span class="sn-end sn-swap">
                <span class="sn-a" data-i="clock"></span>
                <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div class="sn-pk-panel" role="dialog" aria-label="选择时间">
              <div class="sn-tc-slot"></div>
              <div class="sn-pk-foot">
                <button class="sn-btn sn-ghost sn-sm" type="button" data-now="">此刻</button>
                <span class="sn-grow"></span>
                <button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
              </div>
            </div>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-lbl">定时发布</span>
          <div class="sn-pk" data-pk="datetime" style="min-width:250px">
            <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span class="sn-val sn-ph" data-ph="选择发布时间">选择发布时间</span>
              <span class="sn-end sn-swap">
                <span class="sn-a" data-i="calendar"></span>
                <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div class="sn-pk-panel" role="dialog" aria-label="选择发布时间">
              <div class="sn-pk-dt">
                <div class="sn-cal-slot"></div>
                <div class="sn-tside">
                  <span class="sn-cap">时间</span>
                  <div class="sn-tc-slot"></div>
                </div>
              </div>
              <div class="sn-pk-foot">
                <span class="sn-note"></span>
                <span class="sn-grow"></span>
                <button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
              </div>
            </div>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-lbl">寄送地址</span>
          <div class="sn-pk" data-pk="region" style="min-width:250px">
            <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
              <span class="sn-val sn-ph" data-ph="选择省 / 市 / 区">选择省 / 市 / 区</span>
              <span class="sn-end sn-swap">
                <span class="sn-a" data-i="map-pin"></span>
                <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
              </span>
            </button>
            <div class="sn-pk-panel sn-rg" role="dialog" aria-label="选择地址">
              <div class="sn-rg-search">
                <input class="sn-input sn-sm" type="text" enterkeyhint="search" placeholder="搜索省、市、区，比如：西湖" aria-label="搜索地址" />
              </div>
              <div class="sn-rg-hot">常用<button type="button" data-path="北京市/北京市">北京</button><button type="button" data-path="上海市/上海市">上海</button><button type="button" data-path="广东省/广州市">广州</button><button type="button" data-path="广东省/深圳市">深圳</button><button type="button" data-path="浙江省/杭州市">杭州</button><button type="button" data-path="四川省/成都市">成都</button></div>
              <div class="sn-rg-tabs" role="tablist">
                <span class="sn-ink"></span>
              </div>
              <div class="sn-rg-vp">
                <div class="sn-rg-res sn-sa-vp sn-fy" role="listbox" hidden></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
