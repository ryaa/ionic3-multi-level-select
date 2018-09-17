import { browser, by, element } from 'protractor';

export class Page {

  public navigateTo(destination) {
    return browser.get(destination);
  }

  public getTitle() {
    return browser.getTitle();
  }

  public getPageOneTitleText() {
    return element(by.tagName('page-page1')).element(by.tagName('ion-title')).element(by.css('.toolbar-title')).getText();
  }
}
