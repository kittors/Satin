// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
import "../../../shared/gallery.css";
import Guard from "./guard";
import ColorDemo0 from "../demos/color-0";
import TypeDemo0 from "../demos/type-0";
import TypeDemo1 from "../demos/type-1";
import TypeDemo2 from "../demos/type-2";
import SpacingDemo0 from "../demos/spacing-0";
import SpacingDemo1 from "../demos/spacing-1";
import SpacingDemo2 from "../demos/spacing-2";
import SpacingDemo3 from "../demos/spacing-3";
import LayoutDemo0 from "../demos/layout-0";
import LayoutDemo1 from "../demos/layout-1";
import SpaceDemo0 from "../demos/space-0";
import SpaceDemo1 from "../demos/space-1";
import SpaceDemo2 from "../demos/space-2";
import ElevationDemo0 from "../demos/elevation-0";
import MotionDemo0 from "../demos/motion-0";
import LoadingmotionDemo0 from "../demos/loadingmotion-0";
import IconsDemo0 from "../demos/icons-0";
import IconsDemo1 from "../demos/icons-1";
import FeelDemo0 from "../demos/feel-0";
import ButtonDemo0 from "../demos/button-0";
import ButtonDemo1 from "../demos/button-1";
import ButtonDemo2 from "../demos/button-2";
import ButtonDemo3 from "../demos/button-3";
import IconbuttonDemo0 from "../demos/iconbutton-0";
import LinkDemo0 from "../demos/link-0";
import CompoundDemo0 from "../demos/compound-0";
import ChipDemo0 from "../demos/chip-0";
import FieldDemo0 from "../demos/field-0";
import InputDemo0 from "../demos/input-0";
import InputDemo1 from "../demos/input-1";
import InputDemo2 from "../demos/input-2";
import SpecialDemo0 from "../demos/special-0";
import CountDemo0 from "../demos/count-0";
import TaginputDemo0 from "../demos/taginput-0";
import NumberDemo0 from "../demos/number-0";
import PromptDemo0 from "../demos/prompt-0";
import SelectDemo0 from "../demos/select-0";
import PickerDemo0 from "../demos/picker-0";
import ChoiceDemo0 from "../demos/choice-0";
import SegmentedDemo0 from "../demos/segmented-0";
import SliderDemo0 from "../demos/slider-0";
import OtpDemo0 from "../demos/otp-0";
import TooltipDemo0 from "../demos/tooltip-0";
import PopoverDemo0 from "../demos/popover-0";
import PopconfirmDemo0 from "../demos/popconfirm-0";
import CtxmenuDemo0 from "../demos/ctxmenu-0";
import DialogDemo0 from "../demos/dialog-0";
import DrawerDemo0 from "../demos/drawer-0";
import CmdkDemo0 from "../demos/cmdk-0";
import ToastDemo0 from "../demos/toast-0";
import NotifyDemo0 from "../demos/notify-0";
import BannerDemo0 from "../demos/banner-0";
import EmptyDemo0 from "../demos/empty-0";
import LoadingDemo0 from "../demos/loading-0";
import LoadingDemo1 from "../demos/loading-1";
import ProgressDemo0 from "../demos/progress-0";
import NumflowDemo0 from "../demos/numflow-0";
import TableDemo0 from "../demos/table-0";
import TableDemo1 from "../demos/table-1";
import TableDemo2 from "../demos/table-2";
import TableDemo3 from "../demos/table-3";
import TableDemo4 from "../demos/table-4";
import TableDemo5 from "../demos/table-5";
import TableDemo6 from "../demos/table-6";
import TableDemo7 from "../demos/table-7";
import GridDemo0 from "../demos/grid-0";
import CgridDemo0 from "../demos/cgrid-0";
import ChartsDemo0 from "../demos/charts-0";
import ChartsDemo1 from "../demos/charts-1";
import ChartsDemo2 from "../demos/charts-2";
import ChartsDemo3 from "../demos/charts-3";
import ListDemo0 from "../demos/list-0";
import CardDemo0 from "../demos/card-0";
import TagsDemo0 from "../demos/tags-0";
import AvatarDemo0 from "../demos/avatar-0";
import AvatarDemo1 from "../demos/avatar-1";
import AvatarDemo2 from "../demos/avatar-2";
import CollapseDemo0 from "../demos/collapse-0";
import ScrollareaDemo0 from "../demos/scrollarea-0";
import ScrollareaDemo1 from "../demos/scrollarea-1";
import ScrollareaDemo2 from "../demos/scrollarea-2";
import ScrollareaDemo3 from "../demos/scrollarea-3";
import ScrollareaDemo4 from "../demos/scrollarea-4";
import ScrollareaDemo5 from "../demos/scrollarea-5";
import ScrollareaDemo6 from "../demos/scrollarea-6";
import VlistDemo0 from "../demos/vlist-0";
import ChatDemo0 from "../demos/chat-0";
import ChatDemo1 from "../demos/chat-1";
import MdDemo0 from "../demos/md-0";
import EditorialDemo0 from "../demos/editorial-0";
import FlowDemo0 from "../demos/flow-0";
import ImageDemo0 from "../demos/image-0";
import MediaDemo0 from "../demos/media-0";
import UploadDemo0 from "../demos/upload-0";
import SidebarDemo0 from "../demos/sidebar-0";
import TabsDemo0 from "../demos/tabs-0";
import ReorderDemo0 from "../demos/reorder-0";
import AddremoveDemo0 from "../demos/addremove-0";
import OptimisticDemo0 from "../demos/optimistic-0";
import AddremoveBasic from "../demos/addremove-basic";
import AddremoveUndo from "../demos/addremove-undo";
import AddremoveRows from "../demos/addremove-rows";
import AvatarBasic from "../demos/avatar-basic";
import AvatarList from "../demos/avatar-list";
import BannerBasic from "../demos/banner-basic";
import BannerDismiss from "../demos/banner-dismiss";
import BannerError from "../demos/banner-error";
import ButtonBasic from "../demos/button-basic";
import ButtonVariants from "../demos/button-variants";
import ButtonSizes from "../demos/button-sizes";
import ButtonIcons from "../demos/button-icons";
import ButtonStates from "../demos/button-states";
import ButtonBusy from "../demos/button-busy";
import ButtonActions from "../demos/button-actions";
import ButtonMobile from "../demos/button-mobile";
import CardBasic from "../demos/card-basic";
import CardGrid from "../demos/card-grid";
import CardVariants from "../demos/card-variants";
import CardLayouts from "../demos/card-layouts";
import CardContent from "../demos/card-content";
import CardSelect from "../demos/card-select";
import CgridBasic from "../demos/cgrid-basic";
import CgridMillion from "../demos/cgrid-million";
import CgridControlled from "../demos/cgrid-controlled";
import CgridEvents from "../demos/cgrid-events";
import ChatBasic from "../demos/chat-basic";
import ChatNew from "../demos/chat-new";
import ChatHistory from "../demos/chat-history";
import ChatRich from "../demos/chat-rich";
import ChipBasic from "../demos/chip-basic";
import ChipControlled from "../demos/chip-controlled";
import ChipRemovable from "../demos/chip-removable";
import ChoiceBasic from "../demos/choice-basic";
import ChoiceRadio from "../demos/choice-radio";
import ChoiceControlled from "../demos/choice-controlled";
import CmdkBasic from "../demos/cmdk-basic";
import CmdkEmpty from "../demos/cmdk-empty";
import CmdkHotkey from "../demos/cmdk-hotkey";
import CollapseBasic from "../demos/collapse-basic";
import CollapseSingle from "../demos/collapse-single";
import CollapseControlled from "../demos/collapse-controlled";
import CompoundBasic from "../demos/compound-basic";
import CompoundSplit from "../demos/compound-split";
import CompoundCopy from "../demos/compound-copy";
import CountBasic from "../demos/count-basic";
import CountControlled from "../demos/count-controlled";
import CountLongtext from "../demos/count-longtext";
import CtxmenuBasic from "../demos/ctxmenu-basic";
import CtxmenuContext from "../demos/ctxmenu-context";
import CtxmenuSubmenu from "../demos/ctxmenu-submenu";
import DialogBasic from "../demos/dialog-basic";
import DialogDanger from "../demos/dialog-danger";
import DialogGuard from "../demos/dialog-guard";
import DialogEvents from "../demos/dialog-events";
import DialogControlled from "../demos/dialog-controlled";
import DrawerBasic from "../demos/drawer-basic";
import DrawerControlled from "../demos/drawer-controlled";
import DrawerFooter from "../demos/drawer-footer";
import EditorialBasic from "../demos/editorial-basic";
import EditorialCompare from "../demos/editorial-compare";
import EditorialHotspot from "../demos/editorial-hotspot";
import EmptyBasic from "../demos/empty-basic";
import EmptySearch from "../demos/empty-search";
import EmptyError from "../demos/empty-error";
import EmptyPresets from "../demos/empty-presets";
import FieldBasic from "../demos/field-basic";
import FieldError from "../demos/field-error";
import FieldOptional from "../demos/field-optional";
import FlowBasic from "../demos/flow-basic";
import FlowBranch from "../demos/flow-branch";
import FlowTidy from "../demos/flow-tidy";
import FlowstressMany from "../demos/flowstress-many";
import GridBasic from "../demos/grid-basic";
import GridSort from "../demos/grid-sort";
import GridSelect from "../demos/grid-select";
import GridRender from "../demos/grid-render";
import GridRemote from "../demos/grid-remote";
import GridEdit from "../demos/grid-edit";
import GridStates from "../demos/grid-states";
import IconbuttonBasic from "../demos/iconbutton-basic";
import IconbuttonVariants from "../demos/iconbutton-variants";
import IconbuttonStates from "../demos/iconbutton-states";
import IconbuttonControlled from "../demos/iconbutton-controlled";
import ImageBasic from "../demos/image-basic";
import ImageControlled from "../demos/image-controlled";
import ImageFailed from "../demos/image-failed";
import InputBasic from "../demos/input-basic";
import InputSizes from "../demos/input-sizes";
import InputControlled from "../demos/input-controlled";
import LinkBasic from "../demos/link-basic";
import LinkTextbtn from "../demos/link-textbtn";
import LinkArrow from "../demos/link-arrow";
import ListBasic from "../demos/list-basic";
import ListKv from "../demos/list-kv";
import ListSwitch from "../demos/list-switch";
import LoadingBasic from "../demos/loading-basic";
import LoadingList from "../demos/loading-list";
import LoadingQuiet from "../demos/loading-quiet";
import MdBasic from "../demos/md-basic";
import MdStream from "../demos/md-stream";
import MdHeights from "../demos/md-heights";
import MediaBasic from "../demos/media-basic";
import MediaAudio from "../demos/media-audio";
import MediaMethods from "../demos/media-methods";
import NotifyBasic from "../demos/notify-basic";
import NotifyActions from "../demos/notify-actions";
import NotifyFail from "../demos/notify-fail";
import NumberBasic from "../demos/number-basic";
import NumberControlled from "../demos/number-controlled";
import NumberRange from "../demos/number-range";
import NumflowBasic from "../demos/numflow-basic";
import NumflowCounter from "../demos/numflow-counter";
import NumflowStyles from "../demos/numflow-styles";
import OptimisticBasic from "../demos/optimistic-basic";
import OptimisticSwitch from "../demos/optimistic-switch";
import OptimisticPending from "../demos/optimistic-pending";
import OtpBasic from "../demos/otp-basic";
import OtpComplete from "../demos/otp-complete";
import OtpLength from "../demos/otp-length";
import OtpMask from "../demos/otp-mask";
import PickerBasic from "../demos/picker-basic";
import PickerRange from "../demos/picker-range";
import PickerTime from "../demos/picker-time";
import PickerDatetime from "../demos/picker-datetime";
import PickerRegion from "../demos/picker-region";
import PickerEvents from "../demos/picker-events";
import PopconfirmBasic from "../demos/popconfirm-basic";
import PopconfirmUndo from "../demos/popconfirm-undo";
import PopconfirmSubmit from "../demos/popconfirm-submit";
import PopoverBasic from "../demos/popover-basic";
import PopoverControlled from "../demos/popover-controlled";
import PopoverAlign from "../demos/popover-align";
import ProgressBasic from "../demos/progress-basic";
import ProgressRing from "../demos/progress-ring";
import ProgressControlled from "../demos/progress-controlled";
import PromptBasic from "../demos/prompt-basic";
import PromptStop from "../demos/prompt-stop";
import PromptUpload from "../demos/prompt-upload";
import PromptParts from "../demos/prompt-parts";
import ReorderBasic from "../demos/reorder-basic";
import ReorderOrder from "../demos/reorder-order";
import ReorderSave from "../demos/reorder-save";
import ScrollareaBasic from "../demos/scrollarea-basic";
import ScrollareaBar from "../demos/scrollarea-bar";
import ScrollareaNone from "../demos/scrollarea-none";
import SegmentedBasic from "../demos/segmented-basic";
import SegmentedControlled from "../demos/segmented-controlled";
import SegmentedSizes from "../demos/segmented-sizes";
import SelectBasic from "../demos/select-basic";
import SelectPlaceholder from "../demos/select-placeholder";
import SelectOptions from "../demos/select-options";
import SelectField from "../demos/select-field";
import SelectEvents from "../demos/select-events";
import SelectControlled from "../demos/select-controlled";
import SelectMenu from "../demos/select-menu";
import SidebarBasic from "../demos/sidebar-basic";
import SidebarControlled from "../demos/sidebar-controlled";
import SidebarFx from "../demos/sidebar-fx";
import SliderBasic from "../demos/slider-basic";
import SliderControlled from "../demos/slider-controlled";
import SliderMax from "../demos/slider-max";
import SpecialBasic from "../demos/special-basic";
import SpecialPassword from "../demos/special-password";
import SpecialEmail from "../demos/special-email";
import TableBasic from "../demos/table-basic";
import TableControlled from "../demos/table-controlled";
import TableStates from "../demos/table-states";
import TableTree from "../demos/table-tree";
import TableMerge from "../demos/table-merge";
import TableDrag from "../demos/table-drag";
import TabsBasic from "../demos/tabs-basic";
import TabsControlled from "../demos/tabs-controlled";
import TabsPager from "../demos/tabs-pager";
import TabsSteps from "../demos/tabs-steps";
import TaginputBasic from "../demos/taginput-basic";
import TaginputControlled from "../demos/taginput-controlled";
import TaginputHint from "../demos/taginput-hint";
import TagsBasic from "../demos/tags-basic";
import TagsBadge from "../demos/tags-badge";
import TagsAvatar from "../demos/tags-avatar";
import ToastBasic from "../demos/toast-basic";
import ToastAction from "../demos/toast-action";
import ToastProgress from "../demos/toast-progress";
import TooltipBasic from "../demos/tooltip-basic";
import TooltipKbd from "../demos/tooltip-kbd";
import TooltipTruncate from "../demos/tooltip-truncate";
import UploadBasic from "../demos/upload-basic";
import UploadReal from "../demos/upload-real";
import UploadSingle from "../demos/upload-single";
import VlistBasic from "../demos/vlist-basic";
import VlistTotal from "../demos/vlist-total";
import VlistRetry from "../demos/vlist-retry";

