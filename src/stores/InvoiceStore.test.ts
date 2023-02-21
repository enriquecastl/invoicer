import { DB } from 'sqlite';
import { beforeEach, describe, it } from 'testing/bdd.ts';
import { assertSpyCall, spy } from 'testing/mock.ts';
import { assertEquals } from 'testing/asserts.ts';
import { business, customer, invoice, invoiceAuthor, ncf } from '../test_constants.ts';
import { createDB } from '../infra/database.ts';
import InvoiceStore from './InvoiceStore.ts';
import BusinessStore from './BusinessStore.ts';
import CustomerStore from './CustomerStore.ts';
import NCFStore from './NCFStore.ts';
import InvoiceAuthorStore from './InvoiceAuthorStore.ts';

describe('InvoiceStore', () => {
  let db: DB;
  let store: InvoiceStore;
  let customerStore: CustomerStore;
  let businessStore: BusinessStore;
  let invoiceAuthorStore: InvoiceAuthorStore;
  let ncfStore: NCFStore;

  beforeEach(async () => {
    db = await createDB({});

    customerStore = new CustomerStore(db);
    businessStore = new BusinessStore(db);
    invoiceAuthorStore = new InvoiceAuthorStore(db);
    ncfStore = new NCFStore(db);

    store = new InvoiceStore({
      db,
      customerStore,
      businessStore,
      invoiceAuthorStore,
      ncfStore,
    });
  });

  beforeEach(() => {
    customerStore.create(customer);
    ncfStore.create(ncf);
    invoiceAuthorStore.create(invoiceAuthor);
    businessStore.create(business);
  });

  it('create', () => {
    const querySpy = spy(db, 'query');
    const rowsAffected = store.create(invoice);

    assertSpyCall(querySpy, 0, {
      args: [
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
      ],
    });

    invoice.entries.forEach((entry, index) => {
      assertSpyCall(querySpy, index + 1, {
        args: [
          'INSERT INTO InvoiceEntry (invoice, productOrService, price, discount, quantity, tax) VALUES (:invoice, :productOrService, :price, :discount, :quantity, :tax)',
          {
            invoice: invoice.ncf.code,
            productOrService: entry.productOrService,
            price: entry.price,
            discount: entry.discount,
            quantity: entry.quantity,
            tax: entry.tax,
          },
        ],
      });
    });

    assertEquals(rowsAffected, 1);
  });

  it('all', () => {
    store.create(invoice);

    const queryEntriesSpy = spy(db, 'queryEntries');

    const results = store.all();

    assertSpyCall(queryEntriesSpy, 0, {
      args: [
        'SELECT ncf, customer, business, author, creationDate, paymentDeadline, footnotes, termsAndConditions, notes, dopExchangeRate from Invoice',
      ],
    });
    assertSpyCall(queryEntriesSpy, 1, {
      args: [
        'SELECT productOrService, price, discount, quantity, tax from InvoiceEntry where invoice = :invoice',
        { invoice: invoice.ncf.code },
      ],
    });
    assertEquals(results.length, 1);
    assertEquals(results[0], invoice);
  });

  it('findById', () => {
    store.create(invoice);

    const queryEntriesSpy = spy(db, 'queryEntries');

    const invoiceRetrieved = store.findById(invoice.ncf.code);

    assertSpyCall(queryEntriesSpy, 0, {
      args: [
        'SELECT ncf, customer, business, author, creationDate, paymentDeadline, footnotes, termsAndConditions, notes, dopExchangeRate from Invoice where ncf = :ncf',
        { ncf: invoice.ncf.code },
      ],
    });
    assertSpyCall(queryEntriesSpy, 1, {
      args: [
        'SELECT productOrService, price, discount, quantity, tax from InvoiceEntry where invoice = :invoice',
        { invoice: invoice.ncf.code },
      ],
    });
    assertEquals(invoiceRetrieved, invoice);
  });
});
