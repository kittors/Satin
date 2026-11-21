import { onSettled, onCleanup } from "solid-js";
import { setup, enhance, busy, succeed } from "satin-ui";

export default function ButtonBusy() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      const save = root.querySelector('[data-act="save"]');
      // 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
      const request = () => new Promise((done) => setTimeout(done, 1200));
      save.addEventListener("click", async () => {
        await busy(save, request());
        succeed(save);
      });
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <button type="button" class="sn-btn sn-primary" data-act="save">
        <span class="sn-sheen"></span>
        <span class="sn-label">
          <span class="sn-spin"></span>
          <svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3.5 8.5l3 3 6-7"></path>
          </svg>
          <span class="sn-txt">保存修改</span>
        </span>
      </button>
    </div>
  );
}