export default function Gallery() {
  return (
    <main className="gallery">
      <section id="color">
        <h2>颜色</h2>
        <div className="demo" data-demo="color-0"><Guard slug="color-0"><ColorDemo0 /></Guard></div>
      </section>
      <section id="type">
        <h2>排版</h2>
        <div className="demo" data-demo="type-0"><Guard slug="type-0"><TypeDemo0 /></Guard></div>
        <div className="demo" data-demo="type-1"><Guard slug="type-1"><TypeDemo1 /></Guard></div>
        <div className="demo" data-demo="type-2"><Guard slug="type-2"><TypeDemo2 /></Guard></div>
      </section>
      <section id="spacing">
        <h2>间距</h2>
        <div className="demo" data-demo="spacing-0"><Guard slug="spacing-0"><SpacingDemo0 /></Guard></div>
        <div className="demo" data-demo="spacing-1"><Guard slug="spacing-1"><SpacingDemo1 /></Guard></div>
        <div className="demo" data-demo="spacing-2"><Guard slug="spacing-2"><SpacingDemo2 /></Guard></div>
        <div className="demo" data-demo="spacing-3"><Guard slug="spacing-3"><SpacingDemo3 /></Guard></div>
      </section>
      <section id="layout">
        <h2>布局</h2>
        <div className="demo" data-demo="layout-0"><Guard slug="layout-0"><LayoutDemo0 /></Guard></div>
        <div className="demo" data-demo="layout-1"><Guard slug="layout-1"><LayoutDemo1 /></Guard></div>
      </section>
      <section id="space">
        <h2>圆角与线</h2>
        <div className="demo" data-demo="space-0"><Guard slug="space-0"><SpaceDemo0 /></Guard></div>
        <div className="demo" data-demo="space-1"><Guard slug="space-1"><SpaceDemo1 /></Guard></div>
        <div className="demo" data-demo="space-2"><Guard slug="space-2"><SpaceDemo2 /></Guard></div>
      </section>
      <section id="elevation">
        <h2>阴影与层级</h2>
        <div className="demo" data-demo="elevation-0"><Guard slug="elevation-0"><ElevationDemo0 /></Guard></div>
      </section>
      <section id="motion">
        <h2>动效曲线</h2>
        <div className="demo" data-demo="motion-0"><Guard slug="motion-0"><MotionDemo0 /></Guard></div>
      </section>
      <section id="loadingmotion">
        <h2>内容加载与过渡</h2>
        <div className="demo" data-demo="loadingmotion-0"><Guard slug="loadingmotion-0"><LoadingmotionDemo0 /></Guard></div>
      </section>
      <section id="icons">
        <h2>图标</h2>
        <div className="demo" data-demo="icons-0"><Guard slug="icons-0"><IconsDemo0 /></Guard></div>
        <div className="demo" data-demo="icons-1"><Guard slug="icons-1"><IconsDemo1 /></Guard></div>
      </section>
      <section id="feel">
        <h2>交互质感</h2>
        <div className="demo" data-demo="feel-0"><Guard slug="feel-0"><FeelDemo0 /></Guard></div>
      </section>
      <section id="button">
        <h2>按钮</h2>
        <div className="demo" data-demo="button-0"><Guard slug="button-0"><ButtonDemo0 /></Guard></div>
        <div className="demo" data-demo="button-1"><Guard slug="button-1"><ButtonDemo1 /></Guard></div>
        <div className="demo" data-demo="button-2"><Guard slug="button-2"><ButtonDemo2 /></Guard></div>
        <div className="demo" data-demo="button-3"><Guard slug="button-3"><ButtonDemo3 /></Guard></div>
      </section>
      <section id="iconbutton">
        <h2>纯图标按钮</h2>
        <div className="demo" data-demo="iconbutton-0"><Guard slug="iconbutton-0"><IconbuttonDemo0 /></Guard></div>
      </section>
      <section id="link">
        <h2>文字链接</h2>
        <div className="demo" data-demo="link-0"><Guard slug="link-0"><LinkDemo0 /></Guard></div>
      </section>
      <section id="compound">
        <h2>组合按钮</h2>
        <div className="demo" data-demo="compound-0"><Guard slug="compound-0"><CompoundDemo0 /></Guard></div>
      </section>
      <section id="chip">
        <h2>切换芯片</h2>
        <div className="demo" data-demo="chip-0"><Guard slug="chip-0"><ChipDemo0 /></Guard></div>
      </section>
      <section id="field">
        <h2>字段与错误</h2>
        <div className="demo" data-demo="field-0"><Guard slug="field-0"><FieldDemo0 /></Guard></div>
      </section>
      <section id="input">
        <h2>输入框</h2>
        <div className="demo" data-demo="input-0"><Guard slug="input-0"><InputDemo0 /></Guard></div>
        <div className="demo" data-demo="input-1"><Guard slug="input-1"><InputDemo1 /></Guard></div>
        <div className="demo" data-demo="input-2"><Guard slug="input-2"><InputDemo2 /></Guard></div>
      </section>
      <section id="special">
        <h2>搜索、密码、邮箱</h2>
        <div className="demo" data-demo="special-0"><Guard slug="special-0"><SpecialDemo0 /></Guard></div>
      </section>
      <section id="count">
        <h2>字数统计</h2>
        <div className="demo" data-demo="count-0"><Guard slug="count-0"><CountDemo0 /></Guard></div>
      </section>
      <section id="taginput">
        <h2>标签输入</h2>
        <div className="demo" data-demo="taginput-0"><Guard slug="taginput-0"><TaginputDemo0 /></Guard></div>
      </section>
      <section id="number">
        <h2>数字步进</h2>
        <div className="demo" data-demo="number-0"><Guard slug="number-0"><NumberDemo0 /></Guard></div>
      </section>
      <section id="prompt">
        <h2>提示词输入框</h2>
        <div className="demo" data-demo="prompt-0"><Guard slug="prompt-0"><PromptDemo0 /></Guard></div>
      </section>
      <section id="select">
        <h2>下拉选择与菜单</h2>
        <div className="demo" data-demo="select-0"><Guard slug="select-0"><SelectDemo0 /></Guard></div>
      </section>
      <section id="picker">
        <h2>日期、时间、地址</h2>
        <div className="demo" data-demo="picker-0"><Guard slug="picker-0"><PickerDemo0 /></Guard></div>
      </section>
      <section id="choice">
        <h2>复选、单选、开关</h2>
        <div className="demo" data-demo="choice-0"><Guard slug="choice-0"><ChoiceDemo0 /></Guard></div>
      </section>
      <section id="segmented">
        <h2>分段控件</h2>
        <div className="demo" data-demo="segmented-0"><Guard slug="segmented-0"><SegmentedDemo0 /></Guard></div>
      </section>
      <section id="slider">
        <h2>滑块</h2>
        <div className="demo" data-demo="slider-0"><Guard slug="slider-0"><SliderDemo0 /></Guard></div>
      </section>
      <section id="otp">
        <h2>验证码</h2>
        <div className="demo" data-demo="otp-0"><Guard slug="otp-0"><OtpDemo0 /></Guard></div>
      </section>
      <section id="tooltip">
        <h2>文字提示</h2>
        <div className="demo" data-demo="tooltip-0"><Guard slug="tooltip-0"><TooltipDemo0 /></Guard></div>
      </section>
      <section id="popover">
        <h2>弹出面板</h2>
        <div className="demo" data-demo="popover-0"><Guard slug="popover-0"><PopoverDemo0 /></Guard></div>
      </section>
      <section id="popconfirm">
        <h2>气泡确认</h2>
        <div className="demo" data-demo="popconfirm-0"><Guard slug="popconfirm-0"><PopconfirmDemo0 /></Guard></div>
      </section>
      <section id="ctxmenu">
        <h2>右键菜单与子菜单</h2>
        <div className="demo" data-demo="ctxmenu-0"><Guard slug="ctxmenu-0"><CtxmenuDemo0 /></Guard></div>
      </section>
      <section id="dialog">
        <h2>弹窗</h2>
        <div className="demo" data-demo="dialog-0"><Guard slug="dialog-0"><DialogDemo0 /></Guard></div>
      </section>
      <section id="drawer">
        <h2>抽屉</h2>
        <div className="demo" data-demo="drawer-0"><Guard slug="drawer-0"><DrawerDemo0 /></Guard></div>
      </section>
      <section id="cmdk">
        <h2>命令面板</h2>
        <div className="demo" data-demo="cmdk-0"><Guard slug="cmdk-0"><CmdkDemo0 /></Guard></div>
      </section>
      <section id="toast">
        <h2>轻提示</h2>
        <div className="demo" data-demo="toast-0"><Guard slug="toast-0"><ToastDemo0 /></Guard></div>
      </section>
      <section id="notify">
        <h2>通知</h2>
        <div className="demo" data-demo="notify-0"><Guard slug="notify-0"><NotifyDemo0 /></Guard></div>
      </section>
      <section id="banner">
        <h2>横幅与条目上的失败</h2>
        <div className="demo" data-demo="banner-0"><Guard slug="banner-0"><BannerDemo0 /></Guard></div>
      </section>
      <section id="empty">
        <h2>空状态</h2>
        <div className="demo" data-demo="empty-0"><Guard slug="empty-0"><EmptyDemo0 /></Guard></div>
      </section>
      <section id="loading">
        <h2>骨架与加载</h2>
        <div className="demo" data-demo="loading-0"><Guard slug="loading-0"><LoadingDemo0 /></Guard></div>
        <div className="demo" data-demo="loading-1"><Guard slug="loading-1"><LoadingDemo1 /></Guard></div>
      </section>
      <section id="progress">
        <h2>进度</h2>
        <div className="demo" data-demo="progress-0"><Guard slug="progress-0"><ProgressDemo0 /></Guard></div>
      </section>
      <section id="numflow">
        <h2>数字变化</h2>
        <div className="demo" data-demo="numflow-0"><Guard slug="numflow-0"><NumflowDemo0 /></Guard></div>
      </section>
      <section id="table">
        <h2>表格</h2>
        <div className="demo" data-demo="table-0"><Guard slug="table-0"><TableDemo0 /></Guard></div>
        <div className="demo" data-demo="table-1"><Guard slug="table-1"><TableDemo1 /></Guard></div>
        <div className="demo" data-demo="table-2"><Guard slug="table-2"><TableDemo2 /></Guard></div>
        <div className="demo" data-demo="table-3"><Guard slug="table-3"><TableDemo3 /></Guard></div>
        <div className="demo" data-demo="table-4"><Guard slug="table-4"><TableDemo4 /></Guard></div>
        <div className="demo" data-demo="table-5"><Guard slug="table-5"><TableDemo5 /></Guard></div>
        <div className="demo" data-demo="table-6"><Guard slug="table-6"><TableDemo6 /></Guard></div>
        <div className="demo" data-demo="table-7"><Guard slug="table-7"><TableDemo7 /></Guard></div>
      </section>
      <section id="grid">
        <h2>数据表格</h2>
        <div className="demo" data-demo="grid-0"><Guard slug="grid-0"><GridDemo0 /></Guard></div>
      </section>
      <section id="cgrid">
        <h2>Canvas 表格</h2>
        <div className="demo" data-demo="cgrid-0"><Guard slug="cgrid-0"><CgridDemo0 /></Guard></div>
      </section>
      <section id="charts">
        <h2>数据图表与 3D</h2>
        <div className="demo" data-demo="charts-0"><Guard slug="charts-0"><ChartsDemo0 /></Guard></div>
        <div className="demo" data-demo="charts-1"><Guard slug="charts-1"><ChartsDemo1 /></Guard></div>
        <div className="demo" data-demo="charts-2"><Guard slug="charts-2"><ChartsDemo2 /></Guard></div>
        <div className="demo" data-demo="charts-3"><Guard slug="charts-3"><ChartsDemo3 /></Guard></div>
      </section>
      <section id="list">
        <h2>列表与键值</h2>
        <div className="demo" data-demo="list-0"><Guard slug="list-0"><ListDemo0 /></Guard></div>
      </section>
      <section id="card">
        <h2>卡片</h2>
        <div className="demo" data-demo="card-0"><Guard slug="card-0"><CardDemo0 /></Guard></div>
      </section>
      <section id="tags">
        <h2>标签、徽标与头像</h2>
        <div className="demo" data-demo="tags-0"><Guard slug="tags-0"><TagsDemo0 /></Guard></div>
      </section>
      <section id="avatar">
        <h2>头像</h2>
        <div className="demo" data-demo="avatar-0"><Guard slug="avatar-0"><AvatarDemo0 /></Guard></div>
        <div className="demo" data-demo="avatar-1"><Guard slug="avatar-1"><AvatarDemo1 /></Guard></div>
        <div className="demo" data-demo="avatar-2"><Guard slug="avatar-2"><AvatarDemo2 /></Guard></div>
      </section>
      <section id="collapse">
        <h2>折叠面板</h2>
        <div className="demo" data-demo="collapse-0"><Guard slug="collapse-0"><CollapseDemo0 /></Guard></div>
      </section>
      <section id="scrollarea">
        <h2>滚动区域</h2>
        <div className="demo" data-demo="scrollarea-0"><Guard slug="scrollarea-0"><ScrollareaDemo0 /></Guard></div>
        <div className="demo" data-demo="scrollarea-1"><Guard slug="scrollarea-1"><ScrollareaDemo1 /></Guard></div>
        <div className="demo" data-demo="scrollarea-2"><Guard slug="scrollarea-2"><ScrollareaDemo2 /></Guard></div>
        <div className="demo" data-demo="scrollarea-3"><Guard slug="scrollarea-3"><ScrollareaDemo3 /></Guard></div>
        <div className="demo" data-demo="scrollarea-4"><Guard slug="scrollarea-4"><ScrollareaDemo4 /></Guard></div>
        <div className="demo" data-demo="scrollarea-5"><Guard slug="scrollarea-5"><ScrollareaDemo5 /></Guard></div>
        <div className="demo" data-demo="scrollarea-6"><Guard slug="scrollarea-6"><ScrollareaDemo6 /></Guard></div>
      </section>
      <section id="vlist">
        <h2>无限列表</h2>
        <div className="demo" data-demo="vlist-0"><Guard slug="vlist-0"><VlistDemo0 /></Guard></div>
      </section>
      <section id="chat">
        <h2>聊天与 AI 对话</h2>
        <div className="demo" data-demo="chat-0"><Guard slug="chat-0"><ChatDemo0 /></Guard></div>
        <div className="demo" data-demo="chat-1"><Guard slug="chat-1"><ChatDemo1 /></Guard></div>
      </section>
      <section id="md">
        <h2>Markdown 文档</h2>
        <div className="demo" data-demo="md-0"><Guard slug="md-0"><MdDemo0 /></Guard></div>
      </section>
      <section id="editorial">
        <h2>图文编排与内容张力</h2>
        <div className="demo" data-demo="editorial-0"><Guard slug="editorial-0"><EditorialDemo0 /></Guard></div>
      </section>
      <section id="flow">
        <h2>流程图</h2>
        <div className="demo" data-demo="flow-0"><Guard slug="flow-0"><FlowDemo0 /></Guard></div>
      </section>
      <section id="image">
        <h2>图片</h2>
        <div className="demo" data-demo="image-0"><Guard slug="image-0"><ImageDemo0 /></Guard></div>
      </section>
      <section id="media">
        <h2>视频与音频</h2>
        <div className="demo" data-demo="media-0"><Guard slug="media-0"><MediaDemo0 /></Guard></div>
      </section>
      <section id="upload">
        <h2>上传</h2>
        <div className="demo" data-demo="upload-0"><Guard slug="upload-0"><UploadDemo0 /></Guard></div>
      </section>
      <section id="sidebar">
        <h2>侧栏与布局</h2>
        <div className="demo" data-demo="sidebar-0"><Guard slug="sidebar-0"><SidebarDemo0 /></Guard></div>
      </section>
      <section id="tabs">
        <h2>标签页、分页、步骤</h2>
        <div className="demo" data-demo="tabs-0"><Guard slug="tabs-0"><TabsDemo0 /></Guard></div>
      </section>
      <section id="reorder">
        <h2>拖拽重排</h2>
        <div className="demo" data-demo="reorder-0"><Guard slug="reorder-0"><ReorderDemo0 /></Guard></div>
      </section>
      <section id="addremove">
        <h2>新增与删除</h2>
        <div className="demo" data-demo="addremove-0"><Guard slug="addremove-0"><AddremoveDemo0 /></Guard></div>
      </section>
      <section id="optimistic">
        <h2>乐观更新</h2>
        <div className="demo" data-demo="optimistic-0"><Guard slug="optimistic-0"><OptimisticDemo0 /></Guard></div>
      </section>
      <section id="addremove">
        <h2>新增与删除</h2>
        <div className="demo" data-demo="addremove-basic"><Guard slug="addremove-basic"><AddremoveBasic /></Guard></div>
        <div className="demo" data-demo="addremove-undo"><Guard slug="addremove-undo"><AddremoveUndo /></Guard></div>
        <div className="demo" data-demo="addremove-rows"><Guard slug="addremove-rows"><AddremoveRows /></Guard></div>
      </section>
      <section id="avatar">
        <h2>头像</h2>
        <div className="demo" data-demo="avatar-basic"><Guard slug="avatar-basic"><AvatarBasic /></Guard></div>
        <div className="demo" data-demo="avatar-list"><Guard slug="avatar-list"><AvatarList /></Guard></div>
      </section>
      <section id="banner">
        <h2>横幅与条目上的失败</h2>
        <div className="demo" data-demo="banner-basic"><Guard slug="banner-basic"><BannerBasic /></Guard></div>
        <div className="demo" data-demo="banner-dismiss"><Guard slug="banner-dismiss"><BannerDismiss /></Guard></div>
        <div className="demo" data-demo="banner-error"><Guard slug="banner-error"><BannerError /></Guard></div>
      </section>
      <section id="button">
        <h2>按钮</h2>
        <div className="demo" data-demo="button-basic"><Guard slug="button-basic"><ButtonBasic /></Guard></div>
        <div className="demo" data-demo="button-variants"><Guard slug="button-variants"><ButtonVariants /></Guard></div>
        <div className="demo" data-demo="button-sizes"><Guard slug="button-sizes"><ButtonSizes /></Guard></div>
        <div className="demo" data-demo="button-icons"><Guard slug="button-icons"><ButtonIcons /></Guard></div>
        <div className="demo" data-demo="button-states"><Guard slug="button-states"><ButtonStates /></Guard></div>
        <div className="demo" data-demo="button-busy"><Guard slug="button-busy"><ButtonBusy /></Guard></div>
        <div className="demo" data-demo="button-actions"><Guard slug="button-actions"><ButtonActions /></Guard></div>
        <div className="demo" data-demo="button-mobile"><Guard slug="button-mobile"><ButtonMobile /></Guard></div>
      </section>
      <section id="card">
        <h2>卡片</h2>
        <div className="demo" data-demo="card-basic"><Guard slug="card-basic"><CardBasic /></Guard></div>
        <div className="demo" data-demo="card-grid"><Guard slug="card-grid"><CardGrid /></Guard></div>
        <div className="demo" data-demo="card-variants"><Guard slug="card-variants"><CardVariants /></Guard></div>
        <div className="demo" data-demo="card-layouts"><Guard slug="card-layouts"><CardLayouts /></Guard></div>
        <div className="demo" data-demo="card-content"><Guard slug="card-content"><CardContent /></Guard></div>
        <div className="demo" data-demo="card-select"><Guard slug="card-select"><CardSelect /></Guard></div>
      </section>
      <section id="cgrid">
        <h2>Canvas 表格</h2>
        <div className="demo" data-demo="cgrid-basic"><Guard slug="cgrid-basic"><CgridBasic /></Guard></div>
        <div className="demo" data-demo="cgrid-million"><Guard slug="cgrid-million"><CgridMillion /></Guard></div>
        <div className="demo" data-demo="cgrid-controlled"><Guard slug="cgrid-controlled"><CgridControlled /></Guard></div>
        <div className="demo" data-demo="cgrid-events"><Guard slug="cgrid-events"><CgridEvents /></Guard></div>
      </section>
      <section id="chat">
        <h2>聊天与 AI 对话</h2>
        <div className="demo" data-demo="chat-basic"><Guard slug="chat-basic"><ChatBasic /></Guard></div>
        <div className="demo" data-demo="chat-new"><Guard slug="chat-new"><ChatNew /></Guard></div>
        <div className="demo" data-demo="chat-history"><Guard slug="chat-history"><ChatHistory /></Guard></div>
        <div className="demo" data-demo="chat-rich"><Guard slug="chat-rich"><ChatRich /></Guard></div>
      </section>
      <section id="chip">
        <h2>切换芯片</h2>
        <div className="demo" data-demo="chip-basic"><Guard slug="chip-basic"><ChipBasic /></Guard></div>
        <div className="demo" data-demo="chip-controlled"><Guard slug="chip-controlled"><ChipControlled /></Guard></div>
        <div className="demo" data-demo="chip-removable"><Guard slug="chip-removable"><ChipRemovable /></Guard></div>
      </section>
      <section id="choice">
        <h2>复选、单选、开关</h2>
        <div className="demo" data-demo="choice-basic"><Guard slug="choice-basic"><ChoiceBasic /></Guard></div>
        <div className="demo" data-demo="choice-radio"><Guard slug="choice-radio"><ChoiceRadio /></Guard></div>
        <div className="demo" data-demo="choice-controlled"><Guard slug="choice-controlled"><ChoiceControlled /></Guard></div>
      </section>
      <section id="cmdk">
        <h2>命令面板</h2>
        <div className="demo" data-demo="cmdk-basic"><Guard slug="cmdk-basic"><CmdkBasic /></Guard></div>
        <div className="demo" data-demo="cmdk-empty"><Guard slug="cmdk-empty"><CmdkEmpty /></Guard></div>
        <div className="demo" data-demo="cmdk-hotkey"><Guard slug="cmdk-hotkey"><CmdkHotkey /></Guard></div>
      </section>
      <section id="collapse">
        <h2>折叠面板</h2>
        <div className="demo" data-demo="collapse-basic"><Guard slug="collapse-basic"><CollapseBasic /></Guard></div>
        <div className="demo" data-demo="collapse-single"><Guard slug="collapse-single"><CollapseSingle /></Guard></div>
        <div className="demo" data-demo="collapse-controlled"><Guard slug="collapse-controlled"><CollapseControlled /></Guard></div>
      </section>
      <section id="compound">
        <h2>组合按钮</h2>
        <div className="demo" data-demo="compound-basic"><Guard slug="compound-basic"><CompoundBasic /></Guard></div>
        <div className="demo" data-demo="compound-split"><Guard slug="compound-split"><CompoundSplit /></Guard></div>
        <div className="demo" data-demo="compound-copy"><Guard slug="compound-copy"><CompoundCopy /></Guard></div>
      </section>
      <section id="count">
        <h2>字数统计</h2>
        <div className="demo" data-demo="count-basic"><Guard slug="count-basic"><CountBasic /></Guard></div>
        <div className="demo" data-demo="count-controlled"><Guard slug="count-controlled"><CountControlled /></Guard></div>
        <div className="demo" data-demo="count-longtext"><Guard slug="count-longtext"><CountLongtext /></Guard></div>
      </section>
      <section id="ctxmenu">
        <h2>右键菜单与子菜单</h2>
        <div className="demo" data-demo="ctxmenu-basic"><Guard slug="ctxmenu-basic"><CtxmenuBasic /></Guard></div>
        <div className="demo" data-demo="ctxmenu-context"><Guard slug="ctxmenu-context"><CtxmenuContext /></Guard></div>
        <div className="demo" data-demo="ctxmenu-submenu"><Guard slug="ctxmenu-submenu"><CtxmenuSubmenu /></Guard></div>
      </section>
      <section id="dialog">
        <h2>弹窗</h2>
        <div className="demo" data-demo="dialog-basic"><Guard slug="dialog-basic"><DialogBasic /></Guard></div>
        <div className="demo" data-demo="dialog-danger"><Guard slug="dialog-danger"><DialogDanger /></Guard></div>
        <div className="demo" data-demo="dialog-guard"><Guard slug="dialog-guard"><DialogGuard /></Guard></div>
        <div className="demo" data-demo="dialog-events"><Guard slug="dialog-events"><DialogEvents /></Guard></div>
        <div className="demo" data-demo="dialog-controlled"><Guard slug="dialog-controlled"><DialogControlled /></Guard></div>
      </section>
      <section id="drawer">
        <h2>抽屉</h2>
        <div className="demo" data-demo="drawer-basic"><Guard slug="drawer-basic"><DrawerBasic /></Guard></div>
        <div className="demo" data-demo="drawer-controlled"><Guard slug="drawer-controlled"><DrawerControlled /></Guard></div>
        <div className="demo" data-demo="drawer-footer"><Guard slug="drawer-footer"><DrawerFooter /></Guard></div>
      </section>
      <section id="editorial">
        <h2>图文编排与内容张力</h2>
        <div className="demo" data-demo="editorial-basic"><Guard slug="editorial-basic"><EditorialBasic /></Guard></div>
        <div className="demo" data-demo="editorial-compare"><Guard slug="editorial-compare"><EditorialCompare /></Guard></div>
        <div className="demo" data-demo="editorial-hotspot"><Guard slug="editorial-hotspot"><EditorialHotspot /></Guard></div>
      </section>
      <section id="empty">
        <h2>空状态</h2>
        <div className="demo" data-demo="empty-basic"><Guard slug="empty-basic"><EmptyBasic /></Guard></div>
        <div className="demo" data-demo="empty-search"><Guard slug="empty-search"><EmptySearch /></Guard></div>
        <div className="demo" data-demo="empty-error"><Guard slug="empty-error"><EmptyError /></Guard></div>
        <div className="demo" data-demo="empty-presets"><Guard slug="empty-presets"><EmptyPresets /></Guard></div>
      </section>
      <section id="field">
        <h2>字段与错误</h2>
        <div className="demo" data-demo="field-basic"><Guard slug="field-basic"><FieldBasic /></Guard></div>
        <div className="demo" data-demo="field-error"><Guard slug="field-error"><FieldError /></Guard></div>
        <div className="demo" data-demo="field-optional"><Guard slug="field-optional"><FieldOptional /></Guard></div>
      </section>
      <section id="flow">
        <h2>流程图</h2>
        <div className="demo" data-demo="flow-basic"><Guard slug="flow-basic"><FlowBasic /></Guard></div>
        <div className="demo" data-demo="flow-branch"><Guard slug="flow-branch"><FlowBranch /></Guard></div>
        <div className="demo" data-demo="flow-tidy"><Guard slug="flow-tidy"><FlowTidy /></Guard></div>
      </section>
      <section id="flowstress">
        <h2>万级节点压测</h2>
        <div className="demo" data-demo="flowstress-many"><Guard slug="flowstress-many"><FlowstressMany /></Guard></div>
      </section>
      <section id="grid">
        <h2>数据表格</h2>
        <div className="demo" data-demo="grid-basic"><Guard slug="grid-basic"><GridBasic /></Guard></div>
        <div className="demo" data-demo="grid-sort"><Guard slug="grid-sort"><GridSort /></Guard></div>
        <div className="demo" data-demo="grid-select"><Guard slug="grid-select"><GridSelect /></Guard></div>
        <div className="demo" data-demo="grid-render"><Guard slug="grid-render"><GridRender /></Guard></div>
        <div className="demo" data-demo="grid-remote"><Guard slug="grid-remote"><GridRemote /></Guard></div>
        <div className="demo" data-demo="grid-edit"><Guard slug="grid-edit"><GridEdit /></Guard></div>
        <div className="demo" data-demo="grid-states"><Guard slug="grid-states"><GridStates /></Guard></div>
      </section>
      <section id="iconbutton">
        <h2>纯图标按钮</h2>
        <div className="demo" data-demo="iconbutton-basic"><Guard slug="iconbutton-basic"><IconbuttonBasic /></Guard></div>
        <div className="demo" data-demo="iconbutton-variants"><Guard slug="iconbutton-variants"><IconbuttonVariants /></Guard></div>
        <div className="demo" data-demo="iconbutton-states"><Guard slug="iconbutton-states"><IconbuttonStates /></Guard></div>
        <div className="demo" data-demo="iconbutton-controlled"><Guard slug="iconbutton-controlled"><IconbuttonControlled /></Guard></div>
      </section>
      <section id="image">
        <h2>图片</h2>
        <div className="demo" data-demo="image-basic"><Guard slug="image-basic"><ImageBasic /></Guard></div>
        <div className="demo" data-demo="image-controlled"><Guard slug="image-controlled"><ImageControlled /></Guard></div>
        <div className="demo" data-demo="image-failed"><Guard slug="image-failed"><ImageFailed /></Guard></div>
      </section>
      <section id="input">
        <h2>输入框</h2>
        <div className="demo" data-demo="input-basic"><Guard slug="input-basic"><InputBasic /></Guard></div>
        <div className="demo" data-demo="input-sizes"><Guard slug="input-sizes"><InputSizes /></Guard></div>
        <div className="demo" data-demo="input-controlled"><Guard slug="input-controlled"><InputControlled /></Guard></div>
      </section>
      <section id="link">
        <h2>文字链接</h2>
        <div className="demo" data-demo="link-basic"><Guard slug="link-basic"><LinkBasic /></Guard></div>
        <div className="demo" data-demo="link-textbtn"><Guard slug="link-textbtn"><LinkTextbtn /></Guard></div>
        <div className="demo" data-demo="link-arrow"><Guard slug="link-arrow"><LinkArrow /></Guard></div>
      </section>
      <section id="list">
        <h2>列表与键值</h2>
        <div className="demo" data-demo="list-basic"><Guard slug="list-basic"><ListBasic /></Guard></div>
        <div className="demo" data-demo="list-kv"><Guard slug="list-kv"><ListKv /></Guard></div>
        <div className="demo" data-demo="list-switch"><Guard slug="list-switch"><ListSwitch /></Guard></div>
      </section>
      <section id="loading">
        <h2>骨架与加载</h2>
        <div className="demo" data-demo="loading-basic"><Guard slug="loading-basic"><LoadingBasic /></Guard></div>
        <div className="demo" data-demo="loading-list"><Guard slug="loading-list"><LoadingList /></Guard></div>
        <div className="demo" data-demo="loading-quiet"><Guard slug="loading-quiet"><LoadingQuiet /></Guard></div>
      </section>
      <section id="md">
        <h2>Markdown 文档</h2>
        <div className="demo" data-demo="md-basic"><Guard slug="md-basic"><MdBasic /></Guard></div>
        <div className="demo" data-demo="md-stream"><Guard slug="md-stream"><MdStream /></Guard></div>
        <div className="demo" data-demo="md-heights"><Guard slug="md-heights"><MdHeights /></Guard></div>
      </section>
      <section id="media">
        <h2>视频与音频</h2>
        <div className="demo" data-demo="media-basic"><Guard slug="media-basic"><MediaBasic /></Guard></div>
        <div className="demo" data-demo="media-audio"><Guard slug="media-audio"><MediaAudio /></Guard></div>
        <div className="demo" data-demo="media-methods"><Guard slug="media-methods"><MediaMethods /></Guard></div>
      </section>
      <section id="notify">
        <h2>通知</h2>
        <div className="demo" data-demo="notify-basic"><Guard slug="notify-basic"><NotifyBasic /></Guard></div>
        <div className="demo" data-demo="notify-actions"><Guard slug="notify-actions"><NotifyActions /></Guard></div>
        <div className="demo" data-demo="notify-fail"><Guard slug="notify-fail"><NotifyFail /></Guard></div>
      </section>
      <section id="number">
        <h2>数字步进</h2>
        <div className="demo" data-demo="number-basic"><Guard slug="number-basic"><NumberBasic /></Guard></div>
        <div className="demo" data-demo="number-controlled"><Guard slug="number-controlled"><NumberControlled /></Guard></div>
        <div className="demo" data-demo="number-range"><Guard slug="number-range"><NumberRange /></Guard></div>
      </section>
      <section id="numflow">
        <h2>数字变化</h2>
        <div className="demo" data-demo="numflow-basic"><Guard slug="numflow-basic"><NumflowBasic /></Guard></div>
        <div className="demo" data-demo="numflow-counter"><Guard slug="numflow-counter"><NumflowCounter /></Guard></div>
        <div className="demo" data-demo="numflow-styles"><Guard slug="numflow-styles"><NumflowStyles /></Guard></div>
      </section>
      <section id="optimistic">
        <h2>乐观更新</h2>
        <div className="demo" data-demo="optimistic-basic"><Guard slug="optimistic-basic"><OptimisticBasic /></Guard></div>
        <div className="demo" data-demo="optimistic-switch"><Guard slug="optimistic-switch"><OptimisticSwitch /></Guard></div>
        <div className="demo" data-demo="optimistic-pending"><Guard slug="optimistic-pending"><OptimisticPending /></Guard></div>
      </section>
      <section id="otp">
        <h2>验证码</h2>
        <div className="demo" data-demo="otp-basic"><Guard slug="otp-basic"><OtpBasic /></Guard></div>
        <div className="demo" data-demo="otp-complete"><Guard slug="otp-complete"><OtpComplete /></Guard></div>
        <div className="demo" data-demo="otp-length"><Guard slug="otp-length"><OtpLength /></Guard></div>
        <div className="demo" data-demo="otp-mask"><Guard slug="otp-mask"><OtpMask /></Guard></div>
      </section>
      <section id="picker">
        <h2>日期、时间、地址</h2>
        <div className="demo" data-demo="picker-basic"><Guard slug="picker-basic"><PickerBasic /></Guard></div>
        <div className="demo" data-demo="picker-range"><Guard slug="picker-range"><PickerRange /></Guard></div>
        <div className="demo" data-demo="picker-time"><Guard slug="picker-time"><PickerTime /></Guard></div>
        <div className="demo" data-demo="picker-datetime"><Guard slug="picker-datetime"><PickerDatetime /></Guard></div>
        <div className="demo" data-demo="picker-region"><Guard slug="picker-region"><PickerRegion /></Guard></div>
        <div className="demo" data-demo="picker-events"><Guard slug="picker-events"><PickerEvents /></Guard></div>
      </section>
      <section id="popconfirm">
        <h2>气泡确认</h2>
        <div className="demo" data-demo="popconfirm-basic"><Guard slug="popconfirm-basic"><PopconfirmBasic /></Guard></div>
        <div className="demo" data-demo="popconfirm-undo"><Guard slug="popconfirm-undo"><PopconfirmUndo /></Guard></div>
        <div className="demo" data-demo="popconfirm-submit"><Guard slug="popconfirm-submit"><PopconfirmSubmit /></Guard></div>
      </section>
      <section id="popover">
        <h2>弹出面板</h2>
        <div className="demo" data-demo="popover-basic"><Guard slug="popover-basic"><PopoverBasic /></Guard></div>
        <div className="demo" data-demo="popover-controlled"><Guard slug="popover-controlled"><PopoverControlled /></Guard></div>
        <div className="demo" data-demo="popover-align"><Guard slug="popover-align"><PopoverAlign /></Guard></div>
      </section>
      <section id="progress">
        <h2>进度</h2>
        <div className="demo" data-demo="progress-basic"><Guard slug="progress-basic"><ProgressBasic /></Guard></div>
        <div className="demo" data-demo="progress-ring"><Guard slug="progress-ring"><ProgressRing /></Guard></div>
        <div className="demo" data-demo="progress-controlled"><Guard slug="progress-controlled"><ProgressControlled /></Guard></div>
      </section>
      <section id="prompt">
        <h2>提示词输入框</h2>
        <div className="demo" data-demo="prompt-basic"><Guard slug="prompt-basic"><PromptBasic /></Guard></div>
        <div className="demo" data-demo="prompt-stop"><Guard slug="prompt-stop"><PromptStop /></Guard></div>
        <div className="demo" data-demo="prompt-upload"><Guard slug="prompt-upload"><PromptUpload /></Guard></div>
        <div className="demo" data-demo="prompt-parts"><Guard slug="prompt-parts"><PromptParts /></Guard></div>
      </section>
      <section id="reorder">
        <h2>拖拽重排</h2>
        <div className="demo" data-demo="reorder-basic"><Guard slug="reorder-basic"><ReorderBasic /></Guard></div>
        <div className="demo" data-demo="reorder-order"><Guard slug="reorder-order"><ReorderOrder /></Guard></div>
        <div className="demo" data-demo="reorder-save"><Guard slug="reorder-save"><ReorderSave /></Guard></div>
      </section>
      <section id="scrollarea">
        <h2>滚动区域</h2>
        <div className="demo" data-demo="scrollarea-basic"><Guard slug="scrollarea-basic"><ScrollareaBasic /></Guard></div>
        <div className="demo" data-demo="scrollarea-bar"><Guard slug="scrollarea-bar"><ScrollareaBar /></Guard></div>
        <div className="demo" data-demo="scrollarea-none"><Guard slug="scrollarea-none"><ScrollareaNone /></Guard></div>
      </section>
      <section id="segmented">
        <h2>分段控件</h2>
        <div className="demo" data-demo="segmented-basic"><Guard slug="segmented-basic"><SegmentedBasic /></Guard></div>
        <div className="demo" data-demo="segmented-controlled"><Guard slug="segmented-controlled"><SegmentedControlled /></Guard></div>
        <div className="demo" data-demo="segmented-sizes"><Guard slug="segmented-sizes"><SegmentedSizes /></Guard></div>
      </section>
      <section id="select">
        <h2>下拉选择与菜单</h2>
        <div className="demo" data-demo="select-basic"><Guard slug="select-basic"><SelectBasic /></Guard></div>
        <div className="demo" data-demo="select-placeholder"><Guard slug="select-placeholder"><SelectPlaceholder /></Guard></div>
        <div className="demo" data-demo="select-options"><Guard slug="select-options"><SelectOptions /></Guard></div>
        <div className="demo" data-demo="select-field"><Guard slug="select-field"><SelectField /></Guard></div>
        <div className="demo" data-demo="select-events"><Guard slug="select-events"><SelectEvents /></Guard></div>
        <div className="demo" data-demo="select-controlled"><Guard slug="select-controlled"><SelectControlled /></Guard></div>
        <div className="demo" data-demo="select-menu"><Guard slug="select-menu"><SelectMenu /></Guard></div>
      </section>
      <section id="sidebar">
        <h2>侧栏与布局</h2>
        <div className="demo" data-demo="sidebar-basic"><Guard slug="sidebar-basic"><SidebarBasic /></Guard></div>
        <div className="demo" data-demo="sidebar-controlled"><Guard slug="sidebar-controlled"><SidebarControlled /></Guard></div>
        <div className="demo" data-demo="sidebar-fx"><Guard slug="sidebar-fx"><SidebarFx /></Guard></div>
      </section>
      <section id="slider">
        <h2>滑块</h2>
        <div className="demo" data-demo="slider-basic"><Guard slug="slider-basic"><SliderBasic /></Guard></div>
        <div className="demo" data-demo="slider-controlled"><Guard slug="slider-controlled"><SliderControlled /></Guard></div>
        <div className="demo" data-demo="slider-max"><Guard slug="slider-max"><SliderMax /></Guard></div>
      </section>
      <section id="special">
        <h2>搜索、密码、邮箱</h2>
        <div className="demo" data-demo="special-basic"><Guard slug="special-basic"><SpecialBasic /></Guard></div>
        <div className="demo" data-demo="special-password"><Guard slug="special-password"><SpecialPassword /></Guard></div>
        <div className="demo" data-demo="special-email"><Guard slug="special-email"><SpecialEmail /></Guard></div>
      </section>
      <section id="table">
        <h2>表格</h2>
        <div className="demo" data-demo="table-basic"><Guard slug="table-basic"><TableBasic /></Guard></div>
        <div className="demo" data-demo="table-controlled"><Guard slug="table-controlled"><TableControlled /></Guard></div>
        <div className="demo" data-demo="table-states"><Guard slug="table-states"><TableStates /></Guard></div>
        <div className="demo" data-demo="table-tree"><Guard slug="table-tree"><TableTree /></Guard></div>
        <div className="demo" data-demo="table-merge"><Guard slug="table-merge"><TableMerge /></Guard></div>
        <div className="demo" data-demo="table-drag"><Guard slug="table-drag"><TableDrag /></Guard></div>
      </section>
      <section id="tabs">
        <h2>标签页、分页、步骤</h2>
        <div className="demo" data-demo="tabs-basic"><Guard slug="tabs-basic"><TabsBasic /></Guard></div>
        <div className="demo" data-demo="tabs-controlled"><Guard slug="tabs-controlled"><TabsControlled /></Guard></div>
        <div className="demo" data-demo="tabs-pager"><Guard slug="tabs-pager"><TabsPager /></Guard></div>
        <div className="demo" data-demo="tabs-steps"><Guard slug="tabs-steps"><TabsSteps /></Guard></div>
      </section>
      <section id="taginput">
        <h2>标签输入</h2>
        <div className="demo" data-demo="taginput-basic"><Guard slug="taginput-basic"><TaginputBasic /></Guard></div>
        <div className="demo" data-demo="taginput-controlled"><Guard slug="taginput-controlled"><TaginputControlled /></Guard></div>
        <div className="demo" data-demo="taginput-hint"><Guard slug="taginput-hint"><TaginputHint /></Guard></div>
      </section>
      <section id="tags">
        <h2>标签、徽标与头像</h2>
        <div className="demo" data-demo="tags-basic"><Guard slug="tags-basic"><TagsBasic /></Guard></div>
        <div className="demo" data-demo="tags-badge"><Guard slug="tags-badge"><TagsBadge /></Guard></div>
        <div className="demo" data-demo="tags-avatar"><Guard slug="tags-avatar"><TagsAvatar /></Guard></div>
      </section>
      <section id="toast">
        <h2>轻提示</h2>
        <div className="demo" data-demo="toast-basic"><Guard slug="toast-basic"><ToastBasic /></Guard></div>
        <div className="demo" data-demo="toast-action"><Guard slug="toast-action"><ToastAction /></Guard></div>
        <div className="demo" data-demo="toast-progress"><Guard slug="toast-progress"><ToastProgress /></Guard></div>
      </section>
      <section id="tooltip">
        <h2>文字提示</h2>
        <div className="demo" data-demo="tooltip-basic"><Guard slug="tooltip-basic"><TooltipBasic /></Guard></div>
        <div className="demo" data-demo="tooltip-kbd"><Guard slug="tooltip-kbd"><TooltipKbd /></Guard></div>
        <div className="demo" data-demo="tooltip-truncate"><Guard slug="tooltip-truncate"><TooltipTruncate /></Guard></div>
      </section>
      <section id="upload">
        <h2>上传</h2>
        <div className="demo" data-demo="upload-basic"><Guard slug="upload-basic"><UploadBasic /></Guard></div>
        <div className="demo" data-demo="upload-real"><Guard slug="upload-real"><UploadReal /></Guard></div>
        <div className="demo" data-demo="upload-single"><Guard slug="upload-single"><UploadSingle /></Guard></div>
      </section>
      <section id="vlist">
        <h2>无限列表</h2>
        <div className="demo" data-demo="vlist-basic"><Guard slug="vlist-basic"><VlistBasic /></Guard></div>
        <div className="demo" data-demo="vlist-total"><Guard slug="vlist-total"><VlistTotal /></Guard></div>
        <div className="demo" data-demo="vlist-retry"><Guard slug="vlist-retry"><VlistRetry /></Guard></div>
      </section>
    </main>
  );
}
