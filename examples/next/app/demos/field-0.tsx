"use client";
import { useEffect, useRef } from "react";
import { setup, enhance } from "satin-ui";
import { validateForm, busy, succeed } from "satin-ui/components";
import "./field-0.css";

export default function FieldDemo0() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const unsetup = setup(); // 页面级行为（Tooltip、浮层栈、Esc 关闭），引用计数
    const off = enhance(ref.current, (root: any) => {
      // 每个要校验的字段写 data-f="名字"，下面放 <div class="sn-err"><span></span></div>
      const form = root.querySelector("#fieldDemo"), desc = root.querySelector("#f-desc"), count = form.querySelector(".sn-count");
      const rules = {
        name: (v?: any) => !v.trim() && "请填写项目名称",
        mail: (v?: any) => v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && "邮箱格式不对",
        desc: (v?: any) => !v.trim() && "写一句话就好，方便以后找到",
      };
      // 字数：到上限变色
      desc.addEventListener("input", () => { count.textContent = `${desc.value.length}/80`; count.classList.toggle("sn-over", desc.value.length >= 80); });
      form.addEventListener("submit", async (e?: any) => {
        e.preventDefault();
        if (!validateForm(form, rules)) return; // 有错的都标出来（错误在下方展开、输入框抖两下），焦点到第一个
        const btn = form.querySelector("button[type=submit]");
        await busy(btn, 900); // 换成你的提交请求（Promise）
        succeed(btn);
      });
      // 也能单独标：比如服务器说名字重复了 → setFieldError(form.querySelector('[data-f="name"]'), "已经有叫这个名字的项目了")
      // 一开始输入就自动收起（setup() 装好的页面级行为）
    }); // 接上标记里的交互，返回撤销函数
    return () => { off(); unsetup(); };
  }, []);
  return (
    <div ref={ref}>
      <form className="form-demo" id="fieldDemo" noValidate>
        <div className="sn-field" data-f="name">
          <label className="sn-lbl" htmlFor="f-name">项目名称</label>
          <input className="sn-input sn-lg" id="f-name" placeholder="比如：雨夜车站" />
          <div className="sn-err">
            <span></span>
          </div>
        </div>
        <div className="sn-field" data-f="mail">
          <label className="sn-lbl" htmlFor="f-mail">通知邮箱 <span className="sn-opt">可选</span></label>
          <input className="sn-input sn-lg" id="f-mail" placeholder="name@example.com" />
          <div className="sn-help">生成完成后发邮件提醒。</div>
          <div className="sn-err">
            <span></span>
          </div>
        </div>
        <div className="sn-field" data-f="desc">
          <label className="sn-lbl" htmlFor="f-desc">一句话简介</label>
          <textarea className="sn-input" id="f-desc" maxLength={80} placeholder="写给自己看的备忘" />
          <div className="sn-help">
            <span>最多 80 个字。</span>
            <span className="sn-count">0/80</span>
          </div>
          <div className="sn-err">
            <span></span>
          </div>
        </div>
        <div className="row">
          <button className="sn-btn sn-primary" type="submit">
            <span className="sn-sheen"></span>
            <span className="sn-label">
              <span className="sn-spin"></span>
              <svg className="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 8.5l3 3 6-7"></path>
              </svg>
              <span className="sn-txt">创建项目</span>
            </span>
          </button>
          <span className="sn-note">什么都不填直接点，看错误怎么出现；再随便输入，看它怎么收起。</span>
        </div>
      </form>
    </div>
  );
}
