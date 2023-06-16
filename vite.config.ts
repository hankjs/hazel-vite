import { defineConfig } from "vite";
import { resolve } from "path";

function _resolve(dir: string) {
    return resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": _resolve("src"),
            "@Hazel": _resolve("packages/Hazel/src"),
            "@Sandbox": _resolve("packages/Sandbox/src"),
        },
    },
    server: {
        port: 33212,
    },
});
