import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function ButtonActions() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-row sn-between">
        <button type="button" class="sn-btn sn-ghost">不保存</button>
        <div class="sn-row sn-gap-8">
          <button type="button" class="sn-btn sn-secondary">取消</button>
          <button type="button" class="sn-btn sn-primary">保存</button>
        </div>
      </div>
    </div>
  );
}
