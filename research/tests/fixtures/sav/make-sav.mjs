// Runs make-sav.R in webR 0.6.0 (R 4.6.0) and copies the written files to the output folder.
//   node make-sav.mjs <webr-runner dir> <make-sav.R> <output dir>     (see README.md). OWNER: data role.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [runnerDir, script, outDir] = process.argv.slice(2).map((p) => path.resolve(p));
const { WebR } = await import(pathToFileURL(path.join(runnerDir, 'node_modules', 'webr', 'dist', 'webr.mjs')).href);
process.chdir(runnerDir);
const webR = new WebR({ baseUrl: './node_modules/webr/dist/', interactive: false });
await webR.init();
await webR.installPackages(['haven'], { repos: ['https://repo.r-wasm.org'], quiet: true });
await webR.FS.mkdir('/home/web_user/out');
await webR.evalRVoid('Sys.setenv(RS_OUT = "/home/web_user/out")');
const sh = await new webR.Shelter();
const r = await sh.captureR(readFileSync(script, 'utf8'), { withAutoprint: true, captureStreams: true, captureConditions: false });
for (const o of r.output) console.log(o.data);
mkdirSync(outDir, { recursive: true });
for (const f of ['cows-none.sav', 'cows-byte.sav', 'cows-zsav.zsav']) {
  const bytes = await webR.FS.readFile(`/home/web_user/out/${f}`);
  writeFileSync(path.join(outDir, f), bytes);
  console.log('wrote', f, bytes.length);
}
console.log(await webR.evalRString('R.version.string'));
webR.close();
