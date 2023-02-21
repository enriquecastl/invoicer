import { parse } from 'std/flags/mod.ts';
import { createDB, readConfig } from '../infra/index.ts';
import { ensureDir, ensureFile } from 'std/fs/mod.ts';
import { resolve } from 'std/path/mod.ts';
import PrintInvoiceService from '../services/PrintInvoiceService.ts';
import { exportToPdf } from '../infra/exportToPdf.ts';

const flags = parse(Deno.args, {
  string: ['config', 'ncf', 'dest'],
});
const configPath = flags.config || Deno.env.get('INVOICER_CONFIG');
const dest = flags.dest;
const ncf = flags.ncf ? parseInt(flags.ncf, 10) : NaN;

if (!configPath) {
  console.error('Please, provide a config file using the config flag');
  Deno.exit(1);
}

if (!ncf) {
  console.error('Please, provide a valid NCF');
  Deno.exit(1);
}

if (!dest) {
  console.log('Please, provide a destination path where to save the invoice document');
  Deno.exit(1);
}

const config = await readConfig({ configPath });
const db = await createDB({ databasePath: config.databasePath });

try {
  const { invoiceDocument, ncfFormatted } = await new PrintInvoiceService(db, config).execute(ncf);


  const fullPathHtml = resolve(dest, `invoice-tmp-${ncfFormatted}.html`);
  const fullPathPdf = resolve(dest, `invoice-${ncfFormatted}.pdf`);

  console.log(`Saving invoice document with NCF ${ncfFormatted} in path ${fullPathPdf}`);

  await ensureDir(dest);
  await ensureFile(fullPathPdf);

  await Deno.writeTextFile(fullPathHtml, invoiceDocument);

  const success = await exportToPdf(fullPathPdf, fullPathHtml);

  await Deno.remove(fullPathHtml);

  if(success) {
    console.log('Invoice saved successfully!');
  } else {
    console.error('Could not print invoice');
  }
} catch (e) {
  console.error(e.message);
  Deno.exit(1);
}
