import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import "./input-2.css";

export default function InputDemo2() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="grid-m auto" style="--min:200px;gap:16px">
        <span class="sn-ib sn-has-pre">
          <span class="sn-pre" data-i="mail"></span>
          <input class="sn-input" placeholder="带前缀图标" />
        </span>
        <span class="sn-ib sn-has-post">
          <input class="sn-input sn-num" value="1080" aria-label="高度" />
          <span class="sn-post">
            <span class="sn-unit">px</span>
          </span>
        </span>
        <span class="sn-ib sn-has-post sn-filled" data-clearable="">
          <input class="sn-input" value="输入后右侧出现清除" />
          <span class="sn-post">
            <button class="sn-clear" aria-label="清除" data-i="x"></button>
          </span>
        </span>
      </div>
    </div>
  );
}
