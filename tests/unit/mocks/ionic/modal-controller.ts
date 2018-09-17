import { ModalOptions } from 'ionic-angular';

export class ModalControllerMock {

    public present: jasmine.Spy = jasmine.createSpy('presentFnSpy').and.callFake((): Promise<any> => {
        return new Promise((_resolve: (value?: any) => void) => {
        }); // tslint:disable-line:no-empty
    });

    public onDidDismissHandler: any;
    public onDidDismiss: jasmine.Spy = jasmine.createSpy('onDidDismissFnSpy').and.callFake((handler): void => {
        this.onDidDismissHandler = handler;
    });

    public create: jasmine.Spy = jasmine.createSpy('createFnSpy').and.callFake((component: any, data?: any, opts?: ModalOptions): any => {
        return {
            present: this.present,
            onDidDismiss: this.onDidDismiss
        };
    });

}
