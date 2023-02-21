export default async function readAsJSON(filePath: string) {
  return JSON.parse(await Deno.readTextFile(filePath));
}
