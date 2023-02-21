import { Business } from "../types.ts";

export function displayBusinessAddress(business: Business): string {
  return `${business.address} <br> ${business.municipality}, ${business.province}`;
}
