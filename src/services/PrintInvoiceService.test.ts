import { createDB } from '../infra/index.ts';
import { business, customer, invoiceAuthor, ncf } from '../test_constants.ts';
import { assertStringIncludes } from 'testing/asserts.ts';
import { beforeEach, describe, it } from 'testing/bdd.ts';
import PrintInvoiceService from './PrintInvoiceService.ts';
import { invoice } from '../test_constants.ts';
import InitInvoicerService from './InitInvoicerService.ts';
import { nextTick } from '../test_utils.ts';
import { InvoiceEntry, NCF } from '../types.ts';
import {
  displayBusinessAddress,
  displayBusinessTaxRegime,
  displayDiscount,
  displayEntrySubtotal,
  displayEntryTax,
  displayExpirationDate,
  displayInvoiceNCFCode,
  displayInvoiceNCFDescription,
  displayInvoiceTotal,
  displayInvoiceTotalDop,
  formatCurrency,
  formatDate,
} from '../viewHelpers/index.ts';

describe('PrintInvoiceService', () => {
  let sut: PrintInvoiceService;
  const unusedNCF: NCF = {
    code: ncf.code + 1,
    used: false,
    type: 'B02',
  };

  beforeEach(async () => {
    const db = await createDB();

    const config = {
      defaultCustomer: customer,
      defaultBusiness: business,
      defaultInvoiceAuthor: invoiceAuthor,
      ncfs: [ncf, unusedNCF],
    };

    new InitInvoicerService(db, config).execute();

    await nextTick();

    sut = new PrintInvoiceService(db, {
      defaultCustomer: customer,
      defaultBusiness: business,
      defaultInvoiceAuthor: invoiceAuthor,
      ncfs: [ncf, unusedNCF],
    });

    sut.invoiceStore.create({
      ...invoice,
      ncf: unusedNCF,
    });

    await nextTick();
  });

  it('includes business information in the invoice document', async () => {
    const { invoiceDocument } = await sut.execute(unusedNCF.code);

    // Business information
    assertStringIncludes(invoiceDocument, invoice.business.id);
    assertStringIncludes(invoiceDocument, invoice.business.name);
    assertStringIncludes(invoiceDocument, displayBusinessAddress(invoice.business));
    assertStringIncludes(invoiceDocument, invoice.business.phoneNumber);
    assertStringIncludes(invoiceDocument, invoice.business.emailAddress);
    assertStringIncludes(invoiceDocument, invoice.business.website);
    assertStringIncludes(invoiceDocument, displayBusinessTaxRegime(invoice.business));

    // Invoice NCF
    assertStringIncludes(invoiceDocument, displayInvoiceNCFCode(unusedNCF));
    assertStringIncludes(invoiceDocument, displayInvoiceNCFDescription(unusedNCF));

    // Invoice Date
    assertStringIncludes(invoiceDocument, formatDate(invoice.creationDate));
    assertStringIncludes(invoiceDocument, displayExpirationDate(invoice));

    // Invoice customer
    assertStringIncludes(invoiceDocument, invoice.customer.name);
    assertStringIncludes(invoiceDocument, invoice.customer.address);
    assertStringIncludes(invoiceDocument, invoice.customer.phoneNumber);
    assertStringIncludes(invoiceDocument, invoice.customer.emailAddress);

    // Invoice entries
    invoice.entries.forEach((entry: InvoiceEntry) => {
      assertStringIncludes(invoiceDocument, entry.productOrService);
      assertStringIncludes(invoiceDocument, formatCurrency(entry.price));
      assertStringIncludes(invoiceDocument, entry.quantity.toString());
      assertStringIncludes(invoiceDocument, displayDiscount(entry.discount));
      assertStringIncludes(invoiceDocument, displayEntryTax(entry.tax));
      assertStringIncludes(invoiceDocument, displayEntrySubtotal(entry));
    });

    // Invoice subtotal and total
    assertStringIncludes(invoiceDocument, displayInvoiceTotal(invoice));
    assertStringIncludes(invoiceDocument, displayInvoiceTotal(invoice));
    assertStringIncludes(invoiceDocument, displayInvoiceTotalDop(invoice));


    // Invoice author
    assertStringIncludes(invoiceDocument, invoice.author.name);
    assertStringIncludes(invoiceDocument, invoice.author.signature);
  });
});
