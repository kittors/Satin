import { useState } from "react";
import { Email } from "satin-ui/react";

export default function NotifyEmail() {
  // 受控：value + onChange；格式对了右边的对勾一笔画出来
  const [mail, setMail] = useState("");
  return <Email label="通知邮箱" placeholder="name@example.com" id="notify-email" value={mail} onChange={setMail} />;
}
