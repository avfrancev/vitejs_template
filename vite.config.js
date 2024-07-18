import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import arraybuffer from "vite-plugin-arraybuffer"
import { viteSingleFile } from "vite-plugin-singlefile"
import { compression, tarball } from 'vite-plugin-compression2'

const assetsDir = 'assets/';

const outputDefaults = {
  // remove hashes from filenames
  entryFileNames: `${assetsDir}[name].js`,
  chunkFileNames: `${assetsDir}[name].js`,
  assetFileNames: `${assetsDir}[name].[ext]`,
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
    //sourcemap: true,
    rollupOptions: {
      output: {
        ...outputDefaults,
      }
    },
  },
  plugins: [
    arraybuffer(),
    compression(),
    // tarball(),
    vue(),
    viteSingleFile({
      // useRecommendedBuildConfig: false,
      // removeViteModuleLoader: true,
    }),
    Components({
      extensions: ['vue', 'md', 'js'],
      include: [/\.vue$/, /\.vue\?vue/, /\.js$/],
      resolvers: [
        IconsResolver({
          customCollections: ['custom', 'inline'],
        }),
      ]
    }),
    Pages(),    
    AutoImport({ 
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
    
      // global imports to register
      imports: [
        'vue',
        '@vueuse/core',
      ],
      dts: true,
      resolvers: [
        ElementPlusResolver(),
      ],
      vueTemplate: true,
     }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
  ],
})
