import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { createStepper } from "satin-ui/components";
import "./number-0.css";

export default function NumberDemo0() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup();
    const off = enhance(ref.current, (root) => {
      // <div class="sn-stepper" data-stepper data-min="1" data-max="60" data-value="4">…</div>
      // 按住连发（400ms 起、越来越快，最快 50ms 一次）；在数字上左右拖每 8px 一格；方向键一格、Shift 十格
      const dur = createStepper(root.querySelector("[data-stepper]"), {
        onChange: (v) => console.log("时长", v),
      });
      dur.set(10);
      dur.value; // 10

      // 不写标记也行：给一个空容器，按选项渲染
      createStepper(root.querySelector("#dur"), { value: 4, min: 1, max: 60, unit: "秒", label: "镜头时长" });
    });
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="row" style="gap:28px">
        <div class="sn-field">
          <span class="sn-lbl">镜头时长</span>
          <div class="sn-stepper" data-stepper="" data-min="1" data-max="60" data-value="4">
            <button class="sn-st-btn" data-d="-1" aria-label="减少" data-i="minus"></button>
            <span class="sn-st-val" tabindex="0" role="spinbutton" aria-label="镜头时长">
              <span class="sn-roll">
                <span>4</span>
              </span>
            </span>
            <span class="sn-st-unit">秒</span>
            <button class="sn-st-btn" data-d="1" aria-label="增加" data-i="plus"></button>
          </div>
        </div>
        <div class="sn-field">
          <span class="sn-lbl">生成数量</span>
          <div class="sn-stepper" data-stepper="" data-min="1" data-max="4" data-value="2">
            <button class="sn-st-btn" data-d="-1" aria-label="减少" data-i="minus"></button>
            <span class="sn-st-val" tabindex="0" role="spinbutton" aria-label="生成数量">
              <span class="sn-roll">
                <span>2</span>
              </span>
            </span>
            <span class="sn-st-unit">张</span>
            <button class="sn-st-btn" data-d="1" aria-label="增加" data-i="plus"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
