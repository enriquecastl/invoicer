export function calculateExpirationDate(creationDate: Date, paymentDeadline: number): Date {
  const expirationDate = new Date(creationDate.getTime());

  expirationDate.setDate(expirationDate.getDate() + paymentDeadline);

  return expirationDate;
}
