import { Component, Input } from '@angular/core';
import { Category } from '../../types/category.type';

@Component({
  selector: 'category-picker',
  styleUrls: ['./category-picker.component.less'],
  template: `
    <h2>Categories</h2>
    <ul>
      <li *ngFor="let category of categories">
        <a routerLink="/categories/{{category.value}}" [class.active]="currentCategory === category.value">{{category.label}}</a>
      </li>
    </ul>
  `
})
export class CategoryPickerComponent {
  @Input() categories: Category[];
  @Input() currentCategory: string;
}
