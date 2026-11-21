import { Button, Popconfirm, toast } from "satin-ui/react";

export default function SubmitReview() {
  // 不是删除、但同样不能撤销：danger 关掉，确认按钮用主按钮
  return (
    <Popconfirm title="提交审核？" description="提交以后这一集就不能再改了。" confirmText="提交" danger={false} onConfirm={() => toast({ text: "已提交审核" })}>
      <Button variant="primary">提交审核</Button>
    </Popconfirm>
  );
}
