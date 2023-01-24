//import { SLNode } from "./slnode";
import { SkipList } from "./skipList";

let lst:SkipList = new SkipList(3, 0.5);
  
lst.insert(3);
lst.insert(6);
lst.insert(7);
lst.insert(9);
lst.insert(12);
lst.insert(19);
lst.insert(17);
lst.insert(26);
lst.insert(21);
lst.insert(25);
lst.displayList();
lst.delete(9);
lst.delete(12);
lst.displayList();
lst.find(9);
let clone = lst.clone();
clone.displayList();
