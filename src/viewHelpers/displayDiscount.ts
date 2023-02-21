export function displayDiscount(discount: number) {
  return discount > 0 ? `${discount * 100}%` : '—';
}
