// 框架登记表：官网的"框架偏好"选择器、代码块、接入页，和 scripts/examples/gallery.mjs（生成全量示例）都读这一份。
// 加一个框架 = 这里加一条 + gallery.mjs 的 WRITERS 里加它的生成函数 + 建 examples/<id>/（见 docs/site-ia.md "加一个框架的步骤"）。
// 字段：
//   id / name     偏好的值 / 显示名
//   ext / lang    组件文件后缀 / 代码高亮用的语言
//   dir           示例目录（仓库根目录下）
//   demo(slug)    一个演示的源码文件（相对 dir）；slug 是"组件 id-第几个演示"，比如 button-0
//   recipe(id)    一个页面配方的源码文件（相对 dir）
//   install       装上 satin-ui 的命令（接入页、快速上手用）
//   envs          运行环境子选项（只影响安装、接入、CLI 那几页；组件写法和父框架一样）
//   fallback      某个演示还没有专门写法时，代码块上说明用的是哪种（"暂用自定义元素写法"）
export const FRAMEWORKS = [
  { id: "html", name: "HTML", ext: "html", lang: "html", dir: "examples/html", demo: (s) => `demos/${s}.html`, recipe: (id) => `recipes/${id}.html`, install: "npm i satin-ui", setup: "纯 HTML" },
  { id: "react", name: "React", ext: "jsx", lang: "jsx", dir: "examples/react", demo: (s) => `src/demos/${s}.jsx`, recipe: (id) => `src/recipes/${id}.jsx`, install: "npm i satin-ui", setup: "React",
    envs: [{ id: "next", name: "Next.js", dir: "examples/next", setup: "Next.js" }] },
  { id: "vue", name: "Vue", ext: "vue", lang: "vue", dir: "examples/vue", demo: (s) => `src/demos/${s}.vue`, recipe: (id) => `src/recipes/${id}.vue`, install: "npm i satin-ui", setup: "Vue",
    envs: [{ id: "nuxt", name: "Nuxt", dir: "examples/nuxt", setup: "Nuxt" }] },
  { id: "svelte", name: "Svelte", ext: "svelte", lang: "html", dir: "examples/svelte", demo: (s) => `src/demos/${s}.svelte`, recipe: (id) => `src/recipes/${id}.svelte`, install: "npm i satin-ui", setup: "Svelte", fallback: "Svelte 暂用自定义元素写法" },
  { id: "angular", name: "Angular", ext: "ts", lang: "ts", dir: "examples/angular", demo: (s) => `src/demos/${s}.ts`, recipe: (id) => `src/recipes/${id}.ts`, install: "npm i satin-ui", setup: "Angular", fallback: "Angular 暂用自定义元素写法" },
  { id: "solid", name: "Solid", ext: "jsx", lang: "jsx", dir: "examples/solid", demo: (s) => `src/demos/${s}.jsx`, recipe: (id) => `src/recipes/${id}.jsx`, install: "npm i satin-ui solid-js @solidjs/web", setup: "Solid", fallback: "Solid 暂用自定义元素写法" },
  { id: "preact", name: "Preact", ext: "jsx", lang: "jsx", dir: "examples/preact", demo: (s) => `src/demos/${s}.jsx`, recipe: (id) => `src/recipes/${id}.jsx`, install: "npm i satin-ui", setup: "Preact", fallback: "Preact 暂用自定义元素写法" },
];
export const FW_IDS = FRAMEWORKS.map((f) => f.id);
export const fwById = (id) => FRAMEWORKS.find((f) => f.id === id) || FRAMEWORKS.find((f) => f.envs?.some((e) => e.id === id));
// 组件名：button-0 → ButtonDemo0（React、Vue、Svelte、Solid、Preact 的组件名；Angular 的类名再加 Component）
export const compName = (slug) => slug.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase()).replace(/(\d+)$/, "Demo$1");
