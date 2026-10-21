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
  if (inGroup(k, '/attendance/')) return { view: true };
  return null;
};
const DASHBOARD_ONLY = (k) => (k === '/DashboardPage' ? { view: true } : null);

const role = (id, name, code, active, rule) => ({ id, name, code, active, perms: buildPerms(rule) });

let roles = [
  role('r1', 'ผู้ดูแลระบบสูงสุด', 'super-admin', true, () => FULL),
  role('r2', 'ผู้ดูแลระบบหน่วยงาน', 'admin', true, () => FULL),
  role('r3', 'ผู้บริหาร / หัวหน้ากลุ่มงาน', 'manager', true, (k) =>
    inGroup(k, '/users/', '/system_settings/', '/settings/TermsConditionPage') ? null : { view: true, export: true }),
  role('r4', 'เจ้าหน้าที่ทั่วไป', 'staff', true, STAFF_RULE),
  role('r5', 'ผู้ใช้งานภายนอก / ผู้ประสานงาน', 'external', false, DASHBOARD_ONLY),
  role('r6', 'เจ้าหน้าที่ MIS', 'staff-mis', true, DASHBOARD_ONLY),
  role('r7', 'เจ้าหน้าที่บันทึกเวลาปฏิบัติราชการ', 'staff-time', true, (k) => {
    if (inGroup(k, '/settings/WorkTimePage', '/settings/WorkCyclePage', '/settings/OTPage', '/settings/WFAPage')) return FULL;
    if (inGroup(k, '/report/')) return { view: true, export: true };
    return STAFF_RULE(k);
  }),
  role('r8', 'เจ้าหน้าที่ลาออนไลน์', 'staff-leave', true, DASHBOARD_ONLY),
  role('r9', 'เจ้าหน้าที่สารบรรณอิเล็กทรอนิกส์', 'staff-doc', true, DASHBOARD_ONLY),
  role('r10', 'เจ้าหน้าที่งบประมาณ', 'staff-budget', true, DASHBOARD_ONLY),
  role('r11', 'เจ้าหน้าที่บุคลากร', 'staff-hr', true, DASHBOARD_ONLY),
  role('r12', 'เจ้าหน้าที่พัสดุและครุภัณฑ์', 'staff-asset', true, DASHBOARD_ONLY),
  role('r13', 'เจ้าหน้าที่ e-PCOS', 'staff-epcos', true, DASHBOARD_ONLY),
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
