# History Log — ปรับปรุง UI ระบบลงเวลาปฏิบัติราชการ

- **วันที่:** 16 ตุลาคม 2569 (2026-10-16)
- **ฐานโค้ด:** ต่อจาก commit `bbc03d3 Edit Demo Data` บน branch `main`
- **สถานะ:** ยังไม่ได้ commit — การเปลี่ยนแปลงทั้งหมดอยู่ใน working tree
- **อ้างอิง:** [Design.md](Design.md) (ธีม "กรมเข้ม ริบบิ้นทอง") และต้นแบบ artifact `G7Q4UNYJpSn3DbqwhCj88h` (หน้า Login SSO และ `portal.html`)

## สรุปภาพรวม

| # | งาน | ผลลัพธ์ |
|---|---|---|
| 1 | ปรับธีมสี พื้นหลัง และ Typography ทั้งโปรเจกต์ | ใช้ token ตาม Design.md ทุกหน้า ไม่มีสี default ของ antd เหลือ |
| 2 | เพิ่ม component `BrandHeader` จาก artifact | Header แสดงตรา + ชื่อหน่วยงานไทย/อังกฤษ |
| 3 | ปรับ Header ตามต้นแบบ portal | เอาชื่อระบบออก, เพิ่มปุ่มโหมดมืด, กระดิ่งแจ้งเตือน, dropdown ผู้ใช้ |
| 4 | ลดเมนูที่ไม่ใช้ | เอากลุ่ม "ผู้ดูแลระบบ" ออกจาก dropdown และปุ่มย่อเมนูท้าย Sider ออก |
| 5 | เพิ่มหน้าต่างโปรไฟล์ 3 แท็บจาก artifact | ข้อมูลส่วนตัว / รหัสผ่านและความปลอดภัย / การแจ้งเตือน |
| 6 | WorkCycleDetailPage | ย้ายรหัสเวลาการทำงานไปไว้ในกล่องของเจ้าหน้าที่แต่ละท่าน |
| 7 | แก้ error | ESLint 54 → 0 และไม่มี error/warning ใน console |

ผลการตรวจหลังแก้ครบทุกข้อ:

- `npx eslint .` ผ่าน 0 problems
- `npx vite build` ผ่าน
- เปิดครบทั้ง 23 route แล้ว ไม่มี runtime error หรือ warning ใน console
- ตรวจหน้าตาด้วยตาทั้งโหมดสว่าง/มืดและจอมือถือ เฉพาะบางหน้า (Dashboard, ลงเวลา, ปฏิทิน, OTPage, รายงานปฏิทิน, WorkCycleDetail) ไม่ได้ดูครบทุกหน้า

---

## 1. ปรับธีม สี พื้นหลัง และ Typography

### Global

- **`index.html`**
  - โหลดฟอนต์ Prompt (300–800) และ Sarabun (300–700) จาก Google Fonts
  - `lang="th"` และ title "ระบบลงเวลาปฏิบัติราชการ"
  - `theme-color` สีกรม
- **`src/index.css`**
  - ลบ CSS ตั้งต้นของ Vite ทั้งหมด
  - ใส่ design tokens ตาม Design.md: สีหลัก กรม/คราม/ทอง, พื้นหลัง, สีตัวอักษร, สีสถานะ ok/warn/danger, gradient มาตรฐาน, เงา, `--ease`
  - typography: ฐาน 14px, line-height 1.6, h1 30/800, h2 22/700, h3 16/700
  - token เสริมที่ Design.md ไม่ได้ระบุ: `--navy-4`, `--navy-tint-border`, `--gold-tint`, `--row-hover`, `--surface`, `--ok-solid`
- **`src/App.css`**: เขียนใหม่ทั้งไฟล์ เดิมเป็นไฟล์ตัวอย่างของ Vite ที่ไม่ได้ import ใช้
  - Sider: gradient แนวตั้ง, แถบทองหน้าเมนูที่เลือก
  - Header: gradient แนวนอน, ริบบิ้นทอง 3px
  - Content: พื้นขาวนวล
  - class ตาม Design.md: `.section-label`, `.panel`, `.btn-gold`, `.lift-card`
  - หัวการ์ดพื้นเข้มเป็นแถบกรมทึบ + เส้นทอง, หัวตารางโทนขาวนวล
- **`src/App.jsx`**
  - ครอบแอปด้วย `ConfigProvider` (theme + `locale={th_TH}`)
  - จัด Sider/Header ใหม่ให้ใช้ class แทน inline style
  - Sider ย่อเองอัตโนมัติเมื่อจอแคบกว่า `md`

### หน้าต่าง ๆ (23 ไฟล์ใน `src/pages`, `src/reports`)

