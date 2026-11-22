// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
import { render } from "@solidjs/web";
import { Errored } from "solid-js";
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
import IconbuttonDemo0 from "./demos/iconbutton-0.jsx";
import LinkDemo0 from "./demos/link-0.jsx";
import CompoundDemo0 from "./demos/compound-0.jsx";
import ChipDemo0 from "./demos/chip-0.jsx";
import FieldDemo0 from "./demos/field-0.jsx";
import InputDemo0 from "./demos/input-0.jsx";
import InputDemo1 from "./demos/input-1.jsx";
import InputDemo2 from "./demos/input-2.jsx";
import SpecialDemo0 from "./demos/special-0.jsx";
import CountDemo0 from "./demos/count-0.jsx";
import TaginputDemo0 from "./demos/taginput-0.jsx";
import NumberDemo0 from "./demos/number-0.jsx";
import PromptDemo0 from "./demos/prompt-0.jsx";
import SelectDemo0 from "./demos/select-0.jsx";
import PickerDemo0 from "./demos/picker-0.jsx";
import ChoiceDemo0 from "./demos/choice-0.jsx";
import SegmentedDemo0 from "./demos/segmented-0.jsx";
import SliderDemo0 from "./demos/slider-0.jsx";
import OtpDemo0 from "./demos/otp-0.jsx";
import TooltipDemo0 from "./demos/tooltip-0.jsx";
import PopoverDemo0 from "./demos/popover-0.jsx";
import PopconfirmDemo0 from "./demos/popconfirm-0.jsx";
import CtxmenuDemo0 from "./demos/ctxmenu-0.jsx";
import DialogDemo0 from "./demos/dialog-0.jsx";
import DrawerDemo0 from "./demos/drawer-0.jsx";
import CmdkDemo0 from "./demos/cmdk-0.jsx";
import ToastDemo0 from "./demos/toast-0.jsx";
import NotifyDemo0 from "./demos/notify-0.jsx";
import BannerDemo0 from "./demos/banner-0.jsx";
import EmptyDemo0 from "./demos/empty-0.jsx";
import LoadingDemo0 from "./demos/loading-0.jsx";
import ProgressDemo0 from "./demos/progress-0.jsx";
import NumflowDemo0 from "./demos/numflow-0.jsx";
import TableDemo0 from "./demos/table-0.jsx";
import TableDemo1 from "./demos/table-1.jsx";
import TableDemo2 from "./demos/table-2.jsx";
import TableDemo3 from "./demos/table-3.jsx";
import TableDemo4 from "./demos/table-4.jsx";
import TableDemo5 from "./demos/table-5.jsx";
import TableDemo6 from "./demos/table-6.jsx";
import TableDemo7 from "./demos/table-7.jsx";
import GridDemo0 from "./demos/grid-0.jsx";
import CgridDemo0 from "./demos/cgrid-0.jsx";
import ListDemo0 from "./demos/list-0.jsx";
import CardDemo0 from "./demos/card-0.jsx";
import TagsDemo0 from "./demos/tags-0.jsx";
import AvatarDemo0 from "./demos/avatar-0.jsx";
import AvatarDemo1 from "./demos/avatar-1.jsx";
import AvatarDemo2 from "./demos/avatar-2.jsx";
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
import ChatDemo1 from "./demos/chat-1.jsx";
import MdDemo0 from "./demos/md-0.jsx";
import FlowDemo0 from "./demos/flow-0.jsx";
import ImageDemo0 from "./demos/image-0.jsx";
import MediaDemo0 from "./demos/media-0.jsx";
import UploadDemo0 from "./demos/upload-0.jsx";
import SidebarDemo0 from "./demos/sidebar-0.jsx";
import TabsDemo0 from "./demos/tabs-0.jsx";
import ReorderDemo0 from "./demos/reorder-0.jsx";
import AddremoveDemo0 from "./demos/addremove-0.jsx";
import OptimisticDemo0 from "./demos/optimistic-0.jsx";
import AddremoveBasic from "./demos/addremove-basic.jsx";
import AddremoveUndo from "./demos/addremove-undo.jsx";
import AddremoveRows from "./demos/addremove-rows.jsx";
import AvatarBasic from "./demos/avatar-basic.jsx";
import AvatarList from "./demos/avatar-list.jsx";
import BannerBasic from "./demos/banner-basic.jsx";
import BannerDismiss from "./demos/banner-dismiss.jsx";
import BannerError from "./demos/banner-error.jsx";
import ButtonBasic from "./demos/button-basic.jsx";
import ButtonVariants from "./demos/button-variants.jsx";
import ButtonSizes from "./demos/button-sizes.jsx";
import ButtonIcons from "./demos/button-icons.jsx";
import ButtonStates from "./demos/button-states.jsx";
import ButtonBusy from "./demos/button-busy.jsx";
import ButtonActions from "./demos/button-actions.jsx";
import ButtonMobile from "./demos/button-mobile.jsx";
import CardBasic from "./demos/card-basic.jsx";
import CardGrid from "./demos/card-grid.jsx";
import CardSelect from "./demos/card-select.jsx";
import CgridBasic from "./demos/cgrid-basic.jsx";
import CgridMillion from "./demos/cgrid-million.jsx";
import CgridControlled from "./demos/cgrid-controlled.jsx";
import CgridEvents from "./demos/cgrid-events.jsx";
import ChatBasic from "./demos/chat-basic.jsx";
import ChatNew from "./demos/chat-new.jsx";
import ChatHistory from "./demos/chat-history.jsx";
import ChatRich from "./demos/chat-rich.jsx";
import ChipBasic from "./demos/chip-basic.jsx";
import ChipControlled from "./demos/chip-controlled.jsx";
import ChipRemovable from "./demos/chip-removable.jsx";
import ChoiceBasic from "./demos/choice-basic.jsx";
import ChoiceRadio from "./demos/choice-radio.jsx";
import ChoiceControlled from "./demos/choice-controlled.jsx";
import CmdkBasic from "./demos/cmdk-basic.jsx";
import CmdkEmpty from "./demos/cmdk-empty.jsx";
import CmdkHotkey from "./demos/cmdk-hotkey.jsx";
import CollapseBasic from "./demos/collapse-basic.jsx";
import CollapseSingle from "./demos/collapse-single.jsx";
import CollapseControlled from "./demos/collapse-controlled.jsx";
import CompoundBasic from "./demos/compound-basic.jsx";
import CompoundSplit from "./demos/compound-split.jsx";
import CompoundCopy from "./demos/compound-copy.jsx";
import CountBasic from "./demos/count-basic.jsx";
import CountControlled from "./demos/count-controlled.jsx";
import CountLongtext from "./demos/count-longtext.jsx";
import CtxmenuBasic from "./demos/ctxmenu-basic.jsx";
import CtxmenuContext from "./demos/ctxmenu-context.jsx";
import CtxmenuSubmenu from "./demos/ctxmenu-submenu.jsx";
import DialogBasic from "./demos/dialog-basic.jsx";
import DialogDanger from "./demos/dialog-danger.jsx";
import DialogGuard from "./demos/dialog-guard.jsx";
import DialogEvents from "./demos/dialog-events.jsx";
import DialogControlled from "./demos/dialog-controlled.jsx";
import DrawerBasic from "./demos/drawer-basic.jsx";
import DrawerControlled from "./demos/drawer-controlled.jsx";
import DrawerFooter from "./demos/drawer-footer.jsx";
import EmptyBasic from "./demos/empty-basic.jsx";
import EmptySearch from "./demos/empty-search.jsx";
import EmptyError from "./demos/empty-error.jsx";
import FieldBasic from "./demos/field-basic.jsx";
import FieldError from "./demos/field-error.jsx";
import FieldOptional from "./demos/field-optional.jsx";
import FlowBasic from "./demos/flow-basic.jsx";
import FlowBranch from "./demos/flow-branch.jsx";
import FlowTidy from "./demos/flow-tidy.jsx";
import FlowstressMany from "./demos/flowstress-many.jsx";
import GridBasic from "./demos/grid-basic.jsx";
import GridSort from "./demos/grid-sort.jsx";
import GridSelect from "./demos/grid-select.jsx";
import GridRender from "./demos/grid-render.jsx";
import GridRemote from "./demos/grid-remote.jsx";
import GridEdit from "./demos/grid-edit.jsx";
import GridStates from "./demos/grid-states.jsx";
import IconbuttonBasic from "./demos/iconbutton-basic.jsx";
import IconbuttonVariants from "./demos/iconbutton-variants.jsx";
import IconbuttonStates from "./demos/iconbutton-states.jsx";
import IconbuttonControlled from "./demos/iconbutton-controlled.jsx";
import ImageBasic from "./demos/image-basic.jsx";
import ImageControlled from "./demos/image-controlled.jsx";
import ImageFailed from "./demos/image-failed.jsx";
import InputBasic from "./demos/input-basic.jsx";
import InputSizes from "./demos/input-sizes.jsx";
import InputControlled from "./demos/input-controlled.jsx";
import LinkBasic from "./demos/link-basic.jsx";
import LinkTextbtn from "./demos/link-textbtn.jsx";
import LinkArrow from "./demos/link-arrow.jsx";
import ListBasic from "./demos/list-basic.jsx";
import ListKv from "./demos/list-kv.jsx";
import ListSwitch from "./demos/list-switch.jsx";
import LoadingBasic from "./demos/loading-basic.jsx";
import LoadingList from "./demos/loading-list.jsx";
import LoadingQuiet from "./demos/loading-quiet.jsx";
import MdBasic from "./demos/md-basic.jsx";
import MdStream from "./demos/md-stream.jsx";
import MdHeights from "./demos/md-heights.jsx";
import MediaBasic from "./demos/media-basic.jsx";
import MediaAudio from "./demos/media-audio.jsx";
import MediaMethods from "./demos/media-methods.jsx";
import NotifyBasic from "./demos/notify-basic.jsx";
import NotifyActions from "./demos/notify-actions.jsx";
import NotifyFail from "./demos/notify-fail.jsx";
import NumberBasic from "./demos/number-basic.jsx";
import NumberControlled from "./demos/number-controlled.jsx";
import NumberRange from "./demos/number-range.jsx";
import NumflowBasic from "./demos/numflow-basic.jsx";
import NumflowCounter from "./demos/numflow-counter.jsx";
import NumflowStyles from "./demos/numflow-styles.jsx";
import OptimisticBasic from "./demos/optimistic-basic.jsx";
import OptimisticSwitch from "./demos/optimistic-switch.jsx";
import OptimisticPending from "./demos/optimistic-pending.jsx";
import OtpBasic from "./demos/otp-basic.jsx";
import OtpComplete from "./demos/otp-complete.jsx";
import OtpLength from "./demos/otp-length.jsx";
import PickerBasic from "./demos/picker-basic.jsx";
import PickerRange from "./demos/picker-range.jsx";
import PickerTime from "./demos/picker-time.jsx";
import PickerDatetime from "./demos/picker-datetime.jsx";
import PickerRegion from "./demos/picker-region.jsx";
import PickerEvents from "./demos/picker-events.jsx";
import PopconfirmBasic from "./demos/popconfirm-basic.jsx";
import PopconfirmUndo from "./demos/popconfirm-undo.jsx";
import PopconfirmSubmit from "./demos/popconfirm-submit.jsx";
import PopoverBasic from "./demos/popover-basic.jsx";
import PopoverControlled from "./demos/popover-controlled.jsx";
import PopoverAlign from "./demos/popover-align.jsx";
import ProgressBasic from "./demos/progress-basic.jsx";
import ProgressRing from "./demos/progress-ring.jsx";
import ProgressControlled from "./demos/progress-controlled.jsx";
import PromptBasic from "./demos/prompt-basic.jsx";
import PromptStop from "./demos/prompt-stop.jsx";
import PromptUpload from "./demos/prompt-upload.jsx";
import PromptParts from "./demos/prompt-parts.jsx";
import ReorderBasic from "./demos/reorder-basic.jsx";
import ReorderOrder from "./demos/reorder-order.jsx";
import ReorderSave from "./demos/reorder-save.jsx";
import ScrollareaBasic from "./demos/scrollarea-basic.jsx";
import ScrollareaBar from "./demos/scrollarea-bar.jsx";
import ScrollareaNone from "./demos/scrollarea-none.jsx";
import SegmentedBasic from "./demos/segmented-basic.jsx";
import SegmentedControlled from "./demos/segmented-controlled.jsx";
import SegmentedSizes from "./demos/segmented-sizes.jsx";
import SelectBasic from "./demos/select-basic.jsx";
import SelectPlaceholder from "./demos/select-placeholder.jsx";
import SelectOptions from "./demos/select-options.jsx";
import SelectField from "./demos/select-field.jsx";
import SelectEvents from "./demos/select-events.jsx";
import SelectControlled from "./demos/select-controlled.jsx";
import SelectMenu from "./demos/select-menu.jsx";
import SidebarBasic from "./demos/sidebar-basic.jsx";
import SidebarControlled from "./demos/sidebar-controlled.jsx";
import SidebarFx from "./demos/sidebar-fx.jsx";
import SliderBasic from "./demos/slider-basic.jsx";
import SliderControlled from "./demos/slider-controlled.jsx";
import SliderMax from "./demos/slider-max.jsx";
import SpecialBasic from "./demos/special-basic.jsx";
import SpecialPassword from "./demos/special-password.jsx";
import SpecialEmail from "./demos/special-email.jsx";
import TableBasic from "./demos/table-basic.jsx";
import TableControlled from "./demos/table-controlled.jsx";
import TableStates from "./demos/table-states.jsx";
import TableTree from "./demos/table-tree.jsx";
import TableMerge from "./demos/table-merge.jsx";
import TableDrag from "./demos/table-drag.jsx";
import TabsBasic from "./demos/tabs-basic.jsx";
import TabsControlled from "./demos/tabs-controlled.jsx";
import TabsPager from "./demos/tabs-pager.jsx";
import TabsSteps from "./demos/tabs-steps.jsx";
import TaginputBasic from "./demos/taginput-basic.jsx";
import TaginputControlled from "./demos/taginput-controlled.jsx";
import TaginputHint from "./demos/taginput-hint.jsx";
import TagsBasic from "./demos/tags-basic.jsx";
import TagsBadge from "./demos/tags-badge.jsx";
import TagsAvatar from "./demos/tags-avatar.jsx";
import ToastBasic from "./demos/toast-basic.jsx";
import ToastAction from "./demos/toast-action.jsx";
import ToastProgress from "./demos/toast-progress.jsx";
import TooltipBasic from "./demos/tooltip-basic.jsx";
import TooltipKbd from "./demos/tooltip-kbd.jsx";
import TooltipTruncate from "./demos/tooltip-truncate.jsx";
import UploadBasic from "./demos/upload-basic.jsx";
import UploadReal from "./demos/upload-real.jsx";
import UploadSingle from "./demos/upload-single.jsx";
import VlistBasic from "./demos/vlist-basic.jsx";
import VlistTotal from "./demos/vlist-total.jsx";
import VlistRetry from "./demos/vlist-retry.jsx";

