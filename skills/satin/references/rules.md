# 去 AI 味规则

每条都写了为什么、怎么写、不要怎么写、检查器怎么判、怎么改。`severity: error` 的必须改到 0。

## 颜色只用令牌（`color-token`，error）

**为什么**：写死的颜色在深色主题下不会变，换主色也不跟着变；颜色多了就像拼凑的。

**这样写**：
```
color: var(--sn-label2); background: var(--sn-raised); border-color: var(--sn-line-control)
```

**不要这样**：
```
color: #666; background: #f0f4ff; border: 1px solid rgb(229, 231, 235)
```

**检查器怎么判**（static）：CSS、内联 style、JSX/Vue 模板的 style 里出现 #hex、rgb()/rgba()、hsl()/hsla()、颜色关键字（red、blue、gray、white、black……；transparent、currentColor、inherit 除外）就报。令牌定义文件本身不查。

**怎么改**：换成最接近的语义令牌：文字 --sn-label / --sn-label2 / --sn-label3，底色 --sn-canvas / --sn-raised / --sn-sunken，线 --sn-line / --sn-line-control，状态 --sn-danger / --sn-success / --sn-warning，强调 --sn-accent。检查器会算出色差最小的那个令牌。

## 只用存在的令牌（`token-exists`，error）

**为什么**：写错名字的变量不会报错，样式悄悄失效：颜色变成默认的黑、间距变成 0、字号回到浏览器默认。

**这样写**：
```
color: var(--sn-label2); padding: var(--sn-sp-16); class="sn-t-callout"
```

**不要这样**：
```
color: var(--sn-text-secondary); font-size: var(--sn-t-callout-size); gap: var(--sn-space-4)
```

**检查器怎么判**（static）：var(--sn-…) 引用的名字既不是 Satin 的令牌，也不是组件样式里用到的变量，就报（自己定义的 --sn-xxx 变量也算存在）。

**怎么改**：查 references/tokens.md 换成真实的名字：文字 --sn-label / --sn-label2 / --sn-label3，间距 --sn-sp-4…80，圆角 --sn-r-sm/md/lg/xl；字号别用变量，用排版类 sn-t-*。

## sn- 类名只用 Satin 有的（`class-exists`，warn）

**为什么**：自己编的 sn- 类名（sn-eyebrow、sn-card-title……）没有样式，看着像用了 Satin，其实什么都没发生；以后升级也可能撞上真正的类名。

**这样写**：
```
class="sn-t-caption sn-c-tertiary"（Satin 的排版类）；自己的类不带 sn- 前缀：class="page-eyebrow"
```

**不要这样**：
```
class="sn-eyebrow"、class="sn-card-title"
```

**检查器怎么判**（static）：标记、className 里 sn- 开头的类名不在 Satin 的样式和脚本里就报（建议改）。

**怎么改**：查 references/components.md、SKILL.md 第 4 节找现成的类；没有就自己起名字，别用 sn- 前缀。

## 间距只用刻度（`spacing-scale`，error）

**为什么**：随手写的 13px、18px、22px 让对齐和节奏乱掉；刻度保证组内近、组间远。

**这样写**：
```
padding: var(--sn-pad-card); gap: var(--sn-gap-stack); margin-top: 24px
```

**不要这样**：
```
padding: 13px 18px; gap: 7px; margin-top: 22px
```

**检查器怎么判**（static）：padding、margin、gap（含各方向）里的 px 必须在 0 2 4 6 8 10 12 14 16 20 24 28 32 40 48 64 80 上；1px 例外（细线对齐）。

**怎么改**：改成最近的刻度值，或者用语义间距：组内 --sn-gap-inline（8）/ --sn-gap-stack（12），组间 --sn-gap-group（16），区块之间 --sn-gap-section（32），卡片内边距 --sn-pad-card（16），面板 --sn-pad-panel（24）。

## 不用渐变做装饰（`no-gradient`，error）

**为什么**：紫蓝渐变背景、渐变文字、渐变按钮是 AI 拼出来的界面最明显的标志。

