import * as fs from "fs";
import { Extractor } from "@poppinss/module-methods-extractor";
import { ExtractorOutput } from "@poppinss/module-methods-extractor/build/src/contracts";

/**
 * Location of a method in a source file.
 */
export type Location = {
  lineno: number;
  name: string;
  // column: number;
};

/**
 * Get the line number a method is declared in a source file.
 *
 * @param methodName Method name to locate
 * @param sourcePath Source file to extract from
 */
export async function getLineNumber(
  sourcePath: string,
  methodName: string
): Promise<Location> {
  const notFound: Location = { lineno: -1, name: methodName };
  const methods = extractMethodsInSourceFile(sourcePath);
  if (!methods) return notFound;

  const method = methods.methods.find(
    method => method.name === methodName.trim()
  );

  return method || notFound;
}

/**
 * Get all method names in a JS/TS source file.
 *
 * @param sourcePath File path of the source file
 */
export function getMethodsInSourceFile(sourcePath: string): string[] {
  try {
    const output = extractMethodsInSourceFile(sourcePath);
    if (!output) return [];

    return output.methods.map(method => method.name);
  } catch (err) {
    return [];
  }
}

/**
 * Extract all the methods in a  JS/TS souce file. If the source file
 * doesn't exist, a null value is returned.
 *
 * @param sourcePath File path of the source file
 */
function extractMethodsInSourceFile(
  sourcePath: string
): ExtractorOutput | null {
  const source = fs
    .readFileSync(sourcePath.replace(/file:\/\//, ""))
    .toString("ascii");

  const extractor = new Extractor();
  return extractor.extract(source);
}
