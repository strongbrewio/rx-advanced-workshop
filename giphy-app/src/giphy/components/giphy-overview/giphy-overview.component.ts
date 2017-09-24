import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList,
  ViewChildren
} from '@angular/core';
import {Giph} from '../../types/giph.result';
import {Observable} from 'rxjs/Observable';
import {GiphTileComponent} from '../giph-tile/giph-tile.component';

@Component({
  selector: 'giphy-overview',
  styleUrls: ['./giphy-overview.component.less'],
  template: `
    <spinner [spin]="loading"></spinner>
    <div style="position: fixed;">
    </div>
    <giph-tile [giph]="giph" *ngFor="let giph of giphs"></giph-tile>
    <div>test</div>
  `
})
export class GiphyOverviewComponent implements AfterViewInit {
  @Input() giphs: Giph[];
  @Input() loading: boolean;

  @ViewChildren(GiphTileComponent)
  tiles: QueryList<GiphTileComponent>;

  constructor() {

  }

  ngAfterViewInit() {
  }
}
