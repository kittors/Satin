import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function ButtonVariants() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-primary">新建项目</button>
        <button type="button" class="sn-btn sn-secondary">导入原文</button>
        <button type="button" class="sn-btn sn-tertiary">预览</button>
        <button type="button" class="sn-btn sn-ghost">跳过</button>
        <button type="button" class="sn-btn sn-danger">删除项目</button>
        <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
      </div>
    </div>
  );
}
