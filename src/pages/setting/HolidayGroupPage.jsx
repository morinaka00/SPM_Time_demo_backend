import { useState } from 'react';
import { 
  Card, Row, Col, Button, Input, Table, Space, Typography, 
  Tooltip, Popconfirm, message, Modal,Radio, Form} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function HolidayGroupPage() {
  // ข้อมูลจำลองวันหยุดนักขัตฤกษ์
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'วันหยุดพื้นฐาน / Typical Holiday Schedule',
      
    },
    {
      key: '2',
      name: 'วันหยุดสำหรับเจ้าหน้าที่ xxxx / Holiday For XXX',
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


  const columns = [
    { 
      title: 'ชื่อกลุ่มวันหยุด', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <a style={{ color: 'var(--navy-3)' }}>{text}</a> 
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
              style={{ color: 'var(--navy-3)', padding: 0 }} 
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Popconfirm title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?" onConfirm={() => handleDelete(record.key)} okText="ใช่" cancelText="ยกเลิก">
            <Button type="link" icon={<DeleteOutlined />} style={{ color: 'var(--danger)', padding: 0 }} />
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
        title={<Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>กลุ่มวันหยุดนักขัตฤกษ์</Text>}
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.08)' }}
        extra={
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
              เพิ่ม
            </Button>
            
          </Space>
        }
      >
        {/* ส่วนฟิลเตอร์การค้นหา */}
        <div style={{ padding: '24px 16px', marginBottom: 16, background: 'var(--surface)' }}>
          <Row gutter={[16, 16]} align="middle" justify="left">
            

            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Text className="filter-label">ค้นหา :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Input placeholder="ค้นหา" />
            </Col>
            <Col xs={24} md={10}></Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button type="primary" icon={<SearchOutlined />} style={{ padding: '0 32px', height: 38, backgroundColor: 'var(--navy-1)', borderColor: 'var(--navy-1)' }}>
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
            label={<span style={{ fontWeight: '500' }}>ชื่อกลุ่มวันหยุด <span style={{ color: 'red' }}>*</span> :</span>} 
            name="name"
            rules={[{ required: true, message: 'กรุณากรอกชื่อวันหยุด' }]}
          >
            <Input placeholder="ระบุชื่อกลุ่มวันหยุด" />
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
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Space size="middle">
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={handleModalSubmit}
                style={{ backgroundColor: 'var(--navy-1)', borderColor: 'var(--navy-1)', padding: '0 24px', height: 36 }}
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