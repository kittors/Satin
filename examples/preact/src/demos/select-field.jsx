import { Select } from "satin-ui/react";

const RATIOS = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];

export default function RatioField() {
  return (
    <div class="sn-field">
      <span class="sn-lbl">画面比例</span>
      <Select items={RATIOS} defaultValue="16:9 · 横屏" label="画面比例" />
      <div class="sn-help">导出成片时用这个比例。</div>
    </div>
  );
}
