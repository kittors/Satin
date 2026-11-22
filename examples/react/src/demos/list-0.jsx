import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Avatar } from "satin-ui/react";
import "./list-0.css";

export default function ListDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-list-grid">
        <div className="sn-set-list">
          <div className="sn-set-row" tabIndex="0">
            <span className="sn-ico" data-i="user"></span>
            <div className="sn-tx">
              <b>个人资料</b>
              <span>头像、昵称、邮箱</span>
            </div>
            <span className="sn-end" data-i="chevron-right"></span>
          </div>
          <div className="sn-set-row" tabIndex="0">
            <span className="sn-ico" data-i="bell"></span>
            <div className="sn-tx">
              <b>生成完成时提醒</b>
              <span>在桌面右上角显示通知</span>
            </div>
            <label className="sn-switch">
              <input type="checkbox" defaultChecked />
              <span className="sn-track">
                <span className="sn-knob"></span>
              </span>
            </label>
          </div>
          <div className="sn-set-row" tabIndex="0">
            <span className="sn-ico" data-i="layout-grid"></span>
            <div className="sn-tx">
              <b>默认画面比例</b>
            </div>
            <span className="sn-val">16:9</span>
            <span className="sn-end" data-i="chevron-right"></span>
          </div>
          <div className="sn-set-row" tabIndex="0">
            <span className="sn-ico" data-i="key-round"></span>
            <div className="sn-tx">
              <b>修改密码</b>
            </div>
            <span className="sn-end" data-i="chevron-right"></span>
          </div>
          <div className="sn-set-row sn-danger" tabIndex="0">
            <span className="sn-ico" data-i="log-out"></span>
            <div className="sn-tx">
              <b>退出登录</b>
            </div>
          </div>
        </div>
        <dl className="sn-kv">
          <dt>项目</dt>
          <dd>雨夜车站</dd>
          <dt>负责人</dt>
          <dd><Avatar seed="u3" name="林夏" size={20} decorative />林夏</dd>
          <dt>状态</dt>
          <dd>
            <span className="sn-tag sn-ok"><i></i>已完成</span>
          </dd>
          <dt>镜头</dt>
          <dd className="sn-num">48 个 · 12 分 36 秒</dd>
          <dt>项目 ID</dt>
          <dd>
            <code className="k">project_7f3k2q</code>
            <button className="sn-btn sn-ghost sn-sm sn-ibtn" data-copy="" data-tip="复制">
              <span className="sn-swap">
                <span className="sn-a" data-i="copy"></span>
                <span className="sn-b" data-i="check"></span>
              </span>
            </button>
          </dd>
          <dt>创建时间</dt>
          <dd className="sn-num">2026-11-02 14:20</dd>
        </dl>
      </div>
    </div>
  );
}
