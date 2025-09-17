import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  extract: {
    include: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html}'],
  },
});
