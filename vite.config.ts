import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			debug: true,
			sourceMapsUploadOptions: {
				org: 'bonding-studierendeninitiat-u9',
				project: 'javascript-sveltekit',
				authToken: process.env.SENTRY_AUTH_TOKEN,
				sourcemaps: {
					assets: ['./build/*/**/*'],
					ignore: ['**/build/client/**/*'],
					filesToDeleteAfterUpload: ['./build/**/*.map']
				}
			}
		}),
		sveltekit(),
		visualizer({
			emitFile: true,
			filename: 'stats.html'
		})
	],
	build: {
		sourcemap: true
	},
	optimizeDeps: { exclude: ['fsevents'] }
});
