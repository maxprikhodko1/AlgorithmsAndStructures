import CliTable3 = require("cli-table3");

type BeforeAllCallback = () => void;
type AfterAllCallback = () => void;
type BeforeEachCallback = () => void;
type AfterEachCallback = () => void;
type BenchmarkCallback = () => void;

type BenchmarkCaseDef = {
    name: string;
    fn: BenchmarkCallback;
};

type BenchmarkSuiteOptions = {
    numberOfRuns?: number;
    omitBestAndWorstResult?: boolean;
    wamUpRuns?: number;
    warmUp?: boolean;
};
  
type BenchmarkReport = Array<BenchmarkReportEntry>;

type BenchmarkReportEntry = {
    name: string;
    numberOfRuns: number;
    min: number;
    max: number;
    mean: number;
    std: number;
  };

const min = (arr: ReadonlyArray<number>) => {
    let min = arr[0];
  
    for (const x of arr) {
      if (x < min) {
        min = x;
      }
    }
  
    return min;
};
  
const max = (arr: ReadonlyArray<number>) => {
    let max = arr[0];
  
    for (const x of arr) {
      if (x > max) {
        max = x;
      }
    }
  
    return max;
};

const mean = (arr: ReadonlyArray<number>) =>
  arr.reduce((a, b) => a + b, 0) / arr.length;

const stdDev = (arr: ReadonlyArray<number>) => {
  const mean_ = mean(arr);

  const variance =
    arr.reduce((acc, x) => acc + (x - mean_) ** 2, 0) / (arr.length - 1);

  return Math.sqrt(variance);
};

export const generateBenchmarkReportEntry = (params: {
    caseDurations: ReadonlyArray<number>;
    name: string;
  }): BenchmarkReportEntry => {
    const { caseDurations, name } = params;
  
    const min_ = min(caseDurations);
    const max_ = max(caseDurations);
  
    const mean_ = mean(caseDurations);
    const std = stdDev(caseDurations);
  
    return {
      name,
      numberOfRuns: caseDurations.length,
      min: min_,
      max: max_,
      mean: mean_,
      std,
    };
};

export const reportBenchmarkCli = (params: {
    report: BenchmarkReport;
    suiteName: string;
  }): void => {
    const { report, suiteName } = params;
  
    const table = new CliTable3({
      head: [
        "Operation",
        "Min time (ns)",
        "Max time (ns)",
        "Mean time(ns)",
        "Std (ns)",
      ],
    });
  
    for (const { name, numberOfRuns, min, max, mean, std } of report) {
      table.push({
        [name]: [
          (min * 1000).toFixed(3),
          (max * 1000).toFixed(3),
          (mean * 1000).toFixed(3),
          (std * 1000).toFixed(3),
        ],
      });
    }
  
    console.log("\n\n");
    console.log(
      `----------------------${suiteName.toUpperCase()}----------------------`
    );
    console.log(table.toString());
  };

/////////////////////////////////////////////////////////

export type BenchmarkSuiteDef = {
  beforeAllCallbacks: Array<BeforeAllCallback>;
  afterAllCallbacks: Array<AfterAllCallback>;
  beforeEachCallbacks: Array<BeforeEachCallback>;
  afterEachCallbacks: Array<AfterEachCallback>;
  cases: Array<BenchmarkCaseDef>;
  name: string;
  options: BenchmarkSuiteOptions;
};

const benchmarkOptionsDefault = {
  numberOfRuns: 1000,
  warmUp: true,
  wamUpRuns: 50,
  omitBestAndWorstResult: false,
} satisfies Required<BenchmarkSuiteOptions>;

export const benchmark = (
    name: string,
    options: BenchmarkSuiteOptions,
    cb: (suite: IBenchmarkSuiteBuilder) => void
  ): void => {
    const suiteBuilder = new BenchmarkSuiteBuilder();
  
    cb(suiteBuilder);
  
    const benchmarkSuite = suiteBuilder.setName(name).setOptions(options).build();
  
    benchmarkSuite.run();
};

