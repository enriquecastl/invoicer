import { DB } from 'sqlite';
import { Config, Service } from '../types.ts';
import {
  BusinessStore,
  CustomerStore,
  InvoiceAuthorStore,
  InvoiceStore,
  NCFStore,
} from '../stores/index.ts';
export default abstract class BaseService<T, V = void> implements Service<T, V> {
  readonly config: Config;
  readonly db: DB;
  readonly businessStore: BusinessStore;
  readonly customerStore: CustomerStore;
  readonly invoiceAuthorStore: InvoiceAuthorStore;
  readonly ncfStore: NCFStore;
  readonly invoiceStore: InvoiceStore;

  constructor(db: DB, config: Config) {
    this.config = config;
    this.db = db;
    this.businessStore = new BusinessStore(this.db);
    this.customerStore = new CustomerStore(this.db);
    this.invoiceAuthorStore = new InvoiceAuthorStore(this.db);
    this.ncfStore = new NCFStore(this.db);
    this.invoiceStore = new InvoiceStore({
      db,
      customerStore: this.customerStore,
      businessStore: this.businessStore,
      invoiceAuthorStore: this.invoiceAuthorStore,
      ncfStore: this.ncfStore,
    });
  }

  abstract execute(params: T): V;
}
