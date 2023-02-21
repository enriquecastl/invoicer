import { formatCurrency } from './formatCurrency.ts';
import { calculateEntrySubtotal } from '../computations/index.ts';
import { InvoiceEntry } from '../types.ts';

export function displayEntrySubtotal(entry: InvoiceEntry): string {
  return formatCurrency(calculateEntrySubtotal(entry));
}
