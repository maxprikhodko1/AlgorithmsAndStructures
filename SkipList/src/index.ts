//import { SLNode } from "./slnode";
import { SkipList } from "./skipList";

function createSkipList(): SkipList {
    let lst:SkipList = new SkipList(5, 0.5);
    lst.insert(7);
    lst.insert(1);
    lst.insert(5);
    lst.insert(3);
    lst.insert(12);
    lst.insert(19);
    lst.insert(17);
    lst.insert(26);
    lst.insert(21);
    lst.insert(25);
    lst.displayList();
    return lst;
}

function deleteItem(): SkipList {
    let lst:SkipList = createSkipList();
    console.log('----------------------');
    console.log('Before delete');
    console.log('----------------------');
    lst.displayList();
    lst.delete(9);
    lst.delete(19);
    console.log('----------------------');
    console.log('After delete');
    console.log('----------------------');
    lst.displayList();
    return lst;
}

function findItem_Exist() : SkipList {
    let lst:SkipList = createSkipList();
    lst.displayList();
    lst.find(19);
    return lst;
}

function findItem_NotExist() : SkipList {
    let lst:SkipList = createSkipList();
    lst.displayList();
    lst.find(66);
    return lst;
}

function clone() {
    let sl = createSkipList();
    let clone = sl.clone();
    console.log();
    console.log('----------------------------------------');
    console.log('CLONE:');
    console.log('----------------------------------------');
    clone.displayList();
}

//createSkipList();
deleteItem();
// findItem_Exist();
// findItem_NotExist();
// clone();


