<script lang="ts">
  import { popoverOf } from "satin-ui";

  const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];
  let rate = $state("16:9"), pop!: HTMLDivElement;
  // 改动立即生效、不需要"保存"：选了就把面板关上
  $effect(() => { rate; if (pop) popoverOf(pop)?.close(); });
</script>

<!-- <sn-enhance> 接上 data-pop 触发按钮；改动立即生效、不需要"保存"：选了就把面板关上 -->
<sn-enhance>
  <button type="button" class="sn-btn sn-secondary" data-pop="pop-rate" aria-haspopup="dialog" aria-expanded="false">画面比例：{rate}</button>
  <div class="sn-pop sn-popover" id="pop-rate" role="dialog" aria-label="画面比例" bind:this={pop}>
    <h4>画面比例</h4>
    <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
      {#each RATES as [v, label] (v)}
        <label class="sn-radio"><input type="radio" name="pop-rate" value={v} bind:group={rate} onchange={() => popoverOf(pop)?.close()} /><span class="sn-box"></span>{label}</label>
      {/each}
    </div>
  </div>
</sn-enhance>
