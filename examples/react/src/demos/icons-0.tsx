import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./icons-0.css";

export default function IconsDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="row" style={{ marginBottom: "16px" }}>
        <div className="sn-seg sn-sm" data-seg="iconsize">
          <span className="sn-thumb" style={{ width: "43px", transform: "translateX(0px) scaleX(1) scaleY(1)" }}></span>
          <button data-v="16" role="tab" aria-selected="true" tabIndex={0}>16</button>
          <button data-v="20" role="tab" aria-selected="false" tabIndex={-1}>20</button>
          <button data-v="24" role="tab" aria-selected="false" tabIndex={-1}>24</button>
        </div>
      </div>
      <div className="icon-grid" id="iconGrid">
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="accessibility" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="sn-ic-d"></circle>
            <path d="M14 7a2 2 0 11-4 0 2 2 0 014 0"></path>
            <path d="M18 10s-3.5 1.5-6 1.5S6 10 6 10"></path>
            <path d="M12 12v1.5q0 .7.5 1.6L15 19"></path>
            <path d="M12 12v1.5a3 3 0 01-.5 1.6L9 19"></path>
          </svg>
          <span>accessibility</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="activity" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 15h3l1.2.1 1 .8 1.1 1.2q.6.6.8.6.4 0 .7-.7l3.7-5q.4-.7.7-.7.4 0 .8.6l1.8 2 1 1 1.3.1H22"></path>
            <path d="M2 12c0-4.7 0-7 1.5-8.5C4.9 2 7.3 2 12 2s7 0 8.5 1.5C22 4.9 22 7.3 22 12s0 7-1.5 8.5C19.1 22 16.7 22 12 22s-7 0-8.5-1.5C2 19.1 2 16.7 2 12" className="sn-ic-d"></path>
          </svg>
          <span>activity</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="archive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.5 13.5h3.9l.5-.6.1-.9v-.9l-.6-.5-.9-.1H9.6l-.5.6-.1.9v.9l.6.5z"></path>
            <path d="M20.5 7v6c0 3.8 0 5.7-1.2 6.8-1.1 1.2-3 1.2-6.8 1.2h-1c-3.8 0-5.7 0-6.8-1.2-1.2-1.1-1.2-3-1.2-6.8V7" className="sn-ic-d"></path>
            <path d="M4 7h16q1.4 0 1.7-.3.4-.4.3-1.7 0-1.4-.3-1.7-.4-.4-1.7-.3H4q-1.4 0-1.7.3-.4.4-.3 1.7 0 1.4.3 1.7.4.4 1.7.3"></path>
          </svg>
          <span>archive</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="arrow-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v16" className="sn-ic-d"></path>
            <path d="m18 14-6 6-6-6"></path>
          </svg>
          <span>arrow-down</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="arrow-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 12H4" className="sn-ic-d"></path>
            <path d="m10 6-6 6 6 6"></path>
          </svg>
          <span>arrow-left</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="arrow-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12h16" className="sn-ic-d"></path>
            <path d="m14 6 6 6-6 6"></path>
          </svg>
          <span>arrow-right</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="arrow-up" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20V4" className="sn-ic-d"></path>
            <path d="m18 10-6-6-6 6"></path>
          </svg>
          <span>arrow-up</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="arrow-up-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 18V6m-4 4.1L16 6l4 4.1" className="sn-ic-d"></path>
            <path d="M8 6v12m-4-4.1L8 18l4-4.1"></path>
          </svg>
          <span>arrow-up-down</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="arrow-up-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 18 18 6" className="sn-ic-d"></path>
            <path d="M9 6h9v9"></path>
          </svg>
          <span>arrow-up-right</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="audio-lines" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v16"></path>
            <path d="M16 7v10" className="sn-ic-d"></path>
            <path d="M8 7v10" className="sn-ic-d"></path>
            <path d="M20 11v2"></path>
            <path d="M4 11v2"></path>
          </svg>
          <span>audio-lines</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="bell" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18.7 9.7V9c0-3.9-3-7-6.7-7a7 7 0 00-6.7 7v.7q0 1.3-.7 2.4l-1.1 1.7c-1 1.6-.3 3.7 1.5 4.2q7 2 14 0a2.8 2.8 0 001.5-4.2l-1-1.7q-.8-1-.8-2.4"></path>
            <path d="M7.5 19a4.9 4.9 0 009 0" className="sn-ic-d"></path>
          </svg>
          <span>bell</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="bell-ring" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18.7 9.7V9c0-3.9-3-7-6.7-7a7 7 0 00-6.7 7v.7q0 1.3-.7 2.4l-1.1 1.7c-1 1.6-.3 3.7 1.5 4.2q7 2 14 0a2.8 2.8 0 001.5-4.2l-1-1.7q-.8-1-.8-2.4"></path>
            <path d="M7.5 19a4.9 4.9 0 009 0" className="sn-ic-d"></path>
            <path d="M12 6v4" className="sn-ic-d"></path>
          </svg>
          <span>bell-ring</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="blocks" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.2 11.4q-2.5.2-3.2-.6-.6-.7-.5-3-.1-2.6.5-3.2T6.2 4q2.5-.1 3.1.6.8.6.6 3.1.2 2.4-.6 3.1-.7.8-3.1.6" className="sn-ic-d"></path>
            <path d="M16.3 21.5q-2.4.1-3.1-.5c-.6-.6-.6-1.4-.6-3.2q-.2-2.4.6-3.1.7-.7 3-.6 2.6-.2 3.2.6.8.7.6 3.1.1 2.5-.6 3.2-.6.6-3.1.5" className="sn-ic-d"></path>
            <path d="M6.2 21.5q-2.5.1-3.2-.5c-.5-.6-.5-1.4-.5-3.2q-.1-2.4.5-3.1t3.2-.6q2.5-.2 3.1.6.8.7.6 3.1.2 2.5-.6 3.2-.7.6-3.1.5" className="sn-ic-d"></path>
            <path d="M15 3.8Q16.6 2 17.6 2t2.6 1.8C21.4 5.1 22 5.7 22 6.4s-.6 1.4-1.8 2.6-1.9 1.9-2.6 1.9-1.4-.6-2.6-1.9-2-1.8-2-2.6q0-.8 1.9-2.6Z"></path>
          </svg>
          <span>blocks</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="book-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 19H8" className="sn-ic-d"></path>
            <path d="M10 22h4c2.8 0 4.2 0 5.1-.9s.9-2.3.9-5.1V8c0-2.8 0-4.2-.9-5.1S16.8 2 14 2h-4c-2.8 0-4.2 0-5.1.9S4 5.2 4 8v8c0 2.8 0 4.2.9 5.1s2.3.9 5.1.9"></path>
            <path d="M8 7h8" className="sn-ic-d"></path>
            <path d="M8 10.5h5" className="sn-ic-d"></path>
            <path d="M20 16H7.9l-1.8.1q-1.6.5-2 2"></path>
          </svg>
          <span>book-open</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="box" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m17.6 4.4-2-1C13.8 2.4 12.9 2 12 2c-1 0-1.8.5-3.6 1.4l-2 1C4.3 5.6 3.2 6.1 2.6 7.1S2 9.4 2 12v.2c0 2.5 0 3.7.6 4.8s1.7 1.5 3.8 2.7l2 1c1.8 1 2.7 1.4 3.6 1.4 1 0 1.8-.5 3.6-1.4l2-1c2.1-1.2 3.2-1.7 3.8-2.7s.6-2.3.6-4.8V12c0-2.5 0-3.7-.6-4.8s-1.7-1.5-3.8-2.7"></path>
            <path d="M12 12 3 7.5m9 4.5v9.5m0-9.5 4.5-2.2.5-.3m4-2-4 2m0 0V13m0-3.5-9.5-5" className="sn-ic-d"></path>
          </svg>
          <span>box</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="calendar" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 21.8h4c3.8 0 5.7 0 6.8-1.2 1.2-1.2 1.2-3 1.2-6.9v-2C22 8 22 6.2 20.8 5s-3-1.2-6.8-1.2h-4c-3.8 0-5.7 0-6.8 1.2C2 6.1 2 8 2 11.8v2c0 3.7 0 5.6 1.2 6.8 1.1 1.1 3 1.1 6.8 1.1"></path>
            <path d="M17 12.8h.01"></path>
            <path d="M12 12.8h.01"></path>
            <path d="M7 12.8h.01"></path>
            <path d="M17 16.8h.01"></path>
            <path d="M12 16.8h.01"></path>
            <path d="M7 16.8h.01"></path>
            <path d="M2 8.8h20" className="sn-ic-d"></path>
            <path d="M7 3.8V2.3m10 1.5V2.3" className="sn-ic-d"></path>
          </svg>
          <span>calendar</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="chart-column" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 22h18" className="sn-ic-d"></path>
            <path d="M5 19q-1.4 0-1.7-.3-.4-.4-.3-1.7v-6q0-1.4.3-1.7.4-.4 1.7-.3 1.4 0 1.7.3.4.4.3 1.7v6q0 1.4-.3 1.7-.4.4-1.7.3"></path>
            <path d="M12 19q-1.4 0-1.7-.3-.4-.4-.3-1.7V7q0-1.4.3-1.7.4-.4 1.7-.3 1.4 0 1.7.3.4.4.3 1.7v10q0 1.4-.3 1.7-.4.4-1.7.3"></path>
            <path d="M19 19q-1.4 0-1.7-.3-.4-.4-.3-1.7V4q0-1.4.3-1.7.4-.4 1.7-.3 1.4 0 1.7.3.4.4.3 1.7v13q0 1.4-.3 1.7-.4.4-1.7.3"></path>
          </svg>
          <span>chart-column</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 13 4 4L19 7"></path>
          </svg>
          <span>check</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="check-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m4 12.9 3.1 3.6 7.9-9"></path>
            <path d="m20 7.6-8.6 9-.4-.6" className="sn-ic-d"></path>
          </svg>
          <span>check-check</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="chevron-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m19 9-7 6-7-6"></path>
          </svg>
          <span>chevron-down</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="chevron-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 5-6 7 6 7"></path>
          </svg>
          <span>chevron-left</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="chevron-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 5 6 7-6 7"></path>
          </svg>
          <span>chevron-right</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="chevron-up" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m19 15-7-6-7 6"></path>
          </svg>
          <span>chevron-up</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="chevrons-up-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m18 9-6-6-6 6"></path>
            <path d="m18 15-6 6-6-6"></path>
          </svg>
          <span>chevrons-up-down</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="circle-alert" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="sn-ic-d"></circle>
            <path d="M12 7v6"></path>
            <path d="M12 16h.01"></path>
          </svg>
          <span>circle-alert</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="circle-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="sn-ic-d"></circle>
            <path d="m8.5 12.5 2 2 5-5"></path>
          </svg>
          <span>circle-check</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="circle-dashed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.3 6.4a10 10 0 00-2.7-2.7m4.2 10.2a10 10 0 000-3.8m-4.2 10.2a10 10 0 002.7-2.7m-10.2 4.2a10 10 0 003.8 0M3.7 17.6a10 10 0 002.7 2.7"></path>
            <path d="M2.2 10a10 10 0 000 4M6.4 3.6a10 10 0 00-2.7 2.7m10.2-4.2a10 10 0 00-3.8 0" className="sn-ic-d"></path>
          </svg>
          <span>circle-dashed</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="circle-x" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="sn-ic-d"></circle>
            <path d="M14.5 9.5 12 12m0 0-2.5 2.5M12 12 9.5 9.5M12 12l2.5 2.5"></path>
          </svg>
          <span>circle-x</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="clapperboard" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22c-4.7 0-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2s7 0 8.5 1.5C22 4.9 22 7.3 22 12s0 7-1.5 8.5C19.1 22 16.7 22 12 22"></path>
            <path d="M21.5 8h-8m0 0H7m6.5 0L17 2.5M7 8H2.5M7 8l3.5-5.5" className="sn-ic-d"></path>
            <path d="M13 12.6q2 1.1 2 1.9t-2 2q-1.8 1.3-2.5.9t-.5-2.9q-.1-2.5.5-2.9t2.5 1" className="sn-ic-d"></path>
          </svg>
          <span>clapperboard</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="clipboard" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 4q3.2-.2 4.1.9c.9.9.9 2.3.9 5.1v6c0 2.8 0 4.2-.9 5.1s-2.3.9-5.1.9H9c-2.8 0-4.2 0-5.1-.9S3 18.8 3 16v-6c0-2.8 0-4.2.9-5.1q1-1 4.1-.9" className="sn-ic-d"></path>
            <path d="M8 14h8"></path>
            <path d="M7 10.5h10"></path>
            <path d="M9 17.5h6"></path>
            <path d="M9.5 6h5q1.4-.2 1.5-1.5v-1q-.1-1.3-1.5-1.5h-5Q8.1 2.2 8 3.5v1Q8.1 5.8 9.5 6"></path>
          </svg>
          <span>clipboard</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="clock" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="sn-ic-d"></circle>
            <path d="M12 8v4l2.5 2.5"></path>
          </svg>
          <span>clock</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="cloud-upload" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.3 19A4.3 4.3 0 012 14.8a4.3 4.3 0 015.1-4.2M17.5 19a6 6 0 004.5-5.5 5.7 5.7 0 00-5.7-5.7q-1 0-2 .3m-7.2 2.6q-.3-1-.3-2a5.7 5.7 0 0111.4-.6m-11 2.6 1.5.6" className="sn-ic-d"></path>
            <path d="M12 16v6m-2-4 2-2 2 2"></path>
          </svg>
          <span>cloud-upload</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="code-xml" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m17 7.8 1.7 1.6c1.5 1.3 2.3 2 2.3 3 0 .8-.8 1.5-2.3 2.9L17 16.8"></path>
            <path d="m14 5-4 14.8" className="sn-ic-d"></path>
            <path d="M7 7.8 5.3 9.4c-1.5 1.3-2.3 2-2.3 3 0 .8.8 1.5 2.3 2.9L7 16.8"></path>
          </svg>
          <span>code-xml</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="command" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 8h8v8H8z" className="sn-ic-d"></path>
            <path d="M16 16h3a3 3 0 11-3 3z"></path>
            <path d="M8 16H5a3 3 0 103 3z"></path>
            <path d="M16 8h3a3 3 0 10-3-3z"></path>
            <path d="M8 8H5a3 3 0 113-3z"></path>
          </svg>
          <span>command</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="compass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="sn-ic-d"></circle>
            <path d="m13 14.6 1-.5.1-.1.5-1c.9-2.3 1.3-3.4.9-4.1l-.4-.4q-.8-.6-4.1 1-.7.1-1 .4l-.1.1-.5 1q-1.4 3.3-.9 4l.4.4q.8.5 4.1-1"></path>
          </svg>
          <span>compass</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="component" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.5 10.5a4 4 0 110-8 4 4 0 010 8"></path>
            <path d="M17.5 21.5a4 4 0 110-8 4 4 0 010 8" className="sn-ic-d"></path>
            <path d="M6.5 21.5q-2.7.1-3.4-.6t-.6-3.4q-.1-2.7.6-3.4t3.4-.6q2.7-.2 3.4.6.8.7.6 3.4.2 2.7-.6 3.4-.7.8-3.4.6"></path>
            <path d="M17.5 10.5q-2.7.2-3.4-.6-.7-.7-.6-3.4-.2-2.7.6-3.4.7-.7 3.4-.6 2.7-.1 3.4.6.8.7.6 3.4.1 2.7-.6 3.4-.7.8-3.4.6" className="sn-ic-d"></path>
          </svg>
          <span>component</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="copy" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22h3c2.8 0 4.2 0 5.1-.9s.9-2.3.9-5.1v-5c0-2.8 0-4.2-.9-5.1S17.8 5 15 5h-3c-2.8 0-4.2 0-5.1.9S6 8.2 6 11v5c0 2.8 0 4.2.9 5.1s2.3.9 5.1.9"></path>
            <path d="M6 19a3 3 0 01-3-3v-6c0-3.8 0-5.7 1.2-6.8C5.3 2 7.2 2 11 2h4a3 3 0 013 3" className="sn-ic-d"></path>
          </svg>
          <span>copy</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="corner-down-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 4 4 7l3 3"></path>
            <path d="M4 7h11q2.6-.1 3.5.4.7.4 1.1 1.1T20 12q.1 2.7-.4 3.5a3 3 0 01-1.1 1.1q-.9.5-3.5.4H8" className="sn-ic-d"></path>
          </svg>
          <span>corner-down-left</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="cpu" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 17h4q2 .1 2.6-.4.5-.6.4-2.6v-4q.1-2-.4-2.6Q16 7 14 7h-4q-2-.1-2.6.4Q7 8 7 10v4q-.1 2 .4 2.6.6.5 2.6.4" className="sn-ic-d"></path>
            <path d="M12 20c-3.8 0-5.7 0-6.8-1.2C4 17.7 4 15.8 4 12s0-5.7 1.2-6.8C6.3 4 8.2 4 12 4s5.7 0 6.8 1.2C20 6.3 20 8.2 20 12s0 5.7-1.2 6.8C17.7 20 15.8 20 12 20"></path>
            <path d="M4 12H2" className="sn-ic-d"></path>
            <path d="M22 12h-2" className="sn-ic-d"></path>
            <path d="M4 9H2" className="sn-ic-d"></path>
            <path d="M22 9h-2" className="sn-ic-d"></path>
            <path d="M4 15H2" className="sn-ic-d"></path>
            <path d="M22 15h-2" className="sn-ic-d"></path>
            <path d="M12 20v2" className="sn-ic-d"></path>
            <path d="M12 2v2" className="sn-ic-d"></path>
            <path d="M9 20v2" className="sn-ic-d"></path>
            <path d="M9 2v2" className="sn-ic-d"></path>
            <path d="M15 20v2" className="sn-ic-d"></path>
            <path d="M15 2v2" className="sn-ic-d"></path>
          </svg>
          <span>cpu</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="credit-card" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 20h4c3.8 0 5.7 0 6.8-1.2 1.2-1.1 1.2-3 1.2-6.8s0-5.7-1.2-6.8C19.7 4 17.8 4 14 4h-4C6.2 4 4.3 4 3.2 5.2 2 6.3 2 8.2 2 12s0 5.7 1.2 6.8C4.3 20 6.2 20 10 20"></path>
            <path d="M10 16H6" className="sn-ic-d"></path>
            <path d="M14 16h-1.5" className="sn-ic-d"></path>
            <path d="M2 10h20" className="sn-ic-d"></path>
          </svg>
          <span>credit-card</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="download" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 15c0 2.8 0 4.2.9 5.1s2.3.9 5.1.9h6c2.8 0 4.2 0 5.1-.9s.9-2.3.9-5.1" className="sn-ic-d"></path>
            <path d="M12 3v13m-4-4.4 4 4.4 4-4.4"></path>
          </svg>
          <span>download</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="droplet" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.6 13c0 5-3.9 9-8.6 9s-8.6-4-8.6-9c0-3 3.4-7.2 5.9-9.8 1.5-1.6 4-1.6 5.4 0 2.5 2.6 5.9 6.8 5.9 9.9"></path>
            <path d="M7.6 10.8Q9.2 8.5 11 6.7" className="sn-ic-d"></path>
          </svg>
          <span>droplet</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="ellipsis" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"></circle>
            <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" className="sn-ic-d"></circle>
            <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"></circle>
          </svg>
          <span>ellipsis</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="external-link" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m13 11 9-9m0 5.3V2h-5.3"></path>
            <path d="M22 12c0 4.7 0 7-1.5 8.5C19.1 22 16.7 22 12 22s-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2" className="sn-ic-d"></path>
          </svg>
          <span>external-link</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="eye" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4a11 11 0 00-8.7 4.7C2.4 9.8 2 10.4 2 12s.4 2.2 1.3 3.3A11 11 0 0012 20c4.2 0 7-2.5 8.7-4.7.9-1.1 1.3-1.7 1.3-3.3s-.4-2.2-1.3-3.3A11 11 0 0012 4" className="sn-ic-d"></path>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0"></path>
          </svg>
          <span>eye</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="eye-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 7s3 7 10 7a10 10 0 007-2.9C21 9.2 22 7 22 7"></path>
            <path d="M12 14v2.5m3.6-3.2 1.4 2.2m-8.6-2.2L7 15.5m12-4.4 1.5 1.5M5 11.1l-1.5 1.5" className="sn-ic-d"></path>
          </svg>
          <span>eye-off</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="file" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 2.3V5c0 2.4 0 3.5.7 4.3q1 .9 4.3.7h3.6" className="sn-ic-d"></path>
            <path d="M3.2 3.2C4.3 2 6.2 2 10 2c1.6 0 2.3 0 3 .3q.9.2 2.4 1.8l4 3.5q1.9 1.6 2.3 2.6t.3 3.4v.4c0 3.8 0 5.7-1.2 6.8-1.1 1.2-3 1.2-6.8 1.2h-4c-3.8 0-5.7 0-6.8-1.2C2 19.7 2 17.8 2 14v-4c0-3.8 0-5.7 1.2-6.8"></path>
          </svg>
          <span>file</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="file-music" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9.4 17.2a1.6 1.6 0 11-3.2 0 1.6 1.6 0 013.2 0m0 0v-4m3.6-11V5c0 2.4 0 3.5.7 4.3q1 .9 4.3.7h3.6M11 11.7l-1 .5q-.3 0-.3.2-.3 0-.3.4V14q.3.5.8.5l.7-.3 1-.5q.2 0 .3-.2l.3-.5v-1a1 1 0 00-.9-.5z" className="sn-ic-d"></path>
            <path d="M3.2 3.2C4.3 2 6.2 2 10 2c1.6 0 2.3 0 3 .3q.9.2 2.4 1.8l4 3.5q1.9 1.6 2.3 2.6t.3 3.4v.4c0 3.8 0 5.7-1.2 6.8-1.1 1.2-3 1.2-6.8 1.2h-4c-3.8 0-5.7 0-6.8-1.2C2 19.7 2 17.8 2 14v-4c0-3.8 0-5.7 1.2-6.8"></path>
          </svg>
          <span>file-music</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="file-play" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 2.3V5c0 2.4 0 3.5.7 4.3q1 .9 4.3.7h3.6M9.9 12.6q2.3 1.3 2.3 2.3c0 1-.7 1.3-2.3 2.3q-2.2 1.7-3 1.2-.9-.5-.7-3.5Q6 12 7 11.4q.7-.5 3 1.2" className="sn-ic-d"></path>
            <path d="M3.2 3.2C4.3 2 6.2 2 10 2c1.6 0 2.3 0 3 .3q.9.2 2.4 1.8l4 3.5q1.9 1.6 2.3 2.6t.3 3.4v.4c0 3.8 0 5.7-1.2 6.8-1.1 1.2-3 1.2-6.8 1.2h-4c-3.8 0-5.7 0-6.8-1.2C2 19.7 2 17.8 2 14v-4c0-3.8 0-5.7 1.2-6.8"></path>
          </svg>
          <span>file-play</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="file-text" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 10c0-3.8 0-5.7 1.2-6.8C5.3 2 7.2 2 11 2h2c3.8 0 5.7 0 6.8 1.2C21 4.3 21 6.2 21 10v4c0 3.8 0 5.7-1.2 6.8-1.1 1.2-3 1.2-6.8 1.2h-2c-3.8 0-5.7 0-6.8-1.2C3 19.7 3 17.8 3 14z" className="sn-ic-d"></path>
            <path d="M8 12h8"></path>
            <path d="M8 8h8"></path>
            <path d="M8 16h5"></path>
          </svg>
          <span>file-text</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="film" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22c-4.7 0-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2s7 0 8.5 1.5C22 4.9 22 7.3 22 12s0 7-1.5 8.5C19.1 22 16.7 22 12 22"></path>
            <path d="M17 2.5V7m0 0v5m0-5h4.5M17 12v5m0-5H7m10 0h5m-5 5v4.5m0-4.5h4.5M7 2.5V7m0 0v5m0-5H2.5M7 12v5m0-5H2m5 5v4.5M7 17H2.5" className="sn-ic-d"></path>
          </svg>
          <span>film</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="folder" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 10h-5" className="sn-ic-d"></path>
            <path d="m11 4-.6-.6L10 3a4 4 0 00-2.3-1H5.3A4 4 0 002 5.4V14c0 3.8 0 5.7 1.2 6.8C4.3 22 6.2 22 10 22h4c3.8 0 5.7 0 6.8-1.2 1.2-1.1 1.2-3 1.2-6.8v-2.2q.2-3.7-.8-4.8l-.2-.2q-1-1-4.8-.8h-.4q-1.5 0-2.2-.2l-.9-.3z"></path>
          </svg>
          <span>folder</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="folder-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 11.5V9.3q.1-2.9-.6-3.6l-.2-.1c-.7-.6-1.7-.6-3.8-.6H15l-1.9-.1-.6-.3-1.4-1.1-.4-.4-.5-.4Q9.6 2 8.6 2h-2a3 3 0 00-2.5 2.4L4 5.7v5.8" className="sn-ic-d"></path>
            <path d="M14 17h-4" className="sn-ic-d"></path>
            <path d="M8.7 22h6.6c2 0 2.9 0 3.6-.5l.5-.4q.8-.9 1.1-3.6c.5-2.7.7-4 .2-5l-.6-.7c-.8-.8-2.1-.8-4.8-.8H8.7c-2.7 0-4 0-4.8.8l-.6.6q-.6 1.3.2 5 .4 2.8 1 3.7l.6.4q.9.6 3.6.5"></path>
          </svg>
          <span>folder-open</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="gauge" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 12a10 10 0 11-20 0 10 10 0 0120 0"></path>
            <path d="m19 19-1.5-1.5" className="sn-ic-d"></path>
            <path d="m19 5-1.5 1.5" className="sn-ic-d"></path>
            <path d="m5 19 1.5-1.5" className="sn-ic-d"></path>
            <path d="m5 5 1.5 1.5" className="sn-ic-d"></path>
            <path d="M2 12h2" className="sn-ic-d"></path>
            <path d="M20 12h2" className="sn-ic-d"></path>
            <path d="M12 4V2" className="sn-ic-d"></path>
            <path d="M15 12a3 3 0 11-6 0q0-1 1-2.3c.8-1.3 1.2-2 2-2s1.2.7 2 2q1 1.3 1 2.3"></path>
          </svg>
          <span>gauge</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="git-branch" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.7 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5m0 0c0 2.3-2.2 3.6-5.6 3.6s-5.6 1-5.6 3.4" className="sn-ic-d"></path>
            <path d="M9 4.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0"></path>
            <path d="M9 19.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0"></path>
            <path d="M6.5 17V7"></path>
          </svg>
          <span>git-branch</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="git-fork" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 16v-4m0 0c3.3 0 5 0 6-.6S19 10 19 8m-7 4c-3.3 0-5 0-6-.6S5 10 5 8" className="sn-ic-d"></path>
            <path d="M8 5a3 3 0 11-6 0 3 3 0 016 0"></path>
            <path d="M22 5a3 3 0 11-6 0 3 3 0 016 0"></path>
            <path d="M15 19a3 3 0 11-6 0 3 3 0 016 0"></path>
          </svg>
          <span>git-fork</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="github" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2" className="sn-ic-d"></path>
          </svg>
          <span>github</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="grip-vertical" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="15.5" cy="19" r=".8"></circle>
            <circle cx="15.5" cy="12" r=".8" className="sn-ic-d"></circle>
            <circle cx="15.5" cy="5" r=".8"></circle>
            <circle cx="8.5" cy="19" r=".8"></circle>
            <circle cx="8.5" cy="12" r=".8" className="sn-ic-d"></circle>
            <circle cx="8.5" cy="5" r=".8"></circle>
          </svg>
          <span>grip-vertical</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="hash" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3 5 21"></path>
            <path d="m19 3-5 18"></path>
            <path d="M22 9H4" className="sn-ic-d"></path>
            <path d="M20 16H2" className="sn-ic-d"></path>
          </svg>
          <span>hash</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="headphones" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 17v-5a9 9 0 10-18 0v5" className="sn-ic-d"></path>
            <path d="M22 15.5v2" className="sn-ic-d"></path>
            <path d="M2 15.5v2" className="sn-ic-d"></path>
            <path d="M5.9 20.8q1.2.4 1.6.1l.3-.3q.3-.3.2-1.6v-5.2q0-1-.2-1.4l-.3-.3H6q-1.7 0-2.3.5l-.5.6q-.4.6-.3 2.4v1.6q0 1.9.3 2.4 0 .3.4.5.5.5 2.2.7"></path>
            <path d="M18.1 20.8q-1.2.4-1.6.1l-.3-.3q-.2-.3-.2-1.6v-5.2q0-1 .2-1.4l.3-.3H18q1.7 0 2.3.5l.5.6q.4.6.3 2.4v1.6q0 1.9-.3 2.4l-.4.5q-.5.5-2.2.7"></path>
          </svg>
          <span>headphones</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="history" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 8v4l2.5 2.5" className="sn-ic-d"></path>
            <path d="m4.3 6.9 1.3-1.3a9 9 0 0112.7 0 9 9 0 01.1 12.8 9 9 0 01-15.3-7.7m1.2-6.4V7H7"></path>
          </svg>
          <span>history</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="house" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7.9 3.9 5.9 5Q3.1 6.8 2.5 7.8c-.6 1-.5 2.2-.5 4.4v1.5c0 4 0 5.9 1.2 7C4.3 22 6.2 22 10 22h4c3.8 0 5.7 0 6.8-1.2 1.2-1.2 1.2-3.2 1.2-7v-1.6c0-2.3 0-3.4-.5-4.4S20 6.3 18 5.1l-2-1.2C14 2.6 13 2 11.9 2s-2.1.6-4.1 1.9" className="sn-ic-d"></path>
            <path d="M12 15v3"></path>
          </svg>
          <span>house</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="image" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22c-4.7 0-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2s7 0 8.5 1.5C22 4.9 22 7.3 22 12s0 7-1.5 8.5C19.1 22 16.7 22 12 22"></path>
            <circle cx="16" cy="8" r="2" className="sn-ic-d"></circle>
            <path d="M2 12.5 3.8 11c.9-.8 2.2-.8 3 0l4.4 4.4a2 2 0 002.5.2l.3-.2a3 3 0 013.8.2l3.2 2.9" className="sn-ic-d"></path>
          </svg>
          <span>image</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="image-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.5 20.5C19.1 22 16.7 22 12 22s-7 0-8.5-1.5C2 19.1 2 17 2 12.5V12c0-4.7 0-7 1.5-8.5M2 12.5 3.8 11c.9-.8 2.2-.8 3 0l4.4 4.4a2 2 0 002.5.2l.3-.2 1-.5M5.7 2.3Q7.8 2 12 2c4.7 0 7 0 8.5 1.5C22 4.9 22 7.3 22 12q0 4.2-.3 6.2" className="sn-ic-d"></path>
            <circle cx="16" cy="8" r="2"></circle>
            <path d="m2 2 20 20"></path>
          </svg>
          <span>image-off</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="image-plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 12c0 4.7 0 7-1.5 8.5C19.1 22 16.7 22 12 22s-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2"></path>
            <path d="M2 12.5 3.8 11c.9-.8 2.2-.8 3 0l4.4 4.4a2 2 0 002.5.2l.3-.2a3 3 0 013.8.2l3.2 2.9" className="sn-ic-d"></path>
            <path d="M15 5.5h3.5m0 0H22m-3.5 0V9m0-3.5V2"></path>
          </svg>
          <span>image-plus</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="inbox" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22c-4.7 0-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2s7 0 8.5 1.5C22 4.9 22 7.3 22 12s0 7-1.5 8.5C19.1 22 16.7 22 12 22"></path>
            <path d="M2 13h3.2q1.2 0 1.7.2t1.3 1.2l.6.7q.8 1 1.3 1.2.5.3 1.7.2h.4q1.2 0 1.7-.2t1.3-1.2l.6-.7q.8-1 1.3-1.2t1.7-.2H22" className="sn-ic-d"></path>
          </svg>
          <span>inbox</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="info" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="sn-ic-d"></circle>
            <path d="M12 17v-6"></path>
            <path d="M12 8h.01"></path>
          </svg>
          <span>info</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="key-round" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 8.3a6.3 6.3 0 01-9.1 5.6l-.9.8c-.7.8-.1.8.2 1.4 0 0 .7 1 0 2-.5.6-1.7 1.4-3.1 0l-.3.3s.9 1 .1 2c-.4.6-1.6 1.2-2.6.2l-1 1c-.8.7-1.6.3-2 0l-.8-.9c-.9-.8-.4-1.7 0-2L10 11s-.7-1.2-.7-2.8a6.3 6.3 0 0112.6 0"></path>
            <path d="M17.9 8.3a2.2 2.2 0 11-4.4 0 2.2 2.2 0 014.4 0" className="sn-ic-d"></path>
          </svg>
          <span>key-round</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="keyboard" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 19h8c2.8 0 4.2 0 5.1-.9s.9-2.3.9-5.1v-2c0-2.8 0-4.2-.9-5.1S18.8 5 16 5H8c-2.8 0-4.2 0-5.1.9S2 8.2 2 11v2c0 2.8 0 4.2.9 5.1s2.3.9 5.1.9"></path>
            <path d="M7 16h10" className="sn-ic-d"></path>
            <path d="M6 9h.01" className="sn-ic-d"></path>
            <path d="M9 9h.01" className="sn-ic-d"></path>
            <path d="M12 9h.01" className="sn-ic-d"></path>
            <path d="M15 9h.01" className="sn-ic-d"></path>
            <path d="M18 9h.01" className="sn-ic-d"></path>
            <path d="M18 12h.01" className="sn-ic-d"></path>
            <path d="M15 12h.01" className="sn-ic-d"></path>
            <path d="M12 12h.01" className="sn-ic-d"></path>
            <path d="M9 12h.01" className="sn-ic-d"></path>
            <path d="M6 12h.01" className="sn-ic-d"></path>
          </svg>
          <span>keyboard</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="layers" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16.2 10.8 19 9.7q3-1 3-1.7t-3-1.7l-2.8-1.1c-2-.8-3-1.2-4.2-1.2s-2.2.4-4.2 1.2L5 6.3Q2 7.3 2 8t3 1.7l2.8 1.1c2 .8 3 1.2 4.2 1.2s2.2-.4 4.2-1.2"></path>
            <path d="m18.2 14 .8-.3q3-1 3-1.7t-3-1.7l-.8-.3m0 4-2 .8c-2 .8-3 1.2-4.2 1.2s-2.2-.4-4.2-1.2l-2-.8m12.4 0 .8.3q3 1 3 1.7t-3 1.7l-2.8 1.1c-2 .8-3 1.2-4.2 1.2s-2.2-.4-4.2-1.2L5 17.7q-3-1-3-1.7t3-1.7l.8-.3m0 0-.8-.3q-3-1-3-1.7t3-1.7l.8-.3" className="sn-ic-d"></path>
          </svg>
          <span>layers</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="layout-dashboard" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.5 21.5q-2.7.1-3.4-.6t-.6-3.4v-2q-.2-2.7.6-3.4.7-.7 3.4-.6 2.7-.2 3.4.6.8.7.6 3.4v2q.1 2.7-.6 3.4-.7.8-3.4.6" className="sn-ic-d"></path>
            <path d="M6 2.5q-2.7-.1-3.4.6T2 6.5v2q-.1 2.7.6 3.4t3.4.6q2.7.2 3.4-.6.8-.7.6-3.4v-2q.2-2.7-.6-3.4-.7-.7-3.4-.6"></path>
            <path d="M16.5 8.5h2q1.3 0 1.8-.2a2 2 0 001-1q.3-.5.2-1.8t-.2-1.8a2 2 0 00-1-1q-.5-.2-1.8-.2h-2q-1.4 0-1.8.2a2 2 0 00-1 1q-.2.5-.2 1.8t.2 1.8q.3.7 1 1 .5.3 1.8.2"></path>
            <path d="M5 15.5h2q1.4 0 1.8.2.7.3 1 1 .3.5.2 1.8t-.2 1.8a2 2 0 01-1 1q-.5.3-1.8.2H5q-1.3 0-1.8-.2a2 2 0 01-1-1q-.2-.5-.2-1.8t.2-1.8a2 2 0 011-1q.5-.2 1.8-.2" className="sn-ic-d"></path>
          </svg>
          <span>layout-dashboard</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="layout-grid" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.5 10.5q-2.7.2-3.4-.6-.7-.7-.6-3.4-.1-2.7.6-3.4t3.4-.6q2.7-.1 3.4.6.8.7.6 3.4.2 2.7-.6 3.4-.7.8-3.4.6" className="sn-ic-d"></path>
            <path d="M17.5 21.5q-2.7.1-3.4-.6t-.6-3.4q-.2-2.7.6-3.4.7-.7 3.4-.6 2.7-.2 3.4.6.8.7.6 3.4.1 2.7-.6 3.4-.7.8-3.4.6" className="sn-ic-d"></path>
            <path d="M6.5 21.5q-2.7.1-3.4-.6t-.6-3.4q-.1-2.7.6-3.4t3.4-.6q2.7-.2 3.4.6.8.7.6 3.4.2 2.7-.6 3.4-.7.8-3.4.6"></path>
            <path d="M17.5 10.5q-2.7.2-3.4-.6-.7-.7-.6-3.4-.2-2.7.6-3.4.7-.7 3.4-.6 2.7-.1 3.4.6.8.7.6 3.4.1 2.7-.6 3.4-.7.8-3.4.6"></path>
          </svg>
          <span>layout-grid</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="link" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m14.2 18.5-.8.7a6.1 6.1 0 11-8.6-8.6l.7-.8" className="sn-ic-d"></path>
            <path d="m9.8 14.2 4.4-4.4"></path>
            <path d="m9.8 5.5.8-.7a6.1 6.1 0 018.6 8.6l-.7.8" className="sn-ic-d"></path>
          </svg>
          <span>link</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="list" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 7H4"></path>
            <path d="M15 12H4" className="sn-ic-d"></path>
            <path d="M9 17H4" className="sn-ic-d"></path>
          </svg>
          <span>list</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="list-filter" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 5.8v.7q0 1.5-.3 2t-1.6 1.2l-3 1.7q-1 .4-1.1.7-.7.6-1 1.5v3.9q.2 3-.7 3.3-.8.5-3.5-.7-1.2-.4-1.5-.8T9 17.5v-3.9q-.3-.8-1-1.5l-1-.7-3-1.7Q2.5 9 2.3 8.5q-.4-.5-.3-2v-.7"></path>
            <path d="M22 5.8q.1-1.9-.4-2.4T19 3H5q-2-.1-2.6.4-.5.4-.4 2.4" className="sn-ic-d"></path>
          </svg>
          <span>list-filter</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="loader-circle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" className="sn-ic-d"></circle>
            <path d="M22 12a10 10 0 00-10-10"></path>
          </svg>
          <span>loader-circle</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="locate-fixed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 12a8 8 0 11-16 0 8 8 0 0116 0"></path>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0" className="sn-ic-d"></path>
            <path d="M2 12h2" className="sn-ic-d"></path>
            <path d="M20 12h2" className="sn-ic-d"></path>
            <path d="M12 4V2" className="sn-ic-d"></path>
            <path d="M12 22v-2" className="sn-ic-d"></path>
          </svg>
          <span>locate-fixed</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="lock" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 22h8c2.8 0 4.2 0 5.1-.9s.9-2.3.9-5.1 0-4.2-.9-5.1-2.3-.9-5.1-.9H8c-2.8 0-4.2 0-5.1.9S2 13.2 2 16s0 4.2.9 5.1 2.3.9 5.1.9"></path>
            <circle cx="12" cy="16" r="2" className="sn-ic-d"></circle>
            <path d="M6 10V8a6 6 0 1112 0v2" className="sn-ic-d"></path>
          </svg>
          <span>lock</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="log-out" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 7q-.2-3.2.9-4.1C10.8 2 12.2 2 15 2h1c2.8 0 4.2 0 5.1.9S22 5.2 22 8v8c0 2.8 0 4.2-.9 5.1s-2.3.9-5.1.9h-1c-2.8 0-4.2 0-5.1-.9q-1-1-.9-4.1" className="sn-ic-d"></path>
            <path d="M15 12H2m3.5 3L2 12l3.5-3"></path>
          </svg>
          <span>log-out</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="mail" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 20h4c3.8 0 5.7 0 6.8-1.2 1.2-1.1 1.2-3 1.2-6.8s0-5.7-1.2-6.8C19.7 4 17.8 4 14 4h-4C6.2 4 4.3 4 3.2 5.2 2 6.3 2 8.2 2 12s0 5.7 1.2 6.8C4.3 20 6.2 20 10 20" className="sn-ic-d"></path>
            <path d="m6 8 2.2 1.8c1.8 1.5 2.7 2.3 3.8 2.3s2-.8 3.8-2.3L18 8"></path>
          </svg>
          <span>mail</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="map-pin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13.5 21.7q-1.5.6-3 0C6.5 19.8 4 14.7 4 10a8 8 0 018-8 8 8 0 018 8.1c0 4.5-2.6 9.7-6.5 11.6" className="sn-ic-d"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>map-pin</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="maximize-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 15-7 7m0-5.9V22h5.9" className="sn-ic-d"></path>
            <path d="m15 9 7-7m0 5.9V2h-5.9"></path>
          </svg>
          <span>maximize-2</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="menu" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 7H4"></path>
            <path d="M20 12H4" className="sn-ic-d"></path>
            <path d="M20 17H4"></path>
          </svg>
          <span>menu</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="message-circle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 12a10 10 0 01-14.5 9q-.5-.3-1.1-.2l-2.2.6c-1 .3-1.9-.6-1.6-1.6l.6-2.2q0-.6-.2-1.1A10 10 0 1122 12Z"></path>
          </svg>
          <span>message-circle</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="message-square" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13.6 20.5q.6-1 1-1.3.4-.2 1.6-.2 1.8 0 2.7-.4a5 5 0 002.7-2.7c.4-1 .4-2 .4-4.4v-1c0-3.3 0-5-.7-6.1a5 5 0 00-1.7-1.7C18.4 2 16.8 2 13.5 2h-3c-3.3 0-5 0-6.1.7a5 5 0 00-1.7 1.7C2 5.6 2 7.2 2 10.5v1c0 2.3 0 3.5.4 4.4A5 5 0 005 18.6q.8.4 2.7.4 1.2 0 1.6.2t1 1.3l.5.9c.5.8 1.7.8 2.2 0Z"></path>
          </svg>
          <span>message-square</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="mic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="2.5" width="6" height="11" rx="3"></rect>
            <path d="M5.5 10.5a6.5 6.5 0 0013 0" className="sn-ic-d"></path>
            <path d="M12 17v4.5M9 21.5h6" className="sn-ic-d"></path>
          </svg>
          <span>mic</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="minimize-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m2 22 7-7m0 5.9V15H3.1" className="sn-ic-d"></path>
            <path d="m22 2-7 7m0-5.9V9h5.9"></path>
          </svg>
          <span>minimize-2</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="minus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14"></path>
          </svg>
          <span>minus</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="monitor" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 17h8c2.8 0 4.2 0 5.1-.9s.9-2.3.9-5.1v-1c0-3.8 0-5.7-1.2-6.8C19.7 2 17.8 2 14 2h-4C6.2 2 4.3 2 3.2 3.2 2 4.3 2 6.2 2 10v1c0 2.8 0 4.2.9 5.1s2.3.9 5.1.9"></path>
            <path d="M16 22h-4m0 0H8m4 0v-5" className="sn-ic-d"></path>
            <path d="M22 13H2" className="sn-ic-d"></path>
          </svg>
          <span>monitor</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22a10 10 0 0010-10c0-.5-.7-.5-1-.1a6.5 6.5 0 11-8.9-9c.4-.2.4-.9-.1-.9a10 10 0 100 20Z"></path>
          </svg>
          <span>moon</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="mouse-pointer-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15.3 12.6 1.2-1.2q1.8-1.6 1.7-2.5-.3-.8-2.6-1.5l-5.5-2C7 4.2 5.2 3.6 4.4 4.4q-1 1 1 5.7l2 5.5q.7 2.3 1.5 2.6.9.1 2.5-1.7l1.2-1.2"></path>
            <path d="m12.6 15.3 4 3.9.8.7h1q.3 0 .8-.7l.7-.8v-1q0-.2-.7-.8l-4-4" className="sn-ic-d"></path>
          </svg>
          <span>mouse-pointer-2</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="move" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12h7" className="sn-ic-d"></path>
            <path d="m5 9-3 3 3 3"></path>
            <path d="M22 12h-7" className="sn-ic-d"></path>
            <path d="m19 15 3-3-3-3"></path>
            <path d="M12 2v7" className="sn-ic-d"></path>
            <path d="m15 5-3-3-3 3"></path>
            <path d="M12 22v-7" className="sn-ic-d"></path>
            <path d="m9 19 3 3 3-3"></path>
          </svg>
          <span>move</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="music" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 18V2" className="sn-ic-d"></path>
            <circle cx="9" cy="18" r="4"></circle>
            <path d="M19 8a6 6 0 01-6-6"></path>
          </svg>
          <span>music</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="palette" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 22q-2 0-2.6-.3-.8-.4-1.1-1-.4-.8-.3-2.7V6q0-2 .3-2.6.4-.8 1-1.1.8-.4 2.7-.3 2 0 2.6.3.8.4 1.1 1 .4.8.3 2.7v12q0 2-.3 2.6-.3.8-1 1.1T6 22"></path>
            <path d="M7 19H5" className="sn-ic-d"></path>
            <path d="m11.2 7 2.1-2q1.4-1.5 2-1.7.9-.3 1.6 0c.6.1 1 .6 2 1.6q1.5 1.4 1.7 2 .3.9 0 1.6-.1.8-1.6 2l-9 9V10q0-1.1.2-1.6.1-.5 1-1.2"></path>
            <path d="M6 22h12q2 0 2.6-.3.8-.4 1.1-1 .4-.8.3-2.7 0-2-.3-2.6-.4-.8-1-1.1-.8-.4-2.7-.3h-2.5" className="sn-ic-d"></path>
          </svg>
          <span>palette</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="panel-left" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 21h-4c-3.8 0-5.7 0-6.8-1.2C2 18.7 2 16.8 2 13v-2c0-3.8 0-5.7 1.2-6.8C4.3 3 6.2 3 10 3h4c3.8 0 5.7 0 6.8 1.2C22 5.3 22 7.2 22 11v2c0 3.8 0 5.7-1.2 6.8-1.1 1.2-3 1.2-6.8 1.2"></path>
            <path d="M9 21V3" className="sn-ic-d"></path>
          </svg>
          <span>panel-left</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="panel-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 21h4c3.8 0 5.7 0 6.8-1.2 1.2-1.1 1.2-3 1.2-6.8v-2c0-3.8 0-5.7-1.2-6.8C19.7 3 17.8 3 14 3h-4C6.2 3 4.3 3 3.2 4.2 2 5.3 2 7.2 2 11v2c0 3.8 0 5.7 1.2 6.8C4.3 21 6.2 21 10 21"></path>
            <path d="M15 21V3" className="sn-ic-d"></path>
          </svg>
          <span>panel-right</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="paperclip" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15.8 7c-1-1-2.5-1-3.4 0l-7.9 7.5a4.3 4.3 0 000 6.2 5 5 0 006.6 0l8-7.6a6.3 6.3 0 000-9.2 7 7 0 00-9.7 0L3 10"></path>
          </svg>
          <span>paperclip</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="pause" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 22q-2.7.1-3.4-.6T2 18V6q-.1-2.7.6-3.4T6 2q2.7-.1 3.4.6.8.7.6 3.4v12q.2 2.7-.6 3.4-.7.8-3.4.6"></path>
            <path d="M18 22q-2.7.1-3.4-.6T14 18V6q-.2-2.7.6-3.4.7-.7 3.4-.6 2.7-.1 3.4.6.8.7.6 3.4v12q.1 2.7-.6 3.4-.7.8-3.4.6" className="sn-ic-d"></path>
          </svg>
          <span>pause</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="pen-line" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m14.4 4 .9-.8a4 4 0 015.5 5.5l-.9 1-8.5 8.5-1.2 1q-.6.6-1.2.8l-1.5.6-3.3 1-.8.3a1 1 0 01-1.3-1.3l.2-.8 1.1-3.3L4 15l.7-1.2 1.1-1.2z"></path>
            <path d="M14.4 4s0 2 1.8 3.8S20 9.6 20 9.6m-15.7 12-1.9-1.8" className="sn-ic-d"></path>
          </svg>
          <span>pen-line</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="pencil" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 22h16" className="sn-ic-d"></path>
            <path d="m13.9 3.7.7-.8a3.1 3.1 0 114.5 4.5l-.8.7-6.8 6.8-1 1-.9.5-1.2.5-2.6.8-.7.3a.8.8 0 01-1-1.1l.2-.7.8-2.6.5-1.2.6-1 .9-1z"></path>
            <path d="M13.9 3.7s0 1.5 1.5 3a5 5 0 003 1.4M5.7 17.7l-1.5-1.5" className="sn-ic-d"></path>
          </svg>
          <span>pencil</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="picture-in-picture-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 21h2c3.7 0 5.6 0 7-1l1-1c1-1.4 1-3.3 1-7s0-5.6-1-7l-1-1c-1.4-1-3.3-1-7-1h-2C7.3 3 5.4 3 4 4L3 5c-1 1.4-1 3.3-1 7s0 5.6 1 7l1 1c1.4 1 3.3 1 7 1" className="sn-ic-d"></path>
            <path d="M14 17h1q1.3 0 1.8-.2a2 2 0 001-1q.3-.5.2-1.8t-.2-1.8a2 2 0 00-1-1q-.5-.2-1.8-.2h-1l-1.8.2a2 2 0 00-1 1q-.2.5-.2 1.8t.2 1.8q.3.7 1 1 .5.3 1.8.2"></path>
          </svg>
          <span>picture-in-picture-2</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="pin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m19 8-3-3c-2.1-2.2-3.2-3.2-4.3-3S10.1 3.7 9 6.5l-.7 1.9-.6 1.4-.4.3q-.4.4-1.5.6-2.4.5-2.9 1.3l-.2.8q0 .7 2 2.5l4 4.1q1.8 2 2.6 2 .5 0 .8-.3.7-.4 1.3-2.9l.5-1.5.4-.3q.3-.4 1.3-.7l2-.7c2.7-1 4.1-1.6 4.4-2.7.2-1.1-.8-2.2-3-4.3"></path>
            <path d="m2 22 4.7-4.7" className="sn-ic-d"></path>
          </svg>
          <span>pin</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="play" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 5v14c0 2.3 2.5 3.7 4.6 2.6l12.8-7a3 3 0 000-5.2l-12.8-7C5.6 1.3 3 2.7 3 5Z"></path>
          </svg>
          <span>play</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="plug" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 15.1v5q-.2 2-2 1.9c-4.6-1-8-5-8-10A10 10 0 0112 2a10 10 0 014.4 19.2" className="sn-ic-d"></path>
            <path d="M9 11.8q.1-.7.8-.8h4.4q.7.1.8.8v.2a3 3 0 11-6 0z"></path>
            <path d="M13.5 11V9"></path>
            <path d="M10.5 11V9"></path>
          </svg>
          <span>plug</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <span>plus</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="receipt" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7.2 2h9.6q1.6 0 2.2.2A3 3 0 0120.8 4q.2.5.2 2.3v14c0 .8-1 1.3-1.6.7a1 1 0 00-1.3 0l-.5.5q-1.1.8-2.2 0t-2.3 0c-.6.5-1.6.5-2.2 0q-1.1-.9-2.3 0c-.6.5-1.6.5-2.2 0l-.5-.5a1 1 0 00-1.3 0c-.6.6-1.6.1-1.6-.7v-14q0-1.7.2-2.3A3 3 0 015 2z" className="sn-ic-d"></path>
            <path d="M10.5 11H17"></path>
            <path d="M7 11h.5"></path>
            <path d="M7 7.5h.5"></path>
            <path d="M7 14.5h.5"></path>
            <path d="M10.5 7.5H17"></path>
            <path d="M10.5 14.5H17"></path>
          </svg>
          <span>receipt</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="redo-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m17 4 3 3-3 3"></path>
            <path d="M20 7H9a5 5 0 100 10h7" className="sn-ic-d"></path>
          </svg>
          <span>redo-2</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="refresh-cw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3.7 13v-1.7C3.7 6.7 7.4 3 12 3c3 0 5.7 1.6 7.2 4M2 11.3 3.7 13l1.7-1.7"></path>
            <path d="M20.3 11v1.7A8.4 8.4 0 014.7 17M22 12.7 20.3 11l-1.7 1.7" className="sn-ic-d"></path>
          </svg>
          <span>refresh-cw</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="rotate-ccw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 22h-1c-2.8 0-4.2 0-5.1-.9S9 18.8 9 16V8c0-2.8 0-4.2.9-5.1S12.2 2 15 2h1c2.8 0 4.2 0 5.1.9S22 5.2 22 8v8c0 2.8 0 4.2-.9 5.1s-2.3.9-5.1.9"></path>
            <path d="M6.5 10q-2.8 0-3.6.9C2 11.8 2 13.2 2 16s0 4.2.9 5.1q.9 1 3.6.9" className="sn-ic-d"></path>
            <path d="M3.5 7 2 8a6 6 0 015-6" className="sn-ic-d"></path>
          </svg>
          <span>rotate-ccw</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="rotate-cw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 22h1c2.8 0 4.2 0 5.1-.9s.9-2.3.9-5.1V8c0-2.8 0-4.2-.9-5.1S11.8 2 9 2H8c-2.8 0-4.2 0-5.1.9S2 5.2 2 8v8c0 2.8 0 4.2.9 5.1s2.3.9 5.1.9"></path>
            <path d="M17.5 10q2.8 0 3.6.9c.9.9.9 2.3.9 5.1s0 4.2-.9 5.1q-.9 1-3.6.9" className="sn-ic-d"></path>
            <path d="M20.5 7 22 8a6 6 0 00-5-6" className="sn-ic-d"></path>
          </svg>
          <span>rotate-cw</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="rows-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 15.3h18" className="sn-ic-d"></path>
            <path d="M3 8.7h18" className="sn-ic-d"></path>
            <path d="M3 10v4c0 3.8 0 5.7 1.2 6.8C5.3 22 7.2 22 11 22h2c3.8 0 5.7 0 6.8-1.2 1.2-1.1 1.2-3 1.2-6.8v-4c0-3.8 0-5.7-1.2-6.8C18.7 2 16.8 2 13 2h-2C7.2 2 5.3 2 4.2 3.2 3 4.3 3 6.2 3 10"></path>
          </svg>
          <span>rows-3</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="ruler" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 18.5c-1.3-1.4-2-2-2-2.9s.7-1.5 2-2.9L12.7 4c1.4-1.3 2-2 3-2 .8 0 1.4.7 2.8 2L20 5.5c1.3 1.4 2 2 2 2.9s-.7 1.5-2 2.9L11.3 20c-1.4 1.3-2 2-3 2-.8 0-1.4-.7-2.8-2z"></path>
            <path d="m8.5 8.5 1.4 1.4" className="sn-ic-d"></path>
            <path d="m12.7 4.2 1.4 1.4" className="sn-ic-d"></path>
            <path d="m4.2 12.7 1.4 1.4" className="sn-ic-d"></path>
            <path d="m6.3 10.6 2.2 2.1" className="sn-ic-d"></path>
            <path d="m10.6 6.3 2.1 2.2" className="sn-ic-d"></path>
          </svg>
          <span>ruler</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="scan" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 22c-3.8 0-5.7 0-6.8-1.2C2 19.7 2 18.8 2 15" className="sn-ic-d"></path>
            <path d="M22 15c0 3.8 0 4.7-1.2 5.8-1.1 1.2-3 1.2-6.8 1.2" className="sn-ic-d"></path>
            <path d="M14 2c3.8 0 5.7 0 6.8 1.2C22 4.3 22 5.2 22 9" className="sn-ic-d"></path>
            <path d="M10 2C6.2 2 4.3 2 3.2 3.2 2 4.3 2 5.2 2 9" className="sn-ic-d"></path>
            <path d="M2 12h20"></path>
          </svg>
          <span>scan</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="scan-eye" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 22c-3.8 0-5.7 0-6.8-1.2C2 19.7 2 18.8 2 15" className="sn-ic-d"></path>
            <path d="M22 15c0 3.8 0 4.7-1.2 5.8-1.1 1.2-3 1.2-6.8 1.2" className="sn-ic-d"></path>
            <path d="M14 2c3.8 0 5.7 0 6.8 1.2C22 4.3 22 5.2 22 9" className="sn-ic-d"></path>
            <path d="M10 2C6.2 2 4.3 2 3.2 3.2 2 4.3 2 5.2 2 9" className="sn-ic-d"></path>
            <path d="M12 7a8 8 0 00-6.1 3q-.9.7-.9 2t.9 2a8 8 0 006.1 3c3 0 5-1.6 6.1-3q.9-.7.9-2t-.9-2A8 8 0 0012 7"></path>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
          <span>scan-eye</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="scissors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16.4 20.5 6 2m16 17a3 3 0 11-6 0 3 3 0 016 0" className="sn-ic-d"></path>
            <path d="M7.6 20.5 18 2M2 19a3 3 0 106 0 3 3 0 00-6 0"></path>
          </svg>
          <span>scissors</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="search" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11.5" cy="11.5" r="9.5" className="sn-ic-d"></circle>
            <path d="M18.5 18.5 22 22"></path>
          </svg>
          <span>search</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="server" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 21h12q2.7.1 3.4-.6.8-.7.6-3.4.1-2.7-.6-3.4T18 13H6q-2.7-.2-3.4.6-.7.7-.6 3.4-.1 2.7.6 3.4.7.8 3.4.6" className="sn-ic-d"></path>
            <path d="M6 10h12q2.7.2 3.4-.6.8-.7.6-3.4.1-2.7-.6-3.4T18 2H6q-2.7-.1-3.4.6T2 6q-.1 2.7.6 3.4.7.8 3.4.6" className="sn-ic-d"></path>
            <path d="M13.5 6H18"></path>
            <path d="M6 7V5"></path>
            <path d="M9 7V5"></path>
            <path d="M13.5 17H18"></path>
            <path d="M6 18v-2"></path>
            <path d="M9 18v-2"></path>
          </svg>
          <span>server</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="settings" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 2q1.3 0 1.8.2.7.3 1 1l.2.9q0 .8.8 1.4.7.3 1.5 0l.9-.3q.8-.2 1.4.3t1 1.5q.8 1.1.8 1.6.1.7-.4 1.5-.1.3-.7.5-.6.5-.7 1.4t.7 1.4q.6.3.7.5.5.7.4 1.5 0 .5-.7 1.6l-1 1.5a2 2 0 01-1.5.3q-.4 0-.9-.3-.7-.3-1.5 0-.8.5-.8 1.4 0 .5-.2.9a2 2 0 01-1 1q-.5.3-1.8.2t-1.8-.2a2 2 0 01-1-1l-.2-.9q0-.9-.8-1.4-.7-.3-1.5 0l-.9.3q-.8.1-1.4-.3t-1-1.5l-.8-1.6q-.1-.7.4-1.5.1-.2.7-.5.7-.5.7-1.4t-.7-1.4q-.6-.2-.7-.5a2 2 0 01-.4-1.5q0-.5.7-1.6l1-1.5a2 2 0 011.5-.3q.4 0 .9.3.7.3 1.5 0Q9 5 9 4q0-.5.2-.9a2 2 0 011-1z" className="sn-ic-d"></path>
          </svg>
          <span>settings</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="share" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19.5 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0"></path>
            <path d="M14.5 18.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0"></path>
            <path d="M4.5 12a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0"></path>
            <path d="m9.1 13.4 5.8 3.7" className="sn-ic-d"></path>
            <path d="M9.1 10.6 14.9 7" className="sn-ic-d"></path>
          </svg>
          <span>share</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="shield" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12v-1.6q.1-4.7-.4-5.3c-.4-.6-1.9-1-4.9-2.1l-.5-.2C13.6 2.3 12.8 2 12 2s-1.6.3-3.2.8l-.5.2q-4.4 1.4-5 2-.4.8-.3 5.4V12c0 5.6 4.2 8.4 6.9 9.5.7.3 1 .5 2.1.5 1 0 1.4-.2 2.1-.5 2.7-1.1 6.9-3.9 6.9-9.5" className="sn-ic-d"></path>
            <path d="m3 11 9-3 9 3"></path>
            <path d="M12 2v19.5"></path>
          </svg>
          <span>shield</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="sliders-horizontal" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9.5 14a3 3 0 110 6 3 3 0 010-6"></path>
            <path d="M14.5 4a3 3 0 100 6 3 3 0 000-6"></path>
            <path d="M13 17h9" className="sn-ic-d"></path>
            <path d="M11 7H2" className="sn-ic-d"></path>
            <path d="M2 17h4" className="sn-ic-d"></path>
            <path d="M22 7h-4" className="sn-ic-d"></path>
          </svg>
          <span>sliders-horizontal</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="sparkles" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m11.6 10.9.6.9.9.6.4.2c1.7 1 3 1.4 3 2.2 0 .7-1.3 1.2-3 2.1l-.4.3q-.7.3-.9.6l-.6.9-.2.4c-1 1.7-1.4 2.9-2.2 2.9q-.9-.2-2.1-2.9l-.3-.4-.6-1-.9-.5-.4-.3Q2.2 15.7 2 14.8c-.2-.9 1.2-1.2 2.9-2.2l.4-.2 1-.6.5-.9.3-.4c1-1.7 1.4-3 2.1-3s1.2 1.3 2.2 3z"></path>
            <path d="m16 3.4.2.4.4.2.2.1q1.1.5 1.2.9t-1.2.9h-.2l-.4.3-.2.4-.1.2Q15.4 7.9 15 8t-.9-1.2v-.2l-.3-.4-.4-.2-.2-.1Q12.1 5.4 12 5t1.2-.9h.2l.4-.3.2-.4.1-.2q.5-1.1.9-1.2t.9 1.2zm4.7 5.5.1.3.3.1.1.1q.8.4.8.6t-.8.6h-.1l-.3.2-.1.3-.1.1q-.4.8-.6.8t-.6-.8v-.1l-.2-.3-.3-.1-.1-.1q-.8-.4-.8-.6t.8-.6h.1l.3-.2.1-.3.1-.1q.4-.8.6-.8t.6.8z" className="sn-ic-d"></path>
          </svg>
          <span>sparkles</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="square" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22c-4.7 0-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2s7 0 8.5 1.5C22 4.9 22 7.3 22 12s0 7-1.5 8.5C19.1 22 16.7 22 12 22Z"></path>
          </svg>
          <span>square</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="square-check-big" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22c-4.7 0-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2s7 0 8.5 1.5C22 4.9 22 7.3 22 12s0 7-1.5 8.5C19.1 22 16.7 22 12 22" className="sn-ic-d"></path>
            <path d="m8.5 12.5 2 2 5-5"></path>
          </svg>
          <span>square-check-big</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="square-pen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 10.5V12c0 4.7 0 7-1.5 8.5C19.1 22 16.7 22 12 22s-7 0-8.5-1.5C2 19.1 2 16.7 2 12s0-7 1.5-8.5C4.9 2 7.3 2 12 2h1.5" className="sn-ic-d"></path>
            <path d="m16.7 3.5.6-.7a2.8 2.8 0 013.9 3.9l-.7.6-6 6-.7.8-.9.5-1 .4-1.8.6L9 16a.7.7 0 01-1-1l.4-1.1.6-1.7.4-1.1.5-.9.8-.8z"></path>
            <path d="M16.7 3.5s0 1.3 1.2 2.6a4 4 0 002.6 1.2m-10.4 8.3-1.7-1.7" className="sn-ic-d"></path>
          </svg>
          <span>square-pen</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6.7 7.6-.7.2c-2.4.5-3.6.8-4 1.7-.2 1 .6 2 2.3 4l.4.4.8 1.2v2.2q-.6 3.8.4 4.5.9.6 4.2-1l.6-.3q.9-.5 1.3-.5t1.3.5l.6.3q3.3 1.6 4.2 1 1-.8.4-4.5V15q0-.4.8-1.2l.4-.5c1.7-2 2.5-3 2.2-3.9s-1.5-1.2-4-1.7l-.6-.2q-1-.1-1.3-.4T15.2 6l-.4-.6Q13.2 2 12 2c-1 0-1.6 1.1-2.8 3.4l-.4.6q-.4.9-.8 1.2-.3.3-1.3.4Z"></path>
          </svg>
          <span>star</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="M4 12H2"></path>
            <path d="M22 12h-2"></path>
            <path d="m19.8 4.2-2.2 2" className="sn-ic-d"></path>
            <path d="m4.2 4.2 2.2 2" className="sn-ic-d"></path>
            <path d="m6.4 17.6-2.2 2.2" className="sn-ic-d"></path>
            <path d="m19.8 19.8-2.2-2.2" className="sn-ic-d"></path>
          </svg>
          <span>sun</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="swatch-book" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.8 22A10 10 0 1122 12c0 8.2-8.2 2.4-9.7 5q-.4 1 .5 1.9c.7.6.7 1.7 0 2.3q-.8 1-2 .8"></path>
            <circle cx="17.5" cy="11.5" r="1.5" className="sn-ic-d"></circle>
            <circle cx="6.5" cy="11.5" r="1.5" className="sn-ic-d"></circle>
            <path d="M11 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0" className="sn-ic-d"></path>
            <path d="M16 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0" className="sn-ic-d"></path>
          </svg>
          <span>swatch-book</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="table-cells-merge" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 15.3h9m0 0h9m-9 0V22M3 8.7h9m0 0h9m-9 0V2" className="sn-ic-d"></path>
            <path d="M3 10v4c0 3.8 0 5.7 1.2 6.8C5.3 22 7.2 22 11 22h2c3.8 0 5.7 0 6.8-1.2 1.2-1.1 1.2-3 1.2-6.8v-4c0-3.8 0-5.7-1.2-6.8C18.7 2 16.8 2 13 2h-2C7.2 2 5.3 2 4.2 3.2 3 4.3 3 6.2 3 10"></path>
          </svg>
          <span>table-cells-merge</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="table-cells-split" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 15.3h18" className="sn-ic-d"></path>
            <path d="M3 8.7h18" className="sn-ic-d"></path>
            <path d="M12 8.7v6.6"></path>
            <path d="M3 10v4c0 3.8 0 5.7 1.2 6.8C5.3 22 7.2 22 11 22h2c3.8 0 5.7 0 6.8-1.2 1.2-1.1 1.2-3 1.2-6.8v-4c0-3.8 0-5.7-1.2-6.8C18.7 2 16.8 2 13 2h-2C7.2 2 5.3 2 4.2 3.2 3 4.3 3 6.2 3 10"></path>
          </svg>
          <span>table-cells-split</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="tag" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m2.9 7.4-.3 1.2c-.5 2.1-.8 3.2-.5 4.2s1 1.8 2.6 3.3L6.6 18c2.6 2.7 4 4 5.7 4 1.6 0 3-1.3 5.7-4s4-4 4-5.7-1.3-3-4-5.7l-2-1.9c-1.5-1.5-2.3-2.3-3.3-2.6s-2 0-4.2.5l-1.2.3Q4.9 3.4 4 4q-.7.8-1.2 3.3"></path>
            <circle cx="8.6" cy="8.9" r="2" className="sn-ic-d"></circle>
            <path d="m11.5 18.5 7-7" className="sn-ic-d"></path>
          </svg>
          <span>tag</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="thumbs-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 13.5V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8.5a1 1 0 001 1h3Z" className="sn-ic-d"></path>
            <path d="M7 13.5l3.6 6.6A1.8 1.8 0 0013.8 19v-3.5h4.7a2.2 2.2 0 002.2-2.6l-1.2-7.2A2.8 2.8 0 0016.7 3H7"></path>
          </svg>
          <span>thumbs-down</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="thumbs-up" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 10.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-8.5a1 1 0 011-1h3Z" className="sn-ic-d"></path>
            <path d="M7 10.5l3.6-6.6A1.8 1.8 0 0113.8 5v3.5h4.7a2.2 2.2 0 012.2 2.6l-1.2 7.2A2.8 2.8 0 0116.7 21H7"></path>
          </svg>
          <span>thumbs-up</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="timer" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 13a9 9 0 11-18 0 9 9 0 0118 0" className="sn-ic-d"></path>
            <path d="M12 13V9"></path>
            <path d="M10 2h4"></path>
          </svg>
          <span>timer</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="trash-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.5 6h-17"></path>
            <path d="m18.8 8.5-.4 6.9c-.2 2.7-.3 4-1.2 4.8s-2.2.8-4.8.8h-.8q-3.7.2-4.8-.8c-1-.8-1-2.1-1.2-4.8l-.4-6.9"></path>
            <path d="m9.5 11 .5 5" className="sn-ic-d"></path>
            <path d="m14.5 11-.5 5" className="sn-ic-d"></path>
            <path d="M6.5 6a2 2 0 001.8-1.3v-.1l.2-.3q0-.4.2-.5.3-.6 1-.8h4.4q.7.1 1 .8l.2.5.1.3a2 2 0 002 1.4" className="sn-ic-d"></path>
          </svg>
          <span>trash-2</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="triangle-alert" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11.6 21h.8c5.4 0 8.1 0 9.2-1.6 1-1.5-.1-3.7-2.5-8l-.4-.6C15.7 5.6 14.3 3 12 3s-3.8 2.6-6.7 7.8l-.4.6c-2.4 4.3-3.6 6.5-2.5 8C3.5 21 6.2 21 11.6 21" className="sn-ic-d"></path>
            <path d="M12 8v5"></path>
            <path d="M12 16h.01"></path>
          </svg>
          <span>triangle-alert</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="type" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 8V7q.1-2.7-.6-3.4T16 3H8q-2.7-.1-3.4.6T4 7v1"></path>
            <path d="M12 21V3" className="sn-ic-d"></path>
            <path d="M7 21h10"></path>
          </svg>
          <span>type</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="undo-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 4 4 7l3 3"></path>
            <path d="M4 7h11a5 5 0 010 10H8" className="sn-ic-d"></path>
          </svg>
          <span>undo-2</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="upload" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 15c0 2.8 0 4.2.9 5.1s2.3.9 5.1.9h6c2.8 0 4.2 0 5.1-.9s.9-2.3.9-5.1" className="sn-ic-d"></path>
            <path d="M12 16V3M8 7.4 12 3l4 4.4"></path>
          </svg>
          <span>upload</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="user" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="6" r="4"></circle>
            <ellipse cx="12" cy="17" className="sn-ic-d" rx="7" ry="4"></ellipse>
          </svg>
          <span>user</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="user-plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16.7 14q-2-1-4.7-1c-3.9 0-7 1.8-7 4s3.1 4 7 4q1.2 0 2.2-.2" className="sn-ic-d"></path>
            <path d="M21 18a4 4 0 11-8 0 4 4 0 018 0"></path>
            <circle cx="12" cy="6" r="4"></circle>
            <path d="M17 16.7v2.6"></path>
            <path d="M15.7 18h2.6"></path>
          </svg>
          <span>user-plus</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="users" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="6" r="4"></circle>
            <path d="M12.6 4.2a3 3 0 110 3.6" className="sn-ic-d"></path>
            <ellipse cx="9" cy="17" rx="7" ry="4"></ellipse>
            <path d="M18 14q2.9.7 3 2.5c0 1-1 2-2.5 2.4" className="sn-ic-d"></path>
          </svg>
          <span>users</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="volume-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1.5 12v1q0 1.7.5 2.4.4.9 1.3 1.3.7.4 2.7.3h1q.4 0 .7.3.4 0 .9.5l.2.1c2.6 1.7 3.8 2.5 4.9 2.2l.6-.3q1.2-.9 1.1-5.2V9.4q0-4.3-1.1-5.2l-.6-.3c-1-.3-2.3.5-4.9 2.2l-.2.1-.9.5L7 7H6c-1.4 0-2 0-2.7.3q-.8.3-1.3 1.3-.5.8-.5 2.4z"></path>
            <path d="M20 6s1.5 1.8 1.5 6-1.5 6-1.5 6" className="sn-ic-d"></path>
            <path d="M18 9s.5.9.5 3-.5 3-.5 3" className="sn-ic-d"></path>
          </svg>
          <span>volume-2</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="wand-sparkles" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.2 20.2a3 3 0 01-4.1 0L3.8 7.9A2.9 2.9 0 118 4l12.2 12c1 1.1 1 3 0 4"></path>
            <path d="m6 10 4-4" className="sn-ic-d"></path>
            <path d="m15.4 3.7-1 .4q-.7.4 0 1l1 .3.3.3.4 1.1q.5.6.9 0l.4-1q0-.3.3-.4l1-.4q.8-.5 0-.9l-1-.4-.3-.3-.4-1a.5.5 0 00-.9 0l-.4 1z"></path>
            <path d="m19.5 9.8-.4.2c-.4.1-.4.7 0 .9l.4.1q.3 0 .3.3l.2.4c.1.4.7.4.9 0l.1-.4.3-.3.4-.1c.4-.2.4-.8 0-1l-.4-.1-.3-.3-.1-.4a.5.5 0 00-1 0v.4q-.1.3-.4.3" className="sn-ic-d"></path>
            <path d="m4.7 16-.4.1q-.6.5 0 1l.4.1.3.3.1.4c.2.4.8.4 1 0v-.4q.1-.3.4-.3l.4-.2c.4-.1.4-.7 0-.9l-.4-.1-.3-.3-.2-.4a.5.5 0 00-.9 0l-.1.4z" className="sn-ic-d"></path>
          </svg>
          <span>wand-sparkles</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="wifi-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2 2 22"></path>
            <path d="M13 14.5q1.3.3 2.3 1.4" className="sn-ic-d"></path>
            <path d="M5.3 12.3a9 9 0 019-2.7" className="sn-ic-d"></path>
            <path d="m16.8 10.7 1.9 1.6" className="sn-ic-d"></path>
            <path d="M2 8.7C6.4 4 13 3 18.2 5.7" className="sn-ic-d"></path>
            <path d="M20.3 7.1 22 8.7" className="sn-ic-d"></path>
            <path d="M12 19.5h.01" className="sn-ic-d"></path>
          </svg>
          <span>wifi-off</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="workflow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 10v4q-.2 2.7.6 3.4.7.8 3.4.6h4" className="sn-ic-d"></path>
            <path d="M2 6V5q-.1-2 .4-2.6Q3 2 5 2h2q2-.1 2.6.4.5.6.4 2.6v2q.1 2-.4 2.6Q9 10 7 10H5q-2 .1-2.6-.4Q2 9 2 7z"></path>
            <path d="M14 18v-1q-.1-2 .4-2.6.6-.5 2.6-.4h2q2-.1 2.6.4.5.6.4 2.6v2q.1 2-.4 2.6-.6.5-2.6.4h-2q-2 .1-2.6-.4Q14 21 14 19z"></path>
          </svg>
          <span>workflow</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="x" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
          <span>x</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="zap" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13.5 7.2c0-3.2 0-4.9-.9-5.2s-1.9 1-3.9 3.8l-3 4.1c-1.3 1.8-2 2.6-1.6 3.3q.5.9 3.7.7 1.8-.1 2.3.4.5.5.4 2.1v.4c0 3.2 0 4.9.8 5.2s2-1.1 4-3.8l3-4.1c1.3-1.8 2-2.6 1.6-3.3q-.5-.9-3.7-.7-1.8.1-2.2-.4-.6-.5-.5-2.1Z"></path>
          </svg>
          <span>zap</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="zoom-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11.5" cy="11.5" r="9.5" className="sn-ic-d"></circle>
            <path d="M18.5 18.5 22 22M9 11.5h2.5m0 0H14m-2.5 0V14m0-2.5V9"></path>
          </svg>
          <span>zoom-in</span>
        </div>
        <div className="icon-cell">
          <svg className="sn-ic" data-icon="zoom-out" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11.5" cy="11.5" r="9.5" className="sn-ic-d"></circle>
            <path d="M18.5 18.5 22 22M9 11.5h5"></path>
          </svg>
          <span>zoom-out</span>
        </div>
      </div>
    </div>
  );
}
