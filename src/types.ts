export type CustomerID = string;
export interface Customer {
  id: CustomerID;
  name: string;
  address: string;
  emailAddress: string;
  phoneNumber: string;
}

export type BusinessID = string;
export interface Business {
  id: BusinessID;
  name: string;
  phoneNumber: string;
  address: string;
  municipality: string;
  province: string;
  emailAddress: string;
  website: string;
  taxRegime: 'RST';
}

export type PaymentDeadline = 15 | 30 | 60;

export type NCFType = 'B02';

export type NCFCode = number;

export interface NCF {
  type: NCFType;
  code: NCFCode;
  used: boolean;
}

export type InvoiceAuthorID = number;

export interface InvoiceAuthor {
  id: InvoiceAuthorID;
  name: string;
  signature: string;
}

export interface InvoiceEntry {
  productOrService: string;
  price: number;
  discount: number;
  quantity: number;
  tax: number | 'E';
}

export interface Invoice {
  ncf: NCF;
  customer: Customer;
  business: Business;
  creationDate: Date;
  paymentDeadline: PaymentDeadline;
  entries: InvoiceEntry[];
  author: InvoiceAuthor;
  dopExchangeRate: number;
  footnotes?: string;
  termsAndConditions?: string;
  notes?: string;
}

export interface Store<ID, Model> {
  all(): Model[];
  findById(id: ID): Model | null;
  create(model: Model): number;
  update(model: Model): number;
}

export interface Service<T, V = void> {
  execute(params: T): V;
}

export interface Config {
  databasePath?: string;
  defaultCustomer: Customer;
  defaultBusiness: Business;
  defaultInvoiceAuthor: InvoiceAuthor;
  ncfs: NCF[];
}
