export abstract class Quarter {
  constructor(
    public name: string,
    public coeff: number
  ) {}

  public static newMoon(): NewMoon {
    return NewMoon.getInstance();
  }

  public static firstQuarter(): FirstQuarter {
    return FirstQuarter.getInstance();
  }

  public static fullMoon(): FullMoon {
    return FullMoon.getInstance();
  }

  public static lastQuarter(): LastQuarter {
    return LastQuarter.getInstance();
  }
}

export class NewMoon extends Quarter {
  private static _instance: NewMoon;

  private constructor() {
    super('New Moon', 0.0);
  }

  public static getInstance(): NewMoon {
    return this._instance || (this._instance = new this());
  }
}

export class FirstQuarter extends Quarter {
  private static _instance: FirstQuarter;

  private constructor() {
    super('First Quarter', 0.25);
  }

  public static getInstance(): FirstQuarter {
    return this._instance || (this._instance = new this());
  }
}

export class FullMoon extends Quarter {
  private static _instance: FullMoon;

  private constructor() {
    super('Full Moon', 0.5);
  }

  public static getInstance(): FullMoon {
    return this._instance || (this._instance = new this());
  }
}

export class LastQuarter extends Quarter {
  private static _instance: LastQuarter;

  private constructor() {
    super('Last Quarter', 0.75);
  }

  public static getInstance(): LastQuarter {
    return this._instance || (this._instance = new this());
  }
}
