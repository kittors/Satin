import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function ButtonBasic() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-secondary">取消</button>
        <button type="button" class="sn-btn sn-primary">保存修改</button>
      </div>
    </div>
  );
}
