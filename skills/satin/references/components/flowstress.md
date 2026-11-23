# 流程图 · 万级 ComfyUI 节点集群 · Canvas · 异构多端口节点 · 视口裁剪 · 细节分级

> 组件 id：`flowstress`　分组：数据展示

节点超过几百个后改由一块 Canvas 画布承接，按 1024px 空间网格做视口裁剪与三档 LOD 细节分级。全图由 500 座（1 万节点）或 2,500 座（5 万节点）有机错落的真实 ComfyUI 影视生图生视频管线岛屿组成，涵盖异构宽高节点、8 类语义端口彩色连线与 Reroute 转接点；平移、缩放、拖节点与三层数据流脉冲激活全程保持 60fps。

**这是设计稿的 ComfyUI 分布式生成集群压测演示（demo/sections/flow-stress.js），组件库里没有对应的画布压测组件。10,000～50,000 个异构尺寸节点（数百座完整 ComfyUI 管线岛屿 + 跨岛总线），平移、缩放、拖节点与悬停 3 层信号追踪都要稳住每秒 60 帧；几十到两百个节点的交互式 ComfyUI 工作流直接用组件库的 createFlow（支持群组分区框、语义彩色端口、参数行、高清预览图与 Reroute 路由点，同样 60fps 流畅）。**

## 什么时候用

- 要画上千到数万个节点集群时，照这里的做法写 Canvas 分级渲染与空间索引。
- 几十到两百个节点的 ComfyUI / 工作流编辑器：直接用流程图组件（createFlow）。

## 什么时候别用

- 几十到两百个节点以内：用流程图组件（createFlow），原生支持多端口、群组拖拽、参数行、预览图与读屏无障碍。（换成 `flow`）

## 相近的组件

- `flow`：流程图是组件（DOM 节点 + SVG 语义连线 + 群组）；这里是万级 ComfyUI 集群的 Canvas 压测演示。

## 引入

| 写法 | 引入 |
|---|---|
| 纯 HTML | `import { createFlow } from "satin-ui/flow";` |
| React | `import { Flow } from "satin-ui/react/flow";` |
| Vue | `import { Flow } from "satin-ui/vue/flow";` |
| Svelte | `import { createFlow } from "satin-ui/flow";` |
| Angular | `import { createFlow } from "satin-ui/flow";` |
| Solid | `import { createFlow } from "satin-ui/flow";` |
| Preact | `import { Flow } from "satin-ui/react/flow"; // 经 preact/compat` |

- 纯 HTML：组件库里没有画布压测版。上万节点的做法：① 画在一块 Canvas 上，按 1024px 格子建异构宽高空间索引，视口外的节点和线一个都不碰；② 8 类 ComfyUI 语义端口色盘按端口坐标精准连线，线多了按均匀洗牌表抽样；③ 三档 LOD：远景星图色块 → 中景彩色顶带卡片 + 贝塞尔曲线 → 近景完整标题、端口标签、参数胶囊与预览帧；④ 仅在视图、悬停、拖动或信号动画进行时按需重绘；⑤ 异构布局与网格索引放 Web Worker 后台算。

## 示例（由浅入深）

### ComfyUI 影视生图生视频工作流（6 群组 · 24 异构节点 · 60fps）

真实 FLUX + ControlNet + IPAdapter + 双阶段 KSampler + FaceDetailer + 4K 超分 + Wan2.1 导出管线；支持拖群组标题栏整组移动、精准端口连线、悬停追踪与分层运行，下方完整演示可体验 1 万 / 5 万节点 Canvas 集群压测。

```html
<div id="flowstress-many"></div>
```

纯 HTML 的写法：

```jsx
<div id="flowstress-many"></div>

<script type="module">
  import { createFlow } from "satin-ui/flow";

  // ComfyUI 影视级工作流：6 大分区群组 + 24 个异构节点（含 Reroute 与高清预览）+ 33 条语义端口连线
  const groups = [
    { id: "g-model", title: "01 · 基础模型与 LoRA 栈", x: 0, y: 0, w: 516, h: 358, hue: 248 },
    { id: "g-ref", title: "02 · 场景参考与空间控图", x: 14, y: 398, w: 502, h: 378, hue: 156 },
    { id: "g-prompt", title: "03 · 提示词编码与条件控图", x: 568, y: 8, w: 572, h: 362, hue: 28 },
    { id: "g-sample", title: "04 · 双阶段潜空间采样", x: 564, y: 400, w: 576, h: 396, hue: 292 },
    { id: "g-detail", title: "05 · 解码、人脸精修与 4K 超分", x: 1188, y: 12, w: 548, h: 382, hue: 208 },
    { id: "g-out", title: "06 · 关键帧预览与母带导出", x: 1192, y: 422, w: 544, h: 356, hue: 184 },
  ];
  const nodes = [
    { id: "ckpt", x: 20, y: 46, w: 224, title: "CheckpointLoaderSimple", badge: "FP8", kind: "MODEL", outputs: ["MODEL", "CLIP", "VAE"], params: [["ckpt", "flux1-dev-fp8"]] },
    { id: "clip", x: 26, y: 214, w: 214, title: "DualCLIPLoader", badge: "T5", kind: "CLIP", outputs: ["CLIP"], params: [["clip1", "t5xxl_fp8"], ["clip2", "clip_l"]] },
    { id: "lora1", x: 278, y: 46, w: 216, title: "LoraLoader · 雨夜胶片", badge: "0.82", kind: "MODEL", inputs: [{ name: "model", type: "MODEL" }, { name: "clip", type: "CLIP" }], outputs: ["MODEL", "CLIP"], params: [["lora", "rain-cinema-v2"], ["strength", "0.82"]] },
    { id: "vael", x: 282, y: 218, w: 212, title: "VAELoader · 胶片解码", badge: "BF16", kind: "VAE", outputs: ["VAE"], params: [["vae", "ae_flux_bf16"]] },

    { id: "ref", x: 34, y: 444, w: 220, title: "LoadImage · 场景参考", badge: "IMG", kind: "IMAGE", outputs: ["IMAGE", "MASK"], preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=480&q=75" },
    { id: "depth", x: 286, y: 444, w: 210, title: "DepthAnythingV2", badge: "CN", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["ckpt", "depth_v2_vitl"], ["res", "1024"]] },
    { id: "ip", x: 286, y: 604, w: 210, title: "IPAdapter · 风格迁移", badge: "0.65", kind: "STYLE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["STYLE"], params: [["weight", "0.65"], ["preset", "PLUS"]] },

    { id: "rr_m", x: 822, y: -44, title: "MODEL", reroute: true, kind: "MODEL", inputs: [{ name: "in", type: "MODEL" }], outputs: [{ name: "out", type: "MODEL" }] },
    { id: "rr_v", x: 832, y: 818, title: "VAE", reroute: true, kind: "VAE", inputs: [{ name: "in", type: "VAE" }], outputs: [{ name: "out", type: "VAE" }] },

    { id: "pos", x: 588, y: 54, w: 230, title: "CLIPTextEncode · 正向", badge: "POS", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "rainy station, 35mm"]] },
    { id: "neg", x: 588, y: 196, w: 230, title: "CLIPTextEncode · 负向", badge: "NEG", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "blurry, lowres, deform"]] },
    { id: "guide", x: 862, y: 52, w: 248, title: "FluxGuidance", badge: "3.5", kind: "CONDITIONING", inputs: [{ name: "cond", type: "CONDITIONING" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["guidance", "3.5"]] },
    { id: "cn", x: 862, y: 178, w: 254, title: "ControlNetApplyAdv", badge: "0.68", kind: "CONTROL_NET", inputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "image", type: "IMAGE" }], outputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }], params: [["strength", "0.68"], ["end", "0.85"]] },

    { id: "ks1", x: 584, y: 444, w: 248, title: "KSampler · Base", badge: "28s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "28 · euler"], ["cfg", "3.5 · denoise 1.0"]] },
    { id: "lat", x: 588, y: 652, w: 236, title: "EmptySD3Latent", badge: "16:9", kind: "LATENT", outputs: ["LATENT"], params: [["size", "1344 × 768"], ["batch", "2"]] },
    { id: "ks2", x: 872, y: 444, w: 248, title: "KSampler · Hires", badge: "14s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "14 · dpmpp_2m"], ["denoise", "0.42"]] },
    { id: "upl", x: 874, y: 652, w: 240, title: "LatentUpscaleBy", badge: "1.5×", kind: "LATENT", inputs: [{ name: "samples", type: "LATENT" }], outputs: ["LATENT"], params: [["method", "bislerp"], ["scale", "1.50"]] },

    { id: "vae", x: 1208, y: 58, w: 224, title: "VAEDecode · Tiled", badge: "VAE", kind: "VAE", inputs: [{ name: "samples", type: "LATENT" }, { name: "vae", type: "VAE" }], outputs: ["IMAGE"], params: [["tile_size", "512"]] },
    { id: "det", x: 1208, y: 208, w: 232, title: "FaceDetailer", badge: "DET", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }, { name: "model", type: "MODEL" }, { name: "cond", type: "CONDITIONING" }], outputs: ["IMAGE", "MASK"], params: [["denoise", "0.35"], ["guide", "512"]] },
    { id: "ups", x: 1484, y: 62, w: 228, title: "ImageUpscale · 4x", badge: "4×", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["model", "4x-UltraSharp"]] },
    { id: "lut", x: 1484, y: 206, w: 228, title: "ColorCorrect · LUT", badge: "LUT", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }, { name: "style", type: "STYLE" }], outputs: ["IMAGE"], params: [["lut", "Kodak 2383"], ["mix", "0.72"]] },

    { id: "prev", x: 1212, y: 468, w: 256, title: "PreviewImage · 关键帧", badge: "4K", kind: "IMAGE", inputs: [{ name: "images", type: "IMAGE" }], preview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=480&q=75" },
    { id: "vid", x: 1500, y: 468, w: 216, title: "Wan2.1 · VideoCombine", badge: "MP4", kind: "VIDEO", inputs: [{ name: "image", type: "IMAGE" }, { name: "cond", type: "CONDITIONING" }], outputs: ["VIDEO"], params: [["frames", "81 · 24fps"], ["codec", "H.265 · 4K"]] },
    { id: "save", x: 1500, y: 642, w: 216, title: "SaveVideo · 发行母带", badge: "OUT", kind: "out", inputs: [{ name: "video", type: "VIDEO" }], params: [["format", "ProRes 422"]] },
  ];
  const edges = [
    { from: "ckpt", fromPort: "MODEL", to: "lora1", toPort: "model", type: "MODEL" },
    { from: "ckpt", fromPort: "CLIP", to: "lora1", toPort: "clip", type: "CLIP" },
    { from: "lora1", fromPort: "MODEL", to: "rr_m", toPort: "in", type: "MODEL" },
    { from: "lora1", fromPort: "CLIP", to: "pos", toPort: "clip", type: "CLIP" },
    { from: "clip", fromPort: "CLIP", to: "neg", toPort: "clip", type: "CLIP" },
    { from: "vael", fromPort: "VAE", to: "rr_v", toPort: "in", type: "VAE" },

    { from: "ref", fromPort: "IMAGE", to: "depth", toPort: "image", type: "IMAGE" },
    { from: "ref", fromPort: "IMAGE", to: "ip", toPort: "image", type: "IMAGE" },
    { from: "pos", fromPort: "cond", to: "guide", toPort: "cond", type: "CONDITIONING" },
    { from: "guide", fromPort: "cond", to: "cn", toPort: "pos", type: "CONDITIONING" },
    { from: "neg", fromPort: "cond", to: "cn", toPort: "neg", type: "CONDITIONING" },
    { from: "depth", fromPort: "IMAGE", to: "cn", toPort: "image", type: "IMAGE" },

    { from: "rr_m", fromPort: "out", to: "ks1", toPort: "model", type: "MODEL" },
    { from: "rr_m", fromPort: "out", to: "ks2", toPort: "model", type: "MODEL" },
    { from: "rr_m", fromPort: "out", to: "det", toPort: "model", type: "MODEL" },
    { from: "cn", fromPort: "pos", to: "ks1", toPort: "pos", type: "CONDITIONING" },
    { from: "cn", fromPort: "neg", to: "ks1", toPort: "neg", type: "CONDITIONING" },
    { from: "lat", fromPort: "LATENT", to: "ks1", toPort: "latent", type: "LATENT" },
    { from: "ks1", fromPort: "LATENT", to: "upl", toPort: "samples", type: "LATENT" },
    { from: "upl", fromPort: "LATENT", to: "ks2", toPort: "latent", type: "LATENT" },
    { from: "cn", fromPort: "pos", to: "ks2", toPort: "pos", type: "CONDITIONING" },
    { from: "cn", fromPort: "neg", to: "ks2", toPort: "neg", type: "CONDITIONING" },

    { from: "ks2", fromPort: "LATENT", to: "vae", toPort: "samples", type: "LATENT" },
    { from: "rr_v", fromPort: "out", to: "vae", toPort: "vae", type: "VAE" },
    { from: "vae", fromPort: "IMAGE", to: "det", toPort: "image", type: "IMAGE" },
    { from: "guide", fromPort: "cond", to: "det", toPort: "cond", type: "CONDITIONING" },
    { from: "det", fromPort: "IMAGE", to: "ups", toPort: "image", type: "IMAGE" },
    { from: "ups", fromPort: "IMAGE", to: "lut", toPort: "image", type: "IMAGE" },
    { from: "ip", fromPort: "STYLE", to: "lut", toPort: "style", type: "STYLE" },

    { from: "lut", fromPort: "IMAGE", to: "prev", toPort: "images", type: "IMAGE" },
    { from: "lut", fromPort: "IMAGE", to: "vid", toPort: "image", type: "IMAGE" },
    { from: "guide", fromPort: "cond", to: "vid", toPort: "cond", type: "CONDITIONING" },
    { from: "vid", fromPort: "VIDEO", to: "save", toPort: "video", type: "VIDEO" },
  ];

  createFlow(document.getElementById("flowstress-many"), { groups, nodes, edges, label: "ComfyUI 影视生图生视频工作流" });
</script>
```

