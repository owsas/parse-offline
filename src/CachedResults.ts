import * as Parse from 'parse';

export class CachedResults {
  createdAt: Date;
  results: any[];

  static toParseObjs(className: string, results: any[]): Parse.Object[] {
    return results.map((obj) => {
      const jsonReadyToBeConverted = {
        className,
        ...obj,
      };

      // return Parse objects
      return Parse.Object.fromJSON(jsonReadyToBeConverted, false);
    });
  }

  constructor(objs: Parse.Object[], createdAt?: Date) {
    this.createdAt = createdAt || new Date();
    this.results = objs.map(o => o.toJSON());
  }

  toParseObjs(className: string) {
    return CachedResults.toParseObjs(className, this.results);
  }

  toJSON(): any {
    return {
      createdAt: this.createdAt,
      results: this.results,
    };
  }

  static fromJSON(
    json: { createdAt: Date, results: any[] },
  ): CachedResults {
    const { createdAt, results } = json;
    const c = new CachedResults([], createdAt);
    c.results = results;
    return c;
  }
}
