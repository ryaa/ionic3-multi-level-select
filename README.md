# ionic3-multi-level-select

## Description
This is an ionic multi level select component allowing to display hierarchical data in a mobile friendly manner. The component shows only one level at a time and navigates to a child level when the appropriate node selected.

## Getting Started
Install using npm

`$ npm install ionic3-multi-level-select --save`

Add the module `IonicMultiLevelSelectModule` in the `app.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { IonicMultiLevelSelectModule } from 'ionic3-multi-level-select';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicMultiLevelSelectModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
  ]
})
export class AppModule {}
```

You may also need to import the `MultiLevelSelectHelpers` in the `app.module.ts` and the page that requires the helper to prepare the data to be consumed by the multi-level-select component (see below):

Add the component to the page that requires the multi-level-select component:
```html
<ion-item>
    <ion-label>Control Label</ion-label>
    <div item-content class="multi-level-select-control-container">
        <ryaa-multi-level-select [formControlName]="<CONTROL_NAME>" [lookups]="<CONTROL_HIERARCHICAL_DATA>"></ryaa-multi-level-select>
    </div>
</ion-item>
```

## Multi Level Select Options

### lookups
The hierarchical data in the format below
```
[
    {
        id: 5,
        parentId: null,
        name: 'Support',
        children: [
            {
                id: 10,
                parentId: 5,
                name: 'BB',
                children: []
            },
            {
                id: 9,
                parentId: 5,
                name: 'CC',
                children: []
            },
            {
                id: 11,
                parentId: 5,
                name: 'AA',
                children: []
            }
        ]
    },
    {
        id: 6,
        parentId: null,
        name: 'ATest',
        children: [
            {
                id: 8,
                parentId: 6,
                name: 'AA',
                children: []
            },
            {
                id: 7,
                parentId: 6,
                name: 'BB',
                children: []
            },

        ]
    },
    {
        id: 2,
        parentId: null,
        name: 'HR',
        children: []
    },
    {
        id: 3,
        parentId: null,
        name: 'Network',
        children: []
    },
    {
        id: 1,
        parentId: null,
        name: 'Hardware',
        children: []
    },
    {
        id: 4,
        parentId: null,
        name: 'Software',
        children: []
    }
]
```

The module also contains `MultiLevelSelectHelpers` provider which helps to transform flat data to hierarchical to be consumed by the multi level select component. This provider has methods:
#### buildHierarchicalLookUp
This method can transform the flat data in the format below to the hierarchical data to be consumed by the component (note that parent_id property has underscore!)
```
[
    {
        id: 11,
        name: 'name 11',
        parent_id: 1,
    },
    {
        id: 12,
        name: 'name 12',
        parent_id: 1,
    },
    {
        id: 13,
        name: 'name 13',
        parent_id: 1,
    },
    {
        id: 1,
        name: 'name 1',
        parent_id: null,
    },
    {
        id: 2,
        name: 'name 2',
        parent_id: null,
    },
    {
        id: 121,
        name: 'name 121',
        parent_id: 12,
    },
    {
        id: 122,
        name: 'name 122',
        parent_id: 12,
    }
]
```

#### sortHierarchicalLookUpAsTreeInAscOrder
This method sorts the hierarchical data by property id or name 
### allowParent
This property determines whether the user can select only the lowest level node/item or can select any node/item in the hierarchy.

## Contributing
Freely fork and submit a pull request describing what was fixed/added and link it to an issue ;)
