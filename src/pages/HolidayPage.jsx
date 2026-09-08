import React, { useState } from 'react';
import { 
  Card, Row, Col, Button, Select, Input, Table, Space, Typography, 
  Tooltip, Popconfirm, message, Modal, Form, DatePicker 
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CloudDownloadOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

export default function HolidayPage() {
  // ข้อมูลจำลองวันหยุดนักขัตฤกษ์
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'วันขึ้นปีใหม่',
      date: '01/01/2569',
      group: 'วันหยุดพื้นฐาน / Typical Holiday Schedule',
      year: '2026',
    },
    {
      key: '2',
      name: 'วันหยุดพิเศษเพิ่มเติม',
      date: '02/01/2569',
      group: 'วันหยุดพื้นฐาน / Typical Holiday Schedule',
      year: '2026',
    },
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' หรือ 'edit'
  const [form] = Form.useForm();

  // การเลือกแถวในตาราง
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  // เปิด Modal เพิ่มข้อมูล
  const handleAddClick = () => {
    setModalMode('add');
    form.resetFields();
    form.setFieldsValue({
      group: 'วันหยุดพื้นฐาน / Typical Holiday Schedule',
    });
    setIsModalOpen(true);
  };

  // เปิด Modal แก้ไขข้อมูล
  const handleEditClick = (record) => {
    setModalMode('edit');
    form.setFieldsValue({
      group: record.group,
      name: record.name,
      date: dayjs(record.date, 'DD/MM/YYYY'),
    });
    setIsModalOpen(true);
  };

  // บันทึกข้อมูลจาก Modal
  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      const formattedDate = values.date ? values.date.format('DD/MM/YYYY') : '01/01/2569';
      
      if (modalMode === 'add') {
        const newRecord = {
          key: String(dataSource.length + 1),
          name: values.name,
          date: formattedDate,
          group: values.group,
          year: '2026',
        };
        setDataSource([...dataSource, newRecord]);
        message.success('เพิ่มวันหยุดนักขัตฤกษ์สำเร็จ');
      } else {
        message.success('แก้ไขวันหยุดนักขัตฤกษ์สำเร็จ');
      }
      setIsModalOpen(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  // ลบแถวเดี่ยว
  const handleDelete = (key) => {
    setDataSource(dataSource.filter(item => item.key !== key));
    message.success('ลบรายการสำเร็จ');
  };

  // ลบหลายรายการที่เลือก
  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('กรุณาเลือกรายการที่ต้องการลบ');
      return;
    }
    setDataSource(dataSource.filter(item => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
    message.success('ลบรายการที่เลือกสำเร็จ');
  };

  const columns = [
    { 
      title: 'ชื่อวันหยุด', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <a style={{ color: '#1890ff' }}>{text}</a> 
    },
    { 
      title: 'วันที่', 
      dataIndex: 'date', 
      key: 'date', 
      align: 'center',
      width: 180,
    },
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      width: 120,
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
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', textAlign: 'left'}}>
      
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
        title={<Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>วันหยุดนักขัตฤกษ์</Text>}
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        extra={
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#1890ff' }} onClick={handleAddClick}>
              เพิ่ม
            </Button>
            
          </Space>
        }
      >
        {/* ส่วนฟิลเตอร์การค้นหา */}
        <div style={{ padding: '24px 16px', marginBottom: 16, background: '#fff' }}>
          <Row gutter={[16, 16]} align="middle" justify="left">
            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Text className="filter-label">ประจำปี :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Select defaultValue="2026">
                <Option value="2026">2569</Option>
                <Option value="2025">2568</Option>
              </Select>
            </Col>
            <Col xs={24} md={10}></Col>

            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Text className="filter-label">กลุ่มวันหยุด :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Select defaultValue="typical">
                <Option value="typical">วันหยุดพื้นฐาน / Typical Holiday Schedule</Option>
              </Select>
            </Col>
            <Col xs={24} md={10}></Col>

            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Text className="filter-label">ค้นหา :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Input placeholder="ค้นหา" />
            </Col>
            <Col xs={24} md={10}></Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button type="primary" icon={<SearchOutlined />} style={{ padding: '0 32px', height: 38, backgroundColor: '#1f2937', borderColor: '#1f2937' }}>
              ค้นหา
            </Button>
          </div>
        </div>

        {/* ตารางแสดงผล */}
        <Table 
          rowSelection={rowSelection}
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          bordered
          size="middle"
        />
      </Card>

      {/* Popup Modal สำหรับ เพิ่ม / แก้ไข วันหยุด */}
      <Modal
        title={null}
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        footer={null}
        closable={false}
      >
        <Form form={form} layout="vertical" style={{ padding: '12px 0' }}>
          
          <Form.Item 
            label={<span style={{ fontWeight: '500' }}>กลุ่มวันหยุด <span style={{ color: 'red' }}>*</span> :</span>} 
            name="group"
            rules={[{ required: true, message: 'กรุณาเลือกกลุ่มวันหยุด' }]}
          >
            <Select placeholder="เลือกกลุ่มวันหยุด">
              <Option value="วันหยุดพื้นฐาน / Typical Holiday Schedule">วันหยุดพื้นฐาน / Typical Holiday Schedule</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label={<span style={{ fontWeight: '500' }}>ชื่อวันหยุด <span style={{ color: 'red' }}>*</span> :</span>} 
            name="name"
            rules={[{ required: true, message: 'กรุณากรอกชื่อวันหยุด' }]}
          >
            <Input.TextArea rows={3} placeholder="ระบุชื่อวันหยุด" />
          </Form.Item>

          <Form.Item 
            label={<span style={{ fontWeight: '500' }}>วันที่ <span style={{ color: 'red' }}>*</span> :</span>} 
            name="date"
            rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
          >
            <DatePicker format="DD/MM/YYYY" placeholder="DD/MM/YYYY" suffixIcon={<CalendarOutlined />} />
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Space size="middle">
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={handleModalSubmit}
                style={{ backgroundColor: '#1f2937', borderColor: '#1f2937', padding: '0 24px', height: 36 }}
              >
                บันทึก
              </Button>
              <Button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '0 24px', height: 36 }}
              >
                ยกเลิก
              </Button>
            </Space>
          </div>

        </Form>
      </Modal>

    </div>
  );
}