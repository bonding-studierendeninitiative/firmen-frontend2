import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'bonding-studierendeninitiat-u9',
				project: 'javascript-sveltekit'
			}
		}),
		sveltekit()
	],
	build: {
		sourcemap: true
	}
});
