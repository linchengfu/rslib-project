import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    // {
    //   format: 'esm',
    //   syntax: ['node 18'],
    //   dts: true,
    // },
    // {
    //   format: 'cjs',
    //   syntax: ['node 18'],
    // },
    {
      format: 'esm',
      syntax: ['esnext'],
      output: { target: 'web' },
      plugins: [
        pluginReact({
          swcReactOptions: {
            runtime: 'classic',
          },
        }),
      ],
    },
  ],
});
