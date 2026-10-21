import { useState } from 'react';
import { Card, Select, Row, Col, Tag, Space, Typography, Empty, Button, Input, DatePicker, TimePicker } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  PlusOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import FilterPanel, { FilterField } from '../../components/FilterPanel';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const INITIAL_FILTER = { year: '2026', month: 'all' };

// ประเภทคำขอลงเวลา (เลือกก่อนกรอกเหตุผล)
const REQUEST_TYPES = [
  { value: 'forgot', label: 'ลืมลงเวลา', icon: <ClockCircleOutlined /> },
  { value: 'offsite', label: 'ปฏิบัติงานนอกสถานที่', icon: <EnvironmentOutlined /> },
];
const typeOf = (item) => (item?.type === 'ปฏิบัติงานนอกสถานที่' ? 'offsite' : 'forgot');

// ปุ่มตัวเลือกแบบการ์ด เลือกได้ทีละหนึ่ง (หน้าตาเดียวกับตัวเลือก "การขอลงเวลา")
function OptionCard({ selected, onClick, icon, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        border: selected ? '1px solid var(--ok)' : '1px solid var(--border)',
        borderRadius: 6,
        padding: '8px 16px',
        cursor: 'pointer',
        fontFamily: 'var(--sans)',
        fontSize: 14,
        color: selected ? 'var(--ok)' : 'var(--text-dark)',
        backgroundColor: selected ? 'var(--ok-bg)' : 'var(--surface)',
        fontWeight: selected ? 500 : 'normal',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export default function AttendanceRequestPage() {
  const [draft, setDraft] = useState(INITIAL_FILTER); // ค่าที่กำลังเลือก
  const [filter, setFilter] = useState(INITIAL_FILTER); // ค่าที่ใช้กรองจริง (กดค้นหาแล้ว)
  const { year, month } = filter;
  const [viewMode, setViewMode] = useState('list'); // 'list' หรือ 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // สถานะประเภทการขอลงเวลาในหน้าฟอร์ม: 'normal' = ขอลงเวลา (1 ช่อง), 'full' = ขอลงเวลาทั้งวัน (2 ช่อง)
  const [reqOption, setReqOption] = useState('normal');
  // ประเภทคำขอ: 'forgot' = ลืมลงเวลา, 'offsite' = ปฏิบัติงานนอกสถานที่
  const [requestType, setRequestType] = useState('forgot');

  // จำลองข้อมูลประวัติการขอลงเวลาทั้งหมด[cite: 11]
  const [leaveData] = useState([
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
        return <Tag color="warning">รออนุมัติ</Tag>;
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
    setRequestType(typeOf(item));
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
    setRequestType('forgot');
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
              <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: 'var(--white)' }} onClick={handleBackToList} />
              <Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>
                รายละเอียดคำขอลงเวลา
              </Text>
            </Space>
          }
          styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
          style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.08)' }}
        >
          {/* ระยะขอบด้านในของฟอร์ม: จอแคบตัดออกให้ช่องกรอกกว้างขึ้น */}
          <style>{`
            .req-form { padding: 10px 20px; }
            @media (max-width: 575.98px) { .req-form { padding: 0; } }
          `}</style>
          <div className="req-form">
            {/* ประเภทคำขอ: ลืมลงเวลา / ปฏิบัติงานนอกสถานที่ (เลือกก่อนกรอกเหตุผล) */}
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: 8 }}>ประเภทคำขอ</Text>
              <Row gutter={[16, 8]}>
                {REQUEST_TYPES.map((t) => (
                  <Col xs={24} sm={12} md={6} key={t.value}>
                    <OptionCard selected={requestType === t.value} onClick={() => setRequestType(t.value)} icon={t.icon}>
                      {t.label}
                    </OptionCard>
                  </Col>
                ))}
              </Row>
            </div>

            {/* ส่วนเหตุผลการขอลงเวลา และสถานที่ (เปลี่ยนตามประเภทคำขอ) */}
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: 8 }}>สถาที่ลงเวลา</Text>
              <Row gutter={[16, 8]}>
                
                <Col xs={24} md={12}>
                  {requestType === 'offsite' ? (
                    // ปฏิบัติงานนอกสถานที่: ระบุสถานที่เอง
                    <Input
                      key={`location-${selectedItem?.id}`}
                      prefix={<EnvironmentOutlined style={{ color: 'var(--text-muted)' }} />}
                      defaultValue={typeOf(selectedItem) === 'offsite' ? selectedItem?.location : ''}
                      placeholder="ระบุสถานที่ปฏิบัติงาน"
                      aria-label="สถานที่ปฏิบัติงาน"
                      style={{ borderRadius: 6 }}
                    />
                  ) : (
                    // ลืมลงเวลา: ใช้สถานที่ลงเวลาปกติ
                    <div style={{
                      border: '1px solid var(--ok)',
                      borderRadius: 6,
                      padding: '6px 16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      color: 'var(--ok)',
                      fontWeight: '500',
                      backgroundColor: 'var(--ok-bg)'
                    }}>
                      <EnvironmentOutlined />
                      <span>{typeOf(selectedItem) === 'forgot' && selectedItem?.location ? selectedItem.location : 'อาคาร สลน.'}</span>
                    </div>
                  )}
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
                      border: reqOption === 'normal' ? '1px solid var(--ok)' : '1px solid var(--border)', 
                      borderRadius: 6, 
                      padding: '8px 16px', 
                      textAlign: 'center',
                      cursor: 'pointer',
                      color: reqOption === 'normal' ? 'var(--ok)' : 'var(--text-dark)',
                      backgroundColor: reqOption === 'normal' ? 'var(--ok-bg)' : 'var(--surface)',
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
                      border: reqOption === 'full' ? '1px solid var(--ok)' : '1px solid var(--border)', 
                      borderRadius: 6, 
                      padding: '8px 16px', 
                      textAlign: 'center',
                      cursor: 'pointer',
                      color: reqOption === 'full' ? 'var(--ok)' : 'var(--text-dark)',
                      backgroundColor: reqOption === 'full' ? 'var(--ok-bg)' : 'var(--surface)',
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
                <Text strong style={{ fontSize: '13px', color: 'var(--ok)' }}>รายวันที่ขอ · 1 วัน</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>เวลาเริ่มต้นจากการตั้งค่า 09:00–18:00 น.</Text>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '16px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                
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
                  backgroundColor: 'var(--ok)', 
                  borderColor: 'var(--ok)', 
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
          style={{ backgroundColor: 'var(--navy-1)', borderColor: 'var(--navy-1)', fontWeight: '500' }}
        >
          เพิ่ม
        </Button>
      </div>

      <FilterPanel
        onSearch={() => setFilter(draft)}
        onReset={() => {
          setDraft(INITIAL_FILTER);
          setFilter(INITIAL_FILTER);
        }}
      >
        <FilterField label="ปี">
          <Select value={draft.year} onChange={value => setDraft(d => ({ ...d, year: value }))}>
            <Option value="all">ทุกปี</Option>
            <Option value="2026">2026</Option>
            <Option value="2025">2025</Option>
          </Select>
        </FilterField>
        <FilterField label="เดือน">
          <Select value={draft.month} onChange={value => setDraft(d => ({ ...d, month: value }))}>
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
        </FilterField>
      </FilterPanel>

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
                    <CalendarOutlined style={{ marginRight: 8, color: 'var(--navy-3)' }} />
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