import { useState } from "react";
import { Pager } from "satin-ui/react";

export default function ShotPager() {
  const [page, setPage] = useState(1);
  return (
    <div class="sn-stack sn-gap-8">
      <Pager total={13} count={128} page={page} onChange={setPage} />
      <span class="sn-help">第 {page} 页</span>
    </div>
  );
}
