import { DB } from 'sqlite';
import {
  Business,
  BusinessID,
  Customer,
  CustomerID,
  Invoice,
  InvoiceAuthor,
  InvoiceAuthorID,
  NCF,
  NCFCode,
  PaymentDeadline,
  Store,
} from '../types.ts';

export interface InvoiceStoreParams {
  db: DB;
  customerStore: Store<CustomerID, Customer>;
  businessStore: Store<BusinessID, Business>;
  ncfStore: Store<NCFCode, NCF>;
  invoiceAuthorStore: Store<InvoiceAuthorID, InvoiceAuthor>;
}

type InvoiceData = {
  ncf: number;
  customer: string;
  business: string;
  author: number;
  creationDate: number;
  dopExchangeRate: number;
  paymentDeadline: PaymentDeadline;
  footnotes: string;
  termsAndConditions: string;
  notes: string;
};

type InvoiceEntryData = {
  productOrService: string;
  price: number;
  discount: number;
  quantity: number;
  tax: number | 'E';
};

export default class InvoiceStore implements Store<number, Invoice> {
  readonly #db: DB;
  readonly #customerStore: Store<CustomerID, Customer>;
  readonly #businessStore: Store<BusinessID, Business>;
  readonly #ncfStore: Store<NCFCode, NCF>;
  readonly #invoiceAuthorStore: Store<InvoiceAuthorID, InvoiceAuthor>;

  constructor({
    db,
    invoiceAuthorStore,
    ncfStore,
    customerStore,
    businessStore,
  }: InvoiceStoreParams) {
    this.#db = db;
    this.#customerStore = customerStore;
    this.#businessStore = businessStore;
    this.#ncfStore = ncfStore;
    this.#invoiceAuthorStore = invoiceAuthorStore;
  }

  update(): number {
    throw new Error("Method not implemented.");
  }

  all(): Invoice[] {
    const invoicesData = this.#db.queryEntries<InvoiceData>(
      'SELECT ncf, customer, business, author, creationDate, paymentDeadline, footnotes, termsAndConditions, notes, dopExchangeRate from Invoice',
    );

    return invoicesData.map((invoiceData) => {
      const invoiceEntriesData = this.#db.queryEntries<InvoiceEntryData>(
        'SELECT productOrService, price, discount, quantity, tax from InvoiceEntry where invoice = :invoice',
        { invoice: invoiceData.ncf },
      );

      return this.#mapInvoiceDataToInvoice(invoiceData, invoiceEntriesData);
    });
  }

  findById(ncf: number): Invoice | null {
    const invoicesData = this.#db.queryEntries<InvoiceData>(
      'SELECT ncf, customer, business, author, creationDate, paymentDeadline, footnotes, termsAndConditions, notes, dopExchangeRate from Invoice where ncf = :ncf',
      { ncf },
    );

    if (invoicesData.length === 0) {
      return null;
    }

    const invoiceData = invoicesData[0];
    const invoiceEntriesData = this.#db.queryEntries<InvoiceEntryData>(
      'SELECT productOrService, price, discount, quantity, tax from InvoiceEntry where invoice = :invoice',
      { invoice: invoiceData.ncf },
    );

    return this.#mapInvoiceDataToInvoice(invoiceData, invoiceEntriesData);
  }

  create(invoice: Invoice): number {
    this.#db.query(
      'INSERT INTO Invoice (ncf, customer, business, author, creationDate, paymentDeadline, footnotes, termsAndConditions, notes, dopExchangeRate) VALUES (:ncf, :customer, :business, :author, :creationDate, :paymentDeadline, :footnotes, :termsAndConditions, :notes, :dopExchangeRate)',
      {
        ncf: invoice.ncf.code,
        customer: invoice.customer.id,
        business: invoice.business.id,
        author: invoice.author.id,
        creationDate: invoice.creationDate.getTime(),
        paymentDeadline: invoice.paymentDeadline,
        footnotes: invoice.footnotes,
        termsAndConditions: invoice.termsAndConditions,
        notes: invoice.notes,
        dopExchangeRate: invoice.dopExchangeRate,
      },
    );

    invoice.entries.forEach((entry) => {
      this.#db.query(
        'INSERT INTO InvoiceEntry (invoice, productOrService, price, discount, quantity, tax) VALUES (:invoice, :productOrService, :price, :discount, :quantity, :tax)',
        {
          invoice: invoice.ncf.code,
          productOrService: entry.productOrService,
          price: entry.price,
          discount: entry.discount,
          quantity: entry.quantity,
          tax: entry.tax,
        },
      );
    });

    return this.#db.changes;
  }

  #mapInvoiceDataToInvoice(
    invoiceData: InvoiceData,
    invoiceEntriesData: InvoiceEntryData[],
  ): Invoice {
    const ncf = this.#ncfStore.findById(invoiceData.ncf);
    const customer = this.#customerStore.findById(invoiceData.customer);
    const business = this.#businessStore.findById(invoiceData.business);
    const author = this.#invoiceAuthorStore.findById(invoiceData.author);

    if (!ncf || !customer || !business || !author) {
      throw new Error(`Invoice references non-existent objects
ncf: ${ncf}
customer: ${customer}
business: ${business}
author: ${author}`);
    }

    return {
      ncf,
      customer,
      business,
      author,
      creationDate: new Date(invoiceData.creationDate),
      paymentDeadline: invoiceData.paymentDeadline,
      dopExchangeRate: invoiceData.dopExchangeRate,
      entries: invoiceEntriesData.map((invoiceEntryData) => ({
        productOrService: invoiceEntryData.productOrService,
        price: invoiceEntryData.price,
        quantity: invoiceEntryData.quantity,
        discount: invoiceEntryData.discount,
        tax: invoiceEntryData.tax,
      })),
      footnotes: invoiceData.footnotes,
      notes: invoiceData.notes,
      termsAndConditions: invoiceData.termsAndConditions,
    };
  }
}
