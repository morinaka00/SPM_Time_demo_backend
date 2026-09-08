import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, Input, Table, Typography, Space, DatePicker, Empty } from 'antd';
import { 
  ArrowLeftOutlined, 
  SearchOutlined, 
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

export default function RptOvertimePage() {
  const navigate = useNavigate();
  const [searched, setSearched] = useState(false);

  // กดปุ่มค้นหาเพื่อแสดงตาราง
  const handleSearch = () => {
    setSearched(true);
  };

  // โครงสร้าง Columns ของตาราง
  const columns = [
    {
      title: 'ชื่อ-สกุล',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text) => <Text strong style={{ fontSize: '13px', color: '#1f2937' }}>{text}</Text>
    },
    {
      title: 'หน่วยงาน',
      dataIndex: 'dept',
      key: 'dept',
      width: 150,
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      key: 'position',
      width: 100,
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      width: 100,
    },
    {
      title: 'เวลา',
      dataIndex: 'timeRange',
      key: 'timeRange',
      align: 'center',
      width: 110,
      render: (val) => <span style={{ color: '#1890ff' }}>{val}</span>
    },
    {
      title: 'เวลาเข้า-ออก งาน',
      dataIndex: 'workTime',
      key: 'workTime',
      align: 'center',
      width: 130,
    },
    {
      title: 'จำนวน ชม.',
      dataIndex: 'hours',
      key: 'hours',
      align: 'center',
      width: 90,
    },
    {
      title: 'จำนวน เงิน',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 100,
      render: (val) => val ? Number(val).toLocaleString() : '0'
    }
  ];

  // ข้อมูลจำลองการทำงานล่วงเวลา (OT) 3 records
  const dataSource = [
    {
      key: '1',
      name: 'นาย xxx xxx',
      dept: 'สำนักเลขาธิการ',
      position: 'นักวิชาการ',
      date: '01-08-69',
      timeRange: '08:30-16:30',
      workTime: '08:20 - 16:40',
      hours: '7',
      amount: '420'
    },
    {
      key: '2',
      name: 'นาย yyy yyy',
      dept: 'สำนักเลขาธิการ',
      position: 'เจ้าหน้าที่',
      date: '03-08-69',
      timeRange: '17:00-19:00',
      workTime: '08:30 - 19:30',
      hours: '2',
      amount: '100'
    },
    {
      key: '3',
      name: 'นางสาว zzz zzz',
      dept: 'กลุ่มบริหารระบบเครือข่ายฯ',
      position: 'วิศวกร',
      date: '03-08-69',
      timeRange: '16:30-21:30',
      workTime: '08:30 - 16:30',
      hours: '5',
      amount: '250'
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .ant-table-cell {
          padding: 8px 10px !important;
        }
      `}</style>

      <Card 
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: '#fff' }} onClick={() => navigate(-1)} />
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              รายงานสรุปการทำงานล่วงเวลา
            </Text>
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<FileExcelOutlined />} 
              style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f', color: '#52c41a', fontWeight: '500' }}
            >
              Export Excel
            </Button>
            <Button 
              icon={<FilePdfOutlined />} 
              style={{ backgroundColor: '#fff1f0', borderColor: '#ffa39e', color: '#ff4d4f', fontWeight: '500' }}
            >
              Export PDF
            </Button>
            <Button 
              icon={<PrinterOutlined />} 
              style={{ backgroundColor: '#e6f4ff', borderColor: '#91caff', color: '#1677ff', fontWeight: '500' }}
            >
              พิมพ์รายงาน
            </Button>
          </Space>
        }
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {/* ส่วน Filter ด้านบน */}
        <div style={{ padding: '20px', marginBottom: 20, background: '#f9fafb', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ตั้งแต่ :</Text></Col>
                <Col span={18}>
                  <DatePicker defaultValue={dayjs('2026-08-01')} format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ถึงวันที่ :</Text></Col>
                <Col span={18}>
                  <DatePicker defaultValue={dayjs('2026-08-31')} format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>หน่วยงาน :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                    <Option value="sec">สำนักเลขาธิการ</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ระดับตำแหน่ง :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                  </Select>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ตำแหน่ง :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>เจ้าหน้าที่ :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด...</Option>
                  </Select>
                </Col>
              </Row>
            </Col>

            
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ค้นหา :</Text></Col>
                <Col span={18}>
                  <Input placeholder="ค้นหาชื่อพนักงาน..." />
                </Col>
              </Row>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearch}
              style={{ backgroundColor: '#1f2937', borderColor: '#1f2937', padding: '0 36px', height: '38px' }}
            >
              ค้นหา
            </Button>
          </div>
        </div>

        {/* ตารางแสดงผลเฉพาะเมื่อกดปุ่มค้นหาแล้ว */}
        {searched ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              
            </div>
            <Table 
              dataSource={dataSource} 
              columns={columns} 
              pagination={false} 
              bordered
              size="small"
              rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fafafa', borderRadius: 8, border: '1px dashed #d9d9d9' }}>
            <Empty description={<Text type="secondary">กรุณากดปุ่ม "ค้นหา" ด้านบนเพื่อแสดงรายงานสรุปการทำงานล่วงเวลา</Text>} />
          </div>
        )}
      </Card>
    </div>
  );
}