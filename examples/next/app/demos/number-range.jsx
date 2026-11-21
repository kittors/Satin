"use client";
import { Stepper } from "satin-ui/react";

export default function BatchSize() {
  return <Stepper defaultValue={10} min={5} max={100} unit="张" label="每批张数" />;
}
