import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { Segmented, Stepper } from "satin-ui/react";

export default function MobileOrder() {
  const ref = useRef(null);
  useEffect(() => {
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <main className="sn-page sn-narrow sn-screen">
        <header className="sn-page-hd">
          <a className="sn-nav-back" href="/cart" data-i="chevron-left:before">购物车</a>
          <div>
            <h1>确认订单</h1>
          </div>
        </header>
        <div className="sn-stack sn-gap-12">
          <section className="sn-panel sn-flush">
            <div className="sn-set-list" style={{ border: "0", borderRadius: "0" }}>
              <div className="sn-set-row" tabIndex="0">
                <span className="sn-ico" data-i="map-pin"></span>
                <div className="sn-tx">
                  <b>林夏 138 0000 1234</b>
                  <span>上海市徐汇区漕溪北路 88&nbsp;号 12&nbsp;楼</span>
                </div>
                <span className="sn-end" data-i="chevron-right"></span>
              </div>
            </div>
          </section>
          <section className="sn-panel">
            <div className="sn-row sn-gap-12">
              <img src="https://images.unsplash.com/photo-1534105615256-13940a56ff44?auto=format&fit=crop&w=160&h=160&q=80" alt="" width="64" height="64" style={{ borderRadius: "var(--sn-r-md)", objectFit: "cover" }} />
              <div className="sn-grow">
                <b>折叠台灯</b>
                <div className="sn-t-caption sn-c-tertiary">三档亮度 · USB-C 充电</div>
              </div>
              <b className="sn-num">¥189.00</b>
            </div>
            <div className="sn-form" style={{ maxWidth: "none", marginTop: "var(--sn-sp-20)" }}>
              <div className="sn-field">
                <span className="sn-lbl">颜色</span>
                <Segmented items={["暖白","冷白","木纹"]} defaultValue="暖白" />
              </div>
              <div className="sn-row sn-between">
                <span className="sn-lbl">数量</span>
                <Stepper defaultValue={1} min={1} max={9} unit="件" />
              </div>
            </div>
          </section>
          <section className="sn-panel sn-flush">
            <div className="sn-set-list" style={{ border: "0", borderRadius: "0" }}>
              <div className="sn-set-row" tabIndex="0">
                <span className="sn-ico" data-i="clock"></span>
                <div className="sn-tx">
                  <b>配送时间</b>
                </div>
                <span className="sn-val">明天 9:00–12:00</span>
                <span className="sn-end" data-i="chevron-right"></span>
              </div>
              <div className="sn-set-row" tabIndex="0">
                <span className="sn-ico" data-i="tag"></span>
                <div className="sn-tx">
                  <b>优惠券</b>
                </div>
                <span className="sn-val">满 150 减 20</span>
                <span className="sn-end" data-i="chevron-right"></span>
              </div>
            </div>
          </section>
          <section className="sn-panel">
            <div className="sn-field">
              <label className="sn-lbl" htmlFor="o-note">备注 <span className="sn-opt">可选</span></label>
              <textarea className="sn-input" id="o-note" rows="2" placeholder="比如：放门口，不用打电话" />
            </div>
          </section>
          <section className="sn-panel sn-flush">
            <div className="sn-set-list" role="radiogroup" aria-label="支付方式" style={{ border: "0", borderRadius: "0" }}>
              <label className="sn-set-row">
                <span className="sn-ico" data-i="credit-card"></span>
                <div className="sn-tx">
                  <b>微信支付</b>
                </div>
                <span className="sn-radio">
                  <input type="radio" name="pay" defaultChecked />
                  <span className="sn-box"></span>
                </span>
              </label>
              <label className="sn-set-row">
                <span className="sn-ico" data-i="credit-card"></span>
                <div className="sn-tx">
                  <b>支付宝</b>
                </div>
                <span className="sn-radio">
                  <input type="radio" name="pay" />
                  <span className="sn-box"></span>
                </span>
              </label>
            </div>
          </section>
          <section className="sn-panel">
            <div className="sn-stack sn-gap-8">
              <div className="sn-row sn-between">
                <span className="sn-c-secondary">商品</span>
                <span className="sn-num">¥189.00</span>
              </div>
              <div className="sn-row sn-between">
                <span className="sn-c-secondary">运费</span>
                <span className="sn-num">¥0.00</span>
              </div>
              <div className="sn-row sn-between">
                <span className="sn-c-secondary">优惠</span>
                <span className="sn-num sn-c-success">−¥20.00</span>
              </div>
            </div>
          </section>
        </div>
        <div className="sn-bottom-bar">
          <div className="sn-grow">
            <span className="sn-t-caption sn-c-tertiary">合计</span>
            {" "}
            <b className="sn-t-title2 sn-num">¥169.00</b>
          </div>
          <button className="sn-btn sn-primary sn-lg">提交订单</button>
        </div>
      </main>
    </div>
  );
}
