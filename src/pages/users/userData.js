// ข้อมูลผู้ใช้งาน (ต้นแบบ) — ยกมาจากเมนู "ผู้ใช้งาน" ของต้นแบบ portal ใน artifact
// เก็บในหน่วยความจำของหน้าเว็บ: เพิ่ม/แก้ไข/ลบ แล้วเห็นผลทั้งหน้ารายการและหน้า Add/Edit
// แต่ refresh หน้าแล้วจะกลับเป็นข้อมูลตั้งต้น (ยังไม่มี backend)

export const STATUS_LABEL = { connected: 'อนุมัติแล้ว', pending: 'รอการอนุมัติ', rejected: 'ไม่อนุมัติ' };
export const STATUS_TAG = { connected: 'success', pending: 'warning', rejected: 'error' };

// รายการสิทธิ์ (มาจากเมนู "จัดการสิทธิ์การใช้งาน" ของต้นแบบ)
export const ROLES = [
  { id: 'r1', name: 'ผู้ดูแลระบบสูงสุด', code: 'super-admin', active: true },
  { id: 'r2', name: 'ผู้ดูแลระบบหน่วยงาน', code: 'admin', active: true },
  { id: 'r3', name: 'ผู้บริหาร / หัวหน้ากลุ่มงาน', code: 'manager', active: true },
  { id: 'r4', name: 'เจ้าหน้าที่ทั่วไป', code: 'staff', active: true },
  { id: 'r5', name: 'ผู้ใช้งานภายนอก / ผู้ประสานงาน', code: 'external', active: false },
  { id: 'r6', name: 'เจ้าหน้าที่ MIS', code: 'staff-mis', active: true },
  { id: 'r7', name: 'เจ้าหน้าที่บันทึกเวลาปฏิบัติราชการ', code: 'staff-time', active: true },
  { id: 'r8', name: 'เจ้าหน้าที่ลาออนไลน์', code: 'staff-leave', active: true },
  { id: 'r9', name: 'เจ้าหน้าที่สารบรรณอิเล็กทรอนิกส์', code: 'staff-doc', active: true },
  { id: 'r10', name: 'เจ้าหน้าที่งบประมาณ', code: 'staff-budget', active: true },
  { id: 'r11', name: 'เจ้าหน้าที่บุคลากร', code: 'staff-hr', active: true },
  { id: 'r12', name: 'เจ้าหน้าที่พัสดุและครุภัณฑ์', code: 'staff-asset', active: true },
  { id: 'r13', name: 'เจ้าหน้าที่ e-PCOS', code: 'staff-epcos', active: true },
];

export const SYSTEMS = [
  'MIS — ระบบสารสนเทศเพื่อการจัดการ',
  'บันทึกเวลาปฏิบัติราชการ',
  'ลาออนไลน์',
  'สารบรรณอิเล็กทรอนิกส์',
  'งบประมาณ',
  'บุคลากร',
  'พัสดุและครุภัณฑ์',
  'e-PCOS',
];

export const PREFIXES = ['นาย', 'นาง', 'นางสาว'];
export const LEVELS = ['ปฏิบัติงาน', 'ปฏิบัติการ', 'ชำนาญการ', 'ชำนาญการพิเศษ', 'เชี่ยวชาญ'];

const blank = {
  prefix: '', firstTh: '', lastTh: '', firstEn: '', lastEn: '',
  dept: '', worksite: '', position: '', level: 'ปฏิบัติการ',
  email: '', phone: '', username: '', roleIds: [], dateStart: '', dateEnd: '', systems: [],
};
const u = (id, fields) => ({ ...blank, id, status: 'connected', ...fields });

