import { useState } from 'react';
import { Card, Row, Col, Statistic, Button, Select, Input, Space, Tag, Avatar, Typography, Segmented, Popover } from 'antd';
import { 
  TeamOutlined, 
  CalendarOutlined, 
  LeftOutlined, 
  RightOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  EnvironmentOutlined} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('normal');
  const [viewMode, setViewMode] = useState('table'); // 'table' หรือ 'map'

  // ข้อมูลจำลองพนักงานและการลงเวลา
  const attendanceList = [
    { id: 41066, name: 'นาง xxx xxx', position: 'xxxx', timeOut: '14:40', timeIn: '08:02', lat: 13.7618, lng: 100.5125, locationName: 'อาคาร สลน. ชั้น 3' },
    { id: 40914, name: 'นาย xxx xxx', position: 'xxxxx', timeOut: '15:25', timeIn: '00:01', lat: 13.7625, lng: 100.5132, locationName: 'ประตู 1 ทำเนียบรัฐบาล' },
    { id: 40822, name: 'นาย xxx xxxx', position: 'xxxxx', timeOut: '16:30', timeIn: '08:15', lat: 13.7610, lng: 100.5118, locationName: 'ตึกไทยคู่ฟ้า' },
  ];

  // ข้อมูลจำลองการลา
  const leaveList = [
    { id: 40248, name: 'นาย xxx xxx', type: 'ลาป่วย', reason: 'มีน้ำมูก', time: '24 ส.ค. ,7:00-16:30' },
    { id: 21001, name: 'นาย xxx xxx', type: 'ลาพักร้อน', reason: 'พักร้อน', time: '24 ส.ค. ,8:00-17:00' },
    { id: 40249, name: 'นาง xxx xxx', type: 'ลาพักร้อน', reason: 'ไปทำธุระกับที่บ้าน', time: '24 ส.ค. ,7:00-11:15' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1300px', margin: '0 auto' }}>
      
      <style>{`
        .ant-select-selection-item, .ant-select-selection-search-input {
          text-align: left !important;
        }
        .map-container {
          background: var(--navy-tint);
          border-radius: 8px;
          border: 1px solid var(--border);
          height: 380px;
          position: relative;
          overflow: hidden;
          background-image: radial-gradient(var(--navy-tint-border) 1px, transparent 1px);
          background-size: 20px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .map-pin {
          position: absolute;
          cursor: pointer;
          transition: transform 220ms var(--ease);
        }
        .map-pin:hover {
          transform: scale(1.15);
          z-index: 10;
        }
      `}</style>
      
      {/* 1. การ์ดสถิติด้านบนสุด 4 ช่อง */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: 1 }}>
          <Card variant={false} style={{ background: 'var(--grad-bar)', color: 'var(--white)', borderRadius: 8, borderBottom: '3px solid var(--gold)' }}>
            <Statistic title={<span style={{ color: 'var(--gold-pale)' }}>เจ้าหน้าที่ทั้งหมด</span>} value={271} valueStyle={{ color: 'var(--white)', fontWeight: 'bold' }} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: 1 }}>
          <Card variant={false} style={{ background: 'var(--navy-3)', color: 'var(--white)', borderRadius: 8 }}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.78)' }}>ลงเวลาแล้ว</span>} value="126 / 213" valueStyle={{ color: 'var(--white)', fontWeight: 'bold' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: 1 }}>
          <Card variant={false} style={{ background: 'var(--navy-3)', color: 'var(--white)', borderRadius: 8 }}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.78)' }}>ลาวันนี้</span>} value={13} valueStyle={{ color: 'var(--white)', fontWeight: 'bold' }} suffix="" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4.8} style={{ flex: 1 }}>
          <Card variant={false} style={{ background: 'var(--ok-solid)', color: 'var(--white)', borderRadius: 8 }}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.78)' }}>ปฏิบัติงานล่วงเวลา</span>} value={0} valueStyle={{ color: 'var(--white)', fontWeight: 'bold' }} suffix="" />
          </Card>
        </Col>
      </Row>

      {/* 2. แถบควบคุมวันที่และปุ่มส่งออก */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10, background: 'var(--surface)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-soft)' }}>
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
            
            {/* หัวข้อ + ปุ่มสลับ View (ตาราง / แผนที่) + แท็บตัวเลือกสถานะ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '15px', marginRight: 4 }}>การลงเวลา</Text>
                <Button size="small" type={activeTab === 'normal' ? 'primary' : 'default'} ghost={activeTab !== 'normal'} onClick={() => setActiveTab('normal')}>ปกติ</Button>
                <Button size="small" type={activeTab === 'late' ? 'primary' : 'default'} ghost={activeTab !== 'late'} onClick={() => setActiveTab('late')} danger>สาย</Button>
                <Button size="small" type={activeTab === 'early' ? 'primary' : 'default'} ghost={activeTab !== 'early'} onClick={() => setActiveTab('early')} danger>กลับก่อน</Button>
                <Button size="small" type={activeTab === 'absent' ? 'primary' : 'default'} ghost={activeTab !== 'absent'} onClick={() => setActiveTab('absent')} danger>ขาด/ไม่ลงเวลา</Button>
                <Button size="small" type={activeTab === 'all' ? 'primary' : 'default'} onClick={() => setActiveTab('all')}>ทั้งหมด</Button>
              </div>

              {/* ปุ่มสลับมุมมอง View Mode */}
              <Segmented
                options={[
                  { label: 'ตาราง', value: 'table', icon: <UnorderedListOutlined /> },
                  { label: 'แผนที่', value: 'map', icon: <EnvironmentOutlined /> },
                ]}
                value={viewMode}
                onChange={setViewMode}
                style={{ backgroundColor: 'var(--border-soft)' }}
              />
            </div>

            {/* ฟิลเตอร์ค้นหา */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12}><Select defaultValue="dept" style={{ width: '100%', textAlign: 'left' }}><Option value="dept">หน่วยงาน</Option></Select></Col>
              <Col xs={24} sm={12}><Select defaultValue="pos" style={{ width: '100%', textAlign: 'left' }}><Option value="pos">ตำแหน่ง</Option></Select></Col>
              <Col xs={24} sm={12}><Select defaultValue="level" style={{ width: '100%', textAlign: 'left' }}><Option value="level">ระดับตำแหน่ง</Option></Select></Col>
              <Col xs={24} sm={12}><Input placeholder="ชื่อ, รหัส" /></Col>
            </Row>

            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <Button type="primary" icon={<SearchOutlined />}>ค้นหา</Button>
            </div>

            {/* แสดงผลตาม View Mode ที่เลือก */}
            {viewMode === 'table' ? (
              /* 1. มุมมองแบบตาราง/รายการ */
              <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 12 }}>
                {attendanceList.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-soft)' }}>
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
            ) : (
              /* 2. มุมมองแบบแผนที่ (Map View) */
              <div className="map-container">
                <div style={{ position: 'absolute', top: 12, left: 16, background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '12px', fontWeight: 'bold', color: 'var(--navy-1)' }}>
                  <EnvironmentOutlined style={{ color: 'var(--danger)', marginRight: 6 }} />
                  แผนที่แสดงจุดลงเวลาพนักงาน (ทำเนียบรัฐบาล)
                </div>

                {/* แสดงหมุดปักบนแผนที่จำลองตามรายชื่อ */}
                {attendanceList.map((item, index) => {
                  // คำนวณพิกัดจำลองบนแผนที่
                  const positions = [
                    { top: '35%', left: '45%' },
                    { top: '60%', left: '70%' },
                    { top: '25%', left: '25%' },
                  ];
                  const pos = positions[index] || { top: '50%', left: '50%' };

                  const popoverContent = (
                    <div style={{ width: 220 }}>
                      <Text strong style={{ fontSize: '13px' }}>{item.name} ({item.id})</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '11px' }}>{item.position}</Text>
                      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: '12px' }}><EnvironmentOutlined /> {item.locationName}</Text>
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                        <Tag color="success">เข้า {item.timeIn}</Tag>
                        <Tag color={index === 1 ? 'error' : 'success'}>ออก {item.timeOut}</Tag>
                      </div>
                    </div>
                  );

                  return (
                    <Popover key={index} content={popoverContent} title="รายละเอียดการลงเวลา" trigger="click">
                      <div className="map-pin" style={{ top: pos.top, left: pos.left }}>
                        <div style={{ background: 'var(--navy-3)', color: 'var(--white)', borderRadius: '20px', padding: '4px 10px', boxShadow: '0 2px 8px rgba(12,27,58,0.25)', display: 'flex', alignItems: 'center', gap: 6, border: '2px solid var(--white)' }}>
                          <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} size={22} />
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.name.split(' ')[1]}</span>
                          <Tag color="success" style={{ margin: 0, fontSize: '10px', padding: '0 4px', lineHeight: '16px' }}>{item.timeIn}</Tag>
                        </div>
                      </div>
                    </Popover>
                  );
                })}
              </div>
            )}

          </Card>
        </Col>

        {/* ฝั่งขวา: การลา */}
        <Col xs={24} lg={10}>
          <Card title={<Text strong style={{ fontSize: '16px' }}>การลา</Text>} style={{ borderRadius: 8, height: '100%' }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {leaveList.map((leave, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 12, borderBottom: index < leaveList.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
                  <Space size={12} align="start">
                    <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=leave-${index}`} size={44} />
                    <div>
                      <Text strong>{leave.name} ({leave.id})</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '13px' }}>ประเภท : {leave.type}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '13px' }}>เหตุผล : {leave.reason}</Text>
                      <br />
                      <Text style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{leave.time}</Text>
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