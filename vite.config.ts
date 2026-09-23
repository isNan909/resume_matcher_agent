import { flue } from '@flue/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		flue({
			providers: ['openrouter'],
		}),
	],
	server: {
		port: Number(process.env.PORT) || 3000,
	},
});
