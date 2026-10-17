// Loaded with --import before the tests run: registers tests/alias-hooks.mjs.
import { register } from 'node:module';

register('./alias-hooks.mjs', import.meta.url);
