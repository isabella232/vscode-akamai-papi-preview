import * as rfc6902 from "rfc6902";
import {Pointer, PointerEvaluation} from "rfc6902/pointer";
import * as ops from "rfc6902/diff";
import * as jsondiffpatch from "jsondiffpatch";

export const DELETIONS = Symbol("deletions");

export function diff(left: object, right: object) {
  // jsondiffpatch creates very compact patches and provides
  // a formatter "as jsonpatch".
  const differ = jsondiffpatch.create({
    objectHash: function (obj: { name: any; }, index: any) {
      return obj.name || index;
    }
  });
  var delta = differ.diff(left, right);
  //@ts-expect-error
  return jsondiffpatch.formatters.jsonpatch.format(delta, left);
}

export function patch(obj: object, patches: rfc6902.Operation[]): object {
  const patchAnnotator = new PatchAnnotator(obj);
  return patchAnnotator.process(patches).finalize();
}

class PatchAnnotator {
  obj: any;
  withDeletions: any[];

  constructor(obj: any) {
    this.obj = obj;
    this.withDeletions = [];
  }

  process(patches: rfc6902.Operation[]): PatchAnnotator {
    patches.forEach(patch => this[patch.op](patch));
    return this;
  }

  evaluate(path: string): PointerEvaluation {
    return Pointer.fromJSON(path).evaluate(this.obj);
  }

  add(op: ops.AddOperation) {
    const evaluation = this.evaluate(op.path);
    if (Array.isArray(evaluation.parent)) {
      evaluation.parent.splice(+evaluation.key, 0, new AddAnnotation(op.value));
    } else {
      evaluation.parent[evaluation.key] = new AddAnnotation(op.value);
    }
  }

  replace(op: ops.ReplaceOperation) {
    const evaluation = this.evaluate(op.path);
    if (Array.isArray(evaluation.parent)) {
      evaluation.parent[+evaluation.key] = new ReplaceAnnotation(evaluation.value, op.value);
    } else {
      evaluation.parent[evaluation.key] = new ReplaceAnnotation(evaluation.value, op.value);
    }
  }

  move(op: ops.MoveOperation) {
    const fromEvaluation = this.evaluate(op.from);
    this.remove({op: "remove", path: op.from});
    this.add({op: "add", path: op.path, value: fromEvaluation.value});
  }

  remove(op: ops.RemoveOperation) {
    const evaluation = this.evaluate(op.path);
    if (evaluation.parent[DELETIONS] === undefined) {
      evaluation.parent[DELETIONS] = {};
      this.withDeletions.push(evaluation.parent);
    }
    evaluation.parent[DELETIONS][evaluation.key] = evaluation.value;
    if (Array.isArray(evaluation.parent)) {
      evaluation.parent.splice(+evaluation.key, 1);
    } else {
      delete evaluation.parent[evaluation.key];
    }
  }

  finalize(): any {
    this.withDeletions.forEach(parent => {
      Object.entries(parent[DELETIONS]).forEach(([k, v]) => {
        if (Array.isArray(parent)) {
          parent.splice(+k, 0, new DeleteAnnotation(v));
        } else {
          parent[k] = new DeleteAnnotation(v);
        }
      });
      delete parent[DELETIONS];
    });
    return this.obj;
  }
}

export class PatchAnnotation {
}

export class ReplaceAnnotation extends PatchAnnotation {
  left: any;
  right: any;
  constructor(left: any, right: any) {
    super();
    this.left = left;
    this.right = right;
  }
}

export class AddAnnotation extends PatchAnnotation {
  value: any;
  constructor(value: any) {
    super();
    this.value = value;
  }
}

export class DeleteAnnotation extends PatchAnnotation {
  value: any;
  constructor(value: any) {
    super();
    this.value = value;
  }
}