React 的写法：

```jsx
import { Flow } from "satin-ui/react/flow";

const groups = [
  { id: "g-model", title: "01 · 基础模型与 LoRA 栈", x: 0, y: 0, w: 516, h: 358, hue: 248 },
  { id: "g-ref", title: "02 · 场景参考与空间控图", x: 14, y: 398, w: 502, h: 378, hue: 156 },
  { id: "g-prompt", title: "03 · 提示词编码与条件控图", x: 568, y: 8, w: 572, h: 362, hue: 28 },
  { id: "g-sample", title: "04 · 双阶段潜空间采样", x: 564, y: 400, w: 576, h: 396, hue: 292 },
  { id: "g-detail", title: "05 · 解码、人脸精修与 4K 超分", x: 1188, y: 12, w: 548, h: 382, hue: 208 },
  { id: "g-out", title: "06 · 关键帧预览与母带导出", x: 1192, y: 422, w: 544, h: 356, hue: 184 },
];
const nodes = [
  { id: "ckpt", x: 20, y: 46, w: 224, title: "CheckpointLoaderSimple", badge: "FP8", kind: "MODEL", outputs: ["MODEL", "CLIP", "VAE"], params: [["ckpt", "flux1-dev-fp8"]] },
  { id: "clip", x: 26, y: 214, w: 214, title: "DualCLIPLoader", badge: "T5", kind: "CLIP", outputs: ["CLIP"], params: [["clip1", "t5xxl_fp8"], ["clip2", "clip_l"]] },
  { id: "lora1", x: 278, y: 46, w: 216, title: "LoraLoader · 雨夜胶片", badge: "0.82", kind: "MODEL", inputs: [{ name: "model", type: "MODEL" }, { name: "clip", type: "CLIP" }], outputs: ["MODEL", "CLIP"], params: [["lora", "rain-cinema-v2"], ["strength", "0.82"]] },
  { id: "vael", x: 282, y: 218, w: 212, title: "VAELoader · 胶片解码", badge: "BF16", kind: "VAE", outputs: ["VAE"], params: [["vae", "ae_flux_bf16"]] },

  { id: "ref", x: 34, y: 444, w: 220, title: "LoadImage · 场景参考", badge: "IMG", kind: "IMAGE", outputs: ["IMAGE", "MASK"], preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=480&q=75" },
  { id: "depth", x: 286, y: 444, w: 210, title: "DepthAnythingV2", badge: "CN", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["ckpt", "depth_v2_vitl"], ["res", "1024"]] },
  { id: "ip", x: 286, y: 604, w: 210, title: "IPAdapter · 风格迁移", badge: "0.65", kind: "STYLE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["STYLE"], params: [["weight", "0.65"], ["preset", "PLUS"]] },

  { id: "rr_m", x: 822, y: -44, title: "MODEL", reroute: true, kind: "MODEL", inputs: [{ name: "in", type: "MODEL" }], outputs: [{ name: "out", type: "MODEL" }] },
  { id: "rr_v", x: 832, y: 818, title: "VAE", reroute: true, kind: "VAE", inputs: [{ name: "in", type: "VAE" }], outputs: [{ name: "out", type: "VAE" }] },

  { id: "pos", x: 588, y: 54, w: 230, title: "CLIPTextEncode · 正向", badge: "POS", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "rainy station, 35mm"]] },
  { id: "neg", x: 588, y: 196, w: 230, title: "CLIPTextEncode · 负向", badge: "NEG", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "blurry, lowres, deform"]] },
  { id: "guide", x: 862, y: 52, w: 248, title: "FluxGuidance", badge: "3.5", kind: "CONDITIONING", inputs: [{ name: "cond", type: "CONDITIONING" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["guidance", "3.5"]] },
  { id: "cn", x: 862, y: 178, w: 254, title: "ControlNetApplyAdv", badge: "0.68", kind: "CONTROL_NET", inputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "image", type: "IMAGE" }], outputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }], params: [["strength", "0.68"], ["end", "0.85"]] },

  { id: "ks1", x: 584, y: 444, w: 248, title: "KSampler · Base", badge: "28s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "28 · euler"], ["cfg", "3.5 · denoise 1.0"]] },
  { id: "lat", x: 588, y: 652, w: 236, title: "EmptySD3Latent", badge: "16:9", kind: "LATENT", outputs: ["LATENT"], params: [["size", "1344 × 768"], ["batch", "2"]] },
  { id: "ks2", x: 872, y: 444, w: 248, title: "KSampler · Hires", badge: "14s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "14 · dpmpp_2m"], ["denoise", "0.42"]] },
  { id: "upl", x: 874, y: 652, w: 240, title: "LatentUpscaleBy", badge: "1.5×", kind: "LATENT", inputs: [{ name: "samples", type: "LATENT" }], outputs: ["LATENT"], params: [["method", "bislerp"], ["scale", "1.50"]] },

  { id: "vae", x: 1208, y: 58, w: 224, title: "VAEDecode · Tiled", badge: "VAE", kind: "VAE", inputs: [{ name: "samples", type: "LATENT" }, { name: "vae", type: "VAE" }], outputs: ["IMAGE"], params: [["tile_size", "512"]] },
  { id: "det", x: 1208, y: 208, w: 232, title: "FaceDetailer", badge: "DET", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }, { name: "model", type: "MODEL" }, { name: "cond", type: "CONDITIONING" }], outputs: ["IMAGE", "MASK"], params: [["denoise", "0.35"], ["guide", "512"]] },
  { id: "ups", x: 1484, y: 62, w: 228, title: "ImageUpscale · 4x", badge: "4×", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["model", "4x-UltraSharp"]] },
  { id: "lut", x: 1484, y: 206, w: 228, title: "ColorCorrect · LUT", badge: "LUT", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }, { name: "style", type: "STYLE" }], outputs: ["IMAGE"], params: [["lut", "Kodak 2383"], ["mix", "0.72"]] },

  { id: "prev", x: 1212, y: 468, w: 256, title: "PreviewImage · 关键帧", badge: "4K", kind: "IMAGE", inputs: [{ name: "images", type: "IMAGE" }], preview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=480&q=75" },
  { id: "vid", x: 1500, y: 468, w: 216, title: "Wan2.1 · VideoCombine", badge: "MP4", kind: "VIDEO", inputs: [{ name: "image", type: "IMAGE" }, { name: "cond", type: "CONDITIONING" }], outputs: ["VIDEO"], params: [["frames", "81 · 24fps"], ["codec", "H.265 · 4K"]] },
  { id: "save", x: 1500, y: 642, w: 216, title: "SaveVideo · 发行母带", badge: "OUT", kind: "out", inputs: [{ name: "video", type: "VIDEO" }], params: [["format", "ProRes 422"]] },
];
const edges = [
  { from: "ckpt", fromPort: "MODEL", to: "lora1", toPort: "model", type: "MODEL" },
  { from: "ckpt", fromPort: "CLIP", to: "lora1", toPort: "clip", type: "CLIP" },
  { from: "lora1", fromPort: "MODEL", to: "rr_m", toPort: "in", type: "MODEL" },
  { from: "lora1", fromPort: "CLIP", to: "pos", toPort: "clip", type: "CLIP" },
  { from: "clip", fromPort: "CLIP", to: "neg", toPort: "clip", type: "CLIP" },
  { from: "vael", fromPort: "VAE", to: "rr_v", toPort: "in", type: "VAE" },

  { from: "ref", fromPort: "IMAGE", to: "depth", toPort: "image", type: "IMAGE" },
  { from: "ref", fromPort: "IMAGE", to: "ip", toPort: "image", type: "IMAGE" },
  { from: "pos", fromPort: "cond", to: "guide", toPort: "cond", type: "CONDITIONING" },
  { from: "guide", fromPort: "cond", to: "cn", toPort: "pos", type: "CONDITIONING" },
  { from: "neg", fromPort: "cond", to: "cn", toPort: "neg", type: "CONDITIONING" },
  { from: "depth", fromPort: "IMAGE", to: "cn", toPort: "image", type: "IMAGE" },

  { from: "rr_m", fromPort: "out", to: "ks1", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "ks2", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "det", toPort: "model", type: "MODEL" },
  { from: "cn", fromPort: "pos", to: "ks1", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks1", toPort: "neg", type: "CONDITIONING" },
  { from: "lat", fromPort: "LATENT", to: "ks1", toPort: "latent", type: "LATENT" },
  { from: "ks1", fromPort: "LATENT", to: "upl", toPort: "samples", type: "LATENT" },
  { from: "upl", fromPort: "LATENT", to: "ks2", toPort: "latent", type: "LATENT" },
  { from: "cn", fromPort: "pos", to: "ks2", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks2", toPort: "neg", type: "CONDITIONING" },

  { from: "ks2", fromPort: "LATENT", to: "vae", toPort: "samples", type: "LATENT" },
  { from: "rr_v", fromPort: "out", to: "vae", toPort: "vae", type: "VAE" },
  { from: "vae", fromPort: "IMAGE", to: "det", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "det", toPort: "cond", type: "CONDITIONING" },
  { from: "det", fromPort: "IMAGE", to: "ups", toPort: "image", type: "IMAGE" },
  { from: "ups", fromPort: "IMAGE", to: "lut", toPort: "image", type: "IMAGE" },
  { from: "ip", fromPort: "STYLE", to: "lut", toPort: "style", type: "STYLE" },

  { from: "lut", fromPort: "IMAGE", to: "prev", toPort: "images", type: "IMAGE" },
  { from: "lut", fromPort: "IMAGE", to: "vid", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "vid", toPort: "cond", type: "CONDITIONING" },
  { from: "vid", fromPort: "VIDEO", to: "save", toPort: "video", type: "VIDEO" },
];

export default function Demo() {
  return <Flow groups={groups} nodes={nodes} edges={edges} label="ComfyUI 影视生图生视频工作流" />;
}
```

