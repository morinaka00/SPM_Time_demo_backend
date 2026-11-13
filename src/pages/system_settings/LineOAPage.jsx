import { useState } from 'react';
import { Card, Form, Input, InputNumber, Switch, Button, Space, Typography, Alert, Table, message } from 'antd';
import { SaveOutlined, UndoOutlined, ApiOutlined, CopyOutlined, SendOutlined } from '@ant-design/icons';

const { Text } = Typography;

// หน้า "ตั้งค่าการแจ้งเตือน LINE OA" — เชื่อมต่อ LINE Official Account (Messaging API)
// เพื่อส่งข้อความแจ้งเตือนให้ผู้ใช้งาน
// ต้นแบบ: ค่าที่บันทึกเก็บในหน่วยความจำของหน้าเว็บ และปุ่มทดสอบ/ส่งข้อความเป็นการจำลอง

const WEBHOOK_URL = 'https://xxx.xxx.com/api/line/webhook';

// เหตุการณ์ที่ส่งแจ้งเตือนได้ — minutes = ส่งเตือนก่อน/หลังเวลาตามรอบการทำงานกี่นาที (offset: before | after)
const EVENTS = [
  {
    key: 'checkInReminder',
    label: 'เตือนลงเวลาเข้างาน (นาทีก่อนถึงเวลาเริ่มงาน)',
    desc: 'ส่งก่อนถึงเวลาเริ่มงานตามรอบการทำงานของผู้ใช้ หากยังไม่ลงเวลาเข้างาน',
    offset: 'before',
    minutes: 15,
  },
  {
    key: 'checkOutReminder',
    label: 'เตือนลงเวลาออกงาน (นาทีหลังเวลาเลิกงาน)',
    desc: 'ส่งหลังเวลาเลิกงานตามรอบการทำงานของผู้ใช้ หากยังไม่ลงเวลาออกงาน',
    offset: 'after',
    minutes: 10,
  },
  { key: 'requestSubmitted', label: 'มีคำขอลงเวลารออนุมัติ', desc: 'แจ้งผู้อนุมัติเมื่อมีคำขอลงเวลาใหม่' },
  { key: 'requestResult', label: 'ผลการอนุมัติคำขอลงเวลา', desc: 'แจ้งผู้ขอเมื่อคำขอได้รับอนุมัติหรือไม่อนุมัติ' },
  { key: 'leaveResult', label: 'ผลการอนุมัติการลา', desc: 'แจ้งผู้ขอเมื่อใบลาได้รับอนุมัติหรือไม่อนุมัติ' },
];

//const OFFSET_LABEL = { before: 'นาทีก่อนถึงรอบการทำงาน', after: 'นาทีหลังเวลาเลิกงาน' };

const DEFAULTS = {
  enabled: true,
  channelId: '',
  channelSecret: '',
  accessToken: '',
  testUserId: '',
  events: Object.fromEntries(EVENTS.map((e) => [e.key, { on: true, minutes: e.minutes ?? null }])),
};

// ค่าที่บันทึกล่าสุด (คงอยู่ระหว่างเปลี่ยนหน้า)
let savedSettings = { ...DEFAULTS };

