export abstract class Changed {
}

export class Added extends Changed {
  value: any;
  constructor(value) {
    super();
    this.value = value;
  }
}

export class Removed extends Changed {
  value: any;
  constructor(value) {
    super();
    this.value = value;
  }
}

export class Replaced extends Changed {
  left: any;
  right: any;
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
}
