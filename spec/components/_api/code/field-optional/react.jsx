import { Field, Input } from "satin-ui/react";

export default function MailField() {
  return (
    // 只标"可选"，不标必填：大多数字段都要填，少数能不填的才标出来
    <Field label={<>通知邮箱 <span className="sn-opt">可选</span></>} help="生成完成后发一封邮件" htmlFor="notify-mail">
      <Input id="notify-mail" type="email" placeholder="name@example.com" />
    </Field>
  );
}
