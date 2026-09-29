import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function copyDirSync(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, {recursive: true});
  for (const entry of fs.readdirSync(src, {withFileTypes: true})) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'copy-vanilla-static-assets',
        closeBundle() {
          const distDir = path.resolve(__dirname, 'dist');
          copyDirSync(path.resolve(__dirname, 'js'), path.join(distDir, 'js'));
          copyDirSync(path.resolve(__dirname, 'css'), path.join(distDir, 'css'));
          copyDirSync(path.resolve(__dirname, 'images'), path.join(distDir, 'images'));
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          shop: path.resolve(__dirname, 'shop.html'),
          productDetails: path.resolve(__dirname, 'product-details.html'),
          cart: path.resolve(__dirname, 'cart.html'),
          checkout: path.resolve(__dirname, 'checkout.html'),
          success: path.resolve(__dirname, 'success.html'),
          about: path.resolve(__dirname, 'about.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
