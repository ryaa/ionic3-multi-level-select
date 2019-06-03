import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { MultiLevelSelectComponent } from './components/multi-level-select';
import { MultiLevelSelectDialogComponent } from './components/multi-level-select-dialog';
import { MultiLevelSelectHelpers } from './providers/helpers/helpers';
import { Loading } from './providers/loading/loading';

@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    entryComponents: [
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
export class IonicMultiLevelSelectModule { }
