

const HASH = Symbol("hash");
export default function hash(o) {
  var h = "", t = typeof o;
  switch (true) {
    case t === "string":
    case t === "number":
    case t === "boolean":
      return JSON.stringify(o);
    case Array.isArray(o):
      if (o[HASH] === undefined) {
        o[HASH] = o.map(v => hash(v)).join(",");
      } 
      return o[HASH];
    case t === "object":
      if (o[HASH] === undefined) {
        o[HASH] = Object.entries(o)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([k, v]) => {
            return `${hash(k)}:${hash(v)}`;
          }).join(",");
      }
      return o[HASH];
  }
}
