import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavParams, Slides, ViewController } from 'ionic-angular';

// MODELS
import { NamedIdentity, LookUpItem, Slide, SlideItem } from '../models/models';

// PROVIDERS
import { Loading } from '../providers/loading/loading';

@Component({
  selector: 'ryaa-multi-level-select-dialog',
  template: `
    <ion-content>
      <ion-slides [pager]="false">
        <ion-slide *ngFor="let slide of slides">
          <ion-list-header>

              <ion-toolbar>
                <ion-buttons left>
                  <button ion-button icon-only *ngIf="slide.parentSlide" (click)="slideTo(slide.parentSlide?.slideIndex)">
                    <ion-icon name="arrow-back"></ion-icon>
                  </button>
                </ion-buttons>
                <ion-title>{{ slide.parentSlideItem ? slide.parentSlideItem?.name : "Please Select" }}</ion-title>
                <ion-buttons right>
                  <button ion-button icon-only (click)="close()">
                    <ion-icon name="close"></ion-icon>
                  </button>
                </ion-buttons>
              </ion-toolbar>

          </ion-list-header>

          <ion-list no-lines>

            <ion-item class="parent-item" *ngIf="slide.parentSlide && allowParent" (click)="itemSelected(slide.parentSlideItem)">
              {{ slide.parentSlideItem?.name }}
            </ion-item>

            <ion-item [ngClass]="{ 'selected': item.selected }" *ngFor="let item of slide.items" (click)="handleItemClick(item)">
              {{ item.name }}
              <ion-icon *ngIf="item.nextSlideIndex !== null" item-right name="arrow-forward"></ion-icon>
            </ion-item>

          </ion-list>
        </ion-slide>
      </ion-slides>
    </ion-content>
  `,
  styles: [`
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom {
      height: 100%;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list-header {
      margin-bottom: 1px;
      padding-left: 0;
      font-family: "Roboto", sans-serif;
      background-color: #25A0DA;
      border-color: #25A0DA;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list-header ion-label {
      margin: 0;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list-header ion-label ion-toolbar .toolbar-background {
      background-color: #25A0DA;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list-header ion-label ion-toolbar ion-buttons button {
      color: #ffffff;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list-header ion-label ion-toolbar ion-title .toolbar-title {
      font-size: 18px;
      color: #ffffff;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list {
      height: calc(100% - 59px);
      overflow-y: scroll;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list ion-item ion-label {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list ion-item ion-icon {
      font-size: 20px;
      line-height: 30px;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list ion-item.selected {
      background-color: #eee;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list ion-item.parent-item {
      padding-left: 0px;
    }
    ryaa-multi-level-select-dialog ion-content ion-slides .slide-zoom ion-list ion-item.parent-item .item-inner {
      padding-left: 16px;
      border-bottom: 1px solid #dedede;
    }`,
    `@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      ryaa-multi-level-select-dialog ion-content ion-slides ion-slide ion-list-header.list-header-ios {
        padding-top: 25px;
      }
    }`
  ],
  encapsulation: ViewEncapsulation.None
})
export class MultiLevelSelectDialogComponent {

  public slides: Slide[];

  public selectedItemId: number;
  public lookups: LookUpItem[];
  public allowParent: boolean;

  @ViewChild(Slides) public slidesControl: Slides;

  constructor(private loading: Loading, private params: NavParams, private viewCtrl: ViewController) {
    this.slides = null;
    this.selectedItemId = null;
    this.lookups = null;
    this.allowParent = null;
  }
  public ionViewDidLoad() {
    // Need to show a progress UI since it might take 1-2 secs to init the dialog if the lookups contains many items
    this.loading.present();
  }

  // checking if user is allowed to see this page. Runs when the page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.
  public ionViewDidEnter() {

    const _selectedItemId = this.params.get('selectedItemId');
    this.selectedItemId = _selectedItemId;

    const lookups = this.params.get('lookups');
    if (lookups) {
      this.lookups = lookups;
    } else {
      this.loading.dismiss();
      throw new Error(`MultiLevelSelectDialogComponent: lookups is missing; lookups: ${JSON.stringify(lookups)}`);
    }

    const allowParent = this.params.get('allowParent');
    this.allowParent = allowParent;

    this.slides = this.buildInitialSlide(this.lookups);

    this.slidesControl.lockSwipes(true);

    // dismiss the progress UI when the dialog UI is initialized
    this.loading.dismiss();
  }

