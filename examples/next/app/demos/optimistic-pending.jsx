"use client";
import { useState } from "react";
import { toast } from "satin-ui";
import { Button } from "satin-ui/react";

// 演示用的付款：1.2 秒后成功；换成真实的请求
const pay = () => new Promise((done) => setTimeout(done, 1200));

export default function PayButton() {
  const [paying, setPaying] = useState(false), [paid, setPaid] = useState(false);
  async function onPay() {
    // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
    setPaying(true);
    try {
      await pay();
      setPaid(true);
      setTimeout(() => setPaid(false), 1500); // 对勾留 1.5 秒
      toast({ text: "已支付 ¥68" });
    } finally {
      setPaying(false);
    }
  }
  // loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾
  return <Button variant="primary" loading={paying} done={paid} onClick={onPay}>支付 ¥68</Button>;
}
