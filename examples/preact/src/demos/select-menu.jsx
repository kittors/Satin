import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function SelectMenu() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-select">
        <button type="button" class="sn-btn sn-secondary" data-menubtn="" data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
        <div class="sn-menu" role="menu">
          <div class="sn-item sn-sel" data-i="check:chk">最近更新</div>
          <div class="sn-item" data-i="check:chk">名称</div>
          <div class="sn-item" data-i="check:chk">创建时间</div>
        </div>
      </div>
    </div>
  );
}
