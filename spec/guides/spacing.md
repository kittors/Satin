# 间距（Spacing）

> 16 以下每 2px 一档，只在控件内部用；

16 以下每 2px 一档，只在控件内部用；再往上逐级放大，用在组件之间、区块之间。越相关越近：组和组之间至少是组内的两倍。

## 语义令牌

页面和组件只写语义令牌，不写数字：`--sn-gap-tight`（图标和字）、`--sn-gap-inline`（同一行的控件）、`--sn-gap-stack`（上下堆叠）、`--sn-gap-group`（组之间）、`--sn-gap-section`（区块之间），以及 `--sn-pad-card`、`--sn-pad-panel`、`--sn-pad-page`。

## 密度

根元素上写 `data-density="compact"` 或 `"comfortable"`，语义令牌整体换一档，组件不用改。
