export function formatCurrency(value: number, currency?: string): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: typeof currency === 'string' ? currency : 'USD',
  }).format(value);
}
