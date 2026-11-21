<script>
  import { tick } from "svelte";
  import Dialog from "satin-ui/svelte/Dialog.svelte";

  let open = $state(false), note = $state(""), asking = $state(false);
  let noteEl = $state(), keepBtn = $state();
  // 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框
  async function ask(on) {
    asking = on;
    await tick();
    (on ? keepBtn : noteEl).focus();
  }
  // Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
  const guard = (close) => (asking ? ask(false) : note.trim() ? ask(true) : close());
  function discard() {
    open = false;
    note = "";
    asking = false;
  }
</script>

<button type="button" class="sn-btn sn-secondary" onclick={() => (open = true)}>写备注</button>
<Dialog bind:open title="给第 3 场写备注" {guard} footerClass={asking ? "sn-two sn-asking" : "sn-two"} onsubmit={() => (open = false)}>
  <textarea bind:this={noteEl} bind:value={note} class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea>
  {#snippet footer()}
    <div class="sn-g sn-a" inert={asking}><button type="button" class="sn-btn sn-ghost" data-cancel>取消</button><button type="submit" class="sn-btn sn-primary">保存</button></div>
    <div class="sn-g sn-b" inert={!asking}><span>放弃填写的内容？</span><button type="button" class="sn-btn sn-ghost" bind:this={keepBtn} onclick={() => ask(false)}>继续填写</button><button type="button" class="sn-btn sn-danger-soft" onclick={discard}>放弃</button></div>
  {/snippet}
</Dialog>
