import * as fs from "fs";
import {inspect} from "util";
import {diff, patch} from "./model/compare";

const left = JSON.parse(fs.readFileSync("tmp/rules-left.json", "utf-8"));
const right = JSON.parse(fs.readFileSync("tmp/rules-right.json", "utf-8"));

const delta = diff(left, right);
console.log(delta);

const result = patch(left, delta);
console.log(inspect(result, {depth: null}));


// How to use git from extension code:

// https://stackoverflow.com/questions/46511595/how-to-access-the-api-for-git-in-visual-studio-code