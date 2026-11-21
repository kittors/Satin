import { onSettled, onCleanup } from "solid-js";
import { setup, enhance } from "satin-ui";
import { createOtp, toast } from "satin-ui/components";

export default function OtpDemo0() {
  let root, off = () => {};
  onSettled(() => {
    const unsetup = setup();
    const done = enhance(root, (root) => {
      // 自动跳格、退格回上一格、粘贴自动分配；填进去的数字从下面淡入
      const otp = createOtp(root.querySelector("[data-otp]"), {
        onComplete: (code) => { // 6 位都填满时调：换成你的校验请求
          toast({ text: `已提交验证码 ${code}` });
          setTimeout(() => otp.clear(), 1200); // 清空、焦点回第一格
        },
      });
    });
    off = () => { done(); unsetup(); };
  });
  onCleanup(() => off());
  return (
    <div ref={(el) => (root = el)}>
      <div class="sn-otp" data-otp="">
        <input inputmode="numeric" maxlength="1" aria-label="第 1 位" />
        <input inputmode="numeric" maxlength="1" aria-label="第 2 位" />
        <input inputmode="numeric" maxlength="1" aria-label="第 3 位" />
        <span class="sn-gap"></span>
        <input inputmode="numeric" maxlength="1" aria-label="第 4 位" />
        <input inputmode="numeric" maxlength="1" aria-label="第 5 位" />
        <input inputmode="numeric" maxlength="1" aria-label="第 6 位" />
      </div>
    </div>
  );
}
