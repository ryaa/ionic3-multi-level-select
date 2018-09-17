export class LoadingMock {

    public present: jasmine.Spy = jasmine.createSpy('presentFnSpy').and.callFake(() => {
    }); // tslint:disable-line:no-empty

    public dismiss: jasmine.Spy = jasmine.createSpy('dismissFnSpy').and.callFake(() => {
    }); // tslint:disable-line:no-empty

}
