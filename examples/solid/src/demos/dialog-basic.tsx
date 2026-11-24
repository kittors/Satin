import { closeDialog, toast } from "satin-ui";

// 标记照设计稿写，<sn-enhance> 接上 data-dlg 触发按钮、Esc、取消
export default function RenameProject() {
  let dlg!: HTMLDialogElement, input!: HTMLInputElement;
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  function save() {
    closeDialog(dlg);
    toast({ text: "已改名为：" + input.value.trim() });
  }
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-primary" data-dlg="dlg-rename">重命名</button>
      <dialog ref={(el) => (dlg = el)} class="sn-dlg" id="dlg-rename" aria-labelledby="dlg-rename-t">
        <form method="dialog" onSubmit={save}>
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-rename-t">重命名项目</h3><div class="sn-sub">新名称会同步给所有协作者。</div></div></div>
          <div class="sn-bd">
            <div class="sn-field"><label class="sn-lbl" for="dlg-rename-name">项目名称</label><input ref={(el) => (input = el)} class="sn-input" id="dlg-rename-name" value="雨夜车站" autocomplete="off" /></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
        </form>
      </dialog>
    </sn-enhance>
  );
}
