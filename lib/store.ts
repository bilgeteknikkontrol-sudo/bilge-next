import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "data");

export async function appendJSON(name: string, obj: unknown): Promise<boolean> {
  try {
    await fs.mkdir(DIR, { recursive: true });
    const file = path.join(DIR, name);
    let arr: unknown[] = [];
    try {
      arr = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      arr = [];
    }
    arr.push(obj);
    await fs.writeFile(file, JSON.stringify(arr, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export async function readJSON<T = unknown>(name: string): Promise<T[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, name), "utf8")) as T[];
  } catch {
    return [];
  }
}
