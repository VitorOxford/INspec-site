// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // ======================================================
  // CORREÇÃO DEFINITIVA:
  // Trocamos 'exclude' (que falhou) por 'include'.
  // Isso FORÇA o Vite a pré-compilar 'recharts' e sua
  // dependência 'es-toolkit', resolvendo o erro.
  // ======================================================
  optimizeDeps: {
    include: ['recharts', 'es-toolkit']
  },
});