  public buildInitialSlide(lookUpsAsTree: LookUpItem[]): Slide[] {
    const slides: Slide[] = [];

    if (lookUpsAsTree && lookUpsAsTree.length > 0) {

      const currentSlideIndex = 0;
      let slideItemSelected = false;

      const _topParentSlideItems: SlideItem[] = [];
      const _topParentSlide: Slide = { parentSlideItem: null, parentSlide: null, slideIndex: currentSlideIndex, items: _topParentSlideItems };
      slides.push(_topParentSlide);
      lookUpsAsTree.forEach((lookUpItem: LookUpItem, index: number) => {
        const _parentSlideItem: SlideItem = {
          id: lookUpItem.id, name: lookUpItem.name, parentId: null, lookUpItem, slide: _topParentSlide, nextSlideIndex: lookUpItem.children.length > 0 ? undefined : null
        };
        if (!slideItemSelected && this.selectedItemId && (_parentSlideItem.id === this.selectedItemId || this.isThisLookUpItemHasAnyDescendantSelected(lookUpItem))) {
          _parentSlideItem.selected = true;
          slideItemSelected = true;
        }
        _topParentSlideItems.push(_parentSlideItem);
      });

    } else {
      const _topParentSlideItems: SlideItem[] = [];
      const _topParentSlide: Slide = { parentSlideItem: null, parentSlide: null, slideIndex: 0, items: _topParentSlideItems };
      slides.push(_topParentSlide);
    }

    return slides;

  }

  public addChildren(parentSlide: Slide, parentSlideItem: SlideItem, children: LookUpItem[]): void {
    const slides = [];

    const currentSlideIndex = this.slides.length;
    parentSlideItem.nextSlideIndex = currentSlideIndex;
    let slideItemSelected = false;

    const _slideItems: SlideItem[] = [];
    const _slide: Slide = { parentSlideItem, parentSlide, slideIndex: currentSlideIndex, items: _slideItems };
    slides.push(_slide);

    children.forEach((lookUpItem: LookUpItem, index: number) => {
      const _slideItem: SlideItem = {
        id: lookUpItem.id, name: lookUpItem.name, parentId: lookUpItem.parentId, lookUpItem, slide: _slide, nextSlideIndex: lookUpItem.children.length > 0 ? undefined : null
      };
      if (!slideItemSelected && this.selectedItemId && (_slideItem.id === this.selectedItemId || this.isThisLookUpItemHasAnyDescendantSelected(lookUpItem))) {
        _slideItem.selected = true;
        slideItemSelected = true;
      }
      _slideItems.push(_slideItem);
    });

    const newSlides = this.slides.concat(slides);
    this.slides = newSlides;
  }

  public isThisLookUpItemHasAnyDescendantSelected(lookUpItem: LookUpItem): boolean {
    if (this.selectedItemId) {
      const lookUpItemFound: LookUpItem = this.getLookUpItemById(lookUpItem.children, this.selectedItemId);
      return lookUpItemFound != null;
    } else {
      return false;
    }
  }

  public getLookUpItemById(lookUps: LookUpItem[], selectedItemId: number): LookUpItem {

    let lookUpItemFound: LookUpItem = null;

    const recurse = (_lookUps: LookUpItem[]) => {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < _lookUps.length; i++) {

        // Found the lookUpItem!
        if ((_lookUps[i].id === selectedItemId)) {
          lookUpItemFound = _lookUps[i];
          break;
          // Did not match...
        } else {
          // Are there children / sub-categories? YES
          if (_lookUps[i].children && _lookUps[i].children.length > 0) {
            recurse(_lookUps[i].children);
            if (lookUpItemFound) {
              break;
            }
          }
        }
      }
    };

    recurse(lookUps);

    return lookUpItemFound;

  }

  public close() {
    this.itemSelected(null);
  }

  public handleItemClick(item: SlideItem) {
    if (item.nextSlideIndex === null) {
      this.itemSelected(item);
    } else {
      this.slideTo(item);
    }
  }

  public itemSelected(item: SlideItem) {
    let selectedItem: NamedIdentity = null;
    if (item) {
      selectedItem = { id: item.id, name: item.name };
    }
    this.viewCtrl.dismiss(selectedItem);
  }

  public slideTo(itemOrIndex: SlideItem | number): void {
    if (itemOrIndex != null) {
      let nextSlideIndex = null;
      if ((itemOrIndex as SlideItem).id != null) {
        if ((itemOrIndex as SlideItem).nextSlideIndex != null) {
          nextSlideIndex = (itemOrIndex as SlideItem).nextSlideIndex;
        } else {
          // below we check that nextSlideIndex is undefined
          if ((itemOrIndex as SlideItem).nextSlideIndex !== null) {
            const item = itemOrIndex as SlideItem;
            this.addChildren(item.slide, item, item.lookUpItem.children);
            nextSlideIndex = item.nextSlideIndex;
          } else {
            throw new Error(`MultiLevelSelectDialogComponent: itemOrIndex.nextSlideIndex must not be null; itemOrIndex: ${JSON.stringify(itemOrIndex)}`);
          }
        }
      } else {
        nextSlideIndex = itemOrIndex as number;
      }
      setTimeout(() => {
        this.slidesControl.lockSwipes(false);
        this.slidesControl.slideTo(nextSlideIndex);
        this.slidesControl.lockSwipes(true);
      }, 500);
    } else {
      throw new Error(`MultiLevelSelectDialogComponent: itemOrIndex must not be null; itemOrIndex: ${JSON.stringify(itemOrIndex)}`);
    }
  }

}
