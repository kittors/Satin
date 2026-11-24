// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
import { render } from "@solidjs/web";
import { Errored } from "solid-js";
import { setup } from "satin-ui";
import { defineElements } from "satin-ui/elements";
import "satin-ui/css/page.css";
import "../../shared/gallery.css";
import ColorDemo0 from "./demos/color-0.tsx";
import TypeDemo0 from "./demos/type-0.tsx";
import TypeDemo1 from "./demos/type-1.tsx";
import TypeDemo2 from "./demos/type-2.tsx";
import SpacingDemo0 from "./demos/spacing-0.tsx";
import SpacingDemo1 from "./demos/spacing-1.tsx";
import SpacingDemo2 from "./demos/spacing-2.tsx";
import SpacingDemo3 from "./demos/spacing-3.tsx";
import LayoutDemo0 from "./demos/layout-0.tsx";
import LayoutDemo1 from "./demos/layout-1.tsx";
import SpaceDemo0 from "./demos/space-0.tsx";
import SpaceDemo1 from "./demos/space-1.tsx";
import SpaceDemo2 from "./demos/space-2.tsx";
import ElevationDemo0 from "./demos/elevation-0.tsx";
import MotionDemo0 from "./demos/motion-0.tsx";
import LoadingmotionDemo0 from "./demos/loadingmotion-0.tsx";
import IconsDemo0 from "./demos/icons-0.tsx";
import IconsDemo1 from "./demos/icons-1.tsx";
import FeelDemo0 from "./demos/feel-0.tsx";
import ButtonDemo0 from "./demos/button-0.tsx";
import ButtonDemo1 from "./demos/button-1.tsx";
import ButtonDemo2 from "./demos/button-2.tsx";
import ButtonDemo3 from "./demos/button-3.tsx";
import IconbuttonDemo0 from "./demos/iconbutton-0.tsx";
import LinkDemo0 from "./demos/link-0.tsx";
import CompoundDemo0 from "./demos/compound-0.tsx";
import ChipDemo0 from "./demos/chip-0.tsx";
import FieldDemo0 from "./demos/field-0.tsx";
import InputDemo0 from "./demos/input-0.tsx";
import InputDemo1 from "./demos/input-1.tsx";
import InputDemo2 from "./demos/input-2.tsx";
import SpecialDemo0 from "./demos/special-0.tsx";
import CountDemo0 from "./demos/count-0.tsx";
import TaginputDemo0 from "./demos/taginput-0.tsx";
import NumberDemo0 from "./demos/number-0.tsx";
import PromptDemo0 from "./demos/prompt-0.tsx";
import SelectDemo0 from "./demos/select-0.tsx";
import PickerDemo0 from "./demos/picker-0.tsx";
import ChoiceDemo0 from "./demos/choice-0.tsx";
import SegmentedDemo0 from "./demos/segmented-0.tsx";
import SliderDemo0 from "./demos/slider-0.tsx";
import OtpDemo0 from "./demos/otp-0.tsx";
import TooltipDemo0 from "./demos/tooltip-0.tsx";
import PopoverDemo0 from "./demos/popover-0.tsx";
import PopconfirmDemo0 from "./demos/popconfirm-0.tsx";
import CtxmenuDemo0 from "./demos/ctxmenu-0.tsx";
import DialogDemo0 from "./demos/dialog-0.tsx";
import DrawerDemo0 from "./demos/drawer-0.tsx";
import CmdkDemo0 from "./demos/cmdk-0.tsx";
import ToastDemo0 from "./demos/toast-0.tsx";
import NotifyDemo0 from "./demos/notify-0.tsx";
import BannerDemo0 from "./demos/banner-0.tsx";
import EmptyDemo0 from "./demos/empty-0.tsx";
import LoadingDemo0 from "./demos/loading-0.tsx";
import LoadingDemo1 from "./demos/loading-1.tsx";
import ProgressDemo0 from "./demos/progress-0.tsx";
import NumflowDemo0 from "./demos/numflow-0.tsx";
import TableDemo0 from "./demos/table-0.tsx";
import TableDemo1 from "./demos/table-1.tsx";
import TableDemo2 from "./demos/table-2.tsx";
import TableDemo3 from "./demos/table-3.tsx";
import TableDemo4 from "./demos/table-4.tsx";
import TableDemo5 from "./demos/table-5.tsx";
import TableDemo6 from "./demos/table-6.tsx";
import TableDemo7 from "./demos/table-7.tsx";
import GridDemo0 from "./demos/grid-0.tsx";
import CgridDemo0 from "./demos/cgrid-0.tsx";
import ChartsDemo0 from "./demos/charts-0.tsx";
import ChartsDemo1 from "./demos/charts-1.tsx";
import ChartsDemo2 from "./demos/charts-2.tsx";
import ChartsDemo3 from "./demos/charts-3.tsx";
import ListDemo0 from "./demos/list-0.tsx";
import CardDemo0 from "./demos/card-0.tsx";
import TagsDemo0 from "./demos/tags-0.tsx";
import AvatarDemo0 from "./demos/avatar-0.tsx";
import AvatarDemo1 from "./demos/avatar-1.tsx";
import AvatarDemo2 from "./demos/avatar-2.tsx";
import CollapseDemo0 from "./demos/collapse-0.tsx";
import ScrollareaDemo0 from "./demos/scrollarea-0.tsx";
import ScrollareaDemo1 from "./demos/scrollarea-1.tsx";
import ScrollareaDemo2 from "./demos/scrollarea-2.tsx";
import ScrollareaDemo3 from "./demos/scrollarea-3.tsx";
import ScrollareaDemo4 from "./demos/scrollarea-4.tsx";
import ScrollareaDemo5 from "./demos/scrollarea-5.tsx";
import ScrollareaDemo6 from "./demos/scrollarea-6.tsx";
import VlistDemo0 from "./demos/vlist-0.tsx";
import ChatDemo0 from "./demos/chat-0.tsx";
import ChatDemo1 from "./demos/chat-1.tsx";
import MdDemo0 from "./demos/md-0.tsx";
import EditorialDemo0 from "./demos/editorial-0.tsx";
import FlowDemo0 from "./demos/flow-0.tsx";
import ImageDemo0 from "./demos/image-0.tsx";
import MediaDemo0 from "./demos/media-0.tsx";
import UploadDemo0 from "./demos/upload-0.tsx";
import SidebarDemo0 from "./demos/sidebar-0.tsx";
import TabsDemo0 from "./demos/tabs-0.tsx";
import ReorderDemo0 from "./demos/reorder-0.tsx";
import AddremoveDemo0 from "./demos/addremove-0.tsx";
import OptimisticDemo0 from "./demos/optimistic-0.tsx";
import AddremoveBasic from "./demos/addremove-basic.tsx";
import AddremoveUndo from "./demos/addremove-undo.tsx";
import AddremoveRows from "./demos/addremove-rows.tsx";
import AvatarBasic from "./demos/avatar-basic.tsx";
import AvatarList from "./demos/avatar-list.tsx";
import BannerBasic from "./demos/banner-basic.tsx";
import BannerDismiss from "./demos/banner-dismiss.tsx";
import BannerError from "./demos/banner-error.tsx";
import ButtonBasic from "./demos/button-basic.tsx";
import ButtonVariants from "./demos/button-variants.tsx";
import ButtonSizes from "./demos/button-sizes.tsx";
import ButtonIcons from "./demos/button-icons.tsx";
import ButtonStates from "./demos/button-states.tsx";
import ButtonBusy from "./demos/button-busy.tsx";
import ButtonActions from "./demos/button-actions.tsx";
import ButtonMobile from "./demos/button-mobile.tsx";
import CardBasic from "./demos/card-basic.tsx";
import CardGrid from "./demos/card-grid.tsx";
import CardVariants from "./demos/card-variants.tsx";
import CardLayouts from "./demos/card-layouts.tsx";
import CardContent from "./demos/card-content.tsx";
import CardSelect from "./demos/card-select.tsx";
import CgridBasic from "./demos/cgrid-basic.tsx";
import CgridMillion from "./demos/cgrid-million.tsx";
import CgridControlled from "./demos/cgrid-controlled.tsx";
import CgridEvents from "./demos/cgrid-events.tsx";
import ChatBasic from "./demos/chat-basic.tsx";
import ChatNew from "./demos/chat-new.tsx";
import ChatHistory from "./demos/chat-history.tsx";
import ChatRich from "./demos/chat-rich.tsx";
import ChipBasic from "./demos/chip-basic.tsx";
import ChipControlled from "./demos/chip-controlled.tsx";
import ChipRemovable from "./demos/chip-removable.tsx";
import ChoiceBasic from "./demos/choice-basic.tsx";
import ChoiceRadio from "./demos/choice-radio.tsx";
import ChoiceControlled from "./demos/choice-controlled.tsx";
import CmdkBasic from "./demos/cmdk-basic.tsx";
import CmdkEmpty from "./demos/cmdk-empty.tsx";
import CmdkHotkey from "./demos/cmdk-hotkey.tsx";
import CollapseBasic from "./demos/collapse-basic.tsx";
import CollapseSingle from "./demos/collapse-single.tsx";
import CollapseControlled from "./demos/collapse-controlled.tsx";
import CompoundBasic from "./demos/compound-basic.tsx";
import CompoundSplit from "./demos/compound-split.tsx";
import CompoundCopy from "./demos/compound-copy.tsx";
import CountBasic from "./demos/count-basic.tsx";
import CountControlled from "./demos/count-controlled.tsx";
import CountLongtext from "./demos/count-longtext.tsx";
import CtxmenuBasic from "./demos/ctxmenu-basic.tsx";
import CtxmenuContext from "./demos/ctxmenu-context.tsx";
import CtxmenuSubmenu from "./demos/ctxmenu-submenu.tsx";
import DialogBasic from "./demos/dialog-basic.tsx";
import DialogDanger from "./demos/dialog-danger.tsx";
import DialogGuard from "./demos/dialog-guard.tsx";
import DialogEvents from "./demos/dialog-events.tsx";
import DialogControlled from "./demos/dialog-controlled.tsx";
import DrawerBasic from "./demos/drawer-basic.tsx";
import DrawerControlled from "./demos/drawer-controlled.tsx";
import DrawerFooter from "./demos/drawer-footer.tsx";
import EditorialBasic from "./demos/editorial-basic.tsx";
import EditorialCompare from "./demos/editorial-compare.tsx";
import EditorialHotspot from "./demos/editorial-hotspot.tsx";
import EmptyBasic from "./demos/empty-basic.tsx";
import EmptySearch from "./demos/empty-search.tsx";
import EmptyError from "./demos/empty-error.tsx";
import EmptyPresets from "./demos/empty-presets.tsx";
import FieldBasic from "./demos/field-basic.tsx";
import FieldError from "./demos/field-error.tsx";
import FieldOptional from "./demos/field-optional.tsx";
import FlowBasic from "./demos/flow-basic.tsx";
import FlowBranch from "./demos/flow-branch.tsx";
import FlowTidy from "./demos/flow-tidy.tsx";
import FlowstressMany from "./demos/flowstress-many.tsx";
import GridBasic from "./demos/grid-basic.tsx";
import GridSort from "./demos/grid-sort.tsx";
import GridSelect from "./demos/grid-select.tsx";
import GridRender from "./demos/grid-render.tsx";
import GridRemote from "./demos/grid-remote.tsx";
import GridEdit from "./demos/grid-edit.tsx";
import GridStates from "./demos/grid-states.tsx";
import IconbuttonBasic from "./demos/iconbutton-basic.tsx";
import IconbuttonVariants from "./demos/iconbutton-variants.tsx";
import IconbuttonStates from "./demos/iconbutton-states.tsx";
import IconbuttonControlled from "./demos/iconbutton-controlled.tsx";
import ImageBasic from "./demos/image-basic.tsx";
import ImageControlled from "./demos/image-controlled.tsx";
import ImageFailed from "./demos/image-failed.tsx";
import InputBasic from "./demos/input-basic.tsx";
import InputSizes from "./demos/input-sizes.tsx";
import InputControlled from "./demos/input-controlled.tsx";
import LinkBasic from "./demos/link-basic.tsx";
import LinkTextbtn from "./demos/link-textbtn.tsx";
import LinkArrow from "./demos/link-arrow.tsx";
import ListBasic from "./demos/list-basic.tsx";
import ListKv from "./demos/list-kv.tsx";
import ListSwitch from "./demos/list-switch.tsx";
import LoadingBasic from "./demos/loading-basic.tsx";
import LoadingList from "./demos/loading-list.tsx";
import LoadingQuiet from "./demos/loading-quiet.tsx";
import MdBasic from "./demos/md-basic.tsx";
import MdStream from "./demos/md-stream.tsx";
import MdHeights from "./demos/md-heights.tsx";
import MediaBasic from "./demos/media-basic.tsx";
import MediaAudio from "./demos/media-audio.tsx";
import MediaMethods from "./demos/media-methods.tsx";
import NotifyBasic from "./demos/notify-basic.tsx";
import NotifyActions from "./demos/notify-actions.tsx";
import NotifyFail from "./demos/notify-fail.tsx";
import NumberBasic from "./demos/number-basic.tsx";
import NumberControlled from "./demos/number-controlled.tsx";
import NumberRange from "./demos/number-range.tsx";
import NumflowBasic from "./demos/numflow-basic.tsx";
import NumflowCounter from "./demos/numflow-counter.tsx";
import NumflowStyles from "./demos/numflow-styles.tsx";
import OptimisticBasic from "./demos/optimistic-basic.tsx";
import OptimisticSwitch from "./demos/optimistic-switch.tsx";
import OptimisticPending from "./demos/optimistic-pending.tsx";
import OtpBasic from "./demos/otp-basic.tsx";
import OtpComplete from "./demos/otp-complete.tsx";
import OtpLength from "./demos/otp-length.tsx";
import OtpMask from "./demos/otp-mask.tsx";
import PickerBasic from "./demos/picker-basic.tsx";
import PickerRange from "./demos/picker-range.tsx";
import PickerTime from "./demos/picker-time.tsx";
import PickerDatetime from "./demos/picker-datetime.tsx";
import PickerRegion from "./demos/picker-region.tsx";
import PickerEvents from "./demos/picker-events.tsx";
import PopconfirmBasic from "./demos/popconfirm-basic.tsx";
import PopconfirmUndo from "./demos/popconfirm-undo.tsx";
import PopconfirmSubmit from "./demos/popconfirm-submit.tsx";
import PopoverBasic from "./demos/popover-basic.tsx";
import PopoverControlled from "./demos/popover-controlled.tsx";
import PopoverAlign from "./demos/popover-align.tsx";
import ProgressBasic from "./demos/progress-basic.tsx";
import ProgressRing from "./demos/progress-ring.tsx";
import ProgressControlled from "./demos/progress-controlled.tsx";
import PromptBasic from "./demos/prompt-basic.tsx";
import PromptStop from "./demos/prompt-stop.tsx";
import PromptUpload from "./demos/prompt-upload.tsx";
import PromptParts from "./demos/prompt-parts.tsx";
import ReorderBasic from "./demos/reorder-basic.tsx";
import ReorderOrder from "./demos/reorder-order.tsx";
import ReorderSave from "./demos/reorder-save.tsx";
import ScrollareaBasic from "./demos/scrollarea-basic.tsx";
import ScrollareaBar from "./demos/scrollarea-bar.tsx";
import ScrollareaNone from "./demos/scrollarea-none.tsx";
import SegmentedBasic from "./demos/segmented-basic.tsx";
import SegmentedControlled from "./demos/segmented-controlled.tsx";
import SegmentedSizes from "./demos/segmented-sizes.tsx";
import SelectBasic from "./demos/select-basic.tsx";
import SelectPlaceholder from "./demos/select-placeholder.tsx";
import SelectOptions from "./demos/select-options.tsx";
import SelectField from "./demos/select-field.tsx";
import SelectEvents from "./demos/select-events.tsx";
import SelectControlled from "./demos/select-controlled.tsx";
import SelectMenu from "./demos/select-menu.tsx";
import SidebarBasic from "./demos/sidebar-basic.tsx";
import SidebarControlled from "./demos/sidebar-controlled.tsx";
import SidebarFx from "./demos/sidebar-fx.tsx";
import SliderBasic from "./demos/slider-basic.tsx";
import SliderControlled from "./demos/slider-controlled.tsx";
import SliderMax from "./demos/slider-max.tsx";
import SpecialBasic from "./demos/special-basic.tsx";
import SpecialPassword from "./demos/special-password.tsx";
import SpecialEmail from "./demos/special-email.tsx";
import TableBasic from "./demos/table-basic.tsx";
import TableControlled from "./demos/table-controlled.tsx";
import TableStates from "./demos/table-states.tsx";
import TableTree from "./demos/table-tree.tsx";
import TableMerge from "./demos/table-merge.tsx";
import TableDrag from "./demos/table-drag.tsx";
import TabsBasic from "./demos/tabs-basic.tsx";
import TabsControlled from "./demos/tabs-controlled.tsx";
import TabsPager from "./demos/tabs-pager.tsx";
import TabsSteps from "./demos/tabs-steps.tsx";
import TaginputBasic from "./demos/taginput-basic.tsx";
import TaginputControlled from "./demos/taginput-controlled.tsx";
import TaginputHint from "./demos/taginput-hint.tsx";
import TagsBasic from "./demos/tags-basic.tsx";
import TagsBadge from "./demos/tags-badge.tsx";
import TagsAvatar from "./demos/tags-avatar.tsx";
import ToastBasic from "./demos/toast-basic.tsx";
import ToastAction from "./demos/toast-action.tsx";
import ToastProgress from "./demos/toast-progress.tsx";
import TooltipBasic from "./demos/tooltip-basic.tsx";
import TooltipKbd from "./demos/tooltip-kbd.tsx";
import TooltipTruncate from "./demos/tooltip-truncate.tsx";
import UploadBasic from "./demos/upload-basic.tsx";
import UploadReal from "./demos/upload-real.tsx";
import UploadSingle from "./demos/upload-single.tsx";
import VlistBasic from "./demos/vlist-basic.tsx";
import VlistTotal from "./demos/vlist-total.tsx";
import VlistRetry from "./demos/vlist-retry.tsx";

