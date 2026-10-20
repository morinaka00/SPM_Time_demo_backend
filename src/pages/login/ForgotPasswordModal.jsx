import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import OtpCodeInput from './OtpCodeInput';
import { maskEmail } from './otp';
import './ForgotPasswordModal.css';

// Popup "ตั้งค่ารหัสผ่าน" จากลิงก์ "ลืมรหัสผ่าน?" ในหน้า Login
//   ขั้นที่ 1 ยืนยันตัวตน: (ระบุชื่อผู้ใช้ ถ้ายังไม่ได้กรอกในหน้า Login) → กรอกรหัส OTP ที่ส่งทางอีเมล
//   ขั้นที่ 2 ตั้งรหัสผ่านใหม่: เปิดได้หลังยืนยัน OTP สำเร็จเท่านั้น
// ต้นแบบ: OTP อะไรก็ผ่าน และยังไม่บันทึกรหัสผ่านจริง

function StepLabel({ current }) {
  return (
    <p className="forgot-step">
      ขั้นที่ {current} จาก 2 · {current === 1 ? 'ยืนยันตัวตนด้วยรหัส OTP' : 'ตั้งรหัสผ่านใหม่'}
    </p>
  );
}

function Footer({ children }) {
  return <div className="forgot-footer">{children}</div>;
}

// ระบุชื่อผู้ใช้เพื่อส่ง OTP
function IdentifyStep({ onNext, onCancel }) {
  const [form] = Form.useForm();
  const submit = () => form.validateFields().then(({ username }) => onNext(username.trim()));

  return (
    <>
      <StepLabel current={1} />
      <p className="forgot-desc">กรอกชื่อผู้ใช้งาน ระบบจะส่งรหัส OTP ไปที่อีเมลที่ผูกกับบัญชีของท่าน</p>
      <Form form={form} layout="vertical" requiredMark={false} onFinish={submit}>
        <Form.Item
          label="ชื่อผู้ใช้งาน"
          name="username"
          rules={[{ required: true, whitespace: true, message: 'กรุณากรอกชื่อผู้ใช้งาน' }]}
        >
          <Input placeholder="ชื่อผู้ใช้งานของท่าน" autoComplete="username" autoFocus />
        </Form.Item>
        <button type="submit" hidden aria-hidden="true" />
      </Form>
      <Footer>
        <Button onClick={onCancel}>ยกเลิก</Button>
        <Button type="primary" onClick={submit}>ส่งรหัส OTP</Button>
      </Footer>
    </>
  );
}

// กรอก OTP (ใช้ชุดเดียวกับหน้า Login)
function OtpStep({ username, onVerified, onBack, onCancel }) {
  const email = maskEmail(username);
  return (
    <>
      <StepLabel current={1} />
      <p className="forgot-desc">
        เพื่อความปลอดภัย กรุณากรอกรหัส 6 หลักที่ส่งไปที่ <b>{email}</b> ของบัญชี <b>{username}</b>
      </p>
      <OtpCodeInput email={email} successText="ยืนยันตัวตนสำเร็จ กำลังไปขั้นตั้งรหัสผ่านใหม่..." onVerified={onVerified} />
      <Footer>
        {onBack && (
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            เปลี่ยนชื่อผู้ใช้งาน
          </Button>
        )}
        <Button onClick={onCancel}>ยกเลิก</Button>
      </Footer>
    </>
  );
}

// ตั้งรหัสผ่านใหม่ (หน้าตาตามภาพตัวอย่าง)
function ResetStep({ onDone, onCancel }) {
  const [form] = Form.useForm();
  const submit = () =>
    form.validateFields().then(() => {
      message.success('ตั้งค่ารหัสผ่านใหม่เรียบร้อยแล้ว (ต้นแบบ)');
      onDone();
    });

  return (
    <>
      <StepLabel current={2} />
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: '150px' }}
        wrapperCol={{ flex: 1 }}
        labelAlign="right"
        colon
        onFinish={submit}
        className="forgot-form"
      >
        <Form.Item
          label="รหัสผ่านใหม่"
          name="newPassword"
          rules={[{ required: true, message: 'กรุณากรอกรหัสผ่านใหม่' }]}
        >
          <Input.Password autoComplete="new-password" autoFocus />
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
                  : Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        {/* ให้กด Enter แล้วยืนยันได้ */}
        <button type="submit" hidden aria-hidden="true" />
      </Form>
      <Footer>
        <Button onClick={onCancel}>ยกเลิก</Button>
        <Button type="primary" onClick={submit}>ยืนยัน</Button>
      </Footer>
    </>
  );
}

// เนื้อหาใน popup — mount ใหม่ทุกครั้งที่เปิด จึงเริ่มขั้นแรกเสมอ
function ForgotFlow({ initialUsername, onClose }) {
  const [username, setUsername] = useState(initialUsername || '');
  const [step, setStep] = useState(initialUsername ? 'otp' : 'identify');

  if (step === 'identify') {
    return (
      <IdentifyStep
        onCancel={onClose}
        onNext={(u) => {
          setUsername(u);
          setStep('otp');
        }}
      />
    );
  }
  if (step === 'otp') {
    return (
      <OtpStep
        username={username}
        onCancel={onClose}
        onBack={() => setStep('identify')}
        onVerified={() => setStep('reset')}
      />
    );
  }
  return <ResetStep onCancel={onClose} onDone={onClose} />;
}

export default function ForgotPasswordModal({ open, username, onClose }) {
  return (
    <Modal
      className="forgot-modal"
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      destroyOnHidden
      maskClosable={false}
      title={
        <span className="forgot-title">
          <LockOutlined /> ตั้งค่ารหัสผ่าน
        </span>
      }
    >
      <ForgotFlow initialUsername={username} onClose={onClose} />
    </Modal>
  );
}
