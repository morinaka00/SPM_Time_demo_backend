// ข้อมูลผู้ใช้งาน (ต้นแบบ) — ยกมาจากเมนู "ผู้ใช้งาน" ของต้นแบบ portal ใน artifact
// เก็บในหน่วยความจำของหน้าเว็บ: เพิ่ม/แก้ไข/ลบ แล้วเห็นผลทั้งหน้ารายการและหน้า Add/Edit
// แต่ refresh หน้าแล้วจะกลับเป็นข้อมูลตั้งต้น (ยังไม่มี backend)

import { MENU_ITEMS } from '../../config/menuItems';

export const STATUS_LABEL = { connected: 'อนุมัติแล้ว', pending: 'รอการอนุมัติ', rejected: 'ไม่อนุมัติ' };
export const STATUS_TAG = { connected: 'success', pending: 'warning', rejected: 'error' };

// ---------- สิทธิ์การใช้งาน (มาจากเมนู "จัดการสิทธิ์การใช้งาน" ของต้นแบบ) ----------
// perms = สิทธิ์ต่อเมนูของระบบนี้ (อ้างอิง MENU_ITEMS) รูปแบบ { [menuKey]: { view, add, edit, del, export } }

export const PERM_ACTIONS = [
  { key: 'view', label: 'แสดง' },
  { key: 'add', label: 'เพิ่ม' },
  { key: 'edit', label: 'แก้ไข' },
  { key: 'del', label: 'ลบ' },
  { key: 'export', label: 'ส่งออก' },
];

// เมนูย่อยทั้งหมด (เมนูที่เปิดหน้าได้จริง ไม่รวมหัวกลุ่ม)
export const MENU_LEAVES = MENU_ITEMS.flatMap((m) => m.children || [m]);

const NONE = { view: false, add: false, edit: false, del: false, export: false };
const FULL = { view: true, add: true, edit: true, del: true, export: true };

// สร้างสิทธิ์ตั้งต้น: rule(menuKey) คืนค่าสิทธิ์ของเมนูนั้น (ไม่คืน = ไม่มีสิทธิ์)
const buildPerms = (rule) => Object.fromEntries(MENU_LEAVES.map((m) => [m.key, { ...NONE, ...(rule(m.key) || {}) }]));
export const emptyPerms = () => buildPerms(() => null);

const inGroup = (key, ...prefixes) => prefixes.some((p) => key.startsWith(p));
const STAFF_RULE = (k) => {
  if (k === '/DashboardPage' || k === '/report/RptWorkCalendarPage') return { view: true };
  if (k === '/attendance/AttendancePage' || k === '/attendance/AttendanceRequestPage') return { view: true, add: true };
  if (k === '/attendance/AttendanceApprovePage') return null; // เมนูอนุมัติสำหรับผู้อนุมัติ ไม่ใช่เจ้าหน้าที่ทั่วไป
  if (inGroup(k, '/attendance/')) return { view: true };
  return null;
};
// ผู้ดูแลหน่วยงาน: จัดการงานของหน่วยงานได้ทั้งหมด ยกเว้นการตั้งค่าระบบ — สิทธิการใช้งานดูได้อย่างเดียว
const DEPT_ADMIN_RULE = (k) => {
  if (inGroup(k, '/system_settings/', '/settings/TermsConditionPage')) return null;
  if (k === '/users/UserGroupPage') return { view: true };
  return FULL;
};
// เจ้าหน้าที่ตรวจสอบรายงาน: ใช้งานแบบเจ้าหน้าที่ทั่วไป + ดู/ส่งออกรายงานทุกตัว
const REPORT_RULE = (k) => (inGroup(k, '/report/') ? { view: true, export: true } : STAFF_RULE(k));

const role = (id, name, code, active, rule) => ({ id, name, code, active, perms: buildPerms(rule) });

let roles = [
  role('r1', 'ผู้ดูแลระบบสูงสุด', 'super-admin', true, () => FULL),
  role('r2', 'ผู้ดูแลหน่วยงาน', 'dept-admin', true, DEPT_ADMIN_RULE),
  role('r3', 'เจ้าหน้าที่ทั่วไป', 'staff', true, STAFF_RULE),
  role('r4', 'เจ้าหน้าที่ตรวจสอบรายงาน', 'report-auditor', true, REPORT_RULE),
];

export const getRoles = () => roles;
export const getRole = (id) => roles.find((r) => r.id === id);

// สร้างรหัสระดับสิทธิ์จากชื่อ (แบบเดียวกับต้นแบบ)
const codeFromName = (name) =>
  `role-${name.trim().toLowerCase().replace(/[^฀-๿a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '')}`;

export const isRoleNameTaken = (name, exceptId) =>
  roles.some((r) => r.id !== exceptId && r.name.trim() === name.trim());

