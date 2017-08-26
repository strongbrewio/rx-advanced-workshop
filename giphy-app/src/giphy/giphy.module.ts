import { NgModule } from '@angular/core';
import { CategoryPickerComponent } from './components/category-picker/category-picker.component';
import { GiphyFilterComponent } from './components/giphy-filter/giphy-filter.component';
import { GiphyOverviewComponent } from './components/giphy-overview/giphy-overview.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { IndexPageContainer } from './containers/index-page/index-page.container';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AuthenticationService } from './services/authentication.service';
import { GiphyService } from './services/giphy.service';
import { HttpClientModule } from '@angular/common/http';
import { GiphTileComponent } from './components/giph-tile/giph-tile.component';

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule],
  declarations: [CategoryPickerComponent, GiphyFilterComponent, GiphyOverviewComponent, SidebarComponent,
    TopbarComponent, IndexPageContainer, SpinnerComponent, GiphTileComponent],
  providers: [AuthenticationService, GiphyService],
  exports: [IndexPageContainer]
})
export class GiphyModule {

}
