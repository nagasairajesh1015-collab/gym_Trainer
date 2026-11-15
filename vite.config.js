import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base './' lets the built files load from inside the Capacitor app
export default defineConfig({ base: './', plugins: [react()] });
