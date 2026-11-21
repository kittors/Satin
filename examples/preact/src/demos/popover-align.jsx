import { Button, Popover } from "satin-ui/react";

export default function InfoPopover() {
  // align="end"：面板和按钮右边对齐（按钮靠右时用，面板不会伸出窗口）
  return (
    <Popover align="end" title="画面比例说明" content={<p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>}>
      <Button variant="ghost" icon="info" tip="画面比例说明" />
    </Popover>
  );
}
