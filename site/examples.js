// 文档里每个演示的代码：手写的"真实用法"，按 组件 id → 第几个演示 组织。
// · files：整套替换（Markdown 这种：原文 + 调用 + 容器）
// · html / js：替换这个演示的标记 / 补一段 JS；before / after：在前后补别的文件（CSS、数据……）
// 没写的演示，文档页直接给这个演示的标记（纯样式的组件，标记就是用法）。

const MD_SRC = `# 分镜生成说明

把**一集剧本**拆成镜头，每个镜头写清楚景别、时长和画面。
相关接口见 [接口文档](https://example.com/api)。

> [!NOTE]
> 时长按 24 帧算：第 $n$ 帧的时间是 $t = \\frac{n}{24}$ 秒。

## 镜头清单

| 镜头 | 景别 | 时长 | 状态 |
| :-- | :-: | --: | :-- |
| 07 · 车站外，雨刚停 | 远景 | 4 秒 | 已完成 |
| 08 · 林夏走进候车厅 | 全景 | 6 秒 | 生成中 |

## 生成前检查

- [x] 角色设定图已经上传
- [x] 每个镜头都有景别和时长
- [ ] 背景音乐的节拍对齐到镜头切换

\`\`\`js
const shots = await generateShots(list, { retry: 3 });
console.log(timeline(shots, 24));
\`\`\`

![雨夜的车站](https://images.unsplash.com/photo-1541702467897-41915a07d3a7?w=1200&h=675)

<details><summary>能写 HTML</summary>按 <kbd>⌘</kbd> <kbd>K</kbd> 打开命令面板。</details>`;


