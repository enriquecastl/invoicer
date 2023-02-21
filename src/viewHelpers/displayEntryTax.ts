import { formatCurrency } from './formatCurrency.ts';

export function displayEntryTax(tax: number | 'E'): string {
  return tax === 'E' ? tax : formatCurrency(tax);
}
