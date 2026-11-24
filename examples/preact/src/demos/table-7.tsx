import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";

export default function TableDemo7() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-tbl-wrap">
        <div class="sn-tbl-sc">
          <table class="sn-tbl" aria-label="正在加载" aria-busy="true">
            <thead>
              <tr>
                <th>项目</th>
                <th>负责人</th>
                <th>状态</th>
                <th class="sn-r">镜头</th>
                <th class="sn-r">时长</th>
              </tr>
            </thead>
            <tbody>
              <tr class="sn-tbl-sk">
                <td>
                  <i class="sn-sk" style="width:60%"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:48px"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:56px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:24px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:36px"></i>
                </td>
              </tr>
              <tr class="sn-tbl-sk">
                <td>
                  <i class="sn-sk" style="width:60%"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:48px"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:56px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:24px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:36px"></i>
                </td>
              </tr>
              <tr class="sn-tbl-sk">
                <td>
                  <i class="sn-sk" style="width:60%"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:48px"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:56px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:24px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:36px"></i>
                </td>
              </tr>
              <tr class="sn-tbl-sk">
                <td>
                  <i class="sn-sk" style="width:60%"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:48px"></i>
                </td>
                <td>
                  <i class="sn-sk" style="width:56px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:24px"></i>
                </td>
                <td class="sn-r">
                  <i class="sn-sk" style="width:36px"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
