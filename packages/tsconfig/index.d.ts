/// <reference types="vite/client"/>

interface ImportMetaEnv {
    VITE_PLATFORM: "Web";
    VITE_RENDERER: "WebGL2" | "WebGL" | "WebGPU";
}

interface ImportMeta {
    env: ImportMetaEnv
}