export default function LineOAPage() {
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);
  const [testing, setTesting] = useState(false);
  const [sending, setSending] = useState(false);
  const enabled = Form.useWatch('enabled', form) ?? savedSettings.enabled;

  const handleTest = () =>
    form
      .validateFields(['channelId', 'channelSecret', 'accessToken'])
      .then(() => {
        setTesting(true);
        setTimeout(() => {
          setTesting(false);
          message.success('เชื่อมต่อ LINE Messaging API สำเร็จ (จำลอง)');
        }, 1200);
      })
      .catch(() => message.error('กรุณากรอกข้อมูล Channel ให้ครบก่อนทดสอบ'));

  const handleSendTest = () =>
    form
      .validateFields(['testUserId'])
      .then(() => {
        setSending(true);
        setTimeout(() => {
          setSending(false);
          message.success('ส่งข้อความทดสอบแล้ว (จำลอง)');
        }, 1000);
      })
      .catch(() => {});

  const handleSave = () =>
    form
      .validateFields()
      .then((values) => {
        savedSettings = { ...savedSettings, ...values };
        setDirty(false);
        message.success('บันทึกการตั้งค่า LINE OA แล้ว (ต้นแบบ)');
      })
      .catch(() => message.error('กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้อง'));

  const handleCancel = () => {
    form.resetFields();
    form.setFieldsValue(savedSettings);
    setDirty(false);
  };

  const copyWebhook = () =>
    navigator.clipboard
      ?.writeText(WEBHOOK_URL)
      .then(() => message.success('คัดลอก Webhook URL แล้ว'))
      .catch(() => message.error('คัดลอกไม่สำเร็จ'));

  const required = (label) => [{ required: enabled, whitespace: true, message: `กรุณาระบุ ${label}` }];

  const eventColumns = [
    {
      title: 'เปิด',
      key: 'on',
      align: 'center',
      width: 80,
      render: (_, e) => (
        <Form.Item name={['events', e.key, 'on']} valuePropName="checked" noStyle>
          <Switch size="small" disabled={!enabled} />
        </Form.Item>
      ),
    },
    {
      title: 'การแจ้งเตือน',
      key: 'label',
      render: (_, e) => (
        <div>
          <Text strong>{e.label}</Text>
          <span className="cfg-hint">{e.desc}</span>
        </div>
      ),
    },
    {
      title: 'เวลาส่ง',
      key: 'minutes',
      align: 'center',
      width: 260,
      render: (_, e) =>
        e.offset ? (
          <Space size={8}>
            <Form.Item name={['events', e.key, 'minutes']} noStyle>
              <InputNumber min={1} max={120} precision={0} disabled={!enabled} style={{ width: 72 }} />
            </Form.Item>
            
          </Space>
        ) : (
          <Text type="secondary">ทันที</Text>
        ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .cfg-card .ant-card-head-title { white-space: normal; }
        .cfg-form .ant-form-item { margin-bottom: 20px; }
        .cfg-form .ant-form-item-label > label { font-weight: 500; }
        .cfg-form .ant-form-item-label { line-height: 1.3; }
        .cfg-section { font-weight: 600; color: var(--navy-1); margin: 8px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-soft); }
        .cfg-hint { display: block; font-size: 12px; color: var(--text-muted); }
        .cfg-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--border-soft); }
        .cfg-actions .ant-btn { min-width: 120px; height: 38px; }
        @media (max-width: 767.98px) { .cfg-form .ant-form-item-label { text-align: left; } }
      `}</style>

      <Card
        className="cfg-card"
        title={
          <div style={{ lineHeight: 1.35, padding: '4px 0' }}>
            <Text style={{ color: 'var(--white)', fontSize: 16, fontWeight: 'bold', display: 'block' }}>ตั้งค่าการแจ้งเตือน LINE OA</Text>
            <Text style={{ color: 'var(--gold-pale)', fontSize: 12.5, fontWeight: 400 }}>
              เชื่อมต่อ LINE Official Account (Messaging API) เพื่อส่งข้อความแจ้งเตือนถึงผู้ใช้งาน
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
          <Form.Item label="เปิดใช้งานการแจ้งเตือน" name="enabled" valuePropName="checked">
            <Switch checkedChildren="เปิด" unCheckedChildren="ปิด" />
          </Form.Item>

          {!enabled && (
            <Alert type="warning" showIcon style={{ marginBottom: 20 }} message="ปิดการแจ้งเตือนผ่าน LINE OA อยู่ ระบบจะไม่ส่งข้อความใดๆ" />
          )}

          <div className="cfg-section">ข้อมูล Channel (LINE Developers Console)</div>

          <Form.Item label="Channel ID" required={enabled}>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="channelId" noStyle rules={required('Channel ID')}>
                <Input placeholder="เช่น 1234567890" autoComplete="off" disabled={!enabled} />
              </Form.Item>
              <Button type="primary" icon={<ApiOutlined />} loading={testing} onClick={handleTest} disabled={!enabled}>
                ทดสอบ
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="Channel Secret" name="channelSecret" rules={required('Channel Secret')}>
            <Input.Password placeholder="Channel Secret" autoComplete="new-password" disabled={!enabled} />
          </Form.Item>

          <Form.Item label="Channel Access Token" name="accessToken" rules={required('Channel Access Token')}>
            <Input.Password placeholder="Long-lived Channel Access Token" autoComplete="new-password" disabled={!enabled} />
          </Form.Item>

          <Form.Item label="Webhook URL" extra="นำ URL นี้ไปตั้งค่าในหัวข้อ Messaging API ของ LINE Developers Console">
            <Space.Compact style={{ width: '100%' }}>
              <Input value={WEBHOOK_URL} readOnly />
              <Button icon={<CopyOutlined />} onClick={copyWebhook}>คัดลอก</Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="ทดสอบส่งข้อความ" extra="ระบุ LINE User ID ของผู้รับ (ขึ้นต้นด้วย U)">
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name="testUserId"
                noStyle
                rules={[{ pattern: /^U[0-9a-f]{32}$/i, message: 'รูปแบบ LINE User ID ไม่ถูกต้อง' }]}
              >
                <Input placeholder="Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" autoComplete="off" disabled={!enabled} />
              </Form.Item>
              <Button icon={<SendOutlined />} loading={sending} onClick={handleSendTest} disabled={!enabled}>
                ส่งทดสอบ
              </Button>
            </Space.Compact>
          </Form.Item>

          <div className="cfg-section">เหตุการณ์ที่แจ้งเตือน</div>

          <Table
            rowKey="key"
            dataSource={EVENTS}
            columns={eventColumns}
            bordered
            size="middle"
            pagination={false}
            scroll={{ x: 680 }}
          />

          <Form.Item label=" " colon={false} style={{ marginTop: 8 }}>
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
