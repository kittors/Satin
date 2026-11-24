import { useState, type FormEvent } from "react";
import { Button, Field, Input } from "satin-ui/react";

export default function NewProject() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return setError("请填写项目名称");
    setName("");
  };
  return (
    <form className="sn-stack sn-gap-12" onSubmit={submit} noValidate>
      {/* error 给了字（空字符串也算）就有错误区：有字时展开、输入框抖两下，清空时收起 */}
      <Field label="项目名称" error={error} htmlFor="new-name">
        <Input id="new-name" placeholder="比如：雨夜车站" value={name} invalid={!!error} onChange={(e) => { setName(e.target.value); setError(""); }} />
      </Field>
      <div><Button variant="primary" type="submit">创建</Button></div>
    </form>
  );
}
