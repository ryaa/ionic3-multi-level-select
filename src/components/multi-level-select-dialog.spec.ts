import { IonicModule, NavParams, Slides, ViewController } from 'ionic-angular';

import { fakeAsync, tick, TestBed, ComponentFixture, TestModuleMetadata } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// MODELS
import { NamedIdentity, LookUpItem, Slide, SlideItem } from '../models/models';

// PROVIDERS
import { Loading } from '../providers/loading/loading';

// COMPONENTS
import { MultiLevelSelectDialogComponent } from './multi-level-select-dialog';

// MOCKS
import { LoadingMock } from '../../tests/unit/mocks/providers/loading/loading.spec';
import { NavParamsMock } from '../../tests/unit/mocks/ionic/nav-params.spec';

// TESTING UTILITIES
import { setUpTestBed } from '../../tests/unit/utils/test-common.spec';

describe('MultiLevelSelectDialogComponent:', () => {

    let comp: MultiLevelSelectDialogComponent;
    let fixture: ComponentFixture<MultiLevelSelectDialogComponent>;

    let loadingMock: LoadingMock;
    let navParamsMock: NavParamsMock;
    let viewController: ViewController;

    const getTestModuleMetadata = (): TestModuleMetadata => {

        loadingMock = new LoadingMock();
        navParamsMock = new NavParamsMock();
        navParamsMock.get = jasmine.createSpy('getFnSpy');
        viewController = new ViewController();

        const moduleDef: TestModuleMetadata = {
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            declarations: [
                MultiLevelSelectDialogComponent
            ],
            providers: [
                { provide: Loading, useValue: loadingMock },
                { provide: NavParams, useValue: navParamsMock },
                { provide: ViewController, useValue: viewController }
            ],
            imports: [
                IonicModule.forRoot(MultiLevelSelectDialogComponent)
            ]
        };

        return moduleDef;

    };

    setUpTestBed(getTestModuleMetadata);

    beforeEach(() => {
        loadingMock.present.calls.reset();
        loadingMock.dismiss.calls.reset();
        navParamsMock.get.calls.reset();

        fixture = TestBed.createComponent(MultiLevelSelectDialogComponent);
        fixture.detectChanges();
        comp = fixture.componentInstance;

        return fixture.whenStable();
    });

    describe('testing constructor/ngOnInit', () => {
        it('should be defined', () => {
            expect(comp).toBeDefined();
        });
        it('should have slides to be null', () => {
            expect(comp.slides).toBeNull();
        });
        it('should have selectedItemId to be null', () => {
            expect(comp.selectedItemId).toBeNull();
        });
        it('should have lookups to be null', () => {
            expect(comp.lookups).toBeNull();
        });
        it('should have allowParent to be null', () => {
            expect(comp.allowParent).toBeNull();
        });
        it('should have slidesControl to be defined', () => {
            expect(comp.slidesControl).toBeDefined();
            expect(comp.slidesControl instanceof Slides).toBe(true);
        });
    });

    describe('testing methods', () => {

        describe('ionViewDidLoad', () => {
            it('should invoke loading.present', () => {
                comp.ionViewDidLoad();

                expect(loadingMock.present).toHaveBeenCalledTimes(1);
            });
        });
        describe('ionViewDidEnter', () => {
            beforeEach(() => {
                navParamsMock.get = jasmine.createSpy('getFnSpy').and.callFake((args: any): any => {
                    return args;
                });
                comp.buildInitialSlide = jasmine.createSpy('buildInitialSlideFnSpy');
                comp.slidesControl.lockSwipes = jasmine.createSpy('lockSwipesFnSpy');
            });
            it('should invoke params.get 3 times', () => {
                comp.ionViewDidEnter();

                expect(navParamsMock.get).toHaveBeenCalledTimes(3);
            });
            it('should invoke params.get with the right params', () => {
                comp.ionViewDidEnter();

                expect(navParamsMock.get.calls.argsFor(0)).toEqual(['selectedItemId']);
                expect(navParamsMock.get.calls.argsFor(1)).toEqual(['lookups']);
                expect(navParamsMock.get.calls.argsFor(2)).toEqual(['allowParent']);
            });
            it('should set selectedItemId to the right value', () => {
                comp.ionViewDidEnter();

                expect(comp.selectedItemId).toEqual('selectedItemId' as any);
            });
            describe('when params.get returns lookups', () => {
                it('should set lookups to the right value', () => {
                    comp.ionViewDidEnter();

                    expect(comp.lookups).toEqual('lookups' as any);
                });
            });
            describe('when params.get DOES NOT return lookups', () => {
                beforeEach(() => {
                    navParamsMock.get = jasmine.createSpy('getFnSpy').and.callFake((args: any): any => {
                        return undefined;
                    });
                });
                it('should throw the right error', () => {
                    expect(() => {
                        comp.ionViewDidEnter();
                    }).toThrowError(`MultiLevelSelectDialogComponent: lookups is missing; lookups: ${JSON.stringify(undefined)}`);
                });
                it('should NOT invoke buildInitialSlide', () => {
                    try {
                        comp.ionViewDidEnter();
                        tick();
                    } catch (error) {
                        expect(comp.buildInitialSlide).not.toHaveBeenCalled();
                    }
                });
                it('should NOT invoke slidesControl.lockSwipes', () => {
                    try {
                        comp.ionViewDidEnter();
                        tick();
                    } catch (error) {
                        expect(comp.slidesControl.lockSwipes).not.toHaveBeenCalled();
                    }
                });
                it('should invoke loading.dismiss', () => {
                    try {
                        comp.ionViewDidEnter();
                        tick();
                    } catch (error) {
                        expect(loadingMock.dismiss).toHaveBeenCalledTimes(1);
                    }
                });
            });
            describe('when params.get returns allowParent', () => {
                it('should set allowParent to the right value', () => {
                    comp.ionViewDidEnter();

                    expect(comp.allowParent).toEqual('allowParent' as any);
                });
            });
            it('should invoke buildSlides with the right param', () => {
                comp.ionViewDidEnter();

                expect(comp.buildInitialSlide).toHaveBeenCalledTimes(1);
                expect(comp.buildInitialSlide).toHaveBeenCalledWith('lookups');
            });
            it('should invoke slidesControl.lockSwipes with the right param', () => {
                comp.ionViewDidEnter();

                expect(comp.slidesControl.lockSwipes).toHaveBeenCalledTimes(1);
                expect(comp.slidesControl.lockSwipes).toHaveBeenCalledWith(true);
            });
            it('should invoke loading.dismiss', () => {
                comp.ionViewDidEnter();

                expect(loadingMock.dismiss).toHaveBeenCalledTimes(1);
            });
        });
        describe('buildInitialSlide', () => {
            let lookUpsAsTree: LookUpItem[];
            beforeEach(() => {
                comp.isThisLookUpItemHasAnyDescendantSelected = jasmine.createSpy('isThisLookUpItemHasAnyDescendantSelectedFnSpy').and.callFake((lookUpItem: LookUpItem): boolean => {
                    return lookUpItem.id === comp.selectedItemId;
                });
            });
            describe('when lookUpsAsTree param is defined', () => {
                describe('and contains items', () => {
                    beforeEach(() => {
                        lookUpsAsTree = [
                            {
                                id: 661,
                                parentId: null,
                                name: 'Firewall',
                                children: []
                            },
                            {
                                id: 249,
                                parentId: null,
                                name: 'Hardware',
                                children: [
                                    {
                                        id: 298,
                                        parentId: 249,
                                        name: 'Desktop',
                                        children: []
                                    },
                                    {
                                        id: 747,
                                        parentId: 249,
                                        name: 'Vacuum cleaner',
                                        children: []
                                    },
                                    {
                                        id: 300,
                                        parentId: 249,
                                        name: 'Virtual',
                                        children: []
                                    }
                                ]
                            },
                            {
                                id: 745,
                                parentId: null,
                                name: 'Laptop',
                                children: []
                            },
                            {
                                id: 2482,
                                parentId: null,
                                name: 'Other',
                                children: []
                            },
                            {
                                id: 662,
                                parentId: null,
                                name: 'Printer',
                                children: []
                            },
                            {
                                id: 746,
                                parentId: null,
                                name: 'Server',
                                children: []
                            },
                            {
                                id: 663,
                                parentId: null,
                                name: 'Switch',
                                children: []
                            },
                            {
                                id: 2449,
                                parentId: null,
                                name: 'type123',
                                children: []
                            },
                            {
                                id: 744,
                                parentId: null,
                                name: 'Virtual Machine',
                                children: []
                            }
                        ];
                    });

                    describe('when item to select is in the first slide', () => {
                        beforeEach(() => {
                            comp.selectedItemId = 745;
                        });
                        it('should invoke isThisLookUpItemHasAnyDescendantSelected with the right param', () => {
                            comp.buildInitialSlide(lookUpsAsTree);

                            expect(comp.isThisLookUpItemHasAnyDescendantSelected).toHaveBeenCalledTimes(2);
                            expect((comp.isThisLookUpItemHasAnyDescendantSelected as any).calls.allArgs()).toEqual([[lookUpsAsTree[0]], [lookUpsAsTree[1]]]);
                        });
                        it('should build the correct slide(s)', () => {
                            const slides = comp.buildInitialSlide(lookUpsAsTree);

                            // we can't get literal array for the result since it has circular references so we just check
                            // that it contains main items

                            // total number of slides
                            // note that slides array is the flattened tree (tree passed into the method) and each slide contains
                            // array of slideItems each has the link to the next slide and also to the current slide
                            expect(slides.length).toEqual(1);

                            // first slide items (it contains 9 items; no parent slide since it is the first slide and this slide index is 0)
                            expect(slides[0].items.length).toEqual(9);
                            expect(slides[0].parentSlide).toBeNull();
                            expect(slides[0].parentSlideItem).toBeNull();
                            expect(slides[0].slideIndex).toEqual(0);

                            // first slide first item
                            expect(slides[0].items[0].id).toEqual(661);
                            expect(slides[0].items[0].name).toEqual('Firewall');
                            expect(slides[0].items[0].nextSlideIndex).toBeNull();
                            expect(slides[0].items[0].parentId).toBeNull();
                            expect(slides[0].items[0].selected).toBeUndefined();
                            expect(slides[0].items[0].slide.slideIndex).toEqual(0);

                            // first slide second item
                            expect(slides[0].items[1].id).toEqual(249);
                            expect(slides[0].items[1].name).toEqual('Hardware');
                            expect(slides[0].items[1].nextSlideIndex).toBeUndefined();
                            expect(slides[0].items[1].parentId).toBeNull();
                            expect(slides[0].items[1].selected).toBeUndefined();
                            expect(slides[0].items[1].slide.slideIndex).toEqual(0);

                            // first slide third item
                            expect(slides[0].items[2].id).toEqual(745);
                            expect(slides[0].items[2].name).toEqual('Laptop');
                            expect(slides[0].items[2].nextSlideIndex).toBeNull();
                            expect(slides[0].items[2].parentId).toBeNull();
                            expect(slides[0].items[2].selected).toBe(true);
                            expect(slides[0].items[2].slide.slideIndex).toEqual(0);

                            // ....

                            // first slide 9th item
                            expect(slides[0].items[8].id).toEqual(744);
                            expect(slides[0].items[8].name).toEqual('Virtual Machine');
                            expect(slides[0].items[8].nextSlideIndex).toBeNull();
                            expect(slides[0].items[8].parentId).toBeNull();
                            expect(slides[0].items[8].selected).toBeUndefined();
                            expect(slides[0].items[8].slide.slideIndex).toEqual(0);
                        });
                    });
                    // note that selecting parent when a child is selected tested in isThisLookUpItemHasAnyDescendantSelected
                    describe('when item to select is in the second slide', () => {
                        beforeEach(() => {
                            comp.selectedItemId = 298;
                            comp.isThisLookUpItemHasAnyDescendantSelected = jasmine.createSpy('isThisLookUpItemHasAnyDescendantSelectedFnSpy').and.callFake((lookUpItem: LookUpItem): boolean => {
                                return lookUpItem.id === 249;
                            });
                        });
                        it('should invoke isThisLookUpItemHasAnyDescendantSelected with the right param', () => {
                            comp.buildInitialSlide(lookUpsAsTree);

                            expect(comp.isThisLookUpItemHasAnyDescendantSelected).toHaveBeenCalledTimes(2);
                            expect((comp.isThisLookUpItemHasAnyDescendantSelected as any).calls.allArgs()).toEqual([[lookUpsAsTree[0]], [lookUpsAsTree[1]]]);
                        });
                        it('should build the correct slide(s)', () => {
                            const slides = comp.buildInitialSlide(lookUpsAsTree);

                            // we can't get literal array for the result since it has circular references so we just check
                            // that it contains main items

                            // total number of slides
                            // note that slides array is the flattened tree (tree passed into the method) and each slide contains
                            // array of slideItems each has the link to the next slide and also to the current slide
                            expect(slides.length).toEqual(1);

                            // first slide items (it contains 9 items; no parent slide since it is the first slide and this slide index is 0)
                            expect(slides[0].items.length).toEqual(9);
                            expect(slides[0].parentSlide).toBeNull();
                            expect(slides[0].parentSlideItem).toBeNull();
                            expect(slides[0].slideIndex).toEqual(0);

                            // first slide first item
                            expect(slides[0].items[0].id).toEqual(661);
                            expect(slides[0].items[0].name).toEqual('Firewall');
                            expect(slides[0].items[0].nextSlideIndex).toBeNull();
                            expect(slides[0].items[0].parentId).toBeNull();
                            expect(slides[0].items[0].selected).toBeUndefined();
                            expect(slides[0].items[0].slide.slideIndex).toEqual(0);

                            // first slide second item
                            expect(slides[0].items[1].id).toEqual(249);
                            expect(slides[0].items[1].name).toEqual('Hardware');
                            expect(slides[0].items[1].nextSlideIndex).toBeUndefined();
                            expect(slides[0].items[1].parentId).toBeNull();
                            expect(slides[0].items[1].selected).toBe(true);
                            expect(slides[0].items[1].slide.slideIndex).toEqual(0);

                            // first slide third item
                            expect(slides[0].items[2].id).toEqual(745);
                            expect(slides[0].items[2].name).toEqual('Laptop');
                            expect(slides[0].items[2].nextSlideIndex).toBeNull();
                            expect(slides[0].items[2].parentId).toBeNull();
                            expect(slides[0].items[2].selected).toBeUndefined();
                            expect(slides[0].items[2].slide.slideIndex).toEqual(0);

                            // ....

                            // first slide 9th item
                            expect(slides[0].items[8].id).toEqual(744);
                            expect(slides[0].items[8].name).toEqual('Virtual Machine');
                            expect(slides[0].items[8].nextSlideIndex).toBeNull();
                            expect(slides[0].items[8].parentId).toBeNull();
                            expect(slides[0].items[8].selected).toBeUndefined();
                            expect(slides[0].items[8].slide.slideIndex).toEqual(0);
                        });
                    });
                    describe('when NO item to select', () => {
                        beforeEach(() => {
                            comp.selectedItemId = undefined;
                        });
                        it('should NOT invoke isThisLookUpItemHasAnyDescendantSelected', () => {
                            comp.buildInitialSlide(lookUpsAsTree);

                            expect(comp.isThisLookUpItemHasAnyDescendantSelected).not.toHaveBeenCalled();
                        });
                        it('should build the correct slide(s)', () => {
                            const slides = comp.buildInitialSlide(lookUpsAsTree);

                            // we can't get literal array for the result since it has circular references so we just check
                            // that it contains main items

                            // total number of slides
                            // note that slides array is the flattened tree (tree passed into the method) and each slide contains
                            // array of slideItems each has the link to the next slide and also to the current slide
                            expect(slides.length).toEqual(1);

                            // first slide items (it contains 9 items; no parent slide since it is the first slide and this slide index is 0)
                            expect(slides[0].items.length).toEqual(9);
                            expect(slides[0].parentSlide).toBeNull();
                            expect(slides[0].parentSlideItem).toBeNull();
                            expect(slides[0].slideIndex).toEqual(0);

                            // first slide first item
                            expect(slides[0].items[0].id).toEqual(661);
                            expect(slides[0].items[0].name).toEqual('Firewall');
                            expect(slides[0].items[0].nextSlideIndex).toBeNull();
                            expect(slides[0].items[0].parentId).toBeNull();
                            expect(slides[0].items[0].selected).toBeUndefined();
                            expect(slides[0].items[0].slide.slideIndex).toEqual(0);

                            // first slide second item
                            expect(slides[0].items[1].id).toEqual(249);
                            expect(slides[0].items[1].name).toEqual('Hardware');
                            expect(slides[0].items[1].nextSlideIndex).toBeUndefined();
                            expect(slides[0].items[1].parentId).toBeNull();
                            expect(slides[0].items[0].selected).toBeUndefined();
                            expect(slides[0].items[1].slide.slideIndex).toEqual(0);

                            // first slide third item
                            expect(slides[0].items[2].id).toEqual(745);
                            expect(slides[0].items[2].name).toEqual('Laptop');
                            expect(slides[0].items[2].nextSlideIndex).toBeNull();
                            expect(slides[0].items[2].parentId).toBeNull();
                            expect(slides[0].items[0].selected).toBeUndefined();
                            expect(slides[0].items[2].slide.slideIndex).toEqual(0);

                            // ....

                            // first slide 9th item
                            expect(slides[0].items[8].id).toEqual(744);
                            expect(slides[0].items[8].name).toEqual('Virtual Machine');
                            expect(slides[0].items[8].nextSlideIndex).toBeNull();
                            expect(slides[0].items[8].parentId).toBeNull();
                            expect(slides[0].items[8].selected).toBeUndefined();
                            expect(slides[0].items[8].slide.slideIndex).toEqual(0);
                        });
                    });
                });
                describe('and contains NO items', () => {
                    beforeEach(() => {
                        comp.selectedItemId = undefined;
                        lookUpsAsTree = [];
                    });
                    it('should NOT invoke isThisLookUpItemHasAnyDescendantSelected', () => {
                        comp.buildInitialSlide(lookUpsAsTree);

                        expect(comp.isThisLookUpItemHasAnyDescendantSelected).not.toHaveBeenCalled();
                    });
                    it('should build the correct slides (with only one empty slide)', () => {
                        const slides = comp.buildInitialSlide(lookUpsAsTree);

                        expect(slides.length).toEqual(1);

                        expect(slides[0].items.length).toEqual(0);
                        expect(slides[0].parentSlide).toBeNull();
                        expect(slides[0].parentSlideItem).toBeNull();
                        expect(slides[0].slideIndex).toEqual(0);
                    });
                });
            });
            describe('when lookUpsAsTree param is NOT defined', () => {
                beforeEach(() => {
                    comp.selectedItemId = undefined;
                    lookUpsAsTree = undefined;
                });
                it('should NOT invoke isThisLookUpItemHasAnyDescendantSelected', () => {
                    comp.buildInitialSlide(lookUpsAsTree);

                    expect(comp.isThisLookUpItemHasAnyDescendantSelected).not.toHaveBeenCalled();
                });
                it('should build the correct slides (with only one empty slide)', () => {
                    const slides = comp.buildInitialSlide(lookUpsAsTree);

                    expect(slides.length).toEqual(1);

                    expect(slides[0].items.length).toEqual(0);
                    expect(slides[0].parentSlide).toBeNull();
                    expect(slides[0].parentSlideItem).toBeNull();
                    expect(slides[0].slideIndex).toEqual(0);
                });
            });
        });
        describe('addChildren', () => {
            let parentSlideParam: Slide;
            let parentSlideItemParam: SlideItem;
            let childrenParam: LookUpItem[];
            beforeEach(() => {
                parentSlideParam = 'parentSlide' as any;
                parentSlideItemParam = {
                    nextSlideIndex: undefined
                } as any;
                comp.slides = ['SLIDES'] as any;
                comp.isThisLookUpItemHasAnyDescendantSelected = jasmine.createSpy('isThisLookUpItemHasAnyDescendantSelectedFnSpy').and.callFake((lookUpItem: LookUpItem): boolean => {
                    return lookUpItem.id === comp.selectedItemId;
                });
            });
            describe('when children param is defined', () => {
                describe('and contains items', () => {
                    beforeEach(() => {
                        childrenParam = [
                            {
                                id: 298,
                                parentId: 249,
                                name: 'Desktop',
                                children: []
                            },
                            {
                                id: 747,
                                parentId: 249,
                                name: 'Vacuum cleaner',
                                children: []
                            },
                            {
                                id: 300,
                                parentId: 249,
                                name: 'Virtual',
                                children: []
                            }
                        ];
                    });
                    describe('when item to select is in the parent slide', () => {
                        beforeEach(() => {
                            comp.selectedItemId = 745;
                        });
                        it('should invoke isThisLookUpItemHasAnyDescendantSelected with the right param', () => {
                            comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                            expect(comp.isThisLookUpItemHasAnyDescendantSelected).toHaveBeenCalledTimes(3);
                            expect((comp.isThisLookUpItemHasAnyDescendantSelected as any).calls.allArgs()).toEqual([[childrenParam[0]], [childrenParam[1]], [childrenParam[2]]]);
                        });
                        it('should build the correct slide(s)', () => {
                            comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                            // we can't get literal array for the result since it has circular references so we just check
                            // that it contains main items

                            // total number of slides
                            // note that slides array is the flattened tree (tree passed into the method) and each slide contains
                            // array of slideItems each has the link to the next slide and also to the current slide
                            expect(comp.slides.length).toEqual(2);

                            // first slide
                            expect(comp.slides[0]).toEqual('SLIDES' as any);

                            // second slide items (it contains 2 items and parent slide)
                            expect(comp.slides[1].items.length).toEqual(3);
                            expect(comp.slides[1].parentSlide).toBe(parentSlideParam);
                            expect(comp.slides[1].parentSlideItem).toBe(parentSlideItemParam);
                            expect(comp.slides[1].slideIndex).toEqual(1);

                            // second slide first item
                            expect(comp.slides[1].items[0].id).toEqual(298);
                            expect(comp.slides[1].items[0].name).toEqual('Desktop');
                            expect(comp.slides[1].items[0].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[0].parentId).toBe(249);
                            expect(comp.slides[1].items[0].selected).toBeUndefined();
                            expect(comp.slides[1].items[0].slide.slideIndex).toEqual(1);

                            // second slide second item
                            expect(comp.slides[1].items[1].id).toEqual(747);
                            expect(comp.slides[1].items[1].name).toEqual('Vacuum cleaner');
                            expect(comp.slides[1].items[1].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[1].parentId).toBe(249);
                            expect(comp.slides[1].items[1].selected).toBeUndefined();
                            expect(comp.slides[1].items[1].slide.slideIndex).toEqual(1);

                            // second slide third item
                            expect(comp.slides[1].items[2].id).toEqual(300);
                            expect(comp.slides[1].items[2].name).toEqual('Virtual');
                            expect(comp.slides[1].items[2].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[2].parentId).toBe(249);
                            expect(comp.slides[1].items[2].selected).toBeUndefined();
                            expect(comp.slides[1].items[2].slide.slideIndex).toEqual(1);
                        });
                    });
                    describe('when item to select is in this slide', () => {
                        beforeEach(() => {
                            comp.selectedItemId = 747;
                        });
                        it('should invoke isThisLookUpItemHasAnyDescendantSelected with the right param', () => {
                            comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                            expect(comp.isThisLookUpItemHasAnyDescendantSelected).toHaveBeenCalledTimes(1);
                            expect((comp.isThisLookUpItemHasAnyDescendantSelected as any).calls.allArgs()).toEqual([[childrenParam[0]]]);
                        });
                        it('should build the correct slide(s)', () => {
                            comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                            // we can't get literal array for the result since it has circular references so we just check
                            // that it contains main items

                            // total number of slides
                            // note that slides array is the flattened tree (tree passed into the method) and each slide contains
                            // array of slideItems each has the link to the next slide and also to the current slide
                            expect(comp.slides.length).toEqual(2);

                            // first slide
                            expect(comp.slides[0]).toEqual('SLIDES' as any);

                            // second slide items (it contains 2 items and parent slide)
                            expect(comp.slides[1].items.length).toEqual(3);
                            expect(comp.slides[1].parentSlide).toBe(parentSlideParam);
                            expect(comp.slides[1].parentSlideItem).toBe(parentSlideItemParam);
                            expect(comp.slides[1].slideIndex).toEqual(1);

                            // second slide first item
                            expect(comp.slides[1].items[0].id).toEqual(298);
                            expect(comp.slides[1].items[0].name).toEqual('Desktop');
                            expect(comp.slides[1].items[0].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[0].parentId).toBe(249);
                            expect(comp.slides[1].items[0].selected).toBeUndefined();
                            expect(comp.slides[1].items[0].slide.slideIndex).toEqual(1);

                            // second slide second item
                            expect(comp.slides[1].items[1].id).toEqual(747);
                            expect(comp.slides[1].items[1].name).toEqual('Vacuum cleaner');
                            expect(comp.slides[1].items[1].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[1].parentId).toBe(249);
                            expect(comp.slides[1].items[1].selected).toBe(true);
                            expect(comp.slides[1].items[1].slide.slideIndex).toEqual(1);

                            // second slide third item
                            expect(comp.slides[1].items[2].id).toEqual(300);
                            expect(comp.slides[1].items[2].name).toEqual('Virtual');
                            expect(comp.slides[1].items[2].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[2].parentId).toBe(249);
                            expect(comp.slides[1].items[2].selected).toBeUndefined();
                            expect(comp.slides[1].items[2].slide.slideIndex).toEqual(1);
                        });
                    });
                    describe('when item to select is another (not parent) slide', () => {
                        beforeEach(() => {
                            comp.selectedItemId = 1000;
                        });
                        it('should invoke isThisLookUpItemHasAnyDescendantSelected with the right param', () => {
                            comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                            expect(comp.isThisLookUpItemHasAnyDescendantSelected).toHaveBeenCalledTimes(3);
                            expect((comp.isThisLookUpItemHasAnyDescendantSelected as any).calls.allArgs()).toEqual([[childrenParam[0]], [childrenParam[1]], [childrenParam[2]]]);
                        });
                        it('should build the correct slide(s)', () => {
                            comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                            // we can't get literal array for the result since it has circular references so we just check
                            // that it contains main items

                            // total number of slides
                            // note that slides array is the flattened tree (tree passed into the method) and each slide contains
                            // array of slideItems each has the link to the next slide and also to the current slide
                            expect(comp.slides.length).toEqual(2);

                            // first slide
                            expect(comp.slides[0]).toEqual('SLIDES' as any);

                            // second slide items (it contains 2 items and parent slide)
                            expect(comp.slides[1].items.length).toEqual(3);
                            expect(comp.slides[1].parentSlide).toBe(parentSlideParam);
                            expect(comp.slides[1].parentSlideItem).toBe(parentSlideItemParam);
                            expect(comp.slides[1].slideIndex).toEqual(1);

                            // second slide first item
                            expect(comp.slides[1].items[0].id).toEqual(298);
                            expect(comp.slides[1].items[0].name).toEqual('Desktop');
                            expect(comp.slides[1].items[0].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[0].parentId).toBe(249);
                            expect(comp.slides[1].items[0].selected).toBeUndefined();
                            expect(comp.slides[1].items[0].slide.slideIndex).toEqual(1);

                            // second slide second item
                            expect(comp.slides[1].items[1].id).toEqual(747);
                            expect(comp.slides[1].items[1].name).toEqual('Vacuum cleaner');
                            expect(comp.slides[1].items[1].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[1].parentId).toBe(249);
                            expect(comp.slides[1].items[1].selected).toBeUndefined();
                            expect(comp.slides[1].items[1].slide.slideIndex).toEqual(1);

                            // second slide third item
                            expect(comp.slides[1].items[2].id).toEqual(300);
                            expect(comp.slides[1].items[2].name).toEqual('Virtual');
                            expect(comp.slides[1].items[2].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[2].parentId).toBe(249);
                            expect(comp.slides[1].items[2].selected).toBeUndefined();
                            expect(comp.slides[1].items[2].slide.slideIndex).toEqual(1);
                        });
                    });
                    describe('when NO item to select', () => {
                        beforeEach(() => {
                            comp.selectedItemId = undefined;
                        });
                        it('should NOT invoke isThisLookUpItemHasAnyDescendantSelected', () => {
                            comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                            expect(comp.isThisLookUpItemHasAnyDescendantSelected).not.toHaveBeenCalled();
                        });
                        it('should build the correct slide(s)', () => {
                            comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                            // we can't get literal array for the result since it has circular references so we just check
                            // that it contains main items

                            // total number of slides
                            // note that slides array is the flattened tree (tree passed into the method) and each slide contains
                            // array of slideItems each has the link to the next slide and also to the current slide
                            expect(comp.slides.length).toEqual(2);

                            // first slide
                            expect(comp.slides[0]).toEqual('SLIDES' as any);

                            // second slide items (it contains 2 items and parent slide)
                            expect(comp.slides[1].items.length).toEqual(3);
                            expect(comp.slides[1].parentSlide).toBe(parentSlideParam);
                            expect(comp.slides[1].parentSlideItem).toBe(parentSlideItemParam);
                            expect(comp.slides[1].slideIndex).toEqual(1);

                            // second slide first item
                            expect(comp.slides[1].items[0].id).toEqual(298);
                            expect(comp.slides[1].items[0].name).toEqual('Desktop');
                            expect(comp.slides[1].items[0].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[0].parentId).toBe(249);
                            expect(comp.slides[1].items[0].selected).toBeUndefined();
                            expect(comp.slides[1].items[0].slide.slideIndex).toEqual(1);

                            // second slide second item
                            expect(comp.slides[1].items[1].id).toEqual(747);
                            expect(comp.slides[1].items[1].name).toEqual('Vacuum cleaner');
                            expect(comp.slides[1].items[1].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[1].parentId).toBe(249);
                            expect(comp.slides[1].items[1].selected).toBeUndefined();
                            expect(comp.slides[1].items[1].slide.slideIndex).toEqual(1);

                            // second slide third item
                            expect(comp.slides[1].items[2].id).toEqual(300);
                            expect(comp.slides[1].items[2].name).toEqual('Virtual');
                            expect(comp.slides[1].items[2].nextSlideIndex).toBeNull();
                            expect(comp.slides[1].items[2].parentId).toBe(249);
                            expect(comp.slides[1].items[2].selected).toBeUndefined();
                            expect(comp.slides[1].items[2].slide.slideIndex).toEqual(1);
                        });
                    });
                });
                describe('and contains NO items', () => {
                    beforeEach(() => {
                        childrenParam = [];
                    });
                    it('should NOT invoke isThisLookUpItemHasAnyDescendantSelected', () => {
                        comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                        expect(comp.isThisLookUpItemHasAnyDescendantSelected).not.toHaveBeenCalled();
                    });
                    it('should build the correct slide(s)', () => {
                        comp.addChildren(parentSlideParam, parentSlideItemParam, childrenParam);

                        // we can't get literal array for the result since it has circular references so we just check
                        // that it contains main items

                        // total number of slides
                        // note that slides array is the flattened tree (tree passed into the method) and each slide contains
                        // array of slideItems each has the link to the next slide and also to the current slide
                        expect(comp.slides.length).toEqual(2);

                        // first slide
                        expect(comp.slides[0]).toEqual('SLIDES' as any);

                        // second slide items (it contains 2 items and parent slide)
                        expect(comp.slides[1].items.length).toEqual(0);
                        expect(comp.slides[1].parentSlide).toBe(parentSlideParam);
                        expect(comp.slides[1].parentSlideItem).toBe(parentSlideItemParam);
                        expect(comp.slides[1].slideIndex).toEqual(1);
                    });
                });
            });

        });
        describe('isThisLookUpItemHasAnyDescendantSelected', () => {
            let lookUpItemParam: LookUpItem;
            beforeEach(() => {
                lookUpItemParam = {
                    children: 'lookUpItemChildren'
                } as any;
                comp.getLookUpItemById = jasmine.createSpy('getLookUpItemByIdFnSpy').and.callFake((_lookUps: LookUpItem[], _selectedItemId: number): LookUpItem => {
                    return null;
                });
            });
            describe('when selectedItemId is defined', () => {
                beforeEach(() => {
                    comp.selectedItemId = 111;
                });
                it('should invoke getLookUpItemById with the right param', () => {
                    comp.isThisLookUpItemHasAnyDescendantSelected(lookUpItemParam);

                    expect(comp.getLookUpItemById).toHaveBeenCalledTimes(1);
                    expect(comp.getLookUpItemById).toHaveBeenCalledWith(lookUpItemParam.children, comp.selectedItemId);
                });
                describe('when getLookUpItemById returns value', () => {
                    beforeEach(() => {
                        comp.getLookUpItemById = jasmine.createSpy('getLookUpItemByIdFnSpy').and.callFake((lookUps: LookUpItem[], selectedItemId: number): LookUpItem => {
                            return 'LookUpItem' as any;
                        });
                    });
                    it('should return the right value', () => {
                        const retVal = comp.isThisLookUpItemHasAnyDescendantSelected(lookUpItemParam);

                        expect(retVal).toBe(true);
                    });
                });
                describe('when getLookUpItemById does NOT return value', () => {
                    beforeEach(() => {
                        comp.getLookUpItemById = jasmine.createSpy('getLookUpItemByIdFnSpy').and.callFake((lookUps: LookUpItem[], selectedItemId: number): LookUpItem => {
                            return null;
                        });
                    });
                    it('should return the right value', () => {
                        const retVal = comp.isThisLookUpItemHasAnyDescendantSelected(lookUpItemParam);

                        expect(retVal).toBe(false);
                    });
                });
            });
            describe('when selectedItemId is NOT defined', () => {
                beforeEach(() => {
                    comp.selectedItemId = undefined;
                });
                it('should NOT invoke getLookUpItemById', () => {
                    comp.isThisLookUpItemHasAnyDescendantSelected(lookUpItemParam);

                    expect(comp.getLookUpItemById).not.toHaveBeenCalled();
                });
                it('should return the right value', () => {
                    const retVal = comp.isThisLookUpItemHasAnyDescendantSelected(lookUpItemParam);

                    expect(retVal).toBe(false);
                });
            });
        });
        describe('getLookUpItemById', () => {
            let lookUpsParam: LookUpItem[];
            let selectedItemIdParam: number;
            beforeEach(() => {
                lookUpsParam = [
                    {
                        id: 661,
                        parentId: null,
                        name: 'Firewall',
                        children: []
                    },
                    {
                        id: 249,
                        parentId: null,
                        name: 'Hardware',
                        children: [
                            {
                                id: 298,
                                parentId: 249,
                                name: 'Desktop',
                                children: []
                            },
                            {
                                id: 747,
                                parentId: 249,
                                name: 'Vacuum cleaner',
                                children: []
                            },
                            {
                                id: 300,
                                parentId: 249,
                                name: 'Virtual',
                                children: []
                            }
                        ]
                    },
                    {
                        id: 745,
                        parentId: null,
                        name: 'Laptop',
                        children: []
                    },
                    {
                        id: 2482,
                        parentId: null,
                        name: 'Other',
                        children: []
                    },
                    {
                        id: 662,
                        parentId: null,
                        name: 'Printer',
                        children: [
                            {
                                id: 6621,
                                parentId: 662,
                                name: 'Printer 1',
                                children: []
                            },
                            {
                                id: 6622,
                                parentId: 662,
                                name: 'Printer 2',
                                children: [
                                    {
                                        id: 66221,
                                        parentId: 6622,
                                        name: 'Printer 2 1',
                                        children: []
                                    },
                                    {
                                        id: 66222,
                                        parentId: 6622,
                                        name: 'Printer 2 2',
                                        children: []
                                    },
                                    {
                                        id: 66223,
                                        parentId: 6622,
                                        name: 'Printer 2 3',
                                        children: []
                                    }
                                ]
                            },
                            {
                                id: 6623,
                                parentId: 662,
                                name: 'Printer 3',
                                children: []
                            }
                        ]
                    },
                    {
                        id: 746,
                        parentId: null,
                        name: 'Server',
                        children: []
                    },
                    {
                        id: 663,
                        parentId: null,
                        name: 'Switch',
                        children: []
                    },
                    {
                        id: 2449,
                        parentId: null,
                        name: 'type123',
                        children: []
                    },
                    {
                        id: 744,
                        parentId: null,
                        name: 'Virtual Machine',
                        children: []
                    }
                ];
            });
            describe('when item to find is in the first level', () => {
                beforeEach(() => {
                    selectedItemIdParam = 745;
                });
                it('should return the right LookUpItem object', () => {
                    const retVal = comp.getLookUpItemById(lookUpsParam, selectedItemIdParam);

                    expect(retVal).toEqual({
                        id: 745,
                        parentId: null,
                        name: 'Laptop',
                        children: []
                    });
                });
            });
            describe('when item to find is in the second level', () => {
                beforeEach(() => {
                    selectedItemIdParam = 747;
                });
                it('should return the right LookUpItem object', () => {
                    const retVal = comp.getLookUpItemById(lookUpsParam, selectedItemIdParam);

                    expect(retVal).toEqual({
                        id: 747,
                        parentId: 249,
                        name: 'Vacuum cleaner',
                        children: []
                    });
                });
            });
            describe('when item to find is in the third level', () => {
                beforeEach(() => {
                    selectedItemIdParam = 66223;
                });
                it('should return the right LookUpItem object', () => {
                    const retVal = comp.getLookUpItemById(lookUpsParam, selectedItemIdParam);

                    expect(retVal).toEqual({
                        id: 66223,
                        parentId: 6622,
                        name: 'Printer 2 3',
                        children: []
                    });
                });
            });
            describe('when non existing item id is provided', () => {
                beforeEach(() => {
                    selectedItemIdParam = 9999;
                });
                it('should return the right LookUpItem object', () => {
                    const retVal = comp.getLookUpItemById(lookUpsParam, selectedItemIdParam);

                    expect(retVal).toBeNull();
                });
            });
            describe('when selectedItemId is NOT defined', () => {
                beforeEach(() => {
                    selectedItemIdParam = undefined;
                });
                it('should return the right LookUpItem object', () => {
                    const retVal = comp.getLookUpItemById(lookUpsParam, selectedItemIdParam);

                    expect(retVal).toBeNull();
                });
            });
        });
        describe('close', () => {
            beforeEach(() => {
                comp.itemSelected = jasmine.createSpy('itemSelectedFnSpy');
            });
            it('should invoke itemSelected', () => {
                comp.close();

                expect(comp.itemSelected).toHaveBeenCalledTimes(1);
                expect(comp.itemSelected).toHaveBeenCalledWith(null);
            });
        });
        describe('handleItemClick', () => {
            beforeEach(() => {
                comp.itemSelected = jasmine.createSpy('itemSelectedFnSpy');
                comp.slideTo = jasmine.createSpy('slideToFnSpy');
            });
            describe('when slideItem.nextSlideIndex param is defined', () => {
                let item: any;
                beforeEach(() => {
                    item = {
                        nextSlideIndex: 1
                    };
                });
                it('should NOT invoke itemSelected', () => {
                    comp.handleItemClick(item);

                    expect(comp.itemSelected).not.toHaveBeenCalled();
                });
                it('should invoke slideTo with the right param', () => {
                    comp.handleItemClick(item);

                    expect(comp.slideTo).toHaveBeenCalledTimes(1);
                    expect(comp.slideTo).toHaveBeenCalledWith(item);
                });
            });
            describe('when slideItem.nextSlideIndex param is NOT defined', () => {
                let item: any;
                beforeEach(() => {
                    item = {
                        nextSlideIndex: null
                    };
                });
                it('should invoke itemSelected with the right param', () => {
                    comp.handleItemClick(item);

                    expect(comp.itemSelected).toHaveBeenCalledTimes(1);
                    expect(comp.itemSelected).toHaveBeenCalledWith(item);
                });
                it('should NOT invoke slideTo', () => {
                    comp.handleItemClick(item);

                    expect(comp.slideTo).not.toHaveBeenCalled();
                });
            });
        });
        describe('itemSelected', () => {
            beforeEach(() => {
                viewController.dismiss = jasmine.createSpy('dismissFnSpy');
            });
            describe('when item param is defined', () => {
                let item: any;
                beforeEach(() => {
                    item = {
                        id: 1,
                        name: 'name'
                    };
                });
                it('should invoke viewCtrl.dismiss with the right param', () => {
                    comp.itemSelected(item);

                    expect(viewController.dismiss).toHaveBeenCalledTimes(1);
                    expect(viewController.dismiss).toHaveBeenCalledWith({ id: item.id, name: item.name });
                });
            });
            describe('when item param is NOT defined', () => {
                let item: any;
                beforeEach(() => {
                    item = undefined;
                });
                it('should invoke viewCtrl.dismiss with the right param', () => {
                    comp.itemSelected(item);

                    expect(viewController.dismiss).toHaveBeenCalledTimes(1);
                    expect(viewController.dismiss).toHaveBeenCalledWith(null);
                });
            });
        });
        describe('slideTo', () => {
            let itemOrIndexParam: SlideItem | number;
            let delay: number;
            beforeEach(() => {
                delay = 500;
                comp.slidesControl.lockSwipes = jasmine.createSpy('lockSwipesFnSpy');
                comp.slidesControl.slideTo = jasmine.createSpy('slideToFnSpy');
                comp.addChildren = jasmine.createSpy('addChildrenFnSpy').and.callFake((_parentSlide: Slide, parentSlideItem: SlideItem, _children: LookUpItem[]): void => {
                    parentSlideItem.nextSlideIndex = 'nextSlideIndexSetInAddChildren' as any;
                });
            });
            describe('when itemOrIndex is defined', () => {
                describe('when itemOrIndex param is SlideItem', () => {
                    beforeEach(() => {
                        itemOrIndexParam = {
                            id: 1,
                            parentId: null,
                            nextSlideIndex: null,
                            slide: 'slide' as any,
                            lookUpItem: 'lookUpItem' as any
                        };
                    });
                    describe('when itemOrIndex.nextSlideIndex is defined', () => {
                        beforeEach(() => {
                            (itemOrIndexParam as SlideItem).nextSlideIndex = 555;
                        });
                        it('should NOT invoke addChildren', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.addChildren).not.toHaveBeenCalled();
                                done();
                            })();
                        });
                        it('should invoke slidesControl.lockSwipes twice with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.slidesControl.lockSwipes).toHaveBeenCalledTimes(2);
                                expect((comp.slidesControl.lockSwipes as any).calls.argsFor(0)).toEqual([false]);
                                expect((comp.slidesControl.lockSwipes as any).calls.argsFor(1)).toEqual([true]);
                                done();
                            })();
                        });
                        it('should invoke slidesControl.slideTo with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.slidesControl.slideTo).toHaveBeenCalledTimes(1);
                                expect(comp.slidesControl.slideTo).toHaveBeenCalledWith(555);
                                done();
                            })();
                        });
                    });
                    describe('when itemOrIndex.nextSlideIndex is undefined', () => {
                        beforeEach(() => {
                            (itemOrIndexParam as SlideItem).nextSlideIndex = undefined;
                        });
                        it('should invoke addChildren with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.addChildren).toHaveBeenCalledTimes(1);
                                expect(comp.addChildren).toHaveBeenCalledWith(
                                    (itemOrIndexParam as SlideItem).slide, (itemOrIndexParam as SlideItem), (itemOrIndexParam as SlideItem).lookUpItem.children
                                );
                                done();
                            })();
                        });
                        it('should invoke slidesControl.lockSwipes twice with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.slidesControl.lockSwipes).toHaveBeenCalledTimes(2);
                                expect((comp.slidesControl.lockSwipes as any).calls.argsFor(0)).toEqual([false]);
                                expect((comp.slidesControl.lockSwipes as any).calls.argsFor(1)).toEqual([true]);
                                done();
                            })();
                        });
                        it('should invoke slidesControl.slideTo with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.slidesControl.slideTo).toHaveBeenCalledTimes(1);
                                expect(comp.slidesControl.slideTo).toHaveBeenCalledWith('nextSlideIndexSetInAddChildren' as any);
                                done();
                            })();
                        });
                    });
                    describe('when itemOrIndex.nextSlideIndex is null', () => {
                        beforeEach(() => {
                            (itemOrIndexParam as SlideItem).nextSlideIndex = null;
                        });
                        it('should NOT invoke addChildren', (done) => {
                            fakeAsync(() => {
                                try {
                                    comp.slideTo(itemOrIndexParam);
                                    tick(delay);
                                } catch (error) {
                                    expect(comp.addChildren).not.toHaveBeenCalled();
                                    done();
                                }
                            })();
                        });
                        it('should NOT invoke slidesControl.lockSwipes', (done) => {
                            fakeAsync(() => {
                                try {
                                    comp.slideTo(itemOrIndexParam);
                                    tick(delay);
                                } catch (error) {
                                    expect(comp.slidesControl.lockSwipes).not.toHaveBeenCalled();
                                    done();
                                }
                            })();
                        });
                        it('should NOT invoke slidesControl.slideTo', (done) => {
                            fakeAsync(() => {
                                try {
                                    comp.slideTo(itemOrIndexParam);
                                    tick(delay);
                                } catch (error) {
                                    expect(comp.slidesControl.slideTo).not.toHaveBeenCalled();
                                    done();
                                }
                            })();
                        });
                        it('should throw the right error', (done) => {
                            fakeAsync(() => {
                                expect(() => {
                                    comp.slideTo(itemOrIndexParam);
                                    tick(delay);
                                }).toThrowError(`MultiLevelSelectDialogComponent: itemOrIndex.nextSlideIndex must not be null; itemOrIndex: ${JSON.stringify(itemOrIndexParam)}`);
                                done();
                            })();
                        });
                    });
                });
                describe('when itemOrIndex param is number', () => {
                    describe('and itemOrIndexParam is 0', () => {
                        beforeEach(() => {
                            itemOrIndexParam = 0;
                        });
                        it('should NOT invoke addChildren', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.addChildren).not.toHaveBeenCalled();
                                done();
                            })();
                        });
                        it('should invoke slidesControl.lockSwipes twice with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.slidesControl.lockSwipes).toHaveBeenCalledTimes(2);
                                expect((comp.slidesControl.lockSwipes as any).calls.argsFor(0)).toEqual([false]);
                                expect((comp.slidesControl.lockSwipes as any).calls.argsFor(1)).toEqual([true]);
                                done();
                            })();
                        });
                        it('should invoke slidesControl.slideTo with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.slidesControl.slideTo).toHaveBeenCalledTimes(1);
                                expect(comp.slidesControl.slideTo).toHaveBeenCalledWith(0);
                                done();
                            })();
                        });
                    });
                    describe('and itemOrIndexParam is greater then 0', () => {
                        beforeEach(() => {
                            itemOrIndexParam = 123;
                        });
                        it('should NOT invoke addChildren', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.addChildren).not.toHaveBeenCalled();
                                done();
                            })();
                        });
                        it('should invoke slidesControl.lockSwipes twice with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.slidesControl.lockSwipes).toHaveBeenCalledTimes(2);
                                expect((comp.slidesControl.lockSwipes as any).calls.argsFor(0)).toEqual([false]);
                                expect((comp.slidesControl.lockSwipes as any).calls.argsFor(1)).toEqual([true]);
                                done();
                            })();
                        });
                        it('should invoke slidesControl.slideTo with the right params', (done) => {
                            fakeAsync(() => {
                                comp.slideTo(itemOrIndexParam);
                                tick(delay);

                                expect(comp.slidesControl.slideTo).toHaveBeenCalledTimes(1);
                                expect(comp.slidesControl.slideTo).toHaveBeenCalledWith(123);
                                done();
                            })();
                        });
                    });

                });
            });
            describe('when itemOrIndex is NOT defined', () => {
                beforeEach(() => {
                    itemOrIndexParam = undefined;
                });
                it('should NOT invoke addChildren', (done) => {
                    fakeAsync(() => {
                        try {
                            comp.slideTo(itemOrIndexParam);
                            tick(delay);
                        } catch (error) {
                            expect(comp.addChildren).not.toHaveBeenCalled();
                            done();
                        }
                    })();
                });
                it('should NOT invoke slidesControl.lockSwipes', (done) => {
                    fakeAsync(() => {
                        try {
                            comp.slideTo(itemOrIndexParam);
                            tick(delay);
                        } catch (error) {
                            expect(comp.slidesControl.lockSwipes).not.toHaveBeenCalled();
                            done();
                        }
                    })();
                });
                it('should NOT invoke slidesControl.slideTo', (done) => {
                    fakeAsync(() => {
                        try {
                            comp.slideTo(itemOrIndexParam);
                            tick(delay);
                        } catch (error) {
                            expect(comp.slidesControl.slideTo).not.toHaveBeenCalled();
                            done();
                        }
                    })();
                });
                it('should throw the right error', (done) => {
                    fakeAsync(() => {
                        expect(() => {
                            comp.slideTo(itemOrIndexParam);
                            tick(delay);
                        }).toThrowError(`MultiLevelSelectDialogComponent: itemOrIndex must not be null; itemOrIndex: ${JSON.stringify(itemOrIndexParam)}`);
                        done();
                    })();
                });
            });
        });

    });

});
