import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Avatar } from "satin-ui/react";
import { createScrollArea } from "satin-ui/components";
import "satin-ui/css/data.css";
import "satin-ui/css/scroll.css";

export default function TableDemo5() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root) => {
      // .sn-tbl-sc 限高（--sn-tbl-max）以后在框里滚；表头 position: sticky 吸在顶上
      // 不加边缘渐隐（fade: "none"），免得表头被淡掉；表格不回弹：滚到头就停住，再滚一次交给页面
      createScrollArea(root.querySelector(".sn-tbl-sc"), { fade: "none" });
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <div className="sn-tbl-wrap" style={{ "--sn-tbl-max": "248px" }}>
        <div className="sn-tbl-sc">
          <table className="sn-tbl" aria-label="项目列表">
            <thead>
              <tr>
                <th>项目</th>
                <th>负责人</th>
                <th>状态</th>
                <th className="sn-r">镜头</th>
                <th className="sn-r">时长</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>雨夜车站</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u3" name="林夏" size={20} decorative />林夏</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">48</td>
                <td className="sn-r sn-num">12:36</td>
              </tr>
              <tr>
                <td>
                  <b>海边的第七天</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u4" name="周屿" size={20} decorative />周屿</span>
                </td>
                <td>
                  <span className="sn-tag sn-run"><i></i>生成中</span>
                </td>
                <td className="sn-r sn-num">32</td>
                <td className="sn-r sn-num">8:32</td>
              </tr>
              <tr>
                <td>
                  <b>城南旧事（第二版）</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u8" name="陈默" size={20} decorative />陈默</span>
                </td>
                <td>
                  <span className="sn-tag "><i></i>草稿</span>
                </td>
                <td className="sn-r sn-num">12</td>
                <td className="sn-r sn-num">3:00</td>
              </tr>
              <tr>
                <td>
                  <b>长夜</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u11" name="许诺" size={20} decorative />许诺</span>
                </td>
                <td>
                  <span className="sn-tag sn-bad"><i></i>失败</span>
                </td>
                <td className="sn-r sn-num">20</td>
                <td className="sn-r sn-num">5:00</td>
              </tr>
              <tr>
                <td>
                  <b>山那边的学校</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u5" name="李然" size={20} decorative />李然</span>
                </td>
                <td>
                  <span className="sn-tag sn-warn"><i></i>待审核</span>
                </td>
                <td className="sn-r sn-num">64</td>
                <td className="sn-r sn-num">17:02</td>
              </tr>
              <tr>
                <td>
                  <b>最后一班地铁</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u3" name="林夏" size={20} decorative />林夏</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">28</td>
                <td className="sn-r sn-num">7:00</td>
              </tr>
              <tr>
                <td>
                  <b>雾港</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u4" name="周屿" size={20} decorative />周屿</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">40</td>
                <td className="sn-r sn-num">10:15</td>
              </tr>
              <tr>
                <td>
                  <b>春天的信</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u8" name="陈默" size={20} decorative />陈默</span>
                </td>
                <td>
                  <span className="sn-tag "><i></i>草稿</span>
                </td>
                <td className="sn-r sn-num">6</td>
                <td className="sn-r sn-num">1:30</td>
              </tr>
              <tr>
                <td>
                  <b>旧城区</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u11" name="许诺" size={20} decorative />许诺</span>
                </td>
                <td>
                  <span className="sn-tag sn-run"><i></i>生成中</span>
                </td>
                <td className="sn-r sn-num">36</td>
                <td className="sn-r sn-num">9:12</td>
              </tr>
              <tr>
                <td>
                  <b>天台</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u5" name="李然" size={20} decorative />李然</span>
                </td>
                <td>
                  <span className="sn-tag sn-ok"><i></i>已完成</span>
                </td>
                <td className="sn-r sn-num">22</td>
                <td className="sn-r sn-num">4:48</td>
              </tr>
              <tr>
                <td>
                  <b>便利店</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u3" name="林夏" size={20} decorative />林夏</span>
                </td>
                <td>
                  <span className="sn-tag "><i></i>草稿</span>
                </td>
                <td className="sn-r sn-num">9</td>
                <td className="sn-r sn-num">2:05</td>
              </tr>
              <tr>
                <td>
                  <b>地铁口</b>
                </td>
                <td>
                  <span className="sn-name"><Avatar seed="u4" name="周屿" size={20} decorative />周屿</span>
                </td>
                <td>
                  <span className="sn-tag sn-warn"><i></i>待审核</span>
                </td>
                <td className="sn-r sn-num">30</td>
                <td className="sn-r sn-num">6:40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
