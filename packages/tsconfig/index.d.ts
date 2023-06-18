/// <reference types="vite/client"/>

interface ImportMetaEnv {
    VITE_PLATFORM: "Web";
    VITE_RENDERER: "WebGL2";
}

interface ImportMeta {
    env: ImportMetaEnv
}
