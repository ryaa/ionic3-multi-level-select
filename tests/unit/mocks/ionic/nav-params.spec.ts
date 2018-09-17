export class NavParamsMock {

    public get: jasmine.Spy = jasmine.createSpy('getFnSpy').and.callFake((args: any): any => {
    }); // tslint:disable-line:no-empty

}
