import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer' // 构建分析工具
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression' // Gzip压缩
import viteImagemin from 'vite-plugin-imagemin' // 图片压缩

export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      '/api': {
        target: 'http://49.232.248.93:3030/',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass', // 按需加载样式
          directives: true, // 按需加载指令
        }),
      ],
    }),
    // Gzip/Brotli 压缩
    viteCompression({
      verbose: true, // 显示压缩日志
      disable: false,
      threshold: 10240, // 大于10KB的文件才压缩
      algorithm: 'gzip', // 可选 'brotliCompress'
      ext: '.gz',
    }),
    // 构建产物分析 (打包后会生成 stats.html)
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      optipng: { optimizationLevel: 5 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: {
        plugins: [{ removeViewBox: false }],
      },
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  build: {
    // 构建优化核心配置
    target: 'esnext',
    minify: 'terser', // 默认 esbuild，切换为 terser 以支持更多优化
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // 生产环境移除 console
        drop_debugger: true, // 移除 debugger
      },
    },
    rollupOptions: {
      output: {
        // 代码分割策略
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 将大依赖包单独拆分
            if (id.includes('element-plus')) {
              return 'element'
            }
            if (id.includes('lodash')) {
              return 'lodash'
            }
            return 'vendor'
          }
        },
        // 按入口分块
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
}))
