import { Loading, LoadingOptions } from 'ionic-angular';

export class LoadingControllerMock {
    public create: jasmine.Spy = jasmine.createSpy('createFnSpy').and.callFake((opts?: LoadingOptions): Loading => {
        return null;
    });
}
