import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  // --- Add the following sections ---
  build: {
    // Set the target environment to support modern JavaScript features like BigInt
    target: 'esnext'
  },
  optimizeDeps: {
    esbuildOptions: {
       // Also ensure esbuild optimizer uses the same target
       target: 'esnext',
       // You might uncomment the line below if you face issues with
       // CommonJS dependencies using BigInt during development
       // supported: { bigint: true },
    }
  }
  // --- End of added sections ---
})