**这样写**：
```
背景用纯色令牌（--sn-canvas、--sn-raised）；分区靠留白和底色深浅
```

**不要这样**：
```
background: linear-gradient(135deg, #667eea, #764ba2); background-clip: text; 渐变色图标
```

**检查器怎么判**（static+dom）：background / background-image 里出现 linear-gradient、radial-gradient、conic-gradient 就报（mask-image 做边缘渐隐、骨架屏扫光除外）；background-clip: text 一律报。页面上量：看得见的元素计算样式 background-image 含 gradient 的。

**怎么改**：删掉渐变，用一个纯色令牌；想要层次就用 --sn-raised 卡片放在 --sn-canvas 底上。

## 不加彩色投影和光晕（`no-colored-shadow`，error）

**为什么**：发光描边、彩色投影、霓虹光晕显得廉价；成熟产品的阴影是中性的、很淡的。

**这样写**：
```
box-shadow: var(--sn-e1)（浮层）、var(--sn-card-shadow)（卡片）、var(--sn-e2)（对话框）
```

**不要这样**：
```
box-shadow: 0 0 20px rgba(99, 102, 241, .5); filter: drop-shadow(0 0 8px #a855f7); text-shadow: 0 0 10px cyan
```

**检查器怎么判**（static+dom）：box-shadow / text-shadow / drop-shadow 里的颜色不是黑或白（R=G=B 且只有透明度变化）就报；不是令牌、模糊半径大于 40px 的也报。

**怎么改**：换成阴影令牌 --sn-e1 / --sn-e2 / --sn-card-shadow；焦点用 outline: 2px solid var(--sn-focus)。

## 动效只动 transform、opacity、filter（`motion-props`，error）

**为什么**：动宽高、位置、边距会每帧重排，掉帧、发抖。

**这样写**：
```
transition: transform .2s var(--sn-ease-out), opacity .2s var(--sn-ease-out)；展开用 grid-template-rows 0fr→1fr 或者 scale
```

**不要这样**：
```
transition: all .3s; transition: height .3s, left .3s; @keyframes { from { width: 0 } }
```

**检查器怎么判**（static）：transition 里出现 all、width、height、top、left、right、bottom、margin*、padding*、inset 就报；@keyframes 和 element.animate() 的关键帧里出现这些属性也报。颜色、背景、阴影、边框色的状态过渡（≤ 200ms）允许。

**怎么改**：位移改 transform: translate()；大小改 transform: scale()；淡入淡出用 opacity。不要写 all，列出具体属性。

## 曲线和时长只用规定的几档（`easing-token`，warn）

**为什么**：线性动画显得机械；每处一个自编的 cubic-bezier 就没有统一的手感。

**这样写**：
```
进入 var(--sn-ease-out) 150–250ms；离开 var(--sn-ease-in) 120–200ms；换位 var(--sn-ease-in-out)；勾选、开关 var(--sn-ease-overshoot)
```

**不要这样**：
```
transition: opacity .5s linear; transition: transform 1s ease; cubic-bezier(.68, -.55, .27, 1.55)
```

**检查器怎么判**（static）：transition / animation 的曲线不是 var(--sn-ease-*) 就报（转圈、进度条用 linear 除外）；时长超过 500ms 的报（转圈、骨架屏、进度条除外）。

**怎么改**：按动作选：出现用 --sn-ease-out，消失用 --sn-ease-in，留在屏上移动用 --sn-ease-in-out；时长按 spec/motion 的档位。

## 不用 AI 套路图标和 emoji（`no-ai-icons`，error）

**为什么**：星星闪光、仙女棒、机器人头、大脑、emoji 一出现，界面就像 AI 模板。

**这样写**：
```
图标照字面意思选：生成用"播放"或"加号"，或者直接写"生成"两个字
```

**不要这样**：
```
✨ 智能生成；sparkles / wand / bot / brain 图标；每个标题前一个彩色圆角方块图标
```

