import { Icon } from "satin-ui/react";

export default function LinkArrow() {
  return (
    <div class="sn-row">
      <a class="sn-textbtn" href="/projects">查看全部项目<Icon name="arrow-right" class="sn-after" /></a>
      <a class="sn-textbtn sn-danger-text" href="/billing">去处理<Icon name="arrow-right" class="sn-after" /></a>
    </div>
  );
}
