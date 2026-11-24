import { createSignal } from "solid-js";

// 名字带横线的事件用 ref 挂（Solid 的 onXxx 只认驼峰的事件名）
const on = (type: string, fn: (e: CustomEvent<any>) => void) => (el: HTMLElement) => el.addEventListener(type, fn as EventListener);

export default function VerifyOnComplete() {
  const [note, setNote] = createSignal("输入 6 位验证码");
  return (
    <div class="sn-stack sn-gap-8">
      {/* 填满就拿整串数字去校验（换成真实的请求） */}
      <sn-otp length="6" ref={on("sn-complete", (e) => setNote(`正在校验 ${e.detail}…`))}></sn-otp>
      <span class="sn-help">{note()}</span>
    </div>
  );
}
