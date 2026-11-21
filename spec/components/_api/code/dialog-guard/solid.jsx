import { createSignal, onSettled } from "solid-js";
import { closeDialog } from "satin-ui";

// 标记照设计稿写，<sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
export default function SceneNote() {
  const [asking, setAsking] = createSignal(false);
  let dlg, note, keep;
  const close = () => closeDialog(dlg);
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框
  function ask(on) {
    setAsking(on);
    onSettled(() => (on ? keep : note).focus());
  }
  function discard() {
    close();
    note.value = "";
    setAsking(false);
  }
  // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
  onSettled(() => {
    dlg.guard = () => (asking() ? ask(false) : note.value.trim() ? ask(true) : close());
  });
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-note">写备注</button>
      <dialog class="sn-dlg" id="dlg-note" aria-labelledby="dlg-note-t" ref={(el) => (dlg = el)}>
        <form method="dialog" onSubmit={close}>
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-note-t">给第 3 场写备注</h3></div></div>
          <div class="sn-bd"><textarea class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷" ref={(el) => (note = el)}></textarea></div>
          <div class={asking() ? "sn-ft sn-two sn-asking" : "sn-ft sn-two"}>
            <div class="sn-g sn-a" inert={asking()}><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
            <div class="sn-g sn-b" inert={!asking()}><span>放弃填写的内容？</span><button type="button" class="sn-btn sn-ghost" ref={(el) => (keep = el)} onClick={() => ask(false)}>继续填写</button><button type="button" class="sn-btn sn-danger-soft" onClick={discard}>放弃</button></div>
          </div>
        </form>
      </dialog>
    </sn-enhance>
  );
}
