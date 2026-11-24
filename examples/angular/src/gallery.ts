// 由 scripts/examples/gallery-entries.mjs 生成，别手改：设计稿 61 块的全部演示排成一页（每个演示是 src/demos/ 里的一个组件）
import { Component, ErrorHandler, ViewEncapsulation } from "@angular/core";
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
import { SpaceDemo2Component } from "./demos/space-2";
import { ElevationDemo0Component } from "./demos/elevation-0";
import { MotionDemo0Component } from "./demos/motion-0";
import { LoadingmotionDemo0Component } from "./demos/loadingmotion-0";
import { IconsDemo0Component } from "./demos/icons-0";
import { IconsDemo1Component } from "./demos/icons-1";
import { FeelDemo0Component } from "./demos/feel-0";
import { ButtonDemo0Component } from "./demos/button-0";
import { ButtonDemo1Component } from "./demos/button-1";
import { ButtonDemo2Component } from "./demos/button-2";
import { ButtonDemo3Component } from "./demos/button-3";
import { IconbuttonDemo0Component } from "./demos/iconbutton-0";
import { LinkDemo0Component } from "./demos/link-0";
import { CompoundDemo0Component } from "./demos/compound-0";
import { ChipDemo0Component } from "./demos/chip-0";
import { FieldDemo0Component } from "./demos/field-0";
import { InputDemo0Component } from "./demos/input-0";
import { InputDemo1Component } from "./demos/input-1";
import { InputDemo2Component } from "./demos/input-2";
import { SpecialDemo0Component } from "./demos/special-0";
import { CountDemo0Component } from "./demos/count-0";
import { TaginputDemo0Component } from "./demos/taginput-0";
import { NumberDemo0Component } from "./demos/number-0";
import { PromptDemo0Component } from "./demos/prompt-0";
import { SelectDemo0Component } from "./demos/select-0";
import { PickerDemo0Component } from "./demos/picker-0";
import { ChoiceDemo0Component } from "./demos/choice-0";
import { SegmentedDemo0Component } from "./demos/segmented-0";
import { SliderDemo0Component } from "./demos/slider-0";
import { OtpDemo0Component } from "./demos/otp-0";
import { TooltipDemo0Component } from "./demos/tooltip-0";
import { PopoverDemo0Component } from "./demos/popover-0";
import { PopconfirmDemo0Component } from "./demos/popconfirm-0";
import { CtxmenuDemo0Component } from "./demos/ctxmenu-0";
import { DialogDemo0Component } from "./demos/dialog-0";
import { DrawerDemo0Component } from "./demos/drawer-0";
import { CmdkDemo0Component } from "./demos/cmdk-0";
import { ToastDemo0Component } from "./demos/toast-0";
import { NotifyDemo0Component } from "./demos/notify-0";
import { BannerDemo0Component } from "./demos/banner-0";
import { EmptyDemo0Component } from "./demos/empty-0";
import { LoadingDemo0Component } from "./demos/loading-0";
import { LoadingDemo1Component } from "./demos/loading-1";
import { ProgressDemo0Component } from "./demos/progress-0";
import { NumflowDemo0Component } from "./demos/numflow-0";
import { TableDemo0Component } from "./demos/table-0";
import { TableDemo1Component } from "./demos/table-1";
import { TableDemo2Component } from "./demos/table-2";
import { TableDemo3Component } from "./demos/table-3";
import { TableDemo4Component } from "./demos/table-4";
import { TableDemo5Component } from "./demos/table-5";
import { TableDemo6Component } from "./demos/table-6";
import { TableDemo7Component } from "./demos/table-7";
import { GridDemo0Component } from "./demos/grid-0";
import { CgridDemo0Component } from "./demos/cgrid-0";
import { ChartsDemo0Component } from "./demos/charts-0";
import { ChartsDemo1Component } from "./demos/charts-1";
import { ChartsDemo2Component } from "./demos/charts-2";
import { ChartsDemo3Component } from "./demos/charts-3";
import { ListDemo0Component } from "./demos/list-0";
import { CardDemo0Component } from "./demos/card-0";
import { TagsDemo0Component } from "./demos/tags-0";
import { AvatarDemo0Component } from "./demos/avatar-0";
import { AvatarDemo1Component } from "./demos/avatar-1";
import { AvatarDemo2Component } from "./demos/avatar-2";
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
import { ChatDemo1Component } from "./demos/chat-1";
import { MdDemo0Component } from "./demos/md-0";
import { EditorialDemo0Component } from "./demos/editorial-0";
import { FlowDemo0Component } from "./demos/flow-0";
import { ImageDemo0Component } from "./demos/image-0";
import { MediaDemo0Component } from "./demos/media-0";
import { UploadDemo0Component } from "./demos/upload-0";
import { SidebarDemo0Component } from "./demos/sidebar-0";
import { TabsDemo0Component } from "./demos/tabs-0";
import { ReorderDemo0Component } from "./demos/reorder-0";
import { AddremoveDemo0Component } from "./demos/addremove-0";
import { OptimisticDemo0Component } from "./demos/optimistic-0";
import { AddremoveBasicComponent } from "./demos/addremove-basic";
import { AddremoveUndoComponent } from "./demos/addremove-undo";
import { AddremoveRowsComponent } from "./demos/addremove-rows";
import { AvatarBasicComponent } from "./demos/avatar-basic";
import { AvatarListComponent } from "./demos/avatar-list";
import { BannerBasicComponent } from "./demos/banner-basic";
import { BannerDismissComponent } from "./demos/banner-dismiss";
import { BannerErrorComponent } from "./demos/banner-error";
import { ButtonBasicComponent } from "./demos/button-basic";
import { ButtonVariantsComponent } from "./demos/button-variants";
import { ButtonSizesComponent } from "./demos/button-sizes";
import { ButtonIconsComponent } from "./demos/button-icons";
import { ButtonStatesComponent } from "./demos/button-states";
import { ButtonBusyComponent } from "./demos/button-busy";
import { ButtonActionsComponent } from "./demos/button-actions";
import { ButtonMobileComponent } from "./demos/button-mobile";
import { CardBasicComponent } from "./demos/card-basic";
import { CardGridComponent } from "./demos/card-grid";
import { CardVariantsComponent } from "./demos/card-variants";
import { CardLayoutsComponent } from "./demos/card-layouts";
import { CardContentComponent } from "./demos/card-content";
import { CardSelectComponent } from "./demos/card-select";
import { CgridBasicComponent } from "./demos/cgrid-basic";
import { CgridMillionComponent } from "./demos/cgrid-million";
import { CgridControlledComponent } from "./demos/cgrid-controlled";
import { CgridEventsComponent } from "./demos/cgrid-events";
import { ChatBasicComponent } from "./demos/chat-basic";
import { ChatNewComponent } from "./demos/chat-new";
import { ChatHistoryComponent } from "./demos/chat-history";
import { ChatRichComponent } from "./demos/chat-rich";
import { ChipBasicComponent } from "./demos/chip-basic";
import { ChipControlledComponent } from "./demos/chip-controlled";
import { ChipRemovableComponent } from "./demos/chip-removable";
import { ChoiceBasicComponent } from "./demos/choice-basic";
import { ChoiceRadioComponent } from "./demos/choice-radio";
import { ChoiceControlledComponent } from "./demos/choice-controlled";
import { CmdkBasicComponent } from "./demos/cmdk-basic";
import { CmdkEmptyComponent } from "./demos/cmdk-empty";
import { CmdkHotkeyComponent } from "./demos/cmdk-hotkey";
import { CollapseBasicComponent } from "./demos/collapse-basic";
import { CollapseSingleComponent } from "./demos/collapse-single";
import { CollapseControlledComponent } from "./demos/collapse-controlled";
import { CompoundBasicComponent } from "./demos/compound-basic";
import { CompoundSplitComponent } from "./demos/compound-split";
import { CompoundCopyComponent } from "./demos/compound-copy";
import { CountBasicComponent } from "./demos/count-basic";
import { CountControlledComponent } from "./demos/count-controlled";
import { CountLongtextComponent } from "./demos/count-longtext";
import { CtxmenuBasicComponent } from "./demos/ctxmenu-basic";
import { CtxmenuContextComponent } from "./demos/ctxmenu-context";
import { CtxmenuSubmenuComponent } from "./demos/ctxmenu-submenu";
import { DialogBasicComponent } from "./demos/dialog-basic";
import { DialogDangerComponent } from "./demos/dialog-danger";
import { DialogGuardComponent } from "./demos/dialog-guard";
import { DialogEventsComponent } from "./demos/dialog-events";
import { DialogControlledComponent } from "./demos/dialog-controlled";
import { DrawerBasicComponent } from "./demos/drawer-basic";
import { DrawerControlledComponent } from "./demos/drawer-controlled";
import { DrawerFooterComponent } from "./demos/drawer-footer";
import { EditorialBasicComponent } from "./demos/editorial-basic";
import { EditorialCompareComponent } from "./demos/editorial-compare";
import { EditorialHotspotComponent } from "./demos/editorial-hotspot";
import { EmptyBasicComponent } from "./demos/empty-basic";
import { EmptySearchComponent } from "./demos/empty-search";
import { EmptyErrorComponent } from "./demos/empty-error";
import { EmptyPresetsComponent } from "./demos/empty-presets";
import { FieldBasicComponent } from "./demos/field-basic";
import { FieldErrorComponent } from "./demos/field-error";
import { FieldOptionalComponent } from "./demos/field-optional";
import { FlowBasicComponent } from "./demos/flow-basic";
import { FlowBranchComponent } from "./demos/flow-branch";
import { FlowTidyComponent } from "./demos/flow-tidy";
import { FlowstressManyComponent } from "./demos/flowstress-many";
import { GridBasicComponent } from "./demos/grid-basic";
import { GridSortComponent } from "./demos/grid-sort";
import { GridSelectComponent } from "./demos/grid-select";
import { GridRenderComponent } from "./demos/grid-render";
import { GridRemoteComponent } from "./demos/grid-remote";
import { GridEditComponent } from "./demos/grid-edit";
import { GridStatesComponent } from "./demos/grid-states";
import { IconbuttonBasicComponent } from "./demos/iconbutton-basic";
import { IconbuttonVariantsComponent } from "./demos/iconbutton-variants";
import { IconbuttonStatesComponent } from "./demos/iconbutton-states";
import { IconbuttonControlledComponent } from "./demos/iconbutton-controlled";
import { ImageBasicComponent } from "./demos/image-basic";
import { ImageControlledComponent } from "./demos/image-controlled";
import { ImageFailedComponent } from "./demos/image-failed";
import { InputBasicComponent } from "./demos/input-basic";
import { InputSizesComponent } from "./demos/input-sizes";
import { InputControlledComponent } from "./demos/input-controlled";
import { LinkBasicComponent } from "./demos/link-basic";
import { LinkTextbtnComponent } from "./demos/link-textbtn";
import { LinkArrowComponent } from "./demos/link-arrow";
import { ListBasicComponent } from "./demos/list-basic";
import { ListKvComponent } from "./demos/list-kv";
import { ListSwitchComponent } from "./demos/list-switch";
import { LoadingBasicComponent } from "./demos/loading-basic";
import { LoadingListComponent } from "./demos/loading-list";
import { LoadingQuietComponent } from "./demos/loading-quiet";
import { MdBasicComponent } from "./demos/md-basic";
import { MdStreamComponent } from "./demos/md-stream";
import { MdHeightsComponent } from "./demos/md-heights";
import { MediaBasicComponent } from "./demos/media-basic";
import { MediaAudioComponent } from "./demos/media-audio";
import { MediaMethodsComponent } from "./demos/media-methods";
import { NotifyBasicComponent } from "./demos/notify-basic";
import { NotifyActionsComponent } from "./demos/notify-actions";
import { NotifyFailComponent } from "./demos/notify-fail";
import { NumberBasicComponent } from "./demos/number-basic";
import { NumberControlledComponent } from "./demos/number-controlled";
import { NumberRangeComponent } from "./demos/number-range";
import { NumflowBasicComponent } from "./demos/numflow-basic";
import { NumflowCounterComponent } from "./demos/numflow-counter";
import { NumflowStylesComponent } from "./demos/numflow-styles";
import { OptimisticBasicComponent } from "./demos/optimistic-basic";
import { OptimisticSwitchComponent } from "./demos/optimistic-switch";
import { OptimisticPendingComponent } from "./demos/optimistic-pending";
import { OtpBasicComponent } from "./demos/otp-basic";
import { OtpCompleteComponent } from "./demos/otp-complete";
import { OtpLengthComponent } from "./demos/otp-length";
import { OtpMaskComponent } from "./demos/otp-mask";
import { PickerBasicComponent } from "./demos/picker-basic";
import { PickerRangeComponent } from "./demos/picker-range";
import { PickerTimeComponent } from "./demos/picker-time";
import { PickerDatetimeComponent } from "./demos/picker-datetime";
import { PickerRegionComponent } from "./demos/picker-region";
import { PickerEventsComponent } from "./demos/picker-events";
import { PopconfirmBasicComponent } from "./demos/popconfirm-basic";
import { PopconfirmUndoComponent } from "./demos/popconfirm-undo";
import { PopconfirmSubmitComponent } from "./demos/popconfirm-submit";
import { PopoverBasicComponent } from "./demos/popover-basic";
import { PopoverControlledComponent } from "./demos/popover-controlled";
import { PopoverAlignComponent } from "./demos/popover-align";
import { ProgressBasicComponent } from "./demos/progress-basic";
import { ProgressRingComponent } from "./demos/progress-ring";
import { ProgressControlledComponent } from "./demos/progress-controlled";
import { PromptBasicComponent } from "./demos/prompt-basic";
import { PromptStopComponent } from "./demos/prompt-stop";
import { PromptUploadComponent } from "./demos/prompt-upload";
import { PromptPartsComponent } from "./demos/prompt-parts";
import { ReorderBasicComponent } from "./demos/reorder-basic";
import { ReorderOrderComponent } from "./demos/reorder-order";
import { ReorderSaveComponent } from "./demos/reorder-save";
import { ScrollareaBasicComponent } from "./demos/scrollarea-basic";
import { ScrollareaBarComponent } from "./demos/scrollarea-bar";
import { ScrollareaNoneComponent } from "./demos/scrollarea-none";
import { SegmentedBasicComponent } from "./demos/segmented-basic";
import { SegmentedControlledComponent } from "./demos/segmented-controlled";
import { SegmentedSizesComponent } from "./demos/segmented-sizes";
import { SelectBasicComponent } from "./demos/select-basic";
import { SelectPlaceholderComponent } from "./demos/select-placeholder";
import { SelectOptionsComponent } from "./demos/select-options";
import { SelectFieldComponent } from "./demos/select-field";
import { SelectEventsComponent } from "./demos/select-events";
import { SelectControlledComponent } from "./demos/select-controlled";
import { SelectMenuComponent } from "./demos/select-menu";
import { SidebarBasicComponent } from "./demos/sidebar-basic";
import { SidebarControlledComponent } from "./demos/sidebar-controlled";
import { SidebarFxComponent } from "./demos/sidebar-fx";
import { SliderBasicComponent } from "./demos/slider-basic";
import { SliderControlledComponent } from "./demos/slider-controlled";
import { SliderMaxComponent } from "./demos/slider-max";
import { SpecialBasicComponent } from "./demos/special-basic";
import { SpecialPasswordComponent } from "./demos/special-password";
import { SpecialEmailComponent } from "./demos/special-email";
import { TableBasicComponent } from "./demos/table-basic";
import { TableControlledComponent } from "./demos/table-controlled";
import { TableStatesComponent } from "./demos/table-states";
import { TableTreeComponent } from "./demos/table-tree";
import { TableMergeComponent } from "./demos/table-merge";
import { TableDragComponent } from "./demos/table-drag";
import { TabsBasicComponent } from "./demos/tabs-basic";
import { TabsControlledComponent } from "./demos/tabs-controlled";
import { TabsPagerComponent } from "./demos/tabs-pager";
import { TabsStepsComponent } from "./demos/tabs-steps";
import { TaginputBasicComponent } from "./demos/taginput-basic";
import { TaginputControlledComponent } from "./demos/taginput-controlled";
import { TaginputHintComponent } from "./demos/taginput-hint";
import { TagsBasicComponent } from "./demos/tags-basic";
import { TagsBadgeComponent } from "./demos/tags-badge";
import { TagsAvatarComponent } from "./demos/tags-avatar";
import { ToastBasicComponent } from "./demos/toast-basic";
import { ToastActionComponent } from "./demos/toast-action";
import { ToastProgressComponent } from "./demos/toast-progress";
import { TooltipBasicComponent } from "./demos/tooltip-basic";
import { TooltipKbdComponent } from "./demos/tooltip-kbd";
import { TooltipTruncateComponent } from "./demos/tooltip-truncate";
import { UploadBasicComponent } from "./demos/upload-basic";
import { UploadRealComponent } from "./demos/upload-real";
import { UploadSingleComponent } from "./demos/upload-single";
import { VlistBasicComponent } from "./demos/vlist-basic";
import { VlistTotalComponent } from "./demos/vlist-total";
import { VlistRetryComponent } from "./demos/vlist-retry";

