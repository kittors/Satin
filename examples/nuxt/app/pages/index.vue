<script setup>
import { ref } from "vue";
import { SINK as S } from "../../../shared/sink.js";
const view = ref(S.segmented.value), level = ref(S.slider.value), ratio = ref(S.select.value), saveDraft = ref(S.check.checked), notifyMe = ref(S.switch.checked), dur = ref(S.stepper.value);
</script>

<template>
  <main class="sink">
    <h1>{{ S.title }}</h1>
    <div class="line">
      <SnButton v-for="[v, t] in S.buttons" :key="v" :variant="v">{{ t }}</SnButton>
      <SnButton variant="ghost" :icon="S.iconButton.icon" :tip="S.iconButton.tip" />
    </div>
    <SnField :label="S.field.label" for="f-title" :help="S.field.help"><SnInput id="f-title" :placeholder="S.field.placeholder" /></SnField>
    <div class="line">
      <SnCheckbox v-model="saveDraft" :label="S.check.label" />
      <SnSwitch v-model="notifyMe" :label="S.switch.label" />
    </div>
    <div class="line"><SnSegmented v-model="view" :items="S.segmented.items" /></div>
    <div class="sn-field"><span class="sn-lbl">{{ S.slider.label }}</span><SnSlider v-model="level" :max="S.slider.max" :label="S.slider.label" /></div>
    <div class="sn-field"><span class="sn-lbl">{{ S.select.label }}</span><SnSelect v-model="ratio" :items="S.select.items" /></div>
    <SnTabs :tabs="S.tabs.tabs" :value="S.tabs.value" />
    <div class="line"><SnProgress :value="S.progress" /><SnProgress :value="S.progress" ring /></div>
    <SnSteps :steps="S.steps.steps" :current="S.steps.current" />
    <SnCollapse :items="S.collapse.items" :open="S.collapse.open" />
    <div class="sn-field"><span class="sn-lbl">{{ S.stepper.label }}</span><SnStepper v-model="dur" :min="S.stepper.min" :max="S.stepper.max" :unit="S.stepper.unit" :label="S.stepper.label" /></div>
    <div class="line"><SnChip v-for="t in S.chips" :key="t">{{ t }}</SnChip></div>
  </main>
</template>
