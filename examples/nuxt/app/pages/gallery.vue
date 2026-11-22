<!-- 由 scripts/examples/gallery-entries.mjs 生成，别手改 -->
<script setup>
import "../../../shared/gallery.css";
import DemoGuard from "../gallery/guard.js";
import ColorDemo0 from "../demos/color-0.vue";
import TypeDemo0 from "../demos/type-0.vue";
import TypeDemo1 from "../demos/type-1.vue";
import TypeDemo2 from "../demos/type-2.vue";
import SpacingDemo0 from "../demos/spacing-0.vue";
import SpacingDemo1 from "../demos/spacing-1.vue";
import SpacingDemo2 from "../demos/spacing-2.vue";
import SpacingDemo3 from "../demos/spacing-3.vue";
import LayoutDemo0 from "../demos/layout-0.vue";
import LayoutDemo1 from "../demos/layout-1.vue";
import SpaceDemo0 from "../demos/space-0.vue";
import SpaceDemo1 from "../demos/space-1.vue";
import ElevationDemo0 from "../demos/elevation-0.vue";
import MotionDemo0 from "../demos/motion-0.vue";
import IconsDemo0 from "../demos/icons-0.vue";
import ButtonDemo0 from "../demos/button-0.vue";
import ButtonDemo1 from "../demos/button-1.vue";
import ButtonDemo2 from "../demos/button-2.vue";
import ButtonDemo3 from "../demos/button-3.vue";
import IconbuttonDemo0 from "../demos/iconbutton-0.vue";
import LinkDemo0 from "../demos/link-0.vue";
import CompoundDemo0 from "../demos/compound-0.vue";
import ChipDemo0 from "../demos/chip-0.vue";
import FieldDemo0 from "../demos/field-0.vue";
import InputDemo0 from "../demos/input-0.vue";
import InputDemo1 from "../demos/input-1.vue";
import InputDemo2 from "../demos/input-2.vue";
import SpecialDemo0 from "../demos/special-0.vue";
import CountDemo0 from "../demos/count-0.vue";
import TaginputDemo0 from "../demos/taginput-0.vue";
import NumberDemo0 from "../demos/number-0.vue";
import PromptDemo0 from "../demos/prompt-0.vue";
import SelectDemo0 from "../demos/select-0.vue";
import PickerDemo0 from "../demos/picker-0.vue";
import ChoiceDemo0 from "../demos/choice-0.vue";
import SegmentedDemo0 from "../demos/segmented-0.vue";
import SliderDemo0 from "../demos/slider-0.vue";
import OtpDemo0 from "../demos/otp-0.vue";
import TooltipDemo0 from "../demos/tooltip-0.vue";
import PopoverDemo0 from "../demos/popover-0.vue";
import PopconfirmDemo0 from "../demos/popconfirm-0.vue";
import CtxmenuDemo0 from "../demos/ctxmenu-0.vue";
import DialogDemo0 from "../demos/dialog-0.vue";
import DrawerDemo0 from "../demos/drawer-0.vue";
import CmdkDemo0 from "../demos/cmdk-0.vue";
import ToastDemo0 from "../demos/toast-0.vue";
import NotifyDemo0 from "../demos/notify-0.vue";
import BannerDemo0 from "../demos/banner-0.vue";
import EmptyDemo0 from "../demos/empty-0.vue";
import LoadingDemo0 from "../demos/loading-0.vue";
import ProgressDemo0 from "../demos/progress-0.vue";
import NumflowDemo0 from "../demos/numflow-0.vue";
import TableDemo0 from "../demos/table-0.vue";
import TableDemo1 from "../demos/table-1.vue";
import TableDemo2 from "../demos/table-2.vue";
import TableDemo3 from "../demos/table-3.vue";
import TableDemo4 from "../demos/table-4.vue";
import TableDemo5 from "../demos/table-5.vue";
import TableDemo6 from "../demos/table-6.vue";
import TableDemo7 from "../demos/table-7.vue";
import GridDemo0 from "../demos/grid-0.vue";
import CgridDemo0 from "../demos/cgrid-0.vue";
import ListDemo0 from "../demos/list-0.vue";
import CardDemo0 from "../demos/card-0.vue";
import TagsDemo0 from "../demos/tags-0.vue";
import AvatarDemo0 from "../demos/avatar-0.vue";
import AvatarDemo1 from "../demos/avatar-1.vue";
import AvatarDemo2 from "../demos/avatar-2.vue";
import CollapseDemo0 from "../demos/collapse-0.vue";
import ScrollareaDemo0 from "../demos/scrollarea-0.vue";
import ScrollareaDemo1 from "../demos/scrollarea-1.vue";
import ScrollareaDemo2 from "../demos/scrollarea-2.vue";
import ScrollareaDemo3 from "../demos/scrollarea-3.vue";
import ScrollareaDemo4 from "../demos/scrollarea-4.vue";
import ScrollareaDemo5 from "../demos/scrollarea-5.vue";
import ScrollareaDemo6 from "../demos/scrollarea-6.vue";
import VlistDemo0 from "../demos/vlist-0.vue";
import ChatDemo0 from "../demos/chat-0.vue";
import ChatDemo1 from "../demos/chat-1.vue";
import MdDemo0 from "../demos/md-0.vue";
import FlowDemo0 from "../demos/flow-0.vue";
import ImageDemo0 from "../demos/image-0.vue";
import MediaDemo0 from "../demos/media-0.vue";
import UploadDemo0 from "../demos/upload-0.vue";
import SidebarDemo0 from "../demos/sidebar-0.vue";
import TabsDemo0 from "../demos/tabs-0.vue";
import ReorderDemo0 from "../demos/reorder-0.vue";
import AddremoveDemo0 from "../demos/addremove-0.vue";
import OptimisticDemo0 from "../demos/optimistic-0.vue";
import AddremoveBasic from "../demos/addremove-basic.vue";
import AddremoveUndo from "../demos/addremove-undo.vue";
import AddremoveRows from "../demos/addremove-rows.vue";
import AvatarBasic from "../demos/avatar-basic.vue";
import AvatarList from "../demos/avatar-list.vue";
import BannerBasic from "../demos/banner-basic.vue";
import BannerDismiss from "../demos/banner-dismiss.vue";
import BannerError from "../demos/banner-error.vue";
import ButtonBasic from "../demos/button-basic.vue";
import ButtonVariants from "../demos/button-variants.vue";
import ButtonSizes from "../demos/button-sizes.vue";
import ButtonIcons from "../demos/button-icons.vue";
import ButtonStates from "../demos/button-states.vue";
import ButtonBusy from "../demos/button-busy.vue";
import ButtonActions from "../demos/button-actions.vue";
import ButtonMobile from "../demos/button-mobile.vue";
import CardBasic from "../demos/card-basic.vue";
import CardGrid from "../demos/card-grid.vue";
import CardSelect from "../demos/card-select.vue";
import CgridBasic from "../demos/cgrid-basic.vue";
import CgridMillion from "../demos/cgrid-million.vue";
import CgridControlled from "../demos/cgrid-controlled.vue";
import CgridEvents from "../demos/cgrid-events.vue";
import ChatBasic from "../demos/chat-basic.vue";
import ChatNew from "../demos/chat-new.vue";
import ChatHistory from "../demos/chat-history.vue";
import ChatRich from "../demos/chat-rich.vue";
import ChipBasic from "../demos/chip-basic.vue";
import ChipControlled from "../demos/chip-controlled.vue";
import ChipRemovable from "../demos/chip-removable.vue";
import ChoiceBasic from "../demos/choice-basic.vue";
import ChoiceRadio from "../demos/choice-radio.vue";
import ChoiceControlled from "../demos/choice-controlled.vue";
import CmdkBasic from "../demos/cmdk-basic.vue";
import CmdkEmpty from "../demos/cmdk-empty.vue";
import CmdkHotkey from "../demos/cmdk-hotkey.vue";
import CollapseBasic from "../demos/collapse-basic.vue";
import CollapseSingle from "../demos/collapse-single.vue";
import CollapseControlled from "../demos/collapse-controlled.vue";
import CompoundBasic from "../demos/compound-basic.vue";
import CompoundSplit from "../demos/compound-split.vue";
import CompoundCopy from "../demos/compound-copy.vue";
import CountBasic from "../demos/count-basic.vue";
import CountControlled from "../demos/count-controlled.vue";
import CountLongtext from "../demos/count-longtext.vue";
import CtxmenuBasic from "../demos/ctxmenu-basic.vue";
import CtxmenuContext from "../demos/ctxmenu-context.vue";
import CtxmenuSubmenu from "../demos/ctxmenu-submenu.vue";
import DialogBasic from "../demos/dialog-basic.vue";
import DialogDanger from "../demos/dialog-danger.vue";
import DialogGuard from "../demos/dialog-guard.vue";
import DialogEvents from "../demos/dialog-events.vue";
import DialogControlled from "../demos/dialog-controlled.vue";
import DrawerBasic from "../demos/drawer-basic.vue";
import DrawerControlled from "../demos/drawer-controlled.vue";
import DrawerFooter from "../demos/drawer-footer.vue";
import EmptyBasic from "../demos/empty-basic.vue";
import EmptySearch from "../demos/empty-search.vue";
import EmptyError from "../demos/empty-error.vue";
import FieldBasic from "../demos/field-basic.vue";
import FieldError from "../demos/field-error.vue";
import FieldOptional from "../demos/field-optional.vue";
import FlowBasic from "../demos/flow-basic.vue";
import FlowBranch from "../demos/flow-branch.vue";
import FlowTidy from "../demos/flow-tidy.vue";
import FlowstressMany from "../demos/flowstress-many.vue";
import GridBasic from "../demos/grid-basic.vue";
import GridSort from "../demos/grid-sort.vue";
import GridSelect from "../demos/grid-select.vue";
import GridRender from "../demos/grid-render.vue";
import GridRemote from "../demos/grid-remote.vue";
import GridEdit from "../demos/grid-edit.vue";
import GridStates from "../demos/grid-states.vue";
import IconbuttonBasic from "../demos/iconbutton-basic.vue";
import IconbuttonVariants from "../demos/iconbutton-variants.vue";
import IconbuttonStates from "../demos/iconbutton-states.vue";
import IconbuttonControlled from "../demos/iconbutton-controlled.vue";
import ImageBasic from "../demos/image-basic.vue";
import ImageControlled from "../demos/image-controlled.vue";
import ImageFailed from "../demos/image-failed.vue";
import InputBasic from "../demos/input-basic.vue";
import InputSizes from "../demos/input-sizes.vue";
import InputControlled from "../demos/input-controlled.vue";
import LinkBasic from "../demos/link-basic.vue";
import LinkTextbtn from "../demos/link-textbtn.vue";
import LinkArrow from "../demos/link-arrow.vue";
import ListBasic from "../demos/list-basic.vue";
import ListKv from "../demos/list-kv.vue";
import ListSwitch from "../demos/list-switch.vue";
import LoadingBasic from "../demos/loading-basic.vue";
import LoadingList from "../demos/loading-list.vue";
import LoadingQuiet from "../demos/loading-quiet.vue";
import MdBasic from "../demos/md-basic.vue";
import MdStream from "../demos/md-stream.vue";
import MdHeights from "../demos/md-heights.vue";
import MediaBasic from "../demos/media-basic.vue";
import MediaAudio from "../demos/media-audio.vue";
import MediaMethods from "../demos/media-methods.vue";
import NotifyBasic from "../demos/notify-basic.vue";
import NotifyActions from "../demos/notify-actions.vue";
import NotifyFail from "../demos/notify-fail.vue";
import NumberBasic from "../demos/number-basic.vue";
import NumberControlled from "../demos/number-controlled.vue";
import NumberRange from "../demos/number-range.vue";
import NumflowBasic from "../demos/numflow-basic.vue";
import NumflowCounter from "../demos/numflow-counter.vue";
import NumflowStyles from "../demos/numflow-styles.vue";
import OptimisticBasic from "../demos/optimistic-basic.vue";
import OptimisticSwitch from "../demos/optimistic-switch.vue";
import OptimisticPending from "../demos/optimistic-pending.vue";
import OtpBasic from "../demos/otp-basic.vue";
import OtpComplete from "../demos/otp-complete.vue";
import OtpLength from "../demos/otp-length.vue";
import PickerBasic from "../demos/picker-basic.vue";
import PickerRange from "../demos/picker-range.vue";
import PickerTime from "../demos/picker-time.vue";
import PickerDatetime from "../demos/picker-datetime.vue";
import PickerRegion from "../demos/picker-region.vue";
import PickerEvents from "../demos/picker-events.vue";
import PopconfirmBasic from "../demos/popconfirm-basic.vue";
import PopconfirmUndo from "../demos/popconfirm-undo.vue";
import PopconfirmSubmit from "../demos/popconfirm-submit.vue";
import PopoverBasic from "../demos/popover-basic.vue";
import PopoverControlled from "../demos/popover-controlled.vue";
import PopoverAlign from "../demos/popover-align.vue";
import ProgressBasic from "../demos/progress-basic.vue";
import ProgressRing from "../demos/progress-ring.vue";
import ProgressControlled from "../demos/progress-controlled.vue";
import PromptBasic from "../demos/prompt-basic.vue";
import PromptStop from "../demos/prompt-stop.vue";
import PromptUpload from "../demos/prompt-upload.vue";
import PromptParts from "../demos/prompt-parts.vue";
import ReorderBasic from "../demos/reorder-basic.vue";
import ReorderOrder from "../demos/reorder-order.vue";
import ReorderSave from "../demos/reorder-save.vue";
import ScrollareaBasic from "../demos/scrollarea-basic.vue";
import ScrollareaBar from "../demos/scrollarea-bar.vue";
import ScrollareaNone from "../demos/scrollarea-none.vue";
import SegmentedBasic from "../demos/segmented-basic.vue";
import SegmentedControlled from "../demos/segmented-controlled.vue";
import SegmentedSizes from "../demos/segmented-sizes.vue";
import SelectBasic from "../demos/select-basic.vue";
import SelectPlaceholder from "../demos/select-placeholder.vue";
import SelectOptions from "../demos/select-options.vue";
import SelectField from "../demos/select-field.vue";
import SelectEvents from "../demos/select-events.vue";
import SelectControlled from "../demos/select-controlled.vue";
import SelectMenu from "../demos/select-menu.vue";
import SidebarBasic from "../demos/sidebar-basic.vue";
import SidebarControlled from "../demos/sidebar-controlled.vue";
import SidebarFx from "../demos/sidebar-fx.vue";
import SliderBasic from "../demos/slider-basic.vue";
import SliderControlled from "../demos/slider-controlled.vue";
import SliderMax from "../demos/slider-max.vue";
import SpecialBasic from "../demos/special-basic.vue";
import SpecialPassword from "../demos/special-password.vue";
import SpecialEmail from "../demos/special-email.vue";
import TableBasic from "../demos/table-basic.vue";
import TableControlled from "../demos/table-controlled.vue";
import TableStates from "../demos/table-states.vue";
import TableTree from "../demos/table-tree.vue";
import TableMerge from "../demos/table-merge.vue";
import TableDrag from "../demos/table-drag.vue";
import TabsBasic from "../demos/tabs-basic.vue";
import TabsControlled from "../demos/tabs-controlled.vue";
import TabsPager from "../demos/tabs-pager.vue";
import TabsSteps from "../demos/tabs-steps.vue";
import TaginputBasic from "../demos/taginput-basic.vue";
import TaginputControlled from "../demos/taginput-controlled.vue";
import TaginputHint from "../demos/taginput-hint.vue";
import TagsBasic from "../demos/tags-basic.vue";
import TagsBadge from "../demos/tags-badge.vue";
import TagsAvatar from "../demos/tags-avatar.vue";
import ToastBasic from "../demos/toast-basic.vue";
import ToastAction from "../demos/toast-action.vue";
import ToastProgress from "../demos/toast-progress.vue";
import TooltipBasic from "../demos/tooltip-basic.vue";
import TooltipKbd from "../demos/tooltip-kbd.vue";
import TooltipTruncate from "../demos/tooltip-truncate.vue";
import UploadBasic from "../demos/upload-basic.vue";
import UploadReal from "../demos/upload-real.vue";
import UploadSingle from "../demos/upload-single.vue";
import VlistBasic from "../demos/vlist-basic.vue";
import VlistTotal from "../demos/vlist-total.vue";
import VlistRetry from "../demos/vlist-retry.vue";
</script>

