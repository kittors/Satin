import { useEffect, useRef } from "preact/hooks";
import { setup, enhance } from "satin-ui";
import { defineElements } from "satin-ui/elements";

defineElements();

export default function TableDemo1() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup();
    const off = enhance(ref.current);
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div class="sn-tbl-wrap sn-striped">
        <div class="sn-tbl-sc">
          <table class="sn-tbl" aria-label="项目列表">
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
              <tr>
                <td>
                  <b>雨夜车站</b>
                </td>
                <td>
                  <span class="sn-name"><sn-avatar seed="u3" name="林夏" size="20" decorative=""></sn-avatar>林夏</span>
                </td>
                <td>
                  <span class="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td class="sn-r sn-num">48</td>
                <td class="sn-r sn-num">12:36</td>
              </tr>
              <tr>
                <td>
                  <b>海边的第七天</b>
                </td>
                <td>
                  <span class="sn-name"><sn-avatar seed="u4" name="周屿" size="20" decorative=""></sn-avatar>周屿</span>
                </td>
                <td>
                  <span class="sn-tag sn-run"><i></i>生成中</span>
                </td>
                <td class="sn-r sn-num">32</td>
                <td class="sn-r sn-num">8:32</td>
              </tr>
              <tr>
                <td>
                  <b>城南旧事（第二版）</b>
                </td>
                <td>
                  <span class="sn-name"><sn-avatar seed="u8" name="陈默" size="20" decorative=""></sn-avatar>陈默</span>
                </td>
                <td>
                  <span class="sn-tag "><i></i>草稿</span>
                </td>
                <td class="sn-r sn-num">12</td>
                <td class="sn-r sn-num">3:00</td>
              </tr>
              <tr>
                <td>
                  <b>长夜</b>
                </td>
                <td>
                  <span class="sn-name"><sn-avatar seed="u11" name="许诺" size="20" decorative=""></sn-avatar>许诺</span>
                </td>
                <td>
                  <span class="sn-tag sn-bad"><i></i>失败</span>
                </td>
                <td class="sn-r sn-num">20</td>
                <td class="sn-r sn-num">5:00</td>
              </tr>
              <tr>
                <td>
                  <b>山那边的学校</b>
                </td>
                <td>
                  <span class="sn-name"><sn-avatar seed="u5" name="李然" size="20" decorative=""></sn-avatar>李然</span>
                </td>
                <td>
                  <span class="sn-tag sn-warn"><i></i>待审核</span>
                </td>
                <td class="sn-r sn-num">64</td>
                <td class="sn-r sn-num">17:02</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
