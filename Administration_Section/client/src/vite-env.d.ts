/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly APP_API_URL: string;
    // add other environment variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  