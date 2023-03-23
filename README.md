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
