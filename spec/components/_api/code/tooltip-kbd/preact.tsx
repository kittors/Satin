import { Button, Tooltip } from "satin-ui/react";

export default function ExportButton() {
  return (
    <Tooltip text="导出成片" kbd="⌘E">
      <Button variant="primary">导出</Button>
    </Tooltip>
  );
}
