import { InvoiceEntry } from '../types.ts';

export function calculateEntrySubtotal(entry: InvoiceEntry): number {
  return (
    entry.quantity * entry.price * (1 - entry.discount) +
    (typeof entry.tax === 'number' ? entry.tax : 0)
  );
}
