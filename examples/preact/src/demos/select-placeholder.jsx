import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

export default function SelectPlaceholder() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <sn-select items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' placeholder="选择画面比例" label="画面比例"></sn-select>
    </div>
  );
}
