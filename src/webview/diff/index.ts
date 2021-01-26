import hash from "./algo/hash";
import { LCS } from "./algo/lcs";
import { similarity } from "./algo/similarity";
import { Replaced, Removed, Added } from "./types";

export function diff(left: any, right: any) {
  const tleft = typeof left,
        tright = typeof right;
  switch (true) {
    // trivial: strict equality
    case left === right:
      return right;
    // trivial: different types
    case tleft !== tright:
      return new Replaced(left, right);
    case tleft === "string":
      return diff_string(left, right);
    case tleft === "boolean":
      return new Replaced(left, right);
    case tleft === "number":
      return new Replaced(left, right);
    case Array.isArray(left):
      return diff_array(left, right);
    case tleft === "object":
      return diff_object(left, right);
  }
}

export function diff_string(left: string, right: string) {
  return left === right ? right : new Replaced(left, right);
}

export function diff_object(left, right) {
  if ((left === null) !== (right === null)) {
    return new Replaced(left, right);
  }
  var d = {},
      ordered = new Set<string>(
        [
          ...Object.keys(left).map((k, i) => [i, k]),
          ...Object.keys(right).map((k, i) => [i, k])
        ].sort(([i1, k1], [i2, k2]) => +i1 - +i2)
        .map(([i, k]) => String(k))
      ),
      lks = new Set(Object.keys(left)),
      rks = new Set(Object.keys(right));
  for (let k of Array.from(ordered)) {
    if (lks.has(k) && !rks.has(k)) {
      d[k] = new Removed(left[k]);
    } else if (!lks.has(k) && rks.has(k)) {
      d[k] = new Added(right[k])
    } else {
      d[k] = diff(left[k], right[k]);
    }
  }
  return d;
}

export function diff_array(left: any[], right: any[]) {
  const lcs = new LCS(left, right, similarity);
  return lcs.diff();
}
