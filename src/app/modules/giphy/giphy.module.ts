import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { FilteringAndSortingComponent } from './components/filtering-and-sorting/filtering-and-sorting.component';
import { MainComponent } from './components/main/main.component';

const routes: Route[] = [
  { path: '', component: MainComponent, children:
    [
      //{ path: '', pathMatch: 'full', redirectTo: 'filtering-and-sorting'},
      {
        path: 'filtering-and-sorting',
        component: FilteringAndSortingComponent
      }
    ]
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SideNavComponent, FilteringAndSortingComponent, MainComponent]
})
export class GiphyModule { }
