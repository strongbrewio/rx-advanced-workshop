import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Giph} from '../../types/giph.result';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'giphy-overview',
  styleUrls: ['./giphy-overview.component.less'],
  template: `
    <spinner [spin]="loading"></spinner>
    <giph-tile [giph]="giph" *ngFor="let giph of giphs"></giph-tile>
    <div>test</div>
  `
})
export class GiphyOverviewComponent implements AfterViewInit {
  @Input() giphs: Giph[];
  @Input() loading: boolean;

  constructor() {

  }

  ngAfterViewInit() {
  }
}
