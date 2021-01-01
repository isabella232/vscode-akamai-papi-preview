// each entity will use this symbol to store its pointer
// to avoid having an instance property that would then
// be output as YAML or in other property enumeration situations
const POINTER = Symbol("JSON Pointer");

export class Entity {
  constructor(data: any, pointer: string) {
    this[POINTER] = pointer;
  }

  get pointer(): string {
    return this[POINTER];
  }
}

export class Variable extends Entity {
  name: string;
  description: string;
  value: string;
  sensitive: boolean;
  hidden: boolean;

  constructor(data: any, pointer: string) {
    super(data, pointer);
    this.name = data.name;
    this.description = data.description;
    this.value = data.value;
    this.sensitive = data.sensitive;
    this.hidden = data.hidden;
  }
}

export class Atom extends Entity {
  name: string;
  options: any;

  constructor(data: any, pointer: string) {
    super(data, pointer);
    this.name = data.name;
    this.options = data.options;
  }
}

export class Criterion extends Atom {
}

export class Behavior extends Atom {
}

export interface Rule {
  name: string;
  breadcrumb: string;
}

export abstract class StandardRule extends Entity implements Rule {
  name: string;
  comments: string;
  behaviors: Behavior[];
  children: ChildRule[];

  constructor(data: any, pointer: string) {
    super(data, pointer);
    this.name = data.name;
    this.comments = data.comments;
    this.behaviors = data.behaviors?.map((behavior, idx) => new Behavior(behavior, `${this.pointer}/behaviors/${idx}`)) || [];
    this.children = data.children?.map((child, idx) => new ChildRule(child, this, `${this.pointer}/children/${idx}`)) || [];
  }

  abstract breadcrumb: string;
}

export enum CriteriaMustSatisfy {
  ALL = "all",
  ANY = "any",
}

const PARENT = Symbol("Parent rule");

export class ChildRule extends StandardRule {
  parent: StandardRule;
  criteriaMustSatisfy: CriteriaMustSatisfy;
  criteria: Criterion[];

  constructor(data: any, parent: StandardRule, pointer: string) {
    super(data, pointer);
    this[PARENT] = parent;
    this.criteria = data.criteria?.map((criterion, idx) => new Criterion(criterion, `${this.pointer}/criteria/${idx}`)) || [];
    this.criteriaMustSatisfy = data.criteriaMustSatisfy;
  }

  get breadcrumb(): string {
    return this[PARENT].breadcrumb + " > " + this.name;
  }
}

export class CustomOverrideRule implements Rule {
  customOverride: any;

  constructor(data: any, pointer: string) {
    this[POINTER] = pointer;
    this.customOverride = data;
  }

  get name(): string {
    return "Custom Override";
  }

  get breadcrumb(): string {
    return this.name;
  }
}

export class AdvancedOverrideRule implements Rule {
  advancedOverride: string;

  constructor(data: any, pointer: string) {
    this[POINTER] = pointer;
    this.advancedOverride = data;
  }

  get name(): string {
    return "Advanced Override";
  }

  get breadcrumb(): string {
    return this.name;
  }
}

export class DefaultRule extends StandardRule {
  variables: Variable[];
  customOverride: CustomOverrideRule = null;
  advancedOverride: AdvancedOverrideRule = null;

  constructor(data: any, pointer: string) {
    super(data, pointer);
    this.variables = data.variables?.map((child, idx) => new Variable(child, `${this.pointer}/variables/${idx}`)) || [];
    if (data.customOverride) {
      this.customOverride = new CustomOverrideRule(data.customOverride, `${this.pointer}/customOverride`);
    }
    if (data.advancedOverride) {
      this.advancedOverride = new AdvancedOverrideRule(data.advancedOverride, `${this.pointer}/advancedOverride`);
    }
  }

  get breadcrumb(): string {
    return this.name;
  }
}

export class Property extends Entity {
  defaultRule: DefaultRule;

  constructor(data: any) {
    super(data, "");
    this.defaultRule = new DefaultRule(data.rules, "/rules");
  }

  get variables(): Variable[] {
    return this.defaultRule.variables;
  }
}