Vue 的写法：

```vue
<script setup>
import { Flow } from "satin-ui/vue/flow";

const groups = [
  { id: "g-model", title: "01 · 基础模型与 LoRA 栈", x: 0, y: 0, w: 516, h: 358, hue: 248 },
  { id: "g-ref", title: "02 · 场景参考与空间控图", x: 14, y: 398, w: 502, h: 378, hue: 156 },
  { id: "g-prompt", title: "03 · 提示词编码与条件控图", x: 568, y: 8, w: 572, h: 362, hue: 28 },
  { id: "g-sample", title: "04 · 双阶段潜空间采样", x: 564, y: 400, w: 576, h: 396, hue: 292 },
  { id: "g-detail", title: "05 · 解码、人脸精修与 4K 超分", x: 1188, y: 12, w: 548, h: 382, hue: 208 },
  { id: "g-out", title: "06 · 关键帧预览与母带导出", x: 1192, y: 422, w: 544, h: 356, hue: 184 },
];
const nodes = [
  { id: "ckpt", x: 20, y: 46, w: 224, title: "CheckpointLoaderSimple", badge: "FP8", kind: "MODEL", outputs: ["MODEL", "CLIP", "VAE"], params: [["ckpt", "flux1-dev-fp8"]] },
  { id: "clip", x: 26, y: 214, w: 214, title: "DualCLIPLoader", badge: "T5", kind: "CLIP", outputs: ["CLIP"], params: [["clip1", "t5xxl_fp8"], ["clip2", "clip_l"]] },
  { id: "lora1", x: 278, y: 46, w: 216, title: "LoraLoader · 雨夜胶片", badge: "0.82", kind: "MODEL", inputs: [{ name: "model", type: "MODEL" }, { name: "clip", type: "CLIP" }], outputs: ["MODEL", "CLIP"], params: [["lora", "rain-cinema-v2"], ["strength", "0.82"]] },
  { id: "vael", x: 282, y: 218, w: 212, title: "VAELoader · 胶片解码", badge: "BF16", kind: "VAE", outputs: ["VAE"], params: [["vae", "ae_flux_bf16"]] },

  { id: "ref", x: 34, y: 444, w: 220, title: "LoadImage · 场景参考", badge: "IMG", kind: "IMAGE", outputs: ["IMAGE", "MASK"], preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=480&q=75" },
  { id: "depth", x: 286, y: 444, w: 210, title: "DepthAnythingV2", badge: "CN", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["ckpt", "depth_v2_vitl"], ["res", "1024"]] },
  { id: "ip", x: 286, y: 604, w: 210, title: "IPAdapter · 风格迁移", badge: "0.65", kind: "STYLE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["STYLE"], params: [["weight", "0.65"], ["preset", "PLUS"]] },

  { id: "rr_m", x: 822, y: -44, title: "MODEL", reroute: true, kind: "MODEL", inputs: [{ name: "in", type: "MODEL" }], outputs: [{ name: "out", type: "MODEL" }] },
  { id: "rr_v", x: 832, y: 818, title: "VAE", reroute: true, kind: "VAE", inputs: [{ name: "in", type: "VAE" }], outputs: [{ name: "out", type: "VAE" }] },

  { id: "pos", x: 588, y: 54, w: 230, title: "CLIPTextEncode · 正向", badge: "POS", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "rainy station, 35mm"]] },
  { id: "neg", x: 588, y: 196, w: 230, title: "CLIPTextEncode · 负向", badge: "NEG", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "blurry, lowres, deform"]] },
  { id: "guide", x: 862, y: 52, w: 248, title: "FluxGuidance", badge: "3.5", kind: "CONDITIONING", inputs: [{ name: "cond", type: "CONDITIONING" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["guidance", "3.5"]] },
  { id: "cn", x: 862, y: 178, w: 254, title: "ControlNetApplyAdv", badge: "0.68", kind: "CONTROL_NET", inputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "image", type: "IMAGE" }], outputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }], params: [["strength", "0.68"], ["end", "0.85"]] },

  { id: "ks1", x: 584, y: 444, w: 248, title: "KSampler · Base", badge: "28s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "28 · euler"], ["cfg", "3.5 · denoise 1.0"]] },
  { id: "lat", x: 588, y: 652, w: 236, title: "EmptySD3Latent", badge: "16:9", kind: "LATENT", outputs: ["LATENT"], params: [["size", "1344 × 768"], ["batch", "2"]] },
  { id: "ks2", x: 872, y: 444, w: 248, title: "KSampler · Hires", badge: "14s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "14 · dpmpp_2m"], ["denoise", "0.42"]] },
  { id: "upl", x: 874, y: 652, w: 240, title: "LatentUpscaleBy", badge: "1.5×", kind: "LATENT", inputs: [{ name: "samples", type: "LATENT" }], outputs: ["LATENT"], params: [["method", "bislerp"], ["scale", "1.50"]] },

  { id: "vae", x: 1208, y: 58, w: 224, title: "VAEDecode · Tiled", badge: "VAE", kind: "VAE", inputs: [{ name: "samples", type: "LATENT" }, { name: "vae", type: "VAE" }], outputs: ["IMAGE"], params: [["tile_size", "512"]] },
  { id: "det", x: 1208, y: 208, w: 232, title: "FaceDetailer", badge: "DET", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }, { name: "model", type: "MODEL" }, { name: "cond", type: "CONDITIONING" }], outputs: ["IMAGE", "MASK"], params: [["denoise", "0.35"], ["guide", "512"]] },
  { id: "ups", x: 1484, y: 62, w: 228, title: "ImageUpscale · 4x", badge: "4×", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["model", "4x-UltraSharp"]] },
  { id: "lut", x: 1484, y: 206, w: 228, title: "ColorCorrect · LUT", badge: "LUT", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }, { name: "style", type: "STYLE" }], outputs: ["IMAGE"], params: [["lut", "Kodak 2383"], ["mix", "0.72"]] },

  { id: "prev", x: 1212, y: 468, w: 256, title: "PreviewImage · 关键帧", badge: "4K", kind: "IMAGE", inputs: [{ name: "images", type: "IMAGE" }], preview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=480&q=75" },
  { id: "vid", x: 1500, y: 468, w: 216, title: "Wan2.1 · VideoCombine", badge: "MP4", kind: "VIDEO", inputs: [{ name: "image", type: "IMAGE" }, { name: "cond", type: "CONDITIONING" }], outputs: ["VIDEO"], params: [["frames", "81 · 24fps"], ["codec", "H.265 · 4K"]] },
  { id: "save", x: 1500, y: 642, w: 216, title: "SaveVideo · 发行母带", badge: "OUT", kind: "out", inputs: [{ name: "video", type: "VIDEO" }], params: [["format", "ProRes 422"]] },
];
const edges = [
  { from: "ckpt", fromPort: "MODEL", to: "lora1", toPort: "model", type: "MODEL" },
  { from: "ckpt", fromPort: "CLIP", to: "lora1", toPort: "clip", type: "CLIP" },
  { from: "lora1", fromPort: "MODEL", to: "rr_m", toPort: "in", type: "MODEL" },
  { from: "lora1", fromPort: "CLIP", to: "pos", toPort: "clip", type: "CLIP" },
  { from: "clip", fromPort: "CLIP", to: "neg", toPort: "clip", type: "CLIP" },
  { from: "vael", fromPort: "VAE", to: "rr_v", toPort: "in", type: "VAE" },

  { from: "ref", fromPort: "IMAGE", to: "depth", toPort: "image", type: "IMAGE" },
  { from: "ref", fromPort: "IMAGE", to: "ip", toPort: "image", type: "IMAGE" },
  { from: "pos", fromPort: "cond", to: "guide", toPort: "cond", type: "CONDITIONING" },
  { from: "guide", fromPort: "cond", to: "cn", toPort: "pos", type: "CONDITIONING" },
  { from: "neg", fromPort: "cond", to: "cn", toPort: "neg", type: "CONDITIONING" },
  { from: "depth", fromPort: "IMAGE", to: "cn", toPort: "image", type: "IMAGE" },

  { from: "rr_m", fromPort: "out", to: "ks1", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "ks2", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "det", toPort: "model", type: "MODEL" },
  { from: "cn", fromPort: "pos", to: "ks1", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks1", toPort: "neg", type: "CONDITIONING" },
  { from: "lat", fromPort: "LATENT", to: "ks1", toPort: "latent", type: "LATENT" },
  { from: "ks1", fromPort: "LATENT", to: "upl", toPort: "samples", type: "LATENT" },
  { from: "upl", fromPort: "LATENT", to: "ks2", toPort: "latent", type: "LATENT" },
  { from: "cn", fromPort: "pos", to: "ks2", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks2", toPort: "neg", type: "CONDITIONING" },

  { from: "ks2", fromPort: "LATENT", to: "vae", toPort: "samples", type: "LATENT" },
  { from: "rr_v", fromPort: "out", to: "vae", toPort: "vae", type: "VAE" },
  { from: "vae", fromPort: "IMAGE", to: "det", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "det", toPort: "cond", type: "CONDITIONING" },
  { from: "det", fromPort: "IMAGE", to: "ups", toPort: "image", type: "IMAGE" },
  { from: "ups", fromPort: "IMAGE", to: "lut", toPort: "image", type: "IMAGE" },
  { from: "ip", fromPort: "STYLE", to: "lut", toPort: "style", type: "STYLE" },

  { from: "lut", fromPort: "IMAGE", to: "prev", toPort: "images", type: "IMAGE" },
  { from: "lut", fromPort: "IMAGE", to: "vid", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "vid", toPort: "cond", type: "CONDITIONING" },
  { from: "vid", fromPort: "VIDEO", to: "save", toPort: "video", type: "VIDEO" },
];
</script>

<template>
  <Flow :groups="groups" :nodes="nodes" :edges="edges" label="ComfyUI 影视生图生视频工作流" />
</template>
```

