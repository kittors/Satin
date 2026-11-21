import { Button } from "satin-ui/react";

export default function FormActions() {
  return (
    <div class="sn-row sn-between">
      <Button variant="ghost">不保存</Button>
      <div class="sn-row sn-gap-8">
        <Button>取消</Button>
        <Button variant="primary">保存</Button>
      </div>
    </div>
  );
}
