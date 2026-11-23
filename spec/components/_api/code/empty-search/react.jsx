import { Button, EmptyArt } from "satin-ui/react";

export default function EmptySearch() {
  return (
    <div className="sn-empty-state">
      <EmptyArt name="search" />
      <h4>未找到“雨夜”相关镜头</h4>
      <p>换个关键词，或清除当前筛选。</p>
      <div className="sn-acts">
        <Button variant="secondary">清除筛选</Button>
      </div>
    </div>
  );
}
