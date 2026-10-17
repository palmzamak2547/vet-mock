// Node resolve hook for the tests: "@vetmock/..." is the main app's src/, as vite.config.js
// aliases it for the build.
export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@vetmock/')) {
    return next(new URL(`../../src/${specifier.slice('@vetmock/'.length)}`, import.meta.url).href, context);
  }
  return next(specifier, context);
}
