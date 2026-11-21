import { Button, Icon } from "satin-ui/react";

const SORTS = ["最近更新", "名称", "创建时间"];

// 菜单按钮：标记照设计稿写，<sn-enhance> 接上交互（选了就收起，按钮文字换成 前缀 + 选中项）
export default function SortMenu() {
  return (
    <sn-enhance>
      <div class="sn-select">
        <Button data-menubtn="" data-prefix="排序：">排序：最近更新<Icon name="chevron-down" class="sn-caret" /></Button>
        <div class="sn-menu" role="menu">
          {SORTS.map((s, i) => (
            <div key={s} class={i === 0 ? "sn-item sn-sel" : "sn-item"}>{s}<span class="sn-chk"><Icon name="check" /></span></div>
          ))}
        </div>
      </div>
    </sn-enhance>
  );
}
