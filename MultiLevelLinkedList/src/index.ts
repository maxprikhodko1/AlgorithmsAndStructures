import { LLNode } from "./llnode";
import { MultiLevelLinkedList } from "./multiLevelLinkedList";

function getMultiLevelLinkedList(): LLNode<number> {
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

let head = getMultiLevelLinkedList();
let headFl = MultiLevelLinkedList.flatten(head);
console.log(1);