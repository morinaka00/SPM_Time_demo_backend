import React, { useState } from 'react';
import { Card, Select, Row, Col, Tag, Space, Typography, Empty } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function LeaveHistoryPage() {
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('all');

  // จำลองข้อมูลประวัติการลาทั้งหมด
  const leaveData = [
    { id: 1, type: 'ลาพักร้อน', startDate: '2026-06-10', endDate: '2026-06-12', reason: 'ไปเที่ยวต่างจังหวัดกับครอบครัว', status: 'approved', year: '2026', month: '06' },
    { id: 2, type: 'ลาป่วย', startDate: '2026-05-15', endDate: '2026-05-15', reason: 'ไข้หวัดใหญ่ นอนพักรักษาตัว', status: 'approved', year: '2026', month: '05' },
    { id: 3, type: 'ลากิจส่วนตัว', startDate: '2026-06-20', endDate: '2026-06-20', reason: 'ทำธุระที่ราชการ', status: 'pending', year: '2026', month: '06' },
    { id: 4, type: 'ลาพักร้อน', startDate: '2025-12-25', endDate: '2025-12-26', reason: 'พักผ่อนช่วงเทศกาลปีใหม่', status: 'rejected', year: '2025', month: '12' },
  ];

  // ฟังก์ชันกรองข้อมูลตามปีและเดือนที่เลือก
  const filteredData = leaveData.filter(item => {
    const matchYear = year === 'all' || item.year === year;
    const matchMonth = month === 'all' || item.month === month;
    return matchYear && matchMonth;
  });

  // ฟังก์ชันแสดงป้ายสถานะการอนุมัติ
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
    <div>
      {/* ส่วนหัวข้อและฟิลเตอร์ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <Title level={4} style={{ margin: 0 }}>ประวัติการขอลาหยุด (DPIS)</Title>
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
        </Space>
      </div>

      {/* แสดงรายการ Card */}
      {filteredData.length === 0 ? (
        <Card>
          <Empty description="ไม่พบประวัติการลาในช่วงเวลาที่เลือก" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredData.map(item => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card 
                title={item.type} 
                extra={renderStatusTag(item.status)}
                hoverable
                style={{ height: '100%', borderRadius: 8 }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Text>
                    <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    <strong>ช่วงวันที่:</strong> {item.startDate} ถึง {item.endDate}
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