import { LLNode } from '../src/llnode';
import { MultiLevelLinkedList } from '../src/multiLevelLinkedList';

function getMultiLevelLinkedList1(): LLNode<number> {
    let arr1 = [ 1, 2, 3, 4 ];
    let arr2 = [ 5, 6 ];
    let arr3 = [ 7, 8 ];
    let arr4 = [ 9, 10 ];

    let head1 = MultiLevelLinkedList.createList(arr1);
    let head2 = MultiLevelLinkedList.createList(arr2);
    let head3 = MultiLevelLinkedList.createList(arr3);
    let head4 = MultiLevelLinkedList.createList(arr4);

    head1.child = head2;
    head1.next.next.child = head3;
    head2.next.child = head4;

    // Creating a null pointer.
    let head:LLNode<number> = head1;
    return head;
}

function getFlattened<T>(head: LLNode<T>): T[]
{
    let node = MultiLevelLinkedList.flatten(head);
    let arr:T[] = [];
    while(node != null)
    {
        arr.push(node.data);
        node = node.next;
    }
    return arr;
}

function cloneTest() {
    let head = getMultiLevelLinkedList1();
    let headClone = MultiLevelLinkedList.clone(head);
    headClone.data = 54;
    let oldChild = headClone.next.next.child;
    headClone.next.next.child = headClone.child.next.child;
    headClone.child.next.child = oldChild;

    describe(
        'testing clone',
        () => {
            test(
                'original MLLL flattened is as expected',
                () => {
                    expect(getFlattened(head)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
                }
            )
        }
    );
    describe(
        'testing clone',
        () => {
            test(
                'clone MLLL flattened is as expected',
                () => {
                    expect(getFlattened(headClone)).toStrictEqual([54, 2, 3, 4, 5, 6, 9, 10, 7, 8]);
                }
            )
        }
    );
}

function moveItemTest() {
    let head = getMultiLevelLinkedList1();

    describe(
        'testing moveItem',
        () => {
            test(
                'Providing a valid path to an item to move and the target position should result with moving the item',
                () => {
                    expect(
                        getFlattened(
                            MultiLevelLinkedList.moveItem(
                                MultiLevelLinkedList.clone(head), [0,0,1], [1,0,1]))
                    ).toStrictEqual([1, 2, 3, 4, 5, 6, 8, 9, 7, 10]);
                }
            )
        }
    );
    describe(
        'testing moveItem',
        () => {
            test(
                'Providing a path to an item which doesn`t exist should result with an error',
                () => {
                    expect(() => {
                        getFlattened(
                            MultiLevelLinkedList.moveItem(
                                MultiLevelLinkedList.clone(head), [1, 0, 0, 0, 1], [1,0,1]))
                        }).toThrow('Path leads to non-existing position!');
                }
            )
        }
    );
    describe(
        'testing moveItem',
        () => {
            test(
                'Providing a path where to move which doesn`t exist should result with an error',
                () => {
                    expect(() => {
                        getFlattened(
                            MultiLevelLinkedList.moveItem(
                                MultiLevelLinkedList.clone(head), [0, 0, 1], [1, 0, 0, 0, 1]))
                    }).toThrow('Path leads to non-existing position!');
                }
            )
        }
    );
    describe(
        'testing moveItem',
        () => {
            test(
                'Providing a non-valid path to an item should result with an error',
                () => {
                    expect(() => {
                        getFlattened(
                            MultiLevelLinkedList.moveItem(
                                MultiLevelLinkedList.clone(head), [1, 0, 2, 0, 1], [1,0,1]))
                    }).toThrow('Path array should contain only 0 and 1!');
                }
            )
        }
    );
    describe(
        'testing moveItem',
        () => {
            test(
                'Providing a non-valid path where to move should result with an error',
                () => {
                    expect(() => {
                        getFlattened(
                            MultiLevelLinkedList.moveItem(
                                MultiLevelLinkedList.clone(head), [0, 0, 1], [0, 5, 3]))
                    }).toThrow('Path array should contain only 0 and 1!');
                }
            )
        }
    );
}

function insertItemTest() {
    let head = getMultiLevelLinkedList1();

    describe(
        'testing insertItem',
        () => {
            test(
                'Providing a valid path where insert to should result with an insertion of new item (insert as a child)',
                () => {
                    expect(
                        getFlattened(
                            MultiLevelLinkedList.insertItem(
                                MultiLevelLinkedList.clone(head), 228, [0,0], true)))
                    .toStrictEqual([1, 2, 3, 4, 5, 6, 228, 9, 10, 7, 8]);
                }
            )
        }
    );
    describe(
        'testing insertItem',
        () => {
            test(
                'Providing a valid path where insert to should result with an insertion of new item (insert as next)',
                () => {
                    expect(
                        getFlattened(
                            MultiLevelLinkedList.insertItem(
                                MultiLevelLinkedList.clone(head), 228, [0,0], false)))
                    .toStrictEqual([1, 2, 3, 228, 4, 5, 6, 7, 8, 9, 10]);
                }
            )
        }
    );
    describe(
        'testing insertItem',
        () => {
            test(
                'Providing a path where insert to which leads to non-existing position should result with an error',
                () => {
                    expect(() => {
                        return getFlattened(
                            MultiLevelLinkedList.insertItem(
                                MultiLevelLinkedList.clone(head), 228, [1,1,1,0,0], true));
                    }).toThrow('Path leads to non-existing position!');
                }
            )
        }
    );
    describe(
        'testing insertItem',
        () => {
            test(
                'Providing a non-valid path where insert to should result with an error',
                () => {
                    expect(() => {
                        return getFlattened(
                            MultiLevelLinkedList.insertItem(
                                MultiLevelLinkedList.clone(head), 228, [1,3,2,0,0], true));
                    }).toThrow('Path array should contain only 0 and 1!');
                }
            )
        }
    );
}

function removeItemTest() {
    let head = getMultiLevelLinkedList1();

    describe(
        'testing removeItem',
        () => {
            test(
                'Specifying a valid path to an item should result with this item deletion',
                () => {
                    expect(getFlattened(
                        MultiLevelLinkedList.removeItem(
                            MultiLevelLinkedList.clone(head), [0,0])))
                    .toStrictEqual([1, 2, 4, 5, 6, 9, 10]);
                }
            )
        }
    );
    describe(
        'testing removeItem',
        () => {
            test(
                'Specifying a path leading to an item which doesn`t exist should result with an exception',
                () => {
                    expect(() => { 
                        return getFlattened(
                            MultiLevelLinkedList.removeItem(
                                MultiLevelLinkedList.clone(head), [1, 0, 1, 0, 1, 0]));
                    })
                    .toThrow('Path leads to non-existing position!');
                }
            )
        }
    );
    describe(
        'testing removeItem',
        () => {
            test(
                'Specifying a non-valid path to an item should result with an exception',
                () => {
                    expect(() => { 
                        return getFlattened(
                            MultiLevelLinkedList.removeItem(
                                MultiLevelLinkedList.clone(head), [1, 0, 3]));
                    })
                    .toThrow('Path array should contain only 0 and 1!');
                }
            )
        }
    );
}

function removeLayerTest() {
    let head = getMultiLevelLinkedList1();

    describe(
        'testing removeLayer',
        () => {
            test(
                'Providing a number of a layer which exists should result with deleting this layer',
                () => {
                    expect(getFlattened(
                        MultiLevelLinkedList.removeLayer(
                            MultiLevelLinkedList.clone(head), 2)))
                    .toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8]);
                }
            )
        }
    );
    describe(
        'testing removeLayer',
        () => {
            test(
                'Deleting of a 0th layer should result with clearing a MLLL',
                () => {
                    expect(getFlattened(
                        MultiLevelLinkedList.removeLayer(
                            MultiLevelLinkedList.clone(head), 0)))
                    .toStrictEqual([]);
                }
            )
        }
    );
    describe(
        'testing removeLayer',
        () => {
            test(
                'Deleting of a layer which doesn`t exist should result original MLLL',
                () => {
                    expect(getFlattened(
                        MultiLevelLinkedList.removeLayer(
                            MultiLevelLinkedList.clone(head), 5)))
                    .toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
                }
            )
        }
    );
}

