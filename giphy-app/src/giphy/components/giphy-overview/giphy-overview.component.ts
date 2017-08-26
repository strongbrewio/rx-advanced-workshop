import { Component, Input } from '@angular/core';
import { Giph } from '../../types/giph.result';

@Component({
  selector: 'giphy-overview',
  styleUrls: ['./giphy-overview.component.less'],
  template: `
    <giph-tile [giph]="giph" *ngFor="let giph of giphs"></giph-tile>
  `
})
export class GiphyOverviewComponent {
  @Input() giphs: Giph[];
}
