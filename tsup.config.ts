import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    express: 'src/integrations/express.ts',
    nestjs: 'src/integrations/nestjs.ts',
    nextjs: 'src/integrations/nextjs.ts',
    fastify: 'src/integrations/fastify.ts',
    webhooks: 'src/webhooks/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,              
  splitting: true,            
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['express', '@nestjs/common', '@nestjs/core'],
});