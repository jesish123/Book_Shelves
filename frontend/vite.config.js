import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // 1. import tailwindcss plugin
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
// 1. React Compiler
import babel from '@rolldown/plugin-babel'; // 2. Babel Plugin
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. tailwindcss plugin
    babel({ //3. Configuring React Compiler
      presets: [reactCompilerPreset()]
    }),
  ],
})