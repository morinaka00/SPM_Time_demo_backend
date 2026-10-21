# SPM Time Backend Demo (หลังบ้าน) — Vite + React SPA (static build เสิร์ฟด้วย nginx)
#
# ต่างจาก MIS/Portal ที่เป็น Next.js standalone (node server.js) — ตัวนี้ build เป็นไฟล์นิ่ง
# แล้วให้ nginx เสิร์ฟ ไม่มี node ใน image สุดท้าย จึงเล็กกว่ามาก
#
# หมายเหตุที่ห้ามแก้โดยไม่รู้ผล:
#   - ห้ามใช้ `npm ci --omit=dev` — vite, @vitejs/plugin-react, @rolldown/plugin-babel
#     และ babel-plugin-react-compiler อยู่ใน devDependencies ทั้งหมด ตัดออกแล้ว build ล้มทันที
#   - nginx.conf ต้องมี `try_files ... /index.html` เพราะ App.jsx ใช้ BrowserRouter
#     ถ้าไม่มี กด refresh ที่ /settings/HolidayPage หรือแชร์ลิงก์ตรงจะได้ 404 จาก nginx

# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- runner ----------
FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
