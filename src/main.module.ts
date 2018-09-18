import { CUSTOM_ELEMENTS_SCHEMA, Optional, NgModule, ModuleWithProviders, SkipSelf } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { MultiLevelSelectComponent } from './components/multi-level-select';
import { MultiLevelSelectDialogComponent } from './components/multi-level-select-dialog';
import { MultiLevelSelectHelpers } from './providers/helpers/helpers';
import { Loading } from './providers/loading/loading';

@NgModule({
    imports: [
        IonicModule
    ],
    entryComponents: [
        MultiLevelSelectComponent,
        MultiLevelSelectDialogComponent
    ],
    declarations: [
        MultiLevelSelectComponent,
        MultiLevelSelectDialogComponent
    ],
    exports: [
        MultiLevelSelectComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [
        MultiLevelSelectHelpers,
        Loading
    ]
})
export class IonicMultiLevelSelectModule {

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: IonicMultiLevelSelectModule,
            providers: [
                MultiLevelSelectHelpers
            ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: IonicMultiLevelSelectModule) {
        if (parentModule) {
            throw new Error(
                'IonicMultiLevelSelectModule is already loaded. Import it in the AppModule only');
        }
    }

}