- เปลี่ยนสี hex ที่ hardcode ไว้เป็น `var(--token)` ทั้งหมด
- ลบ `backgroundColor: '#1890ff'` ออกจากปุ่ม primary
- Tag "รออนุมัติ" จาก `processing` (น้ำเงิน) เป็น `warning`
- **AttendancePage:** ใช้ `.panel`, ปุ่ม "ลงเวลา" เป็น `.btn-gold`, แผนที่ GPS ตามสเปก, แก้เวลาที่ขึ้นบรรทัดใหม่บนมือถือ
- **CalendarPage:** แถบหัววันเป็นแถบกรมทึบ ตัวอักษรทองซีด, วันที่เลือกพื้นทองอ่อนขอบทอง
- **Dashboard / AttendanceHistory:** การ์ดสถิติใบแรกเป็นแถบกรม, พื้นแผนที่โทนกรมอ่อน
- **ประวัติการลา / OT:** หัวข้อใช้ `.section-label`, การ์ดใช้ `.lift-card`, ตัวเลขชั่วโมง OT สีทอง

## 2. Component `BrandHeader`

- **ไฟล์ใหม่:** `src/components/BrandHeader.jsx`, `src/components/BrandHeader.css`
- ที่มา: บล็อก `.brand-header` ของหน้า Login SSO ใน artifact
- props:
  - `logoSrc`, `orgTh`, `orgEn`
  - `size`: `sm` สำหรับ Header 64px, `lg` ขนาดเท่าต้นแบบ
  - `divider`: เส้นทองสั้นใต้แบรนด์
- ใช้รูปตราจาก `public/logo_spm.png` ที่มีอยู่แล้ว ไม่ได้ดาวน์โหลดรูปจาก artifact
- เมนูซ้ายเปลี่ยนจากตรา + ชื่อหน่วยงาน เป็น "ระบบลงเวลา / ปฏิบัติราชการ" เพราะ Header แสดงตราแล้ว

## 3. Header: ปุ่มธีม, แจ้งเตือน, เมนูผู้ใช้ (ต้นแบบ `portal.html`)

- เอาชื่อระบบ "ระบบลงเวลาปฏิบัติราชการ / Time Attendance System" ออกจาก Header
- **ไฟล์ใหม่:**
  - `src/components/HeaderActions.jsx`: รวมปุ่มด้านขวา
  - `src/components/NotificationPanel.jsx`
  - `src/components/UserMenu.jsx`
  - `src/theme/opmTheme.js`: ย้าย antd theme ออกจาก App.jsx และเพิ่มชุดสีโหมดมืด
  - `src/theme/useThemeMode.js`: สลับและจำโหมดใน localStorage (key `spm_time_theme`)
- **โหมดมืด:**
  - CSS tokens ชุดมืดอยู่ที่ `:root[data-theme='dark']` ใน `index.css`
  - antd ใช้ `darkAlgorithm`
  - หน้าต่าง ๆ เปลี่ยนพื้นการ์ดเป็น `--surface`
  - การ์ดสถิติใช้สีตัวอักษรคงที่ ไม่ให้กลืนกับพื้นในโหมดมืด
- **แจ้งเตือน:**
  - กระดิ่งมีตัวเลขจำนวน กดแล้วเปิด Drawer ด้านขวา
  - หมวด: การลงเวลา / คำขอลงเวลา / การลา / ทำงานล่วงเวลา
  - มีชิปกรองตามหมวด กดรายการแล้วไปหน้าที่เกี่ยวข้อง
  - รายการเป็นข้อมูลจำลอง
- **เมนูผู้ใช้:** antd `Dropdown` ส่วนหัวแสดงชื่อและอีเมล
- แก้บั๊ก: เปิดหน้าครั้งแรกบนมือถือ เมนูซ้ายกางเต็มอยู่ ตอนนี้เช็กขนาดจอตั้งแต่โหลดหน้า

## 4. ลดเมนูที่ไม่ใช้

- เอากลุ่ม "ผู้ดูแลระบบ" ออกจาก dropdown ผู้ใช้ ได้แก่ ข้อมูลผู้ใช้งาน, สิทธิการใช้งาน, Activity Log, Login Log, ตั้งค่าการใช้งานของหน่วยงาน, ประกาศความเป็นส่วนตัว
  - หน้าเหล่านี้ยังเข้าได้จากเมนูซ้าย
- เอาปุ่มย่อ/ขยาย "<" ท้าย Sider ออก (`trigger={null}`) ยังย่อ/ขยายได้จากปุ่มมุมบนซ้าย
- เมนูผู้ใช้ตอนนี้: ข้อมูลส่วนตัว, รหัสผ่านและความปลอดภัย, การแจ้งเตือน, การแสดงผล, ออกจากระบบ

## 5. หน้าต่างโปรไฟล์ (ต้นแบบ `#tab-info`, `#tab-password`, `#tab-notif`)

- **ไฟล์ใหม่:** `src/components/ProfileModal.jsx`, `src/components/ProfileModal.css`
- เปิดจาก 3 เมนูใน dropdown ผู้ใช้ สลับแท็บได้จากเมนูซ้ายใน modal
- บนมือถือเมนูกลายเป็นแท็บแนวนอน และฟอร์มเหลือคอลัมน์เดียว
- **ข้อมูลส่วนตัว:**
  - ฟิลด์ครบตามต้นแบบ ใส่ข้อมูลตัวอย่างไว้
  - ชื่อบัญชีและรหัส DPIS แก้ไขไม่ได้
  - ตรวจรูปแบบอีเมล
