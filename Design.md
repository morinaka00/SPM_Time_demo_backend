# Design System — ระบบลงเวลาปฏิบัติราชการ

ธีม **"กรมเข้ม ริบบิ้นทอง"** อ้างอิงจากต้นแบบ *OPM Portal — ศูนย์รวมระบบงาน สำนักเลขาธิการนายกรัฐมนตรี*

> กรม `#0C1B3A` · น้ำเงินคราม `#26418A` · ขาวนวล `#FBFAF7` · ทอง `#C9982C`

ทุกค่าในเอกสารนี้ถูกนิยามไว้ในโค้ดแล้ว ห้าม hardcode สีใหม่ในคอมโพเนนต์ — ให้ใช้ CSS variable หรือ antd theme token แทน

| ชั้น | ไฟล์ | หน้าที่ |
|---|---|---|
| Design tokens | [`src/index.css`](src/index.css) | CSS variables (สี, เงา, ฟอนต์) + base typography |
| Component styles | [`src/App.css`](src/App.css) | Sider, Header, ริบบิ้นทอง, panel, ปุ่มทอง, การ์ด |
| Ant Design theme | [`src/App.jsx`](src/App.jsx) (`opmTheme`) | `ConfigProvider` token + component token |
| Fonts | [`index.html`](index.html) | โหลด Prompt / Sarabun จาก Google Fonts |

---

## 1. สี (Color)

### 1.1 สีหลัก

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--navy-1` | `#0c1b3a` | สีกรมเข้ม — พื้น header/sider, สีหัวข้อ, สีตัวอักษรหลัก |
| `--navy-2` | `#152a55` | ไล่เฉดของ gradient |
| `--navy-3` | `#26418a` | น้ำเงินคราม — **primary** (ปุ่ม, ลิงก์, ไอคอน, avatar) |
| `--gold` | `#c9982c` | ทอง — เส้นเน้น, ขอบวันที่เลือก, ตัวเลข OT |
| `--gold-light` | `#e2bd5f` | ทองอ่อน — ปุ่มทอง (ต้น gradient) |
| `--gold-pale` | `#f0d99a` | ทองซีด — ตัวอักษร/ไอคอนบนพื้นกรม, เมนูที่เลือก |

### 1.2 พื้นหลังและเส้น

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--bg` | `#fbfaf7` | ขาวนวล — พื้นหลังหน้า, แถบรอง (legend, location bar) |
| `--white` | `#ffffff` | พื้นการ์ด / panel |
| `--border` | `#e7e4dc` | เส้นขอบหลัก |
| `--border-soft` | `#f1efe9` | เส้นคั่นภายในการ์ด |

### 1.3 ตัวอักษร

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--text-dark` | `#0c1b3a` | ข้อความหลัก, หัวข้อ |
| `--text-muted` | `#7c7a70` | ข้อความรอง, คำอธิบาย, ไอคอนประกอบ |

### 1.4 สถานะ

| สถานะ | สีตัวอักษร | พื้น | ขอบ | ตัวอย่างการใช้ |
|---|---|---|---|---|
| สำเร็จ / ปกติ | `--ok` `#1e6b48` | `--ok-bg` `#f2fbf5` | `--ok-border` `#bfe3cb` | เวลาเข้า, อนุมัติแล้ว, ข้อมูลครบถ้วน |
| รอดำเนินการ | `--warn` `#b5460f` | `--warn-bg` `#fdf5ee` | `--warn-border` `#f3d3ba` | รออนุมัติ, ยังไม่เข้างาน |
| ผิดพลาด / ไม่อนุมัติ | `--danger` `#c0392b` | `--danger-bg` `#fdf1ef` | `--danger-border` `#f2c6c0` | เวลาออก, ไม่อนุมัติ, ข้อมูลไม่สมบูรณ์ |
| ไม่ใช้งาน | `--idle` `#a09c8e` | — | — | สถานะที่ยังไม่เชื่อมต่อ |

antd `Tag` ใช้ `color="success" | "warning" | "error"` ซึ่งจะได้สีตามตารางนี้ผ่าน theme token อัตโนมัติ

### 1.5 Gradient มาตรฐาน

