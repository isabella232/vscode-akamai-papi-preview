
export default function bigrams(s) {
  if (s.length === 0) {
    return [];
  } else if (s.length === 1) {
    return [s];
  }
  var b = [], i;
  for (i = 1; i < s.length; i++) {
    b.push(s.slice(i-1, i+1));
  }
  return b;
}
