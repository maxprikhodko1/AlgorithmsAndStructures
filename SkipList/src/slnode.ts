export class SLNode
{
    public key: number;
    public forward: SLNode[];

    public constructor(key: number, level: number)
    {
        this.key = key;
        this.forward = [];//new SLNode[level + 1];
    }
}