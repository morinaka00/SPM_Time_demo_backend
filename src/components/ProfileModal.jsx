import { useState } from 'react';
import { Modal, Form, Input, Select, Button, Checkbox, Switch, Avatar, Tooltip, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  CameraOutlined,
  InboxOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  NotificationOutlined,
  WarningOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import './ProfileModal.css';

// โปรไฟล์ผู้ใช้ 3 แท็บ — ดัดแปลงจาก profile modal ของต้นแบบ portal (#tab-info, #tab-password, #tab-notif)

const PROFILE_TABS = [
  { key: 'info', icon: <UserOutlined />, label: 'ข้อมูลส่วนตัว' },
  { key: 'password', icon: <LockOutlined />, label: 'รหัสผ่านและความปลอดภัย' },
  { key: 'notif', icon: <BellOutlined />, label: 'การแจ้งเตือน' },
];

// ข้อมูลจำลองของผู้ใช้ที่เข้าระบบ
const DEMO_PROFILE = {
  titleTh: 'นาย',
  titleEn: 'Mr.',
  firstNameTh: 'สมชาย',
  lastNameTh: 'ใจดี',
  firstNameEn: 'Somchai',
  lastNameEn: 'Jaidee',
  username: 'somchai.j',
  dpisId: '40248',
  emailGov: 'somchai.j@opm.go.th',
  emailPersonal: '',
  mobile: '',
  ext: '',
  lineId: '',
  department: 'สำนักเลขาธิการนายกรัฐมนตรี',
  group: 'กองบริหารงานทั่วไป',
  position: 'นักวิเคราะห์นโยบายและแผน',
  level: 'ชำนาญการ',
  executivePosition: '',
  building: 'ทำเนียบรัฐบาล',
  floor: '',
  staffType: 'ข้าราชการ',
  itGroup: 'Non-IT',
  workGroup: 'experienced',
  role: 'admin',
};

const opts = (arr) => arr.map((v) => (typeof v === 'string' ? { value: v, label: v } : v));

/* ---------------- แท็บ: ข้อมูลส่วนตัว ---------------- */
function InfoTab() {
  const [form] = Form.useForm();
  const p = DEMO_PROFILE;

  return (
    <>
      <div className="profile-content-title">ข้อมูลส่วนตัว</div>
      <div className="profile-content-sub">ข้อมูลที่ใช้ร่วมกันทุกระบบงานที่เข้าผ่าน portal</div>

      <div className="profile-card">
        <div className="avatar-lg">
          <Avatar size={60} icon={<UserOutlined />} />
          <Tooltip title="เปลี่ยนรูปโปรไฟล์">
            <button
              type="button"
              className="avatar-edit-badge"
              aria-label="เปลี่ยนรูปโปรไฟล์"
              onClick={() => message.info('อัปโหลดรูปโปรไฟล์ (ต้นแบบ)')}
            >
              <CameraOutlined />
            </button>
          </Tooltip>
        </div>
        <div className="profile-card-info">
          <div className="p-name">{p.titleTh}{p.firstNameTh} {p.lastNameTh}</div>
          <div className="p-role">{p.position}{p.level} · {p.group}</div>
          <div className="p-tags">
            <span className="tag-pill">เจ้าหน้าที่</span>
            <span className="tag-pill">ผู้ดูแลระบบ</span>
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical" initialValues={p} requiredMark={false} className="profile-form">
        <div className="form-row">
          <Form.Item label="คำนำหน้า (ภาษาไทย)" name="titleTh">
            <Select options={opts(['นาย', 'นาง', 'นางสาว'])} />
          </Form.Item>
          <Form.Item label="คำนำหน้า (ภาษาอังกฤษ)" name="titleEn">
            <Select options={opts(['Mr.', 'Mrs.', 'Miss'])} />
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="ชื่อ ภาษาไทย" name="firstNameTh"><Input /></Form.Item>
          <Form.Item label="นามสกุล ภาษาไทย" name="lastNameTh"><Input /></Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="ชื่อ ภาษาอังกฤษ" name="firstNameEn"><Input /></Form.Item>
          <Form.Item label="นามสกุล ภาษาอังกฤษ" name="lastNameEn"><Input /></Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="ชื่อบัญชีเข้าระบบ" name="username"><Input disabled /></Form.Item>
          <Form.Item label="รหัสประจำตัวบุคลากร (DPIS6)" name="dpisId"><Input disabled /></Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="อีเมลราชการ" name="emailGov" rules={[{ type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="อีเมลส่วนตัว" name="emailPersonal" rules={[{ type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }]}>
            <Input type="email" />
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="เบอร์โทรศัพท์มือถือ" name="mobile"><Input type="tel" /></Form.Item>
          <Form.Item label="เบอร์โทรภายใน (4 หลัก)" name="ext"><Input maxLength={4} /></Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="LINE User ID" name="lineId"><Input /></Form.Item>
          <div />
        </div>

        <div className="form-section-label">ข้อมูลตำแหน่งและสังกัด (ดึงจากระบบบุคลากร DPIS)</div>

        <div className="form-row">
          <Form.Item label="หน่วยงาน/สังกัด" name="department"><Input /></Form.Item>
          <Form.Item label="กลุ่ม/ฝ่าย" name="group"><Input /></Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="ตำแหน่งในสายงาน" name="position"><Input /></Form.Item>
          <Form.Item label="ระดับตำแหน่ง" name="level">
            <Select options={opts(['ปฏิบัติงาน', 'ปฏิบัติการ', 'ชำนาญการ', 'ชำนาญการพิเศษ', 'เชี่ยวชาญ'])} />
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="ชื่อตำแหน่งทางบริหาร (ถ้ามี)" name="executivePosition">
            <Input placeholder="เช่น ผู้อำนวยการกองเทคโนโลยีสารสนเทศ" />
          </Form.Item>
          <div />
        </div>

        <div className="form-row">
          <Form.Item label="สถานที่ทำงาน (ตึก)" name="building"><Input /></Form.Item>
          <Form.Item label="ชั้นที่ทำงาน" name="floor"><Input /></Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="ประเภทบุคลากร" name="staffType">
            <Select options={opts(['ข้าราชการ', 'ลูกจ้างประจำ', 'พนักงานราชการ', 'จ้างเหมาบริการ'])} />
          </Form.Item>
          <Form.Item label="กลุ่มบุคลากรตามด้านไอที" name="itGroup">
            <Select options={opts(['IT', 'Non-IT'])} />
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item label="บุคลากรทั่วไป (ประเภทกลุ่มงาน)" name="workGroup">
            <Select
              options={[
                { value: 'new', label: 'บุคลากรแรกบรรจุ' },
                { value: 'experienced', label: 'บุคลากรที่มีประสบการณ์' },
                { value: 'lead', label: 'บุคลากรที่ทำหน้าที่หัวหน้างาน' },
                { value: 'director', label: 'บุคลากรที่ดำรงตำแหน่งประเภทอำนวยการ' },
                { value: 'executive', label: 'บุคลากรที่ดำรงตำแหน่งประเภทบริหาร' },
              ]}
            />
          </Form.Item>
          <Form.Item label="บทบาทผู้ใช้งาน (Role)" name="role">
            <Select
              options={[
                { value: 'user', label: 'ผู้ใช้งานทั่วไป (user)' },
                { value: 'admin', label: 'ผู้ดูแลระบบ (admin)' },
                { value: 'department_director', label: 'ผู้บริหารหน่วยงาน (department_director)' },
                { value: 'group_director', label: 'ผู้บริหารกลุ่มงาน (group_director)' },
                { value: 'expert', label: 'ผู้เชี่ยวชาญ (expert)' },
              ]}
            />
          </Form.Item>
        </div>

        <div className="profile-form-hint">
          ข้อมูลนี้เก็บไว้ที่ portal เมื่อเชื่อมระบบยืนยันตัวตนกลาง (ThaID) แล้ว ชื่อและอีเมลจะดึงมาจากทะเบียนกลางแทน
          ส่วนข้อมูลตำแหน่งและสังกัดจะดึงและอัปเดตอัตโนมัติจากระบบบุคลากร (DPIS)
        </div>

        <div className="profile-footer">
          <Button onClick={() => form.resetFields()}>คืนค่าเดิม</Button>
          <Button
            type="primary"
            onClick={() => form.validateFields().then(() => message.success('บันทึกข้อมูลส่วนตัวแล้ว (ต้นแบบ)'))}
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </Form>
    </>
  );
}

/* ---------------- แท็บ: รหัสผ่านและความปลอดภัย ---------------- */
const PASSWORD_RULES = [
  { test: (v) => v.length >= 8, text: 'ความยาวอย่างน้อย 8 ตัวอักษร' },
  { test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v), text: 'มีตัวอักษรพิมพ์ใหญ่และพิมพ์เล็ก' },
  { test: (v) => /\d/.test(v), text: 'มีตัวเลขอย่างน้อย 1 ตัว' },
  { test: (v) => /[^A-Za-z0-9]/.test(v), text: 'มีอักขระพิเศษอย่างน้อย 1 ตัว' },
];

function PasswordTab() {
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const newPassword = Form.useWatch('newPassword', form) || '';
  const PwdInput = show ? Input : Input.Password;

  const save = () =>
    form.validateFields().then(() => {
      message.success('บันทึกรหัสผ่านใหม่แล้ว (ต้นแบบ)');
      form.resetFields();
    });

  return (
    <>
      <div className="profile-content-title">รหัสผ่านและความปลอดภัย</div>
      <div className="profile-content-sub">รหัสผ่านและการยืนยันตัวตนสองขั้นของบัญชีคุณ ใช้ร่วมกันทุกระบบที่เข้าผ่าน portal</div>

      <div className="pwd-grid">
        <div className="pwd-card">
          <div className="pwd-card-head">
            <span className="pwd-card-icon"><LockOutlined /></span>
            <div>
              <div className="pwd-card-title">เปลี่ยนรหัสผ่าน</div>
              <div className="pwd-card-sub">แนะนำให้เปลี่ยนรหัสผ่านเป็นระยะเพื่อความปลอดภัย</div>
            </div>
          </div>

          <Form form={form} layout="vertical" requiredMark={false} className="profile-form">
            <Form.Item
              label="รหัสผ่านปัจจุบัน"
              name="currentPassword"
              rules={[{ required: true, message: 'กรุณากรอกรหัสผ่านปัจจุบัน' }]}
            >
              <PwdInput placeholder="กรอกรหัสผ่านปัจจุบัน" autoComplete="current-password" />
            </Form.Item>
            <Form.Item
              label="รหัสผ่านใหม่"
              name="newPassword"
              dependencies={['currentPassword']}
              rules={[
                { required: true, message: 'กรุณากรอกรหัสผ่านใหม่' },
                ({ getFieldValue }) => ({
                  validator(_, v = '') {
                    if (!v) return Promise.resolve();
                    const failed = PASSWORD_RULES.find((r) => !r.test(v));
                    if (failed) return Promise.reject(new Error(`ต้อง${failed.text}`));
                    if (v === getFieldValue('currentPassword')) return Promise.reject(new Error('ต้องไม่ซ้ำกับรหัสผ่านเดิม'));
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <PwdInput placeholder="กรอกรหัสผ่านใหม่" autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              label="ยืนยันรหัสผ่านใหม่"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'กรุณายืนยันรหัสผ่านใหม่' },
                ({ getFieldValue }) => ({
                  validator(_, v) {
                    return !v || v === getFieldValue('newPassword')
                      ? Promise.resolve()
                      : Promise.reject(new Error('รหัสผ่านใหม่ไม่ตรงกัน'));
                  },
                }),
              ]}
            >
              <PwdInput placeholder="กรอกรหัสผ่านใหม่อีกครั้ง" autoComplete="new-password" />
            </Form.Item>

            <Checkbox checked={show} onChange={(e) => setShow(e.target.checked)}>แสดงรหัสผ่าน</Checkbox>

            <div className="profile-footer">
              <Button onClick={() => form.resetFields()}>ล้างค่า</Button>
              <Button type="primary" onClick={save}>บันทึกรหัสผ่านใหม่</Button>
            </div>
          </Form>
        </div>

        <div className="pwd-rules">
          <div className="pwd-rules-title">ข้อกำหนดรหัสผ่าน</div>
          <ul>
            {PASSWORD_RULES.map((r) => (
              <li key={r.text} className={newPassword && r.test(newPassword) ? 'ok' : ''}>{r.text}</li>
            ))}
            <li>ไม่ซ้ำกับรหัสผ่านเดิม</li>
          </ul>
        </div>
      </div>
    </>
  );
}

/* ---------------- แท็บ: การแจ้งเตือน ---------------- */
// ปรับหัวข้อจากต้นแบบ portal ให้เข้ากับระบบลงเวลา
const NOTIF_SETTINGS = [
  {
    section: 'งานที่รอดำเนินการ',
    rows: [
      { key: 'newRequest', icon: <InboxOutlined />, title: 'มีคำขอใหม่ส่งถึงฉัน', desc: 'คำขอลงเวลา ใบลา หรือคำขอทำงานล่วงเวลาที่รอให้คุณอนุมัติ', app: true, email: true },
      { key: 'requestResult', icon: <CheckSquareOutlined />, title: 'ผลการพิจารณาคำขอ', desc: 'คำขอของคุณได้รับอนุมัติ ไม่อนุมัติ หรือถูกส่งกลับให้แก้ไข', app: true, email: true },
    ],
  },
  {
    section: 'การลงเวลา',
    rows: [
      { key: 'remindIn', icon: <ClockCircleOutlined />, title: 'เตือนก่อนเวลาเข้างาน', desc: 'เตือน 15 นาทีก่อนเวลาเข้างานตามรอบการทำงานของคุณ', app: true, email: false },
      { key: 'missingOut', icon: <LogoutOutlined />, title: 'ยังไม่ได้ลงเวลาออก', desc: 'เมื่อเลยเวลาเลิกงานแล้วยังไม่มีการลงเวลาออก', app: true, email: true },
      { key: 'incomplete', icon: <ExclamationCircleOutlined />, title: 'ข้อมูลการลงเวลาไม่สมบูรณ์', desc: 'สรุปวันที่ขาดการลงเวลาเข้าหรือออก ส่งทุกสิ้นสัปดาห์', app: true, email: false },
    ],
  },
  {
    section: 'ข่าวสารของ PORTAL',
    rows: [
      { key: 'announce', icon: <NotificationOutlined />, title: 'ประกาศจากผู้ดูแลระบบ', desc: 'ประกาศที่ขึ้นบนหน้าแรกของ portal', app: true, email: true },
      { key: 'maintenance', icon: <WarningOutlined />, title: 'แจ้งปิดปรับปรุงระบบ', desc: 'ช่วงเวลาที่ระบบงานจะใช้งานไม่ได้', app: true, email: true },
    ],
  },
  {
    section: 'ความปลอดภัย',
    rows: [
      { key: 'unusualLogin', icon: <SafetyOutlined />, title: 'การเข้าใช้งานที่ผิดปกติ', desc: 'เข้าสู่ระบบจากอุปกรณ์หรือที่ตั้งใหม่ และการเปลี่ยนวิธียืนยันตัวตน', app: true, email: true },
    ],
  },
];

const defaultNotifPrefs = () =>
  Object.fromEntries(NOTIF_SETTINGS.flatMap((s) => s.rows).map((r) => [r.key, { app: r.app, email: r.email }]));

function NotifTab() {
  const [prefs, setPrefs] = useState(defaultNotifPrefs);
  const toggle = (key, channel) => (checked) =>
    setPrefs((p) => ({ ...p, [key]: { ...p[key], [channel]: checked } }));

  return (
    <>
      <div className="profile-content-title">การแจ้งเตือน</div>
      <div className="profile-content-sub">เลือกว่าเรื่องไหนต้องเตือน และเตือนทางไหน — เป็นการแจ้งเตือนที่รวมมาจากทุกระบบงาน</div>

      <div className="notif-settings-colhead">
        <div />
        <div />
        <div className="nsr-col-label">ในระบบ</div>
        <div className="nsr-col-label">อีเมล</div>
      </div>

      {NOTIF_SETTINGS.map((s) => (
        <div key={s.section}>
          <div className="notif-settings-section">{s.section}</div>
          {s.rows.map((r) => (
            <div className="notif-settings-row" key={r.key}>
              <div className="nsr-icon">{r.icon}</div>
              <div>
                <div className="nsr-title">{r.title}</div>
                <div className="nsr-desc">{r.desc}</div>
              </div>
              <Switch
                className="nsr-switch"
                aria-label={`${r.title} — ในระบบ`}
                checked={prefs[r.key].app}
                onChange={toggle(r.key, 'app')}
              />
              <Switch
                className="nsr-switch"
                aria-label={`${r.title} — อีเมล`}
                checked={prefs[r.key].email}
                onChange={toggle(r.key, 'email')}
              />
            </div>
          ))}
        </div>
      ))}

      <div className="profile-footer">
        <Button onClick={() => setPrefs(defaultNotifPrefs())}>คืนค่าเริ่มต้น</Button>
        <Button type="primary" onClick={() => message.success('บันทึกการตั้งค่าการแจ้งเตือนแล้ว (ต้นแบบ)')}>
          บันทึกการตั้งค่า
        </Button>
      </div>
    </>
  );
}

/* ---------------- Modal ---------------- */
const TAB_CONTENT = { info: InfoTab, password: PasswordTab, notif: NotifTab };

export default function ProfileModal({ open, tab, onTabChange, onClose }) {
  const Content = TAB_CONTENT[tab] || InfoTab;

  return (
    <Modal
      className="profile-modal"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1100}
      centered
      destroyOnHidden
      title="โปรไฟล์"
    >
      <div className="profile-modal-body">
        <nav className="profile-modal-nav" aria-label="เมนูโปรไฟล์">
          {PROFILE_TABS.map((t) => (
            <button
              type="button"
              key={t.key}
              className={`profile-nav-item ${tab === t.key ? 'active' : ''}`}
              aria-current={tab === t.key ? 'page' : undefined}
              onClick={() => onTabChange(t.key)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="profile-modal-content">
          <Content />
        </div>
      </div>
    </Modal>
  );
}
