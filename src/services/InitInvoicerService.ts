import BaseService from './BaseService.ts';

export default class InitInvoicerService extends BaseService<void> {
  async execute() {
    const { defaultBusiness, defaultCustomer, defaultInvoiceAuthor, ncfs} = this.config;

    if (await this.businessStore.findById(defaultBusiness.id) !== null) {
      console.log(
        'Default business information is already stored in the database. Skipping creation...',
      );
    } else {
      console.log('Creating default business...');
      this.businessStore.create(defaultBusiness);
    }

    if (await this.customerStore.findById(defaultCustomer.id) !== null) {
      console.log(
        'Default customer information is already stored in the database. Skipping creation...',
      );
    } else {
      console.log('Creating default customer...');
      this.customerStore.create(defaultCustomer);
    }

    if ((await this.invoiceAuthorStore.all()).length > 0) {
      console.log('Default invoice author is already stored in the database. Skipping creation...');
    } else {
      console.log('Creating default invoice author...');
      this.invoiceAuthorStore.create(defaultInvoiceAuthor);
    }

    ncfs.forEach(async ({ type, code, used }) => {
      if (await this.ncfStore.findById(code) !== null) {
        console.log(`NCF with type ${type} and code ${code} is already registered. Skipping...`);
      } else {
        console.log(`Creating NCF with type ${type} and code ${code}.`)
        this.ncfStore.create({ code, type, used });
      }
    });
  }
}