function Gallery() {
  return (
    <main class="gallery">
      <section id="color">
        <h2>颜色</h2>
        <div class="demo" data-demo="color-0"><Errored fallback={(err: () => unknown) => { console.error("演示 color-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ColorDemo0 /></Errored></div>
      </section>
      <section id="type">
        <h2>排版</h2>
        <div class="demo" data-demo="type-0"><Errored fallback={(err: () => unknown) => { console.error("演示 type-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TypeDemo0 /></Errored></div>
        <div class="demo" data-demo="type-1"><Errored fallback={(err: () => unknown) => { console.error("演示 type-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TypeDemo1 /></Errored></div>
        <div class="demo" data-demo="type-2"><Errored fallback={(err: () => unknown) => { console.error("演示 type-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TypeDemo2 /></Errored></div>
      </section>
      <section id="spacing">
        <h2>间距</h2>
        <div class="demo" data-demo="spacing-0"><Errored fallback={(err: () => unknown) => { console.error("演示 spacing-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpacingDemo0 /></Errored></div>
        <div class="demo" data-demo="spacing-1"><Errored fallback={(err: () => unknown) => { console.error("演示 spacing-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpacingDemo1 /></Errored></div>
        <div class="demo" data-demo="spacing-2"><Errored fallback={(err: () => unknown) => { console.error("演示 spacing-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpacingDemo2 /></Errored></div>
        <div class="demo" data-demo="spacing-3"><Errored fallback={(err: () => unknown) => { console.error("演示 spacing-3 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpacingDemo3 /></Errored></div>
      </section>
      <section id="layout">
        <h2>布局</h2>
        <div class="demo" data-demo="layout-0"><Errored fallback={(err: () => unknown) => { console.error("演示 layout-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LayoutDemo0 /></Errored></div>
        <div class="demo" data-demo="layout-1"><Errored fallback={(err: () => unknown) => { console.error("演示 layout-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LayoutDemo1 /></Errored></div>
      </section>
      <section id="space">
        <h2>圆角与线</h2>
        <div class="demo" data-demo="space-0"><Errored fallback={(err: () => unknown) => { console.error("演示 space-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpaceDemo0 /></Errored></div>
        <div class="demo" data-demo="space-1"><Errored fallback={(err: () => unknown) => { console.error("演示 space-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpaceDemo1 /></Errored></div>
        <div class="demo" data-demo="space-2"><Errored fallback={(err: () => unknown) => { console.error("演示 space-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpaceDemo2 /></Errored></div>
      </section>
      <section id="elevation">
        <h2>阴影与层级</h2>
        <div class="demo" data-demo="elevation-0"><Errored fallback={(err: () => unknown) => { console.error("演示 elevation-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ElevationDemo0 /></Errored></div>
      </section>
      <section id="motion">
        <h2>动效曲线</h2>
        <div class="demo" data-demo="motion-0"><Errored fallback={(err: () => unknown) => { console.error("演示 motion-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MotionDemo0 /></Errored></div>
      </section>
      <section id="loadingmotion">
        <h2>内容加载与过渡</h2>
        <div class="demo" data-demo="loadingmotion-0"><Errored fallback={(err: () => unknown) => { console.error("演示 loadingmotion-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LoadingmotionDemo0 /></Errored></div>
      </section>
      <section id="icons">
        <h2>图标</h2>
        <div class="demo" data-demo="icons-0"><Errored fallback={(err: () => unknown) => { console.error("演示 icons-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><IconsDemo0 /></Errored></div>
        <div class="demo" data-demo="icons-1"><Errored fallback={(err: () => unknown) => { console.error("演示 icons-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><IconsDemo1 /></Errored></div>
      </section>
      <section id="feel">
        <h2>交互质感</h2>
        <div class="demo" data-demo="feel-0"><Errored fallback={(err: () => unknown) => { console.error("演示 feel-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FeelDemo0 /></Errored></div>
      </section>
      <section id="button">
        <h2>按钮</h2>
        <div class="demo" data-demo="button-0"><Errored fallback={(err: () => unknown) => { console.error("演示 button-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonDemo0 /></Errored></div>
        <div class="demo" data-demo="button-1"><Errored fallback={(err: () => unknown) => { console.error("演示 button-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonDemo1 /></Errored></div>
        <div class="demo" data-demo="button-2"><Errored fallback={(err: () => unknown) => { console.error("演示 button-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonDemo2 /></Errored></div>
        <div class="demo" data-demo="button-3"><Errored fallback={(err: () => unknown) => { console.error("演示 button-3 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonDemo3 /></Errored></div>
      </section>
      <section id="iconbutton">
        <h2>纯图标按钮</h2>
        <div class="demo" data-demo="iconbutton-0"><Errored fallback={(err: () => unknown) => { console.error("演示 iconbutton-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><IconbuttonDemo0 /></Errored></div>
      </section>
      <section id="link">
        <h2>文字链接</h2>
        <div class="demo" data-demo="link-0"><Errored fallback={(err: () => unknown) => { console.error("演示 link-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LinkDemo0 /></Errored></div>
      </section>
      <section id="compound">
        <h2>组合按钮</h2>
        <div class="demo" data-demo="compound-0"><Errored fallback={(err: () => unknown) => { console.error("演示 compound-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CompoundDemo0 /></Errored></div>
      </section>
      <section id="chip">
        <h2>切换芯片</h2>
        <div class="demo" data-demo="chip-0"><Errored fallback={(err: () => unknown) => { console.error("演示 chip-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChipDemo0 /></Errored></div>
      </section>
      <section id="field">
        <h2>字段与错误</h2>
        <div class="demo" data-demo="field-0"><Errored fallback={(err: () => unknown) => { console.error("演示 field-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FieldDemo0 /></Errored></div>
      </section>
      <section id="input">
        <h2>输入框</h2>
        <div class="demo" data-demo="input-0"><Errored fallback={(err: () => unknown) => { console.error("演示 input-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><InputDemo0 /></Errored></div>
        <div class="demo" data-demo="input-1"><Errored fallback={(err: () => unknown) => { console.error("演示 input-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><InputDemo1 /></Errored></div>
        <div class="demo" data-demo="input-2"><Errored fallback={(err: () => unknown) => { console.error("演示 input-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><InputDemo2 /></Errored></div>
      </section>
      <section id="special">
        <h2>搜索、密码、邮箱</h2>
        <div class="demo" data-demo="special-0"><Errored fallback={(err: () => unknown) => { console.error("演示 special-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpecialDemo0 /></Errored></div>
      </section>
      <section id="count">
        <h2>字数统计</h2>
        <div class="demo" data-demo="count-0"><Errored fallback={(err: () => unknown) => { console.error("演示 count-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CountDemo0 /></Errored></div>
      </section>
      <section id="taginput">
        <h2>标签输入</h2>
        <div class="demo" data-demo="taginput-0"><Errored fallback={(err: () => unknown) => { console.error("演示 taginput-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TaginputDemo0 /></Errored></div>
      </section>
      <section id="number">
        <h2>数字步进</h2>
        <div class="demo" data-demo="number-0"><Errored fallback={(err: () => unknown) => { console.error("演示 number-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NumberDemo0 /></Errored></div>
      </section>
      <section id="prompt">
        <h2>提示词输入框</h2>
        <div class="demo" data-demo="prompt-0"><Errored fallback={(err: () => unknown) => { console.error("演示 prompt-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PromptDemo0 /></Errored></div>
      </section>
      <section id="select">
        <h2>下拉选择与菜单</h2>
        <div class="demo" data-demo="select-0"><Errored fallback={(err: () => unknown) => { console.error("演示 select-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SelectDemo0 /></Errored></div>
      </section>
      <section id="picker">
        <h2>日期、时间、地址</h2>
        <div class="demo" data-demo="picker-0"><Errored fallback={(err: () => unknown) => { console.error("演示 picker-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PickerDemo0 /></Errored></div>
      </section>
      <section id="choice">
        <h2>复选、单选、开关</h2>
        <div class="demo" data-demo="choice-0"><Errored fallback={(err: () => unknown) => { console.error("演示 choice-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChoiceDemo0 /></Errored></div>
      </section>
      <section id="segmented">
        <h2>分段控件</h2>
        <div class="demo" data-demo="segmented-0"><Errored fallback={(err: () => unknown) => { console.error("演示 segmented-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SegmentedDemo0 /></Errored></div>
      </section>
      <section id="slider">
        <h2>滑块</h2>
        <div class="demo" data-demo="slider-0"><Errored fallback={(err: () => unknown) => { console.error("演示 slider-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SliderDemo0 /></Errored></div>
      </section>
      <section id="otp">
        <h2>验证码</h2>
        <div class="demo" data-demo="otp-0"><Errored fallback={(err: () => unknown) => { console.error("演示 otp-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OtpDemo0 /></Errored></div>
      </section>
      <section id="tooltip">
        <h2>文字提示</h2>
        <div class="demo" data-demo="tooltip-0"><Errored fallback={(err: () => unknown) => { console.error("演示 tooltip-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TooltipDemo0 /></Errored></div>
      </section>
      <section id="popover">
        <h2>弹出面板</h2>
        <div class="demo" data-demo="popover-0"><Errored fallback={(err: () => unknown) => { console.error("演示 popover-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PopoverDemo0 /></Errored></div>
      </section>
      <section id="popconfirm">
        <h2>气泡确认</h2>
        <div class="demo" data-demo="popconfirm-0"><Errored fallback={(err: () => unknown) => { console.error("演示 popconfirm-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PopconfirmDemo0 /></Errored></div>
      </section>
      <section id="ctxmenu">
        <h2>右键菜单与子菜单</h2>
        <div class="demo" data-demo="ctxmenu-0"><Errored fallback={(err: () => unknown) => { console.error("演示 ctxmenu-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CtxmenuDemo0 /></Errored></div>
      </section>
      <section id="dialog">
        <h2>弹窗</h2>
        <div class="demo" data-demo="dialog-0"><Errored fallback={(err: () => unknown) => { console.error("演示 dialog-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DialogDemo0 /></Errored></div>
      </section>
      <section id="drawer">
        <h2>抽屉</h2>
        <div class="demo" data-demo="drawer-0"><Errored fallback={(err: () => unknown) => { console.error("演示 drawer-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DrawerDemo0 /></Errored></div>
      </section>
      <section id="cmdk">
        <h2>命令面板</h2>
        <div class="demo" data-demo="cmdk-0"><Errored fallback={(err: () => unknown) => { console.error("演示 cmdk-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CmdkDemo0 /></Errored></div>
      </section>
      <section id="toast">
        <h2>轻提示</h2>
        <div class="demo" data-demo="toast-0"><Errored fallback={(err: () => unknown) => { console.error("演示 toast-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ToastDemo0 /></Errored></div>
      </section>
      <section id="notify">
        <h2>通知</h2>
        <div class="demo" data-demo="notify-0"><Errored fallback={(err: () => unknown) => { console.error("演示 notify-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NotifyDemo0 /></Errored></div>
      </section>
      <section id="banner">
        <h2>横幅与条目上的失败</h2>
        <div class="demo" data-demo="banner-0"><Errored fallback={(err: () => unknown) => { console.error("演示 banner-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><BannerDemo0 /></Errored></div>
      </section>
      <section id="empty">
        <h2>空状态</h2>
        <div class="demo" data-demo="empty-0"><Errored fallback={(err: () => unknown) => { console.error("演示 empty-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EmptyDemo0 /></Errored></div>
      </section>
      <section id="loading">
        <h2>骨架与加载</h2>
        <div class="demo" data-demo="loading-0"><Errored fallback={(err: () => unknown) => { console.error("演示 loading-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LoadingDemo0 /></Errored></div>
        <div class="demo" data-demo="loading-1"><Errored fallback={(err: () => unknown) => { console.error("演示 loading-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LoadingDemo1 /></Errored></div>
      </section>
      <section id="progress">
        <h2>进度</h2>
        <div class="demo" data-demo="progress-0"><Errored fallback={(err: () => unknown) => { console.error("演示 progress-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ProgressDemo0 /></Errored></div>
      </section>
      <section id="numflow">
        <h2>数字变化</h2>
        <div class="demo" data-demo="numflow-0"><Errored fallback={(err: () => unknown) => { console.error("演示 numflow-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NumflowDemo0 /></Errored></div>
      </section>
      <section id="table">
        <h2>表格</h2>
        <div class="demo" data-demo="table-0"><Errored fallback={(err: () => unknown) => { console.error("演示 table-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDemo0 /></Errored></div>
        <div class="demo" data-demo="table-1"><Errored fallback={(err: () => unknown) => { console.error("演示 table-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDemo1 /></Errored></div>
        <div class="demo" data-demo="table-2"><Errored fallback={(err: () => unknown) => { console.error("演示 table-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDemo2 /></Errored></div>
        <div class="demo" data-demo="table-3"><Errored fallback={(err: () => unknown) => { console.error("演示 table-3 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDemo3 /></Errored></div>
        <div class="demo" data-demo="table-4"><Errored fallback={(err: () => unknown) => { console.error("演示 table-4 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDemo4 /></Errored></div>
        <div class="demo" data-demo="table-5"><Errored fallback={(err: () => unknown) => { console.error("演示 table-5 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDemo5 /></Errored></div>
        <div class="demo" data-demo="table-6"><Errored fallback={(err: () => unknown) => { console.error("演示 table-6 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDemo6 /></Errored></div>
        <div class="demo" data-demo="table-7"><Errored fallback={(err: () => unknown) => { console.error("演示 table-7 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDemo7 /></Errored></div>
      </section>
      <section id="grid">
        <h2>数据表格</h2>
        <div class="demo" data-demo="grid-0"><Errored fallback={(err: () => unknown) => { console.error("演示 grid-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><GridDemo0 /></Errored></div>
      </section>
      <section id="cgrid">
        <h2>Canvas 表格</h2>
        <div class="demo" data-demo="cgrid-0"><Errored fallback={(err: () => unknown) => { console.error("演示 cgrid-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CgridDemo0 /></Errored></div>
      </section>
      <section id="charts">
        <h2>数据图表与 3D</h2>
        <div class="demo" data-demo="charts-0"><Errored fallback={(err: () => unknown) => { console.error("演示 charts-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChartsDemo0 /></Errored></div>
        <div class="demo" data-demo="charts-1"><Errored fallback={(err: () => unknown) => { console.error("演示 charts-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChartsDemo1 /></Errored></div>
        <div class="demo" data-demo="charts-2"><Errored fallback={(err: () => unknown) => { console.error("演示 charts-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChartsDemo2 /></Errored></div>
        <div class="demo" data-demo="charts-3"><Errored fallback={(err: () => unknown) => { console.error("演示 charts-3 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChartsDemo3 /></Errored></div>
      </section>
      <section id="list">
        <h2>列表与键值</h2>
        <div class="demo" data-demo="list-0"><Errored fallback={(err: () => unknown) => { console.error("演示 list-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ListDemo0 /></Errored></div>
      </section>
      <section id="card">
        <h2>卡片</h2>
        <div class="demo" data-demo="card-0"><Errored fallback={(err: () => unknown) => { console.error("演示 card-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CardDemo0 /></Errored></div>
      </section>
      <section id="tags">
        <h2>标签、徽标与头像</h2>
        <div class="demo" data-demo="tags-0"><Errored fallback={(err: () => unknown) => { console.error("演示 tags-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TagsDemo0 /></Errored></div>
      </section>
      <section id="avatar">
        <h2>头像</h2>
        <div class="demo" data-demo="avatar-0"><Errored fallback={(err: () => unknown) => { console.error("演示 avatar-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AvatarDemo0 /></Errored></div>
        <div class="demo" data-demo="avatar-1"><Errored fallback={(err: () => unknown) => { console.error("演示 avatar-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AvatarDemo1 /></Errored></div>
        <div class="demo" data-demo="avatar-2"><Errored fallback={(err: () => unknown) => { console.error("演示 avatar-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AvatarDemo2 /></Errored></div>
      </section>
      <section id="collapse">
        <h2>折叠面板</h2>
        <div class="demo" data-demo="collapse-0"><Errored fallback={(err: () => unknown) => { console.error("演示 collapse-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CollapseDemo0 /></Errored></div>
      </section>
      <section id="scrollarea">
        <h2>滚动区域</h2>
        <div class="demo" data-demo="scrollarea-0"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaDemo0 /></Errored></div>
        <div class="demo" data-demo="scrollarea-1"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaDemo1 /></Errored></div>
        <div class="demo" data-demo="scrollarea-2"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-2 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaDemo2 /></Errored></div>
        <div class="demo" data-demo="scrollarea-3"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-3 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaDemo3 /></Errored></div>
        <div class="demo" data-demo="scrollarea-4"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-4 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaDemo4 /></Errored></div>
        <div class="demo" data-demo="scrollarea-5"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-5 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaDemo5 /></Errored></div>
        <div class="demo" data-demo="scrollarea-6"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-6 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaDemo6 /></Errored></div>
      </section>
      <section id="vlist">
        <h2>无限列表</h2>
        <div class="demo" data-demo="vlist-0"><Errored fallback={(err: () => unknown) => { console.error("演示 vlist-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><VlistDemo0 /></Errored></div>
      </section>
      <section id="chat">
        <h2>聊天与 AI 对话</h2>
        <div class="demo" data-demo="chat-0"><Errored fallback={(err: () => unknown) => { console.error("演示 chat-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChatDemo0 /></Errored></div>
        <div class="demo" data-demo="chat-1"><Errored fallback={(err: () => unknown) => { console.error("演示 chat-1 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChatDemo1 /></Errored></div>
      </section>
      <section id="md">
        <h2>Markdown 文档</h2>
        <div class="demo" data-demo="md-0"><Errored fallback={(err: () => unknown) => { console.error("演示 md-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MdDemo0 /></Errored></div>
      </section>
      <section id="editorial">
        <h2>图文编排与内容张力</h2>
        <div class="demo" data-demo="editorial-0"><Errored fallback={(err: () => unknown) => { console.error("演示 editorial-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EditorialDemo0 /></Errored></div>
      </section>
      <section id="flow">
        <h2>流程图</h2>
        <div class="demo" data-demo="flow-0"><Errored fallback={(err: () => unknown) => { console.error("演示 flow-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FlowDemo0 /></Errored></div>
      </section>
      <section id="image">
        <h2>图片</h2>
        <div class="demo" data-demo="image-0"><Errored fallback={(err: () => unknown) => { console.error("演示 image-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ImageDemo0 /></Errored></div>
      </section>
      <section id="media">
        <h2>视频与音频</h2>
        <div class="demo" data-demo="media-0"><Errored fallback={(err: () => unknown) => { console.error("演示 media-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MediaDemo0 /></Errored></div>
      </section>
      <section id="upload">
        <h2>上传</h2>
        <div class="demo" data-demo="upload-0"><Errored fallback={(err: () => unknown) => { console.error("演示 upload-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><UploadDemo0 /></Errored></div>
      </section>
      <section id="sidebar">
        <h2>侧栏与布局</h2>
        <div class="demo" data-demo="sidebar-0"><Errored fallback={(err: () => unknown) => { console.error("演示 sidebar-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SidebarDemo0 /></Errored></div>
      </section>
      <section id="tabs">
        <h2>标签页、分页、步骤</h2>
        <div class="demo" data-demo="tabs-0"><Errored fallback={(err: () => unknown) => { console.error("演示 tabs-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TabsDemo0 /></Errored></div>
      </section>
      <section id="reorder">
        <h2>拖拽重排</h2>
        <div class="demo" data-demo="reorder-0"><Errored fallback={(err: () => unknown) => { console.error("演示 reorder-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ReorderDemo0 /></Errored></div>
      </section>
      <section id="addremove">
        <h2>新增与删除</h2>
        <div class="demo" data-demo="addremove-0"><Errored fallback={(err: () => unknown) => { console.error("演示 addremove-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AddremoveDemo0 /></Errored></div>
      </section>
      <section id="optimistic">
        <h2>乐观更新</h2>
        <div class="demo" data-demo="optimistic-0"><Errored fallback={(err: () => unknown) => { console.error("演示 optimistic-0 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OptimisticDemo0 /></Errored></div>
      </section>
      <section id="addremove">
        <h2>新增与删除</h2>
        <div class="demo" data-demo="addremove-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 addremove-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AddremoveBasic /></Errored></div>
        <div class="demo" data-demo="addremove-undo"><Errored fallback={(err: () => unknown) => { console.error("演示 addremove-undo 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AddremoveUndo /></Errored></div>
        <div class="demo" data-demo="addremove-rows"><Errored fallback={(err: () => unknown) => { console.error("演示 addremove-rows 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AddremoveRows /></Errored></div>
      </section>
      <section id="avatar">
        <h2>头像</h2>
        <div class="demo" data-demo="avatar-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 avatar-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AvatarBasic /></Errored></div>
        <div class="demo" data-demo="avatar-list"><Errored fallback={(err: () => unknown) => { console.error("演示 avatar-list 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><AvatarList /></Errored></div>
      </section>
      <section id="banner">
        <h2>横幅与条目上的失败</h2>
        <div class="demo" data-demo="banner-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 banner-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><BannerBasic /></Errored></div>
        <div class="demo" data-demo="banner-dismiss"><Errored fallback={(err: () => unknown) => { console.error("演示 banner-dismiss 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><BannerDismiss /></Errored></div>
        <div class="demo" data-demo="banner-error"><Errored fallback={(err: () => unknown) => { console.error("演示 banner-error 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><BannerError /></Errored></div>
      </section>
      <section id="button">
        <h2>按钮</h2>
        <div class="demo" data-demo="button-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 button-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonBasic /></Errored></div>
        <div class="demo" data-demo="button-variants"><Errored fallback={(err: () => unknown) => { console.error("演示 button-variants 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonVariants /></Errored></div>
        <div class="demo" data-demo="button-sizes"><Errored fallback={(err: () => unknown) => { console.error("演示 button-sizes 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonSizes /></Errored></div>
        <div class="demo" data-demo="button-icons"><Errored fallback={(err: () => unknown) => { console.error("演示 button-icons 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonIcons /></Errored></div>
        <div class="demo" data-demo="button-states"><Errored fallback={(err: () => unknown) => { console.error("演示 button-states 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonStates /></Errored></div>
        <div class="demo" data-demo="button-busy"><Errored fallback={(err: () => unknown) => { console.error("演示 button-busy 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonBusy /></Errored></div>
        <div class="demo" data-demo="button-actions"><Errored fallback={(err: () => unknown) => { console.error("演示 button-actions 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonActions /></Errored></div>
        <div class="demo" data-demo="button-mobile"><Errored fallback={(err: () => unknown) => { console.error("演示 button-mobile 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ButtonMobile /></Errored></div>
      </section>
      <section id="card">
        <h2>卡片</h2>
        <div class="demo" data-demo="card-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 card-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CardBasic /></Errored></div>
        <div class="demo" data-demo="card-grid"><Errored fallback={(err: () => unknown) => { console.error("演示 card-grid 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CardGrid /></Errored></div>
        <div class="demo" data-demo="card-variants"><Errored fallback={(err: () => unknown) => { console.error("演示 card-variants 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CardVariants /></Errored></div>
        <div class="demo" data-demo="card-layouts"><Errored fallback={(err: () => unknown) => { console.error("演示 card-layouts 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CardLayouts /></Errored></div>
        <div class="demo" data-demo="card-content"><Errored fallback={(err: () => unknown) => { console.error("演示 card-content 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CardContent /></Errored></div>
        <div class="demo" data-demo="card-select"><Errored fallback={(err: () => unknown) => { console.error("演示 card-select 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CardSelect /></Errored></div>
      </section>
      <section id="cgrid">
        <h2>Canvas 表格</h2>
        <div class="demo" data-demo="cgrid-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 cgrid-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CgridBasic /></Errored></div>
        <div class="demo" data-demo="cgrid-million"><Errored fallback={(err: () => unknown) => { console.error("演示 cgrid-million 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CgridMillion /></Errored></div>
        <div class="demo" data-demo="cgrid-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 cgrid-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CgridControlled /></Errored></div>
        <div class="demo" data-demo="cgrid-events"><Errored fallback={(err: () => unknown) => { console.error("演示 cgrid-events 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CgridEvents /></Errored></div>
      </section>
      <section id="chat">
        <h2>聊天与 AI 对话</h2>
        <div class="demo" data-demo="chat-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 chat-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChatBasic /></Errored></div>
        <div class="demo" data-demo="chat-new"><Errored fallback={(err: () => unknown) => { console.error("演示 chat-new 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChatNew /></Errored></div>
        <div class="demo" data-demo="chat-history"><Errored fallback={(err: () => unknown) => { console.error("演示 chat-history 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChatHistory /></Errored></div>
        <div class="demo" data-demo="chat-rich"><Errored fallback={(err: () => unknown) => { console.error("演示 chat-rich 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChatRich /></Errored></div>
      </section>
      <section id="chip">
        <h2>切换芯片</h2>
        <div class="demo" data-demo="chip-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 chip-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChipBasic /></Errored></div>
        <div class="demo" data-demo="chip-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 chip-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChipControlled /></Errored></div>
        <div class="demo" data-demo="chip-removable"><Errored fallback={(err: () => unknown) => { console.error("演示 chip-removable 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChipRemovable /></Errored></div>
      </section>
      <section id="choice">
        <h2>复选、单选、开关</h2>
        <div class="demo" data-demo="choice-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 choice-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChoiceBasic /></Errored></div>
        <div class="demo" data-demo="choice-radio"><Errored fallback={(err: () => unknown) => { console.error("演示 choice-radio 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChoiceRadio /></Errored></div>
        <div class="demo" data-demo="choice-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 choice-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ChoiceControlled /></Errored></div>
      </section>
      <section id="cmdk">
        <h2>命令面板</h2>
        <div class="demo" data-demo="cmdk-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 cmdk-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CmdkBasic /></Errored></div>
        <div class="demo" data-demo="cmdk-empty"><Errored fallback={(err: () => unknown) => { console.error("演示 cmdk-empty 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CmdkEmpty /></Errored></div>
        <div class="demo" data-demo="cmdk-hotkey"><Errored fallback={(err: () => unknown) => { console.error("演示 cmdk-hotkey 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CmdkHotkey /></Errored></div>
      </section>
      <section id="collapse">
        <h2>折叠面板</h2>
        <div class="demo" data-demo="collapse-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 collapse-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CollapseBasic /></Errored></div>
        <div class="demo" data-demo="collapse-single"><Errored fallback={(err: () => unknown) => { console.error("演示 collapse-single 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CollapseSingle /></Errored></div>
        <div class="demo" data-demo="collapse-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 collapse-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CollapseControlled /></Errored></div>
      </section>
      <section id="compound">
        <h2>组合按钮</h2>
        <div class="demo" data-demo="compound-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 compound-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CompoundBasic /></Errored></div>
        <div class="demo" data-demo="compound-split"><Errored fallback={(err: () => unknown) => { console.error("演示 compound-split 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CompoundSplit /></Errored></div>
        <div class="demo" data-demo="compound-copy"><Errored fallback={(err: () => unknown) => { console.error("演示 compound-copy 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CompoundCopy /></Errored></div>
      </section>
      <section id="count">
        <h2>字数统计</h2>
        <div class="demo" data-demo="count-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 count-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CountBasic /></Errored></div>
        <div class="demo" data-demo="count-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 count-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CountControlled /></Errored></div>
        <div class="demo" data-demo="count-longtext"><Errored fallback={(err: () => unknown) => { console.error("演示 count-longtext 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CountLongtext /></Errored></div>
      </section>
      <section id="ctxmenu">
        <h2>右键菜单与子菜单</h2>
        <div class="demo" data-demo="ctxmenu-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 ctxmenu-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CtxmenuBasic /></Errored></div>
        <div class="demo" data-demo="ctxmenu-context"><Errored fallback={(err: () => unknown) => { console.error("演示 ctxmenu-context 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CtxmenuContext /></Errored></div>
        <div class="demo" data-demo="ctxmenu-submenu"><Errored fallback={(err: () => unknown) => { console.error("演示 ctxmenu-submenu 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><CtxmenuSubmenu /></Errored></div>
      </section>
      <section id="dialog">
        <h2>弹窗</h2>
        <div class="demo" data-demo="dialog-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 dialog-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DialogBasic /></Errored></div>
        <div class="demo" data-demo="dialog-danger"><Errored fallback={(err: () => unknown) => { console.error("演示 dialog-danger 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DialogDanger /></Errored></div>
        <div class="demo" data-demo="dialog-guard"><Errored fallback={(err: () => unknown) => { console.error("演示 dialog-guard 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DialogGuard /></Errored></div>
        <div class="demo" data-demo="dialog-events"><Errored fallback={(err: () => unknown) => { console.error("演示 dialog-events 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DialogEvents /></Errored></div>
        <div class="demo" data-demo="dialog-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 dialog-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DialogControlled /></Errored></div>
      </section>
      <section id="drawer">
        <h2>抽屉</h2>
        <div class="demo" data-demo="drawer-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 drawer-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DrawerBasic /></Errored></div>
        <div class="demo" data-demo="drawer-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 drawer-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DrawerControlled /></Errored></div>
        <div class="demo" data-demo="drawer-footer"><Errored fallback={(err: () => unknown) => { console.error("演示 drawer-footer 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><DrawerFooter /></Errored></div>
      </section>
      <section id="editorial">
        <h2>图文编排与内容张力</h2>
        <div class="demo" data-demo="editorial-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 editorial-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EditorialBasic /></Errored></div>
        <div class="demo" data-demo="editorial-compare"><Errored fallback={(err: () => unknown) => { console.error("演示 editorial-compare 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EditorialCompare /></Errored></div>
        <div class="demo" data-demo="editorial-hotspot"><Errored fallback={(err: () => unknown) => { console.error("演示 editorial-hotspot 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EditorialHotspot /></Errored></div>
      </section>
      <section id="empty">
        <h2>空状态</h2>
        <div class="demo" data-demo="empty-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 empty-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EmptyBasic /></Errored></div>
        <div class="demo" data-demo="empty-search"><Errored fallback={(err: () => unknown) => { console.error("演示 empty-search 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EmptySearch /></Errored></div>
        <div class="demo" data-demo="empty-error"><Errored fallback={(err: () => unknown) => { console.error("演示 empty-error 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EmptyError /></Errored></div>
        <div class="demo" data-demo="empty-presets"><Errored fallback={(err: () => unknown) => { console.error("演示 empty-presets 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><EmptyPresets /></Errored></div>
      </section>
      <section id="field">
        <h2>字段与错误</h2>
        <div class="demo" data-demo="field-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 field-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FieldBasic /></Errored></div>
        <div class="demo" data-demo="field-error"><Errored fallback={(err: () => unknown) => { console.error("演示 field-error 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FieldError /></Errored></div>
        <div class="demo" data-demo="field-optional"><Errored fallback={(err: () => unknown) => { console.error("演示 field-optional 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FieldOptional /></Errored></div>
      </section>
      <section id="flow">
        <h2>流程图</h2>
        <div class="demo" data-demo="flow-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 flow-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FlowBasic /></Errored></div>
        <div class="demo" data-demo="flow-branch"><Errored fallback={(err: () => unknown) => { console.error("演示 flow-branch 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FlowBranch /></Errored></div>
        <div class="demo" data-demo="flow-tidy"><Errored fallback={(err: () => unknown) => { console.error("演示 flow-tidy 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FlowTidy /></Errored></div>
      </section>
      <section id="flowstress">
        <h2>万级节点压测</h2>
        <div class="demo" data-demo="flowstress-many"><Errored fallback={(err: () => unknown) => { console.error("演示 flowstress-many 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><FlowstressMany /></Errored></div>
      </section>
      <section id="grid">
        <h2>数据表格</h2>
        <div class="demo" data-demo="grid-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 grid-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><GridBasic /></Errored></div>
        <div class="demo" data-demo="grid-sort"><Errored fallback={(err: () => unknown) => { console.error("演示 grid-sort 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><GridSort /></Errored></div>
        <div class="demo" data-demo="grid-select"><Errored fallback={(err: () => unknown) => { console.error("演示 grid-select 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><GridSelect /></Errored></div>
        <div class="demo" data-demo="grid-render"><Errored fallback={(err: () => unknown) => { console.error("演示 grid-render 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><GridRender /></Errored></div>
        <div class="demo" data-demo="grid-remote"><Errored fallback={(err: () => unknown) => { console.error("演示 grid-remote 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><GridRemote /></Errored></div>
        <div class="demo" data-demo="grid-edit"><Errored fallback={(err: () => unknown) => { console.error("演示 grid-edit 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><GridEdit /></Errored></div>
        <div class="demo" data-demo="grid-states"><Errored fallback={(err: () => unknown) => { console.error("演示 grid-states 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><GridStates /></Errored></div>
      </section>
      <section id="iconbutton">
        <h2>纯图标按钮</h2>
        <div class="demo" data-demo="iconbutton-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 iconbutton-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><IconbuttonBasic /></Errored></div>
        <div class="demo" data-demo="iconbutton-variants"><Errored fallback={(err: () => unknown) => { console.error("演示 iconbutton-variants 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><IconbuttonVariants /></Errored></div>
        <div class="demo" data-demo="iconbutton-states"><Errored fallback={(err: () => unknown) => { console.error("演示 iconbutton-states 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><IconbuttonStates /></Errored></div>
        <div class="demo" data-demo="iconbutton-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 iconbutton-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><IconbuttonControlled /></Errored></div>
      </section>
      <section id="image">
        <h2>图片</h2>
        <div class="demo" data-demo="image-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 image-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ImageBasic /></Errored></div>
        <div class="demo" data-demo="image-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 image-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ImageControlled /></Errored></div>
        <div class="demo" data-demo="image-failed"><Errored fallback={(err: () => unknown) => { console.error("演示 image-failed 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ImageFailed /></Errored></div>
      </section>
      <section id="input">
        <h2>输入框</h2>
        <div class="demo" data-demo="input-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 input-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><InputBasic /></Errored></div>
        <div class="demo" data-demo="input-sizes"><Errored fallback={(err: () => unknown) => { console.error("演示 input-sizes 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><InputSizes /></Errored></div>
        <div class="demo" data-demo="input-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 input-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><InputControlled /></Errored></div>
      </section>
      <section id="link">
        <h2>文字链接</h2>
        <div class="demo" data-demo="link-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 link-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LinkBasic /></Errored></div>
        <div class="demo" data-demo="link-textbtn"><Errored fallback={(err: () => unknown) => { console.error("演示 link-textbtn 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LinkTextbtn /></Errored></div>
        <div class="demo" data-demo="link-arrow"><Errored fallback={(err: () => unknown) => { console.error("演示 link-arrow 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LinkArrow /></Errored></div>
      </section>
      <section id="list">
        <h2>列表与键值</h2>
        <div class="demo" data-demo="list-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 list-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ListBasic /></Errored></div>
        <div class="demo" data-demo="list-kv"><Errored fallback={(err: () => unknown) => { console.error("演示 list-kv 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ListKv /></Errored></div>
        <div class="demo" data-demo="list-switch"><Errored fallback={(err: () => unknown) => { console.error("演示 list-switch 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ListSwitch /></Errored></div>
      </section>
      <section id="loading">
        <h2>骨架与加载</h2>
        <div class="demo" data-demo="loading-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 loading-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LoadingBasic /></Errored></div>
        <div class="demo" data-demo="loading-list"><Errored fallback={(err: () => unknown) => { console.error("演示 loading-list 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LoadingList /></Errored></div>
        <div class="demo" data-demo="loading-quiet"><Errored fallback={(err: () => unknown) => { console.error("演示 loading-quiet 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><LoadingQuiet /></Errored></div>
      </section>
      <section id="md">
        <h2>Markdown 文档</h2>
        <div class="demo" data-demo="md-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 md-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MdBasic /></Errored></div>
        <div class="demo" data-demo="md-stream"><Errored fallback={(err: () => unknown) => { console.error("演示 md-stream 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MdStream /></Errored></div>
        <div class="demo" data-demo="md-heights"><Errored fallback={(err: () => unknown) => { console.error("演示 md-heights 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MdHeights /></Errored></div>
      </section>
      <section id="media">
        <h2>视频与音频</h2>
        <div class="demo" data-demo="media-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 media-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MediaBasic /></Errored></div>
        <div class="demo" data-demo="media-audio"><Errored fallback={(err: () => unknown) => { console.error("演示 media-audio 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MediaAudio /></Errored></div>
        <div class="demo" data-demo="media-methods"><Errored fallback={(err: () => unknown) => { console.error("演示 media-methods 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><MediaMethods /></Errored></div>
      </section>
      <section id="notify">
        <h2>通知</h2>
        <div class="demo" data-demo="notify-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 notify-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NotifyBasic /></Errored></div>
        <div class="demo" data-demo="notify-actions"><Errored fallback={(err: () => unknown) => { console.error("演示 notify-actions 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NotifyActions /></Errored></div>
        <div class="demo" data-demo="notify-fail"><Errored fallback={(err: () => unknown) => { console.error("演示 notify-fail 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NotifyFail /></Errored></div>
      </section>
      <section id="number">
        <h2>数字步进</h2>
        <div class="demo" data-demo="number-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 number-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NumberBasic /></Errored></div>
        <div class="demo" data-demo="number-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 number-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NumberControlled /></Errored></div>
        <div class="demo" data-demo="number-range"><Errored fallback={(err: () => unknown) => { console.error("演示 number-range 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NumberRange /></Errored></div>
      </section>
      <section id="numflow">
        <h2>数字变化</h2>
        <div class="demo" data-demo="numflow-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 numflow-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NumflowBasic /></Errored></div>
        <div class="demo" data-demo="numflow-counter"><Errored fallback={(err: () => unknown) => { console.error("演示 numflow-counter 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NumflowCounter /></Errored></div>
        <div class="demo" data-demo="numflow-styles"><Errored fallback={(err: () => unknown) => { console.error("演示 numflow-styles 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><NumflowStyles /></Errored></div>
      </section>
      <section id="optimistic">
        <h2>乐观更新</h2>
        <div class="demo" data-demo="optimistic-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 optimistic-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OptimisticBasic /></Errored></div>
        <div class="demo" data-demo="optimistic-switch"><Errored fallback={(err: () => unknown) => { console.error("演示 optimistic-switch 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OptimisticSwitch /></Errored></div>
        <div class="demo" data-demo="optimistic-pending"><Errored fallback={(err: () => unknown) => { console.error("演示 optimistic-pending 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OptimisticPending /></Errored></div>
      </section>
      <section id="otp">
        <h2>验证码</h2>
        <div class="demo" data-demo="otp-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 otp-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OtpBasic /></Errored></div>
        <div class="demo" data-demo="otp-complete"><Errored fallback={(err: () => unknown) => { console.error("演示 otp-complete 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OtpComplete /></Errored></div>
        <div class="demo" data-demo="otp-length"><Errored fallback={(err: () => unknown) => { console.error("演示 otp-length 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OtpLength /></Errored></div>
        <div class="demo" data-demo="otp-mask"><Errored fallback={(err: () => unknown) => { console.error("演示 otp-mask 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><OtpMask /></Errored></div>
      </section>
      <section id="picker">
        <h2>日期、时间、地址</h2>
        <div class="demo" data-demo="picker-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 picker-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PickerBasic /></Errored></div>
        <div class="demo" data-demo="picker-range"><Errored fallback={(err: () => unknown) => { console.error("演示 picker-range 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PickerRange /></Errored></div>
        <div class="demo" data-demo="picker-time"><Errored fallback={(err: () => unknown) => { console.error("演示 picker-time 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PickerTime /></Errored></div>
        <div class="demo" data-demo="picker-datetime"><Errored fallback={(err: () => unknown) => { console.error("演示 picker-datetime 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PickerDatetime /></Errored></div>
        <div class="demo" data-demo="picker-region"><Errored fallback={(err: () => unknown) => { console.error("演示 picker-region 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PickerRegion /></Errored></div>
        <div class="demo" data-demo="picker-events"><Errored fallback={(err: () => unknown) => { console.error("演示 picker-events 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PickerEvents /></Errored></div>
      </section>
      <section id="popconfirm">
        <h2>气泡确认</h2>
        <div class="demo" data-demo="popconfirm-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 popconfirm-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PopconfirmBasic /></Errored></div>
        <div class="demo" data-demo="popconfirm-undo"><Errored fallback={(err: () => unknown) => { console.error("演示 popconfirm-undo 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PopconfirmUndo /></Errored></div>
        <div class="demo" data-demo="popconfirm-submit"><Errored fallback={(err: () => unknown) => { console.error("演示 popconfirm-submit 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PopconfirmSubmit /></Errored></div>
      </section>
      <section id="popover">
        <h2>弹出面板</h2>
        <div class="demo" data-demo="popover-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 popover-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PopoverBasic /></Errored></div>
        <div class="demo" data-demo="popover-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 popover-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PopoverControlled /></Errored></div>
        <div class="demo" data-demo="popover-align"><Errored fallback={(err: () => unknown) => { console.error("演示 popover-align 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PopoverAlign /></Errored></div>
      </section>
      <section id="progress">
        <h2>进度</h2>
        <div class="demo" data-demo="progress-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 progress-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ProgressBasic /></Errored></div>
        <div class="demo" data-demo="progress-ring"><Errored fallback={(err: () => unknown) => { console.error("演示 progress-ring 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ProgressRing /></Errored></div>
        <div class="demo" data-demo="progress-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 progress-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ProgressControlled /></Errored></div>
      </section>
      <section id="prompt">
        <h2>提示词输入框</h2>
        <div class="demo" data-demo="prompt-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 prompt-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PromptBasic /></Errored></div>
        <div class="demo" data-demo="prompt-stop"><Errored fallback={(err: () => unknown) => { console.error("演示 prompt-stop 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PromptStop /></Errored></div>
        <div class="demo" data-demo="prompt-upload"><Errored fallback={(err: () => unknown) => { console.error("演示 prompt-upload 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PromptUpload /></Errored></div>
        <div class="demo" data-demo="prompt-parts"><Errored fallback={(err: () => unknown) => { console.error("演示 prompt-parts 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><PromptParts /></Errored></div>
      </section>
      <section id="reorder">
        <h2>拖拽重排</h2>
        <div class="demo" data-demo="reorder-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 reorder-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ReorderBasic /></Errored></div>
        <div class="demo" data-demo="reorder-order"><Errored fallback={(err: () => unknown) => { console.error("演示 reorder-order 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ReorderOrder /></Errored></div>
        <div class="demo" data-demo="reorder-save"><Errored fallback={(err: () => unknown) => { console.error("演示 reorder-save 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ReorderSave /></Errored></div>
      </section>
      <section id="scrollarea">
        <h2>滚动区域</h2>
        <div class="demo" data-demo="scrollarea-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaBasic /></Errored></div>
        <div class="demo" data-demo="scrollarea-bar"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-bar 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaBar /></Errored></div>
        <div class="demo" data-demo="scrollarea-none"><Errored fallback={(err: () => unknown) => { console.error("演示 scrollarea-none 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ScrollareaNone /></Errored></div>
      </section>
      <section id="segmented">
        <h2>分段控件</h2>
        <div class="demo" data-demo="segmented-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 segmented-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SegmentedBasic /></Errored></div>
        <div class="demo" data-demo="segmented-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 segmented-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SegmentedControlled /></Errored></div>
        <div class="demo" data-demo="segmented-sizes"><Errored fallback={(err: () => unknown) => { console.error("演示 segmented-sizes 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SegmentedSizes /></Errored></div>
      </section>
      <section id="select">
        <h2>下拉选择与菜单</h2>
        <div class="demo" data-demo="select-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 select-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SelectBasic /></Errored></div>
        <div class="demo" data-demo="select-placeholder"><Errored fallback={(err: () => unknown) => { console.error("演示 select-placeholder 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SelectPlaceholder /></Errored></div>
        <div class="demo" data-demo="select-options"><Errored fallback={(err: () => unknown) => { console.error("演示 select-options 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SelectOptions /></Errored></div>
        <div class="demo" data-demo="select-field"><Errored fallback={(err: () => unknown) => { console.error("演示 select-field 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SelectField /></Errored></div>
        <div class="demo" data-demo="select-events"><Errored fallback={(err: () => unknown) => { console.error("演示 select-events 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SelectEvents /></Errored></div>
        <div class="demo" data-demo="select-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 select-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SelectControlled /></Errored></div>
        <div class="demo" data-demo="select-menu"><Errored fallback={(err: () => unknown) => { console.error("演示 select-menu 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SelectMenu /></Errored></div>
      </section>
      <section id="sidebar">
        <h2>侧栏与布局</h2>
        <div class="demo" data-demo="sidebar-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 sidebar-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SidebarBasic /></Errored></div>
        <div class="demo" data-demo="sidebar-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 sidebar-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SidebarControlled /></Errored></div>
        <div class="demo" data-demo="sidebar-fx"><Errored fallback={(err: () => unknown) => { console.error("演示 sidebar-fx 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SidebarFx /></Errored></div>
      </section>
      <section id="slider">
        <h2>滑块</h2>
        <div class="demo" data-demo="slider-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 slider-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SliderBasic /></Errored></div>
        <div class="demo" data-demo="slider-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 slider-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SliderControlled /></Errored></div>
        <div class="demo" data-demo="slider-max"><Errored fallback={(err: () => unknown) => { console.error("演示 slider-max 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SliderMax /></Errored></div>
      </section>
      <section id="special">
        <h2>搜索、密码、邮箱</h2>
        <div class="demo" data-demo="special-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 special-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpecialBasic /></Errored></div>
        <div class="demo" data-demo="special-password"><Errored fallback={(err: () => unknown) => { console.error("演示 special-password 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpecialPassword /></Errored></div>
        <div class="demo" data-demo="special-email"><Errored fallback={(err: () => unknown) => { console.error("演示 special-email 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><SpecialEmail /></Errored></div>
      </section>
      <section id="table">
        <h2>表格</h2>
        <div class="demo" data-demo="table-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 table-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableBasic /></Errored></div>
        <div class="demo" data-demo="table-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 table-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableControlled /></Errored></div>
        <div class="demo" data-demo="table-states"><Errored fallback={(err: () => unknown) => { console.error("演示 table-states 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableStates /></Errored></div>
        <div class="demo" data-demo="table-tree"><Errored fallback={(err: () => unknown) => { console.error("演示 table-tree 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableTree /></Errored></div>
        <div class="demo" data-demo="table-merge"><Errored fallback={(err: () => unknown) => { console.error("演示 table-merge 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableMerge /></Errored></div>
        <div class="demo" data-demo="table-drag"><Errored fallback={(err: () => unknown) => { console.error("演示 table-drag 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TableDrag /></Errored></div>
      </section>
      <section id="tabs">
        <h2>标签页、分页、步骤</h2>
        <div class="demo" data-demo="tabs-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 tabs-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TabsBasic /></Errored></div>
        <div class="demo" data-demo="tabs-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 tabs-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TabsControlled /></Errored></div>
        <div class="demo" data-demo="tabs-pager"><Errored fallback={(err: () => unknown) => { console.error("演示 tabs-pager 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TabsPager /></Errored></div>
        <div class="demo" data-demo="tabs-steps"><Errored fallback={(err: () => unknown) => { console.error("演示 tabs-steps 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TabsSteps /></Errored></div>
      </section>
      <section id="taginput">
        <h2>标签输入</h2>
        <div class="demo" data-demo="taginput-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 taginput-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TaginputBasic /></Errored></div>
        <div class="demo" data-demo="taginput-controlled"><Errored fallback={(err: () => unknown) => { console.error("演示 taginput-controlled 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TaginputControlled /></Errored></div>
        <div class="demo" data-demo="taginput-hint"><Errored fallback={(err: () => unknown) => { console.error("演示 taginput-hint 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TaginputHint /></Errored></div>
      </section>
      <section id="tags">
        <h2>标签、徽标与头像</h2>
        <div class="demo" data-demo="tags-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 tags-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TagsBasic /></Errored></div>
        <div class="demo" data-demo="tags-badge"><Errored fallback={(err: () => unknown) => { console.error("演示 tags-badge 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TagsBadge /></Errored></div>
        <div class="demo" data-demo="tags-avatar"><Errored fallback={(err: () => unknown) => { console.error("演示 tags-avatar 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TagsAvatar /></Errored></div>
      </section>
      <section id="toast">
        <h2>轻提示</h2>
        <div class="demo" data-demo="toast-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 toast-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ToastBasic /></Errored></div>
        <div class="demo" data-demo="toast-action"><Errored fallback={(err: () => unknown) => { console.error("演示 toast-action 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ToastAction /></Errored></div>
        <div class="demo" data-demo="toast-progress"><Errored fallback={(err: () => unknown) => { console.error("演示 toast-progress 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><ToastProgress /></Errored></div>
      </section>
      <section id="tooltip">
        <h2>文字提示</h2>
        <div class="demo" data-demo="tooltip-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 tooltip-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TooltipBasic /></Errored></div>
        <div class="demo" data-demo="tooltip-kbd"><Errored fallback={(err: () => unknown) => { console.error("演示 tooltip-kbd 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TooltipKbd /></Errored></div>
        <div class="demo" data-demo="tooltip-truncate"><Errored fallback={(err: () => unknown) => { console.error("演示 tooltip-truncate 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><TooltipTruncate /></Errored></div>
      </section>
      <section id="upload">
        <h2>上传</h2>
        <div class="demo" data-demo="upload-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 upload-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><UploadBasic /></Errored></div>
        <div class="demo" data-demo="upload-real"><Errored fallback={(err: () => unknown) => { console.error("演示 upload-real 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><UploadReal /></Errored></div>
        <div class="demo" data-demo="upload-single"><Errored fallback={(err: () => unknown) => { console.error("演示 upload-single 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><UploadSingle /></Errored></div>
      </section>
      <section id="vlist">
        <h2>无限列表</h2>
        <div class="demo" data-demo="vlist-basic"><Errored fallback={(err: () => unknown) => { console.error("演示 vlist-basic 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><VlistBasic /></Errored></div>
        <div class="demo" data-demo="vlist-total"><Errored fallback={(err: () => unknown) => { console.error("演示 vlist-total 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><VlistTotal /></Errored></div>
        <div class="demo" data-demo="vlist-retry"><Errored fallback={(err: () => unknown) => { console.error("演示 vlist-retry 出错：", err()); return <p class="demo-err">演示出错：{String((err() as Error)?.message ?? err())}</p>; }}><VlistRetry /></Errored></div>
      </section>
    </main>
  );
}
setup(); defineElements(); // 应用入口调一次
render(Gallery, document.getElementById("app")!);
