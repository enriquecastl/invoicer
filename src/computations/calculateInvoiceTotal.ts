import { Invoice } from "../types.ts";

export function calculateInvoiceTotal(invoice: Invoice): number {
  return invoice.entries.reduce((total, entry) => {
    return total + entry.quantity * entry.price * (1 - entry.discount) + (typeof entry.tax === 'number' ? entry.tax : 0)
  }, 0);
}
