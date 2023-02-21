import { calculateInvoiceTotal } from "../computations/calculateInvoiceTotal.ts";
import { Invoice } from "../types.ts";
import { formatCurrency } from "./formatCurrency.ts";

export function displayInvoiceTotalDop(invoice: Invoice) {
  return formatCurrency(calculateInvoiceTotal(invoice) * invoice.dopExchangeRate, 'DOP');
}
