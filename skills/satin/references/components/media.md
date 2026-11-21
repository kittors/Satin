# 视频与音频 · Player

> 组件 id：`media`　分组：媒体与上传

控制条叠在画面上，用玻璃材质（09 号 §10）；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来（指针停在控制条上时不淡出）。进度每帧连续往前走；点进度条跳过去有 150ms 的过渡，拖动时跟手。悬停喇叭展开音量条；全屏、画中画都是真的（画面是一块画布实时画出来，再喂给 ）。

## 验收要点

- 进度条、音量条只改 scale 和 translate，每帧由 rAF 推进；时间文字只在秒数变了的时候改。
- 音量：点喇叭静音 / 取消静音（取消时回到原来的音量），悬停展开音量条，拖动或方向键调节；喇叭的两道声波跟着音量多少淡入淡出，静音时换成叉号。
- 键盘：空格或 K 播放暂停，左右键快退快进 5 秒，上下键调音量，M 静音，F 全屏，P 画中画；点画面就是播放 / 暂停，连续点也只切播放暂停，不当成双击进全屏（全屏用按钮或 F 键）。键盘调音量、快进快退时画面中间出一个小提示，0.7 秒后淡出。
- 画中画：进了画中画，原来的位置压暗，写"正在画中画里播放"，点"回到这里播放"收回；画中画窗口里的播放暂停和这里同步（Media Session）。浏览器不支持画中画时不显示这个按钮。
- 音频：三层同样的波形叠在一起——底层灰、悬停预览一层、播放过的一层，后两层用 clip-path 按进度裁出来，所以是连续地亮过去，不是一根一根跳；播完 0.4 秒后平滑回到开头。

## 写法

### 视频

| 名称 | 说明 |
|---|---|
| createPlayer(容器, { src, poster, label, onError }) | 空容器：按选项渲染播放器并接上；已有 .sn-player 标记：直接接上。实例上有 play()、pause()、toggle()、video |
| createPlayer.html({ src, poster, label }) | 只要播放器的标记（纯字符串，服务端渲染也能用） |

### 音频

| 名称 | 说明 |
|---|---|
| createAudio(容器, { src, title, sub, wave, onError }) | 同上；同一时间只放一个 |
| createAudio.html({ src, title, sub, wave }) | 音频条的标记；wave：波形数据地址（Mixkit 的音乐自动找） |

## 用法

```js
import { toast } from "satin-ui/components";
import { createPlayer, createAudio } from "satin-ui/components";

// 视频：缓冲转圈、拖动进度、音量、画中画、全屏、键盘；不动时控件自己藏起来。在写好的播放器标记上接交互（也可以给空容器按选项渲染）
createPlayer(document.querySelector("#player"), { onError: () => toast({ icon: "circle-x", tone: "danger", text: "视频没能加载，检查网络后再试", alert: true }) });

// 音频：波形从音频本身算出来（拿不到就画平线，不编造）；同一时间只放一个
createAudio(document.querySelector("#audio"), { onError: () => toast({ icon: "circle-x", tone: "danger", text: "音频没能加载，检查网络后再试", alert: true }) });
// 列表里加一行：先插标记（createAudio.html({ src, title, sub }) 生成），再在这行标记上 createAudio(那一行)
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-player" id="player" tabindex="0" aria-label="视频播放器：夜里安静的街道"><video class="sn-frame" playsinline preload="metadata" disableremoteplayback="" src="https://assets.mixkit.co/videos/4451/4451-720.mp4"></video>
<div class="sn-pip-note"><span data-i="picture-in-picture-2"></span><b>正在画中画里播放</b><button class="sn-btn sn-secondary sn-sm" data-pip-back="">回到这里播放</button></div>
<div class="sn-hud" aria-live="polite"></div><span class="sn-spinner sn-pl-spin" aria-hidden="true"></span>
<button class="sn-big-play sn-glass" aria-label="播放"><span data-i="play"></span></button>
<div class="sn-ctrl sn-glass"><button class="sn-pb" data-play="" aria-label="播放" data-tip="播放" data-kbd="空格"><span class="sn-swap"><span class="sn-a" data-i="play"></span><span class="sn-b" data-i="pause"></span></span></button><span class="sn-time"><span data-cur="">0:00</span> / <span data-dur="">0:00</span></span>
<div class="sn-scrub" data-scrub="" role="slider" aria-label="进度" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0"><span class="sn-buf"></span><span class="sn-fill"></span><span class="sn-knob"></span><span class="sn-hover-t">0:00</span></div>
<div class="sn-vol" data-lv="2"><button class="sn-pb" data-mute="" aria-label="静音" data-tip="静音" data-kbd="M"><svg class="sn-ic sn-vol-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path class="sn-w1" d="M16 9a5 5 0 0 1 0 6" /><path class="sn-w2" d="M19.364 18.364a9 9 0 0 0 0-12.728" /><path class="sn-x" d="m16 9 6 6m0-6-6 6" /></svg></button><div class="sn-vs" role="slider" tabindex="0" aria-label="音量" aria-valuemin="0" aria-valuemax="100" aria-valuenow="80"><span class="sn-fill"></span><span class="sn-knob"></span></div></div>
<button class="sn-pb" data-pip="" aria-label="画中画" data-tip="画中画" data-kbd="P" data-i="picture-in-picture-2"></button><button class="sn-pb" data-fs="" aria-label="全屏" data-tip="全屏" data-kbd="F"><span class="sn-swap"><span class="sn-a" data-i="maximize-2"></span><span class="sn-b" data-i="minimize-2"></span></span></button></div></div>
<div class="sn-audio-row" id="audio" data-src="https://assets.mixkit.co/music/127/127.mp3"><button class="sn-play" aria-label="播放"><span class="sn-swap"><span class="sn-a" data-i="play"></span><span class="sn-b" data-i="pause"></span></span></button><div class="sn-who"><b>Valley Sunset</b><span>Al
<!-- ……后面还有，略 -->
```

## 规则

- 进度条、音量条只改 `scale` 和 `translate`，每帧由 rAF 推进；时间文字只在秒数变了的时候改。
- 音量：点喇叭静音 / 取消静音（取消时回到原来的音量），悬停展开音量条，拖动或方向键调节；喇叭的两道声波跟着音量多少淡入淡出，静音时换成叉号。
- 键盘：空格或 K 播放暂停，左右键快退快进 5 秒，上下键调音量，M 静音，F 全屏，P 画中画；点画面就是播放 / 暂停，连续点也只切播放暂停，不当成双击进全屏（全屏用按钮或 F 键）。键盘调音量、快进快退时画面中间出一个小提示，0.7 秒后淡出。
- 画中画：进了画中画，原来的位置压暗，写"正在画中画里播放"，点"回到这里播放"收回；画中画窗口里的播放暂停和这里同步（Media Session）。浏览器不支持画中画时不显示这个按钮。
- 音频：三层同样的波形叠在一起——底层灰、悬停预览一层、播放过的一层，后两层用 clip-path 按进度裁出来，所以是连续地亮过去，不是一根一根跳；播完 0.4 秒后平滑回到开头。

