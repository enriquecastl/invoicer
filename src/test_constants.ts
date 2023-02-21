import { Business, Customer, Invoice, InvoiceAuthor, InvoiceEntry, NCF } from './types.ts';

export const business: Business = {
  name: 'Business',
  id: 'business-id',
  address: 'Address',
  phoneNumber: '999.999.9999',
  emailAddress: 'email@business.com',
  website: 'business.info',
  province: 'Province',
  municipality: 'Municipality',
  taxRegime: 'RST',
};

export const customer: Customer = {
  id: 'customer-id',
  name: 'Customer Name',
  address: 'Customer Address',
  emailAddress: 'manager@customer.com',
  phoneNumber: '9999999999',
};

export const ncf: NCF = {
  type: 'B02',
  code: 2,
  used: true,
};

export const invoiceAuthor: InvoiceAuthor = {
  id: 1,
  name: 'Author Name',
  signature: 'authorSignature.png',
};

export const invoiceEntry: InvoiceEntry = {
  productOrService: 'Servicios de desarrollo de Software',
  price: 200,
  discount: 0,
  quantity: 1,
  tax: 0,
};

export const invoice: Invoice = {
  ncf,
  business,
  customer,
  creationDate: new Date(),
  paymentDeadline: 15,
  entries: [
    invoiceEntry,
  ],
  dopExchangeRate: 50,
  author: invoiceAuthor,
  notes: 'notes',
  footnotes: 'footnotes',
  termsAndConditions: 'terms & conditions',
};
