<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  defineElements();

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <sn-select items="[&#123;&quot;value&quot;:&quot;draft&quot;,&quot;label&quot;:&quot;草稿&quot;&#125;,&#123;&quot;value&quot;:&quot;review&quot;,&quot;label&quot;:&quot;待审核&quot;&#125;,&#123;&quot;value&quot;:&quot;done&quot;,&quot;label&quot;:&quot;已完成&quot;,&quot;disabled&quot;:true&#125;]" value="draft" label="状态"></sn-select>
</div>