function Gallery() {
  return (
    <main class="gallery">
      <section id="color">
        <h2>颜色</h2>
        <div class="demo" data-demo="color-0"><Errored fallback={(err) => { console.error("演示 color-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ColorDemo0 /></Errored></div>
      </section>
      <section id="type">
        <h2>排版</h2>
        <div class="demo" data-demo="type-0"><Errored fallback={(err) => { console.error("演示 type-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TypeDemo0 /></Errored></div>
        <div class="demo" data-demo="type-1"><Errored fallback={(err) => { console.error("演示 type-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TypeDemo1 /></Errored></div>
        <div class="demo" data-demo="type-2"><Errored fallback={(err) => { console.error("演示 type-2 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TypeDemo2 /></Errored></div>
      </section>
      <section id="spacing">
        <h2>间距</h2>
        <div class="demo" data-demo="spacing-0"><Errored fallback={(err) => { console.error("演示 spacing-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpacingDemo0 /></Errored></div>
        <div class="demo" data-demo="spacing-1"><Errored fallback={(err) => { console.error("演示 spacing-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpacingDemo1 /></Errored></div>
        <div class="demo" data-demo="spacing-2"><Errored fallback={(err) => { console.error("演示 spacing-2 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpacingDemo2 /></Errored></div>
        <div class="demo" data-demo="spacing-3"><Errored fallback={(err) => { console.error("演示 spacing-3 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpacingDemo3 /></Errored></div>
      </section>
      <section id="layout">
        <h2>布局</h2>
        <div class="demo" data-demo="layout-0"><Errored fallback={(err) => { console.error("演示 layout-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LayoutDemo0 /></Errored></div>
        <div class="demo" data-demo="layout-1"><Errored fallback={(err) => { console.error("演示 layout-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LayoutDemo1 /></Errored></div>
      </section>
      <section id="space">
        <h2>圆角与线</h2>
        <div class="demo" data-demo="space-0"><Errored fallback={(err) => { console.error("演示 space-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpaceDemo0 /></Errored></div>
        <div class="demo" data-demo="space-1"><Errored fallback={(err) => { console.error("演示 space-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpaceDemo1 /></Errored></div>
      </section>
      <section id="elevation">
        <h2>阴影与层级</h2>
        <div class="demo" data-demo="elevation-0"><Errored fallback={(err) => { console.error("演示 elevation-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ElevationDemo0 /></Errored></div>
      </section>
      <section id="motion">
        <h2>动效曲线</h2>
        <div class="demo" data-demo="motion-0"><Errored fallback={(err) => { console.error("演示 motion-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MotionDemo0 /></Errored></div>
      </section>
      <section id="icons">
        <h2>图标</h2>
        <div class="demo" data-demo="icons-0"><Errored fallback={(err) => { console.error("演示 icons-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><IconsDemo0 /></Errored></div>
      </section>
      <section id="button">
        <h2>按钮</h2>
        <div class="demo" data-demo="button-0"><Errored fallback={(err) => { console.error("演示 button-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonDemo0 /></Errored></div>
        <div class="demo" data-demo="button-1"><Errored fallback={(err) => { console.error("演示 button-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonDemo1 /></Errored></div>
        <div class="demo" data-demo="button-2"><Errored fallback={(err) => { console.error("演示 button-2 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonDemo2 /></Errored></div>
        <div class="demo" data-demo="button-3"><Errored fallback={(err) => { console.error("演示 button-3 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonDemo3 /></Errored></div>
      </section>
      <section id="iconbutton">
        <h2>纯图标按钮</h2>
        <div class="demo" data-demo="iconbutton-0"><Errored fallback={(err) => { console.error("演示 iconbutton-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><IconbuttonDemo0 /></Errored></div>
      </section>
      <section id="link">
        <h2>文字链接</h2>
        <div class="demo" data-demo="link-0"><Errored fallback={(err) => { console.error("演示 link-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LinkDemo0 /></Errored></div>
      </section>
      <section id="compound">
        <h2>组合按钮</h2>
        <div class="demo" data-demo="compound-0"><Errored fallback={(err) => { console.error("演示 compound-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CompoundDemo0 /></Errored></div>
      </section>
      <section id="chip">
        <h2>切换芯片</h2>
        <div class="demo" data-demo="chip-0"><Errored fallback={(err) => { console.error("演示 chip-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChipDemo0 /></Errored></div>
      </section>
      <section id="field">
        <h2>字段与错误</h2>
        <div class="demo" data-demo="field-0"><Errored fallback={(err) => { console.error("演示 field-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FieldDemo0 /></Errored></div>
      </section>
      <section id="input">
        <h2>输入框</h2>
        <div class="demo" data-demo="input-0"><Errored fallback={(err) => { console.error("演示 input-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><InputDemo0 /></Errored></div>
        <div class="demo" data-demo="input-1"><Errored fallback={(err) => { console.error("演示 input-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><InputDemo1 /></Errored></div>
        <div class="demo" data-demo="input-2"><Errored fallback={(err) => { console.error("演示 input-2 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><InputDemo2 /></Errored></div>
      </section>
      <section id="special">
        <h2>搜索、密码、邮箱</h2>
        <div class="demo" data-demo="special-0"><Errored fallback={(err) => { console.error("演示 special-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpecialDemo0 /></Errored></div>
      </section>
      <section id="count">
        <h2>字数统计</h2>
        <div class="demo" data-demo="count-0"><Errored fallback={(err) => { console.error("演示 count-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CountDemo0 /></Errored></div>
      </section>
      <section id="taginput">
        <h2>标签输入</h2>
        <div class="demo" data-demo="taginput-0"><Errored fallback={(err) => { console.error("演示 taginput-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TaginputDemo0 /></Errored></div>
      </section>
      <section id="number">
        <h2>数字步进</h2>
        <div class="demo" data-demo="number-0"><Errored fallback={(err) => { console.error("演示 number-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NumberDemo0 /></Errored></div>
      </section>
      <section id="prompt">
        <h2>提示词输入框</h2>
        <div class="demo" data-demo="prompt-0"><Errored fallback={(err) => { console.error("演示 prompt-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PromptDemo0 /></Errored></div>
      </section>
      <section id="select">
        <h2>下拉选择与菜单</h2>
        <div class="demo" data-demo="select-0"><Errored fallback={(err) => { console.error("演示 select-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SelectDemo0 /></Errored></div>
      </section>
      <section id="picker">
        <h2>日期、时间、地址</h2>
        <div class="demo" data-demo="picker-0"><Errored fallback={(err) => { console.error("演示 picker-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PickerDemo0 /></Errored></div>
      </section>
      <section id="choice">
        <h2>复选、单选、开关</h2>
        <div class="demo" data-demo="choice-0"><Errored fallback={(err) => { console.error("演示 choice-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChoiceDemo0 /></Errored></div>
      </section>
      <section id="segmented">
        <h2>分段控件</h2>
        <div class="demo" data-demo="segmented-0"><Errored fallback={(err) => { console.error("演示 segmented-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SegmentedDemo0 /></Errored></div>
      </section>
      <section id="slider">
        <h2>滑块</h2>
        <div class="demo" data-demo="slider-0"><Errored fallback={(err) => { console.error("演示 slider-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SliderDemo0 /></Errored></div>
      </section>
      <section id="otp">
        <h2>验证码</h2>
        <div class="demo" data-demo="otp-0"><Errored fallback={(err) => { console.error("演示 otp-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><OtpDemo0 /></Errored></div>
      </section>
      <section id="tooltip">
        <h2>文字提示</h2>
        <div class="demo" data-demo="tooltip-0"><Errored fallback={(err) => { console.error("演示 tooltip-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TooltipDemo0 /></Errored></div>
      </section>
      <section id="popover">
        <h2>弹出面板</h2>
        <div class="demo" data-demo="popover-0"><Errored fallback={(err) => { console.error("演示 popover-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PopoverDemo0 /></Errored></div>
      </section>
      <section id="popconfirm">
        <h2>气泡确认</h2>
        <div class="demo" data-demo="popconfirm-0"><Errored fallback={(err) => { console.error("演示 popconfirm-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PopconfirmDemo0 /></Errored></div>
      </section>
      <section id="ctxmenu">
        <h2>右键菜单与子菜单</h2>
        <div class="demo" data-demo="ctxmenu-0"><Errored fallback={(err) => { console.error("演示 ctxmenu-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CtxmenuDemo0 /></Errored></div>
      </section>
      <section id="dialog">
        <h2>弹窗</h2>
        <div class="demo" data-demo="dialog-0"><Errored fallback={(err) => { console.error("演示 dialog-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DialogDemo0 /></Errored></div>
      </section>
      <section id="drawer">
        <h2>抽屉</h2>
        <div class="demo" data-demo="drawer-0"><Errored fallback={(err) => { console.error("演示 drawer-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DrawerDemo0 /></Errored></div>
      </section>
      <section id="cmdk">
        <h2>命令面板</h2>
        <div class="demo" data-demo="cmdk-0"><Errored fallback={(err) => { console.error("演示 cmdk-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CmdkDemo0 /></Errored></div>
      </section>
      <section id="toast">
        <h2>轻提示</h2>
        <div class="demo" data-demo="toast-0"><Errored fallback={(err) => { console.error("演示 toast-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ToastDemo0 /></Errored></div>
      </section>
      <section id="notify">
        <h2>通知</h2>
        <div class="demo" data-demo="notify-0"><Errored fallback={(err) => { console.error("演示 notify-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NotifyDemo0 /></Errored></div>
      </section>
      <section id="banner">
        <h2>横幅与条目上的失败</h2>
        <div class="demo" data-demo="banner-0"><Errored fallback={(err) => { console.error("演示 banner-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><BannerDemo0 /></Errored></div>
      </section>
      <section id="empty">
        <h2>空状态</h2>
        <div class="demo" data-demo="empty-0"><Errored fallback={(err) => { console.error("演示 empty-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><EmptyDemo0 /></Errored></div>
      </section>
      <section id="loading">
        <h2>骨架与加载</h2>
        <div class="demo" data-demo="loading-0"><Errored fallback={(err) => { console.error("演示 loading-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LoadingDemo0 /></Errored></div>
      </section>
      <section id="progress">
        <h2>进度</h2>
        <div class="demo" data-demo="progress-0"><Errored fallback={(err) => { console.error("演示 progress-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ProgressDemo0 /></Errored></div>
      </section>
      <section id="numflow">
        <h2>数字变化</h2>
        <div class="demo" data-demo="numflow-0"><Errored fallback={(err) => { console.error("演示 numflow-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NumflowDemo0 /></Errored></div>
      </section>
      <section id="table">
        <h2>表格</h2>
        <div class="demo" data-demo="table-0"><Errored fallback={(err) => { console.error("演示 table-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDemo0 /></Errored></div>
        <div class="demo" data-demo="table-1"><Errored fallback={(err) => { console.error("演示 table-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDemo1 /></Errored></div>
        <div class="demo" data-demo="table-2"><Errored fallback={(err) => { console.error("演示 table-2 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDemo2 /></Errored></div>
        <div class="demo" data-demo="table-3"><Errored fallback={(err) => { console.error("演示 table-3 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDemo3 /></Errored></div>
        <div class="demo" data-demo="table-4"><Errored fallback={(err) => { console.error("演示 table-4 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDemo4 /></Errored></div>
        <div class="demo" data-demo="table-5"><Errored fallback={(err) => { console.error("演示 table-5 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDemo5 /></Errored></div>
        <div class="demo" data-demo="table-6"><Errored fallback={(err) => { console.error("演示 table-6 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDemo6 /></Errored></div>
        <div class="demo" data-demo="table-7"><Errored fallback={(err) => { console.error("演示 table-7 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDemo7 /></Errored></div>
      </section>
      <section id="grid">
        <h2>数据表格</h2>
        <div class="demo" data-demo="grid-0"><Errored fallback={(err) => { console.error("演示 grid-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><GridDemo0 /></Errored></div>
      </section>
      <section id="cgrid">
        <h2>Canvas 表格</h2>
        <div class="demo" data-demo="cgrid-0"><Errored fallback={(err) => { console.error("演示 cgrid-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CgridDemo0 /></Errored></div>
      </section>
      <section id="list">
        <h2>列表与键值</h2>
        <div class="demo" data-demo="list-0"><Errored fallback={(err) => { console.error("演示 list-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ListDemo0 /></Errored></div>
      </section>
      <section id="card">
        <h2>卡片</h2>
        <div class="demo" data-demo="card-0"><Errored fallback={(err) => { console.error("演示 card-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CardDemo0 /></Errored></div>
      </section>
      <section id="tags">
        <h2>标签、徽标与头像</h2>
        <div class="demo" data-demo="tags-0"><Errored fallback={(err) => { console.error("演示 tags-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TagsDemo0 /></Errored></div>
      </section>
      <section id="avatar">
        <h2>头像</h2>
        <div class="demo" data-demo="avatar-0"><Errored fallback={(err) => { console.error("演示 avatar-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AvatarDemo0 /></Errored></div>
        <div class="demo" data-demo="avatar-1"><Errored fallback={(err) => { console.error("演示 avatar-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AvatarDemo1 /></Errored></div>
        <div class="demo" data-demo="avatar-2"><Errored fallback={(err) => { console.error("演示 avatar-2 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AvatarDemo2 /></Errored></div>
      </section>
      <section id="collapse">
        <h2>折叠面板</h2>
        <div class="demo" data-demo="collapse-0"><Errored fallback={(err) => { console.error("演示 collapse-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CollapseDemo0 /></Errored></div>
      </section>
      <section id="scrollarea">
        <h2>滚动区域</h2>
        <div class="demo" data-demo="scrollarea-0"><Errored fallback={(err) => { console.error("演示 scrollarea-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaDemo0 /></Errored></div>
        <div class="demo" data-demo="scrollarea-1"><Errored fallback={(err) => { console.error("演示 scrollarea-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaDemo1 /></Errored></div>
        <div class="demo" data-demo="scrollarea-2"><Errored fallback={(err) => { console.error("演示 scrollarea-2 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaDemo2 /></Errored></div>
        <div class="demo" data-demo="scrollarea-3"><Errored fallback={(err) => { console.error("演示 scrollarea-3 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaDemo3 /></Errored></div>
        <div class="demo" data-demo="scrollarea-4"><Errored fallback={(err) => { console.error("演示 scrollarea-4 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaDemo4 /></Errored></div>
        <div class="demo" data-demo="scrollarea-5"><Errored fallback={(err) => { console.error("演示 scrollarea-5 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaDemo5 /></Errored></div>
        <div class="demo" data-demo="scrollarea-6"><Errored fallback={(err) => { console.error("演示 scrollarea-6 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaDemo6 /></Errored></div>
      </section>
      <section id="vlist">
        <h2>无限列表</h2>
        <div class="demo" data-demo="vlist-0"><Errored fallback={(err) => { console.error("演示 vlist-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><VlistDemo0 /></Errored></div>
      </section>
      <section id="chat">
        <h2>聊天与 AI 对话</h2>
        <div class="demo" data-demo="chat-0"><Errored fallback={(err) => { console.error("演示 chat-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChatDemo0 /></Errored></div>
        <div class="demo" data-demo="chat-1"><Errored fallback={(err) => { console.error("演示 chat-1 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChatDemo1 /></Errored></div>
      </section>
      <section id="md">
        <h2>Markdown 文档</h2>
        <div class="demo" data-demo="md-0"><Errored fallback={(err) => { console.error("演示 md-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MdDemo0 /></Errored></div>
      </section>
      <section id="flow">
        <h2>流程图</h2>
        <div class="demo" data-demo="flow-0"><Errored fallback={(err) => { console.error("演示 flow-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FlowDemo0 /></Errored></div>
      </section>
      <section id="image">
        <h2>图片</h2>
        <div class="demo" data-demo="image-0"><Errored fallback={(err) => { console.error("演示 image-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ImageDemo0 /></Errored></div>
      </section>
      <section id="media">
        <h2>视频与音频</h2>
        <div class="demo" data-demo="media-0"><Errored fallback={(err) => { console.error("演示 media-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MediaDemo0 /></Errored></div>
      </section>
      <section id="upload">
        <h2>上传</h2>
        <div class="demo" data-demo="upload-0"><Errored fallback={(err) => { console.error("演示 upload-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><UploadDemo0 /></Errored></div>
      </section>
      <section id="sidebar">
        <h2>侧栏与布局</h2>
        <div class="demo" data-demo="sidebar-0"><Errored fallback={(err) => { console.error("演示 sidebar-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SidebarDemo0 /></Errored></div>
      </section>
      <section id="tabs">
        <h2>标签页、分页、步骤</h2>
        <div class="demo" data-demo="tabs-0"><Errored fallback={(err) => { console.error("演示 tabs-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TabsDemo0 /></Errored></div>
      </section>
      <section id="reorder">
        <h2>拖拽重排</h2>
        <div class="demo" data-demo="reorder-0"><Errored fallback={(err) => { console.error("演示 reorder-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ReorderDemo0 /></Errored></div>
      </section>
      <section id="addremove">
        <h2>新增与删除</h2>
        <div class="demo" data-demo="addremove-0"><Errored fallback={(err) => { console.error("演示 addremove-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AddremoveDemo0 /></Errored></div>
      </section>
      <section id="optimistic">
        <h2>乐观更新</h2>
        <div class="demo" data-demo="optimistic-0"><Errored fallback={(err) => { console.error("演示 optimistic-0 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><OptimisticDemo0 /></Errored></div>
      </section>
      <section id="addremove">
        <h2>新增与删除</h2>
        <div class="demo" data-demo="addremove-basic"><Errored fallback={(err) => { console.error("演示 addremove-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AddremoveBasic /></Errored></div>
        <div class="demo" data-demo="addremove-undo"><Errored fallback={(err) => { console.error("演示 addremove-undo 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AddremoveUndo /></Errored></div>
        <div class="demo" data-demo="addremove-rows"><Errored fallback={(err) => { console.error("演示 addremove-rows 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AddremoveRows /></Errored></div>
      </section>
      <section id="avatar">
        <h2>头像</h2>
        <div class="demo" data-demo="avatar-basic"><Errored fallback={(err) => { console.error("演示 avatar-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AvatarBasic /></Errored></div>
        <div class="demo" data-demo="avatar-list"><Errored fallback={(err) => { console.error("演示 avatar-list 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><AvatarList /></Errored></div>
      </section>
      <section id="banner">
        <h2>横幅与条目上的失败</h2>
        <div class="demo" data-demo="banner-basic"><Errored fallback={(err) => { console.error("演示 banner-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><BannerBasic /></Errored></div>
        <div class="demo" data-demo="banner-dismiss"><Errored fallback={(err) => { console.error("演示 banner-dismiss 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><BannerDismiss /></Errored></div>
        <div class="demo" data-demo="banner-error"><Errored fallback={(err) => { console.error("演示 banner-error 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><BannerError /></Errored></div>
      </section>
      <section id="button">
        <h2>按钮</h2>
        <div class="demo" data-demo="button-basic"><Errored fallback={(err) => { console.error("演示 button-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonBasic /></Errored></div>
        <div class="demo" data-demo="button-variants"><Errored fallback={(err) => { console.error("演示 button-variants 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonVariants /></Errored></div>
        <div class="demo" data-demo="button-sizes"><Errored fallback={(err) => { console.error("演示 button-sizes 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonSizes /></Errored></div>
        <div class="demo" data-demo="button-icons"><Errored fallback={(err) => { console.error("演示 button-icons 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonIcons /></Errored></div>
        <div class="demo" data-demo="button-states"><Errored fallback={(err) => { console.error("演示 button-states 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonStates /></Errored></div>
        <div class="demo" data-demo="button-busy"><Errored fallback={(err) => { console.error("演示 button-busy 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonBusy /></Errored></div>
        <div class="demo" data-demo="button-actions"><Errored fallback={(err) => { console.error("演示 button-actions 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonActions /></Errored></div>
        <div class="demo" data-demo="button-mobile"><Errored fallback={(err) => { console.error("演示 button-mobile 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ButtonMobile /></Errored></div>
      </section>
      <section id="card">
        <h2>卡片</h2>
        <div class="demo" data-demo="card-basic"><Errored fallback={(err) => { console.error("演示 card-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CardBasic /></Errored></div>
        <div class="demo" data-demo="card-grid"><Errored fallback={(err) => { console.error("演示 card-grid 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CardGrid /></Errored></div>
        <div class="demo" data-demo="card-select"><Errored fallback={(err) => { console.error("演示 card-select 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CardSelect /></Errored></div>
      </section>
      <section id="cgrid">
        <h2>Canvas 表格</h2>
        <div class="demo" data-demo="cgrid-basic"><Errored fallback={(err) => { console.error("演示 cgrid-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CgridBasic /></Errored></div>
        <div class="demo" data-demo="cgrid-million"><Errored fallback={(err) => { console.error("演示 cgrid-million 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CgridMillion /></Errored></div>
        <div class="demo" data-demo="cgrid-controlled"><Errored fallback={(err) => { console.error("演示 cgrid-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CgridControlled /></Errored></div>
        <div class="demo" data-demo="cgrid-events"><Errored fallback={(err) => { console.error("演示 cgrid-events 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CgridEvents /></Errored></div>
      </section>
      <section id="chat">
        <h2>聊天与 AI 对话</h2>
        <div class="demo" data-demo="chat-basic"><Errored fallback={(err) => { console.error("演示 chat-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChatBasic /></Errored></div>
        <div class="demo" data-demo="chat-new"><Errored fallback={(err) => { console.error("演示 chat-new 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChatNew /></Errored></div>
        <div class="demo" data-demo="chat-history"><Errored fallback={(err) => { console.error("演示 chat-history 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChatHistory /></Errored></div>
        <div class="demo" data-demo="chat-rich"><Errored fallback={(err) => { console.error("演示 chat-rich 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChatRich /></Errored></div>
      </section>
      <section id="chip">
        <h2>切换芯片</h2>
        <div class="demo" data-demo="chip-basic"><Errored fallback={(err) => { console.error("演示 chip-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChipBasic /></Errored></div>
        <div class="demo" data-demo="chip-controlled"><Errored fallback={(err) => { console.error("演示 chip-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChipControlled /></Errored></div>
        <div class="demo" data-demo="chip-removable"><Errored fallback={(err) => { console.error("演示 chip-removable 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChipRemovable /></Errored></div>
      </section>
      <section id="choice">
        <h2>复选、单选、开关</h2>
        <div class="demo" data-demo="choice-basic"><Errored fallback={(err) => { console.error("演示 choice-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChoiceBasic /></Errored></div>
        <div class="demo" data-demo="choice-radio"><Errored fallback={(err) => { console.error("演示 choice-radio 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChoiceRadio /></Errored></div>
        <div class="demo" data-demo="choice-controlled"><Errored fallback={(err) => { console.error("演示 choice-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ChoiceControlled /></Errored></div>
      </section>
      <section id="cmdk">
        <h2>命令面板</h2>
        <div class="demo" data-demo="cmdk-basic"><Errored fallback={(err) => { console.error("演示 cmdk-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CmdkBasic /></Errored></div>
        <div class="demo" data-demo="cmdk-empty"><Errored fallback={(err) => { console.error("演示 cmdk-empty 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CmdkEmpty /></Errored></div>
        <div class="demo" data-demo="cmdk-hotkey"><Errored fallback={(err) => { console.error("演示 cmdk-hotkey 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CmdkHotkey /></Errored></div>
      </section>
      <section id="collapse">
        <h2>折叠面板</h2>
        <div class="demo" data-demo="collapse-basic"><Errored fallback={(err) => { console.error("演示 collapse-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CollapseBasic /></Errored></div>
        <div class="demo" data-demo="collapse-single"><Errored fallback={(err) => { console.error("演示 collapse-single 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CollapseSingle /></Errored></div>
        <div class="demo" data-demo="collapse-controlled"><Errored fallback={(err) => { console.error("演示 collapse-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CollapseControlled /></Errored></div>
      </section>
      <section id="compound">
        <h2>组合按钮</h2>
        <div class="demo" data-demo="compound-basic"><Errored fallback={(err) => { console.error("演示 compound-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CompoundBasic /></Errored></div>
        <div class="demo" data-demo="compound-split"><Errored fallback={(err) => { console.error("演示 compound-split 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CompoundSplit /></Errored></div>
        <div class="demo" data-demo="compound-copy"><Errored fallback={(err) => { console.error("演示 compound-copy 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CompoundCopy /></Errored></div>
      </section>
      <section id="count">
        <h2>字数统计</h2>
        <div class="demo" data-demo="count-basic"><Errored fallback={(err) => { console.error("演示 count-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CountBasic /></Errored></div>
        <div class="demo" data-demo="count-controlled"><Errored fallback={(err) => { console.error("演示 count-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CountControlled /></Errored></div>
        <div class="demo" data-demo="count-longtext"><Errored fallback={(err) => { console.error("演示 count-longtext 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CountLongtext /></Errored></div>
      </section>
      <section id="ctxmenu">
        <h2>右键菜单与子菜单</h2>
        <div class="demo" data-demo="ctxmenu-basic"><Errored fallback={(err) => { console.error("演示 ctxmenu-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CtxmenuBasic /></Errored></div>
        <div class="demo" data-demo="ctxmenu-context"><Errored fallback={(err) => { console.error("演示 ctxmenu-context 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CtxmenuContext /></Errored></div>
        <div class="demo" data-demo="ctxmenu-submenu"><Errored fallback={(err) => { console.error("演示 ctxmenu-submenu 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><CtxmenuSubmenu /></Errored></div>
      </section>
      <section id="dialog">
        <h2>弹窗</h2>
        <div class="demo" data-demo="dialog-basic"><Errored fallback={(err) => { console.error("演示 dialog-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DialogBasic /></Errored></div>
        <div class="demo" data-demo="dialog-danger"><Errored fallback={(err) => { console.error("演示 dialog-danger 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DialogDanger /></Errored></div>
        <div class="demo" data-demo="dialog-guard"><Errored fallback={(err) => { console.error("演示 dialog-guard 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DialogGuard /></Errored></div>
        <div class="demo" data-demo="dialog-events"><Errored fallback={(err) => { console.error("演示 dialog-events 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DialogEvents /></Errored></div>
        <div class="demo" data-demo="dialog-controlled"><Errored fallback={(err) => { console.error("演示 dialog-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DialogControlled /></Errored></div>
      </section>
      <section id="drawer">
        <h2>抽屉</h2>
        <div class="demo" data-demo="drawer-basic"><Errored fallback={(err) => { console.error("演示 drawer-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DrawerBasic /></Errored></div>
        <div class="demo" data-demo="drawer-controlled"><Errored fallback={(err) => { console.error("演示 drawer-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DrawerControlled /></Errored></div>
        <div class="demo" data-demo="drawer-footer"><Errored fallback={(err) => { console.error("演示 drawer-footer 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><DrawerFooter /></Errored></div>
      </section>
      <section id="empty">
        <h2>空状态</h2>
        <div class="demo" data-demo="empty-basic"><Errored fallback={(err) => { console.error("演示 empty-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><EmptyBasic /></Errored></div>
        <div class="demo" data-demo="empty-search"><Errored fallback={(err) => { console.error("演示 empty-search 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><EmptySearch /></Errored></div>
        <div class="demo" data-demo="empty-error"><Errored fallback={(err) => { console.error("演示 empty-error 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><EmptyError /></Errored></div>
      </section>
      <section id="field">
        <h2>字段与错误</h2>
        <div class="demo" data-demo="field-basic"><Errored fallback={(err) => { console.error("演示 field-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FieldBasic /></Errored></div>
        <div class="demo" data-demo="field-error"><Errored fallback={(err) => { console.error("演示 field-error 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FieldError /></Errored></div>
        <div class="demo" data-demo="field-optional"><Errored fallback={(err) => { console.error("演示 field-optional 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FieldOptional /></Errored></div>
      </section>
      <section id="flow">
        <h2>流程图</h2>
        <div class="demo" data-demo="flow-basic"><Errored fallback={(err) => { console.error("演示 flow-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FlowBasic /></Errored></div>
        <div class="demo" data-demo="flow-branch"><Errored fallback={(err) => { console.error("演示 flow-branch 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FlowBranch /></Errored></div>
        <div class="demo" data-demo="flow-tidy"><Errored fallback={(err) => { console.error("演示 flow-tidy 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FlowTidy /></Errored></div>
      </section>
      <section id="flowstress">
        <h2>万级节点压测</h2>
        <div class="demo" data-demo="flowstress-many"><Errored fallback={(err) => { console.error("演示 flowstress-many 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><FlowstressMany /></Errored></div>
      </section>
      <section id="grid">
        <h2>数据表格</h2>
        <div class="demo" data-demo="grid-basic"><Errored fallback={(err) => { console.error("演示 grid-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><GridBasic /></Errored></div>
        <div class="demo" data-demo="grid-sort"><Errored fallback={(err) => { console.error("演示 grid-sort 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><GridSort /></Errored></div>
        <div class="demo" data-demo="grid-select"><Errored fallback={(err) => { console.error("演示 grid-select 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><GridSelect /></Errored></div>
        <div class="demo" data-demo="grid-render"><Errored fallback={(err) => { console.error("演示 grid-render 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><GridRender /></Errored></div>
        <div class="demo" data-demo="grid-remote"><Errored fallback={(err) => { console.error("演示 grid-remote 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><GridRemote /></Errored></div>
        <div class="demo" data-demo="grid-edit"><Errored fallback={(err) => { console.error("演示 grid-edit 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><GridEdit /></Errored></div>
        <div class="demo" data-demo="grid-states"><Errored fallback={(err) => { console.error("演示 grid-states 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><GridStates /></Errored></div>
      </section>
      <section id="iconbutton">
        <h2>纯图标按钮</h2>
        <div class="demo" data-demo="iconbutton-basic"><Errored fallback={(err) => { console.error("演示 iconbutton-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><IconbuttonBasic /></Errored></div>
        <div class="demo" data-demo="iconbutton-variants"><Errored fallback={(err) => { console.error("演示 iconbutton-variants 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><IconbuttonVariants /></Errored></div>
        <div class="demo" data-demo="iconbutton-states"><Errored fallback={(err) => { console.error("演示 iconbutton-states 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><IconbuttonStates /></Errored></div>
        <div class="demo" data-demo="iconbutton-controlled"><Errored fallback={(err) => { console.error("演示 iconbutton-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><IconbuttonControlled /></Errored></div>
      </section>
      <section id="image">
        <h2>图片</h2>
        <div class="demo" data-demo="image-basic"><Errored fallback={(err) => { console.error("演示 image-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ImageBasic /></Errored></div>
        <div class="demo" data-demo="image-controlled"><Errored fallback={(err) => { console.error("演示 image-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ImageControlled /></Errored></div>
        <div class="demo" data-demo="image-failed"><Errored fallback={(err) => { console.error("演示 image-failed 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ImageFailed /></Errored></div>
      </section>
      <section id="input">
        <h2>输入框</h2>
        <div class="demo" data-demo="input-basic"><Errored fallback={(err) => { console.error("演示 input-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><InputBasic /></Errored></div>
        <div class="demo" data-demo="input-sizes"><Errored fallback={(err) => { console.error("演示 input-sizes 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><InputSizes /></Errored></div>
        <div class="demo" data-demo="input-controlled"><Errored fallback={(err) => { console.error("演示 input-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><InputControlled /></Errored></div>
      </section>
      <section id="link">
        <h2>文字链接</h2>
        <div class="demo" data-demo="link-basic"><Errored fallback={(err) => { console.error("演示 link-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LinkBasic /></Errored></div>
        <div class="demo" data-demo="link-textbtn"><Errored fallback={(err) => { console.error("演示 link-textbtn 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LinkTextbtn /></Errored></div>
        <div class="demo" data-demo="link-arrow"><Errored fallback={(err) => { console.error("演示 link-arrow 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LinkArrow /></Errored></div>
      </section>
      <section id="list">
        <h2>列表与键值</h2>
        <div class="demo" data-demo="list-basic"><Errored fallback={(err) => { console.error("演示 list-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ListBasic /></Errored></div>
        <div class="demo" data-demo="list-kv"><Errored fallback={(err) => { console.error("演示 list-kv 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ListKv /></Errored></div>
        <div class="demo" data-demo="list-switch"><Errored fallback={(err) => { console.error("演示 list-switch 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ListSwitch /></Errored></div>
      </section>
      <section id="loading">
        <h2>骨架与加载</h2>
        <div class="demo" data-demo="loading-basic"><Errored fallback={(err) => { console.error("演示 loading-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LoadingBasic /></Errored></div>
        <div class="demo" data-demo="loading-list"><Errored fallback={(err) => { console.error("演示 loading-list 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LoadingList /></Errored></div>
        <div class="demo" data-demo="loading-quiet"><Errored fallback={(err) => { console.error("演示 loading-quiet 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><LoadingQuiet /></Errored></div>
      </section>
      <section id="md">
        <h2>Markdown 文档</h2>
        <div class="demo" data-demo="md-basic"><Errored fallback={(err) => { console.error("演示 md-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MdBasic /></Errored></div>
        <div class="demo" data-demo="md-stream"><Errored fallback={(err) => { console.error("演示 md-stream 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MdStream /></Errored></div>
        <div class="demo" data-demo="md-heights"><Errored fallback={(err) => { console.error("演示 md-heights 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MdHeights /></Errored></div>
      </section>
      <section id="media">
        <h2>视频与音频</h2>
        <div class="demo" data-demo="media-basic"><Errored fallback={(err) => { console.error("演示 media-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MediaBasic /></Errored></div>
        <div class="demo" data-demo="media-audio"><Errored fallback={(err) => { console.error("演示 media-audio 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MediaAudio /></Errored></div>
        <div class="demo" data-demo="media-methods"><Errored fallback={(err) => { console.error("演示 media-methods 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><MediaMethods /></Errored></div>
      </section>
      <section id="notify">
        <h2>通知</h2>
        <div class="demo" data-demo="notify-basic"><Errored fallback={(err) => { console.error("演示 notify-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NotifyBasic /></Errored></div>
        <div class="demo" data-demo="notify-actions"><Errored fallback={(err) => { console.error("演示 notify-actions 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NotifyActions /></Errored></div>
        <div class="demo" data-demo="notify-fail"><Errored fallback={(err) => { console.error("演示 notify-fail 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NotifyFail /></Errored></div>
      </section>
      <section id="number">
        <h2>数字步进</h2>
        <div class="demo" data-demo="number-basic"><Errored fallback={(err) => { console.error("演示 number-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NumberBasic /></Errored></div>
        <div class="demo" data-demo="number-controlled"><Errored fallback={(err) => { console.error("演示 number-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NumberControlled /></Errored></div>
        <div class="demo" data-demo="number-range"><Errored fallback={(err) => { console.error("演示 number-range 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NumberRange /></Errored></div>
      </section>
      <section id="numflow">
        <h2>数字变化</h2>
        <div class="demo" data-demo="numflow-basic"><Errored fallback={(err) => { console.error("演示 numflow-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NumflowBasic /></Errored></div>
        <div class="demo" data-demo="numflow-counter"><Errored fallback={(err) => { console.error("演示 numflow-counter 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NumflowCounter /></Errored></div>
        <div class="demo" data-demo="numflow-styles"><Errored fallback={(err) => { console.error("演示 numflow-styles 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><NumflowStyles /></Errored></div>
      </section>
      <section id="optimistic">
        <h2>乐观更新</h2>
        <div class="demo" data-demo="optimistic-basic"><Errored fallback={(err) => { console.error("演示 optimistic-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><OptimisticBasic /></Errored></div>
        <div class="demo" data-demo="optimistic-switch"><Errored fallback={(err) => { console.error("演示 optimistic-switch 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><OptimisticSwitch /></Errored></div>
        <div class="demo" data-demo="optimistic-pending"><Errored fallback={(err) => { console.error("演示 optimistic-pending 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><OptimisticPending /></Errored></div>
      </section>
      <section id="otp">
        <h2>验证码</h2>
        <div class="demo" data-demo="otp-basic"><Errored fallback={(err) => { console.error("演示 otp-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><OtpBasic /></Errored></div>
        <div class="demo" data-demo="otp-complete"><Errored fallback={(err) => { console.error("演示 otp-complete 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><OtpComplete /></Errored></div>
        <div class="demo" data-demo="otp-length"><Errored fallback={(err) => { console.error("演示 otp-length 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><OtpLength /></Errored></div>
      </section>
      <section id="picker">
        <h2>日期、时间、地址</h2>
        <div class="demo" data-demo="picker-basic"><Errored fallback={(err) => { console.error("演示 picker-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PickerBasic /></Errored></div>
        <div class="demo" data-demo="picker-range"><Errored fallback={(err) => { console.error("演示 picker-range 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PickerRange /></Errored></div>
        <div class="demo" data-demo="picker-time"><Errored fallback={(err) => { console.error("演示 picker-time 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PickerTime /></Errored></div>
        <div class="demo" data-demo="picker-datetime"><Errored fallback={(err) => { console.error("演示 picker-datetime 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PickerDatetime /></Errored></div>
        <div class="demo" data-demo="picker-region"><Errored fallback={(err) => { console.error("演示 picker-region 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PickerRegion /></Errored></div>
        <div class="demo" data-demo="picker-events"><Errored fallback={(err) => { console.error("演示 picker-events 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PickerEvents /></Errored></div>
      </section>
      <section id="popconfirm">
        <h2>气泡确认</h2>
        <div class="demo" data-demo="popconfirm-basic"><Errored fallback={(err) => { console.error("演示 popconfirm-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PopconfirmBasic /></Errored></div>
        <div class="demo" data-demo="popconfirm-undo"><Errored fallback={(err) => { console.error("演示 popconfirm-undo 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PopconfirmUndo /></Errored></div>
        <div class="demo" data-demo="popconfirm-submit"><Errored fallback={(err) => { console.error("演示 popconfirm-submit 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PopconfirmSubmit /></Errored></div>
      </section>
      <section id="popover">
        <h2>弹出面板</h2>
        <div class="demo" data-demo="popover-basic"><Errored fallback={(err) => { console.error("演示 popover-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PopoverBasic /></Errored></div>
        <div class="demo" data-demo="popover-controlled"><Errored fallback={(err) => { console.error("演示 popover-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PopoverControlled /></Errored></div>
        <div class="demo" data-demo="popover-align"><Errored fallback={(err) => { console.error("演示 popover-align 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PopoverAlign /></Errored></div>
      </section>
      <section id="progress">
        <h2>进度</h2>
        <div class="demo" data-demo="progress-basic"><Errored fallback={(err) => { console.error("演示 progress-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ProgressBasic /></Errored></div>
        <div class="demo" data-demo="progress-ring"><Errored fallback={(err) => { console.error("演示 progress-ring 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ProgressRing /></Errored></div>
        <div class="demo" data-demo="progress-controlled"><Errored fallback={(err) => { console.error("演示 progress-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ProgressControlled /></Errored></div>
      </section>
      <section id="prompt">
        <h2>提示词输入框</h2>
        <div class="demo" data-demo="prompt-basic"><Errored fallback={(err) => { console.error("演示 prompt-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PromptBasic /></Errored></div>
        <div class="demo" data-demo="prompt-stop"><Errored fallback={(err) => { console.error("演示 prompt-stop 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PromptStop /></Errored></div>
        <div class="demo" data-demo="prompt-upload"><Errored fallback={(err) => { console.error("演示 prompt-upload 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PromptUpload /></Errored></div>
        <div class="demo" data-demo="prompt-parts"><Errored fallback={(err) => { console.error("演示 prompt-parts 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><PromptParts /></Errored></div>
      </section>
      <section id="reorder">
        <h2>拖拽重排</h2>
        <div class="demo" data-demo="reorder-basic"><Errored fallback={(err) => { console.error("演示 reorder-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ReorderBasic /></Errored></div>
        <div class="demo" data-demo="reorder-order"><Errored fallback={(err) => { console.error("演示 reorder-order 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ReorderOrder /></Errored></div>
        <div class="demo" data-demo="reorder-save"><Errored fallback={(err) => { console.error("演示 reorder-save 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ReorderSave /></Errored></div>
      </section>
      <section id="scrollarea">
        <h2>滚动区域</h2>
        <div class="demo" data-demo="scrollarea-basic"><Errored fallback={(err) => { console.error("演示 scrollarea-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaBasic /></Errored></div>
        <div class="demo" data-demo="scrollarea-bar"><Errored fallback={(err) => { console.error("演示 scrollarea-bar 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaBar /></Errored></div>
        <div class="demo" data-demo="scrollarea-none"><Errored fallback={(err) => { console.error("演示 scrollarea-none 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ScrollareaNone /></Errored></div>
      </section>
      <section id="segmented">
        <h2>分段控件</h2>
        <div class="demo" data-demo="segmented-basic"><Errored fallback={(err) => { console.error("演示 segmented-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SegmentedBasic /></Errored></div>
        <div class="demo" data-demo="segmented-controlled"><Errored fallback={(err) => { console.error("演示 segmented-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SegmentedControlled /></Errored></div>
        <div class="demo" data-demo="segmented-sizes"><Errored fallback={(err) => { console.error("演示 segmented-sizes 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SegmentedSizes /></Errored></div>
      </section>
      <section id="select">
        <h2>下拉选择与菜单</h2>
        <div class="demo" data-demo="select-basic"><Errored fallback={(err) => { console.error("演示 select-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SelectBasic /></Errored></div>
        <div class="demo" data-demo="select-placeholder"><Errored fallback={(err) => { console.error("演示 select-placeholder 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SelectPlaceholder /></Errored></div>
        <div class="demo" data-demo="select-options"><Errored fallback={(err) => { console.error("演示 select-options 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SelectOptions /></Errored></div>
        <div class="demo" data-demo="select-field"><Errored fallback={(err) => { console.error("演示 select-field 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SelectField /></Errored></div>
        <div class="demo" data-demo="select-events"><Errored fallback={(err) => { console.error("演示 select-events 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SelectEvents /></Errored></div>
        <div class="demo" data-demo="select-controlled"><Errored fallback={(err) => { console.error("演示 select-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SelectControlled /></Errored></div>
        <div class="demo" data-demo="select-menu"><Errored fallback={(err) => { console.error("演示 select-menu 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SelectMenu /></Errored></div>
      </section>
      <section id="sidebar">
        <h2>侧栏与布局</h2>
        <div class="demo" data-demo="sidebar-basic"><Errored fallback={(err) => { console.error("演示 sidebar-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SidebarBasic /></Errored></div>
        <div class="demo" data-demo="sidebar-controlled"><Errored fallback={(err) => { console.error("演示 sidebar-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SidebarControlled /></Errored></div>
        <div class="demo" data-demo="sidebar-fx"><Errored fallback={(err) => { console.error("演示 sidebar-fx 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SidebarFx /></Errored></div>
      </section>
      <section id="slider">
        <h2>滑块</h2>
        <div class="demo" data-demo="slider-basic"><Errored fallback={(err) => { console.error("演示 slider-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SliderBasic /></Errored></div>
        <div class="demo" data-demo="slider-controlled"><Errored fallback={(err) => { console.error("演示 slider-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SliderControlled /></Errored></div>
        <div class="demo" data-demo="slider-max"><Errored fallback={(err) => { console.error("演示 slider-max 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SliderMax /></Errored></div>
      </section>
      <section id="special">
        <h2>搜索、密码、邮箱</h2>
        <div class="demo" data-demo="special-basic"><Errored fallback={(err) => { console.error("演示 special-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpecialBasic /></Errored></div>
        <div class="demo" data-demo="special-password"><Errored fallback={(err) => { console.error("演示 special-password 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpecialPassword /></Errored></div>
        <div class="demo" data-demo="special-email"><Errored fallback={(err) => { console.error("演示 special-email 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><SpecialEmail /></Errored></div>
      </section>
      <section id="table">
        <h2>表格</h2>
        <div class="demo" data-demo="table-basic"><Errored fallback={(err) => { console.error("演示 table-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableBasic /></Errored></div>
        <div class="demo" data-demo="table-controlled"><Errored fallback={(err) => { console.error("演示 table-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableControlled /></Errored></div>
        <div class="demo" data-demo="table-states"><Errored fallback={(err) => { console.error("演示 table-states 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableStates /></Errored></div>
        <div class="demo" data-demo="table-tree"><Errored fallback={(err) => { console.error("演示 table-tree 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableTree /></Errored></div>
        <div class="demo" data-demo="table-merge"><Errored fallback={(err) => { console.error("演示 table-merge 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableMerge /></Errored></div>
        <div class="demo" data-demo="table-drag"><Errored fallback={(err) => { console.error("演示 table-drag 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TableDrag /></Errored></div>
      </section>
      <section id="tabs">
        <h2>标签页、分页、步骤</h2>
        <div class="demo" data-demo="tabs-basic"><Errored fallback={(err) => { console.error("演示 tabs-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TabsBasic /></Errored></div>
        <div class="demo" data-demo="tabs-controlled"><Errored fallback={(err) => { console.error("演示 tabs-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TabsControlled /></Errored></div>
        <div class="demo" data-demo="tabs-pager"><Errored fallback={(err) => { console.error("演示 tabs-pager 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TabsPager /></Errored></div>
        <div class="demo" data-demo="tabs-steps"><Errored fallback={(err) => { console.error("演示 tabs-steps 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TabsSteps /></Errored></div>
      </section>
      <section id="taginput">
        <h2>标签输入</h2>
        <div class="demo" data-demo="taginput-basic"><Errored fallback={(err) => { console.error("演示 taginput-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TaginputBasic /></Errored></div>
        <div class="demo" data-demo="taginput-controlled"><Errored fallback={(err) => { console.error("演示 taginput-controlled 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TaginputControlled /></Errored></div>
        <div class="demo" data-demo="taginput-hint"><Errored fallback={(err) => { console.error("演示 taginput-hint 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TaginputHint /></Errored></div>
      </section>
      <section id="tags">
        <h2>标签、徽标与头像</h2>
        <div class="demo" data-demo="tags-basic"><Errored fallback={(err) => { console.error("演示 tags-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TagsBasic /></Errored></div>
        <div class="demo" data-demo="tags-badge"><Errored fallback={(err) => { console.error("演示 tags-badge 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TagsBadge /></Errored></div>
        <div class="demo" data-demo="tags-avatar"><Errored fallback={(err) => { console.error("演示 tags-avatar 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TagsAvatar /></Errored></div>
      </section>
      <section id="toast">
        <h2>轻提示</h2>
        <div class="demo" data-demo="toast-basic"><Errored fallback={(err) => { console.error("演示 toast-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ToastBasic /></Errored></div>
        <div class="demo" data-demo="toast-action"><Errored fallback={(err) => { console.error("演示 toast-action 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ToastAction /></Errored></div>
        <div class="demo" data-demo="toast-progress"><Errored fallback={(err) => { console.error("演示 toast-progress 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><ToastProgress /></Errored></div>
      </section>
      <section id="tooltip">
        <h2>文字提示</h2>
        <div class="demo" data-demo="tooltip-basic"><Errored fallback={(err) => { console.error("演示 tooltip-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TooltipBasic /></Errored></div>
        <div class="demo" data-demo="tooltip-kbd"><Errored fallback={(err) => { console.error("演示 tooltip-kbd 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TooltipKbd /></Errored></div>
        <div class="demo" data-demo="tooltip-truncate"><Errored fallback={(err) => { console.error("演示 tooltip-truncate 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><TooltipTruncate /></Errored></div>
      </section>
      <section id="upload">
        <h2>上传</h2>
        <div class="demo" data-demo="upload-basic"><Errored fallback={(err) => { console.error("演示 upload-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><UploadBasic /></Errored></div>
        <div class="demo" data-demo="upload-real"><Errored fallback={(err) => { console.error("演示 upload-real 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><UploadReal /></Errored></div>
        <div class="demo" data-demo="upload-single"><Errored fallback={(err) => { console.error("演示 upload-single 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><UploadSingle /></Errored></div>
      </section>
      <section id="vlist">
        <h2>无限列表</h2>
        <div class="demo" data-demo="vlist-basic"><Errored fallback={(err) => { console.error("演示 vlist-basic 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><VlistBasic /></Errored></div>
        <div class="demo" data-demo="vlist-total"><Errored fallback={(err) => { console.error("演示 vlist-total 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><VlistTotal /></Errored></div>
        <div class="demo" data-demo="vlist-retry"><Errored fallback={(err) => { console.error("演示 vlist-retry 出错：", err()); return <p class="demo-err">演示出错：{String(err()?.message ?? err())}</p>; }}><VlistRetry /></Errored></div>
      </section>
    </main>
  );
}
setup(); defineElements(); // 应用入口调一次
render(Gallery, document.getElementById("app"));
