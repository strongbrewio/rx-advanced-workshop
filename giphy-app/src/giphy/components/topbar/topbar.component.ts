import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'topbar',
  styleUrls: ['./topbar.component.less'],
  template: `
    <div>
      <input type="text" placeholder="Search for gifs" (keyup)="search.emit($event.target.value)">
      <button class="btn btn-primary" (click)="loadRandomGifs.emit()">Get random gifs</button>
    </div>
    <span>Welcome {{account?.firstName}} {{account?.lastName}}</span>
  `
})
export class TopbarComponent {
  @Input() account: Account;
  @Output() search = new EventEmitter<string>();
  @Output() loadRandomGifs = new EventEmitter();
}
