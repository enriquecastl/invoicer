# Invoicer

An ultra simple invoice generator and reporter written in Deno.
It’s optimized for the Dominican Republic tax system, and I’ve written
it for personal use without a lot of ambition other than
learning Deno and having a free invoicing system.

## Design philosophy

These are the main motivations behind the design decisions in the invoicer application:

### Simplicity

The invoicer is a command-line application with a minimal user interface. It makes many assumptions about
the user (myself) based on my personal needs, for example: It’s super easy to set up a one-person business
with a single customer. These assumptions allow me to focus on building a tool quickly using
a technology that I don’t have experience with.

### No cloud (kind of)

I want to completely eliminate the need for deployments. The invoicer runs in my personal computer. Data
is stored in sqlite database. I store the database in my personal cloud drive (hence the "kind of" part).

## How to use

Follow these steps to set up the invoicer in your personal computer.

### Create configuration files

Use the templates located in the `templates` directory as the starting point
to create the configuration files. The configuration files allow to create
default objects used to create invoices.

### Commands

All invoicer commands require a `config` parameter that points to the `config.json`
file. The alternative is setting a `INVOICER_CONFIG` environment variable
pointing to the same file.

#### Initialize database

Use the `deno task init` to initialize the invoicer database.

#### Creating an invoice

Use the `deno task create` command to create a new invoice. The invoicer
will assign the next unused NCF to the invoice.

Provide an `invoice_entry` file to the command using the `--invoiceData`
parameter. Use the `invoice_entry.json` template as a reference to
create an `invoice_entry` file.

#### Printing an invoice

Use the `deno task print` command to print an invoice. Invoices are identified
by their NCF and you should specify where the invoice PDF should be saved.

`deno task print --ncf 26 --dest="invoice.pdf"`
