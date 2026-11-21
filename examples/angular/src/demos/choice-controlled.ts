import { Component, signal, computed } from "@angular/core";

@Component({
  selector: "demo-choice-controlled",
  template: `
    <div class="sn-stack sn-gap-8">
      <label class="sn-check"><input type="checkbox" [checked]="all()" [indeterminate]="picked().length > 0 && !all()" (change)="picked.set($any($event.target).checked ? shots : [])"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>全选</label>
      @for (s of shots; track s) {
        <label class="sn-check"><input type="checkbox" [checked]="picked().includes(s)" (change)="toggle(s, $any($event.target).checked)"><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>{{ s }}</label>
      }
    </div>
  `,
})
export class ChoiceControlledComponent {
  protected shots = ["开场", "车站", "雨夜"];
  protected picked = signal(["开场"]);
  protected all = computed(() => this.picked().length === this.shots.length);
  toggle(s: string, on: boolean) { this.picked.update((p) => (on ? [...p, s] : p.filter((x) => x !== s))); }
}
