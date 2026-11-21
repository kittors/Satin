"use client";
import { useState } from "react";
import { Chip } from "satin-ui/react";

export default function SceneTags() {
  const [tags, setTags] = useState(["雨夜", "车站", "列车"]);
  return (
    <div className="sn-row">
      {tags.map((t) => (
        // onRemove 在收起动画放完以后调，这时再从列表里删
        <Chip key={t} selected removable removeLabel={`移除 ${t}`} onRemove={() => setTags((x) => x.filter((y) => y !== t))}>{t}</Chip>
      ))}
    </div>
  );
}
