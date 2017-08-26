import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'giphy-filter',
  styleUrls: ['./giphy-filter.component.less'],
  template: `
    <h2>Filter the loaded gifs</h2>
    <div class="filter">
      <span>Max width:</span>
      <input type="number" [value]="maxWidth" (change)="setMaxWidth.emit($event.target.value)"
             (keyup)="setMaxWidth.emit($event.target.value)">
    </div>
    <div class="filter">
      <span>Max height:</span>
      <input type="number" [value]="maxHeight" (change)="setMaxHeight.emit($event.target.value)"
             (keyup)="setMaxHeight.emit($event.target.value)">
    </div>
  `
})
export class GiphyFilterComponent {
  @Input() maxWidth: number;
  @Input() maxHeight: number;
  @Output() setMaxWidth = new EventEmitter<number>();
  @Output() setMaxHeight = new EventEmitter<number>();
}
