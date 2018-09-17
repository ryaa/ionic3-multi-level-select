// Unit tests are updated 01-23-2018 for the next build 1.0.6 (COMPLETE AND UP-TO-DATE)

import { Component, Input, forwardRef } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// MODELS
import { LookUpItem, NamedIdentity } from '../models/models';

// COMPONENTS
import { MultiLevelSelectDialogComponent } from './multi-level-select-dialog';

@Component({
  selector: 'ryaa-multi-level-select',
  templateUrl: 'multi-level-select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiLevelSelectComponent), // tslint:disable-line:no-forward-ref
      multi: true
    }
  ]
})
export class MultiLevelSelectComponent implements ControlValueAccessor {

  public selectedItem: NamedIdentity;
  @Input() public lookups: LookUpItem[];
  @Input() public allowParent: boolean;

  constructor(public modalCtrl: ModalController, public params: NavParams) {
    this.selectedItem = null;
  }

  public writeValue(value: NamedIdentity) {
    this.selectedItem = value;
  }

  public propagateChange = (_: any) => { }; // tslint:disable-line:no-empty

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() { } // tslint:disable-line:no-empty

  public open() {
    const multiLevelSelectDialogComponent = this.modalCtrl.create(MultiLevelSelectDialogComponent, {
      selectedItemId: this.selectedItem ? this.selectedItem.id : null,
      lookups: this.lookups,
      allowParent: this.allowParent
    });
    multiLevelSelectDialogComponent.onDidDismiss((selectedItem: NamedIdentity) => {
      if (selectedItem) {
        this.selectedItem = selectedItem;
        this.propagateChange(this.selectedItem);
      }
    });
    multiLevelSelectDialogComponent.present();
  }

  public reset($event) {
    $event.stopPropagation();
    this.selectedItem = null;
    this.propagateChange(this.selectedItem);
  }

}
