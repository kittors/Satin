<script lang="ts">
  import Stepper from "satin-ui/svelte/Stepper.svelte";
</script>

<Stepper value={10} min={5} max={100} unit="张" label="每批张数" />
