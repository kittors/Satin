import { Password } from "satin-ui/react";

export default function NewPassword() {
  // meter：强度条从左往右依次点亮；大写锁定打开时下面展开一行提示；右边的眼睛切换显示
  return <Password label="设置密码" placeholder="至少 8 位，字母加数字更安全" meter id="new-pw" />;
}