Svelte 的写法：

```jsx
<script>
  import { onMount } from "svelte";
  import { createFlow } from "satin-ui/flow";

  const groups = [
    { id: "g-model", title: "01 · 基础模型与 LoRA 栈", x: 0, y: 0, w: 516, h: 358, hue: 248 },
    { id: "g-ref", title: "02 · 场景参考与空间控图", x: 14, y: 398, w: 502, h: 378, hue: 156 },
    { id: "g-prompt", title: "03 · 提示词编码与条件控图", x: 568, y: 8, w: 572, h: 362, hue: 28 },
    { id: "g-sample", title: "04 · 双阶段潜空间采样", x: 564, y: 400, w: 576, h: 396, hue: 292 },
    { id: "g-detail", title: "05 · 解码、人脸精修与 4K 超分", x: 1188, y: 12, w: 548, h: 382, hue: 208 },
    { id: "g-out", title: "06 · 关键帧预览与母带导出", x: 1192, y: 422, w: 544, h: 356, hue: 184 },
  ];
  const nodes = [
    { id: "ckpt", x: 20, y: 46, w: 224, title: "CheckpointLoaderSimple", badge: "FP8", kind: "MODEL", outputs: ["MODEL", "CLIP", "VAE"], params: [["ckpt", "flux1-dev-fp8"]] },
    { id: "clip", x: 26, y: 214, w: 214, title: "DualCLIPLoader", badge: "T5", kind: "CLIP", outputs: ["CLIP"], params: [["clip1", "t5xxl_fp8"], ["clip2", "clip_l"]] },
    { id: "lora1", x: 278, y: 46, w: 216, title: "LoraLoader · 雨夜胶片", badge: "0.82", kind: "MODEL", inputs: [{ name: "model", type: "MODEL" }, { name: "clip", type: "CLIP" }], outputs: ["MODEL", "CLIP"], params: [["lora", "rain-cinema-v2"], ["strength", "0.82"]] },
    { id: "vael", x: 282, y: 218, w: 212, title: "VAELoader · 胶片解码", badge: "BF16", kind: "VAE", outputs: ["VAE"], params: [["vae", "ae_flux_bf16"]] },

    { id: "ref", x: 34, y: 444, w: 220, title: "LoadImage · 场景参考", badge: "IMG", kind: "IMAGE", outputs: ["IMAGE", "MASK"], preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=480&q=75" },
    { id: "depth", x: 286, y: 444, w: 210, title: "DepthAnythingV2", badge: "CN", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["ckpt", "depth_v2_vitl"], ["res", "1024"]] },
    { id: "ip", x: 286, y: 604, w: 210, title: "IPAdapter · 风格迁移", badge: "0.65", kind: "STYLE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["STYLE"], params: [["weight", "0.65"], ["preset", "PLUS"]] },

    { id: "rr_m", x: 822, y: -44, title: "MODEL", reroute: true, kind: "MODEL", inputs: [{ name: "in", type: "MODEL" }], outputs: [{ name: "out", type: "MODEL" }] },
    { id: "rr_v", x: 832, y: 818, title: "VAE", reroute: true, kind: "VAE", inputs: [{ name: "in", type: "VAE" }], outputs: [{ name: "out", type: "VAE" }] },

    { id: "pos", x: 588, y: 54, w: 230, title: "CLIPTextEncode · 正向", badge: "POS", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "rainy station, 35mm"]] },
    { id: "neg", x: 588, y: 196, w: 230, title: "CLIPTextEncode · 负向", badge: "NEG", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "blurry, lowres, deform"]] },
    { id: "guide", x: 862, y: 52, w: 248, title: "FluxGuidance", badge: "3.5", kind: "CONDITIONING", inputs: [{ name: "cond", type: "CONDITIONING" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["guidance", "3.5"]] },
    { id: "cn", x: 862, y: 178, w: 254, title: "ControlNetApplyAdv", badge: "0.68", kind: "CONTROL_NET", inputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "image", type: "IMAGE" }], outputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }], params: [["strength", "0.68"], ["end", "0.85"]] },

    { id: "ks1", x: 584, y: 444, w: 248, title: "KSampler · Base", badge: "28s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "28 · euler"], ["cfg", "3.5 · denoise 1.0"]] },
    { id: "lat", x: 588, y: 652, w: 236, title: "EmptySD3Latent", badge: "16:9", kind: "LATENT", outputs: ["LATENT"], params: [["size", "1344 × 768"], ["batch", "2"]] },
    { id: "ks2", x: 872, y: 444, w: 248, title: "KSampler · Hires", badge: "14s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "14 · dpmpp_2m"], ["denoise", "0.42"]] },
    { id: "upl", x: 874, y: 652, w: 240, title: "LatentUpscaleBy", badge: "1.5×", kind: "LATENT", inputs: [{ name: "samples", type: "LATENT" }], outputs: ["LATENT"], params: [["method", "bislerp"], ["scale", "1.50"]] },

    { id: "vae", x: 1208, y: 58, w: 224, title: "VAEDecode · Tiled", badge: "VAE", kind: "VAE", inputs: [{ name: "samples", type: "LATENT" }, { name: "vae", type: "VAE" }], outputs: ["IMAGE"], params: [["tile_size", "512"]] },
    { id: "det", x: 1208, y: 208, w: 232, title: "FaceDetailer", badge: "DET", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }, { name: "model", type: "MODEL" }, { name: "cond", type: "CONDITIONING" }], outputs: ["IMAGE", "MASK"], params: [["denoise", "0.35"], ["guide", "512"]] },
    { id: "ups", x: 1484, y: 62, w: 228, title: "ImageUpscale · 4x", badge: "4×", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["model", "4x-UltraSharp"]] },
    { id: "lut", x: 1484, y: 206, w: 228, title: "ColorCorrect · LUT", badge: "LUT", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }, { name: "style", type: "STYLE" }], outputs: ["IMAGE"], params: [["lut", "Kodak 2383"], ["mix", "0.72"]] },

    { id: "prev", x: 1212, y: 468, w: 256, title: "PreviewImage · 关键帧", badge: "4K", kind: "IMAGE", inputs: [{ name: "images", type: "IMAGE" }], preview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=480&q=75" },
    { id: "vid", x: 1500, y: 468, w: 216, title: "Wan2.1 · VideoCombine", badge: "MP4", kind: "VIDEO", inputs: [{ name: "image", type: "IMAGE" }, { name: "cond", type: "CONDITIONING" }], outputs: ["VIDEO"], params: [["frames", "81 · 24fps"], ["codec", "H.265 · 4K"]] },
    { id: "save", x: 1500, y: 642, w: 216, title: "SaveVideo · 发行母带", badge: "OUT", kind: "out", inputs: [{ name: "video", type: "VIDEO" }], params: [["format", "ProRes 422"]] },
  ];
  const edges = [
    { from: "ckpt", fromPort: "MODEL", to: "lora1", toPort: "model", type: "MODEL" },
    { from: "ckpt", fromPort: "CLIP", to: "lora1", toPort: "clip", type: "CLIP" },
    { from: "lora1", fromPort: "MODEL", to: "rr_m", toPort: "in", type: "MODEL" },
    { from: "lora1", fromPort: "CLIP", to: "pos", toPort: "clip", type: "CLIP" },
    { from: "clip", fromPort: "CLIP", to: "neg", toPort: "clip", type: "CLIP" },
    { from: "vael", fromPort: "VAE", to: "rr_v", toPort: "in", type: "VAE" },

    { from: "ref", fromPort: "IMAGE", to: "depth", toPort: "image", type: "IMAGE" },
    { from: "ref", fromPort: "IMAGE", to: "ip", toPort: "image", type: "IMAGE" },
    { from: "pos", fromPort: "cond", to: "guide", toPort: "cond", type: "CONDITIONING" },
    { from: "guide", fromPort: "cond", to: "cn", toPort: "pos", type: "CONDITIONING" },
    { from: "neg", fromPort: "cond", to: "cn", toPort: "neg", type: "CONDITIONING" },
    { from: "depth", fromPort: "IMAGE", to: "cn", toPort: "image", type: "IMAGE" },

    { from: "rr_m", fromPort: "out", to: "ks1", toPort: "model", type: "MODEL" },
    { from: "rr_m", fromPort: "out", to: "ks2", toPort: "model", type: "MODEL" },
    { from: "rr_m", fromPort: "out", to: "det", toPort: "model", type: "MODEL" },
    { from: "cn", fromPort: "pos", to: "ks1", toPort: "pos", type: "CONDITIONING" },
    { from: "cn", fromPort: "neg", to: "ks1", toPort: "neg", type: "CONDITIONING" },
    { from: "lat", fromPort: "LATENT", to: "ks1", toPort: "latent", type: "LATENT" },
    { from: "ks1", fromPort: "LATENT", to: "upl", toPort: "samples", type: "LATENT" },
    { from: "upl", fromPort: "LATENT", to: "ks2", toPort: "latent", type: "LATENT" },
    { from: "cn", fromPort: "pos", to: "ks2", toPort: "pos", type: "CONDITIONING" },
    { from: "cn", fromPort: "neg", to: "ks2", toPort: "neg", type: "CONDITIONING" },

    { from: "ks2", fromPort: "LATENT", to: "vae", toPort: "samples", type: "LATENT" },
    { from: "rr_v", fromPort: "out", to: "vae", toPort: "vae", type: "VAE" },
    { from: "vae", fromPort: "IMAGE", to: "det", toPort: "image", type: "IMAGE" },
    { from: "guide", fromPort: "cond", to: "det", toPort: "cond", type: "CONDITIONING" },
    { from: "det", fromPort: "IMAGE", to: "ups", toPort: "image", type: "IMAGE" },
    { from: "ups", fromPort: "IMAGE", to: "lut", toPort: "image", type: "IMAGE" },
    { from: "ip", fromPort: "STYLE", to: "lut", toPort: "style", type: "STYLE" },

    { from: "lut", fromPort: "IMAGE", to: "prev", toPort: "images", type: "IMAGE" },
    { from: "lut", fromPort: "IMAGE", to: "vid", toPort: "image", type: "IMAGE" },
    { from: "guide", fromPort: "cond", to: "vid", toPort: "cond", type: "CONDITIONING" },
    { from: "vid", fromPort: "VIDEO", to: "save", toPort: "video", type: "VIDEO" },
  ];

  let host;
  onMount(() => {
    const f = createFlow(host, { groups, nodes, edges, label: "ComfyUI 影视生图生视频工作流" });
    return () => f?.destroy?.();
  });
</script>

<div bind:this={host}></div>
```

