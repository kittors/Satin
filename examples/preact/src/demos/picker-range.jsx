import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function PickerRange() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
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
    </div>
  );
}
