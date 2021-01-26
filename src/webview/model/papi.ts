// each entity will use this symbol to store its pointer
// to avoid having an instance property that would then

import { Removed, Added, Replaced } from "../diff/types";
import { maybeChanged, MaybeChanged, maybeChangedArray, MaybeChangedArray } from "./compare";

export abstract class Entity {
  abstract get displayName(): MaybeChanged<string>;
}

export class NamedEntity extends Entity {
  name: MaybeChanged<string>;

  constructor(data: any) {
    super();
    this.name = data.name;
  }

  get displayName(): MaybeChanged<string> {
    return this.name;
  }
}

export class Variable extends NamedEntity {
  description: MaybeChanged<string>;
  value: MaybeChanged<string>;
  sensitive: MaybeChanged<boolean>;
  hidden: MaybeChanged<boolean>;

  constructor(data: any) {
    super(data);
    this.description = data.description;
    this.value = data.value;
    this.sensitive = data.sensitive;
    this.hidden = data.hidden;
  }
}

export class Atom extends NamedEntity {
  uuid: MaybeChanged<string>;
  options: MaybeChanged<any>;

  constructor(data: any) {
    super(data);
    this.uuid = data.uuid;
    this.options = data.options;
  }
}

export class Criterion extends Atom {
}

export class Behavior extends Atom {
}

export abstract class Rule extends NamedEntity {
  uuid: MaybeChanged<string>;
  comments: MaybeChanged<string>;
  behaviors: MaybeChangedArray<Behavior>;
  children: MaybeChangedArray<ChildRule>;

  constructor(data: any) {
    super(data);
    this.uuid = data.uuid;
    this.comments = data.comments;
    if (data.behaviors) {
      this.behaviors = maybeChangedArray(Behavior, data.behaviors);
    }
    if (data.children) {
      this.children = maybeChangedArray(ChildRule, data.children);
    }
  }
}

export enum CriteriaMustSatisfy {
  ALL = "all",
  ANY = "any",
}

export class ChildRule extends Rule {
  criteriaMustSatisfy: MaybeChanged<CriteriaMustSatisfy>;
  criteria: MaybeChangedArray<Criterion>;

  constructor(data: any) {
    super(data);
    if (data.criteria) {
      this.criteria = maybeChangedArray(Criterion, data.criteria);
    }
    this.criteriaMustSatisfy = data.criteriaMustSatisfy;
  }
}

export class DefaultRule extends Rule {
  variables: MaybeChangedArray<Variable> = [];
  customOverride: MaybeChanged<CustomOverride> = null;
  advancedOverride: MaybeChanged<AdvancedOverride> = null;

  constructor(data: any) {
    super(data);
    console.log(data);
    if (data.variables) {
      this.variables = maybeChangedArray(Variable, data.variables);
    }
    if (data.customOverride) {
      this.customOverride = maybeChanged(CustomOverride, data.customOverride);
    }
    if (data.advancedOverride) {
      this.advancedOverride = maybeChanged(AdvancedOverride, data.advancedOverride);
    }
  }
}

export class CustomOverride extends NamedEntity {
  overrideId: MaybeChanged<string>;

  constructor(data: any) {
    super(data);
    this.overrideId = data.overrideId;
  }

  get displayName(): MaybeChanged<string> {
    return "Custom Override";
  }
}

export class AdvancedOverride extends Entity {
  xml: MaybeChanged<string>;

  constructor(data: any) {
    super();
    this.xml = data;
  }

  get displayName(): MaybeChanged<string> {
    return "Advanced Override";
  }
}

export class Property extends Entity {
  defaultRule: MaybeChanged<DefaultRule>;

  constructor(data: any) {
    super();
    this.defaultRule = maybeChanged(DefaultRule, data.rules);
  }

  get variables(): MaybeChangedArray<Variable> {
    if (this.defaultRule instanceof Removed) {
      return this.defaultRule.value.variables;
    } else if (this.defaultRule instanceof Added) {
      return this.defaultRule.value.variables;
    } else if (this.defaultRule instanceof Replaced) {
      return this.defaultRule.right.variables;
    } else {
      return this.defaultRule.variables;
    }
  }

  get displayName(): MaybeChanged<string> {
    return "Property";
  }
}