Angular 的写法：

```ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { createFlow } from "satin-ui/flow";

const groups = [
  { id: "g-model", title: "01 · 基础模型与 LoRA 栈", x: 0, y: 0, w: 516, h: 358, hue: 248 },
  { id: "g-ref", title: "02 · 场景参考与空间控图", x: 14, y: 398, w: 502, h: 378, hue: 156 },
  { id: "g-prompt", title: "03 · 提示词编码与条件控图", x: 568, y: 8, w: 572, h: 362, hue: 28 },
  { id: "g-sample", title: "04 · 双阶段潜空间采样", x: 564, y: 400, w: 576, h: 396, hue: 292 },
  { id: "g-detail", title: "05 · 解码、人脸精修与 4K 超分", x: 1188, y: 12, w: 548, h: 382, hue: 208 },
  { id: "g-out", title: "06 · 关键帧预览与母带导出", x: 1192, y: 422, w: 544, h: 356, hue: 184 },
];
const nodes = [
  { id: "ckpt", x: 20, y: 46, w: 224, title: "CheckpointLoaderSimple", badge: "FP8", kind: "MODEL", outputs: ["MODEL", "CLIP", "VAE"], params: [["ckpt", "flux1-dev-fp8"]] },
  { id: "clip", x: 26, y: 214, w: 214, title: "DualCLIPLoader", badge: "T5", kind: "CLIP", outputs: ["CLIP"], params: [["clip1", "t5xxl_fp8"], ["clip2", "clip_l"]] },
  { id: "lora1", x: 278, y: 46, w: 216, title: "LoraLoader · 雨夜胶片", badge: "0.82", kind: "MODEL", inputs: [{ name: "model", type: "MODEL" }, { name: "clip", type: "CLIP" }], outputs: ["MODEL", "CLIP"], params: [["lora", "rain-cinema-v2"], ["strength", "0.82"]] },
  { id: "vael", x: 282, y: 218, w: 212, title: "VAELoader · 胶片解码", badge: "BF16", kind: "VAE", outputs: ["VAE"], params: [["vae", "ae_flux_bf16"]] },

  { id: "ref", x: 34, y: 444, w: 220, title: "LoadImage · 场景参考", badge: "IMG", kind: "IMAGE", outputs: ["IMAGE", "MASK"], preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=480&q=75" },
  { id: "depth", x: 286, y: 444, w: 210, title: "DepthAnythingV2", badge: "CN", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["ckpt", "depth_v2_vitl"], ["res", "1024"]] },
  { id: "ip", x: 286, y: 604, w: 210, title: "IPAdapter · 风格迁移", badge: "0.65", kind: "STYLE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["STYLE"], params: [["weight", "0.65"], ["preset", "PLUS"]] },

  { id: "rr_m", x: 822, y: -44, title: "MODEL", reroute: true, kind: "MODEL", inputs: [{ name: "in", type: "MODEL" }], outputs: [{ name: "out", type: "MODEL" }] },
  { id: "rr_v", x: 832, y: 818, title: "VAE", reroute: true, kind: "VAE", inputs: [{ name: "in", type: "VAE" }], outputs: [{ name: "out", type: "VAE" }] },

  { id: "pos", x: 588, y: 54, w: 230, title: "CLIPTextEncode · 正向", badge: "POS", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "rainy station, 35mm"]] },
  { id: "neg", x: 588, y: 196, w: 230, title: "CLIPTextEncode · 负向", badge: "NEG", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "blurry, lowres, deform"]] },
  { id: "guide", x: 862, y: 52, w: 248, title: "FluxGuidance", badge: "3.5", kind: "CONDITIONING", inputs: [{ name: "cond", type: "CONDITIONING" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["guidance", "3.5"]] },
  { id: "cn", x: 862, y: 178, w: 254, title: "ControlNetApplyAdv", badge: "0.68", kind: "CONTROL_NET", inputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "image", type: "IMAGE" }], outputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }], params: [["strength", "0.68"], ["end", "0.85"]] },

  { id: "ks1", x: 584, y: 444, w: 248, title: "KSampler · Base", badge: "28s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "28 · euler"], ["cfg", "3.5 · denoise 1.0"]] },
  { id: "lat", x: 588, y: 652, w: 236, title: "EmptySD3Latent", badge: "16:9", kind: "LATENT", outputs: ["LATENT"], params: [["size", "1344 × 768"], ["batch", "2"]] },
  { id: "ks2", x: 872, y: 444, w: 248, title: "KSampler · Hires", badge: "14s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "14 · dpmpp_2m"], ["denoise", "0.42"]] },
  { id: "upl", x: 874, y: 652, w: 240, title: "LatentUpscaleBy", badge: "1.5×", kind: "LATENT", inputs: [{ name: "samples", type: "LATENT" }], outputs: ["LATENT"], params: [["method", "bislerp"], ["scale", "1.50"]] },

  { id: "vae", x: 1208, y: 58, w: 224, title: "VAEDecode · Tiled", badge: "VAE", kind: "VAE", inputs: [{ name: "samples", type: "LATENT" }, { name: "vae", type: "VAE" }], outputs: ["IMAGE"], params: [["tile_size", "512"]] },
  { id: "det", x: 1208, y: 208, w: 232, title: "FaceDetailer", badge: "DET", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }, { name: "model", type: "MODEL" }, { name: "cond", type: "CONDITIONING" }], outputs: ["IMAGE", "MASK"], params: [["denoise", "0.35"], ["guide", "512"]] },
  { id: "ups", x: 1484, y: 62, w: 228, title: "ImageUpscale · 4x", badge: "4×", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["model", "4x-UltraSharp"]] },
  { id: "lut", x: 1484, y: 206, w: 228, title: "ColorCorrect · LUT", badge: "LUT", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }, { name: "style", type: "STYLE" }], outputs: ["IMAGE"], params: [["lut", "Kodak 2383"], ["mix", "0.72"]] },

  { id: "prev", x: 1212, y: 468, w: 256, title: "PreviewImage · 关键帧", badge: "4K", kind: "IMAGE", inputs: [{ name: "images", type: "IMAGE" }], preview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=480&q=75" },
  { id: "vid", x: 1500, y: 468, w: 216, title: "Wan2.1 · VideoCombine", badge: "MP4", kind: "VIDEO", inputs: [{ name: "image", type: "IMAGE" }, { name: "cond", type: "CONDITIONING" }], outputs: ["VIDEO"], params: [["frames", "81 · 24fps"], ["codec", "H.265 · 4K"]] },
  { id: "save", x: 1500, y: 642, w: 216, title: "SaveVideo · 发行母带", badge: "OUT", kind: "out", inputs: [{ name: "video", type: "VIDEO" }], params: [["format", "ProRes 422"]] },
];
const edges = [
  { from: "ckpt", fromPort: "MODEL", to: "lora1", toPort: "model", type: "MODEL" },
  { from: "ckpt", fromPort: "CLIP", to: "lora1", toPort: "clip", type: "CLIP" },
  { from: "lora1", fromPort: "MODEL", to: "rr_m", toPort: "in", type: "MODEL" },
  { from: "lora1", fromPort: "CLIP", to: "pos", toPort: "clip", type: "CLIP" },
  { from: "clip", fromPort: "CLIP", to: "neg", toPort: "clip", type: "CLIP" },
  { from: "vael", fromPort: "VAE", to: "rr_v", toPort: "in", type: "VAE" },

  { from: "ref", fromPort: "IMAGE", to: "depth", toPort: "image", type: "IMAGE" },
  { from: "ref", fromPort: "IMAGE", to: "ip", toPort: "image", type: "IMAGE" },
  { from: "pos", fromPort: "cond", to: "guide", toPort: "cond", type: "CONDITIONING" },
  { from: "guide", fromPort: "cond", to: "cn", toPort: "pos", type: "CONDITIONING" },
  { from: "neg", fromPort: "cond", to: "cn", toPort: "neg", type: "CONDITIONING" },
  { from: "depth", fromPort: "IMAGE", to: "cn", toPort: "image", type: "IMAGE" },

  { from: "rr_m", fromPort: "out", to: "ks1", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "ks2", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "det", toPort: "model", type: "MODEL" },
  { from: "cn", fromPort: "pos", to: "ks1", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks1", toPort: "neg", type: "CONDITIONING" },
  { from: "lat", fromPort: "LATENT", to: "ks1", toPort: "latent", type: "LATENT" },
  { from: "ks1", fromPort: "LATENT", to: "upl", toPort: "samples", type: "LATENT" },
  { from: "upl", fromPort: "LATENT", to: "ks2", toPort: "latent", type: "LATENT" },
  { from: "cn", fromPort: "pos", to: "ks2", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks2", toPort: "neg", type: "CONDITIONING" },

  { from: "ks2", fromPort: "LATENT", to: "vae", toPort: "samples", type: "LATENT" },
  { from: "rr_v", fromPort: "out", to: "vae", toPort: "vae", type: "VAE" },
  { from: "vae", fromPort: "IMAGE", to: "det", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "det", toPort: "cond", type: "CONDITIONING" },
  { from: "det", fromPort: "IMAGE", to: "ups", toPort: "image", type: "IMAGE" },
  { from: "ups", fromPort: "IMAGE", to: "lut", toPort: "image", type: "IMAGE" },
  { from: "ip", fromPort: "STYLE", to: "lut", toPort: "style", type: "STYLE" },

  { from: "lut", fromPort: "IMAGE", to: "prev", toPort: "images", type: "IMAGE" },
  { from: "lut", fromPort: "IMAGE", to: "vid", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "vid", toPort: "cond", type: "CONDITIONING" },
  { from: "vid", fromPort: "VIDEO", to: "save", toPort: "video", type: "VIDEO" },
];

@Component({
  selector: "demo-flowstress-many",
  standalone: true,
  template: `<div #host></div>`,
})
export class DemoFlowstressMany implements AfterViewInit, OnDestroy {
  @ViewChild("host") host!: ElementRef<HTMLElement>;
  private inst: ReturnType<typeof createFlow> | null = null;
  ngAfterViewInit() {
    this.inst = createFlow(this.host.nativeElement, { groups, nodes, edges, label: "ComfyUI 影视生图生视频工作流" });
  }
  ngOnDestroy() { this.inst?.destroy?.(); }
}
```

Solid 的写法：

```jsx
import { onMount, onCleanup } from "solid-js";
import { createFlow } from "satin-ui/flow";

