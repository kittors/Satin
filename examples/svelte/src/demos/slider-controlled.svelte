<script>
  import Slider from "satin-ui/svelte/Slider.svelte";

  let value = $state(72);
</script>

<div class="sn-stack sn-gap-8">
  <Slider max={100} label="不透明度" bind:value={value} />
  <span class="sn-help">{`不透明度 ${value}%`}</span>
</div>
