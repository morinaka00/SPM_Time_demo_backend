// ฟังก์ชันช่วยของขั้นตอน OTP (ใช้ทั้งหน้า Login และ popup ลืมรหัสผ่าน)

// อีเมลแบบปิดบางส่วน เช่น s••••@opm.go.th
export const maskEmail = (username) => `${(username || 'u').slice(0, 1)}••••@opm.go.th`;

// เลขอ้างอิงสุ่ม 5 ตัว เหมือนต้นแบบ (เช่น 3M7D3)
export const makeRef = () => Math.random().toString(36).slice(2, 7).toUpperCase();

export const formatMmSs = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
