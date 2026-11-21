import { Button, Popover, Switch } from "satin-ui/react";

export default function SharePopover() {
  return (
    <Popover
      title="分享给协作者"
      content={
        <>
          <p>拿到链接的人可以查看，不能修改。</p>
          <div className="sn-pop-row"><Switch label="允许下载原片" defaultChecked /></div>
        </>
      }
    >
      <Button icon="share">分享</Button>
    </Popover>
  );
}
