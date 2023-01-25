import * as st from './performanceTester'
import { SkipList } from "./skipList";

const NUMBER_OF_RUNS = 10_000;
const SKIP_LIST_SIZE = 10_000;
// const SKIP_LIST_OPTIONS = {
//   maxLvl: 9,
//   p: 1 / Math.E,
// };

st.benchmark(
  `Skip list, number of runs: ${NUMBER_OF_RUNS}, size: ${SKIP_LIST_SIZE}`,
  {
    numberOfRuns: NUMBER_OF_RUNS,
    omitBestAndWorstResult: false,
  },
  (suite) => {
    let skipList: SkipList = null!;
    let randomExistentElement: number = null!;
    let randomNonExistentElement: number = null!;

    suite.beforeEach(() => {
      skipList = new SkipList(9, 0.5);

      for (let i = SKIP_LIST_SIZE - 1; i >= 0; i--) {
        skipList.insert(i);
      }
    });

    // suite.beforeEach(() => {
    //   randomExistentElement = randomInt(SKIP_LIST_SIZE);
    //   randomNonExistentElement = randomInt(SKIP_LIST_SIZE + 1) - 0.5;
    // });

    suite.beforeEach(() => {
      randomExistentElement = 5000;
      randomNonExistentElement = 5000.5;
    });

    suite.case("Insert", () => {
      skipList.insert(randomNonExistentElement);
    });

    suite.case("Delete", () => {
      skipList.delete(randomExistentElement);
    });

    suite.case("Search", () => {
      skipList.find(randomExistentElement);
    });
  }
);