**检查器怎么判**（static）：代码里出现图标名 sparkles、sparkle、wand、wand-2、magic、bot、brain、stars 就报；界面文案里出现 emoji（\p{Extended_Pictographic}）就报。

**怎么改**：删掉图标，或者换成字面意思的图标（play、plus、check）；按钮以文字为主。

## 文案说清楚做了什么，不用营销词（`marketing-copy`，warn）

**为什么**："智能""一键""赋能""极致"、感叹号，读起来像广告，不像工具。

**这样写**：
```
已导出到"下载"；删除后无法恢复，协作者也会失去访问权限
```

**不要这样**：
```
一键智能生成！极致体验，赋能你的创作 🚀
```

**检查器怎么判**（static）：界面文案里出现 智能、一键、赋能、极致、革命性、颠覆、黑科技、！（全角感叹号）、!（文案末尾）就报。

**怎么改**：写具体的名词和数字：做了什么、结果在哪、下一步能做什么。

## 不加英文眉题（`no-eyebrow`，warn）

**为什么**：标题上面一行全大写、加字距的英文小字（PROJECTS · 2026、DASHBOARD）是模板和 AI 生成页面的标志；中文产品界面的层级靠标题字号、字重和一句说明。

**这样写**：
```
<h1>全部项目</h1><p>共 128 个项目，本周新增 6 个</p>
```

**不要这样**：
```
<span style="text-transform: uppercase; letter-spacing: .2em">Projects · 2026</span><h1>全部项目</h1>
```

**检查器怎么判**（static）：样式里出现 text-transform: uppercase。

**怎么改**：删掉眉题；要补充信息就放进标题下面那句说明（--sn-label2 的正文小一号）。

## 链接用 Satin 的样式（`link-style`，warn）

**为什么**：没写 class 的 <a href> 是浏览器默认的亮蓝色加下划线，和界面其他部分不是一套；低档模型做的登录页、页脚最常见。

**这样写**：
```
<a class="sn-link" href="/terms">服务条款</a>
```

**不要这样**：
```
<a href="/terms">服务条款</a>
```

**检查器怎么判**（static）：标记里有 href（或 to）却没有 class 的 <a>。

**怎么改**：文字链接加 class="sn-link"；侧栏、面包屑按组件的标记写；看起来像按钮的用 sn-btn。

## 字重只用 400、500、600；字号只用排版档（`font-weight`，warn）

**为什么**：800 的粗标题、随手的 15.5px 字号让层级乱掉。

**这样写**：
```
标题 class="sn-t-title1"（22/30/600）；正文 sn-t-body（14/22/400）；强调 sn-t-body-strong（14/22/500）
```

**不要这样**：
```
font-weight: 800; font-size: 15.5px; letter-spacing: .2em; text-transform: uppercase（中文界面）
```

**检查器怎么判**（static+dom）：font-weight 不在 400/500/600 就报；font-size 的 px 不在 11 12 13 14 15 17 22 28 上就报；text-transform: uppercase 同时 letter-spacing > .05em 的报。

**怎么改**：用排版类：sn-t-display / sn-t-title1 / sn-t-title2 / sn-t-title3 / sn-t-body / sn-t-body-strong / sn-t-callout / sn-t-caption / sn-t-micro / sn-t-code。

## 不乱画分隔线（`no-decorative-divider`，warn）

**为什么**：到处都是 1px 线，界面就碎了；区域之间靠留白和底色深浅区分。

**这样写**：
```
侧栏和内容用底色深浅区分；卡片头和卡片身之间留白
```

**不要这样**：
```
标题栏下、工具栏下、侧栏右边、卡片头身之间、弹层底栏上、页脚上都有一条线
```

**检查器怎么判**（dom）：header、nav、aside、footer、[role=toolbar]、卡片头尾这些元素带 1px 的 border-top / border-bottom / border-left / border-right（表格行线、可拖动的列边界除外）就报。

**怎么改**：删掉线，用间距（--sn-gap-group 以上）或者把一边换成 --sn-sunken / --sn-canvas 底色。

