// 文字链接与文字按钮的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "文字链接与文字按钮",
  lead: "句子里的链接是一条淡下划线、悬停变实；独立的纯文字操作是文字按钮，悬停出底色、按下缩一下。",
  whenToUse: [
    "句子里提到的另一个页面、一份文档：用链接（`<a href>`）。",
    "卡片角落、列表末尾的次要操作（\"查看全部\"\"编辑\"\"取消\"）：用文字按钮，不抢主按钮的风头。",
    "要去别的页面的独立入口（\"查看全部项目 →\"）：写成 `<a class=\"sn-textbtn\">`，带个往右的箭头。",
  ],
  whenNotToUse: [
    { text: "一个区域里最重要的动作：用主按钮。", use: "button" },
    { text: "只放得下一个图标：用纯图标按钮，名称放在 Tooltip 里。", use: "iconbutton" },
  ],
  related: [
    { id: "button", diff: "按钮有面、更醒目，用在主要动作；文字按钮只有文字，用在次要动作。" },
    { id: "iconbutton", diff: "没有文字、只有图标的按钮。" },
  ],
  import: {
    html: '// 只有样式：链接写 <a class="sn-link">，文字按钮写 class="sn-textbtn"；箭头图标写 data-i，外面包 <sn-enhance>',
    react: 'import { Icon } from "satin-ui/react"; // 只有箭头图标要引；链接、文字按钮写 className',
    vue: 'import { Icon } from "satin-ui/vue"; // 只有箭头图标要引；链接、文字按钮写 class',
    svelte: 'import Icon from "satin-ui/svelte/Icon.svelte"; // 只有箭头图标要引',
    angular: '// 只有样式：<a class="sn-link">、class="sn-textbtn"；箭头写 data-i，外面包 <sn-enhance>（组件加 CUSTOM_ELEMENTS_SCHEMA）',
    solid: '// 只有样式：<a class="sn-link">、class="sn-textbtn"；箭头写 data-i，外面包 <sn-enhance>',
    preact: 'import { Icon } from "satin-ui/react"; // 只有箭头图标要引（经 preact/compat）',
  },
  importNote: {
    react: "纯样式，没有组件：链接写 `<a className=\"sn-link\">`，文字按钮写 `<button className=\"sn-textbtn\">`（去别的页面用 `<a>`），箭头用 `<Icon name=\"arrow-right\" className=\"sn-after\">`。",
    preact: "纯样式：`<a class=\"sn-link\">`、`<button class=\"sn-textbtn\">`，箭头用 `satin-ui/react` 的 `<Icon>`。",
    vue: "纯样式，没有组件：`<a class=\"sn-link\">`、`<button class=\"sn-textbtn\">`，箭头用 `<Icon name=\"arrow-right\" class=\"sn-after\">`。",
    svelte: "纯样式：`<a class=\"sn-link\">`、`<button class=\"sn-textbtn\">`，箭头用 `<Icon name=\"arrow-right\" class=\"sn-after\">`。",
    angular: "纯样式：`<a class=\"sn-link\">`、`<button class=\"sn-textbtn\">`，箭头写 `<span data-i=\"arrow-right:after\">`，外面包 `<sn-enhance>`。",
    solid: "纯样式：`<a class=\"sn-link\">`、`<button class=\"sn-textbtn\">`，箭头写 `<span data-i=\"arrow-right:after\">`，外面包 `<sn-enhance>`。",
    html: "纯样式：`<a class=\"sn-link\">`、`<button class=\"sn-textbtn\">`，箭头写 `<span data-i=\"arrow-right:after\">`，外面包 `<sn-enhance>`（换成图标）。",
  },
  dts: {},
  props: [],
  events: [
    { name: "click", payload: "MouseEvent", when: "点文字按钮；链接是浏览器自己跳转。", native: true,
      names: { react: "onClick", vue: "@click", angular: "(click)", svelte: "onclick", solid: "onClick", preact: "onClick", html: 'addEventListener("click")' } },
  ],
  slots: [],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-label", desc: "链接、文字按钮的文字颜色（跟正文一样，不用蓝色）", default: "正文色", token: true },
  ],
  classes: [
    { name: ".sn-link", desc: "句子里的链接：淡下划线，悬停变实" },
    { name: ".sn-textbtn", desc: "文字按钮：悬停出底色，按下缩一下" },
    { name: ".sn-textbtn.sn-quiet", desc: "更弱的文字按钮（\"取消\"\"忘记密码？\"）：二级文字色" },
    { name: ".sn-textbtn.sn-danger-text", desc: "危险的文字按钮：红色文字" },
    { name: 'data-i="arrow-right:after"', desc: "文字后面的箭头：悬停时往右挪 2px" },
  ],
  types: [],
  keyboard: [
    { keys: "Tab", does: "聚焦链接或文字按钮。" },
    { keys: "Enter", does: "打开链接 / 按下文字按钮（文字按钮按空格也行）。" },
  ],
  a11y: {
    roles: ["去别的地方用 `<a href>`（角色是 link）；在这里做一件事用 `<button>`。不要用 `<span>` 加点击事件。"],
    focus: ["键盘聚焦时 2px 焦点环（:focus-visible）。"],
    notes: ["链接文字要说清去哪：\"用户协议\"，不写\"点这里\"。", "新窗口打开的链接加 `rel=\"noopener\"`，并在文字里说明。"],
  },
  design: {
    do: ["链接和正文同色，靠下划线区分。", "文字按钮放在主按钮旁边当次要操作，或者放在卡片、列表的角落。", "去别的页面的文字按钮带一个往右的箭头。"],
    dont: [
      { text: "链接用蓝色、加粗来\"突出\"。", rule: "link-style" },
      { text: "一行里堆好几个颜色不同的文字按钮：颜色只表达状态（危险）。", rule: "status-color" },
    ],
    copy: ["链接写名词（要去的地方）：\"用户协议\"\"隐私说明\"。", "文字按钮写动作：\"编辑\"\"查看全部项目\"。"],
    motion: [{ what: "悬停时后置箭头右移 2px", easing: "ease.out", duration: "150ms" }, { what: "按下态微幅缩放反馈", easing: "ease.out", duration: "100ms" }],
  },
  examples: [
    { slug: "link-basic", title: "句子里的链接", why: "和正文同色、一条淡下划线，悬停变实；链接文字说清去哪。",
      html: `<p class="sn-t-body">登录即表示你同意<a class="sn-link" href="/terms">用户协议</a>和<a class="sn-link" href="/privacy">隐私说明</a>。第一次用验证码登录会自动创建账号。</p>`,
      code: code("link-basic") },
    { slug: "link-textbtn", title: "文字按钮", why: "次要操作用文字按钮：默认、更弱的 quiet、危险的 danger-text。",
      html: `<div class="sn-row"><button type="button" class="sn-textbtn">编辑</button><button type="button" class="sn-textbtn sn-quiet">取消</button><button type="button" class="sn-textbtn sn-quiet">忘记密码？</button><button type="button" class="sn-textbtn sn-danger-text">删除草稿</button></div>`,
      code: code("link-textbtn") },
    { slug: "link-arrow", title: "带箭头的入口", why: "去别的页面的独立入口写成 `<a class=\"sn-textbtn\">`，箭头在文字后面，悬停时往右挪。",
      html: `<sn-enhance><div class="sn-row"><a class="sn-textbtn" href="/projects">查看全部项目<span data-i="arrow-right:after"></span></a><a class="sn-textbtn sn-danger-text" href="/billing">去处理<span data-i="arrow-right:after"></span></a></div></sn-enhance>`,
      code: code("link-arrow") },
  ],
};
