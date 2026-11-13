import { useState } from 'react';
import { Card, Form, Input, InputNumber, Radio, Switch, Checkbox, Slider, Button, Space, Typography, Alert, message } from 'antd';
import { SaveOutlined, UndoOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Text } = Typography;

// หน้า "ตั้งค่า Captcha" — ป้องกันการเข้าสู่ระบบอัตโนมัติ (bot) ด้วย Captcha
// ต้นแบบ: ค่าที่บันทึกเก็บในหน่วยความจำของหน้าเว็บ (refresh แล้วกลับเป็นค่าตั้งต้น)
// และปุ่ม "ทดสอบ" เป็นการจำลอง ยังไม่ได้เชื่อมต่อผู้ให้บริการจริง

const PROVIDERS = [
  { value: 'recaptcha_v2', label: 'Google reCAPTCHA v2', hint: 'ผู้ใช้ติ๊กช่อง "ฉันไม่ใช่โปรแกรมอัตโนมัติ"' },
  { value: 'recaptcha_v3', label: 'Google reCAPTCHA v3', hint: 'ตรวจสอบเบื้องหลังด้วยคะแนน (score) ผู้ใช้ไม่ต้องทำอะไร' },
  { value: 'turnstile', label: 'Cloudflare Turnstile', hint: 'ตรวจสอบอัตโนมัติ ไม่เก็บข้อมูลเพื่อโฆษณา' },
  { value: 'image', label: 'Captcha รูปภาพ (ภายในระบบ)', hint: 'ผู้ใช้พิมพ์ตัวอักษรจากรูปภาพ ไม่ต้องใช้บริการภายนอก' },
];

const PAGES = [
  { value: 'login', label: 'หน้าเข้าสู่ระบบ' },
  { value: 'forgot', label: 'หน้าลืมรหัสผ่าน' },
  { value: 'register', label: 'หน้าลงทะเบียนผู้ใช้งาน' },
  { value: 'otp', label: 'หน้าขอรหัส OTP' },
];

const DEFAULTS = {
  enabled: true,
  provider: 'recaptcha_v2',
  siteKey: '',
  secretKey: '',
  scoreThreshold: 0.5,
  imageLength: 5,
  pages: ['login', 'forgot'],
  triggerMode: 'always',
  failedAttempts: 3,
};

// ค่าที่บันทึกล่าสุด (คงอยู่ระหว่างเปลี่ยนหน้า)
let savedSettings = { ...DEFAULTS };

