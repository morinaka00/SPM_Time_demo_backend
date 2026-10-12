import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, Input, Table, Switch, Typography, Space, Checkbox } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { Option } = Select;

export default function TermsConditionPage() {
  const navigate = useNavigate();

  // ข้อมูลจำลอง (Mock Data)
  const [dataSource, setDataSource] = useState([
    { key: '1', version: '1', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน', publishDate: '1 พ.ค. 2569', createDate: '-', acceptCount: 2, status: true },
    { key: '2', version: '2', title: 'เพิ่มเนื้อหาทดสอบ', publishDate: '21 พ.ค. 2569', createDate: '-', acceptCount: 2, status: false },
    { key: '3', version: '3', title: 'แก้ไขรายละเอียดข้อกำหนดและเงื่อนไข', publishDate: '15 มิ.ย. 2569', createDate: '-', acceptCount: 17, status: false },
    { key: '4', version: '4', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน 2', publishDate: '8 ก.ค. 2569', createDate: '-', acceptCount: 3, status: false },
    { key: '5', version: '5', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน เวอร์ชัน 2', publishDate: '10 ก.ค. 2569', createDate: '-', acceptCount: 3, status: false },
    { key: '6', version: '6', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน เวอร์ชัน 3', publishDate: '13 ก.ค. 2569', createDate: '-', acceptCount: 10, status: true },
    { key: '7', version: '7', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน เวอร์ชัน 4', publishDate: '20 ก.ค. 2569', createDate: '-', acceptCount: 9, status: true },
    { key: '8', version: '8', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน เวอร์ชัน 4 20 ก.ค. 2569', publishDate: '21 ก.ค. 2569', createDate: '-', acceptCount: 57, status: true },
    { key: '9', version: '9', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน1', publishDate: '7 ก.ย. 2569', createDate: '-', acceptCount: 21, status: true },
  ]);

  // ฟังก์ชันสลับสถานะเปิด/ปิดใช้งาน (Switch)
  const handleStatusChange = (key, checked) => {
    setDataSource(prev => 
      prev.map(item => item.key === key ? { ...item, status: checked } : item)
    );
  };

  // โครงสร้าง Columns ของตาราง
  const columns = [
    {
      title: <Checkbox />,
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      align: 'center',
      render: () => <Checkbox />
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      align: 'center',
      width: 90,
    },
    {
      title: 'หัวข้อ',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <a style={{ color: '#1890ff' }}>{text}</a>
    },
    {
      title: 'วันที่เริ่มเผยแพร่',
      dataIndex: 'publishDate',
      key: 'publishDate',
      align: 'center',
      width: 150,
    },
    {
      title: 'วันที่สร้าง',
      dataIndex: 'createDate',
      key: 'createDate',
      align: 'center',
      width: 120,
    },
    {
      title: 'รายชื่อผู้ยอมรับเงื่อนไข',
      dataIndex: 'acceptCount',
      key: 'acceptCount',
      align: 'center',
      width: 160,
      render: (count) => (
        <a style={{ color: '#1890ff', fontWeight: '500' }}>
          ({count})
        </a>
      ),
    },
    {
      title: 'ใช้งาน',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
      render: (status, record) => (
        <Switch 
          checked={status} 
          onChange={(checked) => handleStatusChange(record.key, checked)}
        />
      ),
    },
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            style={{ color: '#1890ff' }} 
            title="แก้ไข"
          />
          <Button 
            type="text" 
            size="small" 
            icon={<DeleteOutlined />} 
            style={{ color: '#ff4d4f' }} 
            title="ลบ"
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .ant-table-cell {
          padding: 10px 12px !important;
        }
      `}</style>

      {/* Main Card with Dark Header matching the theme */}
      <Card 
        title={
          <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
            ข้อกำหนดและเงื่อนไขการใช้งาน
          </Text>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', fontWeight: '500' }}>
            เพิ่ม
          </Button>
        }
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {/* ส่วน Filter ด้านบน */}
        <div style={{ padding: '20px', marginBottom: 20, background: '#f9fafb', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>หัวข้อ :</Text></Col>
                <Col span={18}>
                  <Input placeholder="หัวข้อ หรือ version" allowClear />
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>สถานะการใช้งาน :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                    <Option value="active">เปิดใช้งาน</Option>
                    <Option value="inactive">ปิดใช้งาน</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#1f2937', borderColor: '#1f2937', padding: '0 36px', height: '38px' }}>
              ค้นหา
            </Button>
          </div>
        </div>

        {/* ตารางแสดงข้อมูล */}
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ pageSize: 10, position: ['bottomRight'] }} 
          bordered
          size="middle"
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        />
      </Card>
    </div>
  );
}