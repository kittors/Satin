// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
import { render } from "preact";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "satin-ui/css/page.css";
import "../../shared/gallery.css";
import ColorDemo0 from "./demos/color-0.jsx";
import TypeDemo0 from "./demos/type-0.jsx";
import TypeDemo1 from "./demos/type-1.jsx";
import TypeDemo2 from "./demos/type-2.jsx";
import SpacingDemo0 from "./demos/spacing-0.jsx";
import SpacingDemo1 from "./demos/spacing-1.jsx";
import SpacingDemo2 from "./demos/spacing-2.jsx";
import SpacingDemo3 from "./demos/spacing-3.jsx";
import LayoutDemo0 from "./demos/layout-0.jsx";
import LayoutDemo1 from "./demos/layout-1.jsx";
import SpaceDemo0 from "./demos/space-0.jsx";
import SpaceDemo1 from "./demos/space-1.jsx";
import ElevationDemo0 from "./demos/elevation-0.jsx";
import MotionDemo0 from "./demos/motion-0.jsx";
import IconsDemo0 from "./demos/icons-0.jsx";
import ButtonDemo0 from "./demos/button-0.jsx";
import ButtonDemo1 from "./demos/button-1.jsx";
import ButtonDemo2 from "./demos/button-2.jsx";
import ButtonDemo3 from "./demos/button-3.jsx";
import IconbuttonControlled from "./demos/iconbutton-controlled.jsx";
import IconbuttonStates from "./demos/iconbutton-states.jsx";
import IconbuttonVariants from "./demos/iconbutton-variants.jsx";
import IconbuttonBasic from "./demos/iconbutton-basic.jsx";
import IconbuttonDemo0 from "./demos/iconbutton-0.jsx";
import LinkArrow from "./demos/link-arrow.jsx";
import LinkTextbtn from "./demos/link-textbtn.jsx";
import LinkBasic from "./demos/link-basic.jsx";
import LinkDemo0 from "./demos/link-0.jsx";
import CompoundBasic from "./demos/compound-basic.jsx";
import CompoundCopy from "./demos/compound-copy.jsx";
import CompoundSplit from "./demos/compound-split.jsx";
import CompoundDemo0 from "./demos/compound-0.jsx";
import ChipRemovable from "./demos/chip-removable.jsx";
import ChipControlled from "./demos/chip-controlled.jsx";
import ChipBasic from "./demos/chip-basic.jsx";
import ChipDemo0 from "./demos/chip-0.jsx";
import FieldOptional from "./demos/field-optional.jsx";
import FieldError from "./demos/field-error.jsx";
import FieldBasic from "./demos/field-basic.jsx";
import FieldDemo0 from "./demos/field-0.jsx";
import InputControlled from "./demos/input-controlled.jsx";
import InputSizes from "./demos/input-sizes.jsx";
import InputBasic from "./demos/input-basic.jsx";
import InputDemo0 from "./demos/input-0.jsx";
import InputDemo1 from "./demos/input-1.jsx";
import InputDemo2 from "./demos/input-2.jsx";
import SpecialBasic from "./demos/special-basic.jsx";
import SpecialEmail from "./demos/special-email.jsx";
import SpecialPassword from "./demos/special-password.jsx";
import SpecialDemo0 from "./demos/special-0.jsx";
import CountLongtext from "./demos/count-longtext.jsx";
import CountControlled from "./demos/count-controlled.jsx";
import CountBasic from "./demos/count-basic.jsx";
import CountDemo0 from "./demos/count-0.jsx";
import TaginputHint from "./demos/taginput-hint.jsx";
import TaginputControlled from "./demos/taginput-controlled.jsx";
import TaginputBasic from "./demos/taginput-basic.jsx";
import TaginputDemo0 from "./demos/taginput-0.jsx";
import NumberRange from "./demos/number-range.jsx";
import NumberControlled from "./demos/number-controlled.jsx";
import NumberBasic from "./demos/number-basic.jsx";
import NumberDemo0 from "./demos/number-0.jsx";
import PromptUpload from "./demos/prompt-upload.jsx";
import PromptStop from "./demos/prompt-stop.jsx";
import PromptBasic from "./demos/prompt-basic.jsx";
import PromptDemo0 from "./demos/prompt-0.jsx";
import SelectDemo0 from "./demos/select-0.jsx";
import PickerDemo0 from "./demos/picker-0.jsx";
import ChoiceControlled from "./demos/choice-controlled.jsx";
import ChoiceRadio from "./demos/choice-radio.jsx";
import ChoiceBasic from "./demos/choice-basic.jsx";
import ChoiceDemo0 from "./demos/choice-0.jsx";
import SegmentedSizes from "./demos/segmented-sizes.jsx";
import SegmentedControlled from "./demos/segmented-controlled.jsx";
import SegmentedBasic from "./demos/segmented-basic.jsx";
import SegmentedDemo0 from "./demos/segmented-0.jsx";
import SliderMax from "./demos/slider-max.jsx";
import SliderControlled from "./demos/slider-controlled.jsx";
import SliderBasic from "./demos/slider-basic.jsx";
import SliderDemo0 from "./demos/slider-0.jsx";
import OtpLength from "./demos/otp-length.jsx";
import OtpComplete from "./demos/otp-complete.jsx";
import OtpBasic from "./demos/otp-basic.jsx";
import OtpDemo0 from "./demos/otp-0.jsx";
import TooltipTruncate from "./demos/tooltip-truncate.jsx";
import TooltipKbd from "./demos/tooltip-kbd.jsx";
import TooltipBasic from "./demos/tooltip-basic.jsx";
import TooltipDemo0 from "./demos/tooltip-0.jsx";
import PopoverAlign from "./demos/popover-align.jsx";
import PopoverControlled from "./demos/popover-controlled.jsx";
import PopoverBasic from "./demos/popover-basic.jsx";
import PopoverDemo0 from "./demos/popover-0.jsx";
import PopconfirmDemo0 from "./demos/popconfirm-0.jsx";
import CtxmenuSubmenu from "./demos/ctxmenu-submenu.jsx";
import CtxmenuContext from "./demos/ctxmenu-context.jsx";
import CtxmenuBasic from "./demos/ctxmenu-basic.jsx";
import CtxmenuDemo0 from "./demos/ctxmenu-0.jsx";
import DialogDemo0 from "./demos/dialog-0.jsx";
import DrawerFooter from "./demos/drawer-footer.jsx";
import DrawerControlled from "./demos/drawer-controlled.jsx";
import DrawerBasic from "./demos/drawer-basic.jsx";
import DrawerDemo0 from "./demos/drawer-0.jsx";
import CmdkHotkey from "./demos/cmdk-hotkey.jsx";
import CmdkEmpty from "./demos/cmdk-empty.jsx";
import CmdkBasic from "./demos/cmdk-basic.jsx";
import CmdkDemo0 from "./demos/cmdk-0.jsx";
import ToastProgress from "./demos/toast-progress.jsx";
import ToastAction from "./demos/toast-action.jsx";
import ToastBasic from "./demos/toast-basic.jsx";
import ToastDemo0 from "./demos/toast-0.jsx";
import NotifyFail from "./demos/notify-fail.jsx";
import NotifyActions from "./demos/notify-actions.jsx";
import NotifyBasic from "./demos/notify-basic.jsx";
import NotifyDemo0 from "./demos/notify-0.jsx";
import BannerError from "./demos/banner-error.jsx";
import BannerDismiss from "./demos/banner-dismiss.jsx";
import BannerBasic from "./demos/banner-basic.jsx";
import BannerDemo0 from "./demos/banner-0.jsx";
import EmptyError from "./demos/empty-error.jsx";
import EmptySearch from "./demos/empty-search.jsx";
import EmptyBasic from "./demos/empty-basic.jsx";
import EmptyDemo0 from "./demos/empty-0.jsx";
import LoadingQuiet from "./demos/loading-quiet.jsx";
import LoadingList from "./demos/loading-list.jsx";
import LoadingBasic from "./demos/loading-basic.jsx";
import LoadingDemo0 from "./demos/loading-0.jsx";
import ProgressControlled from "./demos/progress-controlled.jsx";
import ProgressRing from "./demos/progress-ring.jsx";
import ProgressBasic from "./demos/progress-basic.jsx";
import ProgressDemo0 from "./demos/progress-0.jsx";
import NumflowStyles from "./demos/numflow-styles.jsx";
import NumflowCounter from "./demos/numflow-counter.jsx";
import NumflowBasic from "./demos/numflow-basic.jsx";
import NumflowDemo0 from "./demos/numflow-0.jsx";
import TableDemo0 from "./demos/table-0.jsx";
import TableDemo1 from "./demos/table-1.jsx";
import TableDemo2 from "./demos/table-2.jsx";
import TableDemo3 from "./demos/table-3.jsx";
import TableDemo4 from "./demos/table-4.jsx";
import TableDemo5 from "./demos/table-5.jsx";
import TableDemo6 from "./demos/table-6.jsx";
import TableDemo7 from "./demos/table-7.jsx";
import TableDemo8 from "./demos/table-8.jsx";
import GridStates from "./demos/grid-states.jsx";
import GridEdit from "./demos/grid-edit.jsx";
import GridRemote from "./demos/grid-remote.jsx";
import GridRender from "./demos/grid-render.jsx";
import GridSelect from "./demos/grid-select.jsx";
import GridSort from "./demos/grid-sort.jsx";
import GridDemo0 from "./demos/grid-0.jsx";
import CgridControlled from "./demos/cgrid-controlled.jsx";
import CgridEvents from "./demos/cgrid-events.jsx";
import CgridMillion from "./demos/cgrid-million.jsx";
import CgridBasic from "./demos/cgrid-basic.jsx";
import CgridDemo0 from "./demos/cgrid-0.jsx";
import ListSwitch from "./demos/list-switch.jsx";
import ListKv from "./demos/list-kv.jsx";
import ListBasic from "./demos/list-basic.jsx";
import ListDemo0 from "./demos/list-0.jsx";
import CardSelect from "./demos/card-select.jsx";
import CardGrid from "./demos/card-grid.jsx";
import CardBasic from "./demos/card-basic.jsx";
import CardDemo0 from "./demos/card-0.jsx";
import TagsAvatar from "./demos/tags-avatar.jsx";
import TagsBadge from "./demos/tags-badge.jsx";
import TagsBasic from "./demos/tags-basic.jsx";
import TagsDemo0 from "./demos/tags-0.jsx";
import CollapseControlled from "./demos/collapse-controlled.jsx";
import CollapseSingle from "./demos/collapse-single.jsx";
import CollapseBasic from "./demos/collapse-basic.jsx";
import CollapseDemo0 from "./demos/collapse-0.jsx";
import ScrollareaDemo0 from "./demos/scrollarea-0.jsx";
import ScrollareaDemo1 from "./demos/scrollarea-1.jsx";
import ScrollareaDemo2 from "./demos/scrollarea-2.jsx";
import ScrollareaDemo3 from "./demos/scrollarea-3.jsx";
import ScrollareaDemo4 from "./demos/scrollarea-4.jsx";
import ScrollareaDemo5 from "./demos/scrollarea-5.jsx";
import ScrollareaDemo6 from "./demos/scrollarea-6.jsx";
import VlistDemo0 from "./demos/vlist-0.jsx";
import ChatDemo0 from "./demos/chat-0.jsx";
import MdDemo0 from "./demos/md-0.jsx";
import FlowDemo0 from "./demos/flow-0.jsx";
import FlowstressDemo0 from "./demos/flowstress-0.jsx";
import ImageDemo0 from "./demos/image-0.jsx";
import MediaDemo0 from "./demos/media-0.jsx";
import UploadDemo0 from "./demos/upload-0.jsx";
import SidebarDemo0 from "./demos/sidebar-0.jsx";
import TabsSteps from "./demos/tabs-steps.jsx";
import TabsPager from "./demos/tabs-pager.jsx";
import TabsControlled from "./demos/tabs-controlled.jsx";
import TabsBasic from "./demos/tabs-basic.jsx";
import TabsDemo0 from "./demos/tabs-0.jsx";
import ReorderDemo0 from "./demos/reorder-0.jsx";
import AddremoveDemo0 from "./demos/addremove-0.jsx";
import OptimisticDemo0 from "./demos/optimistic-0.jsx";
import ButtonBasic from "./demos/button-basic.jsx";
import ButtonVariants from "./demos/button-variants.jsx";
import ButtonSizes from "./demos/button-sizes.jsx";
import ButtonIcons from "./demos/button-icons.jsx";
import ButtonStates from "./demos/button-states.jsx";
import ButtonBusy from "./demos/button-busy.jsx";
import ButtonActions from "./demos/button-actions.jsx";
import ButtonMobile from "./demos/button-mobile.jsx";
import DialogBasic from "./demos/dialog-basic.jsx";
import DialogDanger from "./demos/dialog-danger.jsx";
import DialogGuard from "./demos/dialog-guard.jsx";
import DialogEvents from "./demos/dialog-events.jsx";
import DialogControlled from "./demos/dialog-controlled.jsx";
import GridBasic from "./demos/grid-basic.jsx";
import PickerBasic from "./demos/picker-basic.jsx";
import PickerRange from "./demos/picker-range.jsx";
import PickerTime from "./demos/picker-time.jsx";
import PickerDatetime from "./demos/picker-datetime.jsx";
import PickerRegion from "./demos/picker-region.jsx";
import PickerEvents from "./demos/picker-events.jsx";
import SelectBasic from "./demos/select-basic.jsx";
import SelectPlaceholder from "./demos/select-placeholder.jsx";
import SelectOptions from "./demos/select-options.jsx";
import SelectField from "./demos/select-field.jsx";
import SelectEvents from "./demos/select-events.jsx";
import SelectControlled from "./demos/select-controlled.jsx";
import SelectMenu from "./demos/select-menu.jsx";