const SA_PANE = (attrs, note) => `<!-- ${note} -->
<div class="list" ${attrs}>
  <div class="row">镜头 01 · 车站外，雨刚停</div>
  <div class="row">镜头 02 · 林夏走进候车厅</div>
  <!-- …… -->
</div>`;
export const EXAMPLES = {
  md: {
    0: {
      files: [
        { name: "Markdown", lang: "md", code: MD_SRC },
        { name: "JS", lang: "js", code: `import { renderMarkdown } from "/satin/kit-md.js";

const source = await (await fetch("/docs/storyboard.md")).text();

// 渲染进容器：标题、列表、任务、表格、代码（高亮、行号、复制、折叠）、图片、视频、音频、HTML 都认
const doc = renderMarkdown(document.querySelector("#doc"), source, {
  codeMax: 240,  // 代码块超过 240px 折叠，0 = 不折叠
  imgH: 220,     // 图片统一高度，"auto" = 原比例
  tableMax: 0,   // 表格最高，超出在框里滚，0 = 不限
});

// 内容变了（比如 AI 流式回复）：整篇重渲染，滚动位置不跳
doc.update(source + "\\n\\n## 新的一节");
// 改选项：只改样式，不重渲染
doc.set({ codeMax: 0 });` },
        { name: "HTML", lang: "html", code: `<link rel="stylesheet" href="/satin/kit.css">
<link rel="stylesheet" href="/satin/md.css">

<!-- 容器：渲染后加上 .md，排版、颜色跟着主题走 -->
<article id="doc"></article>` },
      ],
    },
  },
  scrollarea: {
    0: {
      html: `<link rel="stylesheet" href="/satin/scroll.css">

<div class="list" style="max-height: 240px">…</div>
<div class="strip">…</div>
<div class="board" style="max-height: 240px">…</div>`,
      js: `import { scrollArea } from "/satin/kit-scroll.js";

// 竖向：上下渐隐（默认），系统滚动条换成悬浮的细滚动条
scrollArea(document.querySelector(".list"));

// 横向长条：左右渐隐 40px；竖着滚滚轮也横向滚，滚到头放行给页面
scrollArea(document.querySelector(".strip"), { fade: "x", size: 40, wheel: "x" });

// 两个方向都能滚：四边渐隐
scrollArea(document.querySelector(".board"), { fade: "both" });`,
    },
    1: {
      html: SA_PANE('data-sa="y" data-sa-size="24"', "也可以直接写在标记上：data-sa 是渐隐方向，data-sa-size 是渐隐宽度"),
      js: `import { scrollArea } from "/satin/kit-scroll.js";

// size：渐隐带有多宽（px）。只在那个方向还有内容时出现，滚多少长多宽，滚到头消失
scrollArea(list, { size: 0 });   // 不渐隐
scrollArea(list, { size: 16 });  // 菜单、小列表
scrollArea(list, { size: 24 });  // 默认
scrollArea(list, { size: 40 });  // 横向长条、大面板

// 只要一边：fade 写成要的那几条边
scrollArea(list, { fade: "bottom" });`,
    },
    2: {
      html: SA_PANE('data-sa="y" data-sa-bar="hover"', "data-sa-bar：滚动条怎么出现"),
      js: `import { scrollArea } from "/satin/kit-scroll.js";

scrollArea(list, { bar: "auto" });    // 默认：滚动或悬停时出现，停下 0.7 秒淡出
scrollArea(list, { bar: "hover" });   // 只在指针停在区域上时出现
scrollArea(list, { bar: "always" });  // 一直显示，悬浮在内容上
scrollArea(list, { bar: "gutter" });  // 一直显示，有自己的一条位置，不压内容（只在真的溢出时占位）
scrollArea(list, { bar: "none" });    // 不显示，只靠渐隐、滚轮和触控板`,
    },
    3: {
      html: SA_PANE('data-sa="y" data-sa-bar="always" data-sa-bar-size="8" data-sa-inset="4"', "data-sa-bar-size、data-sa-inset"),
      js: `import { scrollArea } from "/satin/kit-scroll.js";

// barSize：平时多粗（px，默认 5），悬停、拖动时再粗 3px；barInset：离边多远（px，默认 1）
scrollArea(list, { bar: "always", barSize: 8, barInset: 4 });

// 颜色跟主题走，要改就覆盖 CSS 变量
// :root { --sa-thumb: rgba(0, 0, 0, .26); --sa-thumb-hover: rgba(0, 0, 0, .44); }`,
    },
    4: {
      html: SA_PANE('data-sa="y" data-sa-over="contain"', "data-sa-over：滚到头怎么办"),
      js: `import { scrollArea } from "/satin/kit-scroll.js";

// 默认：一次滚动在区域里开始，滚到头就停住——不回弹，也不带着页面滚；
// 新的一次滚动开始时已经到头，交给外层（页面接着滚）；横向停住
scrollArea(list, { overscroll: "auto" });
scrollArea(menu, { overscroll: "contain" });  // 两个方向都停住：弹层、菜单、抽屉里的列表
scrollArea(list, { overscroll: "bounce" });   // 回弹：再拉会多出一段、越拉越紧，松手弹回（表格别用）
scrollArea(list, { overscroll: "chain" });    // 两个方向都交给外层`,
    },
    5: {
      html: `<div class="tbl-wrap" style="--tbl-max: 236px">
  <div class="tbl-sc">
    <table class="tbl">
      <thead>…</thead>   <!-- position: sticky，吸在顶上 -->
      <tbody>…</tbody>
      <tfoot>…</tfoot>   <!-- 吸在底下 -->
    </table>
  </div>
</div>`,
      js: `import { scrollArea } from "/satin/kit-scroll.js";

// 表格用默认的 overscroll: "auto"，不回弹：浏览器自带的回弹会把吸附的表头、合计行一起拉走，
// 表身和合计行之间露出空隙。一次滚动在表格里开始，滚到头就停住；开始时已经到头，交给页面接着滚
scrollArea(document.querySelector(".tbl-sc"), { fade: "none" }); // 不加边缘渐隐，免得表头、合计行被淡掉`,
    },
    6: {
      html: `<textarea class="input" rows="6">…</textarea>`,
      js: `import { scrollArea } from "/satin/kit-scroll.js";

// 多行输入也能当滚动视口：系统滚动条换成细滚动条，输入时自动重新量长度
scrollArea(document.querySelector("textarea"), { fade: "none" });`,
    },
  },
  select: {
    0: {
      html: `<link rel="stylesheet" href="/satin/form.css">

<!-- 下拉选择：选中后把文字写进 .val，打勾 -->
<div class="select" data-select>
  <button class="trigger"><span class="val">16:9 · 横屏</span><span data-i="chevron-down"></span></button>
  <div class="menu" role="listbox">
    <div class="item sel" data-v="16:9">16:9 · 横屏<span class="chk" data-i="check"></span></div>
    <div class="item" data-v="9:16">9:16 · 竖屏<span class="chk" data-i="check"></span></div>
    <div class="item" data-v="1:1">1:1 · 方形<span class="chk" data-i="check"></span></div>
  </div>
</div>

<!-- 菜单按钮：选了就关；触发器写了 data-prefix，选中后按钮文字变成"排序：……" -->
<div class="select inline-menu">
  <button class="btn secondary" data-menubtn data-prefix="排序：">排序：最近更新</button>
  <div class="menu" role="menu">
    <div class="item sel">最近更新<span class="chk" data-i="check"></span></div>
    <div class="item">名称<span class="chk" data-i="check"></span></div>
  </div>
</div>`,
      js: `import { mountSelect, bindSelects } from "/satin/kit-form.js";
import { injectIcons } from "/satin/kit-core.js";

injectIcons(document); // data-i 换成图标

// 一个一个接：选中时回调
const ratio = mountSelect(document.querySelector("[data-select]"), {
  onChange: (value, item) => console.log("画面比例", value),
});
ratio.set("9:16");   // 不触发回调
ratio.value;         // "9:16"

// 或者把页面上所有 .select 一次接上，用事件拿结果
bindSelects(document);
document.addEventListener("select", (e) => console.log(e.detail.value));`,
    },
  },
  compound: {
    0: {
      html: `<link rel="stylesheet" href="/satin/buttons.css">

<!-- 按钮组：相关的几个操作连成一组 -->
<div class="group">
  <button class="btn secondary ibtn" data-tip="上一个" data-i="chevron-left"></button>
  <button class="btn secondary ibtn" data-tip="下一个" data-i="chevron-right"></button>
</div>

<!-- 分裂按钮：主操作 + 备选（备选是一个菜单按钮） -->
<div class="group split select inline-menu">
  <button class="btn primary">导出成片</button>
  <button class="btn primary more" data-menubtn data-tip="更多导出方式" data-i="chevron-down"></button>
  <div class="menu end" role="menu">
    <div class="item">MP4（1080p）</div>
    <div class="item">MP4（4K）</div>
  </div>
</div>

<!-- 复制按钮：成功后图标原地换成对勾 -->
<button class="btn ghost ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接">
  <span class="swap"><span class="a" data-i="copy"></span><span class="b" data-i="check"></span></span>
</button>`,
      js: `import { bindSelects, copied } from "/satin/kit-form.js";
import { injectIcons } from "/satin/kit-core.js";

injectIcons(document);
bindSelects(document); // 分裂按钮的备选菜单

// 复制按钮：写入剪贴板，成功后图标换成对勾 1.2 秒
for (const b of document.querySelectorAll("[data-copy]")) {
  b.addEventListener("click", async () => {
    await navigator.clipboard.writeText(b.dataset.copy);
    copied(b);
  });
}`,
    },
  },
  popover: {
    0: {
      html: `<link rel="stylesheet" href="/satin/overlay.css">

<button class="btn secondary" data-pop="pop-share">分享</button>

<!-- 面板放在页面任意地方（一般放在 body 末尾），打开时贴着按钮弹出 -->
<div class="pop popover" id="pop-share" role="dialog" aria-label="分享">
  <h4>分享给协作者</h4>
  <p>拿到链接的人可以查看，不能修改。</p>
  <div class="acts"><button class="btn primary sm">复制链接</button></div>
</div>`,
      js: `import { bindOverlays, openPopover, popoverOf } from "/satin/kit-overlay.js";

// 写在标记上：[data-pop="面板 id"] 点了开、再点关；Esc、点外面、焦点离开面板都会关
bindOverlays(document);

// 或者自己控制：贴着按钮打开（align: "end" 右对齐），返回的 close() 关上
const btn = document.querySelector("#share"), pop = document.querySelector("#pop-share");
btn.addEventListener("click", () => {
  const open = popoverOf(pop);
  if (open) open.close();
  else openPopover(pop, btn, { align: "end", onClose: () => console.log("关了") });
});`,
    },
  },
  popconfirm: {
    0: {
      html: `<button class="btn danger-soft sm" id="purge">永久删除</button>

<div class="pop popconfirm" id="pc" role="alertdialog" aria-labelledby="pc-q">
  <div class="q"><span data-i="triangle-alert"></span>
    <div><div id="pc-q">永久删除这个镜头？</div><div class="d">删除后无法恢复。</div></div>
  </div>
  <div class="acts">
    <button class="btn ghost sm" data-no>取消</button>
    <button class="btn danger sm" data-yes>永久删除</button>
  </div>
</div>`,
      js: `import { openPopover } from "/satin/kit-overlay.js";

// 气泡确认就是一个弹出面板：打开时焦点先落在"取消"上（防止回车误删）
const btn = document.querySelector("#purge"), pc = document.querySelector("#pc");
btn.addEventListener("click", () => {
  const confirm = openPopover(pc, btn, { align: "end" });
  pc.querySelector("[data-no]").onclick = () => confirm.close(true);
  pc.querySelector("[data-yes]").onclick = () => { confirm.close(); removeShot(); };
});`,
    },
  },
  ctxmenu: {
    0: {
      html: `<!-- 右键区域：data-ctx 写菜单 id；键盘用 Shift+F10 或菜单键打开 -->
<div class="ctx-zone" data-ctx="m-shot" tabindex="0">在这里点右键</div>

<!-- 菜单按钮：贴着按钮弹 -->
<button class="btn secondary" data-fmenu="m-shot">更多</button>

<div class="menu float" id="m-shot" role="menu">
  <div class="item" data-i="pencil:before">重命名<span class="key">F2</span></div>
  <div class="item" data-sub="m-move">移动到<span data-i="chevron-right:more"></span></div>
  <div class="item is-off">分享给协作者</div>        <!-- 不可用 -->
  <div class="sep"></div>
  <div class="item danger-item" data-i="trash-2:before">移到回收站</div>
</div>
<!-- 子菜单：上一层的条目写 data-sub="子菜单 id" -->
<div class="menu float" id="m-move" role="menu">
  <div class="head">第一季</div>
  <div class="item">第一集</div>
  <div class="item">第二集</div>
</div>`,
      js: `import { bindOverlays, openMenu, closeMenu } from "/satin/kit-overlay.js";

bindOverlays(document);

// 选中：根菜单上冒泡 menuselect，detail 里有条目文字和子菜单路径
document.addEventListener("menuselect", (e) => {
  const { label, path } = e.detail;   // 比如 "第二集"、["移动到"]
  console.log([...path, label].join(" › "));
});

// 自己控制：在指针处弹，只能待在某个容器里（子菜单也不出这个框）
box.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  openMenu(document.querySelector("#m-shot"), {
    trigger: box, x: e.clientX, y: e.clientY, bound: box,
    onSelect: ({ label }) => run(label),
  });
});`,
    },
  },
  dialog: {
    0: {
      html: `<button class="btn primary" data-dlg="dlg-new">新建项目</button>

<dialog class="dlg" id="dlg-new" aria-labelledby="dn-t">
  <form method="dialog" novalidate>
    <div class="hd">
      <div style="flex:1"><h3 id="dn-t">新建项目</h3><div class="sub">名称之后随时可以改。</div></div>
      <button type="button" class="btn ghost sm ibtn" data-x aria-label="关闭" data-i="x"></button>
    </div>
    <div class="bd">
      <div class="field"><label class="lbl" for="dn-name">项目名称</label><input class="input" id="dn-name"></div>
    </div>
    <div class="ft">
      <button type="button" class="btn ghost" data-cancel>取消</button>
      <button type="submit" class="btn primary">创建项目</button>
    </div>
  </form>
</dialog>`,
      js: `import { bindOverlays, openDialog, closeDialog } from "/satin/kit-overlay.js";
import { busy } from "/satin/kit-form.js";

// [data-dlg="弹窗 id"] 打开：从按钮那里长出来，关闭时原路缩回，焦点回到按钮
// 弹窗里的 [data-x]、[data-cancel] 和 Esc 关闭；点背景只"顶一下"，不关
bindOverlays(document);

const dlg = document.querySelector("#dlg-new"), name = dlg.querySelector("#dn-name");

// 关闭前先问一句：挂一个 guard，Esc / 取消 / 点 × 都会先调它
dlg.guard = () => (name.value.trim() ? askDiscard() : closeDialog(dlg));

dlg.querySelector("form").addEventListener("submit", async () => {
  await busy(dlg.querySelector(".ft .primary"), createProject(name.value));
  closeDialog(dlg);
});

// 不用标记也行：openDialog(弹窗, 触发按钮)`,
    },
  },
  drawer: {
    0: {
      html: `<button class="btn ghost sm ibtn" data-drawer="dr-edit" data-i="pencil"></button>

<!-- 遮罩可以不写：没有 .drawer-scrim 会自动建一个 -->
<aside class="drawer" id="dr-edit" role="dialog" aria-modal="true" aria-labelledby="dr-t" tabindex="-1">
  <div class="hd">
    <h3 id="dr-t">编辑镜头</h3>
    <button class="btn ghost sm ibtn" data-x aria-label="关闭" data-i="x"></button>
  </div>
  <div class="bd">
    <div class="field"><label class="lbl" for="dr-title">镜头标题</label><input class="input" id="dr-title"></div>
  </div>
  <div class="ft"><button class="btn ghost" data-x>完成</button></div>
</aside>`,
      js: `import { bindOverlays, openDrawer } from "/satin/kit-overlay.js";

// [data-drawer="抽屉 id"] 打开；抽屉里的 [data-x]、Esc、点外面关闭；焦点圈在抽屉里
bindOverlays(document);

// 自己控制：先把要编辑的内容填进去再打开，关上时收尾
editBtn.addEventListener("click", () => {
  title.value = shot.title;
  openDrawer(document.querySelector("#dr-edit"), {
    trigger: editBtn,       // 关上后焦点回到这里
    focus: title,           // 打开后焦点先落在这里
    onClose: () => save(shot),
  });
});`,
    },
  },
  button: {
    3: {
      html: `<link rel="stylesheet" href="/satin/buttons.css">

<!-- 可等待的按钮：busy() 会把内容包成 .label，转圈和对勾都放在里面 -->
<button class="btn primary" id="save">保存修改</button>`,
      js: `import { busy, succeed } from "/satin/kit-form.js";

const save = document.querySelector("#save");
save.addEventListener("click", async () => {
  // 300ms 内回来不转圈；转圈出现后至少留 500ms；等待期间点不了
  await busy(save, fetch("/api/projects/42", { method: "PUT" }));
  succeed(save); // 原地换成对勾，一会儿换回文字
});`,
    },
  },
  chip: {
    0: {
      html: `<link rel="stylesheet" href="/satin/buttons.css">

<!-- 筛选芯片：可多选，点了切换（aria-pressed 跟着变） -->
<div class="row">
  <button class="chip on" data-toggle><span data-i="check"></span>进行中</button>
  <button class="chip" data-toggle><span data-i="check"></span>已完成</button>
</div>

<!-- 可移除的标签：容器写 data-chips="removable" -->
<div class="row" data-chips="removable">
  <span class="chip tag on">雨夜<button class="x" aria-label="移除 雨夜" data-i="x"></button></span>
  <span class="chip tag on">车站<button class="x" aria-label="移除 车站" data-i="x"></button></span>
</div>`,
      js: `import { bindForms, removeChip } from "/satin/kit-form.js";
import { injectIcons } from "/satin/kit-core.js";

injectIcons(document);
bindForms(document); // 筛选芯片切换；可移除标签：先脱离布局淡出，剩下的用弹簧补位

document.addEventListener("chipremove", (e) => console.log("移除了", e.detail.chip.textContent));
removeChip(someChip); // 自己删一个，同样的动画`,
    },
  },
  field: {
    0: {
      js: `import { validateForm, setFieldError, clearFieldError } from "/satin/kit-form.js";

// 每个要校验的字段写 data-f="名字"，下面放 <div class="err"><span></span></div>
const rules = {
  name: (v) => !v.trim() && "请填写项目名称",
  mail: (v) => v.trim() && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v) && "邮箱格式不对",
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm(form, rules)) return; // 有错的都标出来（错误在下方展开、输入框抖两下），焦点到第一个
  submit();
});

// 也能单独标：服务器说名字重复了
setFieldError(form.querySelector('[data-f="name"]'), "已经有叫这个名字的项目了");
// 一开始输入就自动收起；要手动收起：clearFieldError(字段)`,
    },
  },
  special: {
    0: {
      js: `import { mountPassword, mountEmail, mountSearch } from "/satin/kit-input.js";
import { bindForms } from "/satin/kit-form.js";

bindForms(document); // [data-clearable] 清除按钮、[data-eye] 显示密码

// 密码：四段强度条 + 文字，不到 8 位提示还差几位；大写锁定开着时提示
mountPassword(document.querySelector("input[data-pw]"));

// 邮箱：停手 400ms 再判断，对了画对勾；离开时还不对才报错
mountEmail(document.querySelector("input[data-email]"));

// 搜索：等待超过 300ms 才转圈、转了至少 500ms；search 返回结果数量（或数组）
mountSearch(document.querySelector("[data-search]"), {
  search: async (q) => (await fetch("/api/search?q=" + encodeURIComponent(q)).then((r) => r.json())).length,
});`,
    },
  },
  count: {
    0: {
      js: `import { mountCount, mountLongText, bindInputs } from "/satin/kit-input.js";

// 单行：<input maxlength="20" data-count>，右边的计数跟着滚动，快满变色，写满还在敲时抖一下
mountCount(document.querySelector("input[data-count]"));

// 长文本：<div data-ta data-max="200">…<textarea>…</div>
// 自动长高 + 量环计数；快满"还剩 N 字"，超出"超出 N 字"并整框变红；⌘↵ 提交
mountLongText(document.querySelector("[data-ta]"), { onSubmit: (text) => save(text) });

// 或者按标记一次接上页面上所有的
bindInputs(document);`,
    },
  },
  taginput: {
    0: {
      html: `<link rel="stylesheet" href="/satin/input.css">

<div class="box-in tagin" data-tagin data-max="8">
  <input placeholder="输入标签，回车确认" aria-label="添加标签">
</div>
<div class="tag-foot"><span class="roll"><span>0</span></span> / 8</div>`,
      js: `import { mountTagInput } from "/satin/kit-input.js";

// 回车或逗号加标签；重复的抖一下；超过 data-max 个不让加；
// 退格先"点亮"最后一个、再按才删；粘贴一串自动拆开；中文输入法拼字时不响应
const tags = mountTagInput(document.querySelector("[data-tagin]"), {
  initial: ["雨夜", "车站"],
  onChange: (list) => console.log(list),
});
tags.add("悬疑");
tags.tags;    // ["雨夜", "车站", "悬疑"]`,
    },
  },
  number: {
    0: {
      js: `import { mountStepper } from "/satin/kit-input.js";

// <div class="stepper" data-stepper data-min="1" data-max="60" data-value="4">…</div>
// 按住连发（400ms 起、越来越快，最快 50ms 一次）；在数字上左右拖每 8px 一格；方向键一格、Shift 十格
const dur = mountStepper(document.querySelector("[data-stepper]"), {
  onChange: (v) => console.log("时长", v),
});
dur.set(10);
dur.value; // 10`,
    },
  },
  prompt: {
    0: {
      js: `import { mountComposer } from "/satin/kit-input.js";

// 提示词输入框：自动长高、字数、附件（拖进来、粘贴截图、附件菜单）；有文字或附件、附件传完才能发
const composer = mountComposer(document.querySelector("[data-composer]"), {
  // 发送：返回 Promise，期间发送键变成停止；结束回到可发送
  onSend: ({ text, files }) => generate(text, files),
  onStop: () => abortGeneration(),
  // 真上传：报进度，结束就完成，出错就失败（点一下重试）
  upload: (file, onProgress) => uploadFile(file, onProgress),
});

composer.clear({ smooth: true }); // 清空：附件淡出、输入框平滑收起
composer.files();                 // 现在的附件元素`,
    },
  },
  otp: {
    0: {
      js: `import { mountOtp } from "/satin/kit-form.js";

// 自动跳格、退格回上一格、粘贴自动分配；填进去的数字从下面淡入
const otp = mountOtp(document.querySelector("[data-otp]"), {
  onComplete: (code) => verify(code), // 6 位都填满时调
});
otp.value;   // 现在填了的
otp.clear(); // 清空、焦点回第一格`,
    },
  },
  toast: {
    0: {
      html: `<link rel="stylesheet" href="/satin/feedback.css">
<!-- 不用写标记：第一次调 toast() 时在 body 末尾建一个 .toasts 容器 -->`,
      js: `import { toast, setToastPos } from "/satin/kit-feedback.js";

// 状态：对勾 + 一句话，3 秒后自己收起
toast({ text: "链接已复制" });

// 操作：倒计时环 + 按钮，5 秒；点"撤销"原地变成结果
toast({
  kind: "action", text: '已归档"雨夜车站"',
  action: { label: "撤销", run: (t) => { restore(); t.update({ kind: "status", text: "已恢复", done: true }); } },
});

// 进度：进度环 + 百分比，直到 update 成结果
const t = toast({ kind: "progress", text: "正在导出 第三集.mp4" });
t.update({ progress: 0.42 });
t.update({ kind: "status", text: '已导出到"下载"', done: true });

// 失败：红色图标，读屏立即播报
toast({ icon: "circle-x", tone: "danger", text: "复制失败，请再试一次", alert: true });

setToastPos("bottom"); // 后台放顶部居中（默认），客户端放底部居中`,
    },
  },
  notify: {
    0: {
      js: `import { notify } from "/satin/kit-feedback.js";

// 卡片在右上角叠起来：后面的底边露出 12px、最多 3 层；指针移上去展开成列表；可以一键全部清除
const n = notify({
  icon: "circle-check", tone: "ok",          // tone："ok" | "bad" | "warn" | ""
  title: "第三集生成完成",
  body: "12 个镜头都生成好了，可以开始剪辑。",
  actions: [{ label: "查看", variant: "secondary", run: (card) => { open(); card.close(); } }],
});
n.close();

// 每来一条都会在 document 上发 notify 事件，铃铛这类地方可以跟着记未读
document.addEventListener("notify", (e) => bell.add(e.detail));`,
    },
  },
  banner: {
    0: {
      js: `import { bindBanners, closeBanner } from "/satin/kit-feedback.js";
import { busy } from "/satin/kit-form.js";

// 横幅里的 [data-dismiss] 点了收起（高度过渡，下面的内容跟着上来）
bindBanners(document);

// 问题解决了：原地变成成功，过一会儿自己收起
retry.addEventListener("click", async () => {
  await busy(retry, reconnect());
  const banner = retry.closest(".banner");
  banner.classList.replace("bad", "ok");
  setTimeout(() => closeBanner(banner.parentElement), 1600);
});`,
    },
  },
  loading: {
    0: {
      js: `import { loadWithSkeleton } from "/satin/kit-feedback.js";

// 300ms 内回来就不显示骨架（不闪）；显示了就至少留 500ms；数据到了逐行替换，每行淡入
const { shown, waited } = await loadWithSkeleton(document.querySelector(".sk-list"), {
  load: () => fetch("/api/shots").then((r) => r.json()),
  skeleton: '<div class="sk-row"><span class="sk" style="width:64px;height:40px"></span>…</div>'.repeat(4),
  render: (shots) => shots.map((s) => \`<div class="sk-row"><b>\${s.title}</b></div>\`).join(""),
});`,
    },
  },
  progress: {
    0: {
      js: `import { mountProgress } from "/satin/kit-feedback.js";

const card = mountProgress(document.querySelector(".pcard"), {
  onCancel: (c) => { job.cancel(); c.cancel("已取消导出", "已导出的部分不会保留。"); },
  onOpen: () => showInFolder(),
});

card.start("正在导出 第三集.mp4");
job.on("progress", (p, done, total) => card.set(p, \`已完成 \${done} / \${total} 个镜头\`));
job.on("end", () => card.finish("导出完成", '第三集.mp4 · 1.2 GB · 已保存到"下载"'));`,
    },
  },
  collapse: {
    0: {
      js: `import { mountCollapse, bindCollapses } from "/satin/kit-data.js";

// 点条目标题展开 / 收起（高度过渡）；single：同时只开一项
const faq = mountCollapse(document.querySelector(".acc"), {
  single: true,
  onToggle: (item, open) => console.log(open ? "展开" : "收起"),
});
faq.open(0);

// 或者把页面上所有 .acc 一次接上
bindCollapses(document);`,
    },
  },
  card: {
    0: {
      js: `import { openMenu, bindOverlays } from "/satin/kit-overlay.js";

// 卡片本身是标记：封面、标题、元信息；左上角的勾选框多选，右上角"更多"弹菜单
cards.addEventListener("change", (e) => e.target.closest(".pc")?.classList.toggle("sel", e.target.checked));
cards.addEventListener("click", (e) => {
  const more = e.target.closest("[data-card-more]");
  if (more) openMenu(document.querySelector("#m-card"), { trigger: more, anchor: more, align: "end" });
});`,
    },
  },
  image: {
    0: {
      js: `import { openLightbox } from "/satin/kit-lightbox.js";

// 缩略图：加载中显示骨架，加载好模糊淡入（.loaded），失败显示重试（.failed）
// 每一项：src（图片地址）+ size（原图宽高：适应窗口时不放大超过原图）；视频写 type: "video"
const items = shots.map((s) => ({ src: s.url, size: [s.w, s.h], alt: s.title }));

grid.addEventListener("click", (e) => {
  const im = e.target.closest(".im.loaded"); if (!im) return;
  // 从缩略图那里放大到铺满窗口，关上时缩回去；能放大缩小、拖动、旋转、还原，← → 翻页、Esc 关闭
  openLightbox(items, +im.dataset.n, {
    thumbOf: (i) => grid.querySelector(\`.im[data-n="\${i}"]\`),
    enabled: (i) => grid.querySelector(\`.im[data-n="\${i}"]\`).classList.contains("loaded"),
  });
});`,
    },
  },
  media: {
    0: {
      js: `import { playerHTML, mountPlayer, audioHTML, mountAudio } from "/satin/kit-media.js";

// 视频：缓冲转圈、拖动进度、音量、画中画、全屏、键盘；不动时控件自己藏起来
box.innerHTML = playerHTML({ src: "/media/ep3.mp4", poster: "/media/ep3.jpg", label: "第三集预览" });
const player = mountPlayer(box.querySelector(".player"), { onError: () => toast({ text: "视频没能加载" }) });
player.play();

// 音频：波形从音频本身算出来（拿不到就画平线，不编造）；同一时间只放一个
list.insertAdjacentHTML("beforeend", audioHTML({ src: "/media/bgm.mp3", title: "配乐 · 雨夜", sub: "2:14" }));
mountAudio(list.lastElementChild);`,
    },
  },
  upload: {
    0: {
      js: `import { mountUpload } from "/satin/kit-nav.js";

// 点了选文件、拖进来；每个文件一行：进度、失败可重试、取消 / 移除
const upl = mountUpload(document.querySelector(".drop"), {
  list: document.querySelector(".files"),
  accept: /\\.(txt|docx|epub)$/i, badType: "格式不支持，只能上传 txt、docx、epub",
  maxSize: 50 * 1024 * 1024, tooBig: "超过 50 MB",
  upload: (file, onProgress) => uploadWithProgress("/api/upload", file, onProgress),
});
upl.add(filesFromSomewhere);`,
    },
  },
  sidebar: {
    0: {
      js: `import { mountSidebar } from "/satin/kit-nav.js";

// 选中的底色 / 指示条在条目之间滑动（.app 上 data-navfx="slide | bar | fade | text"）；
// [data-collapse] 收起 / 展开（⌘\\\\ 也行），主区宽度连续变，.app-grid 里的卡片按新列数从原位置滑过去
const side = mountSidebar(document.querySelector(".app"), {
  onNavigate: (a) => router.go(a.getAttribute("href")),
});
side.toggle();`,
    },
  },
  tabs: {
    0: {
      js: `import { mountTabs, mountPager, setStep } from "/satin/kit-nav.js";

// 标签页：下划线前缘先走、后缘跟上；新内容从所选标签那一侧滑进来；← → 切换
mountTabs(document.querySelector(".tabs"), { onChange: (i) => load(i) });

// 分页：当前页的底色滑到新页码；页码多时中间用省略
const pager = mountPager(document.querySelector(".pager"), { total: 13, onChange: (p) => fetchPage(p) });
pager.go(5);

// 步骤：第 i 步是当前，前面的都完成
setStep(document.querySelector(".steps"), 2);`,
    },
  },
  reorder: {
    0: {
      html: `<div class="drag-list">
  <div class="drag-row"><button class="grip" aria-label="拖动排序：镜头 07" data-i="grip-vertical"></button><b>镜头 07 · 车站外</b></div>
  <div class="drag-row"><button class="grip" aria-label="拖动排序：镜头 08" data-i="grip-vertical"></button><b>镜头 08 · 候车厅</b></div>
</div>`,
      js: `import { mountReorder } from "/satin/kit-nav.js";

// 按住 .grip 拖（先动 4px 才算拿起）；其他行让位、落点画线；拿出列表 40px 外松手就取消；
// 键盘：空格拿起、↑↓ 移动、空格放下、Esc 取消（读屏会播报位置）
mountReorder(document.querySelector(".drag-list"), {
  onReorder: (from, to, row) => save(order()),
});`,
    },
  },
  addremove: {
    0: {
      js: `import { insertWithFlip, removeWithFlip } from "/satin/kit-nav.js";
import { toast } from "/satin/kit-feedback.js";

// 新增：从下面淡入，别的元素让位
insertWithFlip(box, chipEl("回忆"));

// 删除：先脱离布局淡出，剩下的用弹簧补位；给撤销
await removeWithFlip(chip);
toast({ kind: "action", text: '已移除"雨夜"', action: { label: "撤销", run: () => insertWithFlip(box, chip, box.children[index]) } });`,
    },
  },
  optimistic: {
    0: {
      js: `import { optimistic } from "/satin/kit-nav.js";

// 先显示结果再保存；失败时恢复、整行抖两下、出一条带"重试"的提示
star.addEventListener("click", () => {
  const on = !star.classList.contains("on");
  optimistic({
    apply: () => star.classList.toggle("on", on),
    revert: () => star.classList.toggle("on", !on),
    save: () => fetch("/api/star", { method: on ? "POST" : "DELETE" }).then((r) => { if (!r.ok) throw r; }),
    shake: row,
  });
});`,
    },
  },
  numflow: {
    0: {
      js: `import { numberFlow } from "/satin/kit-number.js";

// 只滚动变了的那几位；style："roll"（滚动）| "blur"（滚动带模糊）| "push"（推入）| "fade"（淡入）
const views = numberFlow(document.querySelector("#views"), {
  value: 12840,
  style: "roll",
  format: (v) => Number(v).toLocaleString("zh-CN"),
});
views.set(12841);
views.get();          // 12841
views.setStyle("fade");`,
    },
  },
  chat: {
    0: {
      js: `import { mountChat } from "/satin/kit-chat.js";
import { bindInputs } from "/satin/kit-input.js";

const box = document.querySelector(".chat");
bindInputs(box); // 底部的输入框（data-composer data-external：发送交给对话组件）

// 接模型：异步生成器，一段一段地给——{ think } 是思考，字符串是正文
mountChat(box, {
  history: false, // 从空的对话开始
  respond: async function* (question, state) {
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ question }) });
    for await (const ev of readEvents(res.body)) {
      if (state.stopped) break;              // 用户点了停止
      if (ev.type === "reasoning") yield { think: ev.text };
      if (ev.type === "text") yield ev.text;   // 先进缓冲、匀速放出来
    }
  },
});`,
    },
  },
  vlist: {
    0: {
      js: `import { mountInfiniteList } from "/satin/kit-list.js";

// 行高固定：只画看得见的几十行，一万条照样流畅；滚到离底部 400px 自动要下一页
const list = mountInfiniteList(document.querySelector(".vl"), {
  rowHeight: 56,
  total: 10000,
  pageSize: 60,
  loadPage: (offset, size) => fetch(\`/api/shots?offset=\${offset}&limit=\${size}\`).then((r) => r.json()),
  renderRow: (el, shot) => {
    // 行元素会复用：子元素缓存在 el._d 上
    el._d ??= (el.innerHTML = '<span class="th"></span><span class="tx"><b></b><span></span></span>', { th: el.firstChild, b: el.querySelector("b"), m: el.querySelector(".tx span") });
    el._d.th.style.setProperty("--g", \`url(\${shot.thumb}) center / cover\`);
    el._d.b.textContent = shot.title; el._d.m.textContent = shot.meta;
  },
  onCount: (n, total) => (counter.textContent = \`已加载 \${n} 条\`),
});
list.reload();`,
    },
  },
  flow: {
    0: {
      js: `import { mountFlow } from "/satin/kit-flow.js";

mountFlow(document.querySelector(".flow"), {
  // 节点：位置、标题、图标、说明、类型（类型决定线和端口的色相：text | board | image | audio | video | out）
  nodes: [
    { id: "src",   x: 0,   y: 0, t: "导入原文", ic: "book-open",    d: "雨夜车站.docx", k: "text" },
    { id: "board", x: 270, y: 0, t: "生成分镜", ic: "clapperboard", d: "48 个镜头",     k: "board" },
    { id: "out",   x: 540, y: 0, t: "导出",     ic: "download",     d: "第三集.mp4",    k: "out" },
  ],
  edges: [["src", "board"], ["board", "out"]],
});`,
    },
  },
  grid: {
    0: {
      js: `import { mountDataGrid } from "/satin/kit-grid.js";

// 虚拟滚动、按需取块（筛选排序在后台线程）、固定列、拖列、改列宽行高、框选合并单元格、树形、编辑、拖行
mountDataGrid(document.querySelector(".grid"), { rows: 100000 });
// 列和数据现在来自 table-data.js / table-worker.js（演示用的项目表）；
// 接自己的数据：实现 table-source.js 里 createSource 的接口（按块给数据、筛选、排序、树形）`,
    },
  },
  cgrid: {
    0: {
      js: `import { mountCanvasGrid } from "/satin/kit-grid-canvas.js";

// 整张表画在一块画布上：百万行照样流畅；交互和 DOM 版一致
mountCanvasGrid(document.querySelector(".grid.cgrid"), { rows: 1000000 });`,
    },
  },
  picker: {
    0: {
      js: `import { bindPickers } from "/satin/kit-picker.js";

// 写了 data-pk 的都接上：date（日期）| range（范围，两个月并排、快捷预设）| time（时、分两列）
//                       | datetime（定时发布：日历 + 时间）| region（省 / 市 / 区，可跨级搜索）
bindPickers(document);

document.addEventListener("pick", (e) => {
  console.log(e.target.dataset.pk, e.detail.text); // 比如 "date"、"11 月 21 日 星期六"
});`,
    },
  },
  table: {
    8: {
      js: `// 表格的交互（排序、勾选批量、多级展开、合并、拖动行列、改列宽行高、改名）现在由 kit-data.js 的展示页初始化接上，
// 公开接口还在整理；静态的几种（基础、斑马纹、网格线、紧凑、无外框、固定表头、空状态、加载中）只要标记和样式`,
    },
    // 固定表头、限高滚动：表头吸附，内容在框里滚，滚动条换成组件库的
    5: {
      js: `import { scrollArea } from "/satin/kit-scroll.js";

// .tbl-sc 限高（--tbl-max）以后在框里滚；表头 position: sticky 吸在顶上
// 不加边缘渐隐（fade: "none"），免得表头被淡掉；表格不回弹：滚到头就停住，再滚一次交给页面
scrollArea(document.querySelector(".tbl-sc"), { fade: "none" });`,
    },
  },
};