## 卡片不套卡片；只有能单独操作的对象才用卡片（`card-nesting`，warn）

**为什么**：卡片里再套卡片、每块内容都装卡片，是线框图和模板的味道。

**这样写**：
```
内容直接放在底色上，用标题和间距分组；项目、素材、生成结果这类能单独操作的对象才是卡片
```

**不要这样**：
```
统计数字、说明文字、表单都各装一张卡片；卡片里再放带阴影的卡片
```

**检查器怎么判**（dom）：有圆角 + 底色 + 阴影或描边的块（.sn-card、.sn-demo 或计算样式判断）里面还有同样的块就报。

**怎么改**：去掉里层卡片的底色、阴影和描边，改成标题 + 间距分组。

## 毛玻璃只给浮在内容上的东西（`glass-only-floating`，warn）

**为什么**：面板、卡片全是毛玻璃，既看不清又像模板。

**这样写**：
```
吸顶的顶栏、视频控制条、浮层用 backdrop-filter
```

**不要这样**：
```
侧栏、卡片、表单区都 backdrop-filter: blur(20px)
```

**检查器怎么判**（dom）：backdrop-filter 不为 none、而 position 不是 fixed / sticky / absolute 的元素就报。

**怎么改**：去掉 backdrop-filter，用 --sn-raised 实底。

## 数字写进文字，不堆 KPI 大字卡（`kpi-wall`，warn）

**为什么**：一排等宽卡片、每张大号数字 + 小标签，是仪表盘模板的标志。

**这样写**：
```
3 集 · 12 个段落 · 13 个素材（13px、副信息色、等宽数字）；真要看趋势就上图表或表格
```

**不要这样**：
```
四张卡片：大号 "10K+" 配小字 "用户"，再加一个绿色上箭头
```

**检查器怎么判**（dom）：同一行 3 张以上兄弟卡片，每张里有一个字号 ≥ 28px 的数字就报。

**怎么改**：把数字并进一行说明文字，或者换成表格 / 图表；仪表盘配方见 spec/recipes/dashboard.md。

## 颜色只表达状态（`status-color`，warn）

**为什么**：每行堆三四个彩色徽章，类型也做成带底色的胶囊，眼睛不知道看哪。

**这样写**：
```
正常不上色；需要处理的加一个主色小圆点；失败只给关键词上 --sn-danger
```

**不要这样**：
```
类型、标签、状态全是彩色胶囊；正常状态也是绿色徽章
```

**检查器怎么判**（dom）：同一屏里饱和色（HSL 饱和度 > 40%）做底色的小块超过 6 个，或者一行里超过 2 个，就报。

**怎么改**：类型、标签改成普通文字或中性底色的 sn-chip；只给需要处理、失败的状态上色。

## 导航选中用中性底色，字重不变（`nav-selected`，warn）

**为什么**：左边一根彩色竖条、品牌色底，是后台模板的味道；字重变了文字会挤动。

**这样写**：
```
选中项 background: var(--sn-fill-active); color: var(--sn-label)；字重始终 400 / 500 不变
```

**不要这样**：
```
选中项左边 3px 品牌色竖条；选中后变粗
```

**检查器怎么判**（dom）：导航里 [aria-current]、.on、.active 的项带彩色 border-left / 彩色背景，或者和未选中项 font-weight 不同就报。

**怎么改**：用 sn-side 侧边栏组件，选中样式已经是对的。

## 素材和数据要像真的（`real-content`，warn）

**为什么**：Lorem ipsum、渐变色块冒充图片、AI 抽象插画一眼假。

**这样写**：
```
示例数据像真的业务（剧集、镜头、时长、人名）；图片用真实照片并注明来源
```

**不要这样**：
```
Lorem ipsum、测试数据 1、渐变方块当缩略图、用户 A / 用户 B
```

**检查器怎么判**（static）：文案里出现 lorem、ipsum、示例文本、测试数据、XXX、TODO 就报。

**怎么改**：换成和页面业务一致的真实感数据；图片没有就用占位底色 + 文件名，不要画渐变。

