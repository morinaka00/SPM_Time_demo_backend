import { useMemo } from 'react';
import {
  Card, Row, Col, Button, Select, Input, Space, Typography, Form, DatePicker, Tag, Result, message,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  getUser, saveUser, isUsernameTaken, userFullName, getRoles, PREFIXES, LEVELS, STATUS_LABEL, STATUS_TAG,
} from './userData';

const { Text } = Typography;

// หน้า Add/Edit "ข้อมูลผู้ใช้งาน" — ดัดแปลงจากฟอร์ม "เพิ่มผู้ใช้ใหม่ / แก้ไขข้อมูลผู้ใช้งาน" ของต้นแบบ portal
// ไม่มี ?id = เพิ่มใหม่, มี ?id=<รหัส> = แก้ไข

const DATE_FORMAT = 'DD/MM/YYYY';
const toDay = (s) => (s ? dayjs(s) : null);
const fromDay = (d) => (d ? d.format('YYYY-MM-DD') : '');

function Section({ children, first }) {
  return <div className={`user-form-sep${first ? ' first' : ''}`}>{children}</div>;
}

export default function UserDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const user = id ? getUser(id) : null;
  const isEdit = Boolean(user);
  const [form] = Form.useForm();

  const initialValues = useMemo(
    () =>
      user
        ? { ...user, dateStart: toDay(user.dateStart), dateEnd: toDay(user.dateEnd) }
        : { prefix: 'นาย', level: 'ปฏิบัติการ', roleIds: [] },
    [user],
  );

  // สิทธิ์ที่ปิดใช้งานแล้วจะเลือกใหม่ไม่ได้ แต่ถ้าผู้ใช้มีอยู่เดิมยังแสดงไว้ (เหมือนต้นแบบ)
  const roleOptions = getRoles().filter((r) => r.active || user?.roleIds.includes(r.id)).map((r) => ({
    value: r.id,
    label: r.active ? r.name : `${r.name} (ไม่ใช้งาน)`,
  }));

  const goBack = () => navigate('/users/UserPage');

  const handleSave = () =>
    form
      .validateFields()
      .then((v) => {
        saveUser(id, {
          prefix: v.prefix || '',
          firstTh: v.firstTh.trim(),
          lastTh: v.lastTh.trim(),
          firstEn: (v.firstEn || '').trim(),
          lastEn: (v.lastEn || '').trim(),
          dept: (v.dept || '').trim(),
          worksite: (v.worksite || '').trim(),
          position: (v.position || '').trim(),
          level: v.level,
          email: v.email.trim(),
          phone: (v.phone || '').trim(),
          username: v.username.trim(),
          roleIds: v.roleIds || [],
          dateStart: fromDay(v.dateStart),
          dateEnd: fromDay(v.dateEnd),
        });
        message.success(isEdit ? 'บันทึกการแก้ไขข้อมูลผู้ใช้งานแล้ว' : 'เพิ่มผู้ใช้ใหม่แล้ว (สถานะ: รอการอนุมัติ)');
        goBack();
      })
      .catch(() => message.error('กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้อง'));

  // เปิดหน้าแก้ไขด้วย id ที่ไม่มีอยู่
  if (id && !user) {
    return (
      <Card style={{ maxWidth: 640, margin: '0 auto' }}>
        <Result
          status="404"
          title="ไม่พบข้อมูลผู้ใช้งาน"
          subTitle="ผู้ใช้งานนี้อาจถูกลบไปแล้ว"
          extra={<Button type="primary" onClick={goBack}>กลับไปหน้ารายการ</Button>}
        />
      </Card>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .user-form-sep { font-size: 14px; font-weight: 700; color: var(--text-dark); margin: 24px 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .user-form-sep.first { margin-top: 0; }
        .user-form-sep::before { content: ''; display: inline-block; width: 3px; height: 14px; margin-right: 8px; border-radius: 2px; background: var(--gold); vertical-align: -2px; }
        .user-form .ant-form-item-extra { font-size: 12px; }
      `}</style>

      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: 'var(--white)' }} onClick={goBack} aria-label="กลับ" />
            <Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>
              {isEdit ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้ใหม่'}
            </Text>
          </Space>
        }
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          <Text type="secondary">
            {isEdit ? `แก้ไขข้อมูลของ ${userFullName(user)} และกำหนดสิทธิ์การเข้าถึงระบบ` : 'กรอกข้อมูลผู้ใช้งานและกำหนดสิทธิ์การเข้าถึงระบบ'}
          </Text>
          {isEdit && (
            <span>
              <Text type="secondary">สถานะบัญชี: </Text>
              <Tag color={STATUS_TAG[user.status]}>{STATUS_LABEL[user.status]}</Tag>
            </span>
          )}
        </div>

        <Form form={form} layout="vertical" initialValues={initialValues} className="user-form" scrollToFirstError>
          <Section first>ข้อมูลส่วนตัว</Section>
          <Row gutter={16}>
            <Col xs={24} sm={6} md={4}>
              <Form.Item label="คำนำหน้า" name="prefix" rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้า' }]}>
                <Select options={PREFIXES.map((p) => ({ value: p, label: p }))} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={9} md={10}>
              <Form.Item label="ชื่อ ภาษาไทย" name="firstTh" rules={[{ required: true, whitespace: true, message: 'กรุณากรอกชื่อภาษาไทย' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={9} md={10}>
              <Form.Item label="นามสกุล ภาษาไทย" name="lastTh" rules={[{ required: true, whitespace: true, message: 'กรุณากรอกนามสกุลภาษาไทย' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={{ span: 9, offset: 6 }} md={{ span: 10, offset: 4 }}>
              <Form.Item label="ชื่อ ภาษาอังกฤษ" name="firstEn">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={9} md={10}>
              <Form.Item label="นามสกุล ภาษาอังกฤษ" name="lastEn">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Section>ข้อมูลหน่วยงาน</Section>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="หน่วยงาน/สังกัด" name="dept"><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="สถานที่ปฏิบัติงาน" name="worksite"><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="ตำแหน่งในสายงาน" name="position"><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="ระดับตำแหน่ง" name="level">
                <Select options={LEVELS.map((l) => ({ value: l, label: l }))} />
              </Form.Item>
            </Col>
          </Row>

          <Section>ข้อมูลติดต่อ</Section>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  { required: true, whitespace: true, message: 'กรุณากรอกอีเมล' },
                  { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' },
                ]}
              >
                <Input type="email" placeholder="name@opm.go.th" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="เบอร์โทรศัพท์" name="phone"><Input type="tel" /></Form.Item>
            </Col>
          </Row>

          <Section>บัญชีและสิทธิ์การใช้งาน</Section>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="ชื่อผู้ใช้งาน (Username)"
                name="username"
                extra="ใช้สำหรับเข้าสู่ระบบ (ไม่มีรหัสผ่าน — ยืนยันตัวตนด้วยรหัสที่ส่งไปยังอีเมลทุกครั้ง)"
                rules={[
                  { required: true, whitespace: true, message: 'กรุณากรอกชื่อผู้ใช้งาน (Username)' },
                  {
                    validator: (_, v) =>
                      v && isUsernameTaken(v.trim(), id)
                        ? Promise.reject(new Error('ชื่อผู้ใช้งานนี้มีในระบบแล้ว'))
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="สิทธิ์การใช้งาน (Role)"
                name="roleIds"
                extra="รายการมาจากเมนู &quot;จัดการสิทธิ์การใช้งาน&quot; · เลือกได้หลายสิทธิ์"
              >
                <Select mode="multiple" allowClear placeholder="เลือกสิทธิ์การใช้งาน" options={roleOptions} optionFilterProp="label" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="วันที่เริ่มใช้งาน" name="dateStart" extra="เว้นว่าง = เริ่มใช้งานได้ทันทีที่อนุมัติ">
                <DatePicker format={DATE_FORMAT} style={{ width: '100%' }} placeholder="เลือกวันที่" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="วันที่สิ้นสุดการใช้งาน"
                name="dateEnd"
                dependencies={['dateStart']}
                extra="เว้นว่าง = ไม่กำหนดวันสิ้นสุด (ตั้งล่วงหน้าได้)"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, v) {
                      const start = getFieldValue('dateStart');
                      return v && start && v.isBefore(start, 'day')
                        ? Promise.reject(new Error('วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มใช้งาน'))
                        : Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker format={DATE_FORMAT} style={{ width: '100%' }} placeholder="เลือกวันที่" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Space size="middle" wrap style={{ justifyContent: 'center' }}>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ minWidth: 140, height: 38 }}>
                บันทึกข้อมูล
              </Button>
              <Button onClick={goBack} style={{ minWidth: 140, height: 38 }}>
                ยกเลิก
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}