// 参数：组件页"参数"一节（选项、返回值、CSS 变量……），每张表 [标题, 表头, 行]
export const API = {
  md: [
    ["renderMarkdown(容器, 文本, 选项)", ["选项", "说明"], [
      ["codeMax", "代码块超过多高折叠（px），0 = 不折叠；单个代码块写 maxh=120"],
      ["imgH", '块级图片统一高度（px），"auto" = 原比例；单张写 =x160、=320x、=16:9'],
      ["tableMax", "表格最高（px），超出在框里滚，0 = 不限"],
      ["返回", "{ el, update(文本)（整篇重渲染，滚动位置不跳）, set(选项)（只改样式）, options }"],
    ]],
    ["表现", ["内容", "说明"], [
      ["图片", "加载中微光占位，失败给图标和说明；块级图片点开用看图组件——图从原位置长到铺满窗口，整篇文档里加载好的图左右翻，能放大缩小、旋转、还原"],
      ["表格", "表头吸顶；限高后在框里滚，滚到头就停住、不回弹，再滚一次交给页面"],
      ["视频、音频", "图片写法里地址是视频 / 音频，就渲染成播放器 / 音频条"],
    ]],
  ],
  chat: [
    ["mountChat(.chat, 选项)", ["选项", "说明"], [
      ["respond", "(问题, { stopped }) => 异步生成器 / Promise<字符串>：yield { think } 是思考，yield 字符串是正文"],
      ["history", "true：带演示历史（往上滚加载更早的）；false：从空的对话开始"],
      ["返回 send(text)", "程序里发一条（和输入框发送一样）"],
    ]],
    ["消息里的图片、视频", ["写法", "说明"], [
      ['{ type: "image", g: CSS 背景 }', "图片气泡；点开用看图组件（kit-lightbox.js），能放大缩小、旋转，列表里渲染着的图片、视频按顺序左右翻"],
      ['{ type: "video", g: 封面, src, poster }', "视频气泡；点开在看图层里直接播放"],
      ["生成的画面", "AI 回复里生成好的画面点开同样用看图组件"],
    ]],
    ["表现", ["行为", "说明"], [
      ["超多消息", "只渲染视口上下各一屏多；行高先估、渲染后量出来缓存；上方条目高度变了补偿滚动，看着的内容不跳"],
      ["发送", "输入框里的字原地变成气泡，飞进它在列表里的位置；原来的消息同时让位上移"],
      ["回复", "等用户的消息落地再开始；思考结束自动收起成“已思考 N 秒”；正文匀速流出；随时可以停止"],
    ]],
  ],
  vlist: [
    ["mountInfiniteList(容器, 选项)", ["选项", "说明"], [
      ["loadPage", "(offset, size) => Promise<数组>：要一页；失败（reject）末尾出“重试”"],
      ["renderRow", "(行元素, 数据, 下标)：画一行；行元素复用，子元素缓存在 el._d 上（换成骨架行时会清掉）"],
      ["rowHeight / total / pageSize", "行高（固定）/ 总数 / 每页几条"],
      ["onCount", "(已加载, 总数) => {}"],
      ["返回", "{ reload(), scrollTop(), count }"],
    ]],
  ],
  flow: [
    ["mountFlow(.flow, 选项)", ["选项", "说明"], [
      ["nodes", "[{ id, x, y, t（标题）, ic（图标）, d（说明）, k（类型）}]"],
      ["edges", "[[从, 到]]"],
      ["返回", "{ nodes, edges }"],
    ]],
    ["标记", ["写法", "说明"], [[".flow > .flow-world > svg.flow-edges + .flow-nodes", "画布：节点用 HTML、连线用 SVG，同一层平移缩放"], ["[data-fz]、[data-flow-run]、.flow-mini", "缩放按钮、运行、小地图（可选）"]]],
  ],
  grid: [
    ["mountDataGrid(.grid, 选项)", ["选项", "说明"], [["rows", "行数（演示数据，默认 10 万）"], ["seed", "生成演示数据的种子"]]],
    ["现在的限制", ["项目", "说明"], [["列和数据", "来自 table-data.js / table-worker.js（演示用的项目表）"], ["接自己的数据", "实现 table-source.js 里 createSource 的接口：按块给数据、筛选、排序、树形"]]],
  ],
  cgrid: [
    ["mountCanvasGrid(.grid.cgrid, 选项)", ["选项", "说明"], [["rows", "行数（演示数据，默认 100 万）"], ["seed", "生成演示数据的种子"]]],
  ],
  picker: [
    ["bindPickers(root, 选项)", ["选项 / 事件", "说明"], [
      ["today / now", "今天、现在（默认真实时间；设计稿里固定成 2026-11-19 15:42）"],
      ["pick 事件", "值变了在宿主上冒泡，detail: { text }"],
    ]],
    ["标记", ["写法", "说明"], [
      ['data-pk="date"', "日期：换月时网格往所去方向滑；点标题切月份视图；键盘按天 / 周 / 月走"],
      ['data-pk="range"', "日期范围：两个月并排、左边快捷预设；窄屏换成上下叠"],
      ['data-pk="time"', "时间：时、分两列，滚动吸附到中间的选中带"],
      ['data-pk="datetime"', "定时发布：日历 + 时间；早于现在的不能确定"],
      ['data-pk="region"', "地址：省 → 市 → 区三级，可跨级搜索"],
    ]],
  ],

  toast: [
    ["toast(选项)", ["选项", "取值", "说明"], [
      ["kind", '"status" | "action" | "progress"', "状态（3 秒）/ 操作（倒计时环 + 按钮，5 秒）/ 进度（直到 update 成结果）"],
      ["text", "文字", "文件名会自动包起来，不被拆开"],
      ["icon / tone", 'lucide 图标名 / "ok" | "info" | "danger"', "状态类默认对勾"],
      ["action", "{ label, run(t) }", "按钮"],
      ["progress", "0 ~ 1", "进度"],
      ["duration", "毫秒", "多久收起（悬停、聚焦时暂停计时）"],
      ["alert", "true", "读屏立即播报（失败用）"],
      ["done", "true", "update 成结果时扫一道光"],
    ]],
    ["返回值和其他", ["名称", "说明"], [["update(选项)", "原地变形：图标换、文字模糊换、宽度跟着走"], ["close()", "收起"], ["setToastPos(\"top\" | \"bottom\")", "位置（记在本机）"], ["同时最多", "3 条，新的在最前"]]],
  ],
  notify: [
    ["notify(选项)", ["选项", "说明"], [
      ["icon / tone", 'lucide 图标名 / "ok" | "bad" | "warn" | ""'],
      ["title / body / time", "标题、正文（文件名不拆开）、时间（默认现在）"],
      ["actions", "[{ label, variant, run(card) }]：按钮；没写 run 就是关闭"],
    ]],
    ["返回值和其他", ["名称", "说明"], [["close()", "关掉这一条"], ["notify 事件", "每来一条在 document 上发，detail 是传进来的选项"], [".notifs", "容器（没有就自己建），里面的 [data-clear-all] 全部清除"]]],
  ],
  banner: [
    ["函数和标记", ["名称", "说明"], [
      [".banner-wrap > .banner.warn | .bad | .ok", "横幅；颜色只表达状态"],
      ["[data-dismiss]", "关闭按钮（bindBanners 接上）"],
      ["closeBanner(.banner-wrap)", "收起（高度过渡）"],
      ["bindBanners(root)", "接上 root 里横幅的关闭按钮"],
    ]],
  ],
  loading: [
    ["loadWithSkeleton(容器, 选项)", ["选项", "说明"], [
      ["load", "() => Promise：取数据"],
      ["skeleton", "骨架的 HTML（.sk 是一条骨架）"],
      ["render", "(数据) => HTML"],
      ["stagger", "逐行替换的间隔（默认 40ms）"],
      ["返回", "Promise：{ shown（骨架出现过没有）, waited（等了多久）}"],
    ]],
  ],
  progress: [
    ["mountProgress(.pcard, 选项)", ["选项 / 方法", "说明"], [
      ["onCancel / onOpen", "点“取消” / “打开”时调（参数是这个进度卡）"],
      ["start(标题, 副标题)", "开始：进度归零"],
      ["set(p, 副标题)", "进度 0 ~ 1"],
      ["finish(标题, 副标题)", "完成：文字模糊换掉，图标原地变对勾"],
      ["cancel(标题, 副标题)", "取消"],
    ]],
  ],
  numflow: [
    ["numberFlow(元素, 选项)", ["选项 / 方法", "说明"], [
      ["value", "初始值"],
      ["format", "(v) => 文字：千分位、单位……（默认中文千分位）"],
      ["style", '"roll" | "blur" | "push" | "fade"'],
      ["set(v, { instant })", "改值：只动变了的那几位"],
      ["get() / setStyle(s)", "当前值 / 换样式"],
    ]],
  ],
  collapse: [
    ["mountCollapse(.acc, 选项)", ["选项 / 方法", "说明"], [
      ["single", "同时只开一项"],
      ["onToggle", "(item, open) => {}"],
      ["open(i) / close(i) / toggle(i)", "控制第 i 项"],
      ["bindCollapses(root)", "接上 root 里所有 .acc"],
    ]],
    ["标记", ["写法", "说明"], [[".acc > .acc-item(.open) > .acc-hd + .acc-bd > div", "标题按钮 + 内容（内容外面多包一层，高度过渡不重排）"]]],
  ],
  image: [
    ["openLightbox(items, 第几张, 选项)", ["参数 / 选项", "说明"], [
      ["items[i].src / bg", '图片地址；或者直接给 CSS 背景（"url(…) center / cover"、渐变、颜色）'],
      ["items[i].size / ratio", "原图宽高 [宽, 高]（适应窗口时不放大超过原图）/ 只知道比例时给宽 ÷ 高"],
      ["items[i].type", '"video"：在看图层里直接播放（src 是视频地址，poster 是封面），没有缩放和旋转'],
      ["items[i].alt", "说明文字（读屏用）"],
      ["thumbOf(i)", "第 i 张的缩略图：从它那里放大，关上时沿原路缩回去（打开期间缩略图藏起来）；不给就在中间淡入淡出"],
      ["enabled(i)", "左右翻页能不能停在这一张（加载失败的跳过）"],
      ["onClose()", "关上以后"],
      ["返回", "{ close(), step(±1), zoom(±1), rotate(±1), reset() }；closeLightbox() 关上当前打开的"],
    ]],
    ["看图层里的操作", ["操作", "说明"], [
      ["滚轮 / 触控板捏合", "以鼠标位置为中心缩放，50%～800%（100% 是适应窗口），跟手、不跳"],
      ["双击", "在适应窗口和 2 倍之间切换，以双击的位置为中心"],
      ["拖动", "放大以后拖动查看；拖出边会被拉住，松手弹回边界里。没放大时左右拖动翻页"],
      ["工具条", "上一张 / 下一张、缩小 / 放大（按 50、75、100、150、200、300、400、600、800% 走）、向左 / 向右旋转、还原、关闭"],
      ["旋转", "每次 90°，转完重新适应窗口（横图转成竖的也完整显示）；平移跟着一起转"],
      ["键盘", "← → 翻页，+ − 缩放，R 向右转、⇧R 向左转，0 还原，Esc 关闭；Tab 只在工具条里转"],
      ["点空白处", "关上（点图片本身不关，免得想放大时误关）"],
    ]],
    ["缩略图状态", ["写法", "说明"], [[".im", "缩略图（--g 是背景）"], [".loaded / .failed", "加载好（模糊淡入）/ 失败（显示重试）"]]],
  ],
  media: [
    ["视频", ["名称", "说明"], [
      ["playerHTML({ src, poster, label })", "播放器的标记"],
      ["mountPlayer(.player, { onError })", "接上：返回 { play(), pause(), toggle(), video, destroy() }"],
    ]],
    ["音频", ["名称", "说明"], [
      ["audioHTML({ src, title, sub, wave })", "音频条的标记；wave：波形数据地址（Mixkit 的音乐自动找）"],
      ["mountAudio(.audio-row, { onError })", "接上；同一时间只放一个"],
    ]],
  ],
  upload: [
    ["mountUpload(拖放区, 选项)", ["选项", "说明"], [
      ["list", "文件行放在哪个元素里"],
      ["accept / badType", "允许的扩展名（正则）/ 不允许时的提示"],
      ["maxSize / tooBig", "最大字节数 / 超出时的提示"],
      ["upload", "(file, onProgress) => Promise：真上传；不给就是演示用的假进度"],
      ["返回 add(files)", "加文件（拖放、选择之外的来源）"],
    ]],
  ],
  sidebar: [
    ["mountSidebar(.app, 选项)", ["选项 / 方法", "说明"], [
      ["onNavigate", "(a) => {}：点了侧栏条目"],
      ["toggle()", "收起 / 展开（⌘\\ 也行）"],
      ["select(a)", "选中某一项"],
      ["setFx(v)", '选中样式："slide"（底色滑）| "bar"（指示条）| "fade" | "text"'],
    ]],
  ],
  tabs: [
    ["函数", ["名称", "说明"], [
      ["mountTabs(.tabs, { onChange(i) })", "返回 { select(i), index }"],
      ["mountPager(.pager, { total, page, onChange(p) })", "返回 { go(p), page }"],
      ["setStep(.steps, i)", "第 i 步是当前，前面的都完成"],
    ]],
  ],
  reorder: [
    ["mountReorder(列表, 选项)", ["选项", "说明"], [
      ["onReorder", "(from, to, row) => {}：顺序变了（拖拽、键盘都算）"],
      ["row", '行的选择器（默认 ".drag-row"）；拖的把手是行里的 .grip'],
    ]],
  ],
  addremove: [
    ["函数", ["名称", "说明"], [
      ["insertWithFlip(容器, 元素, 放在谁前面)", "从下面淡入，别的元素让位"],
      ["removeWithFlip(元素)", "先脱离布局淡出，剩下的用弹簧补位；返回 Promise"],
    ]],
  ],
  optimistic: [
    ["optimistic(选项)", ["选项", "说明"], [
      ["apply / revert", "马上改界面 / 失败时改回去"],
      ["save", "() => Promise：保存"],
      ["shake", "失败时抖两下的元素"],
      ["failText", "失败提示（默认“没保存上，已恢复原样”），带“重试”"],
    ]],
  ],

  button: [
    ["变体和尺寸", ["写法", "说明"], [
      [".btn.primary / secondary / tertiary / ghost / danger / danger-soft", "6 种变体，由强到弱；每个区域只放一个主按钮"],
      [".sm / （默认）/ .lg", "高 28 / 32 / 40"],
      [".ibtn", "只有图标的按钮（要写 data-tip 或 aria-label）"],
      ['data-i="图标名:before"', "图标在文字前；:after 在后；data-i 由 injectIcons 换成图标"],
      ['aria-disabled="true" + data-tip', "禁用：点了不响应，只把原因亮出来（不用 disabled，免得读屏跳过）"],
    ]],
    ["函数", ["名称", "说明"], [
      ["busy(按钮, 毫秒或 Promise)", "等待：300ms 内回来不转圈，转圈出现后至少留 500ms；期间点不了。返回 Promise"],
      ["succeed(按钮)", "原地换成对勾，一会儿换回文字"],
      ["prepBusy(按钮)", "提前把内容包好（避免第一次等待时排版跳一下）"],
    ]],
  ],
  chip: [
    ["标记", ["写法", "说明"], [
      [".chip[data-toggle]", "筛选芯片：点了切换 .on"],
      ['[data-chips="removable"] .chip .x', "可移除标签：点 × 移除"],
    ]],
    ["函数", ["名称", "说明"], [
      ["bindForms(root)", "接上 root 里的芯片（也接下拉、复制、清除、显示密码、自动长高、滑块、验证码）"],
      ["removeChip(芯片, { onRemoved })", "先脱离布局淡出，剩下的用弹簧补位"],
      ["chipremove 事件", "移除后在容器上冒泡，detail: { chip }"],
    ]],
  ],
  field: [
    ["函数", ["名称", "说明"], [
      ["validateForm(form, 规则)", "规则 { data-f 的值: (值, 输入框) => 错误文字或假值 }；返回是否通过"],
      ["setFieldError(字段, 文字)", "错误在字段下方展开、输入框抖两下（aria-invalid）"],
      ["clearFieldError(字段)", "收起错误；一开始输入也会自动收起"],
    ]],
    ["标记", ["写法", "说明"], [
      [".field[data-f]", "要校验的字段"],
      [".lbl / .help / .err > span", "标签 / 帮助文字 / 错误文字的位置"],
    ]],
  ],
  special: [
    ["函数", ["名称", "说明"], [
      ["mountPassword(input[data-pw])", "强度条 + 文字；大写锁定提示"],
      ["mountEmail(input[data-email])", "停手 400ms 判断，对了画对勾；离开时不对才报错"],
      ["mountSearch([data-search], { search, debounce })", "search(q) 返回数量、数组或 Promise；超过 300ms 才转圈、至少转 500ms；debounce 默认 150ms"],
    ]],
    ["标记", ["写法", "说明"], [
      ["[data-clearable]", "有内容时右边出清除按钮（bindForms 接上）"],
      ["[data-eye]", "显示 / 隐藏密码（bindForms 接上）"],
    ]],
  ],
  count: [
    ["函数", ["名称", "说明"], [
      ["mountCount(input[data-count])", "单行计数，maxlength 是上限"],
      ["mountLongText([data-ta], { onSubmit })", "自动长高 + 量环计数（data-max）；⌘↵ 提交"],
      ["autoGrow(容器)", "只要自动长高（rows 到 data-max-lines 行）"],
      ["longCount(容器, { showFrom })", "只要计数；showFrom：写到几成才显示（0~1）"],
      ["bindInputs(root)", "按标记一次接上（data-count / data-ta / data-pw / data-email / data-tagin / data-stepper / data-composer）"],
    ]],
  ],
  taginput: [
    ["mountTagInput(容器, 选项)", ["选项", "说明"], [
      ["initial", "一开始就有的标签"],
      ["onChange", "(tags) => {}：标签变了调"],
    ]],
    ["返回值", ["名称", "说明"], [["tags", "现在的标签（只读）"], ["add(文字)", "加一个"], ["clear()", "全部清掉"]]],
    ["标记", ["写法", "说明"], [["[data-tagin][data-max]", "最多几个"], ["后面紧跟的 .roll", "计数"]]],
  ],
  number: [
    ["mountStepper(容器, 选项)", ["选项 / 返回", "说明"], [
      ["onChange", "(value) => {}"],
      ["data-min / data-max / data-value", "范围和初始值（写在容器上）"],
      ["返回 value / set(v)", "现在的值 / 改值（超出范围抖一下）"],
    ]],
  ],
  prompt: [
    ["mountComposer(容器, 选项)", ["选项", "说明"], [
      ["onSend", "({ text, files }) => Promise：发送；期间“生成中”，发送键变停止"],
      ["onStop", "() => {}：生成中点停止（键盘回车不会停止，只晃一下停止键）"],
      ["upload", "(file, onProgress) => Promise：真上传；不给就是演示用的假进度"],
    ]],
    ["返回值", ["名称", "说明"], [["setBusy(on)", "手动切换生成中"], ["clear({ smooth })", "清空；smooth：附件淡出、输入框平滑收起"], ["files()", "现在的附件元素"]]],
    ["事件", ["名称", "说明"], [["compose / compose-stop", "不给 onSend、容器写了 data-external 时，发送 / 停止改成在容器上发这两个事件（对话组件这样接）"]]],
  ],
  otp: [
    ["mountOtp(容器, 选项)", ["选项 / 返回", "说明"], [
      ["onComplete", "(code) => {}：填满时调（同时在容器上发 complete 事件）"],
      ["返回 value / clear()", "现在填了的 / 清空"],
    ]],
  ],
  segmented: [
    ["initSeg(元素, 回调, 起始格)", ["参数 / 返回", "说明"], [
      ["回调", "(value, index, animate) => {}；value 取按钮的 data-v，没写就用文字"],
      ["起始格", "一开始选中第几格（默认 0）"],
      ["返回 go(n, focus, instant)", "切到第 n 格"],
      ["放不下", "比容器宽时横着滑（左右渐隐，竖滚轮也横向滚）"],
    ]],
    ["标记", ["写法", "说明"], [[".seg > .thumb + button…", "滑块 + 各格"], [".seg.sm", "小号（高 28）"]]],
  ],
  slider: [
    ["initSlider(元素)", ["写法 / 事件", "说明"], [
      ["data-max / aria-valuenow", "最大值 / 初始值（写在元素上）"],
      ["slide 事件", "拖动、点轨道、方向键改值时发，e.detail 是新值"],
      ["元素.setValue(v)", "改值"],
    ]],
  ],
  tooltip: [
    ["标记", ["写法", "说明"], [
      ['data-tip="文字"', "引入 kit-core.js 后自动有提示：悬停 500ms 出现，键盘聚焦也出现"],
      ['data-kbd="⌘C"', "提示后面带快捷键"],
      ['.tip.wrap', "长提示换行（最宽 240）"],
    ]],
    ["函数", ["名称", "说明"], [["showTip(元素, 文字)", "在别的时机显示（比如校验失败）"], ["hideTip()", "收起"]]],
  ],

  select: [
    ["mountSelect(元素, 选项)", ["选项", "取值", "说明"], [
      ["onChange", "(value, item) => {}", "选中一项时调；value 取条目的 data-v，没写就用文字"],
    ]],
    ["返回值", ["名称", "说明"], [
      ["open() / close(refocus)", "打开、关上"],
      ["value", "当前选中项的值（只读）"],
      ["set(value)", "选中某一项（不触发回调）"],
    ]],
    ["标记", ["写法", "说明"], [
      [".select[data-select]", "下拉选择：选中后把文字写进 .val、打勾"],
      [".select（不带 data-select）", "菜单按钮：选了就关"],
      [".trigger / [data-menubtn]", "触发器"],
      ["[data-prefix]", "写在菜单按钮的触发器上：选中后按钮文字 = 前缀 + 条目文字"],
      [".menu > .item", "条目；.sel 选中、.chk 打勾位置、.is-off 不可用、data-v 值"],
    ]],
    ["其他", ["名称", "说明"], [
      ["bindSelects(root)", "把 root 里所有 .select 一次接上（接过的不重复接）"],
      ["select 事件", "选中时在 .select 上冒泡，detail: { value, item }"],
    ]],
  ],
  compound: [
    ["标记", ["写法", "说明"], [
      [".group", "按钮组：相关操作连成一组（共用圆角、中间不留缝）"],
      [".group.split.select", "分裂按钮：主按钮 + 一个菜单按钮（用 bindSelects 接上）"],
      ["[data-copy]", "复制按钮：里面放 .swap（.a 复制图标、.b 对勾）"],
    ]],
    ["函数", ["名称", "说明"], [
      ["copied(按钮)", "图标原地换成对勾 1.2 秒，再换回来（复制本身由你做）"],
      ["bindSelects(root)", "接上分裂按钮里的菜单"],
    ]],
  ],
  popover: [
    ["openPopover(面板, 触发按钮, 选项)", ["选项", "取值", "默认", "说明"], [
      ["align", '"start" | "end"', '"start"', "和按钮左边对齐还是右边对齐"],
      ["onClose", "() => {}", "无", "关上以后调"],
    ]],
    ["返回值", ["名称", "说明"], [["close(refocus)", "关上；refocus 为 true 时焦点回到按钮"]]],
    ["其他", ["名称", "说明"], [
      ["popoverOf(面板)", "正开着的那个（没开返回 undefined），用来做“再点一下关上”"],
      ["placePanel(面板, 锚点, { align, gap })", "只放位置：默认在下方，放不下翻到上方，左右不出窗口"],
      ['[data-pop="面板 id"]', "写在按钮上，bindOverlays 接上：点了开、再点关"],
      ["关闭时机", "Esc、点面板外面、Tab 走出面板、窗口变化时重新对位"],
    ]],
  ],
  popconfirm: [
    ["标记", ["写法", "说明"], [
      [".pop.popconfirm", "气泡确认面板（role=\"alertdialog\"）"],
      ["[data-no] / [data-yes]", "取消 / 确认；打开时焦点先落在取消上"],
    ]],
    ["函数", ["名称", "说明"], [
      ["openPopover(面板, 按钮, { align: \"end\" })", "和弹出面板同一个接口，返回 { close }"],
    ]],
  ],
  ctxmenu: [
    ["openMenu(菜单, 选项)", ["选项", "说明"], [
      ["trigger", "触发的元素：打开时加 .is-open、关上后焦点回到它"],
      ["anchor", "贴着这个元素弹（菜单按钮）"],
      ["x / y", "在这个位置弹（右键菜单）；放不下往左、往上开"],
      ["bound", "菜单（连同每一层子菜单）只能待在这个容器里"],
      ["keyboard", "用键盘打开：先高亮第一项"],
      ["onSelect", "({ item, label, path, menu }) => {}：选中一项时调"],
    ]],
    ["其他", ["名称", "说明"], [
      ["closeMenu(refocus)", "关上整套菜单"],
      ["menuOpenFor(trigger)", "这个触发器的菜单是不是开着"],
      ["menuselect 事件", "选中时在根菜单上冒泡；detail 同 onSelect"],
      ['[data-ctx="菜单 id"]', "右键区域（Shift+F10、菜单键也行）"],
      ['[data-fmenu="菜单 id"]', "菜单按钮（↓ 键也能打开）"],
    ]],
    ["菜单标记", ["写法", "说明"], [
      [".menu.float > .item", "条目；.key 快捷键提示、.danger-item 危险项、.is-off 不可用"],
      ['data-sub="子菜单 id"', "有子菜单的条目：悬停 220ms 打开，朝子菜单走时有安全三角区"],
      [".sep / .head", "分组之间的间隔 / 分组标题"],
      ["键盘", "↑↓ 移动、→ 进子菜单、← 回上一层、回车选中、Esc 关闭"],
    ]],
  ],
  dialog: [
    ["函数", ["名称", "说明"], [
      ["openDialog(弹窗, 触发按钮)", "从按钮那里长出来（只动 transform 和 opacity）"],
      ["closeDialog(弹窗, refocus = true)", "原路缩回，焦点回到按钮；返回 Promise（动画走完才 resolve）"],
      ["弹窗.guard = () => {}", "挂在弹窗上：Esc、取消、× 都先调它（比如有填写内容先问一句）"],
    ]],
    ["标记", ["写法", "说明"], [
      ["<dialog class=\"dlg\">", "弹窗；里面 .hd 标题、.bd 内容、.ft 按钮（主按钮在最右）"],
      ['[data-dlg="弹窗 id"]', "打开弹窗的按钮（bindOverlays 接上）"],
      ["[data-x] / [data-cancel]", "关闭（走 guard）"],
      ["点背景", "只“顶一下”提示，不关（避免误关丢内容）"],
    ]],
  ],
  drawer: [
    ["openDrawer(抽屉, 选项)", ["选项", "说明"], [
      ["trigger", "触发的按钮：关上后焦点回到这里"],
      ["focus", "打开后焦点先落在这里（默认抽屉里第一个能聚焦的）"],
      ["scrim", "遮罩元素（默认页面上的 .drawer-scrim，没有就建一个）"],
      ["onClose", "关上以后调"],
    ]],
    ["其他", ["名称", "说明"], [
      ["返回值", "{ close(refocus) }"],
      ["closeDrawer(refocus)", "关上正开着的那个抽屉"],
      ['[data-drawer="抽屉 id"]', "打开抽屉的按钮（bindOverlays 接上）"],
      ["抽屉里的 [data-x]", "关闭"],
      ["关闭时机", "Esc、点外面（提示、轻提示、菜单除外）"],
    ]],
  ],
  cmdk: [
    ["mountCmdk(分组, 选项)", ["选项", "说明"], [
      ["分组", "[{ name, items: [{ icon, name, sub, key, keys }] }]；keys 是额外的搜索词（比如英文名）"],
      ["onRun", "(item) => {}：选中一项执行"],
      ["placeholder", "输入框占位文字"],
      ["empty", "(q) => HTML：没有结果时显示；里面带 data-empty-act 的按钮点了调 onEmpty"],
      ["onEmpty", "(q) => {}：没有结果时回车或点出口按钮"],
      ["hotkey", "true：⌘K / Ctrl+K 打开（默认）"],
    ]],
    ["返回值", ["名称", "说明"], [["open() / close() / toggle()", "打开、关上、切换"], ["input / list", "输入框、列表元素"]]],
  ],

  scrollarea: [
    ["scrollArea(元素, 选项)", ["选项", "取值", "默认", "说明"], [
      ["fade", '"y" | "x" | "both" | "none" | "top bottom left right" 任意几条边', '"y"', "边缘渐隐的方向。只在那个方向还有内容时出现"],
      ["size", "数字（px）", "24", "渐隐带宽度"],
      ["bar", '"auto" | "hover" | "always" | "gutter" | "none"', '"auto"', "滚动条怎么出现：滚动时 / 悬停时 / 一直悬浮 / 一直占位 / 不显示"],
      ["barSize", "数字（px）", "5", "滚动条平时的粗细，悬停、拖动时再粗 3px"],
      ["barInset", "数字（px）", "1", "滚动条离边的距离"],
      ["overscroll", '"auto" | "contain" | "bounce" | "chain"', '"auto"', "滚到头：一次滚动里停住、不回弹，再滚一次交给外层（横向停住）/ 都停住 / 回弹（表格别用）/ 都交给外层"],
      ["wheel", '"auto" | "x"', '"auto"', '"x"：竖着滚滚轮也横向滚（横向长条用），滚到头放行给页面'],
      ["inner", "true | false", "false", "元素自己有定位（菜单、侧栏这类 absolute / fixed / sticky 面板）时为 true：在元素里面套一层滚动视口"],
    ]],
    ["返回值", ["名称", "类型", "说明"], [
      ["box", "元素", "滚动区域外面那一层（定位容器，滚动条画在这里）"],
      ["vp", "元素", "滚动视口（原生滚动的那个元素）"],
      ["set(选项)", "函数", "运行时改任意一项选项"],
      ["refresh()", "函数", "内容大小变了但没触发观察时，手动重新量滚动条"],
      ["options", "对象（只读）", "当前的选项"],
    ]],
    ["写在标记上", ["属性", "对应选项", "例子"], [
      ["data-sa", "fade", 'data-sa="y"'],
      ["data-sa-size", "size", 'data-sa-size="40"'],
      ["data-sa-bar", "bar", 'data-sa-bar="hover"'],
      ["data-sa-bar-size", "barSize", 'data-sa-bar-size="8"'],
      ["data-sa-inset", "barInset", 'data-sa-inset="4"'],
      ["data-sa-over", "overscroll", 'data-sa-over="contain"'],
      ["data-sa-wheel", "wheel", 'data-sa-wheel="x"'],
    ]],
    ["CSS 变量", ["变量", "默认", "说明"], [
      ["--sa-fade", "24px", "渐隐带宽度（size 写的就是它）"],
      ["--sa-thumb", "浅色 rgba(0,0,0,.26) / 深色 rgba(255,255,255,.28)", "滑块颜色"],
      ["--sa-thumb-hover", "浅色 rgba(0,0,0,.44) / 深色 rgba(255,255,255,.48)", "悬停、拖动时滑块颜色"],
    ]],
    ["事件", ["事件", "说明"], [
      ["sa-jump", "拖滑块一下跳很远时，在视口上同步发出：虚拟列表在同一个任务里画出新位置的内容，不等下一帧"],
    ]],
  ],
};
