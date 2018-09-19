import { Injectable } from '@angular/core';

// MODELS
import { LookUpItem, LookUpItemRaw, SortOrder } from '../../models/models';

@Injectable()
export class MultiLevelSelectHelpers {

    public buildHierarchicalLookUp(lookups: LookUpItemRaw[]): LookUpItem[] {
        if (lookups && lookups.length > 0) {

            const _lookupsTree: LookUpItem[] = [];
            const addChildren = (parent: LookUpItem) => {
                lookups.forEach((value: LookUpItemRaw) => {
                    if (value.parent_id === parent.id) {
                        const _child: LookUpItem = { id: value.id, parentId: value.parent_id, name: value.name, children: [] };
                        parent.children.push(_child);
                        addChildren(_child);
                    }
                });
            };

            lookups.forEach((value: LookUpItemRaw) => {
                if (value.parent_id == null) {
                    const _topParent: LookUpItem = { id: value.id, parentId: null, name: value.name, children: [] };
                    _lookupsTree.push(_topParent);
                    addChildren(_topParent);
                }
            });

            return _lookupsTree;

        } else {
            return [];
        }
    }
    public sortHierarchicalLookUpAsTreeInAscOrder(hierarchicalLookUpAsTree: LookUpItem[], sortBy: SortOrder): void {

        let sortByPropertyName = null;
        let valueBeingSortedStrings = false;
        if (sortBy === SortOrder.ById) {
            // sort by id in asc order
            sortByPropertyName = 'id';
        } else if (sortBy === SortOrder.Alphabetical) {
            // sort by name in asc order
            sortByPropertyName = 'name';
            valueBeingSortedStrings = true;
        } else {
            console.error(`Helpers provider: not supported sortBy param is provided. sortBy: ${JSON.stringify(sortBy)}`);
            return;
        }
        const sortByFn = (a, b) => {
            const aValue = valueBeingSortedStrings ? a[sortByPropertyName].toLowerCase() : a[sortByPropertyName];
            const bValue = valueBeingSortedStrings ? b[sortByPropertyName].toLowerCase() : b[sortByPropertyName];

            // a is less than b by some ordering criterion
            if (aValue < bValue) {
                return -1;
            }
            // a is greater than b by the ordering criterion
            if (aValue > bValue) {
                return 1;
            }
            // a must be equal to b
            return 0;
        };

        const sortChildren = (childrenToSort: LookUpItem[]) => {
            childrenToSort.sort(sortByFn);
            childrenToSort.forEach((value: LookUpItem) => {
                if (value.children && value.children.length > 0) {
                    sortChildren(value.children);
                }
            });
        };

        hierarchicalLookUpAsTree.sort(sortByFn);
        hierarchicalLookUpAsTree.forEach((value: LookUpItem) => {
            if (value.children && value.children.length > 0) {
                sortChildren(value.children);
            }
        });
    }

}
