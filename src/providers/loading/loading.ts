import { Injectable } from '@angular/core';
import { LoadingController, Loading as IonicLoading } from 'ionic-angular';

@Injectable()
export class Loading {

    public loader: IonicLoading = null;

    constructor(public loadingCtrl: LoadingController) {
    }

    public present() {
        this.loader = this.loadingCtrl.create();
        this.loader.present();
    }
    public dismiss() {
        this.loader.dismiss();
    }

}
