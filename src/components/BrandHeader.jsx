import './BrandHeader.css';

// ส่วนหัวแบรนด์หน่วยงาน (ตรา + ชื่อไทย/อังกฤษ) — ดัดแปลงจาก .brand-header ของต้นแบบหน้า SSO
// size: 'sm' = ใช้ในแถบ Header ของแอป, 'lg' = ใช้บนพื้นกรมขนาดใหญ่ (เช่น หน้าเข้าสู่ระบบ)
export default function BrandHeader({
  logoSrc = '/logo_spm.png',
  orgTh = 'สำนักเลขาธิการนายกรัฐมนตรี',
  orgEn = 'The Secretariat of the Prime Minister',
  size = 'sm',
  divider = false,
  className = '',
}) {
  return (
    <div className={`brand-header brand-header--${size} ${className}`.trim()}>
      <div className="brand-header__row">
        <img
          className="brand-header__logo"
          src={logoSrc}
          alt="ตราสัญลักษณ์สำนักเลขาธิการนายกรัฐมนตรี"
        />
        <div className="brand-header__text">
          <p className="brand-header__org-th">{orgTh}</p>
          {orgEn && <p className="brand-header__org-en">{orgEn}</p>}
        </div>
      </div>
      {divider && <div className="brand-header__divider" />}
    </div>
  );
}
