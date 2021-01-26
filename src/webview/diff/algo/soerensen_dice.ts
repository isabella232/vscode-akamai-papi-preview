import bigrams from "./bigrams";

export default function soerensen_dice(a: string, b: string): number {
  var ah = new Set(a.length > 2 ? bigrams(a) : a),
      bh = new Set(b.length > 2 ? bigrams(b) : b);
  var ab = new Set(Array.from(ah).filter(v => bh.has(v)));
  if (ah.size + bh.size === 0) {
    return 1;
  } 
  return 2 * ab.size / (ah.size + bh.size);
}
