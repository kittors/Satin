import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import "./iconbutton-0.css";

export default function IconbuttonDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div id="ibtns">
        <div className="mx-r">
          <span className="sn-cap">无边框（默认）</span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="设置">
              <span data-i="settings"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="通知">
              <span data-i="bell"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="分享">
              <span data-i="share"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="下载">
              <span data-i="download"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="删除">
              <span data-i="trash-2"></span>
            </button>
            <small></small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">无边框 · 小</span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="设置">
              <span data-i="settings"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="通知">
              <span data-i="bell"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="分享">
              <span data-i="share"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="下载">
              <span data-i="download"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="删除">
              <span data-i="trash-2"></span>
            </button>
            <small></small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">带底色</span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-ibtn" data-tip="设置">
              <span data-i="settings"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-ibtn" data-tip="通知">
              <span data-i="bell"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-ibtn" data-tip="分享">
              <span data-i="share"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-ibtn" data-tip="下载">
              <span data-i="download"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-ibtn" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-ibtn" data-tip="删除">
              <span data-i="trash-2"></span>
            </button>
            <small></small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">带边框</span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-ibtn" data-tip="设置">
              <span data-i="settings"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-ibtn" data-tip="通知">
              <span data-i="bell"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-ibtn" data-tip="分享">
              <span data-i="share"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-ibtn" data-tip="下载">
              <span data-i="download"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-ibtn" data-tip="更多">
              <span data-i="ellipsis"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-secondary sn-ibtn" data-tip="删除">
              <span data-i="trash-2"></span>
            </button>
            <small></small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">圆形</span>
          <span className="mx-c">
            <button className="sn-btn sn-primary sn-round sn-ibtn" data-tip="播放">
              <span data-i="play"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-round sn-ibtn" data-tip="暂停">
              <span data-i="pause"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-round sn-ibtn" data-tip="重播">
              <span data-i="rotate-ccw"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-round sn-ibtn" data-tip="关闭">
              <span data-i="x"></span>
            </button>
            <small></small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">选中</span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-selected sn-ibtn" data-tip="图层（已打开）">
              <span data-i="layers"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="调整">
              <span data-i="sliders-horizontal"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-selected sn-ibtn" data-tip="筛选（已打开）">
              <span data-i="list-filter"></span>
            </button>
            <small></small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">徽标</span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="通知">
              <span data-i="bell"></span>
              <span className="sn-count">3</span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="收件箱">
              <span data-i="inbox"></span>
              <span className="sn-count">12</span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn" data-tip="有新动态">
              <span data-i="bell"></span>
              <span className="sn-dot"></span>
            </button>
            <small></small>
          </span>
        </div>
        <div className="mx-r">
          <span className="sn-cap">禁用</span>
          <span className="mx-c">
            <button className="sn-btn sn-ghost sn-ibtn sn-is-disabled" data-tip="还没有可以下载的成片" aria-disabled="true">
              <span data-i="download"></span>
            </button>
            <small></small>
          </span>
          <span className="mx-c">
            <button className="sn-btn sn-tertiary sn-ibtn sn-is-disabled" data-tip="先保存项目才能分享" aria-disabled="true">
              <span data-i="share"></span>
            </button>
            <small></small>
          </span>
        </div>
      </div>
    </div>
  );
}
