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
<div class="sn-list" ${attrs}>
  <div class="row">镜头 01 · 车站外，雨刚停</div>
  <div class="row">镜头 02 · 林夏走进候车厅</div>
  <!-- …… -->
</div>`;
export const EXAMPLES = {
  md: {
    0: {
      files: [
        { name: "Markdown", lang: "md", code: MD_SRC },
        { name: "JS", lang: "js", code: `import { setup } from "satin-ui";
import { renderMarkdown } from "satin-ui/markdown";
import "satin-ui/css/md.css";
import "satin-ui/css/data.css";

setup(); // 页面级行为（复制按钮的提示、看图的键盘），整页调一次

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
        { name: "HTML", lang: "html", code: `<!-- 容器：渲染后加上 .sn-md，排版、颜色跟着主题走 -->
<article id="doc"></article>` },
      ],
    },
  },
  scrollarea: {
    0: {
      html: `<div class="sn-list" style="max-height: 240px">…</div>
<div class="sn-strip">…</div>
<div class="board" style="max-height: 240px">…</div>`,
      js: `import { createScrollArea } from "satin-ui/components";

// 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
const num = (v) => (v == null || v === "" ? undefined : Number(v));
for (const el of document.querySelectorAll("[data-sa]")) {
  const d = el.dataset;
  createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
}
// 竖向：上下渐隐（默认）；横向长条：左右渐隐 40px，竖着滚滚轮也横向滚（wheel: "x"）；两个方向都能滚：四边渐隐（fade: "both"）`,
    },
    1: {
      html: SA_PANE('data-sa="y" data-sa-size="24"', "展示页把 data-sa、data-sa-size 读成 createScrollArea 的 fade、size 选项"),
      js: `import { createScrollArea } from "satin-ui/components";

// 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
const num = (v) => (v == null || v === "" ? undefined : Number(v));
for (const el of document.querySelectorAll("[data-sa]")) {
  const d = el.dataset;
  createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
}
// size：渐隐带有多宽（px）——0 不渐隐、16 菜单和小列表、24 默认、40 横向长条和大面板。只在那个方向还有内容时出现，滚多少长多宽，滚到头消失；只要一边就把 fade 写成那几条边（"bottom"）`,
    },
    2: {
      html: SA_PANE('data-sa="y" data-sa-bar="hover"', "data-sa-bar：滚动条怎么出现（对应 bar 选项）"),
      js: `import { createScrollArea } from "satin-ui/components";

// 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
const num = (v) => (v == null || v === "" ? undefined : Number(v));
for (const el of document.querySelectorAll("[data-sa]")) {
  const d = el.dataset;
  createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
}
// bar：滚动条怎么出现——auto（默认：滚动或悬停时出现，停下 0.7 秒淡出）、hover（只在指针停在区域上时）、always（一直显示，悬浮在内容上）、gutter（一直显示，有自己的一条位置）、none（不显示）`,
    },
    3: {
      html: SA_PANE('data-sa="y" data-sa-bar="always" data-sa-bar-size="8" data-sa-inset="4"', "data-sa-bar-size、data-sa-inset（对应 barSize、barInset）"),
      js: `import { createScrollArea } from "satin-ui/components";

// 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
const num = (v) => (v == null || v === "" ? undefined : Number(v));
for (const el of document.querySelectorAll("[data-sa]")) {
  const d = el.dataset;
  createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
}
// barSize：平时多粗（px，默认 5），悬停、拖动时再粗 3px；barInset：离边多远（px，默认 1）。颜色跟主题走，要改就覆盖 --sn-sa-thumb、--sn-sa-thumb-hover`,
    },
    4: {
      html: SA_PANE('data-sa="y" data-sa-over="contain"', "data-sa-over：滚到头怎么办（对应 overscroll）"),
      js: `import { createScrollArea } from "satin-ui/components";

// 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
const num = (v) => (v == null || v === "" ? undefined : Number(v));
for (const el of document.querySelectorAll("[data-sa]")) {
  const d = el.dataset;
  createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
}
// overscroll：滚到头怎么办——auto（默认：一次滚动在区域里开始，滚到头就停住，新的一次交给页面）、contain（两个方向都停住：弹层、菜单、抽屉里的列表）、bounce（回弹，表格别用）、chain（都交给外层）`,
    },
    5: {
      html: `<div class="sn-tbl-wrap" style="--sn-tbl-max: 236px">
  <div class="sn-tbl-sc">
    <table class="sn-tbl">
      <thead>…</thead>   <!-- position: sticky，吸在顶上 -->
      <tbody>…</tbody>
      <tfoot>…</tfoot>   <!-- 吸在底下 -->
    </table>
  </div>
</div>`,
      js: `import { createScrollArea } from "satin-ui/components";

// 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
const num = (v) => (v == null || v === "" ? undefined : Number(v));
for (const el of document.querySelectorAll("[data-sa]")) {
  const d = el.dataset;
  createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
}
// 表格用默认的 overscroll: "auto"，不回弹（浏览器自带的回弹会把吸附的表头、合计行一起拉走）；data-sa="none" 不加边缘渐隐，免得表头、合计行被淡掉`,
    },
    6: {
      html: `<textarea class="sn-input" rows="6">…</textarea>`,
      js: `import { createScrollArea } from "satin-ui/components";

// 多行输入也能当滚动视口：系统滚动条换成细滚动条，输入时自动重新量长度
createScrollArea(document.querySelector("textarea"), { fade: "none" });`,
    },
  },
  select: {
    0: {
      html: `<!-- 下拉选择：选中后把文字写进 .sn-val，打勾 -->
<div class="sn-select" data-select>
  <button class="sn-trigger"><span class="sn-val">16:9 · 横屏</span><span data-i="chevron-down"></span></button>
  <div class="sn-menu" role="listbox">
    <div class="sn-item sn-sel" data-v="16:9">16:9 · 横屏<span class="sn-chk" data-i="check"></span></div>
    <div class="sn-item" data-v="9:16">9:16 · 竖屏<span class="sn-chk" data-i="check"></span></div>
    <div class="sn-item" data-v="1:1">1:1 · 方形<span class="sn-chk" data-i="check"></span></div>
  </div>
</div>

<!-- 菜单按钮：选了就关；触发器写了 data-prefix，选中后按钮文字变成"排序：……" -->
<div class="sn-select sn-inline-menu">
  <button class="sn-btn sn-secondary" data-menubtn data-prefix="排序：">排序：最近更新</button>
  <div class="sn-menu" role="menu">
    <div class="sn-item sn-sel">最近更新<span class="sn-chk" data-i="check"></span></div>
    <div class="sn-item">名称<span class="sn-chk" data-i="check"></span></div>
  </div>
</div>`,
      js: `import { setup, injectIcons } from "satin-ui";
import { createSelect, bindSelects } from "satin-ui/components";
import "satin-ui/css/form.css";
import "satin-ui/css/overlay.css";

setup();               // 页面级行为（点外面收起、Esc），整页调一次
injectIcons(document); // data-i 换成图标

// 一个一个接：选中时回调
const ratio = createSelect(document.querySelector("[data-select]"), {
  onChange: (value) => console.log("画面比例", value),
});
ratio.update({ value: "9:16" }); // 改选中项（不触发回调）
ratio.value;                     // "9:16"

// 或者把页面上所有 .sn-select 一次接上，用事件拿结果
bindSelects(document);
document.addEventListener("select", (e) => console.log(e.detail.value));

// 不写标记也行：createSelect(空容器, { items: ["16:9 · 横屏", "9:16 · 竖屏"], value: "16:9 · 横屏", label: "画面比例" }) 按选项渲染`,
    },
  },
  compound: {
    0: {
      html: `<!-- 按钮组：相关的几个操作连成一组 -->
<div class="sn-group">
  <button class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" data-i="chevron-left"></button>
  <button class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" data-i="chevron-right"></button>
</div>

<!-- 分裂按钮：主操作 + 备选（备选是一个菜单按钮） -->
<div class="sn-group sn-split sn-select sn-inline-menu">
  <button class="sn-btn sn-primary">导出成片</button>
  <button class="sn-btn sn-primary sn-more" data-menubtn data-tip="更多导出方式" data-i="chevron-down"></button>
  <div class="sn-menu sn-end" role="menu">
    <div class="sn-item">MP4（1080p）</div>
    <div class="sn-item">MP4（4K）</div>
  </div>
</div>

<!-- 复制按钮：成功后图标原地换成对勾 -->
<button class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接">
  <span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span>
</button>`,
      js: `import { setup, injectIcons } from "satin-ui";
import { bindSelects, copied } from "satin-ui/components";
import "satin-ui/css/buttons.css";
import "satin-ui/css/overlay.css";

setup();               // 页面级行为（提示、点外面收起菜单），整页调一次
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
      html: `<button class="sn-btn sn-secondary" data-pop="pop-share">分享</button>

<!-- 面板放在页面任意地方（一般放在 body 末尾），打开时贴着按钮弹出 -->
<div class="sn-pop sn-popover" id="pop-share" role="dialog" aria-label="分享">
  <h4>分享给协作者</h4>
  <p>拿到链接的人可以查看，不能修改。</p>
  <div class="sn-acts"><button class="sn-btn sn-primary sn-sm">复制链接</button></div>
</div>`,
      js: `import { popoverOf, copied } from "satin-ui/components";

// 写在标记上：[data-pop="面板 id"] 点了开、再点关；Esc、点外面、焦点离开面板都会关——enhance() 已经接上
// 面板里的操作做完以后关上：popoverOf(面板) 拿到正开着的那一层，close() 关上（焦点回到按钮）
const pop = document.querySelector("#pop-share"), copyBtn = pop.querySelector(".sn-btn");
copyBtn.addEventListener("click", async () => {
  await navigator.clipboard?.writeText(location.href).catch(() => {});
  copied(copyBtn);
  setTimeout(() => popoverOf(pop)?.close(true), 700);
});
// 不用标记也行：openPopover(面板, 按钮, { align: "end", onClose })，返回的那一层有 close()`,
    },
  },
  popconfirm: {
    0: {
      html: `<button class="sn-btn sn-danger-soft sn-sm" id="purge">永久删除</button>

<div class="sn-pop sn-popconfirm" id="pc" role="alertdialog" aria-labelledby="pc-q">
  <div class="sn-q"><span data-i="triangle-alert"></span>
    <div><div id="pc-q">永久删除这个镜头？</div><div class="sn-d">删除后无法恢复。</div></div>
  </div>
  <div class="sn-acts">
    <button class="sn-btn sn-ghost sn-sm" data-no>取消</button>
    <button class="sn-btn sn-danger sn-sm" data-yes>永久删除</button>
  </div>
</div>`,
      js: `import { openPopover, toast } from "satin-ui/components";

// 气泡确认就是一个弹出面板：打开时焦点先落在"取消"上（防止回车误删）
const btn = document.querySelector("#purge"), pc = document.querySelector("#pc");
btn.addEventListener("click", () => {
  const confirm = openPopover(pc, btn, { align: "end" });
  pc.querySelector("[data-no]").focus();
  pc.querySelector("[data-no]").onclick = () => confirm.close(true);
  pc.querySelector("[data-yes]").onclick = () => { confirm.close(); toast({ text: "镜头已永久删除" }); }; // 换成你的删除
});`,
    },
  },
  ctxmenu: {
    0: {
      html: `<!-- 右键区域：data-ctx 写菜单 id；键盘用 Shift+F10 或菜单键打开 -->
<div class="sn-ctx-zone" data-ctx="m-shot" tabindex="0">在这里点右键</div>

<!-- 菜单按钮：贴着按钮弹 -->
<button class="sn-btn sn-secondary" data-fmenu="m-shot">更多</button>

<div class="sn-menu sn-float" id="m-shot" role="menu">
  <div class="sn-item" data-i="pencil:before">重命名<span class="sn-key">F2</span></div>
  <div class="sn-item" data-sub="m-move">移动到<span data-i="chevron-right:more"></span></div>
  <div class="sn-item sn-is-off">分享给协作者</div>        <!-- 不可用 -->
  <div class="sn-sep"></div>
  <div class="sn-item sn-danger-item" data-i="trash-2:before">移到回收站</div>
</div>
<!-- 子菜单：上一层的条目写 data-sub="子菜单 id" -->
<div class="sn-menu sn-float" id="m-move" role="menu">
  <div class="sn-head">第一季</div>
  <div class="sn-item">第一集</div>
  <div class="sn-item">第二集</div>
</div>`,
      js: `import { toast } from "satin-ui/components";

// 写在标记上：[data-ctx="菜单 id"] 右键（或 Shift+F10、菜单键）在指针处弹，触屏长按 500ms 弹；[data-fmenu="菜单 id"] 贴着按钮弹——enhance() 已经接上
// 选中：根菜单上冒泡 menuselect，detail 里有条目文字和子菜单路径
document.querySelector("#m-shot").addEventListener("menuselect", (e) => {
  const { label, path } = e.detail; // 比如 "第二集"、["移动到"]
  toast({ text: [...path, label].join(" › ") });
});
// 自己控制：openMenu(菜单, { trigger, x, y, bound })，在指针处弹、只待在 bound 这个框里；closeMenu() 关上整套菜单`,
    },
  },
  dialog: {
    0: {
      html: `<button class="sn-btn sn-primary" data-dlg="dlg-new">新建项目</button>

<dialog class="sn-dlg" id="dlg-new" aria-labelledby="dn-t">
  <form method="dialog" novalidate>
    <div class="sn-hd">
      <div style="flex:1"><h3 id="dn-t">新建项目</h3><div class="sn-sub">名称之后随时可以改。</div></div>
      <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-i="x"></button>
    </div>
    <div class="sn-bd">
      <div class="sn-field"><label class="sn-lbl" for="dn-name">项目名称</label><input class="sn-input" id="dn-name"></div>
    </div>
    <div class="sn-ft">
      <button type="button" class="sn-btn sn-ghost" data-cancel>取消</button>
      <button type="submit" class="sn-btn sn-primary">创建项目</button>
    </div>
  </form>
</dialog>`,
      js: `import { closeDialog, busy, toast } from "satin-ui/components";

// [data-dlg="弹窗 id"] 打开：从按钮那里长出来，关闭时原路缩回，焦点回到按钮——enhance() 已经接上
// 弹窗里的 [data-x]、[data-cancel] 和 Esc 关闭；点背景只"顶一下"，不关
const dlg = document.querySelector("#dlg-new"), name = dlg.querySelector("#dn-name");

// 关闭前先问一句：挂一个 guard，Esc / 取消 / 点 × 都会先调它（填了名字就先提示，不弹系统对话框）
dlg.guard = () => {
  if (!name.value.trim()) { closeDialog(dlg); return; }
  toast({ kind: "action", text: "名字还没保存", action: { label: "放弃并关闭", run: (t) => { name.value = ""; closeDialog(dlg); t.close(); } } });
};

dlg.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const v = name.value.trim(); if (!v) { name.focus(); return; }
  await busy(dlg.querySelector(".sn-ft .sn-primary"), 900); // 换成你的创建请求（Promise）
  name.value = ""; closeDialog(dlg);
  toast({ text: \`已创建"\${v}"\` });
});
// 不用标记也行：openDialog(弹窗, 触发按钮)`,
    },
  },
  drawer: {
    0: {
      html: `<button class="sn-btn sn-ghost sn-sm sn-ibtn" id="edit-shot" data-tip="编辑镜头" aria-label="编辑镜头" data-i="pencil"></button>

<!-- 遮罩可以不写：没有 .sn-drawer-scrim 会自动建一个。写在标记上也行：按钮加 data-drawer="dr-edit"，enhance() 接上就能开 -->
<aside class="sn-drawer" id="dr-edit" role="dialog" aria-modal="true" aria-labelledby="dr-t" tabindex="-1">
  <div class="sn-hd">
    <h3 id="dr-t">编辑镜头</h3>
    <button class="sn-btn sn-ghost sn-sm sn-ibtn" data-x aria-label="关闭" data-i="x"></button>
  </div>
  <div class="sn-bd">
    <div class="sn-field"><label class="sn-lbl" for="dr-title">镜头标题</label><input class="sn-input" id="dr-title"></div>
  </div>
  <div class="sn-ft"><button class="sn-btn sn-ghost" data-x>完成</button></div>
</aside>`,
      js: `import { openDrawer, toast } from "satin-ui/components";

// 抽屉里的 [data-x]、Esc、点外面关闭，焦点圈在抽屉里，触屏上手指往右拖也能关
// 自己控制：先把要编辑的内容填进去再打开，关上时收尾
const editBtn = document.querySelector("#edit-shot"), drawer = document.querySelector("#dr-edit"), title = document.querySelector("#dr-title");
const shot = { title: "车站外，雨刚停" };
editBtn.addEventListener("click", () => {
  title.value = shot.title;
  openDrawer(drawer, {
    trigger: editBtn, // 关上后焦点回到这里
    focus: title,     // 打开后焦点先落在这里
    onClose: () => {  // 换成你的保存
      const v = title.value.trim();
      if (v && v !== shot.title) { shot.title = v; toast({ text: \`已保存"\${v}"\` }); }
    },
  });
});`,
    },
  },
  button: {
    3: {
      html: `<!-- 可等待的按钮：busy() 会把内容包成 .sn-label，转圈和对勾都放在里面 -->
<button class="sn-btn sn-primary" id="save">保存修改</button>`,
      js: `import { busy, succeed } from "satin-ui/components";
import "satin-ui/css/buttons.css";

const save = document.querySelector("#save");
const request = () => new Promise((done) => setTimeout(done, 1200)); // 换成你的请求，比如 fetch("/api/projects/42", { method: "PUT" })
save.addEventListener("click", async () => {
  // 300ms 内回来不转圈；转圈出现后至少留 500ms；等待期间点不了
  await busy(save, request());
  succeed(save); // 原地换成对勾，一会儿换回文字
});`,
    },
  },
  chip: {
    0: {
      html: `<!-- 筛选芯片：可多选，点了切换（aria-pressed 跟着变） -->
<div class="row">
  <button class="sn-chip sn-on" data-toggle><span data-i="check"></span>进行中</button>
  <button class="sn-chip" data-toggle><span data-i="check"></span>已完成</button>
</div>

<!-- 可移除的标签：容器写 data-chips="removable" -->
<div class="row" data-chips="removable">
  <span class="sn-chip sn-tag sn-on">雨夜<button class="sn-x" aria-label="移除 雨夜" data-i="x"></button></span>
  <span class="sn-chip sn-tag sn-on">车站<button class="sn-x" aria-label="移除 车站" data-i="x"></button></span>
</div>`,
      js: `import { injectIcons } from "satin-ui";
import { removeChip } from "satin-ui/components";
import "satin-ui/css/buttons.css";

injectIcons(document);

// 筛选芯片：点了切换 .sn-on，aria-pressed 跟着变
for (const c of document.querySelectorAll(".sn-chip[data-toggle]")) {
  c.setAttribute("aria-pressed", String(c.classList.contains("sn-on")));
  c.addEventListener("click", () => c.setAttribute("aria-pressed", String(c.classList.toggle("sn-on"))));
}

// 可移除标签：点 × 先脱离布局淡出，剩下的用弹簧补位；移除后容器上冒泡 chipremove
const row = document.querySelector('[data-chips="removable"]');
row.addEventListener("click", (e) => {
  const x = e.target.closest(".sn-chip .sn-x");
  if (x) removeChip(x.closest(".sn-chip"));
});
row.addEventListener("chipremove", (e) => console.log("移除了", e.detail.chip.textContent));`,
    },
  },
  field: {
    0: {
      js: `import { validateForm, busy, succeed } from "satin-ui/components";

// 每个要校验的字段写 data-f="名字"，下面放 <div class="sn-err"><span></span></div>
const form = document.querySelector("#fieldDemo"), desc = document.querySelector("#f-desc"), count = form.querySelector(".sn-count");
const rules = {
  name: (v) => !v.trim() && "请填写项目名称",
  mail: (v) => v.trim() && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.trim()) && "邮箱格式不对",
  desc: (v) => !v.trim() && "写一句话就好，方便以后找到",
};
// 字数：到上限变色
desc.addEventListener("input", () => { count.textContent = \`\${desc.value.length}/80\`; count.classList.toggle("sn-over", desc.value.length >= 80); });
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm(form, rules)) return; // 有错的都标出来（错误在下方展开、输入框抖两下），焦点到第一个
  const btn = form.querySelector("button[type=submit]");
  await busy(btn, 900); // 换成你的提交请求（Promise）
  succeed(btn);
});
// 也能单独标：比如服务器说名字重复了 → setFieldError(form.querySelector('[data-f="name"]'), "已经有叫这个名字的项目了")
// 一开始输入就自动收起（setup() 装好的页面级行为）`,
    },
  },
  special: {
    0: {
      js: `import { createPassword, createEmail, createSearch } from "satin-ui/components";

// 密码：四段强度条 + 文字，不到 8 位提示还差几位；大写锁定开着时提示
createPassword(document.querySelector("input[data-pw]"));

// 邮箱：停手 400ms 再判断，对了画对勾；离开时还不对才报错
createEmail(document.querySelector("input[data-email]"));

// 搜索：等待超过 300ms 才转圈、转了至少 500ms；search 返回结果数量（或 Promise）。换成你的搜索接口
const SHOTS = ["车站外，雨刚停", "林夏走进候车厅", "站台上的最后一班车", "车窗里的倒影", "雨夜的公交站"];
createSearch(document.querySelector("[data-search]"), {
  search: (q) => new Promise((done) => setTimeout(() => done(SHOTS.filter((s) => s.includes(q)).length), 400)),
});
// 清除按钮（[data-clearable]）有内容时出现、点了清空，显示密码（[data-eye]）切换明文——这两个 enhance() 已经接上`,
    },
  },
  count: {
    0: {
      js: `import { createCount, createLongText, toast } from "satin-ui/components";

// 单行：<input maxlength="20" data-count>，右边的计数跟着滚动，快满变色，写满还在敲时抖一下
for (const input of document.querySelectorAll("input[data-count]")) createCount(input);

// 长文本：<div data-ta data-max="120">…<textarea>…</div>
// 自动长高 + 量环计数；快满"还剩 N 字"，超出"超出 N 字"并整框变红；⌘↵ 提交
createLongText(document.querySelector("[data-ta]"), { onSubmit: () => toast({ text: "画面描述已保存" }) });`,
    },
  },
  taginput: {
    0: {
      html: `<div class="sn-box-in sn-tagin" data-tagin data-max="8">
  <input placeholder="输入标签，回车确认" aria-label="添加标签">
</div>
<div class="sn-tagin-foot">
  <span>回车或逗号添加 · 退格删除</span><span class="sn-num"><span class="sn-roll"><span>0</span></span> / 8</span>
</div>`,
      js: `import { createTagInput } from "satin-ui/components";
import "satin-ui/css/input.css";

// 回车或逗号加标签；重复的抖一下；超过 data-max 个不让加；
// 退格先"点亮"最后一个、再按才删；粘贴一串自动拆开；中文输入法拼字时不响应
const tags = createTagInput(document.querySelector("[data-tagin]"), {
  tags: ["雨夜", "车站"],
  onChange: (list) => console.log(list),
});
tags.tags;    // ["雨夜", "车站"]

// 不写标记也行：createTagInput(空容器, { tags: ["雨夜"], max: 8 }) 按选项渲染（输入框 + 下面的计数行）`,
    },
  },
  number: {
    0: {
      js: `import { createStepper } from "satin-ui/components";

// <div class="sn-stepper" data-stepper data-min="1" data-max="60" data-value="4">…</div>
// 按住连发（400ms 起、越来越快，最快 50ms 一次）；在数字上左右拖每 8px 一格；方向键一格、Shift 十格
const dur = createStepper(document.querySelector("[data-stepper]"), {
  onChange: (v) => console.log("时长", v),
});
dur.set(10);
dur.value; // 10

// 不写标记也行：createStepper(空容器, { value: 4, min: 1, max: 60, unit: "秒", label: "镜头时长" }) 按选项渲染`,
    },
  },
  prompt: {
    0: {
      js: `import { createComposer, toast } from "satin-ui/components";

// 提示词输入框：自动长高、字数、附件（拖进来、粘贴截图、附件菜单）；有文字或附件、附件传完才能发
let timer = 0;
createComposer(document.querySelector("[data-composer]"), {
  // 发送：返回 Promise，期间是"生成中"、发送键变成停止；Promise 结束回到可发送（换成你的生成请求）
  onSend: ({ text }) => new Promise((done) => { timer = setTimeout(() => { done(); toast({ text: \`已生成 3 个镜头：\${text.slice(0, 12)}…\` }); }, 2600); }),
  onStop: () => clearTimeout(timer),
  // 上传：报进度，结束就完成，出错就失败（点一下重试）；换成你的上传
  upload: (file, onProgress) => new Promise((ok) => { let p = 0; const iv = setInterval(() => { p = Math.min(1, p + 0.2); onProgress(p); if (p >= 1) { clearInterval(iv); ok(); } }, 220); }),
});`,
    },
  },
  otp: {
    0: {
      js: `import { createOtp, toast } from "satin-ui/components";

// 自动跳格、退格回上一格、粘贴自动分配；填进去的数字从下面淡入
const otp = createOtp(document.querySelector("[data-otp]"), {
  onComplete: (code) => { // 6 位都填满时调：换成你的校验请求
    toast({ text: \`已提交验证码 \${code}\` });
    setTimeout(() => otp.clear(), 1200); // 清空、焦点回第一格
  },
});`,
    },
  },
  toast: {
    0: {
      js: `import { initSeg } from "satin-ui";
import { toast, setToastPos } from "satin-ui/components";

// 不用写标记：第一次调 toast() 时在 body 末尾建一个 .sn-toasts 容器。这里四个按钮各演示一种
const exportToast = (name) => {
  const t = toast({ kind: "progress", text: \`正在导出 \${name}\` }); let p = 0;
  const iv = setInterval(() => { // 换成你的导出进度
    p = Math.min(1, p + 0.06 + Math.random() * 0.05); t.update({ progress: p });
    if (p >= 1) { clearInterval(iv); setTimeout(() => t.update({ kind: "status", text: '已导出到"下载"', action: { label: "打开", run: (x) => x.close() }, duration: 5000, done: true }), 260); }
  }, 200);
};
const DEMO = {
  status: () => toast({ text: "链接已复制" }), // 对勾 + 一句话，3 秒后自己收起
  action: () => toast({ kind: "action", text: '已归档"雨夜车站"', action: { label: "撤销", run: (t) => t.update({ kind: "status", text: '已恢复"雨夜车站"', done: true, duration: 2000 }) } }), // 倒计时环 + 按钮
  progress: () => exportToast("第三集.mp4"), // 进度环 + 百分比，直到 update 成结果
  fail: () => toast({ icon: "circle-x", tone: "danger", text: "复制失败，请再试一次", alert: true }), // 读屏立即播报
};
for (const [kind, show] of Object.entries(DEMO)) document.querySelector(\`[data-toast="\${kind}"]\`)?.addEventListener("click", show);
// 位置：后台放顶部居中（默认），客户端放底部居中
const pos = document.querySelector('[data-seg="toastpos"]');
if (pos) initSeg(pos, (v) => setToastPos(v));`,
    },
  },
  notify: {
    0: {
      js: `import { notify, toast } from "satin-ui/components";

// 卡片在右上角叠起来：后面的底边露出 12px、最多 3 层；指针移上去展开成列表；可以一键全部清除
// 每次点"来一条通知"按顺序来一条（tone："ok" 成功 | "bad" 失败 | "warn" 提醒；不写就是中性）
const NOTES = [
  () => notify({ icon: "circle-check", tone: "ok", title: "第三集生成完成", body: "12 个镜头都生成好了，可以开始剪辑。", actions: [{ label: "查看", variant: "secondary", run: (card) => { toast({ text: "打开第三集" }); card.close(); } }] }),
  () => notify({ icon: "circle-x", tone: "bad", title: "镜头 11 没有生成", body: "画面描述里有不允许的内容，改一下再试。" }),
  () => notify({ icon: "user-plus", title: "周屿加入了项目", body: "可以编辑分镜和配音。" }),
];
let i = 0;
for (const b of document.querySelectorAll("[data-notify]")) b.addEventListener("click", () => NOTES[i++ % NOTES.length]());
// 每来一条都会在 document 上发 notify 事件，铃铛这类地方可以跟着记未读：document.addEventListener("notify", (e) => …)`,
    },
  },
  banner: {
    0: {
      js: `import { busy } from "satin-ui/components";

// 横幅里的 [data-dismiss]：enhance() 已经接上——点了给 .sn-banner-wrap 加 .sn-closing，高度过渡收起，下面的内容跟着上来

// 网络断了：点"重新连接"，等待结束后原地变成成功，过一会儿自己收起
const net = document.querySelector("[data-retry-net]");
net.addEventListener("click", async () => {
  const banner = net.closest(".sn-banner");
  await busy(net, 1000); // 换成你的重连请求（Promise）
  banner.classList.replace("sn-bad", "sn-ok"); banner.setAttribute("role", "status");
  banner.querySelector(".sn-msg").innerHTML = "<b>已重新连接</b>，改动都同步好了。";
  net.remove();
  setTimeout(() => banner.parentElement.classList.add("sn-closing"), 1600);
});

// 条目上的失败：点"修改后重新生成"，成功后整行恢复正常
const fix = document.querySelector("[data-fix]");
fix?.addEventListener("click", async () => {
  const row = fix.closest(".sn-shot-row");
  await busy(fix, 1100); // 换成你的重新生成请求
  row.classList.remove("sn-failed");
  fix.parentElement.classList.add("sn-off");
});`,
    },
  },
  loading: {
    0: {
      js: `import { loadWithSkeleton } from "satin-ui/components";

// 300ms 内回来就不显示骨架（不闪）；显示了就至少留 500ms；数据到了逐行替换，每行淡入
const list = document.querySelector(".sn-sk-list"), note = document.querySelector("#loadNote");
const SHOTS = [["07", "车站外，雨刚停", "远景 · 4 秒"], ["08", "林夏走进候车厅", "全景 · 6 秒"], ["09", "站台上的最后一班车", "中景 · 5 秒"], ["10", "车窗里的倒影", "特写 · 3 秒"]];
const skRow = '<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:46%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>';
const row = ([n, title, meta]) => \`<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta"><b>镜头 \${n} · \${title}</b><span>\${meta}</span></div></div>\`;
for (const btn of document.querySelectorAll("[data-load]")) btn.addEventListener("click", async () => {
  const ms = Number(btn.dataset.load);
  const r = await loadWithSkeleton(list, {
    load: () => new Promise((done) => setTimeout(() => done(SHOTS), ms)), // 换成你的请求，比如 fetch("/api/shots").then((res) => res.json())
    skeleton: skRow.repeat(SHOTS.length),
    render: (shots) => shots.map(row).join(""),
  });
  if (r) note.textContent = r.shown ? \`等了 \${r.waited}ms，骨架至少留了 500ms\` : \`\${ms}ms 就回来了，没有闪出骨架\`;
});`,
    },
  },
  progress: {
    0: {
      js: `import { reduced } from "satin-ui";
import { createProgressCard, toast } from "satin-ui/components";

// 进度卡：数量、进度条、剩余时间、可取消；完成时文字换掉，图标原地变对勾，出"打开文件夹"
const pc = document.querySelector("#pcard");
pc.querySelector(".sn-pc-acts").insertAdjacentHTML("beforeend", '<button class="sn-btn sn-secondary sn-sm sn-off" data-pc-open>打开文件夹</button>');
let timer = 0;
const card = createProgressCard(pc, {
  onCancel: () => { clearInterval(timer); card.cancel("已取消导出", "已导出的部分不会保留。"); },
  onOpen: () => toast({ icon: "folder-open", text: '这里会打开"下载"文件夹' }),
});
// 换成你的导出任务：这里每 260ms 走一点
function startExport(enter) {
  clearInterval(timer); let p = 0;
  card.start("正在导出 第三集.mp4", "准备中…", enter);
  timer = setInterval(() => {
    p = Math.min(1, p + 0.035 + Math.random() * 0.03);
    card.set(p, \`已完成 \${Math.round(p * 120)} / 120 个镜头 · 还剩约 \${Math.max(1, Math.ceil((1 - p) * 24))} 秒\`);
    if (p >= 1) { clearInterval(timer); setTimeout(() => card.finish("导出完成", '第三集.mp4 · 1.2 GB · 已保存到"下载"'), 240); }
  }, 260);
}
document.querySelector("[data-pc-start]").addEventListener("click", () => startExport(true));
startExport(false);

// AI 生成：先亮步骤；拆完镜头就按最终文字留好位置，再一段段淡入
const PARAS = ["远景。夜里的车站广场积着水，路灯倒映在水面上，镜头从高处慢慢推近站门。", "全景。林夏收起伞走进候车厅，暖黄的灯光，人不多，广播在报晚点。",
  "中景。站台尽头，最后一班车进站，车灯穿过雨幕，照亮她的侧脸，她没有上车。"];
const ai = document.querySelector("#aigen"), steps = [...ai.querySelectorAll(".sn-ai-steps li")], out = ai.querySelector(".sn-ai-out"), run = ai.querySelector("[data-ai-run]");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let runId = 0;
run.addEventListener("click", async () => {
  const id = ++runId; run.setAttribute("aria-disabled", "true"); run.classList.add("sn-is-disabled");
  steps.forEach((s) => s.classList.remove("sn-run", "sn-done")); out.innerHTML = "";
  steps[0].classList.add("sn-run"); await wait(700); if (id !== runId) return; steps[0].classList.replace("sn-run", "sn-done");
  steps[1].classList.add("sn-run"); await wait(800); if (id !== runId) return;
  out.innerHTML = PARAS.map((t, i) => \`<div class="sn-para"><span class="sn-no">镜头 \${i + 1}</span><div class="sn-body"><div class="sn-txt">\${t}</div><div class="sn-ph"><span class="sn-sk" style="width:100%"></span><span class="sn-sk" style="width:\${[62, 48, 70][i]}%"></span></div></div></div>\`).join("");
  if (!reduced()) out.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: "cubic-bezier(.32,.72,0,1)" });
  steps[1].classList.replace("sn-run", "sn-done"); steps[2].classList.add("sn-run");
  for (const para of out.querySelectorAll(".sn-para")) { await wait(650); if (id !== runId) return; para.classList.add("sn-on"); }
  await wait(300); steps[2].classList.replace("sn-run", "sn-done");
  run.removeAttribute("aria-disabled"); run.classList.remove("sn-is-disabled"); run.lastChild.textContent = "重新生成";
});`,
    },
  },
  collapse: {
    0: {
      js: `import { createCollapse, bindCollapses } from "satin-ui/components";

// 点条目标题展开 / 收起（高度过渡）；single：同时只开一项
const faq = createCollapse(document.querySelector(".sn-acc"), {
  single: true,
  onToggle: ({ open }) => console.log(open ? "展开" : "收起"),
});
faq.open(0);

// 或者把页面上所有 .sn-acc 一次接上
bindCollapses(document);

// 不写标记也行：createCollapse(空容器, { items: [{ title, content }], open: [0] }) 按选项渲染`,
    },
  },
  card: {
    0: {
      js: `import { injectIcons } from "satin-ui";
import { openMenu, toast } from "satin-ui/components";

// 卡片本身是标记：封面、标题、元信息；左上角的勾选框多选，右上角"更多"弹菜单
const cards = document.querySelector("#pcards");
const menu = document.createElement("div"); // 菜单也可以直接写在标记里
menu.className = "sn-menu sn-float"; menu.setAttribute("role", "menu");
menu.innerHTML = '<div class="sn-item" data-i="pencil:before">重命名</div><div class="sn-item" data-i="copy:before">复制一份</div><div class="sn-sep"></div><div class="sn-item sn-danger-item" data-i="trash-2:before">移到回收站</div>';
injectIcons(menu); cards.after(menu);
menu.addEventListener("menuselect", (e) => toast({ text: e.detail.label }));

cards.addEventListener("change", (e) => e.target.closest(".sn-pc")?.classList.toggle("sn-sel", e.target.checked));
cards.addEventListener("click", (e) => {
  const more = e.target.closest("[data-card-more]");
  if (more) { e.stopPropagation(); openMenu(menu, { trigger: more, anchor: more, align: "end" }); return; }
  if (e.target.closest(".sn-pick")) return;
  const card = e.target.closest(".sn-pc"); if (card) toast({ icon: "info", text: \`这里会打开"\${card.getAttribute("aria-label")}"\` });
});`,
    },
  },
  image: {
    0: {
      js: `import { openLightbox } from "satin-ui/lightbox";

// 缩略图：加载中显示骨架，加载好淡入（.sn-loaded），失败显示重试（.sn-failed）。这里用定时器模拟加载，第 4 张模拟失败
const grid = document.querySelector("#imgGrid");
const ims = () => [...grid.querySelectorAll(".sn-im")];
function load() {
  ims().forEach((im, i) => { im.classList.remove("sn-loaded", "sn-failed"); setTimeout(() => im.classList.add(i === 3 ? "sn-failed" : "sn-loaded"), 400 + i * 260 + Math.random() * 300); });
}
load();
document.querySelector("[data-img-reload]").addEventListener("click", load);

// 点开：从缩略图那里放大到铺满窗口，关上时缩回去；能放大缩小、拖动、旋转、还原，← → 翻页、Esc 关闭
// 每一项：src（图片地址）+ size（原图宽高）；这里的缩略图是 CSS 背景，就传 bg + ratio
const RATIO = new Map([["16:9", 16 / 9], ["1:1", 1], ["4:3", 4 / 3], ["9:16", 9 / 16]]);
const items = () => ims().map((im) => ({ bg: getComputedStyle(im).getPropertyValue("--sn-g") || im.style.getPropertyValue("--sn-g"), ratio: RATIO.get(im.querySelector(".sn-tag-ratio")?.textContent.trim()) || 16 / 9 }));
const thumbOf = (i) => grid.querySelector(\`.sn-im[data-n="\${i}"]\`), enabled = (i) => thumbOf(i)?.classList.contains("sn-loaded");
grid.addEventListener("click", (e) => {
  const retry = e.target.closest("[data-img-retry]"), im = e.target.closest(".sn-im");
  if (retry) { im.classList.remove("sn-failed"); setTimeout(() => im.classList.add("sn-loaded"), 700); return; } // 换成真的重新请求
  if (im?.classList.contains("sn-loaded")) openLightbox(items(), Number(im.dataset.n), { thumbOf, enabled });
});
grid.addEventListener("keydown", (e) => { const im = e.target.closest(".sn-im"); if (im && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); im.click(); } });`,
    },
  },
  media: {
    0: {
      js: `import { toast } from "satin-ui/components";
import { createPlayer, createAudio } from "satin-ui/components";

// 视频：缓冲转圈、拖动进度、音量、画中画、全屏、键盘；不动时控件自己藏起来。在写好的播放器标记上接交互（也可以给空容器按选项渲染）
createPlayer(document.querySelector("#player"), { onError: () => toast({ icon: "circle-x", tone: "danger", text: "视频没能加载，检查网络后再试", alert: true }) });

// 音频：波形从音频本身算出来（拿不到就画平线，不编造）；同一时间只放一个
createAudio(document.querySelector("#audio"), { onError: () => toast({ icon: "circle-x", tone: "danger", text: "音频没能加载，检查网络后再试", alert: true }) });
// 列表里加一行：先插标记（createAudio.html({ src, title, sub }) 生成），再在这行标记上 createAudio(那一行)`,
    },
  },
  upload: {
    0: {
      js: `import { createUpload } from "satin-ui/components";

// 点了选文件、拖进来；每个文件一行：进度、失败可重试、取消 / 移除。上传函数换成你的（报进度，结束 resolve，出错 reject）
const fakeUpload = (file, onProgress) => new Promise((ok, fail) => {
  let p = 0; const bad = /失败/.test(file.name);
  const iv = setInterval(() => { p = Math.min(1, p + 0.08 + Math.random() * 0.08); onProgress(p); if (bad && p > 0.6) { clearInterval(iv); fail(new Error("网络断了")); } else if (p >= 1) { clearInterval(iv); ok(); } }, 180);
});
createUpload(document.querySelector("#drop"), {
  list: document.querySelector("#files"),
  accept: /\\.(txt|docx|epub)$/i, maxSize: 50 * 1024 * 1024,
  upload: fakeUpload,
});`,
    },
  },
  sidebar: {
    0: {
      js: `import { toast } from "satin-ui/components";

// 侧栏布局 enhance() 已经接上：选中的底色 / 指示条在条目之间滑动（.sn-app 上 data-navfx="slide | bar | fade | text"）；
// [data-collapse] 收起 / 展开（⌘\\ 也行），主区宽度连续变，卡片按新列数从原位置滑过去；窄于 720 自动收成图标栏（data-collapse-below 可改）
// 点导航：换成你的路由跳转
document.querySelector(".sn-side-nav").addEventListener("click", (e) => {
  const a = e.target.closest("a[href]"); if (!a) return;
  e.preventDefault(); toast({ text: \`打开"\${a.textContent.trim()}"\` });
});
// 自己创建也行：createSidebar(元素, { collapseBelow: 720, onNavigate(a) {} })，返回 { toggle(), select(a) }`,
    },
  },
  tabs: {
    0: {
      js: `import { createTabs, createPager, setStep } from "satin-ui/components";

// 标签页：下划线前缘先走、后缘跟上；新内容从所选标签那一侧滑进来；← → 切换
createTabs(document.querySelector(".sn-tabs"), { onChange: (i) => console.log("切到第", i + 1, "个标签") });

// 分页：当前页的底色滑到新页码；页码多时中间用省略（onChange 里换成你的取数）
createPager(document.querySelector(".sn-pager"), { total: 13, onChange: (p) => console.log("第", p, "页") });

// 步骤：第 i 步是当前，前面的都完成
const steps = document.querySelector(".sn-steps"), max = steps.querySelectorAll(".sn-st").length - 1;
let cur = 1;
for (const b of document.querySelectorAll("[data-step]")) b.addEventListener("click", () => { cur = Math.max(0, Math.min(max, cur + Number(b.dataset.step))); setStep(steps, cur); });`,
    },
  },
  reorder: {
    0: {
      html: `<div class="sn-drag-list">
  <div class="sn-drag-row"><button class="sn-grip" aria-label="拖动排序：镜头 07" data-i="grip-vertical"></button><b>镜头 07 · 车站外</b></div>
  <div class="sn-drag-row"><button class="sn-grip" aria-label="拖动排序：镜头 08" data-i="grip-vertical"></button><b>镜头 08 · 候车厅</b></div>
</div>`,
      js: `import { createReorder, toast } from "satin-ui/components";

// 按住 .sn-grip 拖（先动 4px 才算拿起）；其他行让位、落点画线；拿出列表 40px 外松手就取消；
// 键盘：空格拿起、↑↓ 移动、空格放下、Esc 取消（读屏会播报位置）
const list = document.querySelector(".sn-drag-list");
createReorder(list, {
  onReorder: ({ from, to }) => toast({ text: \`已从第 \${from + 1} 位移到第 \${to + 1} 位\` }), // 换成你的保存
});`,
    },
  },
  addremove: {
    0: {
      js: `import { injectIcons } from "satin-ui";
import { insertWithFlip, removeWithFlip, toast } from "satin-ui/components";

// 新增：从下面淡入，别的标签让位；删除：先脱离布局淡出，剩下的用弹簧补位，给撤销
const box = document.querySelector("#chipsBox"), input = document.querySelector("#addTag");
const chipOf = (text) => {
  const chip = document.createElement("span"); chip.className = "sn-chip sn-tag sn-on";
  chip.innerHTML = \`\${text}<button class="sn-x" aria-label="移除 \${text}" data-i="x"></button>\`;
  injectIcons(chip); return chip;
};
const add = (text, index) => insertWithFlip(box, chipOf(text), box.querySelectorAll(".sn-chip")[index ?? 1e9] || null);
const submit = () => { const v = input.value.trim(); if (!v) return; add(v); input.value = ""; };
input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
document.querySelector("[data-add-tag]").addEventListener("click", submit);

box.addEventListener("click", (e) => {
  const x = e.target.closest(".sn-x"); if (!x) return;
  const chip = x.closest(".sn-chip"), text = chip.firstChild.textContent.trim(), index = [...box.querySelectorAll(".sn-chip")].indexOf(chip);
  removeWithFlip(chip);
  toast({ kind: "action", text: \`已移除标签"\${text}"\`, action: { label: "撤销", run: (t) => { add(text, index); t.update({ kind: "status", text: \`已恢复"\${text}"\`, done: true, duration: 2000 }); } } });
});`,
    },
  },
  optimistic: {
    0: {
      js: `import { optimistic, createNumberFlow, toast } from "satin-ui/components";

// 先显示结果再保存；失败时恢复、整行抖两下、出一条带"重试"的提示（勾上"模拟保存失败"看失败的样子）
const row = document.querySelector(".sn-opt-row"), star = document.querySelector("[data-star]");
const nameEl = document.querySelector("[data-rename]"), failBox = document.querySelector("#optFail");
let count = 24;
const num = createNumberFlow(star.querySelector(".sn-n"), { value: count, style: "blur" });
// 保存：换成你的接口。这里 700ms 后成功，勾上"模拟保存失败"时失败
const save = () => new Promise((ok, fail) => setTimeout(() => (failBox.checked ? fail(new Error("保存失败")) : ok()), 700));

star.addEventListener("click", () => {
  const on = !star.classList.contains("sn-on");
  const show = (v) => { star.classList.toggle("sn-on", v); star.setAttribute("aria-pressed", String(v)); count += v ? 1 : -1; num.update({ value: count }); };
  optimistic({ shake: row, apply: () => show(on), revert: () => show(!on), save });
});

// 改名：双击或按回车进入编辑；回车保存、Esc 放弃，同样先显示再保存
function rename() {
  const old = nameEl.textContent.trim(), inp = document.createElement("input");
  inp.className = "sn-input sn-sm"; inp.value = old; nameEl.replaceChildren(inp); inp.focus(); inp.select();
  let done = false;
  const commit = (keep) => {
    if (done) return; done = true; const v = inp.value.trim() || old;
    if (!keep || v === old) { nameEl.textContent = old; return; }
    optimistic({ shake: row, apply: () => (nameEl.textContent = v), revert: () => (nameEl.textContent = old), save })
      .then(() => toast({ text: \`已改名为"\${v}"\` }), () => {});
  };
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(true); if (e.key === "Escape") { e.stopPropagation(); commit(false); } });
  inp.addEventListener("blur", () => commit(true));
}
nameEl.addEventListener("dblclick", rename);
nameEl.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target === nameEl) rename(); });`,
    },
  },
  numflow: {
    0: {
      js: `import { createNumberFlow } from "satin-ui/components";

// 只滚动变了的那几位；style："roll"（滚动，默认）| "blur"（滚动带模糊）| "push"（推入）| "fade"（淡入）；format 决定怎么显示
const nf = (name, opts) => createNumberFlow(document.querySelector(\`[data-nf="\${name}"]\`), opts);
const shots = nf("shots", { value: 1284, format: (v) => v.toLocaleString("zh-CN") });
const price = nf("price", { value: 199, format: (v) => "¥ " + v.toLocaleString("zh-CN", { minimumFractionDigits: 2 }) });
const live = nf("live", { value: 2875, format: (v) => \`\${Math.floor(v / 60)} 小时 \${String(v % 60).padStart(2, "0")} 分\` });
const badge = nf("badge", { value: 3, style: "fade", format: (v) => (v > 99 ? "99+" : String(v)) });

// set(新值) 滚到新值；value 是当前值
for (const btn of document.querySelectorAll("[data-nf-add]")) btn.addEventListener("click", () => {
  const k = btn.dataset.nfAdd;
  shots.set(Math.max(0, k === "rand" ? Math.round(Math.random() * 120000) : shots.value + Number(k)));
});
const PLANS = [199, 2399, 49.9, 12800, 999];
document.querySelector("[data-nf-plan]").addEventListener("click", () => price.set(PLANS[(PLANS.indexOf(price.value) + 1) % PLANS.length]));
document.querySelector("[data-nf-badge]").addEventListener("click", () => badge.set(badge.value >= 120 ? 3 : badge.value + 9));
setInterval(() => live.set(live.value + 1), 1200); // 每 1.2 秒自动更新`,
    },
  },
  chat: {
    0: {
      js: `import { createChat } from "satin-ui/chat";

// 已有设计稿里的 .sn-chat 标记直接传（空容器也行：顶栏、消息区、底部输入框都由 createChat 填好、接好）
// 接模型：异步生成器，一段一段地给——{ think } 是思考，字符串是正文；先进缓冲、匀速放出来。这里用写好的一段话模拟
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
createChat(document.querySelector("#chatBox"), {
  respond: async function* (question, state) {
    for (const piece of ["先看这一场的节奏：", "雨夜、车站、", "等最后一班车的人。"]) { if (state.stopped) return; yield { think: piece }; await wait(120); }
    const text = "这一场可以拆成三个镜头：远景站台、林夏的中景、车灯穿过雨幕的特写。";
    for (const ch of text) { if (state.stopped) return; yield ch; await wait(16); } // 换成你的模型流式输出
  },
});`,
    },
  },
  vlist: {
    0: {
      js: `import { createInfiniteList } from "satin-ui/components";

// 行高固定：只画看得见的几十行，一万条照样流畅；滚到离底部 400px 自动要下一页（勾上"模拟加载失败"看失败后的重试）
const vl = document.querySelector("#vl"), countEl = document.querySelector("#vlCount"), topBtn = document.querySelector("[data-vl-top]"), failBox = document.querySelector("#vlFail");
const wait = (ms) => new Promise((r) => setTimeout(r, ms)), TOTAL = 10000;
const list = createInfiniteList(vl, {
  total: TOTAL, pageSize: 400, rowHeight: 56,
  // 换成你的接口：返回这一页的数据数组
  loadPage: async (offset, size) => { await wait(offset === 0 ? 200 : 500 + Math.random() * 700); if (failBox.checked && offset > 0) throw new Error("加载失败"); return Array.from({ length: size }, (_, k) => offset + k); },
  // 行元素会复用：子元素缓存在 el._d 上，每次只改文字
  renderRow: (el, i) => {
    if (!el._d) { el.innerHTML = '<span class="sn-th"></span><span class="sn-tx"><b></b><span></span></span><span class="sn-no"></span>'; el._d = { b: el.querySelector("b"), m: el.querySelector(".sn-tx span"), no: el.children[2] }; }
    el._d.b.textContent = \`镜头 \${i + 1}\`; el._d.m.textContent = \`第 \${Math.floor(i / 40) + 1} 集 · \${3 + (i % 6)} 秒\`; el._d.no.textContent = String(i + 1);
  },
  // 已加载的条数变了调（参数只有这一个；总数就是上面给的 total）
  onCount: (n) => { countEl.textContent = n >= TOTAL ? \`已全部加载 · \${n.toLocaleString("zh-CN")} 条\` : \`已加载 \${n.toLocaleString("zh-CN")} 条 · 共 \${TOTAL.toLocaleString("zh-CN")} 条\`; },
});
vl.addEventListener("vlscroll", (e) => topBtn.classList.toggle("sn-on", e.detail.top > vl.clientHeight));
topBtn.addEventListener("click", () => list.scrollTop());`,
    },
  },
  flow: {
    0: {
      js: `import { createFlow } from "satin-ui/flow";
import "satin-ui/css/content.css";

// 设计稿里的 .sn-flow 标记直接传（空容器也行：画布、工具条、小地图都由 createFlow 填好）；卸载时调 flow.destroy()
const flow = createFlow(document.querySelector(".sn-flow"), {
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
      html: `<div id="grid"></div>`,
      js: `import { createDataGrid } from "satin-ui/grid";
import "satin-ui/css/grid.css";
import "satin-ui/css/data.css";

const STATUS = ["待开始", "生成中", "审核中", "已完成", "已暂停"];
const OWNERS = ["林夏", "周屿", "沈一", "许棠", "陈默", "顾北"];
const TAGS = ["电影感", "动画", "纪录", "广告", "MV", "短剧"];
const SCENES = ["雨夜车站", "候车厅", "站台", "列车上", "终点站", "海边", "旧城区", "天台"];

// 列：key 取行里的哪个字段；type 选内置的显示；pinned 固定在左 / 右；sortable 点表头排序；filter 列头筛选；editable 双击编辑
const columns = [
  { key: "sel", type: "sel", width: 64, pinned: "left" },
  { key: "name", title: "名称", width: 200, pinned: "left", primary: true, sortable: true, editable: true },
  { key: "status", title: "状态", type: "status", width: 116, options: STATUS, sortable: true, filter: "enum", editable: true },
  { key: "owner", title: "负责人", type: "owner", width: 124, options: OWNERS, sortable: true, filter: "enum" },
  { key: "tag", title: "类型", type: "tag", width: 100, options: TAGS, filter: "enum" },
  { key: "shots", title: "镜头", type: "int", width: 88, sortable: true, editable: true, min: 1, max: 999 },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true, filter: "range" },
  { key: "prog", title: "进度", type: "prog", width: 148, sortable: true },
  { key: "act", type: "act", width: 80, pinned: "right" },
];

// 假的服务端：十万行，按搜索词、列头筛选、排序算好，切出 [start, end) 这一段（真的项目里换成 fetch）
const all = Array.from({ length: 100000 }, (_, i) => {
  const h = Math.imul(i + 1, 2654435761) >>> 0, s = h % 5; // 按行号算出看起来随机的值
  return { id: i + 1, name: \`\${SCENES[i % 8]} \${i + 1}\`, status: STATUS[s], owner: OWNERS[(h >>> 4) % 6], tag: TAGS[(h >>> 8) % 6],
    shots: 4 + ((h >>> 12) % 120), dur: 15 + ((h >>> 16) % 1800), prog: s === 3 ? 100 : s === 0 ? 0 : 1 + ((h >>> 20) % 98) };
});
let last = "", found = all;
function query({ sort, filter }) {
  const key = JSON.stringify([sort, filter]);
  if (key === last) return found;
  last = key;
  const q = filter.q?.trim();
  found = all.filter((r) => (!q || r.name.includes(q)) && Object.entries(filter).every(([k, v]) =>
    k === "q" || v == null || (Array.isArray(v) ? !v.length || v.includes(r[k]) : (v.min == null || r[k] >= v.min) && (v.max == null || r[k] <= v.max))));
  if (sort) found.sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) * sort.dir);
  return found;
}

// 空容器：工具条、表头、表体都由 createDataGrid 填好。表格按块要（一块 100 行），滚到哪要到哪，还没到的行显示占位条
const grid = createDataGrid(document.querySelector("#grid"), {
  columns, rowKey: "id", label: "项目列表，十万行",
  dataSource: {
    total: all.length,
    async load({ start, end, sort, filter }) {
      await new Promise((r) => setTimeout(r, 200)); // 模拟网络
      const rows = query({ sort, filter });
      return { rows: rows.slice(start, end), total: rows.length };
    },
  },
  onCellEdit: ({ rowKey, key, value }) => { all[rowKey - 1][key] = value; }, // 存到服务端
  onRowAction: ({ action, row }) => console.log(action, row.name), // 行末的"更多"
});
// 卸载时调 grid.destroy()`,
    },
  },
  cgrid: {
    0: {
      html: `<div id="grid"></div>`,
      js: `import { createCanvasGrid } from "satin-ui/canvas-grid";
import "satin-ui/css/grid.css";
import "satin-ui/css/data.css";

const STATUS = ["待开始", "生成中", "审核中", "已完成", "已暂停"];
const SCENES = ["雨夜车站", "候车厅", "站台", "列车上", "终点站", "海边", "旧城区", "天台"];
// 第 i 行：假的服务端按行号算出来（真的项目里换成 fetch，按 start、end 返回这一段）
const rowAt = (i) => {
  const h = Math.imul(i + 1, 2654435761) >>> 0; // 按行号算出看起来随机的值
  return { id: i + 1, name: \`\${SCENES[i % 8]} \${i + 1}\`, status: STATUS[h % 5], shots: 4 + ((h >>> 12) % 120), dur: 15 + ((h >>> 16) % 1800), prog: (h >>> 20) % 101 };
};

const columns = [
  { key: "name", title: "名称", width: 200, primary: true },
  { key: "status", title: "状态", type: "status", width: 116, options: STATUS },
  { key: "shots", title: "镜头", type: "int", width: 88 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
  { key: "prog", title: "进度", type: "prog", width: 148 },
];

// 整张表画在一块画布上：一百万行在服务端，按块要（一块 200 行），滚到哪要到哪，还没到的行画占位条。
// 这个假的服务端不会搜索、排序：不要工具条（toolbar: false），列也不写 sortable
const grid = createCanvasGrid(document.querySelector("#grid"), {
  columns, rowKey: "id", toolbar: false, label: "一百万个镜头",
  dataSource: {
    total: 1000000,
    async load({ start, end }) {
      await new Promise((r) => setTimeout(r, 200)); // 模拟网络
      return Array.from({ length: end - start }, (_, k) => rowAt(start + k));
    },
  },
});
// 卸载时调 grid.destroy()`,
    },
  },
  picker: {
    0: {
      js: `import { setup } from "satin-ui";
import { bindPickers } from "satin-ui/components";
import "satin-ui/css/picker.css";

setup(); // 页面级行为（Esc、点外面关上），整页调一次

// 写了 data-pk 的都接上：date（日期）| range（范围，两个月并排、快捷预设）| time（时、分两列）
//                       | datetime（定时发布：日历 + 时间）| region（省 / 市 / 区，可跨级搜索）
bindPickers(document);

document.addEventListener("pick", (e) => {
  console.log(e.target.dataset.pk, e.detail.text); // 比如 "date"、"11 月 21 日 星期六"
});`,
    },
  },
  table: {
    // 8（完整示例）的写法以契约示例为准（table-basic … table-drag），这里不另外写、也不单独生成（usage.js 的 skipDemos）
    // 固定表头、限高滚动：表头吸附，内容在框里滚，滚动条换成组件库的
    5: {
      js: `import { createScrollArea } from "satin-ui/components";
import "satin-ui/css/data.css";
import "satin-ui/css/scroll.css";

// .sn-tbl-sc 限高（--sn-tbl-max）以后在框里滚；表头 position: sticky 吸在顶上
// 不加边缘渐隐（fade: "none"），免得表头被淡掉；表格不回弹：滚到头就停住，再滚一次交给页面
createScrollArea(document.querySelector(".sn-tbl-sc"), { fade: "none" });`,
    },
  },
};

// 参数：组件页"参数"一节（选项、返回值、CSS 变量……），每张表 [标题, 表头, 行]
// 有交互的组件都是 createXxx(元素, 选项)（satin-ui/components）：元素是空的就按选项渲染，已经有标记就在上面接交互；
// 返回的实例都有 update(选项)、destroy()、on(事件, 回调) / off，事件同时在根元素上冒泡成 sn-事件名（sn-change……）
export const API = {
  md: [
    ["renderMarkdown(容器, 文本, 选项)（satin-ui/markdown）", ["选项", "说明"], [
      ["codeMax", "代码块超过多高折叠（px），0 = 不折叠；单个代码块写 maxh=120"],
      ["imgH", '块级图片统一高度（px），"auto" = 原比例；单张写 =x160、=320x、=16:9'],
      ["tableMax", "表格最高（px），超出在框里滚，0 = 不限"],
      ["返回", "{ el, update(文本)（整篇重渲染，滚动位置不跳）, set(选项)（只改样式）, options }"],
    ]],
    ["表现", ["内容", "说明"], [
      ["图片", "加载中微光占位，失败给图标和说明；块级图片点开用看图组件——图从原位置长到铺满窗口，整篇文档里加载好的图左右翻，能放大缩小、旋转、还原"],
      ["表格", "表头吸顶；限高后在框里滚，滚到头就停住、不回弹，再滚一次交给页面"],
      ["视频、音频", "图片写法里地址是视频 / 音频，就渲染成播放器 / 音频条"],
      ["安全", "原文里的 HTML 只放行白名单里的标签和属性，script、style、iframe 连内容一起去掉；链接、图片地址只放行相对地址、http(s)、mailto 和图片的 data:image，其余（javascript: 这类，协议中间夹 Tab / 换行也算）换成 #"],
    ]],
  ],
  chat: [
    ["createChat(空容器或 .sn-chat, 选项)（satin-ui/chat）", ["选项", "说明"], [
      ["title / status / placeholder / max / maxLines / attach", "空容器时用来渲染顶栏和底部输入框；update({ status }) 改顶栏状态"],
      ["composer", "{ upload, attachments }：底部输入框的选项（上传函数、预置附件）"],
      ["respond", "(问题, { stopped }) => 异步生成器 / Promise<字符串>：yield { think } 是思考，yield 字符串是正文；还能给 { step }、{ card }、{ image } 这些"],
      ["history", "{ initial() → 条目数组, older() → 更早的一页（可以是 Promise）, hasMore() }：带历史，往上滚加载更早的；不给就从空的对话开始"],
      ["hiRes", "(背景) => 背景：点开看大图时用的高清背景（默认原样）"],
      ["返回", "{ send(text)（程序里发一条，和输入框发送一样）, receive(条目), sendText(text, { fail }), scrollToOldest(), update, destroy(), on, off }；destroy 停掉生成中的回答、撤掉监听、清空容器。旧写法 mountChat(元素, 选项) 仍然可用"],
    ]],
    ["消息里的图片、视频", ["写法", "说明"], [
      ['{ type: "image", g: CSS 背景 }', "图片气泡；点开用看图组件（satin-ui/lightbox），能放大缩小、旋转，列表里渲染着的图片、视频按顺序左右翻"],
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
    ["createInfiniteList(容器, 选项)", ["选项", "说明"], [
      ["loadPage", "(offset, size) => Promise<数组>：要一页；失败（reject）末尾出“重试”"],
      ["renderRow", "(行元素, 数据, 下标)：画一行；行元素复用，子元素缓存在 el._d 上（换成骨架行时会清掉）"],
      ["rowHeight / total / pageSize", "行高（固定）/ 总数 / 每页几条"],
      ["onCount", "(已加载) => {}；同时在容器上冒泡 sn-count"],
      ["返回", "实例：reload()、scrollTop()、count，以及 update / destroy / on"],
    ]],
  ],
  flow: [
    ["createFlow(空容器或 .sn-flow, 选项)（satin-ui/flow）；旧写法 mountFlow 仍可用", ["选项", "说明"], [
      ["nodes", "[{ id, x, y, t（标题）, ic（图标）, d（说明）, k（类型）}]"],
      ["edges", "[[从, 到]]"],
      ["返回", "{ nodes, edges }"],
    ]],
    ["标记", ["写法", "说明"], [[".sn-flow > .sn-flow-world > svg.sn-flow-edges + .flow-nodes", "画布：节点用 HTML、连线用 SVG，同一层平移缩放"], ["[data-fz]、[data-flow-run]、.sn-flow-mini", "缩放按钮、运行、小地图（可选）"]]],
  ],
  grid: [
    ["createDataGrid(空容器或 .sn-grid, 选项)（satin-ui/grid；React / Vue 用 satin-ui/react/grid、satin-ui/vue/grid 的 DataGrid）", ["选项", "说明"], [
      ["columns（必填）", "列定义：key 取行里的哪个字段；type 选内置的显示（text / int / dur / money / time / status / owner / tag / prog / sel / act）；sortable、filter（enum / range）、editable、pinned、width……，完整字段见组件页“列定义”"],
      ["data / dataSource", "数组（筛选、排序在页面里算；行里带 children 能切树形）/ 服务端按块给：{ total, load({ start, end, sort, filter }) → 行数组或 { rows, total } }"],
      ["rowKey", "每行唯一的字段名或 (row) => key，默认 \"id\"；勾选、换数据时按它认行"],
      ["selection、selectedKeys / defaultSelectedKeys", "\"multiple\" / \"single\" / \"none\"；受控 / 一开始的勾选"],
      ["sort / defaultSort", "{ key, dir: 1 | -1 } | null，受控 / 一开始的排序"],
      ["rowDraggable、detail、treeCount、merges", "拖行；行详情；树形下级数量的文字；一开始合并的格子"],
      ["loading、error、emptyText、noMatchText", "加载中、出错（load 抛错自动进出错状态，“重试”发 retry）、没有数据、筛不到"],
      ["lines、height、label、toolbar", "行线 / 网格；表格框高度（默认 480）；读屏名；工具条（搜索框、计数）"],
      ["事件", "rowClick、sortChange、filterChange、selectionChange、columnResize、columnReorder、cellEdit、scrollEnd、rowAction、retry：写成选项 onXxx，或 grid.on(\"sortChange\", fn)"],
      ["返回", "{ update, destroy, on, off, sort, filter, selectedKeys, merge, reload, ready }；update({ data }) 换数据时滚动位置留着、勾选按 rowKey 带过去；destroy 撤掉监听、放进 <head> 的样式，清空容器"],
    ]],
  ],
  cgrid: [
    ["createCanvasGrid(空容器或 .sn-grid, 选项)（satin-ui/canvas-grid；React / Vue 用 satin-ui/react/canvas-grid、satin-ui/vue/canvas-grid 的 CanvasGrid）", ["选项", "说明"], [
      ["columns、data / dataSource、rowKey……", "和数据表格一样（列定义、数据、勾选、排序、事件、返回值都相同）；服务端按块给时一块 200 行"],
      ["detail", "行详情画在画布上：{ draw(ctx) }（DOM 版的 render、detail 函数在这里不能用）"],
    ]],
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
      ["icon / tone", 'Solar 图标名 / "ok" | "info" | "danger"', "状态类默认对勾"],
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
      ["icon / tone", 'Solar 图标名 / "ok" | "bad" | "warn" | ""'],
      ["title / body / time", "标题、正文（文件名不拆开）、时间（默认现在）"],
      ["actions", "[{ label, variant, run(card) }]：按钮；没写 run 就是关闭"],
    ]],
    ["返回值和其他", ["名称", "说明"], [["close()", "关掉这一条"], ["notify 事件", "每来一条在 document 上发，detail 是传进来的选项"], [".sn-notifs", "容器（没有就自己建），里面的 [data-clear-all] 全部清除"]]],
  ],
  banner: [
    ["标记", ["写法", "说明"], [
      [".sn-banner-wrap > .sn-banner.sn-warn | .sn-bad | .sn-ok", "横幅；颜色只表达状态"],
      ["[data-dismiss]", "关闭按钮：点了给 .sn-banner-wrap 加 .sn-closing（照“代码”里几行接上）"],
      [".sn-banner-wrap.sn-closing", "收起：高度过渡，下面的内容跟着上来"],
    ]],
  ],
  loading: [
    ["loadWithSkeleton(容器, 选项)", ["选项", "说明"], [
      ["load", "() => Promise：取数据"],
      ["skeleton", "骨架的 HTML（.sn-sk 是一条骨架）"],
      ["render", "(数据) => HTML"],
      ["stagger", "逐行替换的间隔（默认 40ms）"],
      ["返回", "Promise：{ shown（骨架出现过没有）, waited（等了多久）}"],
    ]],
  ],
  progress: [
    ["createProgressCard(.sn-pcard, 选项)", ["选项 / 方法", "说明"], [
      ["onCancel / onOpen", "点“取消” / “打开”时调；同时在卡片上冒泡 sn-cancel / sn-open"],
      ["start(标题, 副标题)", "开始：进度归零"],
      ["set(p, 副标题)", "进度 0 ~ 1"],
      ["finish(标题, 副标题)", "完成：文字模糊换掉，图标原地变对勾"],
      ["cancel(标题, 副标题)", "取消"],
    ]],
  ],
  numflow: [
    ["createNumberFlow(元素, 选项)", ["选项 / 方法", "说明"], [
      ["value", "初始值"],
      ["format", "(v) => 文字：千分位、单位……（默认中文千分位）"],
      ["style", '"roll" | "blur" | "push" | "fade"'],
      ["set(v, { instant })", "改值：只动变了的那几位"],
      ["value / update({ style })", "当前值 / 换样式"],
    ]],
  ],
  collapse: [
    ["createCollapse(.sn-acc, 选项)", ["选项 / 方法", "说明"], [
      ["items / open", "空容器按它渲染：[{ title, content 或 html }]、一开始展开第几项（[0]）；已有标记时不用给"],
      ["single", "同时只开一项"],
      ["onToggle", "({ index, open }) => {}；同时在容器上冒泡 sn-toggle"],
      ["open(i) / close(i)", "展开 / 收起第 i 项"],
      ["bindCollapses(root)", "接上 root 里所有 .sn-acc"],
    ]],
    ["标记", ["写法", "说明"], [[".sn-acc > .sn-acc-item(.sn-open) > .sn-acc-hd + .sn-acc-bd > div", "标题按钮 + 内容（内容外面多包一层，高度过渡不重排）"]]],
  ],
  image: [
    ["openLightbox(items, 第几张, 选项)（satin-ui/lightbox）", ["参数 / 选项", "说明"], [
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
    ["缩略图状态", ["写法", "说明"], [[".sn-im", "缩略图（--sn-g 是背景）"], [".sn-loaded / .sn-failed", "加载好（模糊淡入）/ 失败（显示重试）"]]],
  ],
  media: [
    ["视频", ["名称", "说明"], [
      ["createPlayer(容器, { src, poster, label, onError })", "空容器：按选项渲染播放器并接上；已有 .sn-player 标记：直接接上。实例上有 play()、pause()、toggle()、video"],
      ["createPlayer.html({ src, poster, label })", "只要播放器的标记（纯字符串，服务端渲染也能用）"],
    ]],
    ["音频", ["名称", "说明"], [
      ["createAudio(容器, { src, title, sub, wave, onError })", "同上；同一时间只放一个"],
      ["createAudio.html({ src, title, sub, wave })", "音频条的标记；wave：波形数据地址（Mixkit 的音乐自动找）"],
    ]],
  ],
  upload: [
    ["createUpload(拖放区, 选项)", ["选项", "说明"], [
      ["list", "文件行放在哪个元素里"],
      ["accept / badType", "允许的扩展名（正则）/ 不允许时的提示"],
      ["maxSize / tooBig", "最大字节数 / 超出时的提示"],
      ["upload", "(file, onProgress) => Promise：真上传；不给就是演示用的假进度"],
      ["返回 add(files)", "加文件（拖放、选择之外的来源）"],
    ]],
  ],
  sidebar: [
    ["createSidebar(.sn-app, 选项)", ["选项 / 方法", "说明"], [
      ["onNavigate", "(a) => {}：点了侧栏条目；同时冒泡 sn-navigate"],
      ["toggle()", "收起 / 展开（⌘\\ 也行）"],
      ["select(a)", "选中某一项"],
      ["setFx(v)", '选中样式："slide"（底色滑）| "bar"（指示条）| "fade" | "text"'],
    ]],
  ],
  tabs: [
    ["函数", ["名称", "说明"], [
      ["createTabs(.sn-tabs, { tabs, value, onChange(i) })", "空容器按 tabs（[{ label, badge, content 或 html }]）渲染；实例上有 select(i)、value"],
      ["createPager(.sn-pager, { total, page, count, onChange(p) })", "实例上有 go(p)、page"],
      ["stepsHTML({ steps, current })", "步骤条的标记"],
      ["setStep(.sn-steps, i)", "第 i 步是当前，前面的都完成"],
    ]],
  ],
  reorder: [
    ["createReorder(列表, 选项)", ["选项", "说明"], [
      ["onReorder", "({ from, to, row }) => {}：顺序变了（拖拽、键盘都算）；同时冒泡 sn-reorder"],
      ["row", '行的选择器（默认 ".sn-drag-row"）；拖的把手是行里的 .sn-grip'],
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
      [".sn-btn.sn-primary / sn-secondary / sn-tertiary / sn-ghost / sn-danger / sn-danger-soft", "6 种变体，由强到弱；每个区域只放一个主按钮"],
      [".sn-sm / （默认）/ .sn-lg", "高 28 / 32 / 40"],
      [".sn-ibtn", "只有图标的按钮（要写 data-tip 或 aria-label）"],
      ['data-i="图标名:before"', "图标在文字前；:after 在后；data-i 由 injectIcons 换成图标"],
      ['aria-disabled="true" + data-tip', "禁用：点了不响应，只把原因亮出来（不用 disabled，免得读屏跳过；要整页调过 setup()）"],
    ]],
    ["函数", ["名称", "说明"], [
      ["buttonHTML({ text, variant, size, icon, tip, disabled })", "生成按钮的标记（纯字符串，服务端渲染也能用），和手写的一模一样"],
      ["busy(按钮, 毫秒或 Promise)", "等待：300ms 内回来不转圈，转圈出现后至少留 500ms；期间点不了。返回 Promise"],
      ["succeed(按钮)", "原地换成对勾，一会儿换回文字"],
      ["prepBusy(按钮)", "提前把内容包好（避免第一次等待时排版跳一下）"],
    ]],
  ],
  chip: [
    ["标记", ["写法", "说明"], [
      [".sn-chip[data-toggle]", "筛选芯片：点了切换 .sn-on（切换照“代码”里几行接上）"],
      ['[data-chips="removable"] .sn-chip .sn-x', "可移除标签：点 × 移除"],
    ]],
    ["函数", ["名称", "说明"], [
      ["chipHTML({ text, on, removable })", "生成芯片 / 标签的标记"],
      ["removeChip(芯片, { onRemoved })", "先脱离布局淡出，剩下的用弹簧补位"],
      ["chipremove 事件", "移除后在容器上冒泡，detail: { chip }"],
    ]],
  ],
  field: [
    ["函数", ["名称", "说明"], [
      ["validateForm(form, 规则)", "规则 { data-f 的值: (值, 输入框) => 错误文字或假值 }；返回是否通过"],
      ["setFieldError(字段, 文字)", "错误在字段下方展开、输入框抖两下（aria-invalid）"],
      ["clearFieldError(字段)", "收起错误；一开始输入也会自动收起（要整页调过 setup()）"],
      ["fieldHTML({ label, control, help, error, id }) / inputHTML({ value, placeholder, size, type, id })", "生成字段、输入框的标记"],
    ]],
    ["标记", ["写法", "说明"], [
      [".sn-field[data-f]", "要校验的字段"],
      [".sn-lbl / .sn-help / .sn-err > span", "标签 / 帮助文字 / 错误文字的位置"],
    ]],
  ],
  special: [
    ["函数", ["名称", "说明"], [
      ["createPassword(input[data-pw])", "强度条 + 文字；大写锁定提示"],
      ["createEmail(input[data-email])", "停手 400ms 判断，对了画对勾；离开时不对才报错"],
      ["createSearch([data-search], { search, debounce, onSearch })", "search(q) 返回数量、数组或 Promise；超过 300ms 才转圈、至少转 500ms；debounce 默认 150ms"],
    ]],
    ["标记", ["写法", "说明"], [
      ["[data-clearable]", "有内容时右边出清除按钮（照“代码”里几行接上）"],
      ["[data-eye]", "显示 / 隐藏密码（照“代码”里几行接上）"],
    ]],
  ],
  count: [
    ["函数", ["名称", "说明"], [
      ["createCount(input[data-count])", "单行计数，maxlength 是上限"],
      ["createLongText([data-ta], { onSubmit })", "自动长高 + 量环计数（data-max）；⌘↵ 提交"],
      ["bindInputs(root)", "按标记一次接上（data-count / data-ta / data-pw / data-email / data-tagin / data-stepper / data-composer）"],
    ]],
  ],
  taginput: [
    ["createTagInput(容器, 选项)", ["选项", "说明"], [
      ["tags", "一开始就有的标签"],
      ["max / placeholder / hint", "空容器按它渲染：最多几个、占位文字、下面那行提示（已有标记时写在标记上）"],
      ["onChange", "(tags) => {}：标签变了调；同时冒泡 sn-change"],
    ]],
    ["返回值", ["名称", "说明"], [["tags", "现在的标签（只读）"]]],
    ["标记", ["写法", "说明"], [["[data-tagin][data-max]", "最多几个"], ["后面紧跟的 .sn-tagin-foot 里的 .sn-roll", "计数"]]],
  ],
  number: [
    ["createStepper(容器, 选项)", ["选项 / 返回", "说明"], [
      ["onChange", "(value) => {}"],
      ["value / min / max / unit / label", "空容器按它渲染；已有标记时写成 data-value / data-min / data-max"],
      ["返回 value / set(v)", "现在的值 / 改值（超出范围抖一下）"],
    ]],
  ],
  prompt: [
    ["createComposer(容器, 选项)", ["选项", "说明"], [
      ["onSend", "({ text, files }) => {}：发送；期间“生成中”，发送键变停止，生成完调 setBusy(false)"],
      ["onStop", "() => {}：生成中点停止（键盘回车不会停止，只晃一下停止键）"],
      ["upload", "(file, onProgress) => Promise：真上传；不给就是演示用的假进度"],
    ]],
    ["返回值", ["名称", "说明"], [["setBusy(on)", "切换生成中"], ["clear({ smooth })", "清空；smooth：附件淡出、输入框平滑收起"], ["files()", "现在的附件元素"]]],
    ["事件", ["名称", "说明"], [["compose / compose-stop", "容器写了 data-external、用 bindInputs 接上（不给 onSend）时，发送 / 停止改成在容器上发这两个事件（对话组件这样接）"]]],
  ],
  otp: [
    ["createOtp(容器, 选项)", ["选项 / 返回", "说明"], [
      ["length", "空容器按它渲染几格（默认 6）"],
      ["onComplete", "(code) => {}：填满时调（同时在容器上发 complete、sn-complete 事件）"],
      ["返回 value / clear()", "现在填了的 / 清空"],
    ]],
  ],
  segmented: [
    ["createSegmented(元素, 选项)", ["选项 / 返回", "说明"], [
      ["items / value / size / label", "空容器按它渲染：选项（字符串或 { value, label }）、选中哪个、\"sm\" 小号、读屏名称"],
      ["onChange", "(value) => {}；value 取按钮的 data-v，没写就用文字；同时冒泡 sn-change"],
      ["返回 value / select(v) / update({ value })", "当前值 / 切到某一项"],
      ["放不下", "比容器宽时横着滑（左右渐隐，竖滚轮也横向滚）"],
    ]],
    ["底层：initSeg(元素, 回调, 起始格)（satin-ui）", ["参数 / 返回", "说明"], [
      ["回调", "(value, index, animate) => {}"],
      ["起始格", "一开始选中第几格（默认 0）"],
      ["返回 go(n, focus, instant)", "切到第 n 格"],
    ]],
    ["标记", ["写法", "说明"], [[".sn-seg > .sn-thumb + button…", "滑块 + 各格"], [".sn-seg.sn-sm", "小号（高 28）"]]],
  ],
  slider: [
    ["createSlider(元素, 选项)", ["写法 / 事件", "说明"], [
      ["value / max / label", "空容器按它渲染；已有标记时写成 aria-valuenow / data-max"],
      ["onChange", "(value) => {}：拖动、点轨道、方向键改值时调（元素上同时发 slide、sn-change 事件）"],
      ["返回 value / update({ value })", "当前值 / 从外面改值"],
    ]],
  ],
  tooltip: [
    ["标记", ["写法", "说明"], [
      ['data-tip="文字"', "整页调一次 setup() 后自动有提示：悬停 500ms 出现，键盘聚焦也出现"],
      ['data-kbd="⌘C"', "提示后面带快捷键"],
      ['.sn-tip.sn-wrap', "长提示换行（最宽 240）"],
    ]],
    ["函数（satin-ui）", ["名称", "说明"], [["setup()", "页面级行为（含 Tooltip），整页调一次；React / Vue 封装会自动调"], ["showTip(元素, 文字)", "在别的时机显示（比如校验失败）"], ["hideTip()", "收起"]]],
  ],

  select: [
    ["createSelect(元素, 选项)", ["选项", "取值", "说明"], [
      ["items / value / placeholder / label", "[\"16:9\", { value, label, disabled }] / 字符串", "空容器按它渲染；已有标记时不用给"],
      ["onChange", "(value) => {}", "选中一项时调；value 取条目的 data-v，没写就用文字；同时冒泡 sn-change"],
    ]],
    ["返回值", ["名称", "说明"], [
      ["open() / close(refocus)", "打开、关上"],
      ["value", "当前选中项的值（只读）"],
      ["update({ value })", "选中某一项（不触发回调）"],
    ]],
    ["标记", ["写法", "说明"], [
      [".sn-select[data-select]", "下拉选择：选中后把文字写进 .sn-val、打勾"],
      [".sn-select（不带 data-select）", "菜单按钮：选了就关"],
      [".sn-trigger / [data-menubtn]", "触发器"],
      ["[data-prefix]", "写在菜单按钮的触发器上：选中后按钮文字 = 前缀 + 条目文字"],
      [".sn-menu > .sn-item", "条目；.sn-sel 选中、.sn-chk 打勾位置、.sn-is-off 不可用、data-v 值"],
    ]],
    ["其他", ["名称", "说明"], [
      ["bindSelects(root)", "把 root 里所有 .sn-select 一次接上（接过的不重复接）"],
      ["select 事件", "选中时在 .sn-select 上冒泡，detail: { value, item }"],
    ]],
  ],
  compound: [
    ["标记", ["写法", "说明"], [
      [".sn-group", "按钮组：相关操作连成一组（共用圆角、中间不留缝）"],
      [".sn-group.sn-split.sn-select", "分裂按钮：主按钮 + 一个菜单按钮（用 bindSelects 接上）"],
      ["[data-copy]", "复制按钮：里面放 .sn-swap（.sn-a 复制图标、.sn-b 对勾）"],
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
      ['[data-pop="面板 id"]', "写在按钮上，bindOverlays 接上：点了开、再点关"],
      ["关闭时机", "Esc、点面板外面（要整页调过 setup()）、Tab 走出面板、窗口变化时重新对位"],
    ]],
  ],
  popconfirm: [
    ["标记", ["写法", "说明"], [
      [".sn-pop.sn-popconfirm", "气泡确认面板（role=\"alertdialog\"）"],
      ["[data-no] / [data-yes]", "取消 / 确认；打开时焦点先落在取消上"],
    ]],
    ["函数", ["名称", "说明"], [
      ["openPopover(面板, 按钮, { align: \"end\" })", "和弹出面板同一个接口，返回 { close }"],
    ]],
  ],
  ctxmenu: [
    ["openMenu(菜单, 选项)", ["选项", "说明"], [
      ["trigger", "触发的元素：打开时加 .sn-is-open、关上后焦点回到它"],
      ["anchor", "贴着这个元素弹（菜单按钮）"],
      ["x / y", "在这个位置弹（右键菜单）；放不下往左、往上开"],
      ["bound", "菜单（连同每一层子菜单）只能待在这个容器里"],
      ["keyboard", "用键盘打开：先高亮第一项"],
      ["onSelect", "({ item, label, path, menu }) => {}：选中一项时调"],
    ]],
    ["其他", ["名称", "说明"], [
      ["closeMenu(refocus)", "关上整套菜单"],
      ["menuselect 事件", "选中时在根菜单上冒泡；detail 同 onSelect"],
      ['[data-ctx="菜单 id"]', "右键区域（Shift+F10、菜单键也行；bindOverlays 接上）"],
      ['[data-fmenu="菜单 id"]', "菜单按钮（↓ 键也能打开；bindOverlays 接上）"],
    ]],
    ["菜单标记", ["写法", "说明"], [
      [".sn-menu.sn-float > .sn-item", "条目；.sn-key 快捷键提示、.sn-danger-item 危险项、.sn-is-off 不可用"],
      ['data-sub="子菜单 id"', "有子菜单的条目：悬停 220ms 打开，朝子菜单走时有安全三角区"],
      [".sn-sep / .sn-head", "分组之间的间隔 / 分组标题"],
      ["键盘", "↑↓ 移动、→ 进子菜单、← 回上一层、回车选中、Esc 关闭（要整页调过 setup()）"],
    ]],
  ],
  dialog: [
    ["函数", ["名称", "说明"], [
      ["openDialog(弹窗, 触发按钮)", "从按钮那里长出来（只动 transform 和 opacity）"],
      ["closeDialog(弹窗, refocus = true)", "原路缩回，焦点回到按钮；返回 Promise（动画走完才 resolve）"],
      ["弹窗.guard = () => {}", "挂在弹窗上：Esc、取消、× 都先调它（比如有填写内容先问一句）"],
    ]],
    ["标记", ["写法", "说明"], [
      ["<dialog class=\"sn-dlg\">", "弹窗；里面 .sn-hd 标题、.sn-bd 内容、.sn-ft 按钮（主按钮在最右）"],
      ['[data-dlg="弹窗 id"]', "打开弹窗的按钮（bindOverlays 接上）"],
      ["[data-x] / [data-cancel]", "关闭（走 guard）"],
      ["点背景", "只“顶一下”提示，不关（避免误关丢内容）"],
    ]],
  ],
  drawer: [
    ["openDrawer(抽屉, 选项)", ["选项", "说明"], [
      ["trigger", "触发的按钮：关上后焦点回到这里"],
      ["focus", "打开后焦点先落在这里（默认抽屉里第一个能聚焦的）"],
      ["scrim", "遮罩元素（默认页面上的 .sn-drawer-scrim，没有就建一个）"],
      ["onClose", "关上以后调"],
    ]],
    ["其他", ["名称", "说明"], [
      ["返回值", "{ close(refocus) }"],
      ["closeDrawer(refocus)", "关上正开着的那个抽屉"],
      ['[data-drawer="抽屉 id"]', "打开抽屉的按钮（bindOverlays 接上）"],
      ["抽屉里的 [data-x]", "关闭"],
      ["关闭时机", "Esc、点外面（提示、轻提示、菜单除外；要整页调过 setup()）"],
    ]],
  ],
  cmdk: [
    ["createCommandPalette(分组, 选项)", ["选项", "说明"], [
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
    ["createScrollArea(元素, 选项)", ["选项", "取值", "默认", "说明"], [
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
      ["destroy()", "函数", "撤掉接上时加的监听和观察器"],
    ]],
    ["展示页的标记写法", ["属性", "对应选项", "例子"], [
      ["data-sa", "fade", 'data-sa="y"'],
      ["data-sa-size", "size", 'data-sa-size="40"'],
      ["data-sa-bar", "bar", 'data-sa-bar="hover"'],
      ["data-sa-bar-size", "barSize", 'data-sa-bar-size="8"'],
      ["data-sa-inset", "barInset", 'data-sa-inset="4"'],
      ["data-sa-over", "overscroll", 'data-sa-over="contain"'],
      ["data-sa-wheel", "wheel", 'data-sa-wheel="x"'],
    ]],
    ["CSS 变量", ["变量", "默认", "说明"], [
      ["--sn-sa-fade", "24px", "渐隐带宽度（size 写的就是它）"],
      ["--sn-sa-thumb", "浅色 rgba(0,0,0,.26) / 深色 rgba(255,255,255,.28)", "滑块颜色"],
      ["--sn-sa-thumb-hover", "浅色 rgba(0,0,0,.44) / 深色 rgba(255,255,255,.48)", "悬停、拖动时滑块颜色"],
    ]],
    ["事件", ["事件", "说明"], [
      ["sa-jump", "拖滑块一下跳很远时，在视口上同步发出：虚拟列表在同一个任务里画出新位置的内容，不等下一帧"],
    ]],
  ],
};
