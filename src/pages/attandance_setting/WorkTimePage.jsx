import React, { useState } from 'react';
import { 
  Card, Row, Col, Button, Select, Input, Table, Space, Typography, 
  Tooltip, Popconfirm, message, Modal, Form, Radio, Checkbox, Divider 
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  ClockCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  DownOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

export default function WorkTimePage() {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      index: 1,
      code: 'DH1',
      name: 'ตารางการทำงาน 1',
      department: 'สำนักเลขาธิการ',
      workFormat: 'ตารางการทำงานปกติ',
      timeIn: '07:30',
      timeOut: '15:30',
      breakStart: '12:00',
      breakEnd: '13:00',
      workDays: 'จันทร์, อังคาร, พุธ, พฤหัสบดี, ศุกร์',
      allowedLate: '0',
      allowedAbsence: '0',
    },
    {
      key: '2',
      index: 2,
      code: 'DH2',
      name: 'ตารางการทำงาน 2',
      department: 'สำนักเลขาธิการ',
      workFormat: 'ตารางการทำงานปกติ',
      timeIn: '08:30',
      timeOut: '16:30',
     breakStart: '12:00',
      breakEnd: '13:00',
      workDays: 'จันทร์, อังคาร, พุธ, พฤหัสบดี, ศุกร์',
      allowedLate: '0',
      allowedAbsence: '0',
    },
    {
      key: '3',
      index: 3,
      code: 'DH3',
      name: 'ตารางการทำงาน 3',
      department: 'สำนักเลขาธิการ',
      workFormat: 'กำหนด ชม. การทำงาน',
      timeIn: '8 ชม.',
      timeOut: '-',
      breakStart: '-',
      breakEnd: '-',
      workDays: 'จันทร์, อังคาร, พุธ, พฤหัสบดี, ศุกร์',
      allowedLate: '-',
      allowedAbsence: '0',
    },
    {
      key: '4',
      index: 4,
      code: 'DH4',
      name: 'กะดึก',
      department: 'กองสารสนเทศ',
      workFormat: 'กะงาน',
      timeIn: '16:30',
      timeOut: '00:30',
      breakStart: '-',
      breakEnd: '-',
      workDays: 'ทุกวัน',
      allowedLate: '0',
      allowedAbsence: '0',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [workFormatType, setWorkFormatType] = useState('ตารางการทำงานปกติ');
  const [form] = Form.useForm();

  // เปิด Modal เพิ่มข้อมูล (Default เป็น ตารางการทำงานปกติ)
  const handleAddClick = () => {
    setModalMode('add');
    form.resetFields();
    setWorkFormatType('ตารางการทำงานปกติ');
    form.setFieldsValue({
      workFormat: 'ตารางการทำงานปกติ',
      breakType: 'none',
      halfDayLeave: '0.5',
      deductType: '1',
    });
    setIsModalOpen(true);
  };

  // เปิด Modal แก้ไขข้อมูล
  const handleEditClick = (record) => {
    setModalMode('edit');
    const currentFormat = record.workFormat || 'ตารางการทำงานปกติ';
    setWorkFormatType(currentFormat);

    form.setFieldsValue({
      code: record.code,
      name: record.name,
      department: record.department,
      workFormat: currentFormat,
      timeIn: currentFormat === 'กำหนด ชม. การทำงาน' ? '' : record.timeIn,
      timeOut: currentFormat === 'กำหนด ชม. การทำงาน' ? '' : record.timeOut,
      workHours: currentFormat === 'กำหนด ชม. การทำงาน' ? record.timeIn.replace(' ชม.', '') : '',
      breakType: record.breakStart === '-' ? 'none' : 'custom',
      breakStart: record.breakStart === '-' ? '' : record.breakStart,
      breakEnd: record.breakEnd === '-' ? '' : record.breakEnd,
      allowedLate: record.allowedLate === '-' ? '' : record.allowedLate,
      allowedAbsence: record.allowedAbsence === '-' ? '' : record.allowedAbsence,
    });
    setIsModalOpen(true);
  };

  // บันทึกข้อมูลจาก Modal
  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      const isHourFormat = values.workFormat === 'กำหนด ชม. การทำงาน';
      
      if (modalMode === 'add') {
        const newRecord = {
          key: String(dataSource.length + 1),
          index: dataSource.length + 1,
          code: values.code || '-',
          name: values.name || '-',
          department: values.department || 'สำนักเลขาธิการ',
          workFormat: values.workFormat || 'ตารางการทำงานปกติ',
          timeIn: isHourFormat ? `${values.workHours || '8'} ชม.` : (values.timeIn || '08:00'),
          timeOut: isHourFormat ? '-' : (values.timeOut || '17:00'),
          breakStart: isHourFormat ? '-' : (values.breakStart || '-'),
          breakEnd: isHourFormat ? '-' : (values.breakEnd || '-'),
          workDays: 'จันทร์, อังคาร, พุธ, พฤหัสบดี, ศุกร์',
          allowedLate: isHourFormat ? '-' : (values.allowedLate || '0'),
          allowedAbsence: isHourFormat ? '-' : (values.allowedLate || '0'),
          
        };
        setDataSource([...dataSource, newRecord]);
        message.success('เพิ่มข้อมูลกะสำเร็จ');
      } else {
        message.success('แก้ไขข้อมูลกะสำเร็จ');
      }
      setIsModalOpen(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleDelete = (key) => {
    setDataSource(dataSource.filter(item => item.key !== key));
    message.success('ลบข้อมูลกะสำเร็จ');
  };

  const columns = [
    { title: 'ลำดับ', dataIndex: 'index', key: 'index', align: 'center', width: 70 },
    { 
      title: 'รหัสตารางการทำงาน', 
      dataIndex: 'code', 
      key: 'code', 
      render: (text) => <a style={{ fontWeight: 'bold' }}>{text}</a> 
    },
    { 
      title: 'ชื่อตารางการทำงาน', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <a>{text}</a> 
    },
    { 
      title: 'หน่วยงาน', 
      dataIndex: 'department', 
      key: 'department' 
    },
    { 
      title: 'รูปแบบการลงเวลา', 
      dataIndex: 'workFormat', 
      key: 'workFormat',
      align: 'center',
    },
    { title: 'เข้างาน', dataIndex: 'timeIn', key: 'timeIn', align: 'center' },
    { title: 'ออกงาน', dataIndex: 'timeOut', key: 'timeOut', align: 'center' },
    /*{ title: 'เริ่มเวลาพัก', dataIndex: 'breakStart', key: 'breakStart', align: 'center' },
    { title: 'สิ้นสุดเวลาพัก', dataIndex: 'breakEnd', key: 'breakEnd', align: 'center' }, */
    { title: 'วันทำงาน', dataIndex: 'workDays', key: 'workDays' },
    /*{ title: 'เวลาที่ยอมให้สาย', dataIndex: 'allowedLate', key: 'allowedLate', align: 'center' },*/
    
    
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              style={{ color: '#1890ff', padding: 0 }} 
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Popconfirm title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?" onConfirm={() => handleDelete(record.key)} okText="ใช่" cancelText="ยกเลิก">
            <Button type="link" icon={<DeleteOutlined />} style={{ color: '#ff4d4f', padding: 0 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' ,textAlign: 'left'}}>
      
      <style>{`
        .ant-select, .ant-input-affix-wrapper, .ant-input {
          width: 100% !important;
        }
        .ant-select-selection-item, .ant-select-selection-search-input {
          text-align: left !important;
        }
        .filter-label {
          text-align: left !important;
          display: block !important;
          width: 100%;
        }
        .ant-table-thead > tr > th {
          text-align: center !important;
        }
      `}</style>

      {/* Card หลัก */}
      <Card 
        title={<Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>จัดการข้อมูลการลงเวลา</Text>}
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#1890ff' }} onClick={handleAddClick}>
            เพิ่ม
          </Button>
        }
      >
        {/* ส่วนฟิลเตอร์ค้นหา */}
        <div style={{ padding: '16px 0', marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Space orientation="vertical" style={{ width: '100%', alignItems: 'flex-start' }}>
                <Text className="filter-label">หน่วยงาน :</Text>
                <Select defaultValue="all">
                  <Option value="all">ทั้งหมด</Option>
                  <Option value="sec">สำนักเลขาธิการ</Option>
                  <Option value="general">กองบริหารงานทั่วไป</Option>
                  <Option value="central">กองกลาง</Option>
                  <Option value="it">กองสารสนเทศ</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space orientation="vertical" style={{ width: '100%', alignItems: 'flex-start' }}>
                <Text className="filter-label">เข้างาน :</Text>
                <Input placeholder="เลือกเวลาเข้างาน" suffix={<ClockCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />} />
              </Space>
            </Col>
            <Col xs={24} md={8}>
              <Space orientation="vertical" style={{ width: '100%', alignItems: 'flex-start' }}>
                <Text className="filter-label">ออกงาน :</Text>
                <Input placeholder="เลือกเวลาออกงาน" suffix={<ClockCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />} />
              </Space>
            </Col>

            <Col xs={24} md={8}>
              <Space orientation="vertical" style={{ width: '100%', alignItems: 'flex-start' }}>
                <Text className="filter-label">ค้นหา :</Text>
                <Input placeholder="รหัสตารางการทำงาน, ชื่อตารางการทำงาน" />
              </Space>
            </Col>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type="primary" icon={<SearchOutlined />} style={{ padding: '0 32px', height: 38, backgroundColor: '#1890ff' }}>
              ค้นหา
            </Button>
          </div>
          </Row>

          
        </div>

        {/* ตารางแสดงผล */}
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          scroll={{ x: 1250 }}
          bordered
          size="middle"
        />
      </Card>

      {/* Popup Modal สำหรับ เพิ่ม / แก้ไข กะการทำงาน */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{modalMode === 'add' ? 'เพิ่มข้อมูลกะการทำงาน' : 'แก้ไขข้อมูลกะการทำงาน'}</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        width={900}
        okText="บันทึก"
        cancelText="ปิด"
        okButtonProps={{ style: { backgroundColor: '#1f2937' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          
          {/* หมวดที่ 1: เวลาในกะ */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #52c41a', paddingBottom: 6, marginBottom: 16 }}>
            <Text style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '15px' }}>เวลาในกะ</Text>
            <DownOutlined style={{ color: '#52c41a' }} />
          </div>

          <Row gutter={24}>
            <Col xs={24} md={14}>
              <Form.Item label="รหัสกะ :" name="code" rules={[{ required: true, message: 'กรุณากรอกรหัสกะ' }]}>
                <Input placeholder="ระบุรหัสกะ" style={{ backgroundColor: '#fffbe6' }} />
              </Form.Item>

              <Form.Item label="ชื่อกะ :" name="name" rules={[{ required: true, message: 'กรุณากรอกชื่อกะ' }]}>
                <Input placeholder="ระบุชื่อกะ" style={{ backgroundColor: '#fffbe6' }} />
              </Form.Item>

              <Form.Item label="หน่วยงาน :" name="department">
                <Select placeholder="เลือกหน่วยงาน">
                  <Option value="สำนักเลขาธิการ">สำนักเลขาธิการ</Option>
                  <Option value="กองบริหารงานทั่วไป">กองบริหารงานทั่วไป</Option>
                  <Option value="กองกลาง">กองกลาง</Option>
                  <Option value="กองสารสนเทศ">กองสารสนเทศ</Option>
                </Select>
              </Form.Item>

              <Form.Item label="รูปแบบการลงเวลา :" name="workFormat">
                <Select 
                  placeholder="เลือกรูปแบบการลงเวลา" 
                  onChange={(value) => setWorkFormatType(value)}
                >
                  <Option value="ตารางการทำงานปกติ">ตารางการทำงานปกติ</Option>
                  <Option value="กะงาน">กะงาน</Option>
                  <Option value="กำหนด ชม. การทำงาน">กำหนด ชม. การทำงาน</Option>
                </Select>
              </Form.Item>

              {/* เงื่อนไขแสดงฟิลด์ตามรูปแบบการลงเวลา */}
              {workFormatType === 'กำหนด ชม. การทำงาน' ? (
                <Form.Item 
                  label="จำนวนชั่วโมงการทำงาน :" 
                  name="workHours"
                  rules={[{ required: true, message: 'กรุณาระบุจำนวนชั่วโมง' }]}
                >
                  <Input 
                    placeholder="ระบุจำนวนชั่วโมง เช่น 8" 
                    addonAfter="ชั่วโมง" 
                    style={{ backgroundColor: '#fffbe6' }} 
                  />
                </Form.Item>
              ) : (
                <>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item label="เข้างาน :" name="timeIn">
                        <Input suffix={<ClockCircleOutlined />} placeholder="00:00" style={{ backgroundColor: '#fffbe6' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="ออกงาน :" name="timeOut">
                        <Input suffix={<ClockCircleOutlined />} placeholder="08:00" style={{ backgroundColor: '#fffbe6' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  

                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item label="เวลาเข้างานกรณีลาครึ่งวันเช้า :" name="breakStart">
                        <Input suffix={<ClockCircleOutlined />} placeholder="เวลาเข้างานกรณีลาครึ่งวันเช้า" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="เวลาออกงานกรณีลาครึ่งวันบ่าย :" name="breakEnd">
                        <Input suffix={<ClockCircleOutlined />} placeholder="เวลาเข้างานกรณีลาครึ่งวันบ่าย" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="เวลาที่อนุญาตให้สาย :" name="allowedLate">
                    <Input addonAfter="นาที" style={{ backgroundColor: '#fffbe6' }} />
                  </Form.Item>

                  <Form.Item label="เวลาที่สายจนขาด :" name="allowedAbsence">
                    <Input addonAfter="นาที" style={{ backgroundColor: '#fffbe6' }} />
                  </Form.Item>
                </>
              )}
            </Col>

            {/* คอลัมน์ขวา: วันทำงานในสัปดาห์ */}
            <Col xs={24} md={10}>
              <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>วันทำงานประจำสัปดาห์ :</Text>
                <Space direction="vertical" size={10}>
                  <Checkbox defaultChecked>อาทิตย์</Checkbox>
                  <Checkbox defaultChecked>จันทร์</Checkbox>
                  <Checkbox defaultChecked>อังคาร</Checkbox>
                  <Checkbox defaultChecked>พุธ</Checkbox>
                  <Checkbox defaultChecked>พฤหัสบดี</Checkbox>
                  <Checkbox defaultChecked>ศุกร์</Checkbox>
                  <Checkbox defaultChecked>เสาร์</Checkbox>
                </Space>
              </div>
            </Col>
          </Row>

          <Divider />

          

        </Form>
      </Modal>

    </div>
  );
}