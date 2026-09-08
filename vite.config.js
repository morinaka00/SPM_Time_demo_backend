import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    port: 3000, // เปลี่ยนเป็น Port ที่ต้องการ เช่น 3000, 8080 ฯลฯ
    open: true  // (ตัวเลือกเสริม) ให้เปิดเบราว์เซอร์ให้อัตโนมัติเมื่อรัน
  }
})
