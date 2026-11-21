"use client";
export default function LoadingQuiet() {
  return (
    <div className="sn-row">
      <span className="sn-spinner" role="status" aria-label="正在加载更多"></span><span className="sn-help">正在加载更多…</span>
    </div>
  );
}
