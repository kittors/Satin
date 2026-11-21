import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function ButtonSizes() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-row">
        <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
        <button type="button" class="sn-btn sn-primary">保存修改</button>
        <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
      </div>
    </div>
  );
}
