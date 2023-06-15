import { defineConfig } from "vite";
import path from "path";

function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": _resolve("src"),
        },
    },
    server: {
        port: 33212,
    },
});
