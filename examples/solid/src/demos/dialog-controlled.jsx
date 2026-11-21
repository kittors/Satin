import { closeDialog, openDialog, toast } from "satin-ui";

export default function NewProject() {
  let dlg, input;
  function create() {
    const name = input.value.trim() || "未命名项目";
    closeDialog(dlg);
    toast({ text: "已创建：" + name });
  }
  // 自己控制开关：openDialog 从按钮那里长出来（顺便接上 Esc、取消），closeDialog 原路缩回
  return (
    <>
      <button type="button" class="sn-btn sn-primary" onClick={(e) => openDialog(dlg, e.currentTarget)}>新建项目</button>
      <dialog ref={(el) => (dlg = el)} class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
        <form method="dialog" onSubmit={create}>
          <div class="sn-hd"><div style="flex:1"><h3 id="dlg-ctl-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div></div>
          <div class="sn-bd">
            <div class="sn-field"><label class="sn-lbl" for="dlg-ctl-name">项目名称</label><input ref={(el) => (input = el)} class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off" /></div>
          </div>
          <div class="sn-ft"><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">创建项目</button></div>
        </form>
      </dialog>
    </>
  );
}
