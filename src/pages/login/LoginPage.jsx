import { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
  MobileOutlined,
  IdcardOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons';
import BrandHeader from '../../components/BrandHeader';
import './LoginPage.css';

// ขั้นตอนเข้าสู่ระบบตามต้นแบบ artifact (login_system → login → login_sso_lv2.0 → login_sso_lv2.1)
//   choose  : เลือกวิธีเข้าสู่ระบบ (SSO / User local)
//   local   : ชื่อผู้ใช้ + รหัสผ่านของระบบ → เข้าระบบ
//   sso     : ขั้นที่ 1 จาก 2 — ชื่อผู้ใช้ + รหัสผ่าน SSO
//   verify  : ขั้นที่ 2 จาก 2 — เลือกวิธียืนยันตัวตนอีกชั้น
//   otp     : กรอกรหัส 6 หลัก (อีเมล / แอป Authenticator) → ยืนยันอัตโนมัติเมื่อครบ → เข้าระบบ
// ต้นแบบ: กรอกอะไรก็ผ่าน ยังไม่ตรวจกับระบบจริง

const PANELS = {
  system: {
    title: 'ระบบลงเวลาปฏิบัติราชการ',
    desc: 'สำหรับเจ้าหน้าที่และผู้ได้รับสิทธิ์เข้าใช้งานระบบลงเวลาปฏิบัติราชการ',
    footnote:
      'ระบบนี้ใช้การยืนยันตัวตนผ่านระบบบริการอิเล็กทรอนิกส์แบบรวมศูนย์ (SSO) เป็นช่องทางหลัก ผู้ใช้ที่มีบัญชีผู้ใช้งานของระบบ (User local) สามารถเข้าสู่ระบบด้วยบัญชีเดียวกันได้',
  },
  sso: {
    title: 'ระบบบริการอิเล็กทรอนิกส์แบบรวมศูนย์ (Single Sign-on)',
    desc: 'สำหรับเจ้าหน้าที่และผู้ได้รับสิทธิ์เข้าใช้งานระบบ',
    footnote:
      'เจ้าหน้าที่ในสังกัดเข้าสู่ระบบด้วยบัญชีเครือข่ายของหน่วยงาน (Active Directory) ส่วนบุคคลภายนอกใช้บัญชีที่ได้รับจากการลงทะเบียน จากนั้นยืนยันตัวตนอีกชั้นด้วยอีเมลหรือ ThaID',
  },
};

const prototypeNotice = (what) => () => message.info(`${what} (ต้นแบบ)`);

// อีเมลแบบปิดบางส่วน เช่น s••••@opm.go.th
const maskEmail = (username) => `${(username || 'u').slice(0, 1)}••••@opm.go.th`;

/* ---------------- ชิ้นส่วนที่ใช้ร่วมกัน ---------------- */
function BackLink({ onClick, children = 'กลับ' }) {
  return (
    <button type="button" className="login-back" onClick={onClick}>
      <ArrowLeftOutlined /> {children}
    </button>
  );
}

function UserRow({ username, onRestart }) {
  return (
    <>
      <div className="login-user-row">{username}</div>
      <button type="button" className="login-restart" onClick={onRestart}>
        <ReloadOutlined /> เริ่มเข้าสู่ระบบใหม่
      </button>
    </>
  );
}

// ฟอร์มชื่อผู้ใช้ + รหัสผ่าน (ใช้ทั้ง User local และ SSO ขั้นที่ 1)
function CredentialForm({ submitText, onSubmit, extra }) {
  return (
    <Form layout="vertical" requiredMark={false} onFinish={({ username }) => onSubmit(username.trim())}>
      <Form.Item
        label="ชื่อผู้ใช้งาน"
        name="username"
        rules={[{ required: true, whitespace: true, message: 'กรุณากรอกชื่อผู้ใช้งาน' }]}
      >
        <Input size="large" placeholder="ชื่อผู้ใช้งานของท่าน" autoComplete="username" autoFocus />
      </Form.Item>
      <Form.Item
        label={
          <span className="login-label-row">
            รหัสผ่าน
            <button type="button" className="login-link-sm" onClick={prototypeNotice('ลืมรหัสผ่าน')}>
              ลืมรหัสผ่าน?
            </button>
          </span>
        }
        name="password"
        rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
      >
        <Input.Password size="large" placeholder="••••••••" autoComplete="current-password" />
      </Form.Item>
      <Button htmlType="submit" size="large" block className="btn-gold login-submit">
        {submitText}
      </Button>
      {extra}
    </Form>
  );
}

/* ---------------- ขั้นตอนต่าง ๆ ---------------- */
function ChooseStep({ goTo }) {
  return (
    <>
      <p className="login-eyebrow">ระบบลงเวลาปฏิบัติราชการ</p>
      <h2 className="login-title">เข้าสู่ระบบ</h2>
      <p className="login-sub">เลือกวิธีเข้าสู่ระบบ</p>

      <Button size="large" block className="btn-gold login-submit" icon={<SafetyCertificateOutlined />} onClick={() => goTo('sso')}>
        เข้าสู่ระบบด้วย SSO
      </Button>
      <p className="login-or">
        หรือ{' '}
        <button type="button" className="login-link-lg" onClick={() => goTo('local')}>
          เข้าสู่ระบบด้วย User local
        </button>
      </p>
      <p className="login-note">แนะนำให้เข้าสู่ระบบผ่าน SSO · ใช้บัญชีเดียวกันกับ User local</p>
    </>
  );
}

function LocalStep({ goTo, onLogin }) {
  return (
    <>
      <BackLink onClick={() => goTo('choose')} />
      <p className="login-eyebrow">ระบบลงเวลาปฏิบัติราชการ</p>
      <h2 className="login-title">เข้าสู่ระบบด้วย User local</h2>
      <p className="login-sub">กรอกชื่อผู้ใช้งานและรหัสผ่านของระบบ</p>
      <CredentialForm submitText="เข้าสู่ระบบ" onSubmit={(username) => onLogin(username, 'local')} />
    </>
  );
}

function SsoStep({ goTo, setUsername }) {
  return (
    <>
      <BackLink onClick={() => goTo('choose')} />
      <p className="login-eyebrow">ขั้นที่ 1 จาก 2 · ระบบบริการอิเล็กทรอนิกส์แบบรวมศูนย์</p>
      <h2 className="login-title">เข้าสู่ระบบ</h2>
      <CredentialForm
        submitText="เข้าสู่ระบบ"
        onSubmit={(username) => {
          setUsername(username);
          goTo('verify');
        }}
        extra={
          <Button size="large" block className="login-secondary" onClick={prototypeNotice('สมัครสมาชิก / ขอใช้งานระบบ')}>
            สมัครสมาชิก / ขอใช้งานระบบ
          </Button>
        }
      />
    </>
  );
}

const VERIFY_OPTIONS = [
  {
    key: 'email',
    tone: 'mail',
    icon: <MailOutlined />,
    title: 'รหัส OTP ทางอีเมล',
    desc: (u) => `ส่งรหัส 6 หลักไปที่ ${maskEmail(u)} · ใช้ได้ 5 นาที`,
  },
  {
    key: 'app',
    tone: 'app',
    icon: <MobileOutlined />,
    title: 'แอปยืนยันตัวตน (Authenticator)',
    desc: () => 'กรอกรหัส 6 หลักจากแอปที่ท่านผูกไว้ เช่น Google Authenticator · ใช้ได้แม้ไม่มีสัญญาณอินเทอร์เน็ต',
  },
  {
    key: 'thaid',
    tone: 'thaid',
    icon: <IdcardOutlined />,
    title: 'ThaID (ดิจิทัลไอดี)',
    desc: () => 'ยืนยันตัวตนด้วยแอป ThaID ของกรมการปกครอง โดยสแกน QR บนเว็บ ThaID',
  },
];

function VerifyStep({ goTo, username, setOtpMethod, onLogin }) {
  const choose = (key) => {
    if (key === 'thaid') {
      // ต้นแบบ: ข้ามการไปเว็บ ThaID และถือว่ายืนยันสำเร็จ
      message.success('ยืนยันตัวตนด้วย ThaID สำเร็จ (จำลอง)');
      onLogin(username, 'sso-thaid');
      return;
    }
    setOtpMethod(key);
    goTo('otp');
  };

  return (
    <>
      <p className="login-eyebrow">ขั้นที่ 2 จาก 2</p>
      <h2 className="login-title">ยืนยันตัวตนอีกชั้น</h2>
      <UserRow username={username} onRestart={() => goTo('choose')} />
      <p className="login-sub">
        สวัสดี <b>{username}</b> — โปรดเลือกวิธียืนยันตัวตน
      </p>

      {VERIFY_OPTIONS.map((o) => (
        <button type="button" key={o.key} className={`login-opt tone-${o.tone}`} onClick={() => choose(o.key)}>
          <span className="login-opt-icon">{o.icon}</span>
          <span className="login-opt-text">
            <span className="login-opt-title">{o.title}</span>
            <span className="login-opt-desc">{o.desc(username)}</span>
          </span>
          <RightOutlined className="login-opt-arrow" />
        </button>
      ))}

      <p className="login-note left">
        เมื่อเลือก ThaID ระบบจะนำท่านออกไปยังเว็บไซต์ ThaID ของกรมการปกครอง และกลับมาที่ระบบนี้เมื่อยืนยันเสร็จ
      </p>
      <BackLink onClick={() => goTo('sso')}>กลับไปหน้าเข้าสู่ระบบ</BackLink>
    </>
  );
}

// เลขอ้างอิงสุ่ม 5 ตัว เหมือนต้นแบบ (เช่น 3M7D3)
const makeRef = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const formatMmSs = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

function OtpStep({ goTo, username, otpMethod, onLogin }) {
  const [refCode] = useState(makeRef);
  const [expireSec, setExpireSec] = useState(4 * 60 + 57);
  const [resendSec, setResendSec] = useState(57);
  const [verified, setVerified] = useState(false);
  const isEmail = otpMethod === 'email';

  // นับถอยหลัง (แสดงผลอย่างเดียว)
  useEffect(() => {
    const t = setInterval(() => {
      setExpireSec((s) => Math.max(0, s - 1));
      setResendSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // กรอกครบ 6 หลัก → ยืนยันอัตโนมัติ (ต้นแบบ: รหัสอะไรก็ผ่าน)
  const onOtpChange = (value) => {
    if (verified || !/^\d{6}$/.test(value || '')) return;
    setVerified(true);
    setTimeout(() => onLogin(username, `sso-${otpMethod}`), 700);
  };

  const resend = () => {
    if (resendSec > 0) return;
    setResendSec(60);
    setExpireSec(5 * 60);
    message.success(isEmail ? `ส่งรหัสใหม่ไปที่ ${maskEmail(username)} แล้ว (จำลอง)` : 'รีเซ็ตเวลาแล้ว');
  };

  return (
    <>
      <p className="login-eyebrow">{isEmail ? 'ยืนยันด้วยอีเมล' : 'ยืนยันด้วยแอป Authenticator'}</p>
      <h2 className="login-title">กรอกรหัส 6 หลัก</h2>
      <UserRow username={username} onRestart={() => goTo('choose')} />

      <p className="login-sub">
        {isEmail ? (
          <>
            เราได้ส่งรหัสไปที่ <b>{maskEmail(username)}</b> โปรดตรวจสอบกล่องจดหมายของท่าน
          </>
        ) : (
          'เปิดแอป Authenticator ที่ท่านผูกไว้ แล้วกรอกรหัส 6 หลักที่แสดงอยู่'
        )}
      </p>

      {isEmail && (
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
        {verified ? 'ยืนยันสำเร็จ กำลังนำท่านเข้าสู่ระบบ...' : ''}
      </div>
      <p className="login-note left">ระบบจะยืนยันรหัสให้อัตโนมัติเมื่อกรอกครบ 6 หลัก</p>

      {isEmail && (
        <div className="login-timer-row">
          <span>รหัสหมดอายุใน {formatMmSs(expireSec)} นาที</span>
          <button type="button" className="login-link-sm" disabled={resendSec > 0} onClick={resend}>
            {resendSec > 0 ? `ส่งรหัสใหม่ได้ในอีก ${resendSec} วินาที` : 'ส่งรหัสอีกครั้ง'}
          </button>
        </div>
      )}

      <BackLink onClick={() => goTo('verify')}>เลือกวิธียืนยันอื่น</BackLink>
    </>
  );
}

/* ---------------- หน้า Login ---------------- */
export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState('choose');
  const [username, setUsername] = useState('');
  const [otpMethod, setOtpMethod] = useState('email');

  const panel = ['sso', 'verify', 'otp'].includes(step) ? PANELS.sso : PANELS.system;
  const props = { goTo: setStep, username, setUsername, otpMethod, setOtpMethod, onLogin };

  const steps = {
    choose: <ChooseStep {...props} />,
    local: <LocalStep {...props} />,
    sso: <SsoStep {...props} />,
    verify: <VerifyStep {...props} />,
    otp: <OtpStep {...props} />,
  };

  return (
    <div className="login-page">
      <section className="login-brand">
        <BrandHeader size="lg" divider />
        <h1 className="login-brand-title">{panel.title}</h1>
        <p className="login-brand-desc">{panel.desc}</p>
        <p className="login-brand-footnote">{panel.footnote}</p>
        <div className="login-brand-illustration" role="img" aria-label="ภาพประกอบอาคารสำนักเลขาธิการนายกรัฐมนตรี" />
        <p className="login-brand-contact">ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร · โทร. 0 2288 4000</p>
      </section>

      <main className="login-main">
        <div className="login-card" key={step}>
          {steps[step]}
          <p className="login-legal">
            การเข้าใช้งานระบบถือเป็นการยอมรับ{' '}
            <button type="button" onClick={prototypeNotice('เงื่อนไขการใช้งาน')}>เงื่อนไขการใช้งาน</button> และ{' '}
            <button type="button" onClick={prototypeNotice('นโยบายคุ้มครองข้อมูลส่วนบุคคล')}>นโยบายคุ้มครองข้อมูลส่วนบุคคล</button>{' '}
            ของหน่วยงาน
          </p>
        </div>
      </main>
    </div>
  );
}
