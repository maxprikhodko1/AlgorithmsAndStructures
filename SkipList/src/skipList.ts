import { SLNode } from "./slnode";

export class SkipList
{
    private maxLevel: number;
    private p:number;
    private level: number;
    private header: SLNode;
    
    public constructor(maxLevel: number, p:number)
    {
        this.maxLevel = maxLevel;
        this.p = p;
        this.level = 0;
        this.header = new SLNode(-1, maxLevel);
    }

    private randomLevel(): number
    {
        let r:number = Math.random();
        let lvl:number = 0;
        while(r < this.p && lvl < this.maxLevel)
        {
            lvl++;
            r = Math.random();
        }
        return lvl;
    }

    // private createNode(key: number, level: number): SLNode
    // {
    //     let n:SLNode = new SLNode(key, level);
    //     return n;
    // }

    private insertElement(key: number, level:number): void
    {
        let current: SLNode = this.header;
  
        // create update array and initialize it
        let update:SLNode[] = [];//new SLNode[this.maxLevel + 1];
  
        /* start from highest level of skip list
        move the current pointer forward while
        key is greater than key of node next to
        current Otherwise inserted current in update
        and move one level down and continue search
        */
        for (let i:number = this.level; i >= 0; i--) 
        {
            while (current.forward[i] != null && current.forward[i].key < key) 
            {
                current = current.forward[i];
            }
            update[i] = current;
        }
  
        /* reached level 0 and forward pointer to
        right, which is desired position to
        insert key.
        */
        
        current = current.forward[0];
  
        /* if current is NULL that means we have reached
        to end of the level or current's key is not
        equal to key to insert that means we have to
        insert node between update[0] and current node
        */
        if (current == null || current.key != key) 
        {
            // Generate a random level for node
            //let rlevel:number = this.randomLevel();
  
            // If random level is greater than list's
            // current level (node with highest level
            // inserted in list so far), initialize
            // update value with pointer to header for
            // further use
            if (level > this.level) 
            {
                for (let i:number = this.level + 1; i < level + 1;i++)
                {
                    update[i] = this.header;
                }
                // Update the list current level
                this.level = level;
            }
  
            // create new node with random level
            // generated
            let n:SLNode = new SLNode(key, level);//this.createNode(key, level);
  
            // insert node by rearranging pointers
            for (let i:number = 0; i <= level; i++) 
            {
                n.forward[i] = update[i].forward[i];
                update[i].forward[i] = n;
            }
            //process.stdout.write("Successfully Inserted key " + key + "\n");//System.out.println("Successfully Inserted key " + key);
        }
    }

    public insert(key:number, printMsg: boolean = false): void
    {
        let rlevel:number = this.randomLevel();
        this.insertElement(key, rlevel);
        if(printMsg)
            process.stdout.write("Successfully Inserted key " + key + "\n");//System.out.println("Successfully Inserted key " + key);
    }

    public delete(key: number, printMsg: boolean = false): void
    {
        let current:SLNode = this.header;
        // create update array and initialize it
        let update:SLNode[] = [];//new Node[MAXLVL+1];

        /* start from highest level of skip list
                move the current pointer forward while
        key is greater than key of node next to
        current Otherwise inserted current in update
        and move one level down and continue search
        */
        for (let i:number = this.level; i >= 0; i--) 
        {
            while (current.forward[i] != null && current.forward[i].key < key)
            {
                current = current.forward[i];
            }
            update[i] = current;
        }

        /* reached level 0 and forward pointer to
        right, which is desired position to
        delete key.
        */
        current=current.forward[0];

        if(current!=null && current.key==key)
        {
            // delete node by rearranging pointers
            for (let i:number = 0; i < this.level; i++) 
            {
                if (update[i].forward[i] != current)
                    break;
                update[i].forward[i] = current.forward[i];
            }

            //if it was the only node in that level and you deleted it, delete the level
            while(this.level > 0 && this.header.forward[this.level] ==null)
            {
                this.level --;
            }
            if(printMsg)
                process.stdout.write("Successfully deleted key "+ key + "\n");//System.out.println("Successfully deleted key "+ key);
        }
    }

    public find(key: number, printMsg: boolean = false): boolean
    {
        let current:SLNode = this.header;
        /* start from highest level of skip list
                move the current pointer forward while
        key is greater than key of node next to
        current    and move one level down and continue search
        */
        for (let i:number = this.level; i >=0 ; i--) 
        {
            while (current.forward[i] != null && current.forward[i].key < key) 
            {
                current = current.forward[i];
            }
        }
        current = current.forward[0];
        // current has to be the key if it is present 
        if(current !=null && current.key==key) 
        {
            if(printMsg)
                process.stdout.write("Key found\n"); //System.out.println("Key found");  
            return true;              
        }
        else
        {
            if(printMsg)
                process.stdout.write("Key not found\n");//System.out.println("Key not found");
            return false;
        }   
   }

   public clone(): SkipList
   {
        const clone = new SkipList(this.maxLevel, this.p);
        let current = this.header.forward[0];
        while (current)
        {
            let level = current.forward.length - 1;
            clone.insertElement(current.key, level);
            current = current.forward[0];
        }
        return clone;
   }

   public clear(): void
   {
        for (let i = 0; i < this.header.forward.length; i++) 
        {
            this.header.forward[i] = null;
        }
   }

    public displayList(): void
    {
        process.stdout.write("\n*****Skip List*****\n");//System.out.println("\n*****Skip List*****");
        for (let i:number = 0; i <= this.level; i++) 
        {
            let node:SLNode = this.header.forward[i];
            process.stdout.write("Level " + i + ": ");//System.out.print("Level " + i + ": ");
            while (node != null) 
            {
                process.stdout.write(node.key + " ");//System.out.print(node.key + " ");
                node = node.forward[i];
            }
            process.stdout.write("\n");//System.out.println();
        }
    }
}