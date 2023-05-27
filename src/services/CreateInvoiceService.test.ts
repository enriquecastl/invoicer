import { DB } from "sqlite";
import { beforeEach, describe, it } from "testing/bdd.ts";
import { assertEquals } from "testing/asserts.ts";
import InitInvoicerService from "./InitInvoicerService.ts";
import CreateInvoiceService, { InvoiceData } from "./CreateInvoiceService.ts";
import { createDB } from "../infra/index.ts";
import { business, customer, invoiceAuthor, ncf } from "../test_constants.ts";
import { Invoice, NCF } from "../types.ts";
import { nextTick } from "../test_utils.ts";

describe("CreateInvoiceService", () => {
  const unusedNCF: NCF = {
    code: ncf.code + 1,
    used: false,
    type: "B02",
  };
  const invoiceData: InvoiceData = {
    creationDate: "01-01-2022",
    paymentDeadline: 15,
    dopExchangeRate: 10,
    entries: [
      {
        productOrService: "Servicios de desarrollo de Software",
        price: 8366.66,
        quantity: 1,
        discount: 0,
        tax: 0,
      },
    ],
  };
  let testDB: DB;
  let sut: CreateInvoiceService;
  let createdInvoice: Invoice;

  beforeEach(async () => {
    testDB = await createDB();

    const config = {
      defaultCustomer: customer,
      defaultBusiness: business,
      defaultInvoiceAuthor: invoiceAuthor,
      ncfs: [ncf, unusedNCF],
    };
    // Load default objects in the database;
    new InitInvoicerService(testDB, config).execute();

    await nextTick();

    sut = new CreateInvoiceService(testDB, config);

    sut.execute(invoiceData);

    await nextTick();

    createdInvoice = sut.invoiceStore.all()[0];
  });

  it("assigns default customer to the invoice", () => {
    assertEquals(createdInvoice.customer, customer);
  });

  it("assigns default business to the invoice", () => {
    assertEquals(createdInvoice.business, business);
  });

  it("assigns default invoice author to the invoice", () => {
    assertEquals(createdInvoice.author, invoiceAuthor);
  });

  it("assigns the first unused NCF to the invoice", () => {
    assertEquals(createdInvoice.ncf, { ...unusedNCF, used: true });
  });

  it("assigns the creation date to the invoice", () => {
    assertEquals(
      createdInvoice.creationDate,
      new Date(invoiceData.creationDate)
    );
  });

  it("assigns the payment deadline to the invoice", () => {
    assertEquals(createdInvoice.paymentDeadline, invoiceData.paymentDeadline);
  });

  it("assigns the entries to the invoice", () => {
    assertEquals(
      createdInvoice.entries,
      invoiceData.entries.map((entry) => ({
        ...entry,
      }))
    );
  });

  it("sets unused ncf as used", () => {
    assertEquals(sut.ncfStore.findById(unusedNCF.code)?.used, true);
  });
});
