<script>
  import Select from "satin-ui/svelte/Select.svelte";

  const statuses = [
    { value: "draft", label: "草稿" },
    { value: "review", label: "待审核" },
    { value: "done", label: "已完成", disabled: true },
  ];
  let status = $state("draft");
</script>

<Select items={statuses} bind:value={status} label="状态" />
