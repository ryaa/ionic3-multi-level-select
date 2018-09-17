import { LoadingController } from 'ionic-angular';

import { TestBed, inject } from '@angular/core/testing';

// PROVIDERS
import { Loading } from './loading';

// MOCKS
import { LoadingControllerMock } from '../../../tests/unit/mocks/ionic/loading.spec';

describe('Loading Provider:', () => {

    let loading: Loading;

    let loadingControllerMock: LoadingControllerMock;

    beforeEach(() => {

        loadingControllerMock = new LoadingControllerMock();

        TestBed.configureTestingModule({
            providers: [
                Loading,
                { provide: LoadingController, useValue: loadingControllerMock }
            ],
            imports: [
            ]
        });
    });

    beforeEach(inject([Loading], (_loading: Loading) => {
        loading = _loading;
    }));

    describe('testing constructor:', () => {
        it('provider should be defined', () => {
            expect(loading).toBeDefined();
        });
    });

    describe('testing methods', () => {

        describe('present', () => {
            let presentFnSpy: jasmine.Spy;
            beforeEach(() => {
                presentFnSpy = jasmine.createSpy('presentFnSpy');
                loadingControllerMock.create = jasmine.createSpy('createFnSpy').and.callFake((): Loading => {
                    return {
                        present: presentFnSpy
                    } as any;
                });
            });
            it('should invoke loadingCtrl.create', () => {
                loading.present();

                expect(loadingControllerMock.create).toHaveBeenCalledTimes(1);
            });
            it('should set loader', () => {
                loading.present();

                expect(loading.loader).toEqual({
                    present: jasmine.any(Function)
                } as any);
            });
            it('should invoke loader.present', () => {
                loading.present();

                expect(loading.loader.present).toHaveBeenCalledTimes(1);
            });
        });

        describe('dismiss', () => {
            beforeEach(() => {
                loading.loader = {
                    dismiss: jasmine.createSpy('dismissFnSpy')
                } as any;
            });
            it('should invoke loader.dismiss', () => {
                loading.dismiss();

                expect(loading.loader.dismiss).toHaveBeenCalledTimes(1);
            });
        });

    });

});
