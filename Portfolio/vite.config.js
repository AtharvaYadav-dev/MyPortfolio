import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Local dev server middleware for /api/chat
 * Seamlessly executes the Vercel serverless function during `npm run dev`
 */
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method === 'POST') {
          try {
            let bodyStr = '';
            for await (const chunk of req) {
              bodyStr += chunk;
            }
            req.body = bodyStr ? JSON.parse(bodyStr) : {};

            const { default: handler } = await import('./api/chat.js');

            const resAdapter = {
              setHeader(key, val) {
                res.setHeader(key, val);
                return this;
              },
              status(code) {
                res.statusCode = code;
                return this;
              },
              json(data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end() {
                res.end();
              }
            };

            await handler(req, resAdapter);
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        } else if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vercelApiDevPlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'three-vendor';
            }
            if (id.includes('gsap') || id.includes('framer-motion') || id.includes('lenis')) {
              return 'motion-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
          }
        },
      },
    },
  },
});
