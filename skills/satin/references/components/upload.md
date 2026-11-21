# 上传 · Upload

> 组件 id：`upload`　分组：媒体与上传

拖进来时整块高亮，图标往上抬一点；松手后文件进列表，各自显示进度，可以单独取消或重试。支持的格式和大小写在框里，不等用户拖错了才说。

## 验收要点

- 虚线框只用在拖放区；拖进来时变实线、底色加深。
- 超过大小、格式不对的文件当场标红，说明原因，不进上传队列。
- 删掉一个文件时，下面的行用弹簧补位。

## 写法

### createUpload(拖放区, 选项)

| 选项 | 说明 |
|---|---|
| list | 文件行放在哪个元素里 |
| accept / badType | 允许的扩展名（正则）/ 不允许时的提示 |
| maxSize / tooBig | 最大字节数 / 超出时的提示 |
| upload | (file, onProgress) => Promise：真上传；不给就是演示用的假进度 |
| 返回 add(files) | 加文件（拖放、选择之外的来源） |

## 用法

```js
import { createUpload } from "satin-ui/components";

// 点了选文件、拖进来；每个文件一行：进度、失败可重试、取消 / 移除。上传函数换成你的（报进度，结束 resolve，出错 reject）
const fakeUpload = (file, onProgress) => new Promise((ok, fail) => {
  let p = 0; const bad = /失败/.test(file.name);
  const iv = setInterval(() => { p = Math.min(1, p + 0.08 + Math.random() * 0.08); onProgress(p); if (bad && p > 0.6) { clearInterval(iv); fail(new Error("网络断了")); } else if (p >= 1) { clearInterval(iv); ok(); } }, 180);
});
createUpload(document.querySelector("#drop"), {
  list: document.querySelector("#files"),
  accept: /\.(txt|docx|epub)$/i, maxSize: 50 * 1024 * 1024,
  upload: fakeUpload,
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-drop" id="drop" tabindex="0" role="button" aria-label="选择或拖入原文"><span class="sn-art" data-i="cloud-upload"></span><b>把原文拖到这里，或者 <u>选择文件</u></b><span class="sn-hint">支持 txt、docx、epub，单个不超过 50 MB</span><input type="file" multiple hidden></div>
<div class="sn-row"><button class="sn-btn sn-secondary sn-sm" data-sim-drop="">模拟拖入 3 个文件</button><span class="sn-note">也可以真的从访达里拖文件进来</span></div>
<div class="sn-files" id="files"></div>
<div class="sn-cap" style="margin-top:8px">图片上传</div>
<div class="sn-upl-grid" id="uplGrid"><button class="sn-upl-add" data-upl-add="" aria-label="添加参考图" data-i="image-plus"></button></div>
```

## 规则

- 虚线框只用在拖放区；拖进来时变实线、底色加深。
- 超过大小、格式不对的文件当场标红，说明原因，不进上传队列。
- 删掉一个文件时，下面的行用弹簧补位。

