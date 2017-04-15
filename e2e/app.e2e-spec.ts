import { RxAdvancedWorkshopPage } from './app.po';

describe('rx-advanced-workshop App', () => {
  let page: RxAdvancedWorkshopPage;

  beforeEach(() => {
    page = new RxAdvancedWorkshopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
