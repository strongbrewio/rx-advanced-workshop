import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
@Component({
  selector: "spinner",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./spinner.component.less'],
  template: `
        <div class="spinner" [class.active]="spin">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>`
})
export class SpinnerComponent {
  @Input() spin: boolean;
}
