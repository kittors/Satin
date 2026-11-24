import { Checkbox, Switch } from "satin-ui/react";

export default function SaveOptions() {
  return (
    <div class="sn-stack sn-gap-8">
      <Checkbox label="自动保存草稿" defaultChecked />
      <Switch label="生成完成后提醒我" />
    </div>
  );
}
