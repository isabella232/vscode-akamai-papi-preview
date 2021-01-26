import soerensen_dice from "./soerensen_dice";

export function similarity(a: string, b: string): number {
  return soerensen_dice(String(a), String(b));
}