## 不遮挡（`no-overlap`，error）

**为什么**：绝对定位的按钮压住内容角落的东西，看起来没做完。

**这样写**：
```
工具按钮放在内容外面的工具行里；角标留出位置
```

**不要这样**：
```
复制按钮浮在代码块右上角压住最后几个字；徽章压住旁边的文字
```

**检查器怎么判**（dom）：看得见的按钮 / 链接，在它的框里撒点，elementFromPoint 拿到的不是它自己（或它的子元素）就报。

**怎么改**：给容器留出位置（padding），或者把按钮挪进工具行。

## 浮层不被裁（`float-clipped`，error）

**为什么**：下拉、菜单、提示被父元素的 overflow:hidden 裁掉一半。

**这样写**：
```
浮层用 Satin 的 sn-menu / sn-pop / Tooltip（放在顶层 popover 里）
```

**不要这样**：
```
在 overflow: hidden 的卡片里放 position: absolute 的下拉面板
```

**检查器怎么判**（dom）：打开每个触发器（点击、悬停），在出现的浮层上撒点，elementFromPoint 拿到的不是浮层自己就报（和 docs-audit 的浮层检查同一个算法）。

**怎么改**：用组件自带的浮层（会放到顶层）；自己写的浮层改用 popover 属性。

## 按钮文字不换行，页面不横向溢出（`button-wrap`，error）

**为什么**：按钮里的字折成两行、页面左右能滚，是没在窄屏上看过的标志。

**这样写**：
```
按钮 white-space: nowrap（sn-btn 已经是）；窄屏下按钮组换成竖排或者收进更多菜单
```

**不要这样**：
```
固定宽度的按钮塞长文字；表格、长链接把页面撑宽
```

**检查器怎么判**（dom）：1440、768、390 三种宽度下：按钮里的文字节点有两行就报；document.documentElement.scrollWidth > innerWidth 就报。

**怎么改**：缩短文案；按钮不设固定宽度；宽内容放进 sn-scroll 滚动区域或者表格自己的横向滚动。

## 键盘焦点看得见（`focus-visible`，error）

**为什么**：去掉焦点框以后键盘用户不知道自己在哪。

**这样写**：
```
自定义控件 :focus-visible { outline: 2px solid var(--sn-focus); outline-offset: 2px }
```

**不要这样**：
```
*:focus { outline: none } 又不给替代样式
```

**检查器怎么判**（static）：outline: none / 0 出现在 :focus 上，而同一个选择器没有对应的 :focus-visible 样式（outline 或 box-shadow）就报。

**怎么改**：改成只在 :focus:not(:focus-visible) 上去掉 outline，并给 :focus-visible 加 outline: 2px solid var(--sn-focus)。

## 深浅两套都精致（`both-themes`，error）

**为什么**：只在浅色下调过，深色下文字发灰看不清、白底卡片刺眼。

**这样写**：
```
只用令牌；深色和浅色各截一张图对比
```

**不要这样**：
```
写死 #fff 背景、#333 文字；深色主题下用了浅色的阴影
```

**检查器怎么判**（dom）：两套主题各量一遍：正文文字和它背景的对比度 < 4.5（大字 < 3）就报；深色下出现 #fff 实底的块就报。

**怎么改**：换成令牌；深色下的特殊处理写在 [data-theme="dark"] 下面。

## 移动端可点区域够大（`touch-target`，warn）

**为什么**：手机上 28px 的图标按钮很难点中。

**这样写**：
```
390 宽下可点元素至少 40×40（用 sn-btn 的 lg 尺寸，或者给图标按钮加 sn-tap 扩大点击区）
```

**不要这样**：
```
手机页面上 24px 的关闭按钮、挤在一起的链接
```

**检查器怎么判**（dom）：390 宽、触摸模式下，可点元素（button、a、[role=button]、input）的点击框小于 40×40 且和别的可点元素间距小于 8px 就报。

**怎么改**：移动端用 lg 尺寸；图标按钮加 sn-tap；列表行整行可点。

