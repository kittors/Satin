import { Field, Input } from "satin-ui/react";

export default function NameField() {
  return (
    <Field label="项目名称" help="会显示在项目列表和导出的文件名里" htmlFor="project-name">
      <Input id="project-name" placeholder="比如：雨夜车站" />
    </Field>
  );
}
