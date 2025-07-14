import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['esnext'],
      dts: true,
      plugins: [
        pluginReact({
          swcReactOptions: {
            runtime: 'classic',
          },
        }),
      ],
    },
    {
      format: 'cjs',
      syntax: ['node 18'],
    },
  ],
});
