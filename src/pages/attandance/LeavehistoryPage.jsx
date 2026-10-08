import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Select, Input, Space, Tag, Avatar, Typography } from 'antd';
import { 
  TeamOutlined, 
  DownloadOutlined, 
  CalendarOutlined, 
  LeftOutlined, 
  RightOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('normal');

  // ข้อมูลจำลองพนักงาน
  const attendanceList = [
    { id: 41066, name: 'นาง xxx xxx', position: 'xxxx', timeOut: '14:40', timeIn: '08:02' },
    { id: 40914, name: 'นาย xxx xxx', position: 'xxxxx', timeOut: '15:25', timeIn: '00:01' },
    { id: 40822, name: 'นาย xxx xxxx', position: 'xxxxx', timeOut: '16:30', timeIn: '08:15' },
  ];

  // ข้อมูลจำลองการลา
  const leaveList = [
    { id: 40248, name: 'นาย xxx xxx', type: 'ลาป่วย', reason: 'มีน้ำมูก', time: '24 ส.ค. ,7:00-16:30' },
    { id: 21001, name: 'นาย xxx xxx', type: 'ลาพักร้อน', reason: 'พักร้อน', time: '24 ส.ค. ,8:00-17:00' },
    { id: 40249, name: 'นาง xxx xxx', type: 'ลาพักร้อน', reason: 'ไปทำธุระกับที่บ้าน', time: '24 ส.ค. ,7:00-11:15' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1300px', margin: '0 auto' }}>
      
      {/* CSS สำหรับบังคับให้ข้อความใน Dropdown (Select) ชิดซ้าย */}
      <style>{`
        .ant-select-selection-item, .ant-select-selection-search-input {
          text-align: left !important;
        }
      `}</style>
      
      {/* 1. การ์ดสถิติด้านบนสุด 4 ช่อง */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: 1 }}>
          <Card variant={false} style={{ background: '#262626', color: '#fff', borderRadius: 8 }}>
            <Statistic title={<span style={{ color: '#d9d9d9' }}>เจ้าหน้าที่ทั้งหมด</span>} value={271} valueStyle={{ color: '#fff', fontWeight: 'bold' }} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: 1 }}>
          <Card variant={false} style={{ background: '#1890ff', color: '#fff', borderRadius: 8 }}>
            <Statistic title={<span style={{ color: '#e6f7ff' }}>ลงเวลาแล้ว</span>} value="126 / 213" valueStyle={{ color: '#fff', fontWeight: 'bold' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: 1 }}>
          <Card variant={false} style={{ background: '#13c2c2', color: '#fff', borderRadius: 8 }}>
            <Statistic title={<span style={{ color: '#e6fffb' }}>ลาวันนี้</span>} value={13} valueStyle={{ color: '#fff', fontWeight: 'bold' }} suffix="" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: 1 }}>
          <Card variant={false} style={{ background: '#52c41a', color: '#fff', borderRadius: 8 }}>
            <Statistic title={<span style={{ color: '#f6ffed' }}>ปฏิบัติงานล่วงเวลา</span>} value={0} valueStyle={{ color: '#fff', fontWeight: 'bold' }} suffix="" />
          </Card>
        </Col>
        
      </Row>

      {/* 2. แถบควบคุมวันที่และปุ่มส่งออก */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10, background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #f0f0f0' }}>
        <Text strong style={{ fontSize: '16px' }}>วันจันทร์ ที่ 24 สิงหาคม 2569</Text>
        <Space wrap>
          
          <Input style={{ width: 130 }} defaultValue="24/08/2026" suffix={<CalendarOutlined />} />
          <Button icon={<CalendarOutlined />} />
          <Button>วันนี้</Button>
          <Button icon={<LeftOutlined />} size="small" />
          <Button icon={<RightOutlined />} size="small" />
        </Space>
      </div>

      {/* 3. ส่วนเนื้อหาหลักแบ่งซ้าย (การลงเวลา) และขวา (การลา) */}
      <Row gutter={[16, 16]}>
        
        {/* ฝั่งซ้าย: การลงเวลา */}
        <Col xs={24} lg={14}>
          <Card style={{ borderRadius: 8, height: '100%' }}>
            
            {/* แท็บตัวเลือกสถานะการลงเวลา */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <Text strong style={{ fontSize: '15px', marginRight: 4 }}>การลงเวลา</Text>
              <Button size="small" type={activeTab === 'normal' ? 'primary' : 'default'} ghost={activeTab !== 'normal'} onClick={() => setActiveTab('normal')} default>ปกติ</Button>
              <Button size="small" type={activeTab === 'late' ? 'primary' : 'default'} ghost={activeTab !== 'late'} onClick={() => setActiveTab('late')} danger>สาย</Button>
              <Button size="small" type={activeTab === 'early' ? 'primary' : 'default'} ghost={activeTab !== 'early'} onClick={() => setActiveTab('early')} danger>กลับก่อน</Button>
              <Button size="small" type={activeTab === 'absent' ? 'primary' : 'default'} ghost={activeTab !== 'absent'} onClick={() => setActiveTab('absent')} danger>ขาด/ไม่ลงเวลา</Button>
              <Button size="small" type={activeTab === 'all' ? 'primary' : 'default'} onClick={() => setActiveTab('all')}>ทั้งหมด</Button>
            </div>

            {/* ฟิลเตอร์ค้นหา */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12}><Select defaultValue="dept" style={{ width: '100%', textAlign: 'left' }}><Option value="dept">หน่วยงาน</Option></Select></Col>
              <Col xs={24} sm={12}><Select defaultValue="pos" style={{ width: '100%', textAlign: 'left' }}><Option value="pos">ตำแหน่ง</Option></Select></Col>
              <Col xs={24} sm={12}><Select defaultValue="level" style={{ width: '100%', textAlign: 'left' }}><Option value="level">ระดับตำแหน่ง</Option></Select></Col>
              <Col xs={24} sm={12}><Input placeholder="ชื่อ, รหัส" /></Col>
            </Row>

            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#1890ff' }}>ค้นหา</Button>
            </div>

            {/* รายการพนักงานและการลงเวลา */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
              {attendanceList.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Space size={12}>
                    <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} size={44} />
                    <div>
                      <Text strong>{item.name} ({item.id})</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{item.position}</Text>
                    </div>
                  </Space>
                  <Space>
                    <Tag color="success" style={{ fontSize: '14px', padding: '4px 12px', fontWeight: 'bold' }}>{item.timeOut}</Tag>
                    <Tag color={index === 1 ? 'error' : 'success'} style={{ fontSize: '14px', padding: '4px 12px', fontWeight: 'bold' }}>{item.timeIn}</Tag>
                  </Space>
                </div>
              ))}
            </div>

          </Card>
        </Col>

        {/* ฝั่งขวา: การลา */}
        <Col xs={24} lg={10}>
          <Card title={<Text strong style={{ fontSize: '16px' }}>การลา</Text>} style={{ borderRadius: 8, height: '100%' }}>
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              {leaveList.map((leave, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 12, borderBottom: index < leaveList.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <Space size={12} align="start">
                    <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=leave-${index}`} size={44} />
                    <div>
                      <Text strong>{leave.name} ({leave.id})</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '13px' }}>ประเภท : {leave.type}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '13px' }}>เหตุผล : {leave.reason}</Text>
                      <br />
                      <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>{leave.time}</Text>
                    </div>
                  </Space>
                  <Tag color="success" style={{ margin: 0, fontWeight: 'bold' }}>อนุมัติแล้ว</Tag>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

      </Row>

    </div>
  );
}