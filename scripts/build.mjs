
import { transform } from '@svgr/core';
import fs from 'fs-extra';
import path from 'path';

const svgDir = path.resolve(process.cwd(), 'src/svgs');
const componentDir = path.resolve(process.cwd(), 'src/components');

async function build() {
  await fs.ensureDir(componentDir);
  const files = await fs.readdir(svgDir);
  for (const file of files) {
    if (path.extname(file) === '.svg') {
      const svgCode = await fs.readFile(path.join(svgDir, file), 'utf-8');
      const componentName = path.basename(file, '.svg');
      const jsCode = await transform(
        svgCode,
        {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
          icon: true,
          typescript: true,
        },
        { componentName },
      );
      const componentPath = path.join(componentDir, `${componentName}.tsx`);
      await fs.writeFile(componentPath, jsCode);
    }
  }

  const filesAfter = await fs.readdir(componentDir);
  const exports = filesAfter
    .filter(file => file.endsWith('.tsx'))
    .map(file => `export {default as ${path.basename(file, '.tsx')}} from './${path.basename(file, '.tsx')}';`)
    .join('\n');
  await fs.writeFile(path.join(componentDir, 'index.ts'), exports);
}

build();