<template>
<main class="gallery">
  <section id="color">
    <h2>颜色</h2>
    <div class="demo" data-demo="color-0"><DemoGuard slug="color-0"><ColorDemo0 /></DemoGuard></div>
  </section>
  <section id="type">
    <h2>排版</h2>
    <div class="demo" data-demo="type-0"><DemoGuard slug="type-0"><TypeDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="type-1"><DemoGuard slug="type-1"><TypeDemo1 /></DemoGuard></div>
    <div class="demo" data-demo="type-2"><DemoGuard slug="type-2"><TypeDemo2 /></DemoGuard></div>
  </section>
  <section id="spacing">
    <h2>间距</h2>
    <div class="demo" data-demo="spacing-0"><DemoGuard slug="spacing-0"><SpacingDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="spacing-1"><DemoGuard slug="spacing-1"><SpacingDemo1 /></DemoGuard></div>
    <div class="demo" data-demo="spacing-2"><DemoGuard slug="spacing-2"><SpacingDemo2 /></DemoGuard></div>
    <div class="demo" data-demo="spacing-3"><DemoGuard slug="spacing-3"><SpacingDemo3 /></DemoGuard></div>
  </section>
  <section id="layout">
    <h2>布局</h2>
    <div class="demo" data-demo="layout-0"><DemoGuard slug="layout-0"><LayoutDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="layout-1"><DemoGuard slug="layout-1"><LayoutDemo1 /></DemoGuard></div>
  </section>
  <section id="space">
    <h2>圆角与线</h2>
    <div class="demo" data-demo="space-0"><DemoGuard slug="space-0"><SpaceDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="space-1"><DemoGuard slug="space-1"><SpaceDemo1 /></DemoGuard></div>
  </section>
  <section id="elevation">
    <h2>阴影与层级</h2>
    <div class="demo" data-demo="elevation-0"><DemoGuard slug="elevation-0"><ElevationDemo0 /></DemoGuard></div>
  </section>
  <section id="motion">
    <h2>动效曲线</h2>
    <div class="demo" data-demo="motion-0"><DemoGuard slug="motion-0"><MotionDemo0 /></DemoGuard></div>
  </section>
  <section id="icons">
    <h2>图标</h2>
    <div class="demo" data-demo="icons-0"><DemoGuard slug="icons-0"><IconsDemo0 /></DemoGuard></div>
  </section>
  <section id="button">
    <h2>按钮</h2>
    <div class="demo" data-demo="button-0"><DemoGuard slug="button-0"><ButtonDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="button-1"><DemoGuard slug="button-1"><ButtonDemo1 /></DemoGuard></div>
    <div class="demo" data-demo="button-2"><DemoGuard slug="button-2"><ButtonDemo2 /></DemoGuard></div>
    <div class="demo" data-demo="button-3"><DemoGuard slug="button-3"><ButtonDemo3 /></DemoGuard></div>
  </section>
  <section id="iconbutton">
    <h2>纯图标按钮</h2>
    <div class="demo" data-demo="iconbutton-0"><DemoGuard slug="iconbutton-0"><IconbuttonDemo0 /></DemoGuard></div>
  </section>
  <section id="link">
    <h2>文字链接</h2>
    <div class="demo" data-demo="link-0"><DemoGuard slug="link-0"><LinkDemo0 /></DemoGuard></div>
  </section>
  <section id="compound">
    <h2>组合按钮</h2>
    <div class="demo" data-demo="compound-0"><DemoGuard slug="compound-0"><CompoundDemo0 /></DemoGuard></div>
  </section>
  <section id="chip">
    <h2>切换芯片</h2>
    <div class="demo" data-demo="chip-0"><DemoGuard slug="chip-0"><ChipDemo0 /></DemoGuard></div>
  </section>
  <section id="field">
    <h2>字段与错误</h2>
    <div class="demo" data-demo="field-0"><DemoGuard slug="field-0"><FieldDemo0 /></DemoGuard></div>
  </section>
  <section id="input">
    <h2>输入框</h2>
    <div class="demo" data-demo="input-0"><DemoGuard slug="input-0"><InputDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="input-1"><DemoGuard slug="input-1"><InputDemo1 /></DemoGuard></div>
    <div class="demo" data-demo="input-2"><DemoGuard slug="input-2"><InputDemo2 /></DemoGuard></div>
  </section>
  <section id="special">
    <h2>搜索、密码、邮箱</h2>
    <div class="demo" data-demo="special-0"><DemoGuard slug="special-0"><SpecialDemo0 /></DemoGuard></div>
  </section>
  <section id="count">
    <h2>字数统计</h2>
    <div class="demo" data-demo="count-0"><DemoGuard slug="count-0"><CountDemo0 /></DemoGuard></div>
  </section>
  <section id="taginput">
    <h2>标签输入</h2>
    <div class="demo" data-demo="taginput-0"><DemoGuard slug="taginput-0"><TaginputDemo0 /></DemoGuard></div>
  </section>
  <section id="number">
    <h2>数字步进</h2>
    <div class="demo" data-demo="number-0"><DemoGuard slug="number-0"><NumberDemo0 /></DemoGuard></div>
  </section>
  <section id="prompt">
    <h2>提示词输入框</h2>
    <div class="demo" data-demo="prompt-0"><DemoGuard slug="prompt-0"><PromptDemo0 /></DemoGuard></div>
  </section>
  <section id="select">
    <h2>下拉选择与菜单</h2>
    <div class="demo" data-demo="select-0"><DemoGuard slug="select-0"><SelectDemo0 /></DemoGuard></div>
  </section>
  <section id="picker">
    <h2>日期、时间、地址</h2>
    <div class="demo" data-demo="picker-0"><DemoGuard slug="picker-0"><PickerDemo0 /></DemoGuard></div>
  </section>
  <section id="choice">
    <h2>复选、单选、开关</h2>
    <div class="demo" data-demo="choice-0"><DemoGuard slug="choice-0"><ChoiceDemo0 /></DemoGuard></div>
  </section>
  <section id="segmented">
    <h2>分段控件</h2>
    <div class="demo" data-demo="segmented-0"><DemoGuard slug="segmented-0"><SegmentedDemo0 /></DemoGuard></div>
  </section>
  <section id="slider">
    <h2>滑块</h2>
    <div class="demo" data-demo="slider-0"><DemoGuard slug="slider-0"><SliderDemo0 /></DemoGuard></div>
  </section>
  <section id="otp">
    <h2>验证码</h2>
    <div class="demo" data-demo="otp-0"><DemoGuard slug="otp-0"><OtpDemo0 /></DemoGuard></div>
  </section>
  <section id="tooltip">
    <h2>文字提示</h2>
    <div class="demo" data-demo="tooltip-0"><DemoGuard slug="tooltip-0"><TooltipDemo0 /></DemoGuard></div>
  </section>
  <section id="popover">
    <h2>弹出面板</h2>
    <div class="demo" data-demo="popover-0"><DemoGuard slug="popover-0"><PopoverDemo0 /></DemoGuard></div>
  </section>
  <section id="popconfirm">
    <h2>气泡确认</h2>
    <div class="demo" data-demo="popconfirm-0"><DemoGuard slug="popconfirm-0"><PopconfirmDemo0 /></DemoGuard></div>
  </section>
  <section id="ctxmenu">
    <h2>右键菜单与子菜单</h2>
    <div class="demo" data-demo="ctxmenu-0"><DemoGuard slug="ctxmenu-0"><CtxmenuDemo0 /></DemoGuard></div>
  </section>
  <section id="dialog">
    <h2>弹窗</h2>
    <div class="demo" data-demo="dialog-0"><DemoGuard slug="dialog-0"><DialogDemo0 /></DemoGuard></div>
  </section>
  <section id="drawer">
    <h2>抽屉</h2>
    <div class="demo" data-demo="drawer-0"><DemoGuard slug="drawer-0"><DrawerDemo0 /></DemoGuard></div>
  </section>
  <section id="cmdk">
    <h2>命令面板</h2>
    <div class="demo" data-demo="cmdk-0"><DemoGuard slug="cmdk-0"><CmdkDemo0 /></DemoGuard></div>
  </section>
  <section id="toast">
    <h2>轻提示</h2>
    <div class="demo" data-demo="toast-0"><DemoGuard slug="toast-0"><ToastDemo0 /></DemoGuard></div>
  </section>
  <section id="notify">
    <h2>通知</h2>
    <div class="demo" data-demo="notify-0"><DemoGuard slug="notify-0"><NotifyDemo0 /></DemoGuard></div>
  </section>
  <section id="banner">
    <h2>横幅与条目上的失败</h2>
    <div class="demo" data-demo="banner-0"><DemoGuard slug="banner-0"><BannerDemo0 /></DemoGuard></div>
  </section>
  <section id="empty">
    <h2>空状态</h2>
    <div class="demo" data-demo="empty-0"><DemoGuard slug="empty-0"><EmptyDemo0 /></DemoGuard></div>
  </section>
  <section id="loading">
    <h2>骨架与加载</h2>
    <div class="demo" data-demo="loading-0"><DemoGuard slug="loading-0"><LoadingDemo0 /></DemoGuard></div>
  </section>
  <section id="progress">
    <h2>进度</h2>
    <div class="demo" data-demo="progress-0"><DemoGuard slug="progress-0"><ProgressDemo0 /></DemoGuard></div>
  </section>
  <section id="numflow">
    <h2>数字变化</h2>
    <div class="demo" data-demo="numflow-0"><DemoGuard slug="numflow-0"><NumflowDemo0 /></DemoGuard></div>
  </section>
  <section id="table">
    <h2>表格</h2>
    <div class="demo" data-demo="table-0"><DemoGuard slug="table-0"><TableDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="table-1"><DemoGuard slug="table-1"><TableDemo1 /></DemoGuard></div>
    <div class="demo" data-demo="table-2"><DemoGuard slug="table-2"><TableDemo2 /></DemoGuard></div>
    <div class="demo" data-demo="table-3"><DemoGuard slug="table-3"><TableDemo3 /></DemoGuard></div>
    <div class="demo" data-demo="table-4"><DemoGuard slug="table-4"><TableDemo4 /></DemoGuard></div>
    <div class="demo" data-demo="table-5"><DemoGuard slug="table-5"><TableDemo5 /></DemoGuard></div>
    <div class="demo" data-demo="table-6"><DemoGuard slug="table-6"><TableDemo6 /></DemoGuard></div>
    <div class="demo" data-demo="table-7"><DemoGuard slug="table-7"><TableDemo7 /></DemoGuard></div>
  </section>
  <section id="grid">
    <h2>数据表格</h2>
    <div class="demo" data-demo="grid-0"><DemoGuard slug="grid-0"><GridDemo0 /></DemoGuard></div>
  </section>
  <section id="cgrid">
    <h2>Canvas 表格</h2>
    <div class="demo" data-demo="cgrid-0"><DemoGuard slug="cgrid-0"><CgridDemo0 /></DemoGuard></div>
  </section>
  <section id="list">
    <h2>列表与键值</h2>
    <div class="demo" data-demo="list-0"><DemoGuard slug="list-0"><ListDemo0 /></DemoGuard></div>
  </section>
  <section id="card">
    <h2>卡片</h2>
    <div class="demo" data-demo="card-0"><DemoGuard slug="card-0"><CardDemo0 /></DemoGuard></div>
  </section>
  <section id="tags">
    <h2>标签、徽标与头像</h2>
    <div class="demo" data-demo="tags-0"><DemoGuard slug="tags-0"><TagsDemo0 /></DemoGuard></div>
  </section>
  <section id="avatar">
    <h2>头像</h2>
    <div class="demo" data-demo="avatar-0"><DemoGuard slug="avatar-0"><AvatarDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="avatar-1"><DemoGuard slug="avatar-1"><AvatarDemo1 /></DemoGuard></div>
    <div class="demo" data-demo="avatar-2"><DemoGuard slug="avatar-2"><AvatarDemo2 /></DemoGuard></div>
  </section>
  <section id="collapse">
    <h2>折叠面板</h2>
    <div class="demo" data-demo="collapse-0"><DemoGuard slug="collapse-0"><CollapseDemo0 /></DemoGuard></div>
  </section>
  <section id="scrollarea">
    <h2>滚动区域</h2>
    <div class="demo" data-demo="scrollarea-0"><DemoGuard slug="scrollarea-0"><ScrollareaDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="scrollarea-1"><DemoGuard slug="scrollarea-1"><ScrollareaDemo1 /></DemoGuard></div>
    <div class="demo" data-demo="scrollarea-2"><DemoGuard slug="scrollarea-2"><ScrollareaDemo2 /></DemoGuard></div>
    <div class="demo" data-demo="scrollarea-3"><DemoGuard slug="scrollarea-3"><ScrollareaDemo3 /></DemoGuard></div>
    <div class="demo" data-demo="scrollarea-4"><DemoGuard slug="scrollarea-4"><ScrollareaDemo4 /></DemoGuard></div>
    <div class="demo" data-demo="scrollarea-5"><DemoGuard slug="scrollarea-5"><ScrollareaDemo5 /></DemoGuard></div>
    <div class="demo" data-demo="scrollarea-6"><DemoGuard slug="scrollarea-6"><ScrollareaDemo6 /></DemoGuard></div>
  </section>
  <section id="vlist">
    <h2>无限列表</h2>
    <div class="demo" data-demo="vlist-0"><DemoGuard slug="vlist-0"><VlistDemo0 /></DemoGuard></div>
  </section>
  <section id="chat">
    <h2>聊天与 AI 对话</h2>
    <div class="demo" data-demo="chat-0"><DemoGuard slug="chat-0"><ChatDemo0 /></DemoGuard></div>
    <div class="demo" data-demo="chat-1"><DemoGuard slug="chat-1"><ChatDemo1 /></DemoGuard></div>
  </section>
  <section id="md">
    <h2>Markdown 文档</h2>
    <div class="demo" data-demo="md-0"><DemoGuard slug="md-0"><MdDemo0 /></DemoGuard></div>
  </section>
  <section id="flow">
    <h2>流程图</h2>
    <div class="demo" data-demo="flow-0"><DemoGuard slug="flow-0"><FlowDemo0 /></DemoGuard></div>
  </section>
  <section id="image">
    <h2>图片</h2>
    <div class="demo" data-demo="image-0"><DemoGuard slug="image-0"><ImageDemo0 /></DemoGuard></div>
  </section>
  <section id="media">
    <h2>视频与音频</h2>
    <div class="demo" data-demo="media-0"><DemoGuard slug="media-0"><MediaDemo0 /></DemoGuard></div>
  </section>
  <section id="upload">
    <h2>上传</h2>
    <div class="demo" data-demo="upload-0"><DemoGuard slug="upload-0"><UploadDemo0 /></DemoGuard></div>
  </section>
  <section id="sidebar">
    <h2>侧栏与布局</h2>
    <div class="demo" data-demo="sidebar-0"><DemoGuard slug="sidebar-0"><SidebarDemo0 /></DemoGuard></div>
  </section>
  <section id="tabs">
    <h2>标签页、分页、步骤</h2>
    <div class="demo" data-demo="tabs-0"><DemoGuard slug="tabs-0"><TabsDemo0 /></DemoGuard></div>
  </section>
  <section id="reorder">
    <h2>拖拽重排</h2>
    <div class="demo" data-demo="reorder-0"><DemoGuard slug="reorder-0"><ReorderDemo0 /></DemoGuard></div>
  </section>
  <section id="addremove">
    <h2>新增与删除</h2>
    <div class="demo" data-demo="addremove-0"><DemoGuard slug="addremove-0"><AddremoveDemo0 /></DemoGuard></div>
  </section>
  <section id="optimistic">
    <h2>乐观更新</h2>
    <div class="demo" data-demo="optimistic-0"><DemoGuard slug="optimistic-0"><OptimisticDemo0 /></DemoGuard></div>
  </section>
  <section id="addremove">
    <h2>新增与删除</h2>
    <div class="demo" data-demo="addremove-basic"><DemoGuard slug="addremove-basic"><AddremoveBasic /></DemoGuard></div>
    <div class="demo" data-demo="addremove-undo"><DemoGuard slug="addremove-undo"><AddremoveUndo /></DemoGuard></div>
    <div class="demo" data-demo="addremove-rows"><DemoGuard slug="addremove-rows"><AddremoveRows /></DemoGuard></div>
  </section>
  <section id="avatar">
    <h2>头像</h2>
    <div class="demo" data-demo="avatar-basic"><DemoGuard slug="avatar-basic"><AvatarBasic /></DemoGuard></div>
    <div class="demo" data-demo="avatar-list"><DemoGuard slug="avatar-list"><AvatarList /></DemoGuard></div>
  </section>
  <section id="banner">
    <h2>横幅与条目上的失败</h2>
    <div class="demo" data-demo="banner-basic"><DemoGuard slug="banner-basic"><BannerBasic /></DemoGuard></div>
    <div class="demo" data-demo="banner-dismiss"><DemoGuard slug="banner-dismiss"><BannerDismiss /></DemoGuard></div>
    <div class="demo" data-demo="banner-error"><DemoGuard slug="banner-error"><BannerError /></DemoGuard></div>
  </section>
  <section id="button">
    <h2>按钮</h2>
    <div class="demo" data-demo="button-basic"><DemoGuard slug="button-basic"><ButtonBasic /></DemoGuard></div>
    <div class="demo" data-demo="button-variants"><DemoGuard slug="button-variants"><ButtonVariants /></DemoGuard></div>
    <div class="demo" data-demo="button-sizes"><DemoGuard slug="button-sizes"><ButtonSizes /></DemoGuard></div>
    <div class="demo" data-demo="button-icons"><DemoGuard slug="button-icons"><ButtonIcons /></DemoGuard></div>
    <div class="demo" data-demo="button-states"><DemoGuard slug="button-states"><ButtonStates /></DemoGuard></div>
    <div class="demo" data-demo="button-busy"><DemoGuard slug="button-busy"><ButtonBusy /></DemoGuard></div>
    <div class="demo" data-demo="button-actions"><DemoGuard slug="button-actions"><ButtonActions /></DemoGuard></div>
    <div class="demo" data-demo="button-mobile"><DemoGuard slug="button-mobile"><ButtonMobile /></DemoGuard></div>
  </section>
  <section id="card">
    <h2>卡片</h2>
    <div class="demo" data-demo="card-basic"><DemoGuard slug="card-basic"><CardBasic /></DemoGuard></div>
    <div class="demo" data-demo="card-grid"><DemoGuard slug="card-grid"><CardGrid /></DemoGuard></div>
    <div class="demo" data-demo="card-select"><DemoGuard slug="card-select"><CardSelect /></DemoGuard></div>
  </section>
  <section id="cgrid">
    <h2>Canvas 表格</h2>
    <div class="demo" data-demo="cgrid-basic"><DemoGuard slug="cgrid-basic"><CgridBasic /></DemoGuard></div>
    <div class="demo" data-demo="cgrid-million"><DemoGuard slug="cgrid-million"><CgridMillion /></DemoGuard></div>
    <div class="demo" data-demo="cgrid-controlled"><DemoGuard slug="cgrid-controlled"><CgridControlled /></DemoGuard></div>
    <div class="demo" data-demo="cgrid-events"><DemoGuard slug="cgrid-events"><CgridEvents /></DemoGuard></div>
  </section>
  <section id="chat">
    <h2>聊天与 AI 对话</h2>
    <div class="demo" data-demo="chat-basic"><DemoGuard slug="chat-basic"><ChatBasic /></DemoGuard></div>
    <div class="demo" data-demo="chat-new"><DemoGuard slug="chat-new"><ChatNew /></DemoGuard></div>
    <div class="demo" data-demo="chat-history"><DemoGuard slug="chat-history"><ChatHistory /></DemoGuard></div>
    <div class="demo" data-demo="chat-rich"><DemoGuard slug="chat-rich"><ChatRich /></DemoGuard></div>
  </section>
  <section id="chip">
    <h2>切换芯片</h2>
    <div class="demo" data-demo="chip-basic"><DemoGuard slug="chip-basic"><ChipBasic /></DemoGuard></div>
    <div class="demo" data-demo="chip-controlled"><DemoGuard slug="chip-controlled"><ChipControlled /></DemoGuard></div>
    <div class="demo" data-demo="chip-removable"><DemoGuard slug="chip-removable"><ChipRemovable /></DemoGuard></div>
  </section>
  <section id="choice">
    <h2>复选、单选、开关</h2>
    <div class="demo" data-demo="choice-basic"><DemoGuard slug="choice-basic"><ChoiceBasic /></DemoGuard></div>
    <div class="demo" data-demo="choice-radio"><DemoGuard slug="choice-radio"><ChoiceRadio /></DemoGuard></div>
    <div class="demo" data-demo="choice-controlled"><DemoGuard slug="choice-controlled"><ChoiceControlled /></DemoGuard></div>
  </section>
  <section id="cmdk">
    <h2>命令面板</h2>
    <div class="demo" data-demo="cmdk-basic"><DemoGuard slug="cmdk-basic"><CmdkBasic /></DemoGuard></div>
    <div class="demo" data-demo="cmdk-empty"><DemoGuard slug="cmdk-empty"><CmdkEmpty /></DemoGuard></div>
    <div class="demo" data-demo="cmdk-hotkey"><DemoGuard slug="cmdk-hotkey"><CmdkHotkey /></DemoGuard></div>
  </section>
  <section id="collapse">
    <h2>折叠面板</h2>
    <div class="demo" data-demo="collapse-basic"><DemoGuard slug="collapse-basic"><CollapseBasic /></DemoGuard></div>
    <div class="demo" data-demo="collapse-single"><DemoGuard slug="collapse-single"><CollapseSingle /></DemoGuard></div>
    <div class="demo" data-demo="collapse-controlled"><DemoGuard slug="collapse-controlled"><CollapseControlled /></DemoGuard></div>
  </section>
  <section id="compound">
    <h2>组合按钮</h2>
    <div class="demo" data-demo="compound-basic"><DemoGuard slug="compound-basic"><CompoundBasic /></DemoGuard></div>
    <div class="demo" data-demo="compound-split"><DemoGuard slug="compound-split"><CompoundSplit /></DemoGuard></div>
    <div class="demo" data-demo="compound-copy"><DemoGuard slug="compound-copy"><CompoundCopy /></DemoGuard></div>
  </section>
  <section id="count">
    <h2>字数统计</h2>
    <div class="demo" data-demo="count-basic"><DemoGuard slug="count-basic"><CountBasic /></DemoGuard></div>
    <div class="demo" data-demo="count-controlled"><DemoGuard slug="count-controlled"><CountControlled /></DemoGuard></div>
    <div class="demo" data-demo="count-longtext"><DemoGuard slug="count-longtext"><CountLongtext /></DemoGuard></div>
  </section>
  <section id="ctxmenu">
    <h2>右键菜单与子菜单</h2>
    <div class="demo" data-demo="ctxmenu-basic"><DemoGuard slug="ctxmenu-basic"><CtxmenuBasic /></DemoGuard></div>
    <div class="demo" data-demo="ctxmenu-context"><DemoGuard slug="ctxmenu-context"><CtxmenuContext /></DemoGuard></div>
    <div class="demo" data-demo="ctxmenu-submenu"><DemoGuard slug="ctxmenu-submenu"><CtxmenuSubmenu /></DemoGuard></div>
  </section>
  <section id="dialog">
    <h2>弹窗</h2>
    <div class="demo" data-demo="dialog-basic"><DemoGuard slug="dialog-basic"><DialogBasic /></DemoGuard></div>
    <div class="demo" data-demo="dialog-danger"><DemoGuard slug="dialog-danger"><DialogDanger /></DemoGuard></div>
    <div class="demo" data-demo="dialog-guard"><DemoGuard slug="dialog-guard"><DialogGuard /></DemoGuard></div>
    <div class="demo" data-demo="dialog-events"><DemoGuard slug="dialog-events"><DialogEvents /></DemoGuard></div>
    <div class="demo" data-demo="dialog-controlled"><DemoGuard slug="dialog-controlled"><DialogControlled /></DemoGuard></div>
  </section>
  <section id="drawer">
    <h2>抽屉</h2>
    <div class="demo" data-demo="drawer-basic"><DemoGuard slug="drawer-basic"><DrawerBasic /></DemoGuard></div>
    <div class="demo" data-demo="drawer-controlled"><DemoGuard slug="drawer-controlled"><DrawerControlled /></DemoGuard></div>
    <div class="demo" data-demo="drawer-footer"><DemoGuard slug="drawer-footer"><DrawerFooter /></DemoGuard></div>
  </section>
  <section id="empty">
    <h2>空状态</h2>
    <div class="demo" data-demo="empty-basic"><DemoGuard slug="empty-basic"><EmptyBasic /></DemoGuard></div>
    <div class="demo" data-demo="empty-search"><DemoGuard slug="empty-search"><EmptySearch /></DemoGuard></div>
    <div class="demo" data-demo="empty-error"><DemoGuard slug="empty-error"><EmptyError /></DemoGuard></div>
  </section>
  <section id="field">
    <h2>字段与错误</h2>
    <div class="demo" data-demo="field-basic"><DemoGuard slug="field-basic"><FieldBasic /></DemoGuard></div>
    <div class="demo" data-demo="field-error"><DemoGuard slug="field-error"><FieldError /></DemoGuard></div>
    <div class="demo" data-demo="field-optional"><DemoGuard slug="field-optional"><FieldOptional /></DemoGuard></div>
  </section>
  <section id="flow">
    <h2>流程图</h2>
    <div class="demo" data-demo="flow-basic"><DemoGuard slug="flow-basic"><FlowBasic /></DemoGuard></div>
    <div class="demo" data-demo="flow-branch"><DemoGuard slug="flow-branch"><FlowBranch /></DemoGuard></div>
    <div class="demo" data-demo="flow-tidy"><DemoGuard slug="flow-tidy"><FlowTidy /></DemoGuard></div>
  </section>
  <section id="flowstress">
    <h2>万级节点压测</h2>
    <div class="demo" data-demo="flowstress-many"><DemoGuard slug="flowstress-many"><FlowstressMany /></DemoGuard></div>
  </section>
  <section id="grid">
    <h2>数据表格</h2>
    <div class="demo" data-demo="grid-basic"><DemoGuard slug="grid-basic"><GridBasic /></DemoGuard></div>
    <div class="demo" data-demo="grid-sort"><DemoGuard slug="grid-sort"><GridSort /></DemoGuard></div>
    <div class="demo" data-demo="grid-select"><DemoGuard slug="grid-select"><GridSelect /></DemoGuard></div>
    <div class="demo" data-demo="grid-render"><DemoGuard slug="grid-render"><GridRender /></DemoGuard></div>
    <div class="demo" data-demo="grid-remote"><DemoGuard slug="grid-remote"><GridRemote /></DemoGuard></div>
    <div class="demo" data-demo="grid-edit"><DemoGuard slug="grid-edit"><GridEdit /></DemoGuard></div>
    <div class="demo" data-demo="grid-states"><DemoGuard slug="grid-states"><GridStates /></DemoGuard></div>
  </section>
  <section id="iconbutton">
    <h2>纯图标按钮</h2>
    <div class="demo" data-demo="iconbutton-basic"><DemoGuard slug="iconbutton-basic"><IconbuttonBasic /></DemoGuard></div>
    <div class="demo" data-demo="iconbutton-variants"><DemoGuard slug="iconbutton-variants"><IconbuttonVariants /></DemoGuard></div>
    <div class="demo" data-demo="iconbutton-states"><DemoGuard slug="iconbutton-states"><IconbuttonStates /></DemoGuard></div>
    <div class="demo" data-demo="iconbutton-controlled"><DemoGuard slug="iconbutton-controlled"><IconbuttonControlled /></DemoGuard></div>
  </section>
  <section id="image">
    <h2>图片</h2>
    <div class="demo" data-demo="image-basic"><DemoGuard slug="image-basic"><ImageBasic /></DemoGuard></div>
    <div class="demo" data-demo="image-controlled"><DemoGuard slug="image-controlled"><ImageControlled /></DemoGuard></div>
    <div class="demo" data-demo="image-failed"><DemoGuard slug="image-failed"><ImageFailed /></DemoGuard></div>
  </section>
  <section id="input">
    <h2>输入框</h2>
    <div class="demo" data-demo="input-basic"><DemoGuard slug="input-basic"><InputBasic /></DemoGuard></div>
    <div class="demo" data-demo="input-sizes"><DemoGuard slug="input-sizes"><InputSizes /></DemoGuard></div>
    <div class="demo" data-demo="input-controlled"><DemoGuard slug="input-controlled"><InputControlled /></DemoGuard></div>
  </section>
  <section id="link">
    <h2>文字链接</h2>
    <div class="demo" data-demo="link-basic"><DemoGuard slug="link-basic"><LinkBasic /></DemoGuard></div>
    <div class="demo" data-demo="link-textbtn"><DemoGuard slug="link-textbtn"><LinkTextbtn /></DemoGuard></div>
    <div class="demo" data-demo="link-arrow"><DemoGuard slug="link-arrow"><LinkArrow /></DemoGuard></div>
  </section>
  <section id="list">
    <h2>列表与键值</h2>
    <div class="demo" data-demo="list-basic"><DemoGuard slug="list-basic"><ListBasic /></DemoGuard></div>
    <div class="demo" data-demo="list-kv"><DemoGuard slug="list-kv"><ListKv /></DemoGuard></div>
    <div class="demo" data-demo="list-switch"><DemoGuard slug="list-switch"><ListSwitch /></DemoGuard></div>
  </section>
  <section id="loading">
    <h2>骨架与加载</h2>
    <div class="demo" data-demo="loading-basic"><DemoGuard slug="loading-basic"><LoadingBasic /></DemoGuard></div>
    <div class="demo" data-demo="loading-list"><DemoGuard slug="loading-list"><LoadingList /></DemoGuard></div>
    <div class="demo" data-demo="loading-quiet"><DemoGuard slug="loading-quiet"><LoadingQuiet /></DemoGuard></div>
  </section>
  <section id="md">
    <h2>Markdown 文档</h2>
    <div class="demo" data-demo="md-basic"><DemoGuard slug="md-basic"><MdBasic /></DemoGuard></div>
    <div class="demo" data-demo="md-stream"><DemoGuard slug="md-stream"><MdStream /></DemoGuard></div>
    <div class="demo" data-demo="md-heights"><DemoGuard slug="md-heights"><MdHeights /></DemoGuard></div>
  </section>
  <section id="media">
    <h2>视频与音频</h2>
    <div class="demo" data-demo="media-basic"><DemoGuard slug="media-basic"><MediaBasic /></DemoGuard></div>
    <div class="demo" data-demo="media-audio"><DemoGuard slug="media-audio"><MediaAudio /></DemoGuard></div>
    <div class="demo" data-demo="media-methods"><DemoGuard slug="media-methods"><MediaMethods /></DemoGuard></div>
  </section>
  <section id="notify">
    <h2>通知</h2>
    <div class="demo" data-demo="notify-basic"><DemoGuard slug="notify-basic"><NotifyBasic /></DemoGuard></div>
    <div class="demo" data-demo="notify-actions"><DemoGuard slug="notify-actions"><NotifyActions /></DemoGuard></div>
    <div class="demo" data-demo="notify-fail"><DemoGuard slug="notify-fail"><NotifyFail /></DemoGuard></div>
  </section>
  <section id="number">
    <h2>数字步进</h2>
    <div class="demo" data-demo="number-basic"><DemoGuard slug="number-basic"><NumberBasic /></DemoGuard></div>
    <div class="demo" data-demo="number-controlled"><DemoGuard slug="number-controlled"><NumberControlled /></DemoGuard></div>
    <div class="demo" data-demo="number-range"><DemoGuard slug="number-range"><NumberRange /></DemoGuard></div>
  </section>
  <section id="numflow">
    <h2>数字变化</h2>
    <div class="demo" data-demo="numflow-basic"><DemoGuard slug="numflow-basic"><NumflowBasic /></DemoGuard></div>
    <div class="demo" data-demo="numflow-counter"><DemoGuard slug="numflow-counter"><NumflowCounter /></DemoGuard></div>
    <div class="demo" data-demo="numflow-styles"><DemoGuard slug="numflow-styles"><NumflowStyles /></DemoGuard></div>
  </section>
  <section id="optimistic">
    <h2>乐观更新</h2>
    <div class="demo" data-demo="optimistic-basic"><DemoGuard slug="optimistic-basic"><OptimisticBasic /></DemoGuard></div>
    <div class="demo" data-demo="optimistic-switch"><DemoGuard slug="optimistic-switch"><OptimisticSwitch /></DemoGuard></div>
    <div class="demo" data-demo="optimistic-pending"><DemoGuard slug="optimistic-pending"><OptimisticPending /></DemoGuard></div>
  </section>
  <section id="otp">
    <h2>验证码</h2>
    <div class="demo" data-demo="otp-basic"><DemoGuard slug="otp-basic"><OtpBasic /></DemoGuard></div>
    <div class="demo" data-demo="otp-complete"><DemoGuard slug="otp-complete"><OtpComplete /></DemoGuard></div>
    <div class="demo" data-demo="otp-length"><DemoGuard slug="otp-length"><OtpLength /></DemoGuard></div>
  </section>
  <section id="picker">
    <h2>日期、时间、地址</h2>
    <div class="demo" data-demo="picker-basic"><DemoGuard slug="picker-basic"><PickerBasic /></DemoGuard></div>
    <div class="demo" data-demo="picker-range"><DemoGuard slug="picker-range"><PickerRange /></DemoGuard></div>
    <div class="demo" data-demo="picker-time"><DemoGuard slug="picker-time"><PickerTime /></DemoGuard></div>
    <div class="demo" data-demo="picker-datetime"><DemoGuard slug="picker-datetime"><PickerDatetime /></DemoGuard></div>
    <div class="demo" data-demo="picker-region"><DemoGuard slug="picker-region"><PickerRegion /></DemoGuard></div>
    <div class="demo" data-demo="picker-events"><DemoGuard slug="picker-events"><PickerEvents /></DemoGuard></div>
  </section>
  <section id="popconfirm">
    <h2>气泡确认</h2>
    <div class="demo" data-demo="popconfirm-basic"><DemoGuard slug="popconfirm-basic"><PopconfirmBasic /></DemoGuard></div>
    <div class="demo" data-demo="popconfirm-undo"><DemoGuard slug="popconfirm-undo"><PopconfirmUndo /></DemoGuard></div>
    <div class="demo" data-demo="popconfirm-submit"><DemoGuard slug="popconfirm-submit"><PopconfirmSubmit /></DemoGuard></div>
  </section>
  <section id="popover">
    <h2>弹出面板</h2>
    <div class="demo" data-demo="popover-basic"><DemoGuard slug="popover-basic"><PopoverBasic /></DemoGuard></div>
    <div class="demo" data-demo="popover-controlled"><DemoGuard slug="popover-controlled"><PopoverControlled /></DemoGuard></div>
    <div class="demo" data-demo="popover-align"><DemoGuard slug="popover-align"><PopoverAlign /></DemoGuard></div>
  </section>
  <section id="progress">
    <h2>进度</h2>
    <div class="demo" data-demo="progress-basic"><DemoGuard slug="progress-basic"><ProgressBasic /></DemoGuard></div>
    <div class="demo" data-demo="progress-ring"><DemoGuard slug="progress-ring"><ProgressRing /></DemoGuard></div>
    <div class="demo" data-demo="progress-controlled"><DemoGuard slug="progress-controlled"><ProgressControlled /></DemoGuard></div>
  </section>
  <section id="prompt">
    <h2>提示词输入框</h2>
    <div class="demo" data-demo="prompt-basic"><DemoGuard slug="prompt-basic"><PromptBasic /></DemoGuard></div>
    <div class="demo" data-demo="prompt-stop"><DemoGuard slug="prompt-stop"><PromptStop /></DemoGuard></div>
    <div class="demo" data-demo="prompt-upload"><DemoGuard slug="prompt-upload"><PromptUpload /></DemoGuard></div>
    <div class="demo" data-demo="prompt-parts"><DemoGuard slug="prompt-parts"><PromptParts /></DemoGuard></div>
  </section>
  <section id="reorder">
    <h2>拖拽重排</h2>
    <div class="demo" data-demo="reorder-basic"><DemoGuard slug="reorder-basic"><ReorderBasic /></DemoGuard></div>
    <div class="demo" data-demo="reorder-order"><DemoGuard slug="reorder-order"><ReorderOrder /></DemoGuard></div>
    <div class="demo" data-demo="reorder-save"><DemoGuard slug="reorder-save"><ReorderSave /></DemoGuard></div>
  </section>
  <section id="scrollarea">
    <h2>滚动区域</h2>
    <div class="demo" data-demo="scrollarea-basic"><DemoGuard slug="scrollarea-basic"><ScrollareaBasic /></DemoGuard></div>
    <div class="demo" data-demo="scrollarea-bar"><DemoGuard slug="scrollarea-bar"><ScrollareaBar /></DemoGuard></div>
    <div class="demo" data-demo="scrollarea-none"><DemoGuard slug="scrollarea-none"><ScrollareaNone /></DemoGuard></div>
  </section>
  <section id="segmented">
    <h2>分段控件</h2>
    <div class="demo" data-demo="segmented-basic"><DemoGuard slug="segmented-basic"><SegmentedBasic /></DemoGuard></div>
    <div class="demo" data-demo="segmented-controlled"><DemoGuard slug="segmented-controlled"><SegmentedControlled /></DemoGuard></div>
    <div class="demo" data-demo="segmented-sizes"><DemoGuard slug="segmented-sizes"><SegmentedSizes /></DemoGuard></div>
  </section>
  <section id="select">
    <h2>下拉选择与菜单</h2>
    <div class="demo" data-demo="select-basic"><DemoGuard slug="select-basic"><SelectBasic /></DemoGuard></div>
    <div class="demo" data-demo="select-placeholder"><DemoGuard slug="select-placeholder"><SelectPlaceholder /></DemoGuard></div>
    <div class="demo" data-demo="select-options"><DemoGuard slug="select-options"><SelectOptions /></DemoGuard></div>
    <div class="demo" data-demo="select-field"><DemoGuard slug="select-field"><SelectField /></DemoGuard></div>
    <div class="demo" data-demo="select-events"><DemoGuard slug="select-events"><SelectEvents /></DemoGuard></div>
    <div class="demo" data-demo="select-controlled"><DemoGuard slug="select-controlled"><SelectControlled /></DemoGuard></div>
    <div class="demo" data-demo="select-menu"><DemoGuard slug="select-menu"><SelectMenu /></DemoGuard></div>
  </section>
  <section id="sidebar">
    <h2>侧栏与布局</h2>
    <div class="demo" data-demo="sidebar-basic"><DemoGuard slug="sidebar-basic"><SidebarBasic /></DemoGuard></div>
    <div class="demo" data-demo="sidebar-controlled"><DemoGuard slug="sidebar-controlled"><SidebarControlled /></DemoGuard></div>
    <div class="demo" data-demo="sidebar-fx"><DemoGuard slug="sidebar-fx"><SidebarFx /></DemoGuard></div>
  </section>
  <section id="slider">
    <h2>滑块</h2>
    <div class="demo" data-demo="slider-basic"><DemoGuard slug="slider-basic"><SliderBasic /></DemoGuard></div>
    <div class="demo" data-demo="slider-controlled"><DemoGuard slug="slider-controlled"><SliderControlled /></DemoGuard></div>
    <div class="demo" data-demo="slider-max"><DemoGuard slug="slider-max"><SliderMax /></DemoGuard></div>
  </section>
  <section id="special">
    <h2>搜索、密码、邮箱</h2>
    <div class="demo" data-demo="special-basic"><DemoGuard slug="special-basic"><SpecialBasic /></DemoGuard></div>
    <div class="demo" data-demo="special-password"><DemoGuard slug="special-password"><SpecialPassword /></DemoGuard></div>
    <div class="demo" data-demo="special-email"><DemoGuard slug="special-email"><SpecialEmail /></DemoGuard></div>
  </section>
  <section id="table">
    <h2>表格</h2>
    <div class="demo" data-demo="table-basic"><DemoGuard slug="table-basic"><TableBasic /></DemoGuard></div>
    <div class="demo" data-demo="table-controlled"><DemoGuard slug="table-controlled"><TableControlled /></DemoGuard></div>
    <div class="demo" data-demo="table-states"><DemoGuard slug="table-states"><TableStates /></DemoGuard></div>
    <div class="demo" data-demo="table-tree"><DemoGuard slug="table-tree"><TableTree /></DemoGuard></div>
    <div class="demo" data-demo="table-merge"><DemoGuard slug="table-merge"><TableMerge /></DemoGuard></div>
    <div class="demo" data-demo="table-drag"><DemoGuard slug="table-drag"><TableDrag /></DemoGuard></div>
  </section>
  <section id="tabs">
    <h2>标签页、分页、步骤</h2>
    <div class="demo" data-demo="tabs-basic"><DemoGuard slug="tabs-basic"><TabsBasic /></DemoGuard></div>
    <div class="demo" data-demo="tabs-controlled"><DemoGuard slug="tabs-controlled"><TabsControlled /></DemoGuard></div>
    <div class="demo" data-demo="tabs-pager"><DemoGuard slug="tabs-pager"><TabsPager /></DemoGuard></div>
    <div class="demo" data-demo="tabs-steps"><DemoGuard slug="tabs-steps"><TabsSteps /></DemoGuard></div>
  </section>
  <section id="taginput">
    <h2>标签输入</h2>
    <div class="demo" data-demo="taginput-basic"><DemoGuard slug="taginput-basic"><TaginputBasic /></DemoGuard></div>
    <div class="demo" data-demo="taginput-controlled"><DemoGuard slug="taginput-controlled"><TaginputControlled /></DemoGuard></div>
    <div class="demo" data-demo="taginput-hint"><DemoGuard slug="taginput-hint"><TaginputHint /></DemoGuard></div>
  </section>
  <section id="tags">
    <h2>标签、徽标与头像</h2>
    <div class="demo" data-demo="tags-basic"><DemoGuard slug="tags-basic"><TagsBasic /></DemoGuard></div>
    <div class="demo" data-demo="tags-badge"><DemoGuard slug="tags-badge"><TagsBadge /></DemoGuard></div>
    <div class="demo" data-demo="tags-avatar"><DemoGuard slug="tags-avatar"><TagsAvatar /></DemoGuard></div>
  </section>
  <section id="toast">
    <h2>轻提示</h2>
    <div class="demo" data-demo="toast-basic"><DemoGuard slug="toast-basic"><ToastBasic /></DemoGuard></div>
    <div class="demo" data-demo="toast-action"><DemoGuard slug="toast-action"><ToastAction /></DemoGuard></div>
    <div class="demo" data-demo="toast-progress"><DemoGuard slug="toast-progress"><ToastProgress /></DemoGuard></div>
  </section>
  <section id="tooltip">
    <h2>文字提示</h2>
    <div class="demo" data-demo="tooltip-basic"><DemoGuard slug="tooltip-basic"><TooltipBasic /></DemoGuard></div>
    <div class="demo" data-demo="tooltip-kbd"><DemoGuard slug="tooltip-kbd"><TooltipKbd /></DemoGuard></div>
    <div class="demo" data-demo="tooltip-truncate"><DemoGuard slug="tooltip-truncate"><TooltipTruncate /></DemoGuard></div>
  </section>
  <section id="upload">
    <h2>上传</h2>
    <div class="demo" data-demo="upload-basic"><DemoGuard slug="upload-basic"><UploadBasic /></DemoGuard></div>
    <div class="demo" data-demo="upload-real"><DemoGuard slug="upload-real"><UploadReal /></DemoGuard></div>
    <div class="demo" data-demo="upload-single"><DemoGuard slug="upload-single"><UploadSingle /></DemoGuard></div>
  </section>
  <section id="vlist">
    <h2>无限列表</h2>
    <div class="demo" data-demo="vlist-basic"><DemoGuard slug="vlist-basic"><VlistBasic /></DemoGuard></div>
    <div class="demo" data-demo="vlist-total"><DemoGuard slug="vlist-total"><VlistTotal /></DemoGuard></div>
    <div class="demo" data-demo="vlist-retry"><DemoGuard slug="vlist-retry"><VlistRetry /></DemoGuard></div>
  </section>
</main>
</template>
