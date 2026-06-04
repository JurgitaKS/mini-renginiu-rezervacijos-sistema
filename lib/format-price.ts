export function formatPrice(price: number | string): string {
  return Number(price) === 0 ? "Nemokama" : `${Number(price)} €`;
}
