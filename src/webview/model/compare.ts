import {Replaced, Removed, Added} from "../diff/types";

export type MaybeChanged<Thing> = Thing | Replaced | Added | Removed;
export type MaybeChangedArray<Thing> = MaybeChanged<Array<Thing>> | Array<MaybeChanged<Thing>>;

type Constructor<Thing> = new (thing: any, ...args: any[]) => Thing;

export function maybeChanged<Thing>(ThingConstructor: Constructor<Thing>, thing: any, ...args: any[]): MaybeChanged<Thing> {
  if (thing instanceof Replaced) {
    thing.left = new ThingConstructor(thing.left, ...args);
    thing.right = new ThingConstructor(thing.right, ...args);
  } else if (thing instanceof Added || thing instanceof Removed) {
    thing.value = new ThingConstructor(thing.value, ...args);
  } else {
    thing = new ThingConstructor(thing, ...args);
  }
  return thing;
}

export function maybeChangedArray<Thing>(ThingConstructor: Constructor<Thing>, thingArray: MaybeChangedArray<Thing>, ...args: any[]): MaybeChangedArray<Thing> {
  if (thingArray instanceof Replaced) {
    thingArray.left = thingArray.left?.map(thing => new ThingConstructor(thing, ...args));
    thingArray.right = thingArray.right?.map(thing => new ThingConstructor(thing, ...args));
  } else if (thingArray instanceof Added || thingArray instanceof Removed) {
    thingArray.value = thingArray.value?.map(thing => new ThingConstructor(thing, ...args));
  } else if (thingArray instanceof Array) {
    thingArray = Array(...thingArray).map(thing => maybeChanged(ThingConstructor, thing, ...args));
  }
  return thingArray;
}