const groups = [
  { id: "g-model", title: "01 · 基础模型与 LoRA 栈", x: 0, y: 0, w: 516, h: 358, hue: 248 },
  { id: "g-ref", title: "02 · 场景参考与空间控图", x: 14, y: 398, w: 502, h: 378, hue: 156 },
  { id: "g-prompt", title: "03 · 提示词编码与条件控图", x: 568, y: 8, w: 572, h: 362, hue: 28 },
  { id: "g-sample", title: "04 · 双阶段潜空间采样", x: 564, y: 400, w: 576, h: 396, hue: 292 },
  { id: "g-detail", title: "05 · 解码、人脸精修与 4K 超分", x: 1188, y: 12, w: 548, h: 382, hue: 208 },
  { id: "g-out", title: "06 · 关键帧预览与母带导出", x: 1192, y: 422, w: 544, h: 356, hue: 184 },
];
const nodes = [
  { id: "ckpt", x: 20, y: 46, w: 224, title: "CheckpointLoaderSimple", badge: "FP8", kind: "MODEL", outputs: ["MODEL", "CLIP", "VAE"], params: [["ckpt", "flux1-dev-fp8"]] },
  { id: "clip", x: 26, y: 214, w: 214, title: "DualCLIPLoader", badge: "T5", kind: "CLIP", outputs: ["CLIP"], params: [["clip1", "t5xxl_fp8"], ["clip2", "clip_l"]] },
  { id: "lora1", x: 278, y: 46, w: 216, title: "LoraLoader · 雨夜胶片", badge: "0.82", kind: "MODEL", inputs: [{ name: "model", type: "MODEL" }, { name: "clip", type: "CLIP" }], outputs: ["MODEL", "CLIP"], params: [["lora", "rain-cinema-v2"], ["strength", "0.82"]] },
  { id: "vael", x: 282, y: 218, w: 212, title: "VAELoader · 胶片解码", badge: "BF16", kind: "VAE", outputs: ["VAE"], params: [["vae", "ae_flux_bf16"]] },

  { id: "ref", x: 34, y: 444, w: 220, title: "LoadImage · 场景参考", badge: "IMG", kind: "IMAGE", outputs: ["IMAGE", "MASK"], preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=480&q=75" },
  { id: "depth", x: 286, y: 444, w: 210, title: "DepthAnythingV2", badge: "CN", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["ckpt", "depth_v2_vitl"], ["res", "1024"]] },
  { id: "ip", x: 286, y: 604, w: 210, title: "IPAdapter · 风格迁移", badge: "0.65", kind: "STYLE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["STYLE"], params: [["weight", "0.65"], ["preset", "PLUS"]] },

  { id: "rr_m", x: 822, y: -44, title: "MODEL", reroute: true, kind: "MODEL", inputs: [{ name: "in", type: "MODEL" }], outputs: [{ name: "out", type: "MODEL" }] },
  { id: "rr_v", x: 832, y: 818, title: "VAE", reroute: true, kind: "VAE", inputs: [{ name: "in", type: "VAE" }], outputs: [{ name: "out", type: "VAE" }] },

  { id: "pos", x: 588, y: 54, w: 230, title: "CLIPTextEncode · 正向", badge: "POS", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "rainy station, 35mm"]] },
  { id: "neg", x: 588, y: 196, w: 230, title: "CLIPTextEncode · 负向", badge: "NEG", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "blurry, lowres, deform"]] },
  { id: "guide", x: 862, y: 52, w: 248, title: "FluxGuidance", badge: "3.5", kind: "CONDITIONING", inputs: [{ name: "cond", type: "CONDITIONING" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["guidance", "3.5"]] },
  { id: "cn", x: 862, y: 178, w: 254, title: "ControlNetApplyAdv", badge: "0.68", kind: "CONTROL_NET", inputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "image", type: "IMAGE" }], outputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }], params: [["strength", "0.68"], ["end", "0.85"]] },

  { id: "ks1", x: 584, y: 444, w: 248, title: "KSampler · Base", badge: "28s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "28 · euler"], ["cfg", "3.5 · denoise 1.0"]] },
  { id: "lat", x: 588, y: 652, w: 236, title: "EmptySD3Latent", badge: "16:9", kind: "LATENT", outputs: ["LATENT"], params: [["size", "1344 × 768"], ["batch", "2"]] },
  { id: "ks2", x: 872, y: 444, w: 248, title: "KSampler · Hires", badge: "14s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "14 · dpmpp_2m"], ["denoise", "0.42"]] },
  { id: "upl", x: 874, y: 652, w: 240, title: "LatentUpscaleBy", badge: "1.5×", kind: "LATENT", inputs: [{ name: "samples", type: "LATENT" }], outputs: ["LATENT"], params: [["method", "bislerp"], ["scale", "1.50"]] },

  { id: "vae", x: 1208, y: 58, w: 224, title: "VAEDecode · Tiled", badge: "VAE", kind: "VAE", inputs: [{ name: "samples", type: "LATENT" }, { name: "vae", type: "VAE" }], outputs: ["IMAGE"], params: [["tile_size", "512"]] },
  { id: "det", x: 1208, y: 208, w: 232, title: "FaceDetailer", badge: "DET", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }, { name: "model", type: "MODEL" }, { name: "cond", type: "CONDITIONING" }], outputs: ["IMAGE", "MASK"], params: [["denoise", "0.35"], ["guide", "512"]] },
  { id: "ups", x: 1484, y: 62, w: 228, title: "ImageUpscale · 4x", badge: "4×", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["model", "4x-UltraSharp"]] },
  { id: "lut", x: 1484, y: 206, w: 228, title: "ColorCorrect · LUT", badge: "LUT", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }, { name: "style", type: "STYLE" }], outputs: ["IMAGE"], params: [["lut", "Kodak 2383"], ["mix", "0.72"]] },

  { id: "prev", x: 1212, y: 468, w: 256, title: "PreviewImage · 关键帧", badge: "4K", kind: "IMAGE", inputs: [{ name: "images", type: "IMAGE" }], preview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=480&q=75" },
  { id: "vid", x: 1500, y: 468, w: 216, title: "Wan2.1 · VideoCombine", badge: "MP4", kind: "VIDEO", inputs: [{ name: "image", type: "IMAGE" }, { name: "cond", type: "CONDITIONING" }], outputs: ["VIDEO"], params: [["frames", "81 · 24fps"], ["codec", "H.265 · 4K"]] },
  { id: "save", x: 1500, y: 642, w: 216, title: "SaveVideo · 发行母带", badge: "OUT", kind: "out", inputs: [{ name: "video", type: "VIDEO" }], params: [["format", "ProRes 422"]] },
];
const edges = [
  { from: "ckpt", fromPort: "MODEL", to: "lora1", toPort: "model", type: "MODEL" },
  { from: "ckpt", fromPort: "CLIP", to: "lora1", toPort: "clip", type: "CLIP" },
  { from: "lora1", fromPort: "MODEL", to: "rr_m", toPort: "in", type: "MODEL" },
  { from: "lora1", fromPort: "CLIP", to: "pos", toPort: "clip", type: "CLIP" },
  { from: "clip", fromPort: "CLIP", to: "neg", toPort: "clip", type: "CLIP" },
  { from: "vael", fromPort: "VAE", to: "rr_v", toPort: "in", type: "VAE" },

  { from: "ref", fromPort: "IMAGE", to: "depth", toPort: "image", type: "IMAGE" },
  { from: "ref", fromPort: "IMAGE", to: "ip", toPort: "image", type: "IMAGE" },
  { from: "pos", fromPort: "cond", to: "guide", toPort: "cond", type: "CONDITIONING" },
  { from: "guide", fromPort: "cond", to: "cn", toPort: "pos", type: "CONDITIONING" },
  { from: "neg", fromPort: "cond", to: "cn", toPort: "neg", type: "CONDITIONING" },
  { from: "depth", fromPort: "IMAGE", to: "cn", toPort: "image", type: "IMAGE" },

  { from: "rr_m", fromPort: "out", to: "ks1", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "ks2", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "det", toPort: "model", type: "MODEL" },
  { from: "cn", fromPort: "pos", to: "ks1", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks1", toPort: "neg", type: "CONDITIONING" },
  { from: "lat", fromPort: "LATENT", to: "ks1", toPort: "latent", type: "LATENT" },
  { from: "ks1", fromPort: "LATENT", to: "upl", toPort: "samples", type: "LATENT" },
  { from: "upl", fromPort: "LATENT", to: "ks2", toPort: "latent", type: "LATENT" },
  { from: "cn", fromPort: "pos", to: "ks2", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks2", toPort: "neg", type: "CONDITIONING" },

  { from: "ks2", fromPort: "LATENT", to: "vae", toPort: "samples", type: "LATENT" },
  { from: "rr_v", fromPort: "out", to: "vae", toPort: "vae", type: "VAE" },
  { from: "vae", fromPort: "IMAGE", to: "det", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "det", toPort: "cond", type: "CONDITIONING" },
  { from: "det", fromPort: "IMAGE", to: "ups", toPort: "image", type: "IMAGE" },
  { from: "ups", fromPort: "IMAGE", to: "lut", toPort: "image", type: "IMAGE" },
  { from: "ip", fromPort: "STYLE", to: "lut", toPort: "style", type: "STYLE" },

  { from: "lut", fromPort: "IMAGE", to: "prev", toPort: "images", type: "IMAGE" },
  { from: "lut", fromPort: "IMAGE", to: "vid", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "vid", toPort: "cond", type: "CONDITIONING" },
  { from: "vid", fromPort: "VIDEO", to: "save", toPort: "video", type: "VIDEO" },
];

export default function Demo() {
  let host;
  onMount(() => {
    const f = createFlow(host, { groups, nodes, edges, label: "ComfyUI 影视生图生视频工作流" });
    onCleanup(() => f?.destroy?.());
  });
  return <div ref={host} />;
}
```

Preact 的写法：

```jsx
import { useEffect, useRef } from "preact/hooks";
import { createFlow } from "satin-ui/flow";

const groups = [
  { id: "g-model", title: "01 · 基础模型与 LoRA 栈", x: 0, y: 0, w: 516, h: 358, hue: 248 },
  { id: "g-ref", title: "02 · 场景参考与空间控图", x: 14, y: 398, w: 502, h: 378, hue: 156 },
  { id: "g-prompt", title: "03 · 提示词编码与条件控图", x: 568, y: 8, w: 572, h: 362, hue: 28 },
  { id: "g-sample", title: "04 · 双阶段潜空间采样", x: 564, y: 400, w: 576, h: 396, hue: 292 },
  { id: "g-detail", title: "05 · 解码、人脸精修与 4K 超分", x: 1188, y: 12, w: 548, h: 382, hue: 208 },
  { id: "g-out", title: "06 · 关键帧预览与母带导出", x: 1192, y: 422, w: 544, h: 356, hue: 184 },
];
const nodes = [
  { id: "ckpt", x: 20, y: 46, w: 224, title: "CheckpointLoaderSimple", badge: "FP8", kind: "MODEL", outputs: ["MODEL", "CLIP", "VAE"], params: [["ckpt", "flux1-dev-fp8"]] },
  { id: "clip", x: 26, y: 214, w: 214, title: "DualCLIPLoader", badge: "T5", kind: "CLIP", outputs: ["CLIP"], params: [["clip1", "t5xxl_fp8"], ["clip2", "clip_l"]] },
  { id: "lora1", x: 278, y: 46, w: 216, title: "LoraLoader · 雨夜胶片", badge: "0.82", kind: "MODEL", inputs: [{ name: "model", type: "MODEL" }, { name: "clip", type: "CLIP" }], outputs: ["MODEL", "CLIP"], params: [["lora", "rain-cinema-v2"], ["strength", "0.82"]] },
  { id: "vael", x: 282, y: 218, w: 212, title: "VAELoader · 胶片解码", badge: "BF16", kind: "VAE", outputs: ["VAE"], params: [["vae", "ae_flux_bf16"]] },

  { id: "ref", x: 34, y: 444, w: 220, title: "LoadImage · 场景参考", badge: "IMG", kind: "IMAGE", outputs: ["IMAGE", "MASK"], preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=480&q=75" },
  { id: "depth", x: 286, y: 444, w: 210, title: "DepthAnythingV2", badge: "CN", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["ckpt", "depth_v2_vitl"], ["res", "1024"]] },
  { id: "ip", x: 286, y: 604, w: 210, title: "IPAdapter · 风格迁移", badge: "0.65", kind: "STYLE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["STYLE"], params: [["weight", "0.65"], ["preset", "PLUS"]] },

  { id: "rr_m", x: 822, y: -44, title: "MODEL", reroute: true, kind: "MODEL", inputs: [{ name: "in", type: "MODEL" }], outputs: [{ name: "out", type: "MODEL" }] },
  { id: "rr_v", x: 832, y: 818, title: "VAE", reroute: true, kind: "VAE", inputs: [{ name: "in", type: "VAE" }], outputs: [{ name: "out", type: "VAE" }] },

  { id: "pos", x: 588, y: 54, w: 230, title: "CLIPTextEncode · 正向", badge: "POS", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "rainy station, 35mm"]] },
  { id: "neg", x: 588, y: 196, w: 230, title: "CLIPTextEncode · 负向", badge: "NEG", kind: "CONDITIONING", inputs: [{ name: "clip", type: "CLIP" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["prompt", "blurry, lowres, deform"]] },
  { id: "guide", x: 862, y: 52, w: 248, title: "FluxGuidance", badge: "3.5", kind: "CONDITIONING", inputs: [{ name: "cond", type: "CONDITIONING" }], outputs: [{ name: "cond", type: "CONDITIONING" }], params: [["guidance", "3.5"]] },
  { id: "cn", x: 862, y: 178, w: 254, title: "ControlNetApplyAdv", badge: "0.68", kind: "CONTROL_NET", inputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "image", type: "IMAGE" }], outputs: [{ name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }], params: [["strength", "0.68"], ["end", "0.85"]] },

  { id: "ks1", x: 584, y: 444, w: 248, title: "KSampler · Base", badge: "28s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "28 · euler"], ["cfg", "3.5 · denoise 1.0"]] },
  { id: "lat", x: 588, y: 652, w: 236, title: "EmptySD3Latent", badge: "16:9", kind: "LATENT", outputs: ["LATENT"], params: [["size", "1344 × 768"], ["batch", "2"]] },
  { id: "ks2", x: 872, y: 444, w: 248, title: "KSampler · Hires", badge: "14s", kind: "LATENT", inputs: [{ name: "model", type: "MODEL" }, { name: "pos", type: "CONDITIONING" }, { name: "neg", type: "CONDITIONING" }, { name: "latent", type: "LATENT" }], outputs: ["LATENT"], params: [["steps", "14 · dpmpp_2m"], ["denoise", "0.42"]] },
  { id: "upl", x: 874, y: 652, w: 240, title: "LatentUpscaleBy", badge: "1.5×", kind: "LATENT", inputs: [{ name: "samples", type: "LATENT" }], outputs: ["LATENT"], params: [["method", "bislerp"], ["scale", "1.50"]] },

  { id: "vae", x: 1208, y: 58, w: 224, title: "VAEDecode · Tiled", badge: "VAE", kind: "VAE", inputs: [{ name: "samples", type: "LATENT" }, { name: "vae", type: "VAE" }], outputs: ["IMAGE"], params: [["tile_size", "512"]] },
  { id: "det", x: 1208, y: 208, w: 232, title: "FaceDetailer", badge: "DET", kind: "CONTROL_NET", inputs: [{ name: "image", type: "IMAGE" }, { name: "model", type: "MODEL" }, { name: "cond", type: "CONDITIONING" }], outputs: ["IMAGE", "MASK"], params: [["denoise", "0.35"], ["guide", "512"]] },
  { id: "ups", x: 1484, y: 62, w: 228, title: "ImageUpscale · 4x", badge: "4×", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }], outputs: ["IMAGE"], params: [["model", "4x-UltraSharp"]] },
  { id: "lut", x: 1484, y: 206, w: 228, title: "ColorCorrect · LUT", badge: "LUT", kind: "IMAGE", inputs: [{ name: "image", type: "IMAGE" }, { name: "style", type: "STYLE" }], outputs: ["IMAGE"], params: [["lut", "Kodak 2383"], ["mix", "0.72"]] },

  { id: "prev", x: 1212, y: 468, w: 256, title: "PreviewImage · 关键帧", badge: "4K", kind: "IMAGE", inputs: [{ name: "images", type: "IMAGE" }], preview: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=480&q=75" },
  { id: "vid", x: 1500, y: 468, w: 216, title: "Wan2.1 · VideoCombine", badge: "MP4", kind: "VIDEO", inputs: [{ name: "image", type: "IMAGE" }, { name: "cond", type: "CONDITIONING" }], outputs: ["VIDEO"], params: [["frames", "81 · 24fps"], ["codec", "H.265 · 4K"]] },
  { id: "save", x: 1500, y: 642, w: 216, title: "SaveVideo · 发行母带", badge: "OUT", kind: "out", inputs: [{ name: "video", type: "VIDEO" }], params: [["format", "ProRes 422"]] },
];
const edges = [
  { from: "ckpt", fromPort: "MODEL", to: "lora1", toPort: "model", type: "MODEL" },
  { from: "ckpt", fromPort: "CLIP", to: "lora1", toPort: "clip", type: "CLIP" },
  { from: "lora1", fromPort: "MODEL", to: "rr_m", toPort: "in", type: "MODEL" },
  { from: "lora1", fromPort: "CLIP", to: "pos", toPort: "clip", type: "CLIP" },
  { from: "clip", fromPort: "CLIP", to: "neg", toPort: "clip", type: "CLIP" },
  { from: "vael", fromPort: "VAE", to: "rr_v", toPort: "in", type: "VAE" },

  { from: "ref", fromPort: "IMAGE", to: "depth", toPort: "image", type: "IMAGE" },
  { from: "ref", fromPort: "IMAGE", to: "ip", toPort: "image", type: "IMAGE" },
  { from: "pos", fromPort: "cond", to: "guide", toPort: "cond", type: "CONDITIONING" },
  { from: "guide", fromPort: "cond", to: "cn", toPort: "pos", type: "CONDITIONING" },
  { from: "neg", fromPort: "cond", to: "cn", toPort: "neg", type: "CONDITIONING" },
  { from: "depth", fromPort: "IMAGE", to: "cn", toPort: "image", type: "IMAGE" },

  { from: "rr_m", fromPort: "out", to: "ks1", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "ks2", toPort: "model", type: "MODEL" },
  { from: "rr_m", fromPort: "out", to: "det", toPort: "model", type: "MODEL" },
  { from: "cn", fromPort: "pos", to: "ks1", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks1", toPort: "neg", type: "CONDITIONING" },
  { from: "lat", fromPort: "LATENT", to: "ks1", toPort: "latent", type: "LATENT" },
  { from: "ks1", fromPort: "LATENT", to: "upl", toPort: "samples", type: "LATENT" },
  { from: "upl", fromPort: "LATENT", to: "ks2", toPort: "latent", type: "LATENT" },
  { from: "cn", fromPort: "pos", to: "ks2", toPort: "pos", type: "CONDITIONING" },
  { from: "cn", fromPort: "neg", to: "ks2", toPort: "neg", type: "CONDITIONING" },

  { from: "ks2", fromPort: "LATENT", to: "vae", toPort: "samples", type: "LATENT" },
  { from: "rr_v", fromPort: "out", to: "vae", toPort: "vae", type: "VAE" },
  { from: "vae", fromPort: "IMAGE", to: "det", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "det", toPort: "cond", type: "CONDITIONING" },
  { from: "det", fromPort: "IMAGE", to: "ups", toPort: "image", type: "IMAGE" },
  { from: "ups", fromPort: "IMAGE", to: "lut", toPort: "image", type: "IMAGE" },
  { from: "ip", fromPort: "STYLE", to: "lut", toPort: "style", type: "STYLE" },

  { from: "lut", fromPort: "IMAGE", to: "prev", toPort: "images", type: "IMAGE" },
  { from: "lut", fromPort: "IMAGE", to: "vid", toPort: "image", type: "IMAGE" },
  { from: "guide", fromPort: "cond", to: "vid", toPort: "cond", type: "CONDITIONING" },
  { from: "vid", fromPort: "VIDEO", to: "save", toPort: "video", type: "VIDEO" },
];

export default function Demo() {
  const ref = useRef(null);
  useEffect(() => {
    const f = createFlow(ref.current, { groups, nodes, edges, label: "ComfyUI 影视生图生视频工作流" });
    return () => f?.destroy?.();
  }, []);
  return <div ref={ref} />;
}
```

## 无障碍

- 画布里的内容读屏读不到：重要的数据另外给列表或搜索。

## 设计规范

- 这样做：卡片本体保持纯净中性，语义色仅用于端口圆点、细连线与极淡群组边界，绝不堆彩色渐变底或光晕阴影。

| 动效 | 曲线 | 时长 |
|---|---|---|
| 悬停激活：信号顺着输出端口往后传三层 | `ease.out` | 每层晚 110ms，每条线 200ms |

## 验收要点

- 只画看得见的：按 1024px 的格子建空间索引，视口外的节点和线一个都不碰；视口盖住大半张图时直接按编号扫线，不翻格子。
- 线多了就抽样：一帧最多画 2 万条直线或 6 千条曲线，多出来的按编号均匀抽（线的编号生成时打乱过），抽样率取 2 的幂，平移时不闪；线的透明度跟着这一帧画了多少条走，越多越淡，叠起来是一层网。
- 细节分级：缩放小于 20% 是色块和直线；小于 55% 是圆角卡片和曲线；再近才画标题、说明和端口。同一种颜色的线和块一次画完。
- 激活：悬停或钉住一张卡，信号往后传三层，每层晚 110ms，每条线 200ms 从起点长到终点，越往后越淡；其余的线压暗，进来的线用中性色标出。线始终 1px，不加光晕。
- 拖卡片：连线跟着走，被拖的卡压在最上面、带一层投影；松手后在后台线程重建空间索引，建好之前拖过的卡单独处理。只在视图、悬停、拖动或激活动画进行的那一帧重画。
- DOM 版流程图（上一节）适合几十到几百个节点：每个节点是可交互的卡片；超过这个量级换成画布版。

## 规则

- 只画看得见的：按 1024px 的格子建空间索引，视口外的节点和线一个都不碰；视口盖住大半张图时直接按编号扫线，不翻格子。
- 线多了就抽样：一帧最多画 2 万条直线或 6 千条曲线，多出来的按编号均匀抽（线的编号生成时打乱过），抽样率取 2 的幂，平移时不闪；线的透明度跟着这一帧画了多少条走，越多越淡，叠起来是一层网。
- 细节分级：缩放小于 20% 是色块和直线；小于 55% 是圆角卡片和曲线；再近才画标题、说明和端口。同一种颜色的线和块一次画完。
- 激活：悬停或钉住一张卡，信号往后传三层，每层晚 110ms，每条线 200ms 从起点长到终点，越往后越淡；其余的线压暗，进来的线用中性色标出。线始终 1px，不加光晕。
- 拖卡片：连线跟着走，被拖的卡压在最上面、带一层投影；松手后在后台线程重建空间索引，建好之前拖过的卡单独处理。只在视图、悬停、拖动或激活动画进行的那一帧重画。
- DOM 版流程图（上一节）适合几十到几百个节点：每个节点是可交互的卡片；超过这个量级换成画布版。

