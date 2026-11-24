import type { Variant } from "satin-ui/react";

export declare const SINK: {
  title: string;
  buttons: [Variant, string][];
  iconButton: { icon: string; tip: string };
  field: { label: string; placeholder: string; help: string };
  check: { label: string; checked: boolean };
  switch: { label: string; checked: boolean };
  segmented: { items: string[]; value: string };
  slider: { value: number; max: number; label: string };
  select: { items: string[]; value: string; label: string };
  tabs: { tabs: { label: string; content: string }[]; value: number };
  progress: number;
  steps: { steps: string[]; current: number };
  collapse: { items: { title: string; content: string }[]; open: number[] };
  stepper: { value: number; min: number; max: number; unit: string; label: string };
  chips: string[];
};
