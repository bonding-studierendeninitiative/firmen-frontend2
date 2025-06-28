import { config } from 'dotenv'
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from "@tailwindcss/vite";
import { quickpickle } from "quickpickle";
import { svelteTesting } from "@testing-library/svelte/vite";
//#1
config()

export default defineConfig({
    plugins: [
        quickpickle(),
        tailwindcss(),
        sveltekit(),
        svelteTesting()
    ],
    test: {
        environment: "happy-dom",
        include: [
            'tests/features/*.feature', // <-- Add Gherkin feature files into "test" configuration
            // (you'll probably want other test files too, for unit tests etc.)
        ],
        setupFiles: ['dotenv/config', "./vitest.setup.ts", './tests/steps/smoke.steps.ts'] // <-- specify each setupfile here
    }
});