import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import { MainComponent } from './main/main.component';

const routes: Route[] = [
  {
    path: '',
    component: MainComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainComponent]
})
export class CalendarModule { }
