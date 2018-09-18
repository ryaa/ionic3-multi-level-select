import { } from 'jasmine';

import { TestBed, inject } from '@angular/core/testing';

// MODELS
import { LookUpItem, LookUpItemRaw, SortOrder } from '../../models/models';

// PROVIDERS
import { MultiLevelSelectHelpers } from './helpers';

describe('MultiLevelSelectHelpers Provider:', () => {

    let helpers: MultiLevelSelectHelpers;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MultiLevelSelectHelpers
            ]
        });
    });

    beforeEach(inject([MultiLevelSelectHelpers], (_helpers: MultiLevelSelectHelpers) => {
        helpers = _helpers;
    }));

    describe('testing constructor:', () => {
        it('provider should be defined', () => {
            expect(helpers).toBeDefined();
        });
    });

    describe('testing methods', () => {

        describe('buildHierarchicalLookUp', () => {
            it('should return correct data structure', () => {
                const lookups: LookUpItemRaw[] = [
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
                ];

                const retVal = helpers.buildHierarchicalLookUp(lookups);

                const expectedHierarchicalLookup = [
                    {
                        id: 1,
                        name: 'name 1',
                        parentId: null,
                        children: [
                            {
                                id: 11,
                                name: 'name 11',
                                parentId: 1,
                                children: []
                            },
                            {
                                id: 12,
                                name: 'name 12',
                                parentId: 1,
                                children: [
                                    {
                                        id: 121,
                                        name: 'name 121',
                                        parentId: 12,
                                        children: []
                                    },
                                    {
                                        id: 122,
                                        name: 'name 122',
                                        parentId: 12,
                                        children: []
                                    }
                                ]
                            },
                            {
                                id: 13,
                                name: 'name 13',
                                parentId: 1,
                                children: []
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: 'name 2',
                        parentId: null,
                        children: []
                    }
                ];
                expect(retVal).toEqual(expectedHierarchicalLookup);
            });
        });
        describe('sortHierarchicalLookUpAsTreeInAscOrder', () => {
            let hierarchicalLookUpAsTree: LookUpItem[];
            let sortOrder: SortOrder;
            beforeEach(() => {
                hierarchicalLookUpAsTree = [
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
                ];
            });
            describe('when sorting by id (SortOrder.ById)', () => {
                beforeEach(() => {
                    sortOrder = SortOrder.ById;
                });
                it('should correctly sort hierarchicalLookUpAsTree', () => {
                    helpers.sortHierarchicalLookUpAsTreeInAscOrder(hierarchicalLookUpAsTree, sortOrder);

                    const expectedHierarchicalLookUpAsTreeAfterSorting = [
                        {
                            id: 1,
                            parentId: null,
                            name: 'Hardware',
                            children: []
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
                            id: 4,
                            parentId: null,
                            name: 'Software',
                            children: []
                        },
                        {
                            id: 5,
                            parentId: null,
                            name: 'Support',
                            children: [
                                {
                                    id: 9,
                                    parentId: 5,
                                    name: 'CC',
                                    children: []
                                },
                                {
                                    id: 10,
                                    parentId: 5,
                                    name: 'BB',
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
                                    id: 7,
                                    parentId: 6,
                                    name: 'BB',
                                    children: []
                                },
                                {
                                    id: 8,
                                    parentId: 6,
                                    name: 'AA',
                                    children: []
                                }
                            ]
                        }
                    ];
                    expect(hierarchicalLookUpAsTree).toEqual(expectedHierarchicalLookUpAsTreeAfterSorting);
                });
            });
            describe('when sorting by id (SortOrder.Alphabetical)', () => {
                beforeEach(() => {
                    sortOrder = SortOrder.Alphabetical;
                });
                it('should correctly sort hierarchicalLookUpAsTree', () => {
                    helpers.sortHierarchicalLookUpAsTreeInAscOrder(hierarchicalLookUpAsTree, sortOrder);

                    const expectedHierarchicalLookUpAsTreeAfterSorting = [
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
                                }
                            ]
                        },
                        {
                            id: 1,
                            parentId: null,
                            name: 'Hardware',
                            children: []
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
                            id: 4,
                            parentId: null,
                            name: 'Software',
                            children: []
                        },
                        {
                            id: 5,
                            parentId: null,
                            name: 'Support',
                            children: [
                                {
                                    id: 11,
                                    parentId: 5,
                                    name: 'AA',
                                    children: []
                                },
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
                                }
                            ]
                        }
                    ];
                    expect(hierarchicalLookUpAsTree).toEqual(expectedHierarchicalLookUpAsTreeAfterSorting);
                });
            });
            describe('when sorting not supported sortOrder', () => {
                beforeEach(() => {
                    sortOrder = -1;
                });
                it('should NOT sort hierarchicalLookUpAsTree', () => {
                    helpers.sortHierarchicalLookUpAsTreeInAscOrder(hierarchicalLookUpAsTree, sortOrder);

                    const expectedHierarchicalLookUpAsTreeAfterSorting = [
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
                    ];
                    expect(hierarchicalLookUpAsTree).toEqual(expectedHierarchicalLookUpAsTreeAfterSorting);
                });
            });
        });

    });

});
