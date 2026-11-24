import { Chip } from "satin-ui/react";

export default function ChipBasic() {
  return (
    <div class="sn-row">
      <Chip selected>进行中</Chip>
      <Chip>已完成</Chip>
      <Chip>失败</Chip>
    </div>
  );
}
