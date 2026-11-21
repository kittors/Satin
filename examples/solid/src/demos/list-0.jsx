import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./list-0.css";

export default function ListDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sn-list-grid">
        <div class="sn-set-list">
          <div class="sn-set-row" tabindex="0">
            <span class="sn-ico" data-i="user"></span>
            <div class="sn-tx">
              <b>个人资料</b>
              <span>头像、昵称、邮箱</span>
            </div>
            <span class="sn-end" data-i="chevron-right"></span>
          </div>
          <div class="sn-set-row" tabindex="0">
            <span class="sn-ico" data-i="bell"></span>
            <div class="sn-tx">
              <b>生成完成时提醒</b>
              <span>在桌面右上角显示通知</span>
            </div>
            <label class="sn-switch">
              <input type="checkbox" checked />
              <span class="sn-track">
                <span class="sn-knob"></span>
              </span>
            </label>
          </div>
          <div class="sn-set-row" tabindex="0">
            <span class="sn-ico" data-i="layout-grid"></span>
            <div class="sn-tx">
              <b>默认画面比例</b>
            </div>
            <span class="sn-val">16:9</span>
            <span class="sn-end" data-i="chevron-right"></span>
          </div>
          <div class="sn-set-row" tabindex="0">
            <span class="sn-ico" data-i="key-round"></span>
            <div class="sn-tx">
              <b>修改密码</b>
            </div>
            <span class="sn-end" data-i="chevron-right"></span>
          </div>
          <div class="sn-set-row sn-danger" tabindex="0">
            <span class="sn-ico" data-i="log-out"></span>
            <div class="sn-tx">
              <b>退出登录</b>
            </div>
          </div>
        </div>
        <dl class="sn-kv">
          <dt>项目</dt>
          <dd>雨夜车站</dd>
          <dt>负责人</dt>
          <dd><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</dd>
          <dt>状态</dt>
          <dd>
            <span class="sn-tag sn-ok"><i></i>已完成</span>
          </dd>
          <dt>镜头</dt>
          <dd class="sn-num">48 个 · 12 分 36 秒</dd>
          <dt>项目 ID</dt>
          <dd>
            <code class="k">project_7f3k2q</code>
            <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-copy="" data-tip="复制">
              <span class="sn-swap">
                <span class="sn-a" data-i="copy"></span>
                <span class="sn-b" data-i="check"></span>
              </span>
            </button>
          </dd>
          <dt>创建时间</dt>
          <dd class="sn-num">2026-11-02 14:20</dd>
        </dl>
      </div>
    </div>
  );
}
