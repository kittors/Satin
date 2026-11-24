const ITEMS = JSON.stringify(["全部", "进行中", "已完成"]);

export default function StatusBar() {
  return (
    <div class="sn-row">
      <sn-segmented items={ITEMS} value="全部" size="sm" label="状态"></sn-segmented>
      <button type="button" class="sn-btn sn-secondary sn-sm">导出</button>
    </div>
  );
}
