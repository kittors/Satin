<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { createSlider } from "satin-ui/components";
  import "./slider-0.css";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      const slider = createSlider(root.querySelector("[data-slider]"), {
        onChange: (value) => console.log("当前值", value),
      });
      slider.update({ value: 60 }); // 从外面改值
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="row" style="gap:40px">
    <div class="sn-field">
      <span class="sn-lbl">画面强度</span>
      <div class="sn-slider" data-slider="" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52">
        <span class="sn-rail"></span>
        <span class="sn-fillbar"></span>
        <span class="sn-knob"></span>
        <span class="sn-bubble"></span>
      </div>
    </div>
    <div class="sn-field">
      <span class="sn-lbl">镜头时长（秒）</span>
      <div class="sn-slider" data-slider="" data-max="12" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="12" aria-valuenow="4">
        <span class="sn-rail"></span>
        <span class="sn-fillbar"></span>
        <span class="sn-knob"></span>
        <span class="sn-bubble"></span>
      </div>
    </div>
  </div>
</div>
