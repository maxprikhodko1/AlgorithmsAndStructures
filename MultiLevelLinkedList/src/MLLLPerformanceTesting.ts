import * as st from './performanceTester'
import { MultiLevelLinkedList } from "./multiLevelLinkedList";
import { LLNode } from './llnode';

const fisherYatesShuffle = <T>(arr: Array<T>): void => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));//randomInt(i + 1);
  
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  };

const generateRandomMultiLevelLinkedList = (size: number): LLNode<number> => {
    if (size % 100 !== 0) {
      throw new Error("Size should be multiple of 100.");
    }
  
    const randomNumbers:number[] = new Array<number>(size);
    for (let i = 0; i < size; i++) 
    {
        randomNumbers[i] = i;
    }
    fisherYatesShuffle(randomNumbers);
    
    const createNewNode = (): LLNode<number> => {
      return {
        data: randomNumbers.pop(),
        child: null,
        next: null,
      };
    };
  
    const generateLevel3Item = () => {
      const level3ListSize = 10;
  
      let layerRoot: LLNode<number> = null!;
      let current: LLNode<number> = null!;
  
      for (let i = 0; i < level3ListSize; i++) {
        const newNode = createNewNode();
  
        if (layerRoot === null) {
          layerRoot = newNode;
        }
  
        if (current !== null) {
          current.next = newNode;
        }
  
        current = newNode;
      }
  
      return layerRoot;
    };
  
    const generateLevel2Item = () => {
      const level2ListSize = 9;
  
      let layerRoot: LLNode<number> = null!;
      let current: LLNode<number> = null!;
  
      for (let i = 0; i < level2ListSize; i++) {
        const newNode = createNewNode();
  
        newNode.child = generateLevel3Item();
  
        if (layerRoot === null) {
          layerRoot = newNode;
        }
  
        if (current !== null) {
          current.next = newNode;
        }
  
        current = newNode;
      }
  
      return layerRoot;
    };
  
    let layerRoot: LLNode<number> = null!;
    let current: LLNode<number> = null!;
  
    while (randomNumbers.length !== 0) {
      const newNode = createNewNode();
  
      newNode.child = generateLevel2Item();
  
      if (layerRoot === null) {
        layerRoot = newNode;
      }
  
      if (current !== null) {
        current.next = newNode;
      }
  
      current = newNode;
    }
  
    return layerRoot;
};

function generateRandomPath(head: LLNode<number>, size: number): number[] {
    let pathLength = Math.floor(Math.random()  * size/10);
    let path:number[] = [];
    let current = head;
    let bQuit = false;
    for(let i = 0; i < pathLength; i++)
    {
      if(bQuit)
      break;
      let randomMove = Math.random() < 0.5 ? 0 : 1;
      switch(randomMove)
      {
        case 0:
          if(current.next != null)
          {
            current = current.next;
            path.push(0);
          }
          else
          {
            if(current.child != null)
            {
              current = current.child;
              path.push(1);
            }
            else bQuit = true;
          }
          break;
        case 1:
          if(current.child != null)
          {
            current = current.child;
            path.push(1);
          }
          else
          {
            if(current.next != null)
            {
              current = current.next;
              path.push(0);
            }
            else bQuit = true;
          }
          break;
        }
    }
    return path;
}
  
const MULTI_LEVEL_LL_SIZE = 10_000;
st.benchmark(
    `Multi level linked list, size: ${MULTI_LEVEL_LL_SIZE}`,
    {
      numberOfRuns: 10_000,
      omitBestAndWorstResult: true,
    },
    (suite) => {
      let mlllHead: LLNode<number> = null!;
      let randomPath: number[] = null!;
      let randomElement: number = null!;
  
      suite.beforeEach(() => {
        mlllHead = generateRandomMultiLevelLinkedList(MULTI_LEVEL_LL_SIZE);
        randomPath = generateRandomPath(mlllHead, MULTI_LEVEL_LL_SIZE);
        randomElement = Math.floor(Math.random() * randomElement);//randomInt(randomElement);
      });
  
      suite.case("Delete", () => {
        MultiLevelLinkedList.removeItem(mlllHead, randomPath);
      });
  
      suite.case("Insert", () => {
        let path = randomPath.slice(0, randomPath.length - 1);
        MultiLevelLinkedList.insertItem(mlllHead, randomElement, path, randomPath[randomPath.length - 1] == 0 ? false : true);
      });
  
      suite.case("Search", () => {
        MultiLevelLinkedList.exists(mlllHead, randomElement);
      });
    }
  );
