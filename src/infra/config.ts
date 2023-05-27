import { resolve } from "path";
import { Config } from "../types.ts";
import readAsJSON from "./readAsJSON.ts";

const resolveToBaseDir = (
  configFile: Record<string, string>,
  property: string
) => resolve(configFile.baseDir, configFile[property]);

export async function readConfig({
  configPath,
}: {
  configPath: string;
}): Promise<Config> {
  const configFile = await readAsJSON(configPath);

  return {
    databasePath: resolveToBaseDir(configFile, "databasePath"),
    defaultCustomer: await readAsJSON(
      resolveToBaseDir(configFile, "defaultCustomer")
    ),
    defaultBusiness: await readAsJSON(
      resolveToBaseDir(configFile, "defaultBusiness")
    ),
    defaultInvoiceAuthor: await readAsJSON(
      resolveToBaseDir(configFile, "defaultInvoiceAuthor")
    ),
    ncfs: await readAsJSON(resolveToBaseDir(configFile, "ncf")),
    printDest: configFile.printDest,
    defaultInvoiceEntryFile: configFile.defaultInvoiceEntryFile,
  };
}