let users = [
  u('u1', { firstTh: 'สุภัสรา', lastTh: 'หอมตลบ', dept: 'กองงานนายกรัฐมนตรี', roleIds: ['r1'], systems: ['MIS — ระบบสารสนเทศเพื่อการจัดการ', 'ลาออนไลน์', 'งบประมาณ'] }),
  u('u2', { firstTh: 'อาทิตย์', lastTh: 'ใจดี', roleIds: ['r4'], systems: ['MIS — ระบบสารสนเทศเพื่อการจัดการ', 'บันทึกเวลาปฏิบัติราชการ', 'ลาออนไลน์', 'งบประมาณ'] }),
  u('u3', { prefix: 'นาย', firstTh: 'สุชาติ', lastTh: 'มีดี', dept: 'กองนโยบายและแผน', roleIds: ['r4'], systems: ['MIS — ระบบสารสนเทศเพื่อการจัดการ', 'บันทึกเวลาปฏิบัติราชการ', 'ลาออนไลน์', 'งบประมาณ', 'พัสดุและครุภัณฑ์'] }),
  u('u4', { prefix: 'นาย', firstTh: 'นพลักษณ์', lastTh: 'มิบังอาจ', dept: 'กองกลาง', roleIds: ['r4'], systems: ['MIS — ระบบสารสนเทศเพื่อการจัดการ'] }),
  u('u5', { prefix: 'นางสาว', firstTh: 'ปิยะดา', lastTh: 'ศรีสวัสดิ์', firstEn: 'Piyada', lastEn: 'Srisawat', position: 'นักทรัพยากรบุคคล', level: 'ชำนาญการ', dept: 'กองการเจ้าหน้าที่', email: 'piyada.s@opm.go.th', phone: '02-288-4101', worksite: 'ทำเนียบรัฐบาล', username: 'piyada.s', roleIds: ['r4', 'r11'], systems: ['บุคลากร', 'ลาออนไลน์', 'สารบรรณอิเล็กทรอนิกส์'] }),
  u('u6', { prefix: 'นาย', firstTh: 'วีระ', lastTh: 'พงษ์เจริญ', firstEn: 'Veera', lastEn: 'Pongcharoen', position: 'นักวิชาการพัสดุ', level: 'ชำนาญการพิเศษ', dept: 'กองพัสดุและอาคารสถานที่', email: 'veera.p@opm.go.th', phone: '02-288-4102', worksite: 'ทำเนียบรัฐบาล', username: 'veera.p', roleIds: ['r2', 'r12'], systems: ['พัสดุและครุภัณฑ์', 'ลาออนไลน์'] }),
  u('u7', { prefix: 'นางสาว', firstTh: 'สมหญิง', lastTh: 'รักงาน', firstEn: 'Somying', lastEn: 'Rakngan', position: 'ผู้อำนวยการกองคลัง', level: 'เชี่ยวชาญ', dept: 'กองคลัง', email: 'somying.r@opm.go.th', phone: '02-288-4103', worksite: 'ทำเนียบรัฐบาล', username: 'somying.r', roleIds: ['r3', 'r10'], systems: ['งบประมาณ', 'MIS — ระบบสารสนเทศเพื่อการจัดการ'] }),
  u('u8', { prefix: 'นาย', firstTh: 'อนุเมธ', lastTh: 'หลอดบน', firstEn: 'Anumet', lastEn: 'Lodbon', position: 'นักวิเคราะห์นโยบายและแผน', level: 'ชำนาญการ', dept: 'กองแผนงานและงบประมาณ', email: 'anumet.l@opm.go.th', phone: '02-288-4104', worksite: 'ทำเนียบรัฐบาล', username: 'anumet.l', roleIds: ['r2', 'r8'], systems: ['ลาออนไลน์', 'งบประมาณ', 'บันทึกเวลาปฏิบัติราชการ'] }),
  u('u9', { prefix: 'นางสาว', firstTh: 'กมลชนก', lastTh: 'แก้วมณี', firstEn: 'Kamonchanok', lastEn: 'Kaewmanee', position: 'นักวิชาการคอมพิวเตอร์', level: 'ปฏิบัติการ', dept: 'กลุ่มพัฒนาระบบบริหาร', email: 'kamonchanok.k@opm.go.th', phone: '02-288-4105', worksite: 'อาคารสำนักงาน 2', username: 'kamonchanok.k', roleIds: ['r6'], systems: ['MIS — ระบบสารสนเทศเพื่อการจัดการ', 'e-PCOS'] }),
  u('u10', { prefix: 'นาย', firstTh: 'ธนกฤต', lastTh: 'สุขสวัสดิ์', firstEn: 'Thanakrit', lastEn: 'Suksawat', position: 'เจ้าพนักงานธุรการ', level: 'ปฏิบัติงาน', dept: 'กองกลาง', email: 'thanakrit.s@opm.go.th', phone: '02-288-4106', worksite: 'ทำเนียบรัฐบาล', username: 'thanakrit.s', status: 'pending' }),
  u('u11', { prefix: 'นางสาว', firstTh: 'น้ำฝน', lastTh: 'ใจเย็น', firstEn: 'Namfon', lastEn: 'Jaiyen', position: 'เจ้าพนักงานธุรการ', level: 'ปฏิบัติงาน', dept: 'กองการเจ้าหน้าที่', email: 'namfon.j@opm.go.th', phone: '02-288-4107', worksite: 'ทำเนียบรัฐบาล', username: 'namfon.j', systems: ['สารบรรณอิเล็กทรอนิกส์'] }),
  u('u12', { prefix: 'นาย', firstTh: 'ประเสริฐ', lastTh: 'วงศ์ดี', firstEn: 'Prasert', lastEn: 'Wongdee', position: 'นักวิชาการเงินและบัญชี', level: 'ปฏิบัติการ', dept: 'กองคลัง', email: 'prasert.w@opm.go.th', phone: '02-288-4108', worksite: 'ทำเนียบรัฐบาล', username: 'prasert.w', systems: ['งบประมาณ'] }),
];

export const userFullName = (x) => `${x.prefix || ''}${x.firstTh} ${x.lastTh}`;
export const roleName = (id) => ROLES.find((r) => r.id === id)?.name;

export const getUsers = () => users;
export const getUser = (id) => users.find((x) => x.id === id);

// username ซ้ำกับคนอื่นไหม (ไม่นับตัวเองตอนแก้ไข)
export const isUsernameTaken = (username, exceptId) =>
  users.some((x) => x.id !== exceptId && x.username && x.username.toLowerCase() === username.toLowerCase());

// บันทึก: มี id = แก้ไข, ไม่มี = เพิ่มใหม่ (สถานะเริ่มต้น "รอการอนุมัติ" ตามต้นแบบ)
export function saveUser(id, fields) {
  if (id && getUser(id)) {
    users = users.map((x) => (x.id === id ? { ...x, ...fields } : x));
    return id;
  }
  const newId = `user-${Date.now()}`;
  users = [...users, { ...blank, ...fields, id: newId, status: 'pending' }];
  return newId;
}

export function deleteUser(id) {
  users = users.filter((x) => x.id !== id);
}
