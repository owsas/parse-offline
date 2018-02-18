import * as Parse from 'parse';

export class CachedResults {
  createdAt: Date;
  results: any[];

  constructor(objs: Parse.Object[], createdAt?: Date) {
    this.createdAt = createdAt || new Date();
    this.results = objs.map(o => o.toJSON());
  }

  toJSON(): any {
    return {
      createdAt: this.createdAt,
      resuts: this.results,
    };
  }

  toParseObjs(className: string): Parse.Object[] {
    return this.results.map((obj) => {
      const jsonReadyToBeConverted = {
        className,
        ...obj,
      };

      // return Parse objects
      return Parse.Object.fromJSON(jsonReadyToBeConverted, false);
    });
  }

  static fromJSON(
    json: { createdAt: Date, results: any[] },
  ): CachedResults {
    return new CachedResults(json.results, json.createdAt);
  }
}
