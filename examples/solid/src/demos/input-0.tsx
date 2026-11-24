import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./input-0.css";

export default function InputDemo0() {
  let root!: HTMLDivElement;
  let off = () => {};
  onSettled(() => {
    if (!root) return;
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el: HTMLDivElement) => (root = el)}>
      <div class="grid-m auto" style="--min:200px;gap:20px 20px;align-items:start" id="inputStates">
        <div class="sn-field">
          <span class="sn-cap">默认</span>
          <input class="sn-input" value="" placeholder="name@example.com" />
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-cap">悬停</span>
          <input class="sn-input sn-is-hover" value="owner@example.com" placeholder="name@example.com" />
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-cap">聚焦</span>
          <input class="sn-input sn-is-focus" value="owner@example.com" placeholder="name@example.com" />
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field sn-bad">
          <span class="sn-cap">错误</span>
          <input class="sn-input" value="owner@example.com" placeholder="name@example.com" />
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-cap">禁用</span>
          <input class="sn-input sn-is-disabled" value="owner@example.com" placeholder="name@example.com" disabled />
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-cap">只读</span>
          <input class="sn-input sn-is-readonly" value="owner@example.com" placeholder="name@example.com" readonly />
          <div class="sn-err">
            <span>邮箱格式不对</span>
          </div>
        </div>
      </div>
    </div>
  );
}
