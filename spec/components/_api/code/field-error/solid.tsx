import { createSignal } from "solid-js";

export default function NewProject() {
  const [name, setName] = createSignal("");
  const [error, setError] = createSignal("");
  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!name().trim()) return setError("请填写项目名称");
    setName("");
  };
  return (
    <form class="sn-stack sn-gap-12" novalidate onSubmit={submit}>
      {/* 有错时字段加 sn-bad：错误在下面展开，输入框边框变红 */}
      <div class={["sn-field", { "sn-bad": !!error() }]}>
        <label class="sn-lbl" for="new-name">项目名称</label>
        <input class="sn-input" id="new-name" placeholder="比如：雨夜车站" value={name()} onInput={(e) => { setName(e.currentTarget.value); setError(""); }} aria-invalid={error() ? "true" : undefined} />
        <div class="sn-err"><span>{error()}</span></div>
      </div>
      <div><button type="submit" class="sn-btn sn-primary">创建</button></div>
    </form>
  );
}