| ชื่อ | ค่า | ใช้กับ |
|---|---|---|
| แถบกรม (แนวนอน) | `linear-gradient(105deg, #081531 0%, #0c1b3a 38%, #1d3568 100%)` | Header |
| แถบกรม (แนวตั้ง) | `linear-gradient(180deg, #081531 0%, #0c1b3a 45%, #152a55 100%)` | Sider |
| แถบกรมทึบ | `linear-gradient(100deg, #0a1733 0%, #0f2246 55%, #1d3568 100%)` | แถบหัววันในปฏิทิน |
| ริบบิ้นทอง | `linear-gradient(90deg, var(--gold), var(--gold-pale) 45%, rgba(240,217,154,0))` | เส้นทองใต้ header (สูง 3px) |
| ปุ่มทอง | `linear-gradient(180deg, var(--gold-light), var(--gold))` | ปุ่มหลัก (CTA) |
| ปุ่มทอง hover | `linear-gradient(180deg, #d3ab45, #ac7f1e)` | ปุ่มหลักขณะ hover |

---

## 2. Typography

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--sans` | `'Prompt', 'Sarabun', sans-serif` | ฟอนต์หลักทั้งระบบ (หัวข้อ, เมนู, ปุ่ม, ฟอร์ม) |
| `--body` | `'Sarabun', sans-serif` | สำรองสำหรับเนื้อหายาว |

- ขนาดพื้นฐาน `14px`, line-height `1.6`
- น้ำหนักที่โหลด: Prompt 300–800, Sarabun 300–700

### ขนาดหัวข้อ

| ระดับ | ขนาด | น้ำหนัก | หมายเหตุ |
|---|---|---|---|
| `h1` | 30px | 800 | letter-spacing `-0.02em`, line-height 1.25 |
| `h2` | 22px | 700 | |
| `h3` | 16px | 700 | |
| ชื่อระบบใน Header | 16px | 600 | สีขาว |
| Section label | 16px | 700 | ขีดเส้นทองด้านล่าง |
| หัวการ์ด (antd Card) | 15px | — | `Card.headerFontSize` |
| ตัวเลขเวลา (เข้า/ออก) | 20–22px | bold | สี `--ok` / `--danger` |
| ข้อความรอง | 11–13px | 400 | สี `--text-muted` |

---

## 3. รูปทรง เงา และการเคลื่อนไหว

| รายการ | ค่า |
|---|---|
| Border radius มาตรฐาน | `8px` (การ์ด, panel, input) |
| Border radius ปุ่มหลัก | `999px` (pill) |
| `--shadow-soft` | `0 4px 12px rgba(12,27,58,0.06)` — panel ปกติ |
| `--shadow-card` | `0 10px 24px rgba(12,27,58,0.12)` — การ์ดขณะ hover |
| `--ease` | `cubic-bezier(.2,.8,.2,1)` — ทุก transition ใช้ 220ms |

---

## 4. Layout

```
┌──────────┬──────────────────────────────────────────┐
│  Sider   │  Header (แถบกรม gradient)  ชื่อระบบ · ผู้ใช้ │
│  232px   ├══════════════════════════════════════════┤ ← ริบบิ้นทอง 3px
│  navy    │                                          │
│  ตรา +   │  Content  (พื้น --bg, padding 28px 24px)  │
│  เมนู    │                                          │
└──────────┴──────────────────────────────────────────┘
```

- **Sider** (`.app-sider`): gradient แนวตั้ง, ย่อได้, กว้าง 232px
  - ส่วนแบรนด์ (`.brand`) สูง 64px: ปุ่มย่อ/ขยาย (สีทองซีด) + ตราวงกลม (`.seal-sm`) + ชื่อหน่วยงาน
  - เมนูที่เลือก: พื้น `rgba(201,152,44,0.18)`, ตัวอักษร `--gold-pale`, แถบทอง 3px ด้านซ้าย
  - เมนูปกติ: `rgba(255,255,255,0.72)`, hover เป็นขาว
- **Header** (`.app-header`): sticky, gradient แนวนอน, avatar วงกลม navy-3 ขอบทองซีด
- **Content** (`.app-content`): บนจอ ≤560px padding ลดเป็น `20px 12px`

---

## 5. คอมโพเนนต์

### ตราสัญลักษณ์ — `.seal-sm`
วงกลม 36px, ขอบ `1.6px solid rgba(240,217,154,.75)`, พื้น `radial-gradient(circle at 35% 30%, #1d3568, #0a1733)`

### Section label — `.section-label`
หัวข้อหน้า/ส่วน: ตัวหนา สีกรม มีเส้นทอง 2px ด้านล่าง

```jsx
<Title level={4} className="section-label" style={{ margin: 0 }}>ประวัติการลา</Title>
```

### Panel — `.panel`
การ์ดแบบ mobile (กว้างสุด 420px กึ่งกลาง) ใช้ในหน้าลงเวลาและปฏิทิน: พื้นขาว ขอบ `--border` มุม 8px เงา `--shadow-soft`

### ปุ่มทอง — `.btn-gold`
ปุ่ม CTA หลักของหน้า (เช่น "ลงเวลา") ทรง pill, ตัวอักษร `#241a02` ตัวหนา, เงา `0 8px 20px rgba(201,152,44,.3)`, hover ยกขึ้น 1px

```jsx
<Button className="btn-gold" size="large">ลงเวลา</Button>
```

ปุ่มรองให้ใช้ antd `type="primary"` (ได้สี `--navy-3`) หรือ `type="default"`

### การ์ดรายการ — `.lift-card`
ใช้กับ antd `Card` ในหน้ารายการ (ประวัติการลา / OT) ขอบ `--border`, hover ยกขึ้น 2px + `--shadow-card`

```jsx
<Card className="lift-card" hoverable title="ลาพักร้อน" extra={<Tag color="success">อนุมัติแล้ว</Tag>}>
```

### ปฏิทิน
- แถบหัววัน: gradient แถบกรมทึบ, ตัวอักษร `--gold-pale` น้ำหนัก 600, เส้นทอง 2px ด้านล่าง
- วันที่ถูกเลือก: พื้น `rgba(240,217,154,0.22)` ขอบ `--gold`
- จุดสถานะ: ครบถ้วน `--ok` · วันหยุด `--navy-3` · ไม่สมบูรณ์ `--danger` · ยังไม่ถึง `--border`

### แผนที่ GPS (หน้าลงเวลา)
พื้น `#eef1f8` ลายจุด `#cfd8ec`, วงรัศมี `rgba(38,65,138,0.14)`, หมุดสี `--danger`, ป้ายวันที่ขอบ `--gold`

---

## 6. Ant Design Theme (`opmTheme`)

ตั้งค่าที่ `ConfigProvider` ใน [`src/App.jsx`](src/App.jsx) พร้อม `locale={th_TH}`

| Token | ค่า |
|---|---|
| `colorPrimary` / `colorInfo` / `colorLink` | `#26418a` |
| `colorSuccess` | `#1e6b48` |
| `colorWarning` | `#c9982c` |
| `colorError` | `#c0392b` |
| `colorText` / `colorTextHeading` | `#0c1b3a` |
| `colorTextSecondary` | `#7c7a70` |
| `colorBorder` / `colorBorderSecondary` | `#e7e4dc` / `#efece5` |
| `colorBgLayout` / `colorBgContainer` | `#fbfaf7` / `#ffffff` |
| `fontFamily` | `'Prompt', 'Sarabun', sans-serif` |
| `fontSize` / `borderRadius` | `14` / `8` |

Component tokens: `Layout` (header/sider สีกรม, trigger `#081531` + ทองซีด), `Menu` (dark item สีตามข้อ 4), `Card.headerFontSize: 15`

---

## 7. แนวทางการใช้งาน

- ✅ ใช้ `var(--token)` ใน inline style เช่น `style={{ color: 'var(--text-muted)' }}`
- ✅ ใช้สถานะผ่าน antd (`Tag color="success"`) หรือ `--ok / --warn / --danger`
- ✅ ทองใช้เป็น **สีเน้น** เท่านั้น (เส้น, CTA หนึ่งปุ่มต่อหน้า, ตัวเลขสำคัญ) — ไม่ใช้เป็นพื้นใหญ่
- ✅ พื้นกรม (navy gradient) ใช้กับแถบโครงสร้าง (header, sider, แถบหัวตาราง) — ตัวอักษรบนพื้นกรมใช้ขาวหรือ `--gold-pale`
- ❌ ห้ามใช้สี default ของ antd เดิม (`#1890ff`, `#52c41a`, `#ff4d4f`, `#faad14`, `#d9d9d9`, `#262626`, `#595959`)
- ❌ ห้ามใช้ฟอนต์ระบบ (`system-ui`, `Segoe UI`) แทน Prompt/Sarabun
