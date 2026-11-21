import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import "./input-1.css";

export default function InputDemo1() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root);
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="grid-m auto" style="--min:150px;gap:16px">
        <div class="sn-field">
          <span class="sn-cap">sm 28</span>
          <input class="sn-input sn-sm" placeholder="表格、工具条" />
        </div>
        <div class="sn-field">
          <span class="sn-cap">md 32（默认）</span>
          <input class="sn-input" placeholder="大多数地方" />
        </div>
        <div class="sn-field">
          <span class="sn-cap">lg 36</span>
          <input class="sn-input sn-lg" placeholder="主要表单" />
        </div>
        <div class="sn-field">
          <span class="sn-cap">xl 40</span>
          <input class="sn-input sn-xl" placeholder="登录、欢迎页" />
        </div>
      </div>
    </div>
  );
}
