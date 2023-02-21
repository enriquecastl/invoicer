export async function exportToPdf(pdfFilePath: string, htmlFilePath: string): Promise<boolean> {
  const chromeExecutable = Deno.env.get('CHROME_PATH');

  if(!chromeExecutable) {
    throw new Error('CHROME_PATH environment variable not set');
  }

  const process = Deno.run({
    cmd: ['chromium', '--headless', '--disable-gpu', `--print-to-pdf=${pdfFilePath}`, htmlFilePath],
  });

  const status = await process.status();

  return status.success;
}
