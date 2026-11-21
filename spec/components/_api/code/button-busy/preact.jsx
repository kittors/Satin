import { useState } from "preact/hooks";
import { Button } from "satin-ui/react";

// 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
const request = () => new Promise((done) => setTimeout(done, 1200));

export default function SaveButton() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  async function save() {
    setSaving(true);
    try {
      await request();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500); // 对勾留 1.5 秒
    } finally {
      setSaving(false);
    }
  }
  // loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾
  return <Button variant="primary" loading={saving} done={saved} onClick={save}>保存修改</Button>;
}
