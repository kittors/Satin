// satin-ui/elements：不带 Shadow DOM 的自定义元素，放进页面就自动挂载，移出页面自动销毁
/** 注册 <sn-segmented>、<sn-select>、<sn-tabs>……这 10 个组件元素，以及 <sn-enhance>（包住一段写在标记上的组件：放进页面自动接上交互，移出页面自动撤掉）。prefix 改前缀 */
export function defineElements(prefix?: string): void;
