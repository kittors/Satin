# 提示词输入框 · Composer

> 组件 id：`prompt`　分组：表单

生成画面时用。框随内容长高；可以加参考图；有内容时右下角的发送按钮才亮起来。发送后按钮变成"停止"，外圈转动表示正在生成，点一下就停；⌘↵ 也能发送。

## 验收要点

- 发送按钮：空着时灰色不可点；有内容时 180ms 变成实心；生成中变成停止，外圈转动。
- 生成中输入框变灰、不能改；停止或完成后恢复，焦点回到输入框。
- 用量环在写到一半以后才出现，平时不打扰。
- 附件：图片、视频是 56px 缩略图块（视频带时长），音频、文档是一条（音频能试听，文档显示扩展名和大小）。加进来先上传，传完才能发；失败的点一下重传，太大的当场说明原因、不加进来。可以拖文件进来，也可以粘贴截图；附件多了横向滚动。

## 写法

### createComposer(容器, 选项)

| 选项 | 说明 |
|---|---|
| onSend | ({ text, files }) => {}：发送；期间“生成中”，发送键变停止，生成完调 setBusy(false) |
| onStop | () => {}：生成中点停止（键盘回车不会停止，只晃一下停止键） |
| upload | (file, onProgress) => Promise：真上传；不给就是演示用的假进度 |

### 返回值

| 名称 | 说明 |
|---|---|
| setBusy(on) | 切换生成中 |
| clear({ smooth }) | 清空；smooth：附件淡出、输入框平滑收起 |
| files() | 现在的附件元素 |

### 事件

| 名称 | 说明 |
|---|---|
| compose / compose-stop | 容器写了 data-external、用 bindInputs 接上（不给 onSend）时，发送 / 停止改成在容器上发这两个事件（对话组件这样接） |

## 用法

```js
import { createComposer } from "satin-ui/components";

// 提示词输入框：自动长高、字数、附件（拖进来、粘贴截图、附件菜单）；有文字或附件、附件传完才能发
const composer = createComposer(document.querySelector("[data-composer]"), {
  // 发送：期间"生成中"，发送键变成停止；生成完调 setBusy(false) 回到可发送
  onSend: async ({ text, files }) => {
    await generate(text, files);
    composer.setBusy(false);
  },
  onStop: () => abortGeneration(),
  // 真上传：报进度，结束就完成，出错就失败（点一下重试）
  upload: (file, onProgress) => uploadFile(file, onProgress),
});

composer.clear({ smooth: true }); // 清空：附件淡出、输入框平滑收起
composer.files();                 // 现在的附件元素
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-box-in sn-composer" data-composer="" data-max="300" data-max-lines="6">
<div class="sn-cm-files"></div>
<textarea rows="1" placeholder="描述你想要的画面，比如：雨夜，林夏站在空荡的站台上，最后一班车的车灯穿过雨幕"></textarea>
<div class="sn-cm-bar"><div class="sn-select sn-inline-menu sn-up"><button class="sn-btn sn-ghost sn-sm sn-ibtn sn-cm-add" data-menubtn="" data-cm-attach="" data-tip="添加图片、视频、音频或文档" aria-label="添加附件" data-i="plus"></button><div class="sn-menu" role="menu" style="min-width:208px"><div class="sn-item" data-add="img" data-i="image:before">图片<span class="sn-key">JPG · PNG</span></div><div class="sn-item" data-add="vid" data-i="film:before">视频<span class="sn-key">MP4 · MOV</span></div><div class="sn-item" data-add="aud" data-i="audio-lines:before">音频<span class="sn-key">MP3 · WAV</span></div><div class="sn-item" data-add="doc" data-i="file-text:before">文档<span class="sn-key">PDF · DOCX</span></div><div class="sn-sep"></div><div class="sn-item" data-add="fail" data-i="refresh-cw:before">演示：上传失败</div><div class="sn-item" data-add="big" data-i="circle-alert:before">演示：文件太大</div></div></div><button class="sn-btn sn-ghost sn-sm sn-cm-chip" data-cm-style="">风格：电影感</button><span class="sn-grow"></span>
<span class="sn-ta-count"><svg class="sn-uring" viewBox="0 0 16 16"><circle class="sn-bg" cx="8" cy="8" r="6" /><circle class="sn-fg" cx="8" cy="8" r="6" /></svg></span>
<button class="sn-cm-send" aria-label="生成" data-tip="生成" data-kbd="⌘↵"><svg class="sn-orbit" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" /></svg><span class="sn-swap"><span class="sn-a" data-i="arrow-up"></span><span class="sn-b"><span class="sn-stop"></span></span></span></button></div>
</div>
```

## 规则

- 发送按钮：空着时灰色不可点；有内容时 180ms 变成实心；生成中变成停止，外圈转动。
- 生成中输入框变灰、不能改；停止或完成后恢复，焦点回到输入框。
- 用量环在写到一半以后才出现，平时不打扰。
- 附件：图片、视频是 56px 缩略图块（视频带时长），音频、文档是一条（音频能试听，文档显示扩展名和大小）。加进来先上传，传完才能发；失败的点一下重传，太大的当场说明原因、不加进来。可以拖文件进来，也可以粘贴截图；附件多了横向滚动。

