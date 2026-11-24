<script lang="ts">
  import Avatar from "satin-ui/svelte/Avatar.svelte";
</script>

<div class="sn-row">
  <Avatar seed="u4" name="周屿" size={24} />
  <Avatar seed="u8" name="陈默" />
  <Avatar seed="u5" name="李然" size={40} online />
  <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默 3 人">
    <Avatar seed="u3" name="林夏" size={24} decorative />
    <Avatar seed="u4" name="周屿" size={24} decorative />
    <Avatar seed="u8" name="陈默" size={24} decorative />
  </div>
</div>
