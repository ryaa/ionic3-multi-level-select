import { TestBed, TestModuleMetadata } from '@angular/core/testing';

const resetTestingModule = TestBed.resetTestingModule;
const preventAngularFromResetting = () => TestBed.resetTestingModule = () => TestBed;
const allowAngularToReset = () => TestBed.resetTestingModule = resetTestingModule;

export const setUpTestBed = (getModuleDefFn: () => TestModuleMetadata) => {

    beforeAll(() => {
        const moduleDef: TestModuleMetadata =  getModuleDefFn();
        resetTestingModule();
        preventAngularFromResetting();
        TestBed.configureTestingModule(moduleDef);

        // prevent Angular from resetting testing module
        TestBed.resetTestingModule = () => TestBed;

    });

    afterAll(() => allowAngularToReset());

};
