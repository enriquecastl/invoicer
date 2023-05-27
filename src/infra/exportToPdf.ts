export async function exportToPdf(
  pdfFilePath: string,
  htmlFilePath: string
): Promise<boolean> {
  const chromeExecutable = Deno.env.get("CHROME_PATH");
  const command = new Deno.Command("chromium", {
    args: [
      "--headless",
      "--disable-gpu",
      `--print-to-pdf=${pdfFilePath}`,
      htmlFilePath,
    ],
  });
  if (!chromeExecutable) {
    throw new Error("CHROME_PATH environment variable not set");
  }

  const output = await command.output();

  return output.code >= 0;
}