function Gallery() {
  return (
    <main class="gallery">
      <section id="color">
        <h2>颜色</h2>
        <div class="demo" data-demo="color-0"><ColorDemo0 /></div>
      </section>
      <section id="type">
        <h2>排版</h2>
        <div class="demo" data-demo="type-0"><TypeDemo0 /></div>
        <div class="demo" data-demo="type-1"><TypeDemo1 /></div>
        <div class="demo" data-demo="type-2"><TypeDemo2 /></div>
      </section>
      <section id="spacing">
        <h2>间距</h2>
        <div class="demo" data-demo="spacing-0"><SpacingDemo0 /></div>
        <div class="demo" data-demo="spacing-1"><SpacingDemo1 /></div>
        <div class="demo" data-demo="spacing-2"><SpacingDemo2 /></div>
        <div class="demo" data-demo="spacing-3"><SpacingDemo3 /></div>
      </section>
      <section id="layout">
        <h2>布局</h2>
        <div class="demo" data-demo="layout-0"><LayoutDemo0 /></div>
        <div class="demo" data-demo="layout-1"><LayoutDemo1 /></div>
      </section>
      <section id="space">
        <h2>圆角与线</h2>
        <div class="demo" data-demo="space-0"><SpaceDemo0 /></div>
        <div class="demo" data-demo="space-1"><SpaceDemo1 /></div>
      </section>
      <section id="elevation">
        <h2>阴影与层级</h2>
        <div class="demo" data-demo="elevation-0"><ElevationDemo0 /></div>
      </section>
      <section id="motion">
        <h2>动效曲线</h2>
        <div class="demo" data-demo="motion-0"><MotionDemo0 /></div>
      </section>
      <section id="icons">
        <h2>图标</h2>
        <div class="demo" data-demo="icons-0"><IconsDemo0 /></div>
      </section>
      <section id="button">
        <h2>按钮</h2>
        <div class="demo" data-demo="button-0"><ButtonDemo0 /></div>
        <div class="demo" data-demo="button-1"><ButtonDemo1 /></div>
        <div class="demo" data-demo="button-2"><ButtonDemo2 /></div>
        <div class="demo" data-demo="button-3"><ButtonDemo3 /></div>
      </section>
      <section id="iconbutton">
        <h2>纯图标按钮</h2>
        <div class="demo" data-demo="iconbutton-controlled"><IconbuttonControlled /></div>
        <div class="demo" data-demo="iconbutton-states"><IconbuttonStates /></div>
        <div class="demo" data-demo="iconbutton-variants"><IconbuttonVariants /></div>
        <div class="demo" data-demo="iconbutton-basic"><IconbuttonBasic /></div>
        <div class="demo" data-demo="iconbutton-0"><IconbuttonDemo0 /></div>
      </section>
      <section id="link">
        <h2>文字链接与文字按钮</h2>
        <div class="demo" data-demo="link-arrow"><LinkArrow /></div>
        <div class="demo" data-demo="link-textbtn"><LinkTextbtn /></div>
        <div class="demo" data-demo="link-basic"><LinkBasic /></div>
        <div class="demo" data-demo="link-0"><LinkDemo0 /></div>
      </section>
      <section id="compound">
        <h2>组合按钮</h2>
        <div class="demo" data-demo="compound-basic"><CompoundBasic /></div>
        <div class="demo" data-demo="compound-copy"><CompoundCopy /></div>
        <div class="demo" data-demo="compound-split"><CompoundSplit /></div>
        <div class="demo" data-demo="compound-0"><CompoundDemo0 /></div>
      </section>
      <section id="chip">
        <h2>切换芯片</h2>
        <div class="demo" data-demo="chip-removable"><ChipRemovable /></div>
        <div class="demo" data-demo="chip-controlled"><ChipControlled /></div>
        <div class="demo" data-demo="chip-basic"><ChipBasic /></div>
        <div class="demo" data-demo="chip-0"><ChipDemo0 /></div>
      </section>
      <section id="field">
        <h2>字段与错误</h2>
        <div class="demo" data-demo="field-optional"><FieldOptional /></div>
        <div class="demo" data-demo="field-error"><FieldError /></div>
        <div class="demo" data-demo="field-basic"><FieldBasic /></div>
        <div class="demo" data-demo="field-0"><FieldDemo0 /></div>
      </section>
      <section id="input">
        <h2>输入框</h2>
        <div class="demo" data-demo="input-controlled"><InputControlled /></div>
        <div class="demo" data-demo="input-sizes"><InputSizes /></div>
        <div class="demo" data-demo="input-basic"><InputBasic /></div>
        <div class="demo" data-demo="input-0"><InputDemo0 /></div>
        <div class="demo" data-demo="input-1"><InputDemo1 /></div>
        <div class="demo" data-demo="input-2"><InputDemo2 /></div>
      </section>
      <section id="special">
        <h2>搜索、密码、邮箱</h2>
        <div class="demo" data-demo="special-basic"><SpecialBasic /></div>
        <div class="demo" data-demo="special-email"><SpecialEmail /></div>
        <div class="demo" data-demo="special-password"><SpecialPassword /></div>
        <div class="demo" data-demo="special-0"><SpecialDemo0 /></div>
      </section>
      <section id="count">
        <h2>字数统计</h2>
        <div class="demo" data-demo="count-longtext"><CountLongtext /></div>
        <div class="demo" data-demo="count-controlled"><CountControlled /></div>
        <div class="demo" data-demo="count-basic"><CountBasic /></div>
        <div class="demo" data-demo="count-0"><CountDemo0 /></div>
      </section>
      <section id="taginput">
        <h2>标签输入</h2>
        <div class="demo" data-demo="taginput-hint"><TaginputHint /></div>
        <div class="demo" data-demo="taginput-controlled"><TaginputControlled /></div>
        <div class="demo" data-demo="taginput-basic"><TaginputBasic /></div>
        <div class="demo" data-demo="taginput-0"><TaginputDemo0 /></div>
      </section>
      <section id="number">
        <h2>数字步进</h2>
        <div class="demo" data-demo="number-range"><NumberRange /></div>
        <div class="demo" data-demo="number-controlled"><NumberControlled /></div>
        <div class="demo" data-demo="number-basic"><NumberBasic /></div>
        <div class="demo" data-demo="number-0"><NumberDemo0 /></div>
      </section>
      <section id="prompt">
        <h2>提示词输入框</h2>
        <div class="demo" data-demo="prompt-upload"><PromptUpload /></div>
        <div class="demo" data-demo="prompt-stop"><PromptStop /></div>
        <div class="demo" data-demo="prompt-basic"><PromptBasic /></div>
        <div class="demo" data-demo="prompt-0"><PromptDemo0 /></div>
      </section>
      <section id="select">
        <h2>下拉选择与菜单</h2>
        <div class="demo" data-demo="select-0"><SelectDemo0 /></div>
      </section>
      <section id="picker">
        <h2>日期、时间、地址</h2>
        <div class="demo" data-demo="picker-0"><PickerDemo0 /></div>
      </section>
      <section id="choice">
        <h2>复选、单选、开关</h2>
        <div class="demo" data-demo="choice-controlled"><ChoiceControlled /></div>
        <div class="demo" data-demo="choice-radio"><ChoiceRadio /></div>
        <div class="demo" data-demo="choice-basic"><ChoiceBasic /></div>
        <div class="demo" data-demo="choice-0"><ChoiceDemo0 /></div>
      </section>
      <section id="segmented">
        <h2>分段控件</h2>
        <div class="demo" data-demo="segmented-sizes"><SegmentedSizes /></div>
        <div class="demo" data-demo="segmented-controlled"><SegmentedControlled /></div>
        <div class="demo" data-demo="segmented-basic"><SegmentedBasic /></div>
        <div class="demo" data-demo="segmented-0"><SegmentedDemo0 /></div>
      </section>
      <section id="slider">
        <h2>滑块</h2>
        <div class="demo" data-demo="slider-max"><SliderMax /></div>
        <div class="demo" data-demo="slider-controlled"><SliderControlled /></div>
        <div class="demo" data-demo="slider-basic"><SliderBasic /></div>
        <div class="demo" data-demo="slider-0"><SliderDemo0 /></div>
      </section>
      <section id="otp">
        <h2>验证码</h2>
        <div class="demo" data-demo="otp-length"><OtpLength /></div>
        <div class="demo" data-demo="otp-complete"><OtpComplete /></div>
        <div class="demo" data-demo="otp-basic"><OtpBasic /></div>
        <div class="demo" data-demo="otp-0"><OtpDemo0 /></div>
      </section>
      <section id="tooltip">
        <h2>文字提示</h2>
        <div class="demo" data-demo="tooltip-truncate"><TooltipTruncate /></div>
        <div class="demo" data-demo="tooltip-kbd"><TooltipKbd /></div>
        <div class="demo" data-demo="tooltip-basic"><TooltipBasic /></div>
        <div class="demo" data-demo="tooltip-0"><TooltipDemo0 /></div>
      </section>
      <section id="popover">
        <h2>弹出面板</h2>
        <div class="demo" data-demo="popover-align"><PopoverAlign /></div>
        <div class="demo" data-demo="popover-controlled"><PopoverControlled /></div>
        <div class="demo" data-demo="popover-basic"><PopoverBasic /></div>
        <div class="demo" data-demo="popover-0"><PopoverDemo0 /></div>
      </section>
      <section id="popconfirm">
        <h2>气泡确认</h2>
        <div class="demo" data-demo="popconfirm-0"><PopconfirmDemo0 /></div>
      </section>
      <section id="ctxmenu">
        <h2>右键菜单与子菜单</h2>
        <div class="demo" data-demo="ctxmenu-submenu"><CtxmenuSubmenu /></div>
        <div class="demo" data-demo="ctxmenu-context"><CtxmenuContext /></div>
        <div class="demo" data-demo="ctxmenu-basic"><CtxmenuBasic /></div>
        <div class="demo" data-demo="ctxmenu-0"><CtxmenuDemo0 /></div>
      </section>
      <section id="dialog">
        <h2>弹窗</h2>
        <div class="demo" data-demo="dialog-0"><DialogDemo0 /></div>
      </section>
      <section id="drawer">
        <h2>抽屉</h2>
        <div class="demo" data-demo="drawer-footer"><DrawerFooter /></div>
        <div class="demo" data-demo="drawer-controlled"><DrawerControlled /></div>
        <div class="demo" data-demo="drawer-basic"><DrawerBasic /></div>
        <div class="demo" data-demo="drawer-0"><DrawerDemo0 /></div>
      </section>
      <section id="cmdk">
        <h2>命令面板</h2>
        <div class="demo" data-demo="cmdk-hotkey"><CmdkHotkey /></div>
        <div class="demo" data-demo="cmdk-empty"><CmdkEmpty /></div>
        <div class="demo" data-demo="cmdk-basic"><CmdkBasic /></div>
        <div class="demo" data-demo="cmdk-0"><CmdkDemo0 /></div>
      </section>
      <section id="toast">
        <h2>轻提示</h2>
        <div class="demo" data-demo="toast-progress"><ToastProgress /></div>
        <div class="demo" data-demo="toast-action"><ToastAction /></div>
        <div class="demo" data-demo="toast-basic"><ToastBasic /></div>
        <div class="demo" data-demo="toast-0"><ToastDemo0 /></div>
      </section>
      <section id="notify">
        <h2>通知</h2>
        <div class="demo" data-demo="notify-fail"><NotifyFail /></div>
        <div class="demo" data-demo="notify-actions"><NotifyActions /></div>
        <div class="demo" data-demo="notify-basic"><NotifyBasic /></div>
        <div class="demo" data-demo="notify-0"><NotifyDemo0 /></div>
      </section>
      <section id="banner">
        <h2>横幅与条目上的失败</h2>
        <div class="demo" data-demo="banner-error"><BannerError /></div>
        <div class="demo" data-demo="banner-dismiss"><BannerDismiss /></div>
        <div class="demo" data-demo="banner-basic"><BannerBasic /></div>
        <div class="demo" data-demo="banner-0"><BannerDemo0 /></div>
      </section>
      <section id="empty">
        <h2>空状态</h2>
        <div class="demo" data-demo="empty-error"><EmptyError /></div>
        <div class="demo" data-demo="empty-search"><EmptySearch /></div>
        <div class="demo" data-demo="empty-basic"><EmptyBasic /></div>
        <div class="demo" data-demo="empty-0"><EmptyDemo0 /></div>
      </section>
      <section id="loading">
        <h2>骨架与加载</h2>
        <div class="demo" data-demo="loading-quiet"><LoadingQuiet /></div>
        <div class="demo" data-demo="loading-list"><LoadingList /></div>
        <div class="demo" data-demo="loading-basic"><LoadingBasic /></div>
        <div class="demo" data-demo="loading-0"><LoadingDemo0 /></div>
      </section>
      <section id="progress">
        <h2>进度</h2>
        <div class="demo" data-demo="progress-controlled"><ProgressControlled /></div>
        <div class="demo" data-demo="progress-ring"><ProgressRing /></div>
        <div class="demo" data-demo="progress-basic"><ProgressBasic /></div>
        <div class="demo" data-demo="progress-0"><ProgressDemo0 /></div>
      </section>
      <section id="numflow">
        <h2>数字变化</h2>
        <div class="demo" data-demo="numflow-styles"><NumflowStyles /></div>
        <div class="demo" data-demo="numflow-counter"><NumflowCounter /></div>
        <div class="demo" data-demo="numflow-basic"><NumflowBasic /></div>
        <div class="demo" data-demo="numflow-0"><NumflowDemo0 /></div>
      </section>
      <section id="table">
        <h2>表格</h2>
        <div class="demo" data-demo="table-0"><TableDemo0 /></div>
        <div class="demo" data-demo="table-1"><TableDemo1 /></div>
        <div class="demo" data-demo="table-2"><TableDemo2 /></div>
        <div class="demo" data-demo="table-3"><TableDemo3 /></div>
        <div class="demo" data-demo="table-4"><TableDemo4 /></div>
        <div class="demo" data-demo="table-5"><TableDemo5 /></div>
        <div class="demo" data-demo="table-6"><TableDemo6 /></div>
        <div class="demo" data-demo="table-7"><TableDemo7 /></div>
        <div class="demo" data-demo="table-8"><TableDemo8 /></div>
      </section>
      <section id="grid">
        <h2>数据表格 · DOM</h2>
        <div class="demo" data-demo="grid-states"><GridStates /></div>
        <div class="demo" data-demo="grid-edit"><GridEdit /></div>
        <div class="demo" data-demo="grid-remote"><GridRemote /></div>
        <div class="demo" data-demo="grid-render"><GridRender /></div>
        <div class="demo" data-demo="grid-select"><GridSelect /></div>
        <div class="demo" data-demo="grid-sort"><GridSort /></div>
        <div class="demo" data-demo="grid-0"><GridDemo0 /></div>
      </section>
      <section id="cgrid">
        <h2>数据表格 · Canvas</h2>
        <div class="demo" data-demo="cgrid-controlled"><CgridControlled /></div>
        <div class="demo" data-demo="cgrid-events"><CgridEvents /></div>
        <div class="demo" data-demo="cgrid-million"><CgridMillion /></div>
        <div class="demo" data-demo="cgrid-basic"><CgridBasic /></div>
        <div class="demo" data-demo="cgrid-0"><CgridDemo0 /></div>
      </section>
      <section id="list">
        <h2>列表与键值</h2>
        <div class="demo" data-demo="list-switch"><ListSwitch /></div>
        <div class="demo" data-demo="list-kv"><ListKv /></div>
        <div class="demo" data-demo="list-basic"><ListBasic /></div>
        <div class="demo" data-demo="list-0"><ListDemo0 /></div>
      </section>
      <section id="card">
        <h2>卡片</h2>
        <div class="demo" data-demo="card-select"><CardSelect /></div>
        <div class="demo" data-demo="card-grid"><CardGrid /></div>
        <div class="demo" data-demo="card-basic"><CardBasic /></div>
        <div class="demo" data-demo="card-0"><CardDemo0 /></div>
      </section>
      <section id="tags">
        <h2>标签、徽标与头像</h2>
        <div class="demo" data-demo="tags-avatar"><TagsAvatar /></div>
        <div class="demo" data-demo="tags-badge"><TagsBadge /></div>
        <div class="demo" data-demo="tags-basic"><TagsBasic /></div>
        <div class="demo" data-demo="tags-0"><TagsDemo0 /></div>
      </section>
      <section id="collapse">
        <h2>折叠面板</h2>
        <div class="demo" data-demo="collapse-controlled"><CollapseControlled /></div>
        <div class="demo" data-demo="collapse-single"><CollapseSingle /></div>
        <div class="demo" data-demo="collapse-basic"><CollapseBasic /></div>
        <div class="demo" data-demo="collapse-0"><CollapseDemo0 /></div>
      </section>
      <section id="scrollarea">
        <h2>滚动区域</h2>
        <div class="demo" data-demo="scrollarea-0"><ScrollareaDemo0 /></div>
        <div class="demo" data-demo="scrollarea-1"><ScrollareaDemo1 /></div>
        <div class="demo" data-demo="scrollarea-2"><ScrollareaDemo2 /></div>
        <div class="demo" data-demo="scrollarea-3"><ScrollareaDemo3 /></div>
        <div class="demo" data-demo="scrollarea-4"><ScrollareaDemo4 /></div>
        <div class="demo" data-demo="scrollarea-5"><ScrollareaDemo5 /></div>
        <div class="demo" data-demo="scrollarea-6"><ScrollareaDemo6 /></div>
      </section>
      <section id="vlist">
        <h2>无限列表</h2>
        <div class="demo" data-demo="vlist-0"><VlistDemo0 /></div>
      </section>
      <section id="chat">
        <h2>聊天与 AI 对话</h2>
        <div class="demo" data-demo="chat-0"><ChatDemo0 /></div>
      </section>
      <section id="md">
        <h2>Markdown 文档</h2>
        <div class="demo" data-demo="md-0"><MdDemo0 /></div>
      </section>
      <section id="flow">
        <h2>流程图</h2>
        <div class="demo" data-demo="flow-0"><FlowDemo0 /></div>
      </section>
      <section id="flowstress">
        <h2>万级节点压测</h2>
        <div class="demo" data-demo="flowstress-0"><FlowstressDemo0 /></div>
      </section>
      <section id="image">
        <h2>图片</h2>
        <div class="demo" data-demo="image-0"><ImageDemo0 /></div>
      </section>
      <section id="media">
        <h2>视频与音频</h2>
        <div class="demo" data-demo="media-0"><MediaDemo0 /></div>
      </section>
      <section id="upload">
        <h2>上传</h2>
        <div class="demo" data-demo="upload-0"><UploadDemo0 /></div>
      </section>
      <section id="sidebar">
        <h2>侧栏与布局</h2>
        <div class="demo" data-demo="sidebar-0"><SidebarDemo0 /></div>
      </section>
      <section id="tabs">
        <h2>标签页、面包屑、分页、步骤</h2>
        <div class="demo" data-demo="tabs-steps"><TabsSteps /></div>
        <div class="demo" data-demo="tabs-pager"><TabsPager /></div>
        <div class="demo" data-demo="tabs-controlled"><TabsControlled /></div>
        <div class="demo" data-demo="tabs-basic"><TabsBasic /></div>
        <div class="demo" data-demo="tabs-0"><TabsDemo0 /></div>
      </section>
      <section id="reorder">
        <h2>拖拽重排</h2>
        <div class="demo" data-demo="reorder-0"><ReorderDemo0 /></div>
      </section>
      <section id="addremove">
        <h2>新增与删除</h2>
        <div class="demo" data-demo="addremove-0"><AddremoveDemo0 /></div>
      </section>
      <section id="optimistic">
        <h2>乐观更新</h2>
        <div class="demo" data-demo="optimistic-0"><OptimisticDemo0 /></div>
      </section>
      <section id="button">
        <h2>按钮</h2>
        <div class="demo" data-demo="button-basic"><ButtonBasic /></div>
        <div class="demo" data-demo="button-variants"><ButtonVariants /></div>
        <div class="demo" data-demo="button-sizes"><ButtonSizes /></div>
        <div class="demo" data-demo="button-icons"><ButtonIcons /></div>
        <div class="demo" data-demo="button-states"><ButtonStates /></div>
        <div class="demo" data-demo="button-busy"><ButtonBusy /></div>
        <div class="demo" data-demo="button-actions"><ButtonActions /></div>
        <div class="demo" data-demo="button-mobile"><ButtonMobile /></div>
      </section>
      <section id="dialog">
        <h2>弹窗</h2>
        <div class="demo" data-demo="dialog-basic"><DialogBasic /></div>
        <div class="demo" data-demo="dialog-danger"><DialogDanger /></div>
        <div class="demo" data-demo="dialog-guard"><DialogGuard /></div>
        <div class="demo" data-demo="dialog-events"><DialogEvents /></div>
        <div class="demo" data-demo="dialog-controlled"><DialogControlled /></div>
      </section>
      <section id="grid">
        <h2>数据表格</h2>
        <div class="demo" data-demo="grid-basic"><GridBasic /></div>
      </section>
      <section id="picker">
        <h2>日期、时间、地址</h2>
        <div class="demo" data-demo="picker-basic"><PickerBasic /></div>
        <div class="demo" data-demo="picker-range"><PickerRange /></div>
        <div class="demo" data-demo="picker-time"><PickerTime /></div>
        <div class="demo" data-demo="picker-datetime"><PickerDatetime /></div>
        <div class="demo" data-demo="picker-region"><PickerRegion /></div>
        <div class="demo" data-demo="picker-events"><PickerEvents /></div>
      </section>
      <section id="select">
        <h2>下拉选择与菜单</h2>
        <div class="demo" data-demo="select-basic"><SelectBasic /></div>
        <div class="demo" data-demo="select-placeholder"><SelectPlaceholder /></div>
        <div class="demo" data-demo="select-options"><SelectOptions /></div>
        <div class="demo" data-demo="select-field"><SelectField /></div>
        <div class="demo" data-demo="select-events"><SelectEvents /></div>
        <div class="demo" data-demo="select-controlled"><SelectControlled /></div>
        <div class="demo" data-demo="select-menu"><SelectMenu /></div>
      </section>
    </main>
  );
}
setup(); defineElements(); // 应用入口调一次
render(<Gallery />, document.getElementById("app"));
