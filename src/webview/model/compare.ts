import * as rfc6902 from "rfc6902";
import * as jsondiffpatch from "jsondiffpatch";

export const DELETIONS = Symbol("deletions");

class PatchOp {
  static isAddOrReplace(op: PatchOp) {
    return op instanceof ReplaceOp || op instanceof AddOp;
  }
}
class ReplaceOp extends PatchOp {
  left: any;
  right: any;
  constructor(left: any, right: any) {
    super();
    this.left = PatchOp.isAddOrReplace(left) ? left.right : left;
    this.right = PatchOp.isAddOrReplace(right) ? right.right : right;
  }
}
class AddOp extends PatchOp {
  right: any;
  constructor(right: any) {
    super();
    this.right = PatchOp.isAddOrReplace(right) ? right.right : right;
  }
}

function diffingProxy<T extends object>(obj: T): T {
  const proxy = new Proxy(obj, {
    get: (target, k, receiver) => {
      if (k === "__proxyTarget") {
        return obj;
      }
      return Reflect.get(target, k, receiver);
    },

    set: (target, k, v, receiver): boolean => {
      if (typeof k !== "symbol") {
        //@ts-expect-error
        if (!Array.isArray(target) || !isNaN(k)) {
          if (k in target) {
            const left = Reflect.get(target, k, receiver);
            v = new ReplaceOp(left, v);
          } else {
            v = new AddOp(v);
          }
        }
      }
      return Reflect.set(target, k, v, receiver);
    },

    deleteProperty: (target, k): boolean => {
      if (typeof k !== "symbol") {
        //@ts-expect-error
        if (!Array.isArray(target) || !isNaN(k)) {
          target[DELETIONS] = target[DELETIONS] || {};
          var old = Reflect.get(target, k);
          if (old instanceof ReplaceOp) {
            old = old.left;
          } else if (old instanceof AddOp) {
            old = old.right;
          }
          target[DELETIONS][k] = old;
        }
      }
      return Reflect.deleteProperty(target, k);
    }
  });
  return proxy;
}

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

export function patch(obj: object, patch: rfc6902.Operation[]): object {
  obj = JSON.parse(JSON.stringify(obj), (k, v) => {
    return typeof v === "object" ? diffingProxy(v) : v;
  })
  rfc6902.applyPatch(obj, patch);
  return obj["__proxyTarget"];
}