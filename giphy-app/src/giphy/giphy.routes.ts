import { IndexPageContainer } from './containers/index-page/index-page.container';
import { RouterModule } from '@angular/router';

const routes = [
  {path: '', component: IndexPageContainer},
  {path: 'categories/:category', component: IndexPageContainer},
];

export const giphyRouting = RouterModule.forRoot(routes);
