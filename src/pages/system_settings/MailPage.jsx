import { useState } from 'react';
import { Card, Form, Input, InputNumber, Radio, Button, Space, Typography, message } from 'antd';
import { SaveOutlined, UndoOutlined, ApiOutlined } from '@ant-design/icons';

const { Text } = Typography;

// หน้า "ตั้งค่า Mail Server" — ตั้งค่า SMTP สำหรับส่งอีเมลของระบบ (layout ตามภาพตัวอย่าง "ตั้งค่าอีเมล")
// ต้นแบบ: ค่าที่บันทึกเก็บในหน่วยความจำของหน้าเว็บ (refresh แล้วกลับเป็นค่าตั้งต้น)
// และปุ่ม "ทดสอบ" เป็นการจำลอง ยังไม่ได้เชื่อมต่อ SMTP จริง

const DEFAULTS = {
  host: '',
  port: 587,
  user: '',
  password: '',
  timeout: 30,
  encryption: 'none',
  from: '',
};

// พอร์ตมาตรฐานของแต่ละแบบการเข้ารหัส — เปลี่ยนให้อัตโนมัติถ้ายังใช้พอร์ตมาตรฐานเดิมอยู่
const STANDARD_PORTS = { none: 587, tls: 587, ssl: 465 };

// ค่าที่บันทึกล่าสุด (คงอยู่ระหว่างเปลี่ยนหน้า)
let savedSettings = { ...DEFAULTS };

export default function MailPage() {
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);
  const [testing, setTesting] = useState(false);

  // ทดสอบการเชื่อมต่อ: ตรวจช่องที่ต้องใช้ก่อน แล้วจำลองผลการเชื่อมต่อ
  const handleTest = () =>
    form
      .validateFields(['host', 'port', 'user', 'password', 'timeout'])
      .then(({ host, port }) => {
        setTesting(true);
        setTimeout(() => {
          setTesting(false);
          message.success(`เชื่อมต่อ ${host}:${port} สำเร็จ (จำลอง)`);
        }, 1200);
      })
      .catch(() => message.error('กรุณากรอกข้อมูล SMTP ให้ครบก่อนทดสอบ'));

  const handleSave = () =>
    form
      .validateFields()
      .then((values) => {
        savedSettings = { ...values, host: values.host.trim(), user: values.user.trim(), from: values.from.trim() };
        setDirty(false);
        message.success('บันทึกการตั้งค่าอีเมลแล้ว (ต้นแบบ)');
      })
      .catch(() => message.error('กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้อง'));

  // ยกเลิก = คืนค่าที่บันทึกไว้ล่าสุด
  const handleCancel = () => {
    form.resetFields(); // ล้างสถานะ error
    form.setFieldsValue(savedSettings);
    setDirty(false);
  };

  const onValuesChange = (changed, all) => {
    setDirty(true);
    if ('encryption' in changed && Object.values(STANDARD_PORTS).includes(all.port)) {
      form.setFieldValue('port', STANDARD_PORTS[changed.encryption]);
    }
  };

  const required = (label) => [{ required: true, whitespace: true, message: `กรุณาระบุ ${label}` }];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .mail-card .ant-card-head-title { white-space: normal; }
        .mail-form .ant-form-item { margin-bottom: 20px; }
        .mail-form .ant-form-item-label > label { font-weight: 500; }
        .mail-label-sub { display: block; font-size: 11.5px; font-weight: 400; color: var(--text-muted); line-height: 1.2; }
        .mail-form .ant-form-item-label { line-height: 1.3; }
        .mail-form .ant-radio-wrapper { margin-inline-end: 20px; }
        .mail-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--border-soft); }
        .mail-actions .ant-btn { min-width: 120px; height: 38px; }
        @media (max-width: 767.98px) {
          .mail-form .ant-form-item-label { text-align: left; }
        }
      `}</style>

      <Card
        className="mail-card"
        title={
          <div style={{ lineHeight: 1.35, padding: '4px 0' }}>
            <Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold', display: 'block' }}>ตั้งค่าอีเมล</Text>
            <Text style={{ color: 'var(--gold-pale)', fontSize: '12.5px', fontWeight: 400 }}>
              ตั้งค่า Mail Server (SMTP) สำหรับส่งอีเมลแจ้งเตือนและรหัส OTP ของระบบ
            </Text>
          </div>
        }
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8 }}
      >
        <Form
          form={form}
          className="mail-form"
          layout="horizontal"
          labelCol={{ xs: { span: 24 }, md: { flex: '200px' } }}
          wrapperCol={{ xs: { span: 24 }, md: { flex: 1 } }}
          labelWrap
          initialValues={savedSettings}
          onValuesChange={onValuesChange}
          style={{ maxWidth: 1000 }}
        >
          <Form.Item label="SMTP Server" required>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="host" noStyle rules={required('SMTP Server')}>
                <Input placeholder="เช่น smtp.opm.go.th" autoComplete="off" />
              </Form.Item>
              <Button type="primary" icon={<ApiOutlined />} loading={testing} onClick={handleTest}>
                ทดสอบ
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item
            label="SMTP Port"
            name="port"
            rules={[{ required: true, message: 'กรุณาระบุ SMTP Port' }]}
          >
            <InputNumber min={1} max={65535} precision={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="SMTP User" name="user" rules={required('SMTP User')}>
            <Input placeholder="ชื่อผู้ใช้สำหรับเข้าสู่ระบบ SMTP" autoComplete="off" />
          </Form.Item>

          <Form.Item label="SMTP Password" name="password" rules={required('SMTP Password')}>
            <Input.Password placeholder="รหัสผ่านสำหรับเข้าสู่ระบบ SMTP" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label={
              <span>
                SMTP Timeout
                <span className="mail-label-sub">(in seconds)</span>
              </span>
            }
            name="timeout"
            rules={[{ required: true, message: 'กรุณาระบุ SMTP Timeout' }]}
          >
            <InputNumber min={1} max={300} precision={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="SMTP Encryption" name="encryption" rules={[{ required: true }]}>
            <Radio.Group
              options={[
                { value: 'none', label: 'none' },
                { value: 'tls', label: 'tls' },
                { value: 'ssl', label: 'ssl' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="From"
            name="from"
            rules={[...required('From'), { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }]}
          >
            <Input placeholder="อีเมลผู้ส่ง เช่น noreply@opm.go.th" autoComplete="off" />
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <div className="mail-actions">
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                บันทึก
              </Button>
              <Button icon={<UndoOutlined />} onClick={handleCancel} disabled={!dirty}>
                ยกเลิก
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
