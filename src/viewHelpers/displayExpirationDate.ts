import type { Invoice } from '../types.ts';
import { calculateExpirationDate } from '../computations/index.ts';
import { formatDate } from './formatDate.ts';

export function displayExpirationDate(invoice: Invoice): string {
  return formatDate(calculateExpirationDate(invoice.creationDate, invoice.paymentDeadline));
}
