import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import {Route, RouterModule} from "@angular/router";

const routes: Route[] = [
  { path: '', redirectTo: 'giphy', pathMatch: 'full'},
  {
    path: 'giphy',
    loadChildren: 'app/modules/giphy/giphy.module#GiphyModule'
  },
  {
    path: 'calendar',
    loadChildren: 'app/modules/calendar/calendar.module#CalendarModule'
  },
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
