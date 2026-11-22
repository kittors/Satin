<script>
  import Avatar from "satin-ui/svelte/Avatar.svelte";

  const sizes = [16, 20, 24, 32, 40, 64];
</script>

<div class="sn-row">
  {#each sizes as size (size)}
    <Avatar name="张伟" {size} />
  {/each}
</div>
