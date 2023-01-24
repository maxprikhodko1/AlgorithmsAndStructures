import { LLNode } from "./llnode"

export class MultiLevelLinkedList
{
    //public head:Node<T> | null = null;
    
    public static createList<T>(arr:T[]): LLNode<T>
    {
        let head:LLNode<T> | null = null;
        let tmp:LLNode<T> = null;
        // Traversing the passed array
        for (let i:number = 0; i < arr.length; i++)
        {
            // Creating a node if the list
            // is empty
            if (head == null) 
            {
                tmp = head = new LLNode();
            }
            else 
            {
                tmp.next = new LLNode();
                tmp = tmp.next;
            }
            // Created a node with data and
            // setting child and next pointer
            // as NULL.
            tmp.data = arr[i];
            tmp.next = tmp.child = null;
        }
        return head;
    }

    public static clone<T>(head: LLNode<T>): LLNode<T> 
    {
        const copyNode = (value: T): LLNode<T> =>  new LLNode(value, null, null);

        const cloneBranch = (layerRoot: LLNode<T> | null) => 
        {
            let clonedRoot: typeof layerRoot | null = null;

            let currentNode: typeof layerRoot | null = layerRoot;
            let lastNodeCopy: typeof layerRoot | null = null;

            while (currentNode !== null) 
            {
                const nodeCopy = copyNode(currentNode.data);
                nodeCopy.child = cloneBranch(currentNode.child);

                if (lastNodeCopy !== null) 
                {
                    lastNodeCopy.next = nodeCopy;
                } 
                else 
                {
                    clonedRoot = nodeCopy;
                }

                lastNodeCopy = nodeCopy;
                currentNode = currentNode.next;
            }      
            return clonedRoot;
        };

        if(head == null)
            return head;
            
        const copiedRoot = cloneBranch(head);
        return copiedRoot;
  }

    public static flatten<T>(head: LLNode<T>) : LLNode<T>
    {
        const getTail = (node:LLNode<T> | null) =>
        {
            let temp: LLNode<T> | null = node;
            while(temp.next != null)
            {
                temp = temp.next;
            }
            return temp;
        };
        let node = MultiLevelLinkedList.clone(head);
        if (node == null)
        {
            return;
        }
        let tmp:LLNode<T> = null;
        let tail:LLNode<T> = getTail(node);
        let cur: LLNode<T> = node;
        while (cur != null)
        {
            if (cur.child != null)
            {
                tail.next = cur.child;
                tmp = getTail(cur.child);
                tail = tmp;
                cur.child = null;
            }
            cur = cur.next;
        }
        return node;
    }

    // public static getFlattened<T>(head: LLNode<T>): T[]
    // {
    //     let node = MultiLevelLinkedList.flatten(head);
    //     let arr:T[] = [];
    //     while(node != null)
    //     {
    //         arr.push(node.data);
    //         node = node.next;
    //     }
    //     return arr;
    // }

    public static getItem<T>(head: LLNode<T>, path: number[]): LLNode<T>
    {
        //0 - next
        //1 - child
        let cur = head;
        for(let i:number = 0; i < path.length; i++)
        {
            let p = path[i];
            if(cur == null)
                throw new Error('Path leads to non-existing position!');
            switch(p)
            {
                case 0:
                    cur = cur.next;
                    break;
                case 1:
                    cur = cur.child;
                    break;
                default:
                    throw new Error('Path array should contain only 0 and 1!');
            }
        }
        return cur;
    }

    public static moveItem<T>(head: LLNode<T>, positionFromPath: number[], positionToPath: number[]): LLNode<T>
    {
        let source = MultiLevelLinkedList.getItem(head, positionFromPath);
        let prev = MultiLevelLinkedList.getItem(head, positionFromPath.slice(0, positionFromPath.length - 1));
        let lastMove = positionFromPath[positionFromPath.length - 1];
        let target = MultiLevelLinkedList.getItem(head, positionToPath);
        let oldNext = target.next;

        switch(lastMove)
        {
            case 0:
                prev.next = source.next;
                break;
            case 1:
                prev.child = source.next;
                break;
        }
        target.next = source;
        source.next = oldNext;
        return head;
    }

    public static insertItem<T>(head: LLNode<T>, value:T, positionPath: number[], move: boolean): LLNode<T>
    {
        let prev = MultiLevelLinkedList.getItem(head, positionPath);
        let newNode:LLNode<T> = new LLNode(value, null, null);
        //let new: Node<T> = null;
        switch(move)
        {
            case false:
                let oldNext = prev.next;
                newNode.next = oldNext;
                prev.next = newNode;
                break;
            case true:
                let oldChild = prev.child;
                newNode.child = oldChild;
                prev.child = newNode;
                break;
        }
        return head;
    }

    public static removeItem<T>(head:LLNode<T>, positionPath:number[]): LLNode<T>
    {
        let source = MultiLevelLinkedList.getItem(head, positionPath);
        let prev = MultiLevelLinkedList.getItem(head, positionPath.slice(0, positionPath.length - 1));
        let lastMove = positionPath[positionPath.length - 1];

        switch(lastMove)
        {
            case 0:
                prev.next = source.next;
                break;
            case 1:
                break;
        }
        return head;
    }

    public static clear<T>(head:LLNode<T>): LLNode<T>
    {
        head = null;
        return head;
    }

    public static removeLayer<T>(head: LLNode<T>, layerNumber: number): LLNode<T>
    {
        const remove = (cur: LLNode<T>, h) => 
        {
            while(cur != null)
            {
                if(h == layerNumber - 1)
                {
                    if(cur.child != null)
                    {
                        cur.child = null
                    }
                }
                else
                {
                    if(cur.child != null)
                    {
                        remove(cur.child, h + 1);
                    }
                }
                cur = cur.next;
            }
        };

        if(layerNumber == 0)
        {
            MultiLevelLinkedList.clear(head);
            return;
        } 
        remove(head, 0);     
        return head; 
    }

    public static removeBranch<T>(head: LLNode<T>, branchRootPath: number[]): LLNode<T>
    {
        let node = MultiLevelLinkedList.getItem(head, branchRootPath);
        node.child = null;
        return head;
    }
}