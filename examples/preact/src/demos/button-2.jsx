import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import "./button-2.css";

export default function ButtonDemo2() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="row">
        <button class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
        <button class="sn-btn sn-secondary" data-i="upload:before">导入原文</button>
        <button class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
        <div class="sn-select sn-inline-menu">
          <button class="sn-btn sn-secondary" data-menubtn="" data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
          <div class="sn-menu" role="menu">
            <div class="sn-item sn-sel" data-i="check:chk">最近更新</div>
            <div class="sn-item">名称</div>
            <div class="sn-item">创建时间</div>
          </div>
        </div>
      </div>
    </div>
  );
}