- **รหัสผ่านและความปลอดภัย:**
  - ตรวจตามข้อกำหนดจริง: อย่างน้อย 8 ตัว, ตัวพิมพ์ใหญ่และเล็ก, ตัวเลข, อักขระพิเศษ, ไม่ซ้ำรหัสเดิม, ยืนยันรหัสตรงกัน
  - รายการข้อกำหนดขึ้น ✓ ทีละข้อขณะพิมพ์
- **การแจ้งเตือน:**
  - สวิตช์ "ในระบบ" กับ "อีเมล" ต่อรายการ
  - ปรับรายการให้เข้ากับระบบลงเวลา โดยเพิ่มหมวด "การลงเวลา" และตัดหัวข้อที่เป็นเรื่องของ portal ออก
- ปุ่มบันทึกทุกแท็บยังเป็นต้นแบบ แสดงข้อความแจ้งเท่านั้น ยังไม่มี API

## 6. WorkCycleDetailPage: รหัสเวลาการทำงานรายบุคคล

- **ไฟล์:** `src/pages/attandance_setting/WorkCycleDetailPage.jsx`
- เอาช่อง "รหัสเวลาการทำงาน" ออกจากฝั่งซ้าย (ข้อมูลรอบการทำงาน)
- เพิ่มช่องเลือกรหัสเวลาการทำงานในกล่องของเจ้าหน้าที่แต่ละท่าน
  - ต้องเลือกทุกคนก่อนบันทึก
  - ลบเจ้าหน้าที่แล้ว ช่องของคนนั้นไม่ถูกตรวจอีก
- รูปแบบค่าจากฟอร์มเปลี่ยนจาก `workTimeCode` ค่าเดียว เป็น `workTimeCodes: { "<รหัสเจ้าหน้าที่>": "<รหัสเวลา>" }`
  - **ถ้าต่อ API ต้องรับรูปแบบนี้**
- ขยายความสูงรายชื่อจาก 350px เป็น 460px

## 7. แก้ error

### ESLint (54 → 0)

- ลบ `import React` ที่ไม่ได้ใช้ (React 19 ไม่ต้องใช้กับ JSX)
- ลบ import ไอคอนและ component ที่ไม่ได้ใช้
- ลบตัวแปรที่ไม่ได้ใช้: `navigate`, `setLeaveData`, `currentTerm`, `selectedRowKeys` ใน OTRatePage
- ลบ component `SettingsPlaceholder` ใน App.jsx ที่ไม่มีหน้าไหนเรียกใช้
- ลบ `handleDeleteSelected` ใน HolidayGroupPage และ HolidayPage: ฟังก์ชันลบหลายรายการที่ไม่มีปุ่มเรียกใช้
  - **ถ้าต้องการฟีเจอร์นี้ ต้องเพิ่มกลับพร้อมปุ่ม**
- RptWorkCalendarPage: `let content = null` → `let content`

### คำเตือนของ antd ใน console

- `headStyle` / `bodyStyle` → `styles={{ header, body }}` (17 การ์ด)
- `bordered={false}` บน Card → `variant="borderless"`
- `pagination.position` → `pagination.placement`
- ปุ่มแนบเอกสารใน Form (OTDetail, WFADetail, WorkCycleDetail): เพิ่ม `valuePropName="fileList"`

---

## รายการไฟล์

**ไฟล์ใหม่**

| ไฟล์ | หน้าที่ |
|---|---|
| `src/components/BrandHeader.jsx` / `.css` | ตรา + ชื่อหน่วยงานใน Header |
| `src/components/HeaderActions.jsx` | ปุ่มด้านขวาของ Header |
| `src/components/NotificationPanel.jsx` | กระดิ่ง + แผงแจ้งเตือน |
| `src/components/UserMenu.jsx` | dropdown เมนูผู้ใช้ |
| `src/components/ProfileModal.jsx` / `.css` | หน้าต่างโปรไฟล์ 3 แท็บ |
| `src/theme/opmTheme.js` | antd theme โหมดสว่าง/มืด |
| `src/theme/useThemeMode.js` | สลับและจำโหมดธีม |
| `HistoryLog.md` | เอกสารนี้ |

**ไฟล์ที่แก้ไข**

- `index.html`, `src/index.css`, `src/App.css`, `src/App.jsx`
- 23 หน้าใน `src/pages/**` และ `src/reports/**`

## สิ่งที่ยังค้าง / ข้อควรทราบ

- ยังไม่ได้ commit ตามที่สั่งไว้
- ปุ่มบันทึกในหน้าต่างโปรไฟล์, ออกจากระบบ และตั้งค่าการแจ้งเตือน เป็นต้นแบบ ยังไม่เชื่อม backend
- รายการแจ้งเตือนในกระดิ่งเป็นข้อมูลจำลอง
- เมนูซ้ายบางรายการยังไม่มีหน้ารองรับ (กลุ่ม "ข้อมูลผู้ใช้งาน" และ "การตั้งค่าการใช้งานระบบ" ยกเว้นประกาศความเป็นส่วนตัว) กดแล้วได้หน้าว่าง
