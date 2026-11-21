<script>
  let name = $state("");
  let error = $state("");
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return (error = "请填写项目名称");
    name = "";
  };
</script>

<form class="sn-stack sn-gap-12" novalidate onsubmit={submit}>
  <!-- 有错时字段加 sn-bad：错误在下面展开，输入框边框变红 -->
  <div class="sn-field" class:sn-bad={error}>
    <label class="sn-lbl" for="new-name">项目名称</label>
    <input class="sn-input" id="new-name" placeholder="比如：雨夜车站" bind:value={name} aria-invalid={error ? "true" : undefined} oninput={() => (error = "")} />
    <div class="sn-err"><span>{error}</span></div>
  </div>
  <div><button type="submit" class="sn-btn sn-primary">创建</button></div>
</form>
