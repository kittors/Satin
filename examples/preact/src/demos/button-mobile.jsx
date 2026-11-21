import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function ButtonMobile() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-bottom-bar">
        <span class="sn-grow sn-num">合计 ¥ 1,280</span>
        <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
      </div>
    </div>
  );
}
