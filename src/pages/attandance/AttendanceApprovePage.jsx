import { useRef, useState } from 'react';
import {
  Card, Select, Row, Col, Tag, Space, Typography, Empty, Button, Input, DatePicker, TimePicker, Avatar, Popconfirm, message,
} from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import FilterPanel, { FilterField } from '../../components/FilterPanel';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

// หน้า "อนุมัติลงเวลา" — ผู้อนุมัติดูคำขอลงเวลาของเจ้าหน้าที่ แล้วอนุมัติ/ไม่อนุมัติ
// หน้ารายการและหน้ารายละเอียดหน้าตาเหมือน AttendanceRequestPage แต่ช่องทั้งหมดแก้ไขไม่ได้
// ต้นแบบ: ผลการพิจารณาเก็บในหน่วยความจำ (refresh แล้วกลับเป็นข้อมูลตั้งต้น)

const INITIAL_FILTER = { year: '2026', month: 'all' };

const REQUEST_TYPES = [
  { value: 'forgot', label: 'ลืมลงเวลา', icon: <ClockCircleOutlined /> },
  { value: 'offsite', label: 'ปฏิบัติงานนอกสถานที่', icon: <EnvironmentOutlined /> },
];
const typeOf = (item) => (item?.type === 'ปฏิบัติงานนอกสถานที่' ? 'offsite' : 'forgot');
const isFullDay = (item) => item?.type?.includes('ทั้งวัน');

// คำขอของเจ้าหน้าที่ (ข้อมูลจำลอง) — เก็บนอก component ให้ผลอนุมัติคงอยู่ระหว่างเปลี่ยนหน้า
let requests = [
  { id: 1, staff: 'นาย xxx xxx', staffId: '40501', dept: 'กองบริหารงานทั่วไป', type: 'ขอลงเวลา', startDate: '2026-11-02', startTime: '08:30', endTime: '17:30', reason: 'ลืมลงเวลาเข้างาน', location: 'อาคาร สลน.', status: 'pending', year: '2026', month: '11' },
  { id: 2, staff: 'นางสาว xxx xxx', staffId: '40502', dept: 'กองสารสนเทศ', type: 'ปฏิบัติงานนอกสถานที่', startDate: '2026-10-30', startTime: '09:00', endTime: '18:00', reason: 'ประชุมร่วมกับกระทรวงการคลัง', location: 'กระทรวงการคลัง', status: 'pending', year: '2026', month: '10' },
  { id: 3, staff: 'นาย xxx xxx', staffId: '40503', dept: 'สำนักเลขาธิการ', type: 'ขอลงเวลาทั้งวัน', startDate: '2026-10-28', startTime: '09:00', endTime: '18:00', reason: 'ลืมลงเวลาทั้งวัน', location: 'อาคาร สลน.', status: 'pending', year: '2026', month: '10' },
  { id: 4, staff: 'นาง xxx xxx', staffId: '40504', dept: 'กองบริหารงานทั่วไป', type: 'ปฏิบัติงานนอกสถานที่', startDate: '2026-10-20', startTime: '08:30', endTime: '17:30', reason: 'ติดต่อกระทรวงพาณิชย์', location: 'กระทรวงพาณิชย์', status: 'approved', approverNote: 'อนุมัติตามหนังสือเชิญประชุม', year: '2026', month: '10' },
  { id: 5, staff: 'นาย xxx xxx', staffId: '40505', dept: 'กองสารสนเทศ', type: 'ขอลงเวลา', startDate: '2026-10-15', startTime: '08:30', endTime: '17:30', reason: 'ระบบลงเวลาขัดข้อง', location: 'อาคาร สลน.', status: 'rejected', approverNote: 'ไม่พบบันทึกระบบขัดข้องในวันดังกล่าว', year: '2026', month: '10' },
];

const STATUS_TAG = {
  approved: { color: 'success', label: 'อนุมัติ' },
  pending: { color: 'warning', label: 'รออนุมัติ' },
  rejected: { color: 'error', label: 'ไม่อนุมัติ' },
};
const renderStatusTag = (status) => {
  const s = STATUS_TAG[status];
  return s ? <Tag color={s.color} style={{ margin: 0 }}>{s.label}</Tag> : <Tag>ไม่ระบุ</Tag>;
};

