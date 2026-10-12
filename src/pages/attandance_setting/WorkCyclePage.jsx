import React, { useState } from 'react';
import { 
  Card, Row, Col, Button, Select, Table, Space, Typography, 
  Tooltip, Popconfirm, message, DatePicker 
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; //[cite: 2] เพิ่มการ import useNavigate

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function WorkCyclePage() {
  const navigate = useNavigate(); //[cite: 2] ประกาศใช้งาน navigate

  // ข้อมูลจำลองรอบการทำงาน[cite: 2]
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      index: 1,
      department: 'สำนักเลขาธิการ',
      dateRange: '01/01/2026 - 31/01/2026',
      shiftid: 'DH1',
      holidayGroup: 'วันหยุดปกติ',
      staffCount: '45 คน',
    },
    {
      key: '2',
      index: 2,
      department: 'กองบริหารงานทั่วไป',
      dateRange: '01/02/2026 - 28/02/2026',
      shiftid: 'DH1',
      holidayGroup: 'วันหยุดปกติ',
      staffCount: '30 คน',
    },
    {
      key: '3',
      index: 3,
      department: 'กองสารสนเทศ',
      dateRange: '01/03/2026 - 31/03/2026',
      shiftid: 'DH1',
      holidayGroup: 'วันหยุดปกติ',
      staffCount: '25 คน',
    },
  ]);

  // ฟังก์ชันลบข้อมูล[cite: 2]
  const handleDelete = (key) => {
    setDataSource(dataSource.filter(item => item.key !== key));
    message.success('ลบรายการรอบการทำงานสำเร็จ');
  };

  const columns = [
    { 
      title: 'ลำดับ', 
      dataIndex: 'index', 
      key: 'index', 
      align: 'center', 
      width: 80 
    },
    { 
      title: 'หน่วยงาน', 
      dataIndex: 'department', 
      key: 'department',
    },
    { 
      title: 'ช่วงวันที่ (เริ่มต้น - สิ้นสุด)', 
      dataIndex: 'dateRange', 
      key: 'dateRange', 
      align: 'center',
    },
    { 
      title: 'รหัสตารางการลงเวลา', 
      dataIndex: 'shiftid', 
      key: 'shiftid', 
      align: 'center',
    },
    { 
      title: 'กลุ่มวันหยุด', 
      dataIndex: 'holidayGroup', 
      key: 'holidayGroup', 
      align: 'center',
    },
    { 
      title: 'จำนวนเจ้าหน้าที่', 
      dataIndex: 'staffCount', 
      key: 'staffCount', 
      align: 'center',
    },
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            {/*[cite: 2] เปลี่ยนจาก message.info เป็น navigate ไปหน้า workCycleDetails พร้อมส่ง id */}
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              style={{ color: '#1890ff', padding: 0 }} 
              onClick={() => navigate(`/settings/WorkCycleDetailPage?id=${record.key}`)}
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
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto',textAlign: 'left' }}>
      
      <style>{`
        .ant-select, .ant-picker {
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

      {/* Card หลัก[cite: 2] */}
      <Card 
        title={<Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>ตั้งค่ารอบการทำงาน</Text>}
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        extra={
          /*[cite: 2] เปลี่ยนจาก message.info เป็น navigate ไปหน้า workCycleDetails สำหรับโหมดเพิ่มข้อมูล */
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
            onClick={() => navigate('/settings/WorkCycleDetailPage')}
          >
            เพิ่ม
          </Button>
        }
      >
        {/* ส่วน Filter[cite: 2] */}
        <div style={{ padding: '24px 16px', marginBottom: 16, background: '#fff' }}>
          <Row gutter={[16, 16]} align="middle" justify="center">
            
            {/* หน่วยงาน Dropdown[cite: 2] */}
            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Text className="filter-label">หน่วยงาน :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Select defaultValue="all" placeholder="เลือกหน่วยงาน">
                <Option value="all">ทั้งหมด</Option>
                <Option value="sec">สำนักเลขาธิการ</Option>
                <Option value="general">กองบริหารงานทั่วไป</Option>
                <Option value="it">กองสารสนเทศ</Option>
              </Select>
            </Col>
            <Col xs={24} md={10}></Col>

            {/* ช่วงวันที่ From - To DatePicker[cite: 2] */}
            <Col xs={24} md={4} style={{ textAlign: 'right' }}>
              <Text className="filter-label">ช่วงวันที่ :</Text>
            </Col>
            <Col xs={24} md={10}>
              <RangePicker placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']} format="DD/MM/YYYY" />
            </Col>
            <Col xs={24} md={10}></Col>
            {/* รหัสช่วงเวลาการทำงาน Dropdown[cite: 2] */}
            <Col xs={24} md={4} style={{ textAlign: 'left' }}>
              <Text className="filter-label">รหัสช่วงเวลาการทำงาน :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Select defaultValue="all" placeholder="เลือกหน่วยงาน">
                <Option value="all">ทั้งหมด</Option>
                <Option value="sec">สำนักเลขาธิการ</Option>
                <Option value="general">กองบริหารงานทั่วไป</Option>
                <Option value="it">กองสารสนเทศ</Option>
              </Select>
            </Col>
            <Col xs={24} md={10}></Col>
            {/* กลุ่มวันหยุด [cite: 2] */}
            <Col xs={24} md={4} style={{ textAlign: 'left' }}>
              <Text className="filter-label">กลุ่มวันหยุด :</Text>
            </Col>
            <Col xs={24} md={10}>
              <Select defaultValue="all" placeholder="เลือกหน่วยงาน">
                <Option value="all">ทั้งหมด</Option>
                <Option value="sec">กลุ่มวันหยุดปกติ</Option>
                <Option value="general">กลุ่มวันหยุดพิเศษ</Option>
              </Select>
            </Col>
            <Col xs={24} md={10}></Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              style={{ backgroundColor: '#1890ff' }}
            >
              ค้นหา
            </Button>
          </div>
        </div>

        {/* ตารางแสดงผล Grid[cite: 2] */}
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          bordered
          size="middle"
        />
      </Card>

    </div>
  );
}