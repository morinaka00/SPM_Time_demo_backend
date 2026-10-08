import React, { useState } from 'react';
import { Card, Select, Row, Col, Tag, Space, Typography, Empty } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function OvertimeHistoryPage() {
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('all');
  const [status, setStatus] = useState('all');

  // จำลองข้อมูลประวัติการทำงานล่วงเวลา (OT)
  const otData = [
    { id: 1, date: '2026-06-10', timeRange: '17:30 - 20:30', hours: 3, reason: 'ทำงานล่วงเวลา 4', status: 'approved', year: '2026', month: '06' },
    { id: 2, date: '2026-06-15', timeRange: '17:30 - 19:30', hours: 2, reason: 'ทำงานล่วงเวลา 3', status: 'pending', year: '2026', month: '06' },
    { id: 3, date: '2026-05-20', timeRange: '18:00 - 21:00', hours: 3, reason: 'ทำงานล่วงเวลา 2', status: 'approved', year: '2026', month: '05' },
    { id: 4, date: '2025-12-18', timeRange: '17:30 - 21:30', hours: 4, reason: 'ทำงานล่วงเวลา 1', status: 'rejected', year: '2025', month: '12' },
  ];

  // ฟังก์ชันกรองข้อมูลตาม ปี, เดือน, และสถานะ
  const filteredData = otData.filter(item => {
    const matchYear = year === 'all' || item.year === year;
    const matchMonth = month === 'all' || item.month === month;
    const matchStatus = status === 'all' || item.status === status;
    return matchYear && matchMonth && matchStatus;
  });

  // ฟังก์ชันแสดงป้ายสถานะการอนุมัติที่มุมขวาบนของการ์ด
  const renderStatusTag = (status) => {
    switch (status) {
      case 'approved':
        return <Tag color="success">อนุมัติแล้ว</Tag>;
      case 'pending':
        return <Tag color="processing">รออนุมัติ</Tag>;
      case 'rejected':
        return <Tag color="error">ไม่อนุมัติ</Tag>;
      default:
        return <Tag>ไม่ระบุ</Tag>;
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      {/* ส่วนหัวข้อและฟิลเตอร์ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <Title level={4} style={{ margin: 0 }}>ประวัติการทำงานล่วงเวลา (OT)</Title>
        <Space wrap>
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
          <Select value={status} onChange={value => setStatus(value)} style={{ width: 130 }}>
            <Option value="all">ทุกสถานะ</Option>
            <Option value="approved">อนุมัติแล้ว</Option>
            <Option value="pending">รออนุมัติ</Option>
            <Option value="rejected">ไม่อนุมัติ</Option>
          </Select>
        </Space>
      </div>

      {/* แสดงรายการ Card */}
      {filteredData.length === 0 ? (
        <Card>
          <Empty description="ไม่พบประวัติการทำงานล่วงเวลาในช่วงเวลาที่เลือก" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredData.map(item => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card 
                title={
                  <Space size={6}>
                    <CalendarOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontSize: '14px' }}>{item.date} ({item.timeRange})</span>
                  </Space>
                } 
                extra={renderStatusTag(item.status)}
                hoverable
                style={{ height: '100%', borderRadius: 8 }}
              >
                <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                  <Text>
                    <FieldTimeOutlined style={{ marginRight: 8, color: '#faad14' }} />
                    <strong>จำนวนที่ทำ:</strong> <span style={{ color: '#faad14', fontWeight: 'bold' }}>{item.hours} ชั่วโมง</span>
                  </Text>
                  <Text type="secondary">
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    <strong>เหตุผล:</strong> {item.reason}
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