export default function EmptyBasic() {
  return (
    <sn-enhance>
      <div class="sn-empty-state">
        <span class="sn-art" data-i="folder-open"></span>
        <h4>还没有项目</h4>
        <p>从一部小说或剧本开始，几分钟就能看到第一版分镜。</p>
        <div class="sn-acts">
          <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
          <button type="button" class="sn-btn sn-secondary">导入原文</button>
        </div>
      </div>
    </sn-enhance>
  );
}