function removeBranchTest() {
    let head = getMultiLevelLinkedList1();

    describe(
        'testing removeBranch',
        () => {
            test(
                'Specifying a valid path to branch root should result with deleting this branch',
                () => {
                    expect(getFlattened(
                        MultiLevelLinkedList.removeBranch(
                            MultiLevelLinkedList.clone(head), [1, 0])))
                    .toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8]);
                }
            )
        }
    );
    describe(
        'testing removeBranch',
        () => {
            test(
                'Specifying a path leading to non-existing element should result with an exception',
                () => {
                    expect(() => {
                        let newHead = MultiLevelLinkedList.clone(head);
                        MultiLevelLinkedList.removeBranch(newHead, [1, 0, 1, 0, 1, 0]);
                        return getFlattened(newHead);
                    }).toThrow('Path leads to non-existing position!');
                }
            )
        }
    );
    describe(
        'testing removeBranch',
        () => {
            test(
                'Specifying a non-valid path to branch root should result with an exception',
                () => {
                    expect(() => {
                        let newHead = MultiLevelLinkedList.clone(head);
                        MultiLevelLinkedList.removeBranch(newHead, [0, 3, 0, 1]);
                        return getFlattened(newHead);
                    }).toThrow('Path array should contain only 0 and 1!');
                }
            )
        }
    );
}

cloneTest();
moveItemTest();
insertItemTest();
removeItemTest();
removeLayerTest();
removeBranchTest();

// describe('testing index file', () => {
//     test('empty string should result in zero', () => {
//         expect(getString('abc')).toBe('Hello World abc');
//     });
// });