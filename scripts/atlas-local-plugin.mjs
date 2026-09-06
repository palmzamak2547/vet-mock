// Optional workstation specimens live outside public/ and are never build inputs.
import { existsSync, readFileSync, createReadStream, statSync } from 'node:fs';
import { resolve, basename } from 'node:path';

export function atlasLocalPlugin(root = resolve('scratch/atlas-local')) {
  let files = new Map();
  return {
    name: 'atlas-local-specimens',
    config(_config, { command, isPreview }) {
      const manifest = resolve(root, 'catalog.json');
      const specimens = command === 'serve' && !isPreview && existsSync(manifest)
        ? JSON.parse(readFileSync(manifest, 'utf8')) : [];
      if (!Array.isArray(specimens)) throw new Error('Local Atlas catalog must be an array');
      files = new Map();
      for (const specimen of specimens) {
        for (const url of [specimen.poster, specimen.sourceManifest, ...Object.values(specimen.profiles || {}).map(p => p.model)]) {
          if (!url) continue;
          if (!/^\/atlas\/[a-z0-9-]+\.(glb|webp|json)$/.test(url)) throw new Error('Invalid local Atlas asset path');
          const path = resolve(root, basename(url));
          if (!existsSync(path)) throw new Error(`Missing local Atlas asset: ${basename(url)}`);
          files.set(url, path);
        }
      }
      return { define: { __ATLAS_LOCAL_SPECIMENS__: JSON.stringify(specimens) } };
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const file = files.get((request.url || '').split('?')[0]);
        if (!file) return next();
        if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
        const type = file.endsWith('.glb') ? 'model/gltf-binary' : file.endsWith('.webp') ? 'image/webp' : 'application/json';
        response.setHeader('Content-Type', type);
        response.setHeader('Content-Length', statSync(file).size);
        response.setHeader('Cache-Control', 'no-store');
        if (request.method === 'HEAD') { response.end(); return; }
        createReadStream(file).on('error', () => response.destroy()).pipe(response);
      });
    },
  };
}
