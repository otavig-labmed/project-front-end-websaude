import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.7, 0.9], speed: 1 },
      svgo: { 
        plugins: [
          { name: 'removeViewBox' }, 
          { name: 'removeEmptyAttrs', active: false },
          { name: 'removeUselessDefs' },
          { name: 'removeXMLNS' },
          { name: 'removeComments' },
          { name: 'removeMetadata' },
          { name: 'removeEditorsNSData' },
          { name: 'cleanupAttrs' },
          { name: 'mergePaths' },
          { name: 'convertColors' }
        ] 
      },
      webp: { quality: 80 },
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false,
    }),
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      },
      inject: {
        data: {
          title: 'WebSaúde - Sistema de Gestão Médica',
          description: 'Sistema completo de gestão médica e agendamento de consultas',
          keywords: 'saúde, medicina, agendamento, consultas, gestão médica'
        }
      }
    })
  ],
  server: {
    port: 5173, 
    historyApiFallback: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://192.168.15.59:8000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Garantir que os cookies sejam enviados corretamente
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie);
            }
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',
    cssTarget: 'chrome80',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          fontawesome: ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
          fullcalendar: [
            '@fullcalendar/core',
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid'
          ],
          utils: ['axios', 'trim-newlines'],
          virtualization: ['react-window', 'react-virtualized-auto-sizer']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@fortawesome/react-fontawesome',
      'axios'
    ],
    exclude: ['@fullcalendar/core', '@fullcalendar/react']
  },
  css: {
    devSourcemap: false,
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            colormin: true,
            minifyFontValues: true,
            minifySelectors: true
          }]
        })
      ]
    }
  },
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false
  }
});