// บันทึกสิทธิ์: มี id = แก้ไข, ไม่มี = เพิ่มใหม่
export function saveRole(id, { name, active, perms }) {
  if (id && getRole(id)) {
    roles = roles.map((r) => (r.id === id ? { ...r, name, active, perms } : r));
    return id;
  }
  const newId = `role-${Date.now()}`;
  roles = [...roles, { id: newId, name, code: codeFromName(name), active, perms }];
  return newId;
}

// ลบได้เฉพาะสิทธิ์ที่ไม่มีผู้ใช้งานอยู่
export function deleteRole(id) {
  if (countUsersInRole(id) > 0) return false;
  roles = roles.filter((r) => r.id !== id);
  return true;
}

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
  // ผู้ดูแลระบบสูงสุด (r1)
  u('u1', { prefix: 'นางสาว', firstTh: 'สุภัสรา', lastTh: 'หอมตลบ', firstEn: 'Supatsara', lastEn: 'Homtalob', position: 'นักวิชาการคอมพิวเตอร์', level: 'ชำนาญการพิเศษ', dept: 'ศูนย์เทคโนโลยีสารสนเทศ', email: 'supatsara.h@opm.go.th', phone: '02-288-4001', worksite: 'ทำเนียบรัฐบาล', username: 'supatsara.h', roleIds: ['r1'], systems: ['MIS — ระบบสารสนเทศเพื่อการจัดการ', 'บันทึกเวลาปฏิบัติราชการ'] }),
  u('u9', { prefix: 'นางสาว', firstTh: 'กมลชนก', lastTh: 'แก้วมณี', firstEn: 'Kamonchanok', lastEn: 'Kaewmanee', position: 'นักวิชาการคอมพิวเตอร์', level: 'ปฏิบัติการ', dept: 'ศูนย์เทคโนโลยีสารสนเทศ', email: 'kamonchanok.k@opm.go.th', phone: '02-288-4105', worksite: 'อาคารสำนักงาน 2', username: 'kamonchanok.k', roleIds: ['r1'], systems: ['MIS — ระบบสารสนเทศเพื่อการจัดการ', 'บันทึกเวลาปฏิบัติราชการ'] }),
  // ผู้ดูแลหน่วยงาน (r2)
  u('u5', { prefix: 'นางสาว', firstTh: 'ปิยะดา', lastTh: 'ศรีสวัสดิ์', firstEn: 'Piyada', lastEn: 'Srisawat', position: 'นักทรัพยากรบุคคล', level: 'ชำนาญการ', dept: 'กองการเจ้าหน้าที่', email: 'piyada.s@opm.go.th', phone: '02-288-4101', worksite: 'ทำเนียบรัฐบาล', username: 'piyada.s', roleIds: ['r2'], systems: ['บุคลากร', 'ลาออนไลน์', 'บันทึกเวลาปฏิบัติราชการ'] }),
  u('u6', { prefix: 'นาย', firstTh: 'วีระ', lastTh: 'พงษ์เจริญ', firstEn: 'Veera', lastEn: 'Pongcharoen', position: 'นักจัดการงานทั่วไป', level: 'ชำนาญการพิเศษ', dept: 'กองกลาง', email: 'veera.p@opm.go.th', phone: '02-288-4102', worksite: 'ทำเนียบรัฐบาล', username: 'veera.p', roleIds: ['r2'], systems: ['บันทึกเวลาปฏิบัติราชการ', 'ลาออนไลน์'] }),
  // เจ้าหน้าที่ตรวจสอบรายงาน (r4)
  u('u7', { prefix: 'นางสาว', firstTh: 'สมหญิง', lastTh: 'รักงาน', firstEn: 'Somying', lastEn: 'Rakngan', position: 'นักทรัพยากรบุคคล', level: 'ชำนาญการพิเศษ', dept: 'กองการเจ้าหน้าที่', email: 'somying.r@opm.go.th', phone: '02-288-4103', worksite: 'ทำเนียบรัฐบาล', username: 'somying.r', roleIds: ['r4'], systems: ['บันทึกเวลาปฏิบัติราชการ', 'บุคลากร'] }),
  u('u8', { prefix: 'นาย', firstTh: 'อนุเมธ', lastTh: 'หลอดบน', firstEn: 'Anumet', lastEn: 'Lodbon', position: 'นักวิเคราะห์นโยบายและแผน', level: 'ชำนาญการ', dept: 'กองแผนงานและงบประมาณ', email: 'anumet.l@opm.go.th', phone: '02-288-4104', worksite: 'ทำเนียบรัฐบาล', username: 'anumet.l', roleIds: ['r4'], systems: ['บันทึกเวลาปฏิบัติราชการ', 'งบประมาณ'] }),
  // เจ้าหน้าที่ทั่วไป (r3)
  u('u2', { prefix: 'นาย', firstTh: 'อาทิตย์', lastTh: 'ใจดี', firstEn: 'Arthit', lastEn: 'Jaidee', position: 'นักวิเคราะห์นโยบายและแผน', level: 'ปฏิบัติการ', dept: 'กองนโยบายและแผน', email: 'arthit.j@opm.go.th', phone: '02-288-4109', worksite: 'ทำเนียบรัฐบาล', username: 'arthit.j', roleIds: ['r3'], systems: ['บันทึกเวลาปฏิบัติราชการ', 'ลาออนไลน์'] }),
  u('u3', { prefix: 'นาย', firstTh: 'สุชาติ', lastTh: 'มีดี', firstEn: 'Suchat', lastEn: 'Meedee', position: 'นักวิชาการพัสดุ', level: 'ชำนาญการ', dept: 'กองพัสดุและอาคารสถานที่', email: 'suchat.m@opm.go.th', phone: '02-288-4110', worksite: 'ทำเนียบรัฐบาล', username: 'suchat.m', roleIds: ['r3'], systems: ['บันทึกเวลาปฏิบัติราชการ', 'พัสดุและครุภัณฑ์'] }),
  u('u4', { prefix: 'นาย', firstTh: 'นพลักษณ์', lastTh: 'มิบังอาจ', firstEn: 'Noppalak', lastEn: 'Mibang-art', position: 'นิติกร', level: 'ปฏิบัติการ', dept: 'กองกลาง', email: 'noppalak.m@opm.go.th', phone: '02-288-4111', worksite: 'ทำเนียบรัฐบาล', username: 'noppalak.m', roleIds: ['r3'], systems: ['บันทึกเวลาปฏิบัติราชการ'] }),
  u('u10', { prefix: 'นาย', firstTh: 'ธนกฤต', lastTh: 'สุขสวัสดิ์', firstEn: 'Thanakrit', lastEn: 'Suksawat', position: 'เจ้าพนักงานธุรการ', level: 'ปฏิบัติงาน', dept: 'กองกลาง', email: 'thanakrit.s@opm.go.th', phone: '02-288-4106', worksite: 'ทำเนียบรัฐบาล', username: 'thanakrit.s', roleIds: ['r3'], status: 'pending', systems: ['บันทึกเวลาปฏิบัติราชการ'] }),
  u('u11', { prefix: 'นางสาว', firstTh: 'น้ำฝน', lastTh: 'ใจเย็น', firstEn: 'Namfon', lastEn: 'Jaiyen', position: 'เจ้าพนักงานธุรการ', level: 'ปฏิบัติงาน', dept: 'กองการเจ้าหน้าที่', email: 'namfon.j@opm.go.th', phone: '02-288-4107', worksite: 'ทำเนียบรัฐบาล', username: 'namfon.j', roleIds: ['r3'], systems: ['บันทึกเวลาปฏิบัติราชการ', 'ลาออนไลน์'] }),
  u('u12', { prefix: 'นาย', firstTh: 'ประเสริฐ', lastTh: 'วงศ์ดี', firstEn: 'Prasert', lastEn: 'Wongdee', position: 'นักวิชาการเงินและบัญชี', level: 'ปฏิบัติการ', dept: 'กองคลัง', email: 'prasert.w@opm.go.th', phone: '02-288-4108', worksite: 'ทำเนียบรัฐบาล', username: 'prasert.w', roleIds: ['r3'], status: 'rejected', systems: ['บันทึกเวลาปฏิบัติราชการ'] }),
];

export const userFullName = (x) => `${x.prefix || ''}${x.firstTh} ${x.lastTh}`;
export const roleName = (id) => getRole(id)?.name;
export const countUsersInRole = (roleId) => users.filter((x) => x.roleIds.includes(roleId)).length;
export const getUsersInRole = (roleId) => users.filter((x) => x.roleIds.includes(roleId));

// กำหนดรายชื่อผู้ใช้ในสิทธิ์ใหม่ทั้งชุด: คนที่อยู่ในรายการได้สิทธิ์นี้ คนที่ไม่อยู่ถูกถอดสิทธิ์นี้ออก (สิทธิ์อื่นไม่เปลี่ยน)
export function setRoleMembers(roleId, userIds) {
  const keep = new Set(userIds);
  users = users.map((x) => {
    const has = x.roleIds.includes(roleId);
    if (keep.has(x.id) && !has) return { ...x, roleIds: [...x.roleIds, roleId] };
    if (!keep.has(x.id) && has) return { ...x, roleIds: x.roleIds.filter((r) => r !== roleId) };
    return x;
  });
}

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
