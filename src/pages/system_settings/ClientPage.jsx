import { useState } from 'react';
import { Card, Form, InputNumber, Radio, Button, Space, Typography, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

// หน้า "ตั้งค่า การใช้งานของหน่วยงาน" — กำหนดค่าการลงเวลา และช่วงเวลาการขอทำรายการ
// ต้นแบบ: ค่าที่บันทึกเก็บในหน่วยความจำของหน้าเว็บ (refresh แล้วกลับเป็นค่าตั้งต้น) ยังไม่เชื่อม backend

const DEFAULTS = {
  lateDeductCount: 0,
  offsiteCheckIn: 'deny',
  photoOnsite: 'no',
  photoOffsite: 'no',
  photoSource: 'camera',
  photoOnAdjust: 'no',
  monthStartDay: 1,
  leaveBackDays: 0,
  requestBackDays: 0,
};

// ค่าที่บันทึกล่าสุด (คงอยู่ระหว่างเปลี่ยนหน้า)
let savedSettings = { ...DEFAULTS };

const REQUIRE_OPTIONS = [
  { value: 'yes', label: 'ต้องบันทึก' },
  { value: 'no', label: 'ไม่ต้องบันทึก' },
];

const BACK_DAYS_HINT = '0 หากไม่ต้องการระบุ, 1 หากต้องการให้ทำรายการในวัน (นับวันปัจจุบันเป็น 1)';

function Section({ children, second }) {
  return <div className={`cs-section${second ? ' second' : ''}`}>{children}</div>;
}

// ช่องตัวเลขพร้อมคำอธิบายด้านขวา (ล่างบนจอแคบ)
function NumberWithHint({ name, min = 0, max, hint, label, rules = [] }) {
  return (
    <Form.Item label={label} required={false}>
      <div className="cs-inline">
        <Form.Item
          name={name}
          noStyle
          rules={[{ required: true, message: `กรุณาระบุ${label}` }, ...rules]}
        >
          <InputNumber min={min} max={max} precision={0} style={{ width: 180 }} />
        </Form.Item>
        {hint && <Text type="secondary" className="cs-hint">* {hint}</Text>}
      </div>
    </Form.Item>
  );
}

export default function ClientPage() {
  const [form] = Form.useForm();
  const [dirty, setDirty] = useState(false);

  const handleSave = () =>
    form
      .validateFields()
      .then((values) => {
        savedSettings = { ...savedSettings, ...values };
        setDirty(false);
        message.success('บันทึกการตั้งค่าการใช้งานของหน่วยงานแล้ว (ต้นแบบ)');
      })
      .catch(() => message.error('กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้อง'));

  // ยกเลิก = คืนค่าที่บันทึกไว้ล่าสุด
  const handleCancel = () => {
    form.resetFields(); // ล้างสถานะ error
    form.setFieldsValue(savedSettings);
    setDirty(false);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .cs-section { display: flex; align-items: center; gap: 8px; margin: 8px 0 20px; padding-bottom: 10px; border-bottom: 1px solid var(--border); font-size: 15px; font-weight: 700; color: var(--text-dark); }
        .cs-section::before { content: ''; width: 3px; height: 16px; border-radius: 2px; background: var(--gold); }
        .cs-section.second { margin-top: 32px; }
        .cs-form .ant-form-item { margin-bottom: 18px; }
        .cs-form .ant-form-item-label > label { font-weight: 500; }
        .cs-inline { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 16px; }
        .cs-hint { font-size: 12.5px; }
        .cs-radio .ant-radio-wrapper { margin-inline-end: 20px; }
        .cs-divider { height: 1px; margin: 4px 0 22px; background: var(--border-soft); }
        @media (max-width: 767.98px) {
          .cs-form .ant-form-item-label { text-align: left; }
        }
      `}</style>

      <Card
        title={<Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>ตั้งค่า การใช้งานของหน่วยงาน</Text>}
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8 }}
      >
        <Form
          form={form}
          className="cs-form"
          layout="horizontal"
          labelCol={{ xs: { span: 24 }, md: { flex: '300px' } }}
          wrapperCol={{ xs: { span: 24 }, md: { flex: 1 } }}
          labelWrap
          colon
          initialValues={savedSettings}
          onValuesChange={() => setDirty(true)}
        >
          <Section>กำหนดค่าการลงเวลา</Section>

          <NumberWithHint
            name="lateDeductCount"
            label="หักขาดงาน 1 วันจากจำนวนสายในเดือน"
            hint="ใส่ 0 หากไม่ต้องการระบุ"
            max={31}
          />

          <div className="cs-divider" />

          <Form.Item label="อนุญาตให้ลงเวลานอกพิกัด">
            <div className="cs-inline">
              <Form.Item name="offsiteCheckIn" noStyle>
                <Radio.Group
                  className="cs-radio"
                  options={[
                    { value: 'allow', label: 'อนุญาต' },
                    { value: 'deny', label: 'ไม่อนุญาต' },
                    { value: 'reason', label: 'อนุญาตโดยระบุเหตุผล' },
                    { value: 'approval', label: 'ต้องผ่านการอนุมัติ' },
                  ]}
                />
              </Form.Item>
              <Text type="secondary" className="cs-hint">* สามารถขออนุมัติผ่านหน้าปฏิทินบนแอพ</Text>
            </div>
          </Form.Item>

          <Form.Item label="บันทึกภาพเมื่อลงเวลาในพิกัด" name="photoOnsite">
            <Radio.Group className="cs-radio" options={REQUIRE_OPTIONS} />
          </Form.Item>

          <Form.Item label="บันทึกภาพเมื่อลงเวลานอกพิกัด" name="photoOffsite">
            <Radio.Group className="cs-radio" options={REQUIRE_OPTIONS} />
          </Form.Item>

          <Form.Item label="แหล่งภาพสำหรับบันทึกเวลา" name="photoSource">
            <Radio.Group
              className="cs-radio"
              options={[
                { value: 'camera_gallery', label: 'กล้องและคลังภาพ (Camera & Gallery)' },
                { value: 'camera', label: 'กล้องเท่านั้น' },
              ]}
            />
          </Form.Item>

          <Form.Item label="บันทึกภาพเมื่อขอปรับปรุงเวลา" name="photoOnAdjust">
            <Radio.Group className="cs-radio" options={REQUIRE_OPTIONS} />
          </Form.Item>

          <Section second>ช่วงเวลาการขอทำรายการ</Section>

          <NumberWithHint
            name="monthStartDay"
            label="วันเริ่มรอบเดือนการทำงาน"
            min={1}
            max={31}
            hint="วันที่ 1–31 ของเดือน"
          />
          <NumberWithHint name="leaveBackDays" label="พนักงานลาย้อนหลังไม่เกิน (วัน)" hint={BACK_DAYS_HINT} max={365} />
          <NumberWithHint name="requestBackDays" label="พนักงานขอลงเวลาย้อนหลังไม่เกิน (วัน)" hint={BACK_DAYS_HINT} max={365} />

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Space size="middle" wrap style={{ justifyContent: 'center' }}>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ minWidth: 140, height: 38 }}>
                บันทึก
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel} disabled={!dirty} style={{ minWidth: 140, height: 38 }}>
                ยกเลิก
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}
