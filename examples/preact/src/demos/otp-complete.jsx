import { useState } from "react";
import { Otp } from "satin-ui/react";

export default function VerifyOnComplete() {
  const [note, setNote] = useState("输入 6 位验证码");
  return (
    <div class="sn-stack sn-gap-8">
      {/* 填满就拿整串数字去校验（换成真实的请求） */}
      <Otp length={6} onComplete={(code) => setNote(`正在校验 ${code}…`)} />
      <span class="sn-help">{note}</span>
    </div>
  );
}
