import { bindings, defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "phasenull-dev-backend",
		compatibilityDate: "2025-07-29",
		entrypoint: "src/index.ts",
		observability: {
			enabled: true,
		},
		env: {
			DB: bindings.d1({
				name: "phasenull-dev",
				id: "7f8a333a-1ede-4e05-8842-acb7a4d9cf64",
			}),
			// wrangler dev used a separate preview namespace (a875d02fc5424d28bf5c8b61bc3c7959);
			// `cf dev` simulates KV locally instead, so only the production namespace is configured
			KV: bindings.kv({
				id: "1333d97cc52a40b0ac0bb4141dca6669",
			}),
			R2: bindings.r2({
				name: "phasenull-dev",
			}),
			RATE_LIMITER: bindings.rateLimit({
				namespace: "1001",
				simple: {
					limit: 100,
					period: 60,
				},
			}),
		},
	},
});
