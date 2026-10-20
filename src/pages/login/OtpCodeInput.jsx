import { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import { makeRef, formatMmSs } from './otp';

// ช่องกรอกรหัส OTP 6 หลัก + รหัสอ้างอิง + นับถอยหลัง — ยืนยันอัตโนมัติเมื่อกรอกครบ
// email: อีเมลแบบปิดบางส่วน (ถ้าไม่ส่งมา = โหมดแอป Authenticator ไม่มีรหัสอ้างอิง/ส่งรหัสใหม่)
// ต้นแบบ: รหัสอะไรก็ผ่าน
export default function OtpCodeInput({ email, successText, onVerified }) {
  const [refCode] = useState(makeRef);
  const [expireSec, setExpireSec] = useState(4 * 60 + 57);
  const [resendSec, setResendSec] = useState(57);
  const [verified, setVerified] = useState(false);

  // นับถอยหลัง (แสดงผลอย่างเดียว)
  useEffect(() => {
    const t = setInterval(() => {
      setExpireSec((s) => Math.max(0, s - 1));
      setResendSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const onOtpChange = (value) => {
    if (verified || !/^\d{6}$/.test(value || '')) return;
    setVerified(true);
    setTimeout(onVerified, 700);
  };

  const resend = () => {
    if (resendSec > 0) return;
    setResendSec(60);
    setExpireSec(5 * 60);
    message.success(`ส่งรหัสใหม่ไปที่ ${email} แล้ว (จำลอง)`);
  };

  return (
    <>
      {email && (
        <div className="login-ref-row">
          <span>รหัสอ้างอิง</span>
          <span className="login-ref-badge">{refCode}</span>
        </div>
      )}

      <Input.OTP
        length={6}
        size="large"
        autoFocus
        disabled={verified}
        formatter={(v) => v.replace(/\D/g, '')}
        onChange={onOtpChange}
        className="login-otp"
      />
      <div className="login-status" role="status">
        {verified ? successText : ''}
      </div>
      <p className="login-note left">ระบบจะยืนยันรหัสให้อัตโนมัติเมื่อกรอกครบ 6 หลัก</p>

      {email && (
        <div className="login-timer-row">
          <span>รหัสหมดอายุใน {formatMmSs(expireSec)} นาที</span>
          <button type="button" className="login-link-sm" disabled={resendSec > 0} onClick={resend}>
            {resendSec > 0 ? `ส่งรหัสใหม่ได้ในอีก ${resendSec} วินาที` : 'ส่งรหัสอีกครั้ง'}
          </button>
        </div>
      )}
    </>
  );
}