export default function CaptchaPage() {
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);
  const [testing, setTesting] = useState(false);
  const enabled = Form.useWatch('enabled', form) ?? savedSettings.enabled;
  const provider = Form.useWatch('provider', form) ?? savedSettings.provider;
  const triggerMode = Form.useWatch('triggerMode', form) ?? savedSettings.triggerMode;
  const needsKeys = provider !== 'image';

  const handleTest = () =>
    form
      .validateFields(['siteKey', 'secretKey'])
      .then(() => {
        setTesting(true);
        setTimeout(() => {
          setTesting(false);
          message.success('ตรวจสอบ Site Key / Secret Key สำเร็จ (จำลอง)');
        }, 1200);
      })
      .catch(() => message.error('กรุณาระบุ Site Key และ Secret Key ก่อนทดสอบ'));

  const handleSave = () =>
    form
      .validateFields()
      .then((values) => {
        savedSettings = { ...savedSettings, ...values };
        setDirty(false);
        message.success('บันทึกการตั้งค่า Captcha แล้ว (ต้นแบบ)');
      })
      .catch(() => message.error('กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้อง'));

  const handleCancel = () => {
    form.resetFields();
    form.setFieldsValue(savedSettings);
    setDirty(false);
  };

  const keyRules = (label) => [{ required: enabled && needsKeys, whitespace: true, message: `กรุณาระบุ ${label}` }];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .cfg-card .ant-card-head-title { white-space: normal; }
        .cfg-form .ant-form-item { margin-bottom: 20px; }
        .cfg-form .ant-form-item-label > label { font-weight: 500; }
        .cfg-form .ant-form-item-label { line-height: 1.3; }
        .cfg-section { font-weight: 600; color: var(--navy-1); margin: 8px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-soft); }
        .cfg-provider .ant-radio-wrapper { display: flex; margin-bottom: 10px; }
        .cfg-hint { display: block; font-size: 12px; color: var(--text-muted); }
        .cfg-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--border-soft); }
        .cfg-actions .ant-btn { min-width: 120px; height: 38px; }
        @media (max-width: 767.98px) { .cfg-form .ant-form-item-label { text-align: left; } }
      `}</style>

      <Card
        className="cfg-card"
        title={
          <div style={{ lineHeight: 1.35, padding: '4px 0' }}>
            <Text style={{ color: 'var(--white)', fontSize: 16, fontWeight: 'bold', display: 'block' }}>ตั้งค่า Captcha</Text>
            <Text style={{ color: 'var(--gold-pale)', fontSize: 12.5, fontWeight: 400 }}>
              ป้องกันการเข้าสู่ระบบด้วยโปรแกรมอัตโนมัติ (bot) และการเดารหัสผ่าน
            </Text>
          </div>
        }
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8 }}
      >
        <Form
          form={form}
          className="cfg-form"
          layout="horizontal"
          labelCol={{ xs: { span: 24 }, md: { flex: '220px' } }}
          wrapperCol={{ xs: { span: 24 }, md: { flex: 1 } }}
          labelWrap
          initialValues={savedSettings}
          onValuesChange={() => setDirty(true)}
          style={{ maxWidth: 1000 }}
        >
          <Form.Item label="เปิดใช้งาน Captcha" name="enabled" valuePropName="checked">
            <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
          </Form.Item>

          {!enabled && (
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 20 }}
              message="ปิดใช้งาน Captcha อยู่ ระบบจะไม่มีการป้องกัน bot ในหน้าเข้าสู่ระบบ"
            />
          )}

          <div className="cfg-section">ผู้ให้บริการ</div>

          <Form.Item label="ประเภท Captcha" name="provider">
            <Radio.Group className="cfg-provider" disabled={!enabled}>
              {PROVIDERS.map((p) => (
                <Radio key={p.value} value={p.value}>
                  {p.label}
                  <span className="cfg-hint">{p.hint}</span>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          {needsKeys ? (
            <>
              <Form.Item label="Site Key" required={enabled}>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="siteKey" noStyle rules={keyRules('Site Key')}>
                    <Input placeholder="Site Key จากผู้ให้บริการ" autoComplete="off" disabled={!enabled} />
                  </Form.Item>
                  <Button type="primary" icon={<SafetyCertificateOutlined />} loading={testing} onClick={handleTest} disabled={!enabled}>
                    ทดสอบ
                  </Button>
                </Space.Compact>
              </Form.Item>
              <Form.Item label="Secret Key" name="secretKey" rules={keyRules('Secret Key')}>
                <Input.Password placeholder="Secret Key จากผู้ให้บริการ" autoComplete="new-password" disabled={!enabled} />
              </Form.Item>
              {provider === 'recaptcha_v3' && (
                <Form.Item
                  label="คะแนนขั้นต่ำ (Score)"
                  name="scoreThreshold"
                  extra="คะแนนต่ำกว่าค่านี้ถือว่าเป็น bot (0 = bot แน่นอน, 1 = คนแน่นอน) แนะนำ 0.5"
                >
                  <Slider min={0} max={1} step={0.1} disabled={!enabled} marks={{ 0: '0', 0.5: '0.5', 1: '1' }} />
                </Form.Item>
              )}
            </>
          ) : (
            <Form.Item label="จำนวนตัวอักษร" name="imageLength" rules={[{ required: true, message: 'กรุณาระบุจำนวนตัวอักษร' }]}>
              <InputNumber min={4} max={8} precision={0} disabled={!enabled} addonAfter="ตัว" style={{ width: 160 }} />
            </Form.Item>
          )}

          <div className="cfg-section">การใช้งาน</div>

          <Form.Item
            label="หน้าที่แสดง Captcha"
            name="pages"
            rules={[{ required: enabled, type: 'array', min: 1, message: 'กรุณาเลือกอย่างน้อย 1 หน้า' }]}
          >
            <Checkbox.Group options={PAGES} disabled={!enabled} />
          </Form.Item>

          <Form.Item label="เงื่อนไขการแสดง" name="triggerMode">
            <Radio.Group
              disabled={!enabled}
              options={[
                { value: 'always', label: 'แสดงทุกครั้ง' },
                { value: 'failed', label: 'แสดงเมื่อเข้าสู่ระบบไม่สำเร็จ' },
              ]}
            />
          </Form.Item>

          {triggerMode === 'failed' && (
            <Form.Item label="จำนวนครั้งที่ผิด" name="failedAttempts" rules={[{ required: true, message: 'กรุณาระบุจำนวนครั้ง' }]}>
              <InputNumber min={1} max={10} precision={0} disabled={!enabled} addonAfter="ครั้ง" style={{ width: 160 }} />
            </Form.Item>
          )}

          <Form.Item label=" " colon={false}>
            <div className="cfg-actions">
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
