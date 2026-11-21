// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
import { Component, ViewEncapsulation } from "@angular/core";
import { ColorDemo0Component } from "./demos/color-0";
import { TypeDemo0Component } from "./demos/type-0";
import { TypeDemo1Component } from "./demos/type-1";
import { TypeDemo2Component } from "./demos/type-2";
import { SpacingDemo0Component } from "./demos/spacing-0";
import { SpacingDemo1Component } from "./demos/spacing-1";
import { SpacingDemo2Component } from "./demos/spacing-2";
import { SpacingDemo3Component } from "./demos/spacing-3";
import { LayoutDemo0Component } from "./demos/layout-0";
import { LayoutDemo1Component } from "./demos/layout-1";
import { SpaceDemo0Component } from "./demos/space-0";
import { SpaceDemo1Component } from "./demos/space-1";
import { ElevationDemo0Component } from "./demos/elevation-0";
import { MotionDemo0Component } from "./demos/motion-0";
import { IconsDemo0Component } from "./demos/icons-0";
import { ButtonDemo0Component } from "./demos/button-0";
import { ButtonDemo1Component } from "./demos/button-1";
import { ButtonDemo2Component } from "./demos/button-2";
import { ButtonDemo3Component } from "./demos/button-3";
import { IconbuttonControlledComponent } from "./demos/iconbutton-controlled";
import { IconbuttonStatesComponent } from "./demos/iconbutton-states";
import { IconbuttonVariantsComponent } from "./demos/iconbutton-variants";
import { IconbuttonBasicComponent } from "./demos/iconbutton-basic";
import { IconbuttonDemo0Component } from "./demos/iconbutton-0";
import { LinkArrowComponent } from "./demos/link-arrow";
import { LinkTextbtnComponent } from "./demos/link-textbtn";
import { LinkBasicComponent } from "./demos/link-basic";
import { LinkDemo0Component } from "./demos/link-0";
import { CompoundDemo0Component } from "./demos/compound-0";
import { ChipRemovableComponent } from "./demos/chip-removable";
import { ChipControlledComponent } from "./demos/chip-controlled";
import { ChipBasicComponent } from "./demos/chip-basic";
import { ChipDemo0Component } from "./demos/chip-0";
import { FieldOptionalComponent } from "./demos/field-optional";
import { FieldErrorComponent } from "./demos/field-error";
import { FieldBasicComponent } from "./demos/field-basic";
import { FieldDemo0Component } from "./demos/field-0";
import { InputControlledComponent } from "./demos/input-controlled";
import { InputSizesComponent } from "./demos/input-sizes";
import { InputBasicComponent } from "./demos/input-basic";
import { InputDemo0Component } from "./demos/input-0";
import { InputDemo1Component } from "./demos/input-1";
import { InputDemo2Component } from "./demos/input-2";
import { SpecialDemo0Component } from "./demos/special-0";
import { CountDemo0Component } from "./demos/count-0";
import { TaginputHintComponent } from "./demos/taginput-hint";
import { TaginputControlledComponent } from "./demos/taginput-controlled";
import { TaginputBasicComponent } from "./demos/taginput-basic";
import { TaginputDemo0Component } from "./demos/taginput-0";
import { NumberRangeComponent } from "./demos/number-range";
import { NumberControlledComponent } from "./demos/number-controlled";
import { NumberBasicComponent } from "./demos/number-basic";
import { NumberDemo0Component } from "./demos/number-0";
import { PromptDemo0Component } from "./demos/prompt-0";
import { SelectDemo0Component } from "./demos/select-0";
import { PickerDemo0Component } from "./demos/picker-0";
import { ChoiceControlledComponent } from "./demos/choice-controlled";
import { ChoiceRadioComponent } from "./demos/choice-radio";
import { ChoiceBasicComponent } from "./demos/choice-basic";
import { ChoiceDemo0Component } from "./demos/choice-0";
import { SegmentedSizesComponent } from "./demos/segmented-sizes";
import { SegmentedControlledComponent } from "./demos/segmented-controlled";
import { SegmentedBasicComponent } from "./demos/segmented-basic";
import { SegmentedDemo0Component } from "./demos/segmented-0";
import { SliderMaxComponent } from "./demos/slider-max";
import { SliderControlledComponent } from "./demos/slider-controlled";
import { SliderBasicComponent } from "./demos/slider-basic";
import { SliderDemo0Component } from "./demos/slider-0";
import { OtpLengthComponent } from "./demos/otp-length";
import { OtpCompleteComponent } from "./demos/otp-complete";
import { OtpBasicComponent } from "./demos/otp-basic";
import { OtpDemo0Component } from "./demos/otp-0";
import { TooltipTruncateComponent } from "./demos/tooltip-truncate";
import { TooltipKbdComponent } from "./demos/tooltip-kbd";
import { TooltipBasicComponent } from "./demos/tooltip-basic";
import { TooltipDemo0Component } from "./demos/tooltip-0";
import { PopoverAlignComponent } from "./demos/popover-align";
import { PopoverControlledComponent } from "./demos/popover-controlled";
import { PopoverBasicComponent } from "./demos/popover-basic";
import { PopoverDemo0Component } from "./demos/popover-0";
import { PopconfirmDemo0Component } from "./demos/popconfirm-0";
import { CtxmenuSubmenuComponent } from "./demos/ctxmenu-submenu";
import { CtxmenuContextComponent } from "./demos/ctxmenu-context";
import { CtxmenuBasicComponent } from "./demos/ctxmenu-basic";
import { CtxmenuDemo0Component } from "./demos/ctxmenu-0";
import { DialogDemo0Component } from "./demos/dialog-0";
import { DrawerFooterComponent } from "./demos/drawer-footer";
import { DrawerControlledComponent } from "./demos/drawer-controlled";
import { DrawerBasicComponent } from "./demos/drawer-basic";
import { DrawerDemo0Component } from "./demos/drawer-0";
import { CmdkHotkeyComponent } from "./demos/cmdk-hotkey";
import { CmdkEmptyComponent } from "./demos/cmdk-empty";
import { CmdkBasicComponent } from "./demos/cmdk-basic";
import { CmdkDemo0Component } from "./demos/cmdk-0";
import { ToastProgressComponent } from "./demos/toast-progress";
import { ToastActionComponent } from "./demos/toast-action";
import { ToastBasicComponent } from "./demos/toast-basic";
import { ToastDemo0Component } from "./demos/toast-0";
import { NotifyFailComponent } from "./demos/notify-fail";
import { NotifyActionsComponent } from "./demos/notify-actions";
import { NotifyBasicComponent } from "./demos/notify-basic";
import { NotifyDemo0Component } from "./demos/notify-0";
import { BannerDemo0Component } from "./demos/banner-0";
import { EmptyErrorComponent } from "./demos/empty-error";
import { EmptySearchComponent } from "./demos/empty-search";
import { EmptyBasicComponent } from "./demos/empty-basic";
import { EmptyDemo0Component } from "./demos/empty-0";
import { LoadingDemo0Component } from "./demos/loading-0";
import { ProgressControlledComponent } from "./demos/progress-controlled";
import { ProgressRingComponent } from "./demos/progress-ring";
import { ProgressBasicComponent } from "./demos/progress-basic";
import { ProgressDemo0Component } from "./demos/progress-0";
import { NumflowStylesComponent } from "./demos/numflow-styles";
import { NumflowCounterComponent } from "./demos/numflow-counter";
import { NumflowBasicComponent } from "./demos/numflow-basic";
import { NumflowDemo0Component } from "./demos/numflow-0";
import { TableDemo0Component } from "./demos/table-0";
import { TableDemo1Component } from "./demos/table-1";
import { TableDemo2Component } from "./demos/table-2";
import { TableDemo3Component } from "./demos/table-3";
import { TableDemo4Component } from "./demos/table-4";
import { TableDemo5Component } from "./demos/table-5";
import { TableDemo6Component } from "./demos/table-6";
import { TableDemo7Component } from "./demos/table-7";
import { TableDemo8Component } from "./demos/table-8";
import { GridStatesComponent } from "./demos/grid-states";
import { GridEditComponent } from "./demos/grid-edit";
import { GridRemoteComponent } from "./demos/grid-remote";
import { GridRenderComponent } from "./demos/grid-render";
import { GridSelectComponent } from "./demos/grid-select";
import { GridSortComponent } from "./demos/grid-sort";
import { GridDemo0Component } from "./demos/grid-0";
import { CgridControlledComponent } from "./demos/cgrid-controlled";
import { CgridEventsComponent } from "./demos/cgrid-events";
import { CgridMillionComponent } from "./demos/cgrid-million";
import { CgridBasicComponent } from "./demos/cgrid-basic";
import { CgridDemo0Component } from "./demos/cgrid-0";
import { ListDemo0Component } from "./demos/list-0";
import { CardDemo0Component } from "./demos/card-0";
import { TagsAvatarComponent } from "./demos/tags-avatar";
import { TagsBadgeComponent } from "./demos/tags-badge";
import { TagsBasicComponent } from "./demos/tags-basic";
import { TagsDemo0Component } from "./demos/tags-0";
import { CollapseControlledComponent } from "./demos/collapse-controlled";
import { CollapseSingleComponent } from "./demos/collapse-single";
import { CollapseBasicComponent } from "./demos/collapse-basic";
import { CollapseDemo0Component } from "./demos/collapse-0";
import { ScrollareaDemo0Component } from "./demos/scrollarea-0";
import { ScrollareaDemo1Component } from "./demos/scrollarea-1";
import { ScrollareaDemo2Component } from "./demos/scrollarea-2";
import { ScrollareaDemo3Component } from "./demos/scrollarea-3";
import { ScrollareaDemo4Component } from "./demos/scrollarea-4";
import { ScrollareaDemo5Component } from "./demos/scrollarea-5";
import { ScrollareaDemo6Component } from "./demos/scrollarea-6";
import { VlistDemo0Component } from "./demos/vlist-0";
import { ChatDemo0Component } from "./demos/chat-0";
import { MdDemo0Component } from "./demos/md-0";
import { FlowDemo0Component } from "./demos/flow-0";
import { FlowstressDemo0Component } from "./demos/flowstress-0";
import { ImageDemo0Component } from "./demos/image-0";
import { MediaDemo0Component } from "./demos/media-0";
import { UploadDemo0Component } from "./demos/upload-0";
import { SidebarDemo0Component } from "./demos/sidebar-0";
import { TabsStepsComponent } from "./demos/tabs-steps";
import { TabsPagerComponent } from "./demos/tabs-pager";
import { TabsControlledComponent } from "./demos/tabs-controlled";
import { TabsBasicComponent } from "./demos/tabs-basic";
import { TabsDemo0Component } from "./demos/tabs-0";
import { ReorderDemo0Component } from "./demos/reorder-0";
import { AddremoveDemo0Component } from "./demos/addremove-0";
import { OptimisticDemo0Component } from "./demos/optimistic-0";
import { ButtonBasicComponent } from "./demos/button-basic";
import { ButtonVariantsComponent } from "./demos/button-variants";
import { ButtonSizesComponent } from "./demos/button-sizes";
import { ButtonIconsComponent } from "./demos/button-icons";
import { ButtonStatesComponent } from "./demos/button-states";
import { ButtonBusyComponent } from "./demos/button-busy";
import { ButtonActionsComponent } from "./demos/button-actions";
import { ButtonMobileComponent } from "./demos/button-mobile";
import { DialogBasicComponent } from "./demos/dialog-basic";
import { DialogDangerComponent } from "./demos/dialog-danger";
import { DialogGuardComponent } from "./demos/dialog-guard";
import { DialogEventsComponent } from "./demos/dialog-events";
import { DialogControlledComponent } from "./demos/dialog-controlled";
import { GridBasicComponent } from "./demos/grid-basic";
import { PickerBasicComponent } from "./demos/picker-basic";
import { PickerRangeComponent } from "./demos/picker-range";
import { PickerTimeComponent } from "./demos/picker-time";
import { PickerDatetimeComponent } from "./demos/picker-datetime";
import { PickerRegionComponent } from "./demos/picker-region";
import { PickerEventsComponent } from "./demos/picker-events";
import { SelectBasicComponent } from "./demos/select-basic";
import { SelectPlaceholderComponent } from "./demos/select-placeholder";
import { SelectOptionsComponent } from "./demos/select-options";
import { SelectFieldComponent } from "./demos/select-field";
import { SelectEventsComponent } from "./demos/select-events";
import { SelectControlledComponent } from "./demos/select-controlled";
import { SelectMenuComponent } from "./demos/select-menu";

