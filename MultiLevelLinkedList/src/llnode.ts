export class LLNode<T>
{
    public data:T;
    public next:LLNode<T> | null;
    public child:LLNode<T> | null;
    constructor();

    constructor(data:T, next:LLNode<T>, child:LLNode<T>);

    constructor(...arr: any[])
    {
        if (arr.length === 3) 
        {
            this.data = arr[0];
            this.next = arr[1];
            this.child = arr[2];
            return;
        }
        if (arr.length === 0) 
        {
            return;
        }
    }
}