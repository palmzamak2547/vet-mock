// A node load hook for tests that need the community on: online/config.js reads the build's env
// from import.meta.env, which node does not have, so here it reads the env the test registered
// this hook with, before anything imports config.js:
//   register('../support/mode-hooks.mjs', { parentURL: import.meta.url, data: { env: { DEV: true } } });
let env = {};

export function initialize(data) {
  env = data?.env || {};
}

export async function load(url, context, next) {
  const loaded = await next(url, context);
  if (!url.endsWith('/src/online/config.js')) return loaded;
  const source = Buffer.from(loaded.source).toString('utf8').replace(/^const env = .*$/m, `const env = ${JSON.stringify(env)};`);
  return { ...loaded, source };
}
