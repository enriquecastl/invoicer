import { TaxRegimes } from '../constants.ts';
import type { Business } from '../types.ts';

export function displayBusinessTaxRegime(business: Business): string {
  return TaxRegimes[business.taxRegime].description;
}
