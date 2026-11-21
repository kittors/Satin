import { Button, Icon } from "satin-ui/react";

export default function NoResults() {
  return (
    <div class="sn-empty-state">
      <span class="sn-art"><Icon name="search" /></span>
      <h4>没有找到"雨夜"相关的镜头</h4>
      <p>换个关键词，或者清除筛选再看看。</p>
      <div class="sn-acts">
        <Button variant="secondary">清除筛选</Button>
      </div>
    </div>
  );
}
