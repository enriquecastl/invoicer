import { calculateInvoiceTotal } from "../computations/calculateInvoiceTotal.ts";
import { Invoice } from "../types.ts";
import { formatCurrency } from "./formatCurrency.ts";

export function displayInvoiceTotal(invoice: Invoice): string {
  return formatCurrency(calculateInvoiceTotal(invoice));
}