@Component({
  selector: "app-root",
  imports: [ColorDemo0Component, TypeDemo0Component, TypeDemo1Component, TypeDemo2Component, SpacingDemo0Component, SpacingDemo1Component, SpacingDemo2Component, SpacingDemo3Component, LayoutDemo0Component, LayoutDemo1Component, SpaceDemo0Component, SpaceDemo1Component, ElevationDemo0Component, MotionDemo0Component, IconsDemo0Component, ButtonDemo0Component, ButtonDemo1Component, ButtonDemo2Component, ButtonDemo3Component, IconbuttonControlledComponent, IconbuttonStatesComponent, IconbuttonVariantsComponent, IconbuttonBasicComponent, IconbuttonDemo0Component, LinkArrowComponent, LinkTextbtnComponent, LinkBasicComponent, LinkDemo0Component, CompoundDemo0Component, ChipRemovableComponent, ChipControlledComponent, ChipBasicComponent, ChipDemo0Component, FieldOptionalComponent, FieldErrorComponent, FieldBasicComponent, FieldDemo0Component, InputControlledComponent, InputSizesComponent, InputBasicComponent, InputDemo0Component, InputDemo1Component, InputDemo2Component, SpecialDemo0Component, CountDemo0Component, TaginputHintComponent, TaginputControlledComponent, TaginputBasicComponent, TaginputDemo0Component, NumberRangeComponent, NumberControlledComponent, NumberBasicComponent, NumberDemo0Component, PromptDemo0Component, SelectDemo0Component, PickerDemo0Component, ChoiceControlledComponent, ChoiceRadioComponent, ChoiceBasicComponent, ChoiceDemo0Component, SegmentedSizesComponent, SegmentedControlledComponent, SegmentedBasicComponent, SegmentedDemo0Component, SliderMaxComponent, SliderControlledComponent, SliderBasicComponent, SliderDemo0Component, OtpLengthComponent, OtpCompleteComponent, OtpBasicComponent, OtpDemo0Component, TooltipTruncateComponent, TooltipKbdComponent, TooltipBasicComponent, TooltipDemo0Component, PopoverAlignComponent, PopoverControlledComponent, PopoverBasicComponent, PopoverDemo0Component, PopconfirmDemo0Component, CtxmenuSubmenuComponent, CtxmenuContextComponent, CtxmenuBasicComponent, CtxmenuDemo0Component, DialogDemo0Component, DrawerFooterComponent, DrawerControlledComponent, DrawerBasicComponent, DrawerDemo0Component, CmdkHotkeyComponent, CmdkEmptyComponent, CmdkBasicComponent, CmdkDemo0Component, ToastProgressComponent, ToastActionComponent, ToastBasicComponent, ToastDemo0Component, NotifyFailComponent, NotifyActionsComponent, NotifyBasicComponent, NotifyDemo0Component, BannerDemo0Component, EmptyErrorComponent, EmptySearchComponent, EmptyBasicComponent, EmptyDemo0Component, LoadingDemo0Component, ProgressControlledComponent, ProgressRingComponent, ProgressBasicComponent, ProgressDemo0Component, NumflowStylesComponent, NumflowCounterComponent, NumflowBasicComponent, NumflowDemo0Component, TableDemo0Component, TableDemo1Component, TableDemo2Component, TableDemo3Component, TableDemo4Component, TableDemo5Component, TableDemo6Component, TableDemo7Component, TableDemo8Component, GridStatesComponent, GridEditComponent, GridRemoteComponent, GridRenderComponent, GridSelectComponent, GridSortComponent, GridDemo0Component, CgridControlledComponent, CgridEventsComponent, CgridMillionComponent, CgridBasicComponent, CgridDemo0Component, ListDemo0Component, CardDemo0Component, TagsAvatarComponent, TagsBadgeComponent, TagsBasicComponent, TagsDemo0Component, CollapseControlledComponent, CollapseSingleComponent, CollapseBasicComponent, CollapseDemo0Component, ScrollareaDemo0Component, ScrollareaDemo1Component, ScrollareaDemo2Component, ScrollareaDemo3Component, ScrollareaDemo4Component, ScrollareaDemo5Component, ScrollareaDemo6Component, VlistDemo0Component, ChatDemo0Component, MdDemo0Component, FlowDemo0Component, FlowstressDemo0Component, ImageDemo0Component, MediaDemo0Component, UploadDemo0Component, SidebarDemo0Component, TabsStepsComponent, TabsPagerComponent, TabsControlledComponent, TabsBasicComponent, TabsDemo0Component, ReorderDemo0Component, AddremoveDemo0Component, OptimisticDemo0Component, ButtonBasicComponent, ButtonVariantsComponent, ButtonSizesComponent, ButtonIconsComponent, ButtonStatesComponent, ButtonBusyComponent, ButtonActionsComponent, ButtonMobileComponent, DialogBasicComponent, DialogDangerComponent, DialogGuardComponent, DialogEventsComponent, DialogControlledComponent, GridBasicComponent, PickerBasicComponent, PickerRangeComponent, PickerTimeComponent, PickerDatetimeComponent, PickerRegionComponent, PickerEventsComponent, SelectBasicComponent, SelectPlaceholderComponent, SelectOptionsComponent, SelectFieldComponent, SelectEventsComponent, SelectControlledComponent, SelectMenuComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrl: "../../shared/gallery.css",
  template: `
<main class="gallery">
  <section id="color">
    <h2>颜色</h2>
    <div class="demo" data-demo="color-0"><demo-color-0 /></div>
  </section>
  <section id="type">
    <h2>排版</h2>
    <div class="demo" data-demo="type-0"><demo-type-0 /></div>
    <div class="demo" data-demo="type-1"><demo-type-1 /></div>
    <div class="demo" data-demo="type-2"><demo-type-2 /></div>
  </section>
  <section id="spacing">
    <h2>间距</h2>
    <div class="demo" data-demo="spacing-0"><demo-spacing-0 /></div>
    <div class="demo" data-demo="spacing-1"><demo-spacing-1 /></div>
    <div class="demo" data-demo="spacing-2"><demo-spacing-2 /></div>
    <div class="demo" data-demo="spacing-3"><demo-spacing-3 /></div>
  </section>
  <section id="layout">
    <h2>布局</h2>
    <div class="demo" data-demo="layout-0"><demo-layout-0 /></div>
    <div class="demo" data-demo="layout-1"><demo-layout-1 /></div>
  </section>
  <section id="space">
    <h2>圆角与线</h2>
    <div class="demo" data-demo="space-0"><demo-space-0 /></div>
    <div class="demo" data-demo="space-1"><demo-space-1 /></div>
  </section>
  <section id="elevation">
    <h2>阴影与层级</h2>
    <div class="demo" data-demo="elevation-0"><demo-elevation-0 /></div>
  </section>
  <section id="motion">
    <h2>动效曲线</h2>
    <div class="demo" data-demo="motion-0"><demo-motion-0 /></div>
  </section>
  <section id="icons">
    <h2>图标</h2>
    <div class="demo" data-demo="icons-0"><demo-icons-0 /></div>
  </section>
  <section id="button">
    <h2>按钮</h2>
    <div class="demo" data-demo="button-0"><demo-button-0 /></div>
    <div class="demo" data-demo="button-1"><demo-button-1 /></div>
    <div class="demo" data-demo="button-2"><demo-button-2 /></div>
    <div class="demo" data-demo="button-3"><demo-button-3 /></div>
  </section>
  <section id="iconbutton">
    <h2>纯图标按钮</h2>
    <div class="demo" data-demo="iconbutton-controlled"><demo-iconbutton-controlled /></div>
    <div class="demo" data-demo="iconbutton-states"><demo-iconbutton-states /></div>
    <div class="demo" data-demo="iconbutton-variants"><demo-iconbutton-variants /></div>
    <div class="demo" data-demo="iconbutton-basic"><demo-iconbutton-basic /></div>
    <div class="demo" data-demo="iconbutton-0"><demo-iconbutton-0 /></div>
  </section>
  <section id="link">
    <h2>文字链接与文字按钮</h2>
    <div class="demo" data-demo="link-arrow"><demo-link-arrow /></div>
    <div class="demo" data-demo="link-textbtn"><demo-link-textbtn /></div>
    <div class="demo" data-demo="link-basic"><demo-link-basic /></div>
    <div class="demo" data-demo="link-0"><demo-link-0 /></div>
  </section>
  <section id="compound">
    <h2>组合按钮</h2>
    <div class="demo" data-demo="compound-0"><demo-compound-0 /></div>
  </section>
  <section id="chip">
    <h2>切换芯片</h2>
    <div class="demo" data-demo="chip-removable"><demo-chip-removable /></div>
    <div class="demo" data-demo="chip-controlled"><demo-chip-controlled /></div>
    <div class="demo" data-demo="chip-basic"><demo-chip-basic /></div>
    <div class="demo" data-demo="chip-0"><demo-chip-0 /></div>
  </section>
  <section id="field">
    <h2>字段与错误</h2>
    <div class="demo" data-demo="field-optional"><demo-field-optional /></div>
    <div class="demo" data-demo="field-error"><demo-field-error /></div>
    <div class="demo" data-demo="field-basic"><demo-field-basic /></div>
    <div class="demo" data-demo="field-0"><demo-field-0 /></div>
  </section>
  <section id="input">
    <h2>输入框</h2>
    <div class="demo" data-demo="input-controlled"><demo-input-controlled /></div>
    <div class="demo" data-demo="input-sizes"><demo-input-sizes /></div>
    <div class="demo" data-demo="input-basic"><demo-input-basic /></div>
    <div class="demo" data-demo="input-0"><demo-input-0 /></div>
    <div class="demo" data-demo="input-1"><demo-input-1 /></div>
    <div class="demo" data-demo="input-2"><demo-input-2 /></div>
  </section>
  <section id="special">
    <h2>搜索、密码、邮箱</h2>
    <div class="demo" data-demo="special-0"><demo-special-0 /></div>
  </section>
  <section id="count">
    <h2>字数统计</h2>
    <div class="demo" data-demo="count-0"><demo-count-0 /></div>
  </section>
  <section id="taginput">
    <h2>标签输入</h2>
    <div class="demo" data-demo="taginput-hint"><demo-taginput-hint /></div>
    <div class="demo" data-demo="taginput-controlled"><demo-taginput-controlled /></div>
    <div class="demo" data-demo="taginput-basic"><demo-taginput-basic /></div>
    <div class="demo" data-demo="taginput-0"><demo-taginput-0 /></div>
  </section>
  <section id="number">
    <h2>数字步进</h2>
    <div class="demo" data-demo="number-range"><demo-number-range /></div>
    <div class="demo" data-demo="number-controlled"><demo-number-controlled /></div>
    <div class="demo" data-demo="number-basic"><demo-number-basic /></div>
    <div class="demo" data-demo="number-0"><demo-number-0 /></div>
  </section>
  <section id="prompt">
    <h2>提示词输入框</h2>
    <div class="demo" data-demo="prompt-0"><demo-prompt-0 /></div>
  </section>
  <section id="select">
    <h2>下拉选择与菜单</h2>
    <div class="demo" data-demo="select-0"><demo-select-0 /></div>
  </section>
  <section id="picker">
    <h2>日期、时间、地址</h2>
    <div class="demo" data-demo="picker-0"><demo-picker-0 /></div>
  </section>
  <section id="choice">
    <h2>复选、单选、开关</h2>
    <div class="demo" data-demo="choice-controlled"><demo-choice-controlled /></div>
    <div class="demo" data-demo="choice-radio"><demo-choice-radio /></div>
    <div class="demo" data-demo="choice-basic"><demo-choice-basic /></div>
    <div class="demo" data-demo="choice-0"><demo-choice-0 /></div>
  </section>
  <section id="segmented">
    <h2>分段控件</h2>
    <div class="demo" data-demo="segmented-sizes"><demo-segmented-sizes /></div>
    <div class="demo" data-demo="segmented-controlled"><demo-segmented-controlled /></div>
    <div class="demo" data-demo="segmented-basic"><demo-segmented-basic /></div>
    <div class="demo" data-demo="segmented-0"><demo-segmented-0 /></div>
  </section>
  <section id="slider">
    <h2>滑块</h2>
    <div class="demo" data-demo="slider-max"><demo-slider-max /></div>
    <div class="demo" data-demo="slider-controlled"><demo-slider-controlled /></div>
    <div class="demo" data-demo="slider-basic"><demo-slider-basic /></div>
    <div class="demo" data-demo="slider-0"><demo-slider-0 /></div>
  </section>
  <section id="otp">
    <h2>验证码</h2>
    <div class="demo" data-demo="otp-length"><demo-otp-length /></div>
    <div class="demo" data-demo="otp-complete"><demo-otp-complete /></div>
    <div class="demo" data-demo="otp-basic"><demo-otp-basic /></div>
    <div class="demo" data-demo="otp-0"><demo-otp-0 /></div>
  </section>
  <section id="tooltip">
    <h2>文字提示</h2>
    <div class="demo" data-demo="tooltip-truncate"><demo-tooltip-truncate /></div>
    <div class="demo" data-demo="tooltip-kbd"><demo-tooltip-kbd /></div>
    <div class="demo" data-demo="tooltip-basic"><demo-tooltip-basic /></div>
    <div class="demo" data-demo="tooltip-0"><demo-tooltip-0 /></div>
  </section>
  <section id="popover">
    <h2>弹出面板</h2>
    <div class="demo" data-demo="popover-align"><demo-popover-align /></div>
    <div class="demo" data-demo="popover-controlled"><demo-popover-controlled /></div>
    <div class="demo" data-demo="popover-basic"><demo-popover-basic /></div>
    <div class="demo" data-demo="popover-0"><demo-popover-0 /></div>
  </section>
  <section id="popconfirm">
    <h2>气泡确认</h2>
    <div class="demo" data-demo="popconfirm-0"><demo-popconfirm-0 /></div>
  </section>
  <section id="ctxmenu">
    <h2>右键菜单与子菜单</h2>
    <div class="demo" data-demo="ctxmenu-submenu"><demo-ctxmenu-submenu /></div>
    <div class="demo" data-demo="ctxmenu-context"><demo-ctxmenu-context /></div>
    <div class="demo" data-demo="ctxmenu-basic"><demo-ctxmenu-basic /></div>
    <div class="demo" data-demo="ctxmenu-0"><demo-ctxmenu-0 /></div>
  </section>
  <section id="dialog">
    <h2>弹窗</h2>
    <div class="demo" data-demo="dialog-0"><demo-dialog-0 /></div>
  </section>
  <section id="drawer">
    <h2>抽屉</h2>
    <div class="demo" data-demo="drawer-footer"><demo-drawer-footer /></div>
    <div class="demo" data-demo="drawer-controlled"><demo-drawer-controlled /></div>
    <div class="demo" data-demo="drawer-basic"><demo-drawer-basic /></div>
    <div class="demo" data-demo="drawer-0"><demo-drawer-0 /></div>
  </section>
  <section id="cmdk">
    <h2>命令面板</h2>
    <div class="demo" data-demo="cmdk-hotkey"><demo-cmdk-hotkey /></div>
    <div class="demo" data-demo="cmdk-empty"><demo-cmdk-empty /></div>
    <div class="demo" data-demo="cmdk-basic"><demo-cmdk-basic /></div>
    <div class="demo" data-demo="cmdk-0"><demo-cmdk-0 /></div>
  </section>
  <section id="toast">
    <h2>轻提示</h2>
    <div class="demo" data-demo="toast-progress"><demo-toast-progress /></div>
    <div class="demo" data-demo="toast-action"><demo-toast-action /></div>
    <div class="demo" data-demo="toast-basic"><demo-toast-basic /></div>
    <div class="demo" data-demo="toast-0"><demo-toast-0 /></div>
  </section>
  <section id="notify">
    <h2>通知</h2>
    <div class="demo" data-demo="notify-fail"><demo-notify-fail /></div>
    <div class="demo" data-demo="notify-actions"><demo-notify-actions /></div>
    <div class="demo" data-demo="notify-basic"><demo-notify-basic /></div>
    <div class="demo" data-demo="notify-0"><demo-notify-0 /></div>
  </section>
  <section id="banner">
    <h2>横幅与条目上的失败</h2>
    <div class="demo" data-demo="banner-0"><demo-banner-0 /></div>
  </section>
  <section id="empty">
    <h2>空状态</h2>
    <div class="demo" data-demo="empty-error"><demo-empty-error /></div>
    <div class="demo" data-demo="empty-search"><demo-empty-search /></div>
    <div class="demo" data-demo="empty-basic"><demo-empty-basic /></div>
    <div class="demo" data-demo="empty-0"><demo-empty-0 /></div>
  </section>
  <section id="loading">
    <h2>骨架与加载</h2>
    <div class="demo" data-demo="loading-0"><demo-loading-0 /></div>
  </section>
  <section id="progress">
    <h2>进度</h2>
    <div class="demo" data-demo="progress-controlled"><demo-progress-controlled /></div>
    <div class="demo" data-demo="progress-ring"><demo-progress-ring /></div>
    <div class="demo" data-demo="progress-basic"><demo-progress-basic /></div>
    <div class="demo" data-demo="progress-0"><demo-progress-0 /></div>
  </section>
  <section id="numflow">
    <h2>数字变化</h2>
    <div class="demo" data-demo="numflow-styles"><demo-numflow-styles /></div>
    <div class="demo" data-demo="numflow-counter"><demo-numflow-counter /></div>
    <div class="demo" data-demo="numflow-basic"><demo-numflow-basic /></div>
    <div class="demo" data-demo="numflow-0"><demo-numflow-0 /></div>
  </section>
  <section id="table">
    <h2>表格</h2>
    <div class="demo" data-demo="table-0"><demo-table-0 /></div>
    <div class="demo" data-demo="table-1"><demo-table-1 /></div>
    <div class="demo" data-demo="table-2"><demo-table-2 /></div>
    <div class="demo" data-demo="table-3"><demo-table-3 /></div>
    <div class="demo" data-demo="table-4"><demo-table-4 /></div>
    <div class="demo" data-demo="table-5"><demo-table-5 /></div>
    <div class="demo" data-demo="table-6"><demo-table-6 /></div>
    <div class="demo" data-demo="table-7"><demo-table-7 /></div>
    <div class="demo" data-demo="table-8"><demo-table-8 /></div>
  </section>
  <section id="grid">
    <h2>数据表格 · DOM</h2>
    <div class="demo" data-demo="grid-states"><demo-grid-states /></div>
    <div class="demo" data-demo="grid-edit"><demo-grid-edit /></div>
    <div class="demo" data-demo="grid-remote"><demo-grid-remote /></div>
    <div class="demo" data-demo="grid-render"><demo-grid-render /></div>
    <div class="demo" data-demo="grid-select"><demo-grid-select /></div>
    <div class="demo" data-demo="grid-sort"><demo-grid-sort /></div>
    <div class="demo" data-demo="grid-0"><demo-grid-0 /></div>
  </section>
  <section id="cgrid">
    <h2>数据表格 · Canvas</h2>
    <div class="demo" data-demo="cgrid-controlled"><demo-cgrid-controlled /></div>
    <div class="demo" data-demo="cgrid-events"><demo-cgrid-events /></div>
    <div class="demo" data-demo="cgrid-million"><demo-cgrid-million /></div>
    <div class="demo" data-demo="cgrid-basic"><demo-cgrid-basic /></div>
    <div class="demo" data-demo="cgrid-0"><demo-cgrid-0 /></div>
  </section>
  <section id="list">
    <h2>列表与键值</h2>
    <div class="demo" data-demo="list-0"><demo-list-0 /></div>
  </section>
  <section id="card">
    <h2>卡片</h2>
    <div class="demo" data-demo="card-0"><demo-card-0 /></div>
  </section>
  <section id="tags">
    <h2>标签、徽标与头像</h2>
    <div class="demo" data-demo="tags-avatar"><demo-tags-avatar /></div>
    <div class="demo" data-demo="tags-badge"><demo-tags-badge /></div>
    <div class="demo" data-demo="tags-basic"><demo-tags-basic /></div>
    <div class="demo" data-demo="tags-0"><demo-tags-0 /></div>
  </section>
  <section id="collapse">
    <h2>折叠面板</h2>
    <div class="demo" data-demo="collapse-controlled"><demo-collapse-controlled /></div>
    <div class="demo" data-demo="collapse-single"><demo-collapse-single /></div>
    <div class="demo" data-demo="collapse-basic"><demo-collapse-basic /></div>
    <div class="demo" data-demo="collapse-0"><demo-collapse-0 /></div>
  </section>
  <section id="scrollarea">
    <h2>滚动区域</h2>
    <div class="demo" data-demo="scrollarea-0"><demo-scrollarea-0 /></div>
    <div class="demo" data-demo="scrollarea-1"><demo-scrollarea-1 /></div>
    <div class="demo" data-demo="scrollarea-2"><demo-scrollarea-2 /></div>
    <div class="demo" data-demo="scrollarea-3"><demo-scrollarea-3 /></div>
    <div class="demo" data-demo="scrollarea-4"><demo-scrollarea-4 /></div>
    <div class="demo" data-demo="scrollarea-5"><demo-scrollarea-5 /></div>
    <div class="demo" data-demo="scrollarea-6"><demo-scrollarea-6 /></div>
  </section>
  <section id="vlist">
    <h2>无限列表</h2>
    <div class="demo" data-demo="vlist-0"><demo-vlist-0 /></div>
  </section>
  <section id="chat">
    <h2>聊天与 AI 对话</h2>
    <div class="demo" data-demo="chat-0"><demo-chat-0 /></div>
  </section>
  <section id="md">
    <h2>Markdown 文档</h2>
    <div class="demo" data-demo="md-0"><demo-md-0 /></div>
  </section>
  <section id="flow">
    <h2>流程图</h2>
    <div class="demo" data-demo="flow-0"><demo-flow-0 /></div>
  </section>
  <section id="flowstress">
    <h2>万级节点压测</h2>
    <div class="demo" data-demo="flowstress-0"><demo-flowstress-0 /></div>
  </section>
  <section id="image">
    <h2>图片</h2>
    <div class="demo" data-demo="image-0"><demo-image-0 /></div>
  </section>
  <section id="media">
    <h2>视频与音频</h2>
    <div class="demo" data-demo="media-0"><demo-media-0 /></div>
  </section>
  <section id="upload">
    <h2>上传</h2>
    <div class="demo" data-demo="upload-0"><demo-upload-0 /></div>
  </section>
  <section id="sidebar">
    <h2>侧栏与布局</h2>
    <div class="demo" data-demo="sidebar-0"><demo-sidebar-0 /></div>
  </section>
  <section id="tabs">
    <h2>标签页、面包屑、分页、步骤</h2>
    <div class="demo" data-demo="tabs-steps"><demo-tabs-steps /></div>
    <div class="demo" data-demo="tabs-pager"><demo-tabs-pager /></div>
    <div class="demo" data-demo="tabs-controlled"><demo-tabs-controlled /></div>
    <div class="demo" data-demo="tabs-basic"><demo-tabs-basic /></div>
    <div class="demo" data-demo="tabs-0"><demo-tabs-0 /></div>
  </section>
  <section id="reorder">
    <h2>拖拽重排</h2>
    <div class="demo" data-demo="reorder-0"><demo-reorder-0 /></div>
  </section>
  <section id="addremove">
    <h2>新增与删除</h2>
    <div class="demo" data-demo="addremove-0"><demo-addremove-0 /></div>
  </section>
  <section id="optimistic">
    <h2>乐观更新</h2>
    <div class="demo" data-demo="optimistic-0"><demo-optimistic-0 /></div>
  </section>
  <section id="button">
    <h2>按钮</h2>
    <div class="demo" data-demo="button-basic"><demo-button-basic /></div>
    <div class="demo" data-demo="button-variants"><demo-button-variants /></div>
    <div class="demo" data-demo="button-sizes"><demo-button-sizes /></div>
    <div class="demo" data-demo="button-icons"><demo-button-icons /></div>
    <div class="demo" data-demo="button-states"><demo-button-states /></div>
    <div class="demo" data-demo="button-busy"><demo-button-busy /></div>
    <div class="demo" data-demo="button-actions"><demo-button-actions /></div>
    <div class="demo" data-demo="button-mobile"><demo-button-mobile /></div>
  </section>
  <section id="dialog">
    <h2>弹窗</h2>
    <div class="demo" data-demo="dialog-basic"><demo-dialog-basic /></div>
    <div class="demo" data-demo="dialog-danger"><demo-dialog-danger /></div>
    <div class="demo" data-demo="dialog-guard"><demo-dialog-guard /></div>
    <div class="demo" data-demo="dialog-events"><demo-dialog-events /></div>
    <div class="demo" data-demo="dialog-controlled"><demo-dialog-controlled /></div>
  </section>
  <section id="grid">
    <h2>数据表格</h2>
    <div class="demo" data-demo="grid-basic"><demo-grid-basic /></div>
  </section>
  <section id="picker">
    <h2>日期、时间、地址</h2>
    <div class="demo" data-demo="picker-basic"><demo-picker-basic /></div>
    <div class="demo" data-demo="picker-range"><demo-picker-range /></div>
    <div class="demo" data-demo="picker-time"><demo-picker-time /></div>
    <div class="demo" data-demo="picker-datetime"><demo-picker-datetime /></div>
    <div class="demo" data-demo="picker-region"><demo-picker-region /></div>
    <div class="demo" data-demo="picker-events"><demo-picker-events /></div>
  </section>
  <section id="select">
    <h2>下拉选择与菜单</h2>
    <div class="demo" data-demo="select-basic"><demo-select-basic /></div>
    <div class="demo" data-demo="select-placeholder"><demo-select-placeholder /></div>
    <div class="demo" data-demo="select-options"><demo-select-options /></div>
    <div class="demo" data-demo="select-field"><demo-select-field /></div>
    <div class="demo" data-demo="select-events"><demo-select-events /></div>
    <div class="demo" data-demo="select-controlled"><demo-select-controlled /></div>
    <div class="demo" data-demo="select-menu"><demo-select-menu /></div>
  </section>
</main>`,
})
export class Gallery {}
