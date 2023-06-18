/// <reference types="vite/client"/>

interface ImportMetaEnv {
    VITE_PLATFORM: "Web";
    VITE_GL_RENDER: "WebGL2";
}

interface ImportMeta {
    env: ImportMetaEnv
}
