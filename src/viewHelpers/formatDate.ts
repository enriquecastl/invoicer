import { format } from "std/datetime/mod.ts";
import { DATE_FORMAT } from "../constants.ts";

export function formatDate(date: Date): string {
  return format(date, DATE_FORMAT);
}
