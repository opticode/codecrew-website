// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://codecrew.dev',
  integrations: [vue(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
