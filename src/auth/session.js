// สถานะการเข้าสู่ระบบ (ต้นแบบ — ยังไม่ตรวจกับ backend จริง)
// เก็บใน sessionStorage: refresh ในแท็บเดิมยังอยู่ แต่เปิดระบบใหม่ (แท็บ/หน้าต่างใหม่) ต้อง Login ก่อนทุกครั้ง
const SESSION_KEY = 'spm_time_session';

export function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ไม่มี storage ก็ยังใช้งานได้ในหน้าปัจจุบัน แค่ refresh แล้วต้อง Login ใหม่
  }
}
