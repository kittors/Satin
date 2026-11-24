"use client";
import { TagInput } from "satin-ui/react";

export default function SearchTags() {
  return <TagInput max={3} placeholder="例如：雨夜" hint="按标签找素材，最多 3 个" />;
}
