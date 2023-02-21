import type { NCF } from "../types.ts";
import { NCFFormattedCodeLength, NCFTypes } from "../constants.ts";

interface NCFDisplay {
  formatted: string;
  description: string;
}

const padCode = (code: string): string => {
  if(code.length === NCFFormattedCodeLength) {
    return code;
  } else {
    return padCode(`0${code}`);
  }
}

export function displayInvoiceNCFDescription(ncf: NCF): string {
  const type = NCFTypes[ncf.type];

  return type.description;
}

export function displayInvoiceNCFCode(ncf: NCF): string {
  return `${ncf.type}${padCode(ncf.code.toString())}`;
}

