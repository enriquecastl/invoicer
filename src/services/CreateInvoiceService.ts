import { Invoice, PaymentDeadline } from "../types.ts";
import BaseService from "./BaseService.ts";

export interface InvoiceData {
  creationDate: string;
  paymentDeadline: number;
  dopExchangeRate: number;
  entries: {
    productOrService: string;
    price: number;
    quantity: number;
    discount: number;
    tax: number;
  }[];
}

export default class CreateInvoiceService extends BaseService<InvoiceData, Invoice> {
  execute(data: InvoiceData): Invoice {
    const customer = this.customerStore.findById(this.config.defaultCustomer.id);
    const business = this.businessStore.findById(this.config.defaultBusiness.id);
    const author = this.invoiceAuthorStore.findById(this.config.defaultInvoiceAuthor.id);
    const ncf = this.ncfStore.all().find(ncf => !ncf.used);

    if(!customer) {
      throw new Error('Could not find default customer in the database');
    }

    if(!business) {
      throw new Error('Could not find default business in the database');
    }

    if(!author) {
      throw new Error('Could not find default invoice author in the database')
    }

    if(!ncf) {
      throw new Error('Could not find an unused NCF to use for this invoice');
    }

    const invoice: Invoice = {
      ncf,
      customer,
      business,
      author,
      creationDate: new Date(data.creationDate),
      dopExchangeRate: data.dopExchangeRate,
      entries: data.entries.map((entry) => ({
        id: ncf.code,
        ...entry
      })),
      paymentDeadline: data.paymentDeadline as PaymentDeadline,
    };

    ncf.used = true;

    if(this.invoiceStore.create(invoice) <= 0) {
      throw new Error('Invoice could not be created');
    }

    if(this.ncfStore.update(ncf) <= 0) {
      throw new Error('Could not update ncf usage status');
    }

    return invoice;
  }
}