export interface IBenchmarkSuiteBuilder {
    beforeAll(cb: BeforeAllCallback): IBenchmarkSuiteBuilder;
    afterAll(cb: AfterAllCallback): IBenchmarkSuiteBuilder;
    beforeEach(cb: BeforeEachCallback): IBenchmarkSuiteBuilder;
    afterEach(cb: AfterEachCallback): IBenchmarkSuiteBuilder;
    case(name: string, fn: BenchmarkCallback): IBenchmarkSuiteBuilder;
  }
  
  export class BenchmarkSuiteBuilder implements IBenchmarkSuiteBuilder {
    private _beforeAllCallbacks: Array<BeforeAllCallback> = [];
    private _afterAllCallbacks: Array<AfterAllCallback> = [];
    private _beforeEachCallbacks: Array<BeforeEachCallback> = [];
    private _afterEachCallbacks: Array<AfterEachCallback> = [];
    private _cases: Array<BenchmarkCaseDef> = [];
    private _name: string | null = null;
    private _options: BenchmarkSuiteOptions | null = null;
  
    public beforeAll(cb: BeforeAllCallback): BenchmarkSuiteBuilder {
      this._beforeAllCallbacks.push(cb);
      return this;
    }
  
    public afterAll(cb: AfterAllCallback): BenchmarkSuiteBuilder {
      this._afterAllCallbacks.push(cb);
      return this;
    }
  
    public beforeEach(cb: BeforeEachCallback): BenchmarkSuiteBuilder {
      this._beforeEachCallbacks.push(cb);
      return this;
    }
  
    public afterEach(cb: AfterEachCallback): BenchmarkSuiteBuilder {
      this._afterEachCallbacks.push(cb);
      return this;
    }
  
    public case(name: string, fn: BenchmarkCallback): BenchmarkSuiteBuilder {
      this._cases.push({
        name,
        fn,
      });
      return this;
    }
  
    public setName(name: string): BenchmarkSuiteBuilder {
      this._name = name;
      return this;
    }
  
    public setOptions(options: BenchmarkSuiteOptions): BenchmarkSuiteBuilder {
      this._options = options;
      return this;
    }

    private assertIsDefined<TValue>(value: TValue, message: string = "value is not defined."): asserts value is NonNullable<TValue> 
    {
        if (value === null || value === undefined)
        {
            throw new Error(message);
        }
    }      
  
    public build(): BenchmarkSuite {
      this.assertIsDefined(this._name, "Test suite name must be defined.");
      this.assertIsDefined(this._options, "Test suite options must be defined.");
  
      if (this._cases.length === 0) {
        throw new Error("Benchmark suite must have at least one benchmark case.");
      }
  
      return new BenchmarkSuite({
        afterAllCallbacks: this._afterAllCallbacks,
        beforeAllCallbacks: this._beforeAllCallbacks,
        beforeEachCallbacks: this._beforeEachCallbacks,
        afterEachCallbacks: this._afterEachCallbacks,
        cases: this._cases,
        name: this._name,
        options: this._options,
      });
    }
}
  
export class BenchmarkSuite {
  private readonly _beforeAllCallbacks: Array<BeforeAllCallback>;
  private readonly _afterAllCallbacks: Array<AfterAllCallback>;
  private readonly _beforeEachCallbacks: Array<BeforeEachCallback>;
  private readonly _afterEachCallbacks: Array<AfterEachCallback>;
  private readonly _cases: Array<BenchmarkCaseDef>;
  private readonly _name: string;
  private readonly _options: Required<BenchmarkSuiteOptions>;

  constructor(def: BenchmarkSuiteDef) {
    this._beforeAllCallbacks = def.beforeAllCallbacks;
    this._afterAllCallbacks = def.afterAllCallbacks;
    this._beforeEachCallbacks = def.beforeEachCallbacks;
    this._afterEachCallbacks = def.afterEachCallbacks;
    this._cases = def.cases;
    this._name = def.name;
    this._options = {
      ...benchmarkOptionsDefault,
      ...def.options,
    };
  }

  public run() {
    const report: BenchmarkReport = [];

    for (const { name, fn } of this._cases) {
      console.log(`Running benchmark case: ${name}`);
      const tic = performance.now();
      let caseDurations = this._runBenchmarkCase(fn);
      const toc = performance.now();

      console.log(
        `Running benchmark case: ${name} - done in ${(toc - tic) / 1e3} (s)`
      );

      if (this._options.omitBestAndWorstResult === true) {
        caseDurations = this._dropBestAndWorstCase(caseDurations);
      }

      const reportEntry = generateBenchmarkReportEntry({
        caseDurations,
        name,
      });

      report.push(reportEntry);
    }

    reportBenchmarkCli({
      report,
      suiteName: this._name,
    });
  }

  private _dropBestAndWorstCase(
    durations: ReadonlyArray<number>
  ): Array<number> {
    const min_ = min(durations);
    const max_ = max(durations);

    return durations.filter((x) => x !== min_ && x !== max_);
  }

  private _runBenchmarkCase(fn: BenchmarkCallback): Array<number> {
    const runCase = (): number => {
      this._runBeforeEach();
      const tic = performance.now();
      fn();
      const toc = performance.now();
      this._runAfterEach();

      return toc - tic;
    };

    this._runBeforeAll();

    if (this._options.warmUp === true) {
      for (let i = 0; i < this._options.wamUpRuns; i++) {
        runCase();
      }
    }

    const durationsMs: Array<number> = [];
    for (let i = 0; i < this._options.numberOfRuns; i++) {
      const duration = runCase();
      durationsMs.push(duration);
    }

    this._runAfterAll();

    return durationsMs;
  }

  private _runBeforeAll() {
    for (const beforeAllCb of this._beforeAllCallbacks) {
      beforeAllCb();
    }
  }

  private _runAfterAll() {
    for (const afterAllCb of this._afterAllCallbacks) {
      afterAllCb();
    }
  }

  private _runBeforeEach() {
    for (const beforeEachCb of this._beforeEachCallbacks) {
      beforeEachCb();
    }
  }

  private _runAfterEach() {
    for (const afterEachCb of this._afterEachCallbacks) {
      afterEachCb();
    }
  }
}
