import React, { useState } from 'react';
import { 
  Card, Row, Col, Button, Select, Input, Table, Space, Typography, 
  Tooltip, Popconfirm, message, Modal, Form, Radio, Tag 
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

export default function LocationPage() {
  // ข้อมูลจำลองสถานที่ลงเวลา
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'อาคาร สลน 1.',
      creator: 'นาย สมชาย ใจดี',
      distance: '15 เมตร',
      updater: 'นาย สมชาย ใจดี',
      updateDate: '24/08/2026 10:30',
      status: 'ใช้งาน',
    },
    {
      key: '2',
      name: 'อาคาร xxxx',
      creator: 'นาย วิชัย รักงาน',
      distance: '15 เมตร',
      updater: 'นาย วิชัย รักงาน',
      updateDate: '20/08/2026 14:15',
      status: 'ไม่ใช้งาน',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' หรือ 'edit'
  const [form] = Form.useForm();

  // เปิด Modal เพิ่มข้อมูล
  const handleAddClick = () => {
    setModalMode('add');
    form.resetFields();
    form.setFieldsValue({
      status: 'ใช้งาน',
      distance: '5',
    });
    setIsModalOpen(true);
  };

  // เปิด Modal แก้ไขข้อมูล
  const handleEditClick = (record) => {
    setModalMode('edit');
    form.setFieldsValue({
      name: record.name,
      distance: record.distance.replace(' เมตร', ''),
      status: record.status,
    });
    setIsModalOpen(true);
  };

  // บันทึกข้อมูลจาก Modal
  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      const distanceText = `${values.distance || '100'} เมตร`;
      const currentDate = '24/08/2026 13:30';

      if (modalMode === 'add') {
        const newRecord = {
          key: String(dataSource.length + 1),
          name: values.name,
          creator: 'นาย กิตติ ภูมิใจ',
          distance: distanceText,
          updater: 'นาย กิตติ ภูมิใจ',
          updateDate: currentDate,
          status: values.status,
        };
        setDataSource([...dataSource, newRecord]);
        message.success('เพิ่มสถานที่ลงเวลาสำเร็จ');
      } else {
        message.success('แก้ไขสถานที่ลงเวลาสำเร็จ');
      }
      setIsModalOpen(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // ลบข้อมูล
  const handleDelete = (key) => {
    setDataSource(dataSource.filter(item => item.key !== key));
    message.success('ลบสถานที่ลงเวลาสำเร็จ');
  };

  const columns = [
    { 
      title: 'ชื่อสถานที่', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <a style={{ color: '#1890ff', fontWeight: 'bold' }}>{text}</a> 
    },
    { 
      title: 'ผู้สร้าง', 
      dataIndex: 'creator', 
      key: 'creator',
    },
    { 
      title: 'ระยะการลงเวลา', 
      dataIndex: 'distance', 
      key: 'distance', 
      align: 'center',
    },
    { 
      title: 'ผู้อัพเดต', 
      dataIndex: 'updater', 
      key: 'updater',
    },
    { 
      title: 'วันที่อัพเดต', 
      dataIndex: 'updateDate', 
      key: 'updateDate', 
      align: 'center',
    },
    { 
      title: 'สถานะ', 
      dataIndex: 'status', 
      key: 'status', 
      align: 'center',
      render: (status) => (
        <Tag color={status === 'ใช้งาน' ? 'success' : 'error'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
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
        .filter-label {
          text-align: right !important;
          display: block !important;
          padding-right: 8px;
        }
        .ant-table-thead > tr > th {
          text-align: center !important;
        }
      `}</style>

      {/* Card หลัก */}
      <Card 
        title={<Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>สถานที่ลงเวลา</Text>}
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#1890ff' }} onClick={handleAddClick}>
              เพิ่ม
            </Button>
        }
      >
        {/* ส่วน Filter */}
        <div style={{ padding: '24px 16px', marginBottom: 16, background: '#fff' }}>
          <Row gutter={[16, 16]} align="middle" justify="center">
            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Text className="filter-label">สถานะ :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Select defaultValue="all" placeholder="เลือกสถานะ">
                <Option value="all">ทั้งหมด</Option>
                <Option value="active">ใช้งาน</Option>
                <Option value="inactive">ไม่ใช้งาน</Option>
              </Select>
            </Col>
            <Col xs={24} md={10}></Col>

            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Text className="filter-label">ค้นหา :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Input placeholder="ค้นหาชื่อสถานที่" />
            </Col>
            <Col xs={24} md={10}></Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#1890ff' }}>
              ค้นหา
            </Button>
          </div>
        </div>

        {/* ตารางแสดงผล Grid */}
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          bordered
          size="middle"
        />
      </Card>

      {/* Popup Modal สำหรับ เพิ่ม / แก้ไข สถานที่ */}
      <Modal
        title={
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {modalMode === 'add' ? 'เพิ่มสถานที่ลงเวลา' : 'แก้ไขสถานที่ลงเวลา'}
          </div>
        }
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        width={650}
        okText="บันทึก"
        cancelText="ยกเลิก"
        okButtonProps={{ style: { backgroundColor: '#1f2937', borderColor: '#1f2937' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          
          <Form.Item 
            label={<span style={{ fontWeight: '500' }}>ชื่อสถานที่ <span style={{ color: 'red' }}>*</span> :</span>} 
            name="name"
            rules={[{ required: true, message: 'กรุณากรอกชื่อสถานที่' }]}
          >
            <Input placeholder="ระบุชื่อสถานที่" />
          </Form.Item>

          <Form.Item label={<span style={{ fontWeight: '500' }}>Location :</span>}>
            <Button 
              icon={<EnvironmentOutlined style={{ color: '#ea4335' }} />} 
              onClick={() => message.info('เปิดหน้าต่าง Google Maps สำเร็จ')}
              style={{ width: '100%', textAlign: 'left', height: '40px', borderColor: '#d9d9d9' }}
            >
              ปักหมุดตำแหน่งบน Google Maps
            </Button>
          </Form.Item>

          <Form.Item 
            label={<span style={{ fontWeight: '500' }}>ระยะการลงเวลา <span style={{ color: 'red' }}>*</span> :</span>} 
            name="distance"
            rules={[{ required: true, message: 'กรุณาระบุระยะการลงเวลา' }]}
          >
            <Input addonAfter="เมตร" placeholder="เช่น 100" />
          </Form.Item>

          <Form.Item 
            label={<span style={{ fontWeight: '500' }}>สถานะ <span style={{ color: 'red' }}>*</span> :</span>} 
            name="status"
            rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
          >
            <Radio.Group>
              <Radio value="ใช้งาน">ใช้งาน</Radio>
              <Radio value="ไม่ใช้งาน">ไม่ใช้งาน</Radio>
            </Radio.Group>
          </Form.Item>

        </Form>
      </Modal>

    </div>
  );
}