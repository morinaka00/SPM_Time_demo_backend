import React, { useState } from 'react';
import { 
  Card, Row, Col, Button, Select, Space, Typography, 
  Form, Avatar, Divider, DatePicker, Upload, message 
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserOutlined, 
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const availableStaffList = [
  { id: '41066', name: 'นาย xxx ใจดี', role: 'เจ้าหน้าที่บุคคล' },
  { id: '40914', name: 'นาย xxx มั่นคง', role: 'เจ้าหน้าที่บุคคล' },
  { id: '40822', name: 'นาย xxx รักสงบ', role: 'เจ้าหน้าที่บุคคล' },
  { id: '40755', name: 'นางสาว สมหญิง จริงใจ', role: 'เจ้าหน้าที่บุคคล' },
];

export default function WorkCycleDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'add';

  const [selectedStaffs, setSelectedStaffs] = useState([
    availableStaffList[0], availableStaffList[1], availableStaffList[2]
  ]);
  const [currentSelectedId, setCurrentSelectedId] = useState(null);
  const [form] = Form.useForm();

  // ฟังก์ชันเพิ่มเจ้าหน้าที่จาก Dropdown เมื่อกดปุ่ม Add
  const handleAddStaff = () => {
    if (!currentSelectedId) {
      message.warning('กรุณาเลือกเจ้าหน้าที่ก่อนกดเพิ่ม');
      return;
    }
    const staff = availableStaffList.find(s => s.id === currentSelectedId);
    if (staff && !selectedStaffs.some(s => s.id === currentSelectedId)) {
      setSelectedStaffs([...selectedStaffs, staff]);
      setCurrentSelectedId(null); // เคลียร์ค่าหลังเพิ่ม
      message.success('เพิ่มเจ้าหน้าที่สำเร็จ');
    } else {
      message.info('เจ้าหน้าที่ท่านนี้ถูกเลือกไปแล้ว');
    }
  };

  const handleRemoveStaff = (staffId) => {
    setSelectedStaffs(selectedStaffs.filter(s => s.id !== staffId));
  };

  const handleSave = () => {
    form.validateFields().then(() => {
      message.success(mode === 'add' ? 'เพิ่มรอบการทำงานสำเร็จ' : 'แก้ไขรอบการทำงานสำเร็จ');
      navigate(-1); // กลับไปหน้าก่อนหน้า (หน้าตาราง)
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', textAlign: 'left' }}>
      <Card 
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: '#fff' }} onClick={() => navigate(-1)} />
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              {mode === 'add' ? 'เพิ่มรอบการทำงาน (workCycleDetails)' : 'แก้ไขรอบการทำงาน (workCycleDetails)'}
            </Text>
          </Space>
        }
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            {/* Panel ซ้าย: ฟอร์มข้อมูล */}
            <Col xs={24} md={12}>
              <Card style={{ background: '#f9fafb', height: '100%' }} bordered={false}>
                <Title level={5} style={{ marginBottom: 20, textAlign: 'left' }}>ข้อมูลรอบการทำงาน</Title>
                
                <Form.Item label="หน่วยงาน" name="department" rules={[{ required: true, message: 'กรุณาเลือกหน่วยงาน' }]}>
                  <Select placeholder="เลือกหน่วยงาน" style={{ textAlign: 'left' }}>
                    <Option value="สำนักเลขาธิการ">สำนักเลขาธิการ</Option>
                    <Option value="กองบริหารงานทั่วไป">กองบริหารงานทั่วไป</Option>
                    <Option value="กองสารสนเทศ">กองสารสนเทศ</Option>
                  </Select>
                </Form.Item>

                {/* ข้อ 1: RangePicker แบบไม่เอาเวลา */}
                <Form.Item label="ช่วงวันที่ (เริ่มต้น - สิ้นสุด)" name="dateRange" rules={[{ required: true, message: 'กรุณาเลือกช่วงวันที่' }]}>
                  <RangePicker format="DD/MM/YYYY" placeholder={['เริ่มต้น', 'สิ้นสุด']} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="รหัสเวลาการทำงาน" name="workTimeCode" rules={[{ required: true, message: 'กรุณาเลือกรหัสเวลาการทำงาน' }]}>
                  <Select placeholder="เลือกรหัสเวลาการทำงาน">
                    <Option value="1 (กะปกติ)">1 (กะปกติ)</Option>
                    <Option value="DH3 (กะเช้าพิเศษ)">DH3 (กะเช้าพิเศษ)</Option>
                    <Option value="DS (กะบ่าย)">DS (กะบ่าย)</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="กลุ่มวันหยุด" name="holidayGroup" rules={[{ required: true, message: 'กรุณาเลือกกลุ่มวันหยุด' }]}>
                  <Select placeholder="เลือกกลุ่มวันหยุด">
                    <Option value="วันหยุดพื้นฐาน">วันหยุดพื้นฐาน</Option>
                    <Option value="วันหยุดพิเศษ">วันหยุดพิเศษ</Option>
                  </Select>
                </Form.Item>

                {/* ข้อ 2: เพิ่ม Attatch Document ก่อน label จำนวนคน */}
                <Form.Item label="แนบเอกสาร" name="document">
                  <Upload beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />} style={{ width: '100%', textAlign: 'left' }}>
                      เลือกไฟล์เอกสารประกอบ
                    </Button>
                  </Upload>
                </Form.Item>

                <Form.Item label="จำนวนเจ้าหน้าที่ xxx คน">
                  
                </Form.Item>
              </Card>
            </Col>

            {/* Panel ขวา: เลือกและแสดง Card เจ้าหน้าที่ */}
            <Col xs={24} md={12}>
              <Card style={{ background: '#f9fafb', height: '100%' }} bordered={false}>
                <Title level={5} style={{ marginBottom: 20, textAlign: 'left' }}>รายชื่อเจ้าหน้าที่ในรอบการทำงาน</Title>

                {/* ข้อ 3: Dropdown บุคลากรเพิ่มปุ่ม Add ข้างหลัง */}
                <Form.Item label="เลือกเจ้าหน้าที่เข้าสู่ระบบ">
                  <Space.Compact style={{ width: '100%' }}>
                    <Select 
                      placeholder="-- ค้นหาและเลือกเจ้าหน้าที่ --" 
                      value={currentSelectedId}
                      onChange={(value) => setCurrentSelectedId(value)}
                      showSearch
                      optionFilterProp="children"
                      style={{ width: 'calc(100% - 90px)', textAlign: 'left' }}
                    >
                      {availableStaffList.map(staff => (
                        <Option key={staff.id} value={staff.id}>
                          {staff.name} ({staff.id}) - {staff.role}
                        </Option>
                      ))}
                    </Select>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleAddStaff}
                      style={{ width: '90px', backgroundColor: '#1f2937', borderColor: '#1f2937' }}
                    >
                      เพิ่ม
                    </Button>
                  </Space.Compact>
                </Form.Item>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                  {selectedStaffs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', padding: '30px 0' }}>
                      ยังไม่ได้เลือกเจ้าหน้าที่
                    </div>
                  ) : (
                    selectedStaffs.map(staff => (
                      <div 
                        key={staff.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          background: '#fff', 
                          padding: '12px 16px', 
                          marginBottom: '10px', 
                          borderRadius: '8px', 
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                          textAlign: 'left'
                        }}
                      >
                        <Space size="middle">
                          <Avatar size={44} icon={<UserOutlined />} style={{ backgroundColor: '#f0f2f5', color: '#595959' }} />
                          <div>
                            <Text style={{ fontWeight: 'bold', fontSize: '14px', display: 'block', textAlign: 'left' }}>
                              {staff.name} ({staff.id})
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px', textAlign: 'left' }}>
                              {staff.role}
                            </Text>
                          </div>
                        </Space>
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => handleRemoveStaff(staff.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Space size="middle">
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleSave}
                style={{ backgroundColor: '#1f2937', borderColor: '#1f2937', padding: '0 32px', height: 38 }}
              >
                บันทึก
              </Button>
              <Button 
                onClick={() => navigate(-1)}
                style={{ padding: '0 32px', height: 38 }}
              >
                ยกเลิก
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}