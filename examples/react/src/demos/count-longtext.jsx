import { LongText, toast } from "satin-ui/react";

export default function ShotDescription() {
  // 随内容长高，到 maxLines 后在里面滚；右下角用量环，快满时显示"还剩几字"，超出时整个框变红；⌘↵ 调 onSubmit
  return (
    <LongText
      max={120}
      maxLines={7}
      placeholder="写清楚人物、动作和光线，生成会更准。可以一直往下写，框会跟着长高。"
      label="画面描述"
      onSubmit={() => toast({ text: "已保存画面描述" })}
    />
  );
}
