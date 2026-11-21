import { useState } from "react";
import { TagInput } from "satin-ui/react";

export default function KeywordTags() {
  const [tags, setTags] = useState(["悬疑", "长镜头"]);
  return (
    <div className="sn-stack sn-gap-8">
      <TagInput max={5} placeholder="输入关键词，回车确认" tags={tags} onChange={setTags} />
      <span className="sn-help">已添加 {tags.length} / 5 个</span>
    </div>
  );
}
