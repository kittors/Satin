import { Button } from "satin-ui/react";

export default function CheckoutBar() {
  return (
    <div className="sn-bottom-bar">
      <span className="sn-grow sn-num">合计 ¥ 1,280</span>
      <Button variant="primary" size="lg">提交订单</Button>
    </div>
  );
}