@Component({
  selector: "app-root",
  imports: [ColorDemo0Component, TypeDemo0Component, TypeDemo1Component, TypeDemo2Component, SpacingDemo0Component, SpacingDemo1Component, SpacingDemo2Component, SpacingDemo3Component, LayoutDemo0Component, LayoutDemo1Component, SpaceDemo0Component, SpaceDemo1Component, SpaceDemo2Component, ElevationDemo0Component, MotionDemo0Component, LoadingmotionDemo0Component, IconsDemo0Component, IconsDemo1Component, FeelDemo0Component, ButtonDemo0Component, ButtonDemo1Component, ButtonDemo2Component, ButtonDemo3Component, IconbuttonDemo0Component, LinkDemo0Component, CompoundDemo0Component, ChipDemo0Component, FieldDemo0Component, InputDemo0Component, InputDemo1Component, InputDemo2Component, SpecialDemo0Component, CountDemo0Component, TaginputDemo0Component, NumberDemo0Component, PromptDemo0Component, SelectDemo0Component, PickerDemo0Component, ChoiceDemo0Component, SegmentedDemo0Component, SliderDemo0Component, OtpDemo0Component, TooltipDemo0Component, PopoverDemo0Component, PopconfirmDemo0Component, CtxmenuDemo0Component, DialogDemo0Component, DrawerDemo0Component, CmdkDemo0Component, ToastDemo0Component, NotifyDemo0Component, BannerDemo0Component, EmptyDemo0Component, LoadingDemo0Component, LoadingDemo1Component, ProgressDemo0Component, NumflowDemo0Component, TableDemo0Component, TableDemo1Component, TableDemo2Component, TableDemo3Component, TableDemo4Component, TableDemo5Component, TableDemo6Component, TableDemo7Component, GridDemo0Component, CgridDemo0Component, ChartsDemo0Component, ChartsDemo1Component, ChartsDemo2Component, ChartsDemo3Component, ListDemo0Component, CardDemo0Component, TagsDemo0Component, AvatarDemo0Component, AvatarDemo1Component, AvatarDemo2Component, CollapseDemo0Component, ScrollareaDemo0Component, ScrollareaDemo1Component, ScrollareaDemo2Component, ScrollareaDemo3Component, ScrollareaDemo4Component, ScrollareaDemo5Component, ScrollareaDemo6Component, VlistDemo0Component, ChatDemo0Component, ChatDemo1Component, MdDemo0Component, EditorialDemo0Component, FlowDemo0Component, ImageDemo0Component, MediaDemo0Component, UploadDemo0Component, SidebarDemo0Component, TabsDemo0Component, ReorderDemo0Component, AddremoveDemo0Component, OptimisticDemo0Component, AddremoveBasicComponent, AddremoveUndoComponent, AddremoveRowsComponent, AvatarBasicComponent, AvatarListComponent, BannerBasicComponent, BannerDismissComponent, BannerErrorComponent, ButtonBasicComponent, ButtonVariantsComponent, ButtonSizesComponent, ButtonIconsComponent, ButtonStatesComponent, ButtonBusyComponent, ButtonActionsComponent, ButtonMobileComponent, CardBasicComponent, CardGridComponent, CardVariantsComponent, CardLayoutsComponent, CardContentComponent, CardSelectComponent, CgridBasicComponent, CgridMillionComponent, CgridControlledComponent, CgridEventsComponent, ChatBasicComponent, ChatNewComponent, ChatHistoryComponent, ChatRichComponent, ChipBasicComponent, ChipControlledComponent, ChipRemovableComponent, ChoiceBasicComponent, ChoiceRadioComponent, ChoiceControlledComponent, CmdkBasicComponent, CmdkEmptyComponent, CmdkHotkeyComponent, CollapseBasicComponent, CollapseSingleComponent, CollapseControlledComponent, CompoundBasicComponent, CompoundSplitComponent, CompoundCopyComponent, CountBasicComponent, CountControlledComponent, CountLongtextComponent, CtxmenuBasicComponent, CtxmenuContextComponent, CtxmenuSubmenuComponent, DialogBasicComponent, DialogDangerComponent, DialogGuardComponent, DialogEventsComponent, DialogControlledComponent, DrawerBasicComponent, DrawerControlledComponent, DrawerFooterComponent, EditorialBasicComponent, EditorialCompareComponent, EditorialHotspotComponent, EmptyBasicComponent, EmptySearchComponent, EmptyErrorComponent, EmptyPresetsComponent, FieldBasicComponent, FieldErrorComponent, FieldOptionalComponent, FlowBasicComponent, FlowBranchComponent, FlowTidyComponent, FlowstressManyComponent, GridBasicComponent, GridSortComponent, GridSelectComponent, GridRenderComponent, GridRemoteComponent, GridEditComponent, GridStatesComponent, IconbuttonBasicComponent, IconbuttonVariantsComponent, IconbuttonStatesComponent, IconbuttonControlledComponent, ImageBasicComponent, ImageControlledComponent, ImageFailedComponent, InputBasicComponent, InputSizesComponent, InputControlledComponent, LinkBasicComponent, LinkTextbtnComponent, LinkArrowComponent, ListBasicComponent, ListKvComponent, ListSwitchComponent, LoadingBasicComponent, LoadingListComponent, LoadingQuietComponent, MdBasicComponent, MdStreamComponent, MdHeightsComponent, MediaBasicComponent, MediaAudioComponent, MediaMethodsComponent, NotifyBasicComponent, NotifyActionsComponent, NotifyFailComponent, NumberBasicComponent, NumberControlledComponent, NumberRangeComponent, NumflowBasicComponent, NumflowCounterComponent, NumflowStylesComponent, OptimisticBasicComponent, OptimisticSwitchComponent, OptimisticPendingComponent, OtpBasicComponent, OtpCompleteComponent, OtpLengthComponent, OtpMaskComponent, PickerBasicComponent, PickerRangeComponent, PickerTimeComponent, PickerDatetimeComponent, PickerRegionComponent, PickerEventsComponent, PopconfirmBasicComponent, PopconfirmUndoComponent, PopconfirmSubmitComponent, PopoverBasicComponent, PopoverControlledComponent, PopoverAlignComponent, ProgressBasicComponent, ProgressRingComponent, ProgressControlledComponent, PromptBasicComponent, PromptStopComponent, PromptUploadComponent, PromptPartsComponent, ReorderBasicComponent, ReorderOrderComponent, ReorderSaveComponent, ScrollareaBasicComponent, ScrollareaBarComponent, ScrollareaNoneComponent, SegmentedBasicComponent, SegmentedControlledComponent, SegmentedSizesComponent, SelectBasicComponent, SelectPlaceholderComponent, SelectOptionsComponent, SelectFieldComponent, SelectEventsComponent, SelectControlledComponent, SelectMenuComponent, SidebarBasicComponent, SidebarControlledComponent, SidebarFxComponent, SliderBasicComponent, SliderControlledComponent, SliderMaxComponent, SpecialBasicComponent, SpecialPasswordComponent, SpecialEmailComponent, TableBasicComponent, TableControlledComponent, TableStatesComponent, TableTreeComponent, TableMergeComponent, TableDragComponent, TabsBasicComponent, TabsControlledComponent, TabsPagerComponent, TabsStepsComponent, TaginputBasicComponent, TaginputControlledComponent, TaginputHintComponent, TagsBasicComponent, TagsBadgeComponent, TagsAvatarComponent, ToastBasicComponent, ToastActionComponent, ToastProgressComponent, TooltipBasicComponent, TooltipKbdComponent, TooltipTruncateComponent, UploadBasicComponent, UploadRealComponent, UploadSingleComponent, VlistBasicComponent, VlistTotalComponent, VlistRetryComponent],
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
    <div class="demo" data-demo="space-2"><demo-space-2 /></div>
  </section>
  <section id="elevation">
    <h2>阴影与层级</h2>
    <div class="demo" data-demo="elevation-0"><demo-elevation-0 /></div>
  </section>
  <section id="motion">
    <h2>动效曲线</h2>
    <div class="demo" data-demo="motion-0"><demo-motion-0 /></div>
  </section>
  <section id="loadingmotion">
    <h2>内容加载与过渡</h2>
    <div class="demo" data-demo="loadingmotion-0"><demo-loadingmotion-0 /></div>
  </section>
  <section id="icons">
    <h2>图标</h2>
    <div class="demo" data-demo="icons-0"><demo-icons-0 /></div>
    <div class="demo" data-demo="icons-1"><demo-icons-1 /></div>
  </section>
  <section id="feel">
    <h2>交互质感</h2>
    <div class="demo" data-demo="feel-0"><demo-feel-0 /></div>
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
    <div class="demo" data-demo="iconbutton-0"><demo-iconbutton-0 /></div>
  </section>
  <section id="link">
    <h2>文字链接</h2>
    <div class="demo" data-demo="link-0"><demo-link-0 /></div>
  </section>
  <section id="compound">
    <h2>组合按钮</h2>
    <div class="demo" data-demo="compound-0"><demo-compound-0 /></div>
  </section>
  <section id="chip">
    <h2>切换芯片</h2>
    <div class="demo" data-demo="chip-0"><demo-chip-0 /></div>
  </section>
  <section id="field">
    <h2>字段与错误</h2>
    <div class="demo" data-demo="field-0"><demo-field-0 /></div>
  </section>
  <section id="input">
    <h2>输入框</h2>
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
    <div class="demo" data-demo="taginput-0"><demo-taginput-0 /></div>
  </section>
  <section id="number">
    <h2>数字步进</h2>
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
    <div class="demo" data-demo="choice-0"><demo-choice-0 /></div>
  </section>
  <section id="segmented">
    <h2>分段控件</h2>
    <div class="demo" data-demo="segmented-0"><demo-segmented-0 /></div>
  </section>
  <section id="slider">
    <h2>滑块</h2>
    <div class="demo" data-demo="slider-0"><demo-slider-0 /></div>
  </section>
  <section id="otp">
    <h2>验证码</h2>
    <div class="demo" data-demo="otp-0"><demo-otp-0 /></div>
  </section>
  <section id="tooltip">
    <h2>文字提示</h2>
    <div class="demo" data-demo="tooltip-0"><demo-tooltip-0 /></div>
  </section>
  <section id="popover">
    <h2>弹出面板</h2>
    <div class="demo" data-demo="popover-0"><demo-popover-0 /></div>
  </section>
  <section id="popconfirm">
    <h2>气泡确认</h2>
    <div class="demo" data-demo="popconfirm-0"><demo-popconfirm-0 /></div>
  </section>
  <section id="ctxmenu">
    <h2>右键菜单与子菜单</h2>
    <div class="demo" data-demo="ctxmenu-0"><demo-ctxmenu-0 /></div>
  </section>
  <section id="dialog">
    <h2>弹窗</h2>
    <div class="demo" data-demo="dialog-0"><demo-dialog-0 /></div>
  </section>
  <section id="drawer">
    <h2>抽屉</h2>
    <div class="demo" data-demo="drawer-0"><demo-drawer-0 /></div>
  </section>
  <section id="cmdk">
    <h2>命令面板</h2>
    <div class="demo" data-demo="cmdk-0"><demo-cmdk-0 /></div>
  </section>
  <section id="toast">
    <h2>轻提示</h2>
    <div class="demo" data-demo="toast-0"><demo-toast-0 /></div>
  </section>
  <section id="notify">
    <h2>通知</h2>
    <div class="demo" data-demo="notify-0"><demo-notify-0 /></div>
  </section>
  <section id="banner">
    <h2>横幅与条目上的失败</h2>
    <div class="demo" data-demo="banner-0"><demo-banner-0 /></div>
  </section>
  <section id="empty">
    <h2>空状态</h2>
    <div class="demo" data-demo="empty-0"><demo-empty-0 /></div>
  </section>
  <section id="loading">
    <h2>骨架与加载</h2>
    <div class="demo" data-demo="loading-0"><demo-loading-0 /></div>
    <div class="demo" data-demo="loading-1"><demo-loading-1 /></div>
  </section>
  <section id="progress">
    <h2>进度</h2>
    <div class="demo" data-demo="progress-0"><demo-progress-0 /></div>
  </section>
  <section id="numflow">
    <h2>数字变化</h2>
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
  </section>
  <section id="grid">
    <h2>数据表格</h2>
    <div class="demo" data-demo="grid-0"><demo-grid-0 /></div>
  </section>
  <section id="cgrid">
    <h2>Canvas 表格</h2>
    <div class="demo" data-demo="cgrid-0"><demo-cgrid-0 /></div>
  </section>
  <section id="charts">
    <h2>数据图表与 3D</h2>
    <div class="demo" data-demo="charts-0"><demo-charts-0 /></div>
    <div class="demo" data-demo="charts-1"><demo-charts-1 /></div>
    <div class="demo" data-demo="charts-2"><demo-charts-2 /></div>
    <div class="demo" data-demo="charts-3"><demo-charts-3 /></div>
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
    <div class="demo" data-demo="tags-0"><demo-tags-0 /></div>
  </section>
  <section id="avatar">
    <h2>头像</h2>
    <div class="demo" data-demo="avatar-0"><demo-avatar-0 /></div>
    <div class="demo" data-demo="avatar-1"><demo-avatar-1 /></div>
    <div class="demo" data-demo="avatar-2"><demo-avatar-2 /></div>
  </section>
  <section id="collapse">
    <h2>折叠面板</h2>
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
    <div class="demo" data-demo="chat-1"><demo-chat-1 /></div>
  </section>
  <section id="md">
    <h2>Markdown 文档</h2>
    <div class="demo" data-demo="md-0"><demo-md-0 /></div>
  </section>
  <section id="editorial">
    <h2>图文编排与内容张力</h2>
    <div class="demo" data-demo="editorial-0"><demo-editorial-0 /></div>
  </section>
  <section id="flow">
    <h2>流程图</h2>
    <div class="demo" data-demo="flow-0"><demo-flow-0 /></div>
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
    <h2>标签页、分页、步骤</h2>
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
  <section id="addremove">
    <h2>新增与删除</h2>
    <div class="demo" data-demo="addremove-basic"><demo-addremove-basic /></div>
    <div class="demo" data-demo="addremove-undo"><demo-addremove-undo /></div>
    <div class="demo" data-demo="addremove-rows"><demo-addremove-rows /></div>
  </section>
  <section id="avatar">
    <h2>头像</h2>
    <div class="demo" data-demo="avatar-basic"><demo-avatar-basic /></div>
    <div class="demo" data-demo="avatar-list"><demo-avatar-list /></div>
  </section>
  <section id="banner">
    <h2>横幅与条目上的失败</h2>
    <div class="demo" data-demo="banner-basic"><demo-banner-basic /></div>
    <div class="demo" data-demo="banner-dismiss"><demo-banner-dismiss /></div>
    <div class="demo" data-demo="banner-error"><demo-banner-error /></div>
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
  <section id="card">
    <h2>卡片</h2>
    <div class="demo" data-demo="card-basic"><demo-card-basic /></div>
    <div class="demo" data-demo="card-grid"><demo-card-grid /></div>
    <div class="demo" data-demo="card-variants"><demo-card-variants /></div>
    <div class="demo" data-demo="card-layouts"><demo-card-layouts /></div>
    <div class="demo" data-demo="card-content"><demo-card-content /></div>
    <div class="demo" data-demo="card-select"><demo-card-select /></div>
  </section>
  <section id="cgrid">
    <h2>Canvas 表格</h2>
    <div class="demo" data-demo="cgrid-basic"><demo-cgrid-basic /></div>
    <div class="demo" data-demo="cgrid-million"><demo-cgrid-million /></div>
    <div class="demo" data-demo="cgrid-controlled"><demo-cgrid-controlled /></div>
    <div class="demo" data-demo="cgrid-events"><demo-cgrid-events /></div>
  </section>
  <section id="chat">
    <h2>聊天与 AI 对话</h2>
    <div class="demo" data-demo="chat-basic"><demo-chat-basic /></div>
    <div class="demo" data-demo="chat-new"><demo-chat-new /></div>
    <div class="demo" data-demo="chat-history"><demo-chat-history /></div>
    <div class="demo" data-demo="chat-rich"><demo-chat-rich /></div>
  </section>
  <section id="chip">
    <h2>切换芯片</h2>
    <div class="demo" data-demo="chip-basic"><demo-chip-basic /></div>
    <div class="demo" data-demo="chip-controlled"><demo-chip-controlled /></div>
    <div class="demo" data-demo="chip-removable"><demo-chip-removable /></div>
  </section>
  <section id="choice">
    <h2>复选、单选、开关</h2>
    <div class="demo" data-demo="choice-basic"><demo-choice-basic /></div>
    <div class="demo" data-demo="choice-radio"><demo-choice-radio /></div>
    <div class="demo" data-demo="choice-controlled"><demo-choice-controlled /></div>
  </section>
  <section id="cmdk">
    <h2>命令面板</h2>
    <div class="demo" data-demo="cmdk-basic"><demo-cmdk-basic /></div>
    <div class="demo" data-demo="cmdk-empty"><demo-cmdk-empty /></div>
    <div class="demo" data-demo="cmdk-hotkey"><demo-cmdk-hotkey /></div>
  </section>
  <section id="collapse">
    <h2>折叠面板</h2>
    <div class="demo" data-demo="collapse-basic"><demo-collapse-basic /></div>
    <div class="demo" data-demo="collapse-single"><demo-collapse-single /></div>
    <div class="demo" data-demo="collapse-controlled"><demo-collapse-controlled /></div>
  </section>
  <section id="compound">
    <h2>组合按钮</h2>
    <div class="demo" data-demo="compound-basic"><demo-compound-basic /></div>
    <div class="demo" data-demo="compound-split"><demo-compound-split /></div>
    <div class="demo" data-demo="compound-copy"><demo-compound-copy /></div>
  </section>
  <section id="count">
    <h2>字数统计</h2>
    <div class="demo" data-demo="count-basic"><demo-count-basic /></div>
    <div class="demo" data-demo="count-controlled"><demo-count-controlled /></div>
    <div class="demo" data-demo="count-longtext"><demo-count-longtext /></div>
  </section>
  <section id="ctxmenu">
    <h2>右键菜单与子菜单</h2>
    <div class="demo" data-demo="ctxmenu-basic"><demo-ctxmenu-basic /></div>
    <div class="demo" data-demo="ctxmenu-context"><demo-ctxmenu-context /></div>
    <div class="demo" data-demo="ctxmenu-submenu"><demo-ctxmenu-submenu /></div>
  </section>
  <section id="dialog">
    <h2>弹窗</h2>
    <div class="demo" data-demo="dialog-basic"><demo-dialog-basic /></div>
    <div class="demo" data-demo="dialog-danger"><demo-dialog-danger /></div>
    <div class="demo" data-demo="dialog-guard"><demo-dialog-guard /></div>
    <div class="demo" data-demo="dialog-events"><demo-dialog-events /></div>
    <div class="demo" data-demo="dialog-controlled"><demo-dialog-controlled /></div>
  </section>
  <section id="drawer">
    <h2>抽屉</h2>
    <div class="demo" data-demo="drawer-basic"><demo-drawer-basic /></div>
    <div class="demo" data-demo="drawer-controlled"><demo-drawer-controlled /></div>
    <div class="demo" data-demo="drawer-footer"><demo-drawer-footer /></div>
  </section>
  <section id="editorial">
    <h2>图文编排与内容张力</h2>
    <div class="demo" data-demo="editorial-basic"><demo-editorial-basic /></div>
    <div class="demo" data-demo="editorial-compare"><demo-editorial-compare /></div>
    <div class="demo" data-demo="editorial-hotspot"><demo-editorial-hotspot /></div>
  </section>
  <section id="empty">
    <h2>空状态</h2>
    <div class="demo" data-demo="empty-basic"><demo-empty-basic /></div>
    <div class="demo" data-demo="empty-search"><demo-empty-search /></div>
    <div class="demo" data-demo="empty-error"><demo-empty-error /></div>
    <div class="demo" data-demo="empty-presets"><demo-empty-presets /></div>
  </section>
  <section id="field">
    <h2>字段与错误</h2>
    <div class="demo" data-demo="field-basic"><demo-field-basic /></div>
    <div class="demo" data-demo="field-error"><demo-field-error /></div>
    <div class="demo" data-demo="field-optional"><demo-field-optional /></div>
  </section>
  <section id="flow">
    <h2>流程图</h2>
    <div class="demo" data-demo="flow-basic"><demo-flow-basic /></div>
    <div class="demo" data-demo="flow-branch"><demo-flow-branch /></div>
    <div class="demo" data-demo="flow-tidy"><demo-flow-tidy /></div>
  </section>
  <section id="flowstress">
    <h2>万级节点压测</h2>
    <div class="demo" data-demo="flowstress-many"><demo-flowstress-many /></div>
  </section>
  <section id="grid">
    <h2>数据表格</h2>
    <div class="demo" data-demo="grid-basic"><demo-grid-basic /></div>
    <div class="demo" data-demo="grid-sort"><demo-grid-sort /></div>
    <div class="demo" data-demo="grid-select"><demo-grid-select /></div>
    <div class="demo" data-demo="grid-render"><demo-grid-render /></div>
    <div class="demo" data-demo="grid-remote"><demo-grid-remote /></div>
    <div class="demo" data-demo="grid-edit"><demo-grid-edit /></div>
    <div class="demo" data-demo="grid-states"><demo-grid-states /></div>
  </section>
  <section id="iconbutton">
    <h2>纯图标按钮</h2>
    <div class="demo" data-demo="iconbutton-basic"><demo-iconbutton-basic /></div>
    <div class="demo" data-demo="iconbutton-variants"><demo-iconbutton-variants /></div>
    <div class="demo" data-demo="iconbutton-states"><demo-iconbutton-states /></div>
    <div class="demo" data-demo="iconbutton-controlled"><demo-iconbutton-controlled /></div>
  </section>
  <section id="image">
    <h2>图片</h2>
    <div class="demo" data-demo="image-basic"><demo-image-basic /></div>
    <div class="demo" data-demo="image-controlled"><demo-image-controlled /></div>
    <div class="demo" data-demo="image-failed"><demo-image-failed /></div>
  </section>
  <section id="input">
    <h2>输入框</h2>
    <div class="demo" data-demo="input-basic"><demo-input-basic /></div>
    <div class="demo" data-demo="input-sizes"><demo-input-sizes /></div>
    <div class="demo" data-demo="input-controlled"><demo-input-controlled /></div>
  </section>
  <section id="link">
    <h2>文字链接</h2>
    <div class="demo" data-demo="link-basic"><demo-link-basic /></div>
    <div class="demo" data-demo="link-textbtn"><demo-link-textbtn /></div>
    <div class="demo" data-demo="link-arrow"><demo-link-arrow /></div>
  </section>
  <section id="list">
    <h2>列表与键值</h2>
    <div class="demo" data-demo="list-basic"><demo-list-basic /></div>
    <div class="demo" data-demo="list-kv"><demo-list-kv /></div>
    <div class="demo" data-demo="list-switch"><demo-list-switch /></div>
  </section>
  <section id="loading">
    <h2>骨架与加载</h2>
    <div class="demo" data-demo="loading-basic"><demo-loading-basic /></div>
    <div class="demo" data-demo="loading-list"><demo-loading-list /></div>
    <div class="demo" data-demo="loading-quiet"><demo-loading-quiet /></div>
  </section>
  <section id="md">
    <h2>Markdown 文档</h2>
    <div class="demo" data-demo="md-basic"><demo-md-basic /></div>
    <div class="demo" data-demo="md-stream"><demo-md-stream /></div>
    <div class="demo" data-demo="md-heights"><demo-md-heights /></div>
  </section>
  <section id="media">
    <h2>视频与音频</h2>
    <div class="demo" data-demo="media-basic"><demo-media-basic /></div>
    <div class="demo" data-demo="media-audio"><demo-media-audio /></div>
    <div class="demo" data-demo="media-methods"><demo-media-methods /></div>
  </section>
  <section id="notify">
    <h2>通知</h2>
    <div class="demo" data-demo="notify-basic"><demo-notify-basic /></div>
    <div class="demo" data-demo="notify-actions"><demo-notify-actions /></div>
    <div class="demo" data-demo="notify-fail"><demo-notify-fail /></div>
  </section>
  <section id="number">
    <h2>数字步进</h2>
    <div class="demo" data-demo="number-basic"><demo-number-basic /></div>
    <div class="demo" data-demo="number-controlled"><demo-number-controlled /></div>
    <div class="demo" data-demo="number-range"><demo-number-range /></div>
  </section>
  <section id="numflow">
    <h2>数字变化</h2>
    <div class="demo" data-demo="numflow-basic"><demo-numflow-basic /></div>
    <div class="demo" data-demo="numflow-counter"><demo-numflow-counter /></div>
    <div class="demo" data-demo="numflow-styles"><demo-numflow-styles /></div>
  </section>
  <section id="optimistic">
    <h2>乐观更新</h2>
    <div class="demo" data-demo="optimistic-basic"><demo-optimistic-basic /></div>
    <div class="demo" data-demo="optimistic-switch"><demo-optimistic-switch /></div>
    <div class="demo" data-demo="optimistic-pending"><demo-optimistic-pending /></div>
  </section>
  <section id="otp">
    <h2>验证码</h2>
    <div class="demo" data-demo="otp-basic"><demo-otp-basic /></div>
    <div class="demo" data-demo="otp-complete"><demo-otp-complete /></div>
    <div class="demo" data-demo="otp-length"><demo-otp-length /></div>
    <div class="demo" data-demo="otp-mask"><demo-otp-mask /></div>
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
  <section id="popconfirm">
    <h2>气泡确认</h2>
    <div class="demo" data-demo="popconfirm-basic"><demo-popconfirm-basic /></div>
    <div class="demo" data-demo="popconfirm-undo"><demo-popconfirm-undo /></div>
    <div class="demo" data-demo="popconfirm-submit"><demo-popconfirm-submit /></div>
  </section>
  <section id="popover">
    <h2>弹出面板</h2>
    <div class="demo" data-demo="popover-basic"><demo-popover-basic /></div>
    <div class="demo" data-demo="popover-controlled"><demo-popover-controlled /></div>
    <div class="demo" data-demo="popover-align"><demo-popover-align /></div>
  </section>
  <section id="progress">
    <h2>进度</h2>
    <div class="demo" data-demo="progress-basic"><demo-progress-basic /></div>
    <div class="demo" data-demo="progress-ring"><demo-progress-ring /></div>
    <div class="demo" data-demo="progress-controlled"><demo-progress-controlled /></div>
  </section>
  <section id="prompt">
    <h2>提示词输入框</h2>
    <div class="demo" data-demo="prompt-basic"><demo-prompt-basic /></div>
    <div class="demo" data-demo="prompt-stop"><demo-prompt-stop /></div>
    <div class="demo" data-demo="prompt-upload"><demo-prompt-upload /></div>
    <div class="demo" data-demo="prompt-parts"><demo-prompt-parts /></div>
  </section>
  <section id="reorder">
    <h2>拖拽重排</h2>
    <div class="demo" data-demo="reorder-basic"><demo-reorder-basic /></div>
    <div class="demo" data-demo="reorder-order"><demo-reorder-order /></div>
    <div class="demo" data-demo="reorder-save"><demo-reorder-save /></div>
  </section>
  <section id="scrollarea">
    <h2>滚动区域</h2>
    <div class="demo" data-demo="scrollarea-basic"><demo-scrollarea-basic /></div>
    <div class="demo" data-demo="scrollarea-bar"><demo-scrollarea-bar /></div>
    <div class="demo" data-demo="scrollarea-none"><demo-scrollarea-none /></div>
  </section>
  <section id="segmented">
    <h2>分段控件</h2>
    <div class="demo" data-demo="segmented-basic"><demo-segmented-basic /></div>
    <div class="demo" data-demo="segmented-controlled"><demo-segmented-controlled /></div>
    <div class="demo" data-demo="segmented-sizes"><demo-segmented-sizes /></div>
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
  <section id="sidebar">
    <h2>侧栏与布局</h2>
    <div class="demo" data-demo="sidebar-basic"><demo-sidebar-basic /></div>
    <div class="demo" data-demo="sidebar-controlled"><demo-sidebar-controlled /></div>
    <div class="demo" data-demo="sidebar-fx"><demo-sidebar-fx /></div>
  </section>
  <section id="slider">
    <h2>滑块</h2>
    <div class="demo" data-demo="slider-basic"><demo-slider-basic /></div>
    <div class="demo" data-demo="slider-controlled"><demo-slider-controlled /></div>
    <div class="demo" data-demo="slider-max"><demo-slider-max /></div>
  </section>
  <section id="special">
    <h2>搜索、密码、邮箱</h2>
    <div class="demo" data-demo="special-basic"><demo-special-basic /></div>
    <div class="demo" data-demo="special-password"><demo-special-password /></div>
    <div class="demo" data-demo="special-email"><demo-special-email /></div>
  </section>
  <section id="table">
    <h2>表格</h2>
    <div class="demo" data-demo="table-basic"><demo-table-basic /></div>
    <div class="demo" data-demo="table-controlled"><demo-table-controlled /></div>
    <div class="demo" data-demo="table-states"><demo-table-states /></div>
    <div class="demo" data-demo="table-tree"><demo-table-tree /></div>
    <div class="demo" data-demo="table-merge"><demo-table-merge /></div>
    <div class="demo" data-demo="table-drag"><demo-table-drag /></div>
  </section>
  <section id="tabs">
    <h2>标签页、分页、步骤</h2>
    <div class="demo" data-demo="tabs-basic"><demo-tabs-basic /></div>
    <div class="demo" data-demo="tabs-controlled"><demo-tabs-controlled /></div>
    <div class="demo" data-demo="tabs-pager"><demo-tabs-pager /></div>
    <div class="demo" data-demo="tabs-steps"><demo-tabs-steps /></div>
  </section>
  <section id="taginput">
    <h2>标签输入</h2>
    <div class="demo" data-demo="taginput-basic"><demo-taginput-basic /></div>
    <div class="demo" data-demo="taginput-controlled"><demo-taginput-controlled /></div>
    <div class="demo" data-demo="taginput-hint"><demo-taginput-hint /></div>
  </section>
  <section id="tags">
    <h2>标签、徽标与头像</h2>
    <div class="demo" data-demo="tags-basic"><demo-tags-basic /></div>
    <div class="demo" data-demo="tags-badge"><demo-tags-badge /></div>
    <div class="demo" data-demo="tags-avatar"><demo-tags-avatar /></div>
  </section>
  <section id="toast">
    <h2>轻提示</h2>
    <div class="demo" data-demo="toast-basic"><demo-toast-basic /></div>
    <div class="demo" data-demo="toast-action"><demo-toast-action /></div>
    <div class="demo" data-demo="toast-progress"><demo-toast-progress /></div>
  </section>
  <section id="tooltip">
    <h2>文字提示</h2>
    <div class="demo" data-demo="tooltip-basic"><demo-tooltip-basic /></div>
    <div class="demo" data-demo="tooltip-kbd"><demo-tooltip-kbd /></div>
    <div class="demo" data-demo="tooltip-truncate"><demo-tooltip-truncate /></div>
  </section>
  <section id="upload">
    <h2>上传</h2>
    <div class="demo" data-demo="upload-basic"><demo-upload-basic /></div>
    <div class="demo" data-demo="upload-real"><demo-upload-real /></div>
    <div class="demo" data-demo="upload-single"><demo-upload-single /></div>
  </section>
  <section id="vlist">
    <h2>无限列表</h2>
    <div class="demo" data-demo="vlist-basic"><demo-vlist-basic /></div>
    <div class="demo" data-demo="vlist-total"><demo-vlist-total /></div>
    <div class="demo" data-demo="vlist-retry"><demo-vlist-retry /></div>
  </section>
</main>`,
})
export class Gallery {}

// Angular 没有按子树兜底的错误边界：错误照样进控制台；页面顶上贴一条写清楚出了什么错，出错以后什么都没画出来的演示框里也写上（画了一半的，是哪个演示看控制台）。main.ts 里换上它
export class DemoErrors implements ErrorHandler {
  private seen = new Set<string>();
  handleError(err: unknown) {
    console.error(err);
    const msg = "演示出错：" + String((err as Error)?.message ?? err);
    setTimeout(() => {
      const main = document.querySelector(".gallery");
      if (main && !this.seen.has(msg)) {
        this.seen.add(msg);
        let top = main.querySelector(".demo-err-page");
        if (!top) { top = document.createElement("div"); top.className = "demo-err demo-err-page"; main.prepend(top); }
        const line = document.createElement("p"); line.textContent = msg; top.append(line);
      }
      for (const box of Array.from(document.querySelectorAll<HTMLElement>(".gallery [data-demo]"))) {
        const drawn = Array.from(box.querySelectorAll("*")).some((el) => el.getBoundingClientRect().height > 1);
        if (drawn || box.querySelector(".demo-err")) continue;
        const p = document.createElement("p"); p.className = "demo-err"; p.textContent = msg; box.append(p);
      }
    }, 2000); // 等 2 秒再扫：流式输出这类一开始是空的演示先长出内容，别被误标
  }
}