// การ์ดตัวเลือกแบบอ่านอย่างเดียว (หน้าตาเดียวกับหน้าขอลงเวลา ตัวที่เลือกไว้ยังเห็นชัด)
function ReadOnlyChoice({ selected, icon, children }) {
  return (
    <div
      aria-disabled="true"
      aria-checked={selected}
      role="radio"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        border: selected ? '1px solid var(--ok)' : '1px solid var(--border)',
        borderRadius: 6,
        padding: '8px 16px',
        cursor: 'not-allowed',
        fontSize: 14,
        color: selected ? 'var(--ok)' : 'var(--text-muted)',
        backgroundColor: selected ? 'var(--ok-bg)' : 'var(--bg)',
        fontWeight: selected ? 500 : 'normal',
        opacity: selected ? 1 : 0.7,
      }}
    >
      {icon}
      {children}
    </div>
  );
}

function SectionLabel({ children, color }) {
  return (
    <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: 8, color }}>
      {children}
    </Text>
  );
}

/* ---------------- หน้ารายละเอียด (อ่านอย่างเดียว + อนุมัติ/ไม่อนุมัติ) ---------------- */
function ApproveDetail({ item, onBack, onDecide }) {
  const requestType = typeOf(item);
  const fullDay = isFullDay(item);
  const decided = item.status !== 'pending';
  // หมายเหตุผู้อนุมัติ — พิมพ์ได้ระหว่างรออนุมัติ บันทึกพร้อมผลการพิจารณา
  const [approverNote, setApproverNote] = useState(item.approverNote || '');
  // ไม่อนุมัติต้องระบุหมายเหตุ — กดแล้วยังว่างจะแจ้งเตือนที่ช่องแทนการเปิดหน้าต่างยืนยัน
  const [noteError, setNoteError] = useState(false);
  const noteRef = useRef(null);
  const noteMissing = !approverNote.trim();

  const handleRejectClick = () => {
    if (decided || !noteMissing) return;
    setNoteError(true);
    noteRef.current?.focus();
    message.warning('กรุณาระบุหมายเหตุผู้อนุมัติก่อนกดไม่อนุมัติ');
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      <Card
        className="appr-card"
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: 'var(--white)' }} onClick={onBack} aria-label="กลับ" />
            <Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>รายละเอียดคำขอลงเวลา</Text>
          </Space>
        }
        // สถานะคำขอ มุมขวาบน ระดับเดียวกับหัวข้อ
        extra={renderStatusTag(item.status)}
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.08)' }}
      >
        <style>{`
          .appr-card .ant-card-head-title { white-space: normal; }
          .appr-card .ant-card-head-title .ant-space { display: flex; }
          .appr-card .ant-card-head-title .ant-space-item:last-child { min-width: 0; }
          .req-form { padding: 10px 20px; }
          @media (max-width: 575.98px) { .req-form { padding: 0; } }
          .appr-staff { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); }
          .appr-staff .ant-avatar { flex: none; background: var(--navy-tint); color: var(--navy-3); }
          .appr-staff-name { font-weight: 600; color: var(--text-dark); }
          .appr-staff-sub { font-size: 12.5px; color: var(--text-muted); }
          .appr-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
          .appr-actions .ant-btn { width: 100%; max-width: 220px; height: 45px; font-weight: bold; font-size: 15px; border-radius: 8px; }
          .appr-btn-approve.ant-btn:not(:disabled) { background: var(--ok-solid); border-color: var(--ok-solid); color: #fff; }
          .appr-btn-approve.ant-btn:not(:disabled):hover { background: var(--ok) !important; border-color: var(--ok) !important; color: #fff !important; filter: brightness(1.08); }
        `}</style>

        <div className="req-form">
          {/* ประเภทคำขอ */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>ประเภทคำขอ</SectionLabel>
            <Row gutter={[16, 8]} role="radiogroup" aria-label="ประเภทคำขอ" aria-readonly="true">
              {REQUEST_TYPES.map((t) => (
                <Col xs={24} sm={12} md={6} key={t.value}>
                  <ReadOnlyChoice selected={requestType === t.value} icon={t.icon}>{t.label}</ReadOnlyChoice>
                </Col>
              ))}
            </Row>
          </div>

          {/* ชื่อเจ้าหน้าที่ (ก่อนสถานที่ลงเวลา) */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>เจ้าหน้าที่</SectionLabel>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <div className="appr-staff">
                  <Avatar size={40} icon={<UserOutlined />} />
                  <div>
                    <div className="appr-staff-name">{item.staff} ({item.staffId})</div>
                    <div className="appr-staff-sub">{item.dept}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* สถานที่ลงเวลา */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>สถานที่ลงเวลา</SectionLabel>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                {requestType === 'offsite' ? (
                  <Input
                    disabled
                    prefix={<EnvironmentOutlined style={{ color: 'var(--text-muted)' }} />}
                    value={item.location}
                    aria-label="สถานที่ปฏิบัติงาน"
                    style={{ borderRadius: 6 }}
                  />
                ) : (
                  <div style={{
                    border: '1px solid var(--ok)',
                    borderRadius: 6,
                    padding: '6px 16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--ok)',
                    fontWeight: '500',
                    backgroundColor: 'var(--ok-bg)',
                  }}>
                    <EnvironmentOutlined />
                    <span>{item.location}</span>
                  </div>
                )}
              </Col>
            </Row>
          </div>

          {/* การขอลงเวลา */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>การขอลงเวลา</SectionLabel>
            <Row gutter={[16, 8]} role="radiogroup" aria-label="การขอลงเวลา" aria-readonly="true">
              <Col xs={12} md={6}><ReadOnlyChoice selected={!fullDay}>ขอลงเวลา</ReadOnlyChoice></Col>
              <Col xs={12} md={6}><ReadOnlyChoice selected={fullDay}>ขอลงเวลาทั้งวัน</ReadOnlyChoice></Col>
            </Row>
          </div>

          {/* วันที่และเวลาที่ขอ */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 4 }}>
              <SectionLabel color="var(--ok)">รายวันที่ขอ · 1 วัน</SectionLabel>
              <Text type="secondary" style={{ fontSize: '12px' }}>เวลาเริ่มต้นจากการตั้งค่า 09:00–18:00 น.</Text>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '16px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <DatePicker disabled value={dayjs(item.startDate)} format="DD/MM/YYYY" style={{ width: '220px' }} />
              {fullDay ? (
                <Space>
                  <TimePicker disabled value={dayjs(item.startTime, 'HH:mm')} format="HH:mm" />
                  <span>-</span>
                  <TimePicker disabled value={dayjs(item.endTime, 'HH:mm')} format="HH:mm" />
                </Space>
              ) : (
                <TimePicker disabled value={dayjs(item.startTime, 'HH:mm')} format="HH:mm" />
              )}
            </div>
            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: 6 }}>
              ทุกวันในรายการเป็นคำขอเดียวกัน ผู้อนุมัติพิจารณาครั้งเดียว
            </Text>
          </div>

          {/* รายละเอียด / หมายเหตุ */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>รายละเอียด/หมายเหตุ</SectionLabel>
            <TextArea disabled rows={4} value={item.reason} style={{ borderRadius: 8 }} />
          </div>

          {/* หมายเหตุผู้อนุมัติ */}
          <div style={{ marginBottom: 30 }}>
            <SectionLabel>
              หมายเหตุผู้อนุมัติ
              {!decided && (
                <Text type="secondary" style={{ fontWeight: 'normal', fontSize: 12, marginLeft: 6 }}>
                  (<span style={{ color: 'var(--danger)' }}>*</span> จำเป็นเมื่อไม่อนุมัติ)
                </Text>
              )}
            </SectionLabel>
            <TextArea
              ref={noteRef}
              rows={3}
              value={approverNote}
              onChange={(e) => setApproverNote(e.target.value)}
              disabled={decided}
              maxLength={500}
              showCount={!decided}
              status={noteError && noteMissing ? 'error' : undefined}
              placeholder={decided ? '-' : 'ระบุหมายเหตุหรือเหตุผลการพิจารณา (จำเป็นเมื่อไม่อนุมัติ)'}
              aria-label="หมายเหตุผู้อนุมัติ"
              aria-invalid={noteError && noteMissing}
              style={{ borderRadius: 8 }}
            />
            {noteError && noteMissing && !decided && (
              <Text type="danger" style={{ display: 'block', fontSize: 12.5, marginTop: 4 }}>
                กรุณาระบุหมายเหตุ เมื่อไม่อนุมัติคำขอ
              </Text>
            )}
          </div>

          {/* ปุ่มพิจารณา (แทนปุ่มยื่นคำขอ) */}
          <div className="appr-actions">
            <Popconfirm
              title="ยืนยันการอนุมัติคำขอนี้?"
              okText="อนุมัติ"
              cancelText="ยกเลิก"
              onConfirm={() => onDecide(item.id, 'approved', approverNote.trim())}
              disabled={decided}
            >
              <Button className="appr-btn-approve" type="primary" icon={<CheckOutlined />} disabled={decided} size="large">
                อนุมัติ
              </Button>
            </Popconfirm>
            <Popconfirm
              title="ยืนยันไม่อนุมัติคำขอนี้?"
              okText="ไม่อนุมัติ"
              okButtonProps={{ danger: true }}
              cancelText="ยกเลิก"
              onConfirm={() => onDecide(item.id, 'rejected', approverNote.trim())}
              disabled={decided || noteMissing}
            >
              <Button type="primary" danger icon={<CloseOutlined />} disabled={decided} size="large" onClick={handleRejectClick}>
                ไม่อนุมัติ
              </Button>
            </Popconfirm>
          </div>
          {decided && (
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 10, fontSize: 12.5 }}>
              คำขอนี้พิจารณาแล้ว
            </Text>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- หน้ารายการ ---------------- */
export default function AttendanceApprovePage() {
  const [draft, setDraft] = useState(INITIAL_FILTER);
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [items, setItems] = useState(requests);
  const [selectedId, setSelectedId] = useState(null);

  const { year, month } = filter;
  const filteredData = items.filter((item) => (year === 'all' || item.year === year) && (month === 'all' || item.month === month));
  const selected = items.find((x) => x.id === selectedId);

  const handleDecide = (id, status, approverNote) => {
    requests = requests.map((x) => (x.id === id ? { ...x, status, approverNote } : x));
    setItems(requests);
    message.success(status === 'approved' ? 'อนุมัติคำขอลงเวลาแล้ว' : 'ไม่อนุมัติคำขอลงเวลาแล้ว');
  };

  if (selected) {
    return <ApproveDetail item={selected} onBack={() => setSelectedId(null)} onDecide={handleDecide} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <Title level={4} style={{ margin: 0 }}>อนุมัติลงเวลา</Title>
      </div>

      <FilterPanel
        onSearch={() => setFilter(draft)}
        onReset={() => {
          setDraft(INITIAL_FILTER);
          setFilter(INITIAL_FILTER);
        }}
      >
        <FilterField label="ปี">
          <Select value={draft.year} onChange={(value) => setDraft((d) => ({ ...d, year: value }))}>
            <Option value="all">ทุกปี</Option>
            <Option value="2026">2026</Option>
            <Option value="2025">2025</Option>
          </Select>
        </FilterField>
        <FilterField label="เดือน">
          <Select value={draft.month} onChange={(value) => setDraft((d) => ({ ...d, month: value }))}>
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
          <Empty description="ไม่พบคำขอลงเวลาในช่วงเวลาที่เลือก" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredData.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card
                title={item.type}
                extra={renderStatusTag(item.status)}
                hoverable
                onClick={() => setSelectedId(item.id)}
                style={{ height: '100%', borderRadius: 8, cursor: 'pointer' }}
              >
                <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                  <Text>
                    <UserOutlined style={{ marginRight: 8, color: 'var(--navy-3)' }} />
                    <strong>เจ้าหน้าที่:</strong> {item.staff} ({item.staffId})
                  </Text>
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
