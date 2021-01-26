// function LCSLength(X[1..m], Y[1..n])
//     C = array(0..m, 0..n)
//     for i := 0..m
//         C[i,0] = 0
//     for j := 0..n
//         C[0,j] = 0
//     for i := 1..m
//         for j := 1..n
//             if X[i] = Y[j] //i-1 and j-1 if reading X & Y from zero
//                 C[i,j] := C[i-1,j-1] + 1
//             else
//                 C[i,j] := max(C[i,j-1], C[i-1,j])
//     return C[m,n]

import { diff } from "../index";
import { Added, Removed } from "../types";
import { similarity } from "./similarity";

function pad(v) {
  return String(v).padStart(3, " ");
}

class Matrix<T> {
  m: number;
  n: number;

  private arr: Array<T>

  constructor(m: number, n: number, fill: T) {
    this.m = m;
    this.n = n;
    this.arr = new Array<T>(m * n);
    this.arr.fill(fill);
  }

  get(m, n) {
    return this.arr[n * this.m + m];
  }

  set(m, n, v: T) {
    this.arr[n * this.m + m] = v;
  }
}

type cmpFunc = (a, b) => number;

export class LCS {
  readonly a: any[];
  readonly b: any[];
  readonly cmp: (a, b) => boolean;

  private readonly matrix: Matrix<number>;

  constructor(a: any[], b: any[], cmp: cmpFunc) {
    this.a = a;
    this.b = b;
    this.cmp = (a, b) => cmp(a, b) >= 0.8;
    const m = new Matrix<number>(a.length + 1, b.length + 1, 0);
    this.matrix = m;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (this.cmp(a[i-1], b[j-1])) {
          m.set(i, j, m.get(i - 1, j - 1) + 1);
        } else {
          m.set(i, j, Math.max(m.get(i, j-1), m.get(i-1, j)));
        }
      }
    }
  }

  get length(): number {
    return this.matrix.get(this.a.length, this.b.length);
  }

  diff() {
    const backtrack = (result, x, y) => {
      if (x > 0 && y > 0 && this.cmp(this.a[x-1], this.b[y-1])) {
        backtrack(result, x - 1, y - 1);
        result.push(diff(this.a[x-1], this.b[y-1]));
      } else if (y > 0 && (x == 0 || this.matrix.get(x, y-1) >= this.matrix.get(x-1, y))) {
        backtrack(result, x, y - 1);
        result.push(new Added(this.b[y-1]));
      } else if (x > 0 && (y == 0 || this.matrix.get(x, y-1) < this.matrix.get(x-1, y))) {
        backtrack(result, x - 1, y);
        result.push(new Removed(this.a[x-1]));
      }
      return result;
    };
    return backtrack([], this.a.length, this.b.length);
  }

  dump() {
    const pad = c => String(c).padStart(3, " ");
    console.log(['', '*', ...Array.from(this.a)].map(c => pad(c)).join(""));
    console.log(`${pad("*")}${Array.from(Array(this.a.length+1).keys()).map(i => pad("0")).join("")}`);
    for (let j = 0; j < this.b.length; j++) {
      console.log(`${pad(this.b[j])}${Array.from(Array(this.a.length+1).keys()).map(i => pad(this.matrix.get(i, j))).join("")}`);
    }
  }
}

if (typeof require !== "undefined" && require.main == module) {
  const [a, b] = process.argv.slice(-2);
  const lcs1 = new LCS(Array.from(a), Array.from(b), similarity);
  lcs1.dump();
  console.log(lcs1.length);
  console.log(lcs1.diff());
}