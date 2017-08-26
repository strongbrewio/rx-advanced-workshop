import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Giph } from '../../types/giph.result';

@Component({
  selector: 'giph-tile',
  styleUrls: ['./giph-tile.component.less'],
  template: `
    <div class="tile-wrapper" [ngStyle]="style">
      <img [attr.src]="url" alt="">
    </div>
  `
})
export class GiphTileComponent implements OnInit {
  @Input() giph: Giph;
  colors = ['#CEE216', '#f4f8ce', '#c7cf73', '#929674', '#8d9c00', '#f4ff87', '#f7ffaa'];
  randomNr = Math.floor(Math.random() * ( 1 + this.colors.length - 1 )) + 0;
  url: string;

  constructor(private cdRef: ChangeDetectorRef) {

  }

  get style(): any {
    return {
      width: this.giph.images.original.width + 'px',
      height: this.giph.images.original.height + 'px',
      background: this.colors[this.randomNr]
    }
  }

  ngOnInit(): void {
    let img = new Image();
    img.src = this.giph.images.original.url;
    img.addEventListener('load', () => {
      this.url = img.src;
      this.cdRef.markForCheck();
    });
  }
}
