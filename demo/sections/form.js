// 展示页接线：从 kit-form.js 拆出来的 initForms 和演示数据。
import { busy, succeed, bindForms, validateForm, setFieldError, clearFieldError } from "../../packages/satin-ui/src/form.js";
import { showTip, hideTip, tipTarget } from "../../packages/satin-ui/src/core.js";
export function initForms({ $, $$, icon, injectIcons, showTip, hideTip, tipTarget, reduced }) {
  const EASE_IN = "cubic-bezier(.42,0,1,1)", SPRING = "linear(0, .32, .78, 1.04, 1.09, 1.06, 1.02, 1, .99, .99, 1)";

  // 1. 等待 → 成功（实现是下面的 busy / succeed）
  const WORK = { save: 900, quick: 180, del: 1100 };
  for (const b of $$("[data-demo]")) b.addEventListener("click", async () => { await busy(b, WORK[b.dataset.demo]); succeed(b); });
  // 2. 下拉、复制、芯片、清除 / 显示密码 / 自动长高、滑块、验证码……写在标记上的都由 bindForms 接上（见文件后面）
  bindForms(document);

  // 5. 字段（报错的实现是下面的 setFieldError / validateForm）
  const form = $("#fieldDemo"), desc = $("#f-desc"), count = $(".sn-count", form);
  const rules = { name: (v) => !v.trim() && "请填写项目名称", mail: (v) => v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && "邮箱格式不对", desc: (v) => !v.trim() && "写一句话就好，方便以后找到它" };
  desc.addEventListener("input", () => { count.textContent = `${desc.value.length}/80`; count.classList.toggle("sn-over", desc.value.length >= 80); });
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); if (!validateForm(form, rules)) return;
    const b = $("button[type=submit]", form); await busy(b, 900); succeed(b);
  });

  // 6. 输入框的状态
  $("#inputStates").innerHTML = [["默认", "", "", ""], ["悬停", "is-hover", "", ""], ["聚焦", "is-focus", "", ""], ["错误", "", "bad", ""], ["禁用", "is-disabled", "", "disabled"], ["只读", "is-readonly", "", "readonly"]]
    .map(([n, cls, bad, attr]) => `<div class="sn-field ${bad && "sn-" + bad}"><span class="sn-cap">${n}</span><input class="sn-input ${cls && "sn-" + cls}" value="${n === "默认" ? "" : "owner@example.com"}" placeholder="name@example.com" ${attr} tabindex="-1"><div class="sn-err"><span>邮箱格式不对</span></div></div>`).join("");

  return { busy, succeed, setErr: setFieldError, clearErr: clearFieldError };
}
