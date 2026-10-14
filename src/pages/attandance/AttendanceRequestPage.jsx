import React, { useState } from 'react';
import { Card, Select, Row, Col, Tag, Space, Typography, Empty, Button, Input, DatePicker, TimePicker } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  PlusOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function AttendanceRequestPage() {
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' หรือ 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // สถานะประเภทการขอลงเวลาในหน้าฟอร์ม: 'normal' = ขอลงเวลา (1 ช่อง), 'full' = ขอลงเวลาทั้งวัน (2 ช่อง)
  const [reqOption, setReqOption] = useState('normal'); 

  // จำลองข้อมูลประวัติการขอลงเวลาทั้งหมด[cite: 11]
  const [leaveData, setLeaveData] = useState([
    { id: 1, type: 'ขอลงเวลา', startDate: '2026-06-10', startTime: '08:30', endTime: '17:30', reason: 'ลืมลงเวลา', location: 'อาคาร สลน.', status: 'approved', year: '2026', month: '06' },
    { id: 2, type: 'ขอลงเวลาทั้งวัน', startDate: '2026-05-15', startTime: '08:30', endTime: '16:30', reason: 'ลืมลงเวลา', location: 'อาคาร สลน.', status: 'approved', year: '2026', month: '05' },
    { id: 3, type: 'ปฏิบัติงานนอกสถานที่', startDate: '2026-06-20', startTime: '08:30', endTime: '17:30', reason: 'ติดต่อกระทรวง xxx', location: 'กระทรวงพาณิชย์', status: 'pending', year: '2026', month: '06' },
    { id: 4, type: 'ปฏิบัติงานนอกสถานที่', startDate: '2026-12-25', startTime: '08:30', endTime: '17:30', reason: 'ประชุมร่วมกับกระทรวงการคลัง', location: 'กระทรวงการคลัง', status: 'rejected', year: '2026', month: '12' },
  ]);

  // ฟังก์ชันกรองข้อมูลตามปีและเดือนที่เลือก[cite: 11]
  const filteredData = leaveData.filter(item => {
    const matchYear = year === 'all' || item.year === year;
    const matchMonth = month === 'all' || item.month === month;
    return matchYear && matchMonth;
  });

  // ฟังก์ชันแสดงป้ายสถานะการอนุมัติ[cite: 11]
  const renderStatusTag = (status) => {
    switch (status) {
      case 'approved':
        return <Tag color="success">อนุมัติแล้ว</Tag>;
      case 'processing':
      case 'pending':
        return <Tag color="processing">รออนุมัติ</Tag>;
      case 'rejected':
        return <Tag color="error">ไม่อนุมัติ</Tag>;
      default:
        return <Tag>ไม่ระบุ</Tag>;
    }
  };

  // เมื่อคลิกการ์ดเพื่อดูรายละเอียด
  const handleCardClick = (item) => {
    setSelectedItem(item);
    if (item.type.includes('ทั้งวัน')) {
      setReqOption('full');
    } else {
      setReqOption('normal');
    }
    setViewMode('detail');
  };

  // เมื่อคลิกปุ่ม Add (เพิ่มข้อมูลใหม่)
  const handleAddNew = () => {
    setSelectedItem({
      id: null,
      type: 'ขอลงเวลา',
      startDate: dayjs().format('YYYY-MM-DD'),
      startTime: '09:00',
      endTime: '18:00',
      reason: '',
      location: 'อาคาร สลน.',
      status: 'pending'
    });
    setReqOption('normal');
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedItem(null);
  };

  // หากอยู่ในโหมดหน้ารายละเอียด / ฟอร์ม
  if (viewMode === 'detail') {
    return (
      <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
        <Card 
          title={
            <Space>
              <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: '#fff' }} onClick={handleBackToList} />
              <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
                รายละเอียดคำขอลงเวลา
              </Text>
            </Space>
          }
          headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <div style={{ padding: '10px 20px' }}>
            {/* ส่วนเหตุผลการขอลงเวลา และสถานที่ */}
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: 8 }}>เหตุผลการขอลงเวลา</Text>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Input value={selectedItem?.reason || 'ลืมลงเวลา'} readOnly style={{ borderRadius: 6 }} />
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ 
                    border: '1px solid #52c41a', 
                    borderRadius: 6, 
                    padding: '6px 16px', 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    gap: 8,
                    color: '#52c41a', 
                    fontWeight: '500',
                    backgroundColor: '#f6ffed'
                  }}>
                    <EnvironmentOutlined />
                    <span>{selectedItem?.location || 'ปฏิบัติงานนอกสถานที่'}</span>
                  </div>
                </Col>
              </Row>
            </div>

            {/* ส่วนการขอลงเวลา (ขอลงเวลา vs ขอลงเวลาทั้งวัน) */}
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: 8 }}>การขอลงเวลา</Text>
              <Row gutter={16}>
                <Col xs={12} md={6}>
                  <div 
                    onClick={() => setReqOption('normal')}
                    style={{ 
                      border: reqOption === 'normal' ? '1px solid #52c41a' : '1px solid #d9d9d9', 
                      borderRadius: 6, 
                      padding: '8px 16px', 
                      textAlign: 'center',
                      cursor: 'pointer',
                      color: reqOption === 'normal' ? '#52c41a' : 'rgba(0, 0, 0, 0.88)',
                      backgroundColor: reqOption === 'normal' ? '#f6ffed' : '#fff',
                      fontWeight: reqOption === 'normal' ? '500' : 'normal'
                    }}
                  >
                    ขอลงเวลา
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div 
                    onClick={() => setReqOption('full')}
                    style={{ 
                      border: reqOption === 'full' ? '1px solid #52c41a' : '1px solid #d9d9d9', 
                      borderRadius: 6, 
                      padding: '8px 16px', 
                      textAlign: 'center',
                      cursor: 'pointer',
                      color: reqOption === 'full' ? '#52c41a' : 'rgba(0, 0, 0, 0.88)',
                      backgroundColor: reqOption === 'full' ? '#f6ffed' : '#fff',
                      fontWeight: reqOption === 'full' ? '500' : 'normal'
                    }}
                  >
                    ขอลงเวลาทั้งวัน
                  </div>
                </Col>
              </Row>
            </div>

            

            
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text strong style={{ fontSize: '13px', color: '#52c41a' }}>รายวันที่ขอ · 1 วัน</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>เวลาเริ่มต้นจากการตั้งค่า 09:00–18:00 น.</Text>
              </div>

              <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, padding: '16px', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                
                <DatePicker 
                  value={selectedItem?.startDate ? dayjs(selectedItem.startDate) : dayjs()} 
                  format="DD/MM/YYYY" 
                  style={{ width: '220px' }} 
                />
                
                {reqOption === 'normal' ? (
                  <Space>
                    <TimePicker defaultValue={dayjs('09:00', 'HH:mm')} format="HH:mm" />
                    
                  </Space>
                ) : (
                  <Space>
                    <TimePicker defaultValue={dayjs('09:00', 'HH:mm')} format="HH:mm" />
                    <span>-</span>
                    <TimePicker defaultValue={dayjs('18:00', 'HH:mm')} format="HH:mm" />
                    
                  </Space>
                )}
              </div>
              <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: 6 }}>
                เวลาเข้า–ออก แก้ได้ทีละวัน · ทุกวันในรายการเป็นคำขอเดียวกัน ผู้อนุมัติพิจารณาครั้งเดียว
              </Text>
            </div>

            {/* รายละเอียด / หมายเหตุ */}
            <div style={{ marginBottom: 30 }}>
              <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: 8 }}>รายละเอียด/หมายเหตุ</Text>
              <TextArea 
                rows={4} 
                defaultValue={selectedItem?.reason}
                placeholder="อธิบายเหตุผลเพิ่มเติม เช่น สถานที่ปฏิบัติงาน หรือสาเหตุที่ลืมลงเวลา" 
                style={{ borderRadius: 8 }}
              />
            </div>

            {/* ปุ่มยื่นคำขอ */}
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large"
                style={{ 
                  backgroundColor: '#006644', 
                  borderColor: '#006644', 
                  width: '100%', 
                  maxWidth: '400px', 
                  height: '45px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  borderRadius: 8
                }}
              >
                ยื่นคำขอ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // หน้ารายการแบบ Card (ListView)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <Title level={4} style={{ margin: 0 }}>ประวัติการลงเวลา</Title>
        <Space>
          <Select value={year} onChange={value => setYear(value)} style={{ width: 110 }}>
            <Option value="all">ทุกปี</Option>
            <Option value="2026">2026</Option>
            <Option value="2025">2025</Option>
          </Select>
          <Select value={month} onChange={value => setMonth(value)} style={{ width: 130 }}>
            <Option value="all">ทุกเดือน</Option>
            <Option value="01">มกราคม</Option>
            <Option value="02">กุมภาพันธ์</Option>
            <Option value="03">มีนาคม</Option>
            <Option value="04">เมษายน</Option>
            <Option value="05">พฤษภาคม</Option>
            <Option value="06">มิถุนายน</Option>
            <Option value="07">กรกฎาคม</Option>
            <Option value="08">สิงหาคม</Option>
            <Option value="09">กันยายน</Option>
            <Option value="10">ตุลาคม</Option>
            <Option value="11">พฤศจิกายน</Option>
            <Option value="12">ธันวาคม</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddNew}
            style={{ backgroundColor: '#1f2937', borderColor: '#1f2937', fontWeight: '500' }}
          >
            เพิ่ม
          </Button>
        </Space>
      </div>

      {filteredData.length === 0 ? (
        <Card>
          <Empty description="ไม่พบประวัติการขอลงเวลาในช่วงเวลาที่เลือก" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredData.map(item => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card 
                title={item.type} 
                extra={renderStatusTag(item.status)}
                hoverable
                onClick={() => handleCardClick(item)}
                style={{ height: '100%', borderRadius: 8, cursor: 'pointer' }}
              >
                <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                  <Text>
                    <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <strong>วันที่:</strong> {item.startDate} {item.startTime}
                  </Text>
                  <Text type="secondary">
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    <strong>เหตุผล:</strong> {item.reason}
                  </Text>
                  <Text type="secondary">
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    <strong>สถานที่:</strong> {item.location}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}