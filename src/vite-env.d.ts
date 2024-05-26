/// <reference types="vite/client" />
interface Window {
    ethereum: any;
}

interface ImportMetaEnv {
    readonly API_URL: string;
    
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }