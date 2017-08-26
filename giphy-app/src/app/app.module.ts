import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppContainer } from './container/app/app.container';
import { GiphyModule } from '../giphy/giphy.module';
import { giphyRouting } from '../giphy/giphy.routes';

@NgModule({
  declarations: [
    AppContainer
  ],
  imports: [
    BrowserModule,
    GiphyModule,
    giphyRouting
  ],
  providers: [],
  bootstrap: [AppContainer]
})
export class AppModule { }
