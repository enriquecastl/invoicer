import { NCFCode } from '../types.ts';
import { renderView } from '../infra/views.ts';
import BaseService from './BaseService.ts';
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

interface PrintInvoiceServiceResult {
  invoiceDocument: string;
  ncfFormatted: string;
}

export default class PrintInvoiceService
  extends BaseService<NCFCode, Promise<PrintInvoiceServiceResult>> {

  async execute(ncf: NCFCode): Promise<PrintInvoiceServiceResult> {
    const invoice = this.invoiceStore.findById(ncf);

    if (!invoice) {
      throw new Error(`Could not find invoice with NCF ${ncf}`);
    }

    const invoiceDocument = await renderView({
      viewName: 'invoice',
      data: {
        invoice,
      },
      helpers: {
        formatDate,
        formatCurrency,
        displayExpirationDate,
        displayBusinessTaxRegime,
        displayBusinessAddress,
        displayInvoiceNCFDescription,
        displayInvoiceNCFCode,
        displayDiscount,
        displayEntryTax,
        displayEntrySubtotal,
        displayInvoiceTotal,
        displayInvoiceTotalDop,
      },
    });

    return {
      invoiceDocument,
      ncfFormatted: displayInvoiceNCFCode(invoice.ncf),
    };
  }
}
