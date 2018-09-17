import { ModalController, NavParams } from 'ionic-angular';

import { TestBed, ComponentFixture, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// MODELS
import { NamedIdentity } from '../models/models';

// COMPONENTS
import { MultiLevelSelectComponent } from './multi-level-select';
import { MultiLevelSelectDialogComponent } from './multi-level-select-dialog';

// MOCKS
import { ModalControllerMock } from '../../tests/unit/mocks/ionic/modal-controller.spec';
import { NavParamsMock } from '../../tests/unit/mocks/ionic/nav-params.spec';

// TESTING UTILITIES
import { setUpTestBed } from '../../tests/unit/utils/test-common.spec';

describe('MultiLevelSelectComponent:', () => {

    let comp: MultiLevelSelectComponent;
    let fixture: ComponentFixture<MultiLevelSelectComponent>;

    let modalControllerMock: ModalControllerMock;
    let navParamsMock: NavParamsMock;

    const getTestModuleMetadata = (): TestModuleMetadata => {

        modalControllerMock = new ModalControllerMock();
        navParamsMock = new NavParamsMock();
        navParamsMock.get = jasmine.createSpy('getFnSpy');

        const moduleDef: TestModuleMetadata = {
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            declarations: [
                MultiLevelSelectComponent
            ],
            providers: [
                { provide: ModalController, useValue: modalControllerMock },
                { provide: NavParams, useValue: navParamsMock }
            ]
        };

        return moduleDef;

    };

    setUpTestBed(getTestModuleMetadata);

    beforeEach(() => {
        modalControllerMock.onDidDismiss.calls.reset();
        modalControllerMock.present.calls.reset();
        navParamsMock.get.calls.reset();

        fixture = TestBed.createComponent(MultiLevelSelectComponent);
        fixture.detectChanges();
        comp = fixture.componentInstance;

        return fixture.whenStable();
    });

    describe('testing constructor/ngOnInit', () => {
        it('should be defined', () => {
            expect(comp).toBeDefined();
        });
        it('should have selectedItem to be null', () => {
            expect(comp.selectedItem).toBeNull();
        });
    });

    describe('testing methods', () => {

        describe('writeValue', () => {
            it('should set selectedItem to the right value', () => {
                comp.selectedItem = null;

                comp.writeValue({ id: 1, name: 'name' });

                expect(comp.selectedItem).toEqual({ id: 1, name: 'name' });
            });
        });

        describe('registerOnChange', () => {
            it('should set propagateChange to the right value', () => {
                comp.propagateChange = null;

                comp.registerOnChange('test');

                expect(comp.propagateChange).toEqual('test');
            });
        });

        describe('open', () => {
            it('should invoke modalCtrl.create with the right params', () => {
                comp.selectedItem = { id: 1, name: 'name' };
                comp.lookups = 'lookups' as any;
                comp.allowParent = true;

                comp.open();

                expect(modalControllerMock.create).toHaveBeenCalledWith(MultiLevelSelectDialogComponent, {
                    selectedItemId: 1,
                    lookups: 'lookups',
                    allowParent: true
                });
            });
            it('should invoke multiLevelSelectDialogComponent.onDidDismiss', () => {
                comp.open();

                expect(modalControllerMock.onDidDismiss).toHaveBeenCalledTimes(1);
                expect(modalControllerMock.onDidDismiss).toHaveBeenCalledWith(jasmine.any(Function));
            });
            describe('when multiLevelSelectDialogComponent.onDidDismiss invokes the callback', () => {
                beforeEach(() => {
                    comp.propagateChange = jasmine.createSpy('propagateChangeFnSpy');
                });
                describe('with selectedItem defined', () => {
                    let selectedItem: NamedIdentity;
                    beforeEach(() => {
                        selectedItem = { id: 1, name: 'name' };
                    });
                    it('should set selectedItem to the right value', () => {
                        comp.selectedItem = null;

                        comp.open();
                        modalControllerMock.onDidDismissHandler(selectedItem);

                        expect(comp.selectedItem).toEqual(selectedItem);
                    });
                    it('should invoke propagateChange with the right param', () => {
                        comp.open();
                        modalControllerMock.onDidDismissHandler(selectedItem);

                        expect(comp.propagateChange).toHaveBeenCalledTimes(1);
                        expect(comp.propagateChange).toHaveBeenCalledWith(selectedItem);
                    });
                });
                describe('with selectedItem NOT defined', () => {
                    let selectedItem: NamedIdentity;
                    beforeEach(() => {
                        selectedItem = undefined;
                    });
                    it('should NOT change selectedItem', () => {
                        comp.selectedItem = { id: 1, name: 'name' };

                        comp.open();
                        modalControllerMock.onDidDismissHandler(selectedItem);

                        expect(comp.selectedItem).toEqual({ id: 1, name: 'name' });
                    });
                    it('should NOT invoke propagateChange', () => {
                        comp.open();
                        modalControllerMock.onDidDismissHandler(selectedItem);

                        expect(comp.propagateChange).not.toHaveBeenCalled();
                    });
                });
            });
            it('should invoke multiLevelSelectDialogComponent.present', () => {
                comp.open();

                expect(modalControllerMock.present).toHaveBeenCalledTimes(1);
            });
        });

        describe('reset', () => {
            let $event: any;
            beforeEach(() => {
                $event = {
                    stopPropagation: jasmine.createSpy('stopPropagation')
                };
                comp.propagateChange = jasmine.createSpy('propagateChangeFnSpy');
            });
            it('should invoke $event.stopPropagation', () => {
                comp.reset($event);

                expect($event.stopPropagation).toHaveBeenCalledTimes(1);
            });
            it('should set selectedItem to null', () => {
                comp.selectedItem = { id: 1, name: 'name' };

                comp.reset($event);

                expect(comp.selectedItem).toBeNull();
            });
            it('should invoke propagateChange with the right param', () => {
                comp.selectedItem = { id: 1, name: 'name' };

                comp.reset($event);

                expect(comp.propagateChange).toHaveBeenCalledTimes(1);
                expect(comp.propagateChange).toHaveBeenCalledWith(null);
            });
        });

    });

});
