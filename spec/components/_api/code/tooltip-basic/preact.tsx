import { Button, Tooltip } from "satin-ui/react";

export default function DraftButton() {
  return (
    <Tooltip text="保存到草稿箱，可以随时接着改">
      <Button>存草稿</Button>
    </Tooltip>
  );
}
