import { useMemo, useState } from 'react';
import { Card, Row, Col, Button, Select, Input, Table, Typography, Space, Popover, Modal, message } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import FilterPanel, { FilterField } from '../components/FilterPanel';
import { WORK_TIMES, workTimeLabel } from '../pages/attandance_setting/workTimeData';

const { Text } = Typography;
const { Option } = Select;

// ปฏิทินสรุปการมาปฏิบัติราชการ — ตารางเจ้าหน้าที่ × วันในเดือน
// ต้นแบบ: เดือน พ.ย.–ธ.ค. 2569 ใช้ข้อมูลกำหนดเอง เดือนอื่นสุ่มแบบคงที่จากวันที่ ยังไม่เชื่อม backend
// คลิกช่องวันเพื่อกำหนดตารางการทำงานของวันนั้น (เก็บในหน่วยความจำ refresh แล้วกลับเป็นค่าตั้งต้น)

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const LOCATION = 'The Government House';

// วันหยุดราชการ (ตัวอย่าง ปี 2569)
const HOLIDAYS = {
  '2026-01-01': 'วันขึ้นปีใหม่',
  '2026-04-06': 'วันจักรี',
  '2026-04-13': 'วันสงกรานต์',
  '2026-04-14': 'วันสงกรานต์',
  '2026-04-15': 'วันสงกรานต์',
  '2026-05-01': 'วันแรงงานแห่งชาติ',
  '2026-06-03': 'วันเฉลิมพระชนมพรรษาสมเด็จพระราชินี',
  '2026-07-28': 'วันเฉลิมพระชนมพรรษา ร.10',
  '2026-08-12': 'วันแม่แห่งชาติ',
  '2026-10-13': 'วันนวมินทรมหาราช',
  '2026-10-23': 'วันปิยมหาราช',
  '2026-12-05': 'วันพ่อแห่งชาติ',
  '2026-12-10': 'วันรัฐธรรมนูญ',
  '2026-12-31': 'วันสิ้นปี',
};

// สถานะรายวัน → สัญลักษณ์และสีตามธีมระบบ (ใช้ทั้งในตารางและคำอธิบายสี)
const STATUS = {
  normal: { label: 'ลงเวลาปกติ', dot: 'var(--ok)' },
  late: { label: 'เข้างานสาย', dot: 'var(--warn)' },
  early: { label: 'ออกงานก่อนเวลา', dot: 'var(--gold)' },
  incomplete: { label: 'ลงเวลาไม่ครบ', dot: 'var(--text-muted)' },
  sick: { label: 'ลาป่วย', letter: 'ป' },
  vacation: { label: 'ลาพักร้อน', letter: 'พ' },
  absent: { label: 'ขาดงาน', cross: true },
};

const LEAVE_REASONS = {
  sick: ['มีไข้ ปวดศีรษะ', 'พบแพทย์ตามนัด', 'ท้องเสีย'],
  vacation: ['ท่องเที่ยวกับครอบครัว', 'ธุระส่วนตัวต่างจังหวัด', 'พักผ่อนประจำปี'],
};

// เจ้าหน้าที่ + ตารางการทำงานตั้งต้น + ข้อมูลจำลอง พ.ย./ธ.ค. 2569 (วันทำงานที่ไม่ระบุ = ลงเวลาปกติ)
const STAFF = [
  {
    key: '1', name: 'นาย xxx xxx', code: '10101', workTime: '2',
    mock: {
      '2026-11': { 4: 'late', 9: 'sick', 10: 'sick', 13: 'absent', 20: 'vacation', 24: 'early', 26: 'incomplete' },
      '2026-12': { 2: 'late', 8: 'vacation', 9: 'vacation', 15: 'early', 18: 'absent', 29: 'sick' },
    },
  },
  {
    key: '2', name: 'นาย xxx xxx', code: '10102', workTime: '2',
    mock: {
      '2026-11': { 3: 'late', 6: 'absent', 12: 'vacation', 17: 'late', 25: 'sick', 30: 'incomplete' },
      '2026-12': { 1: 'sick', 4: 'late', 11: 'early', 16: 'vacation', 17: 'vacation', 22: 'absent' },
    },
  },
  {
    key: '3', name: 'นาย xxx xxx', code: '20202', workTime: '2',
    mock: {
      '2026-11': { 5: 'vacation', 11: 'early', 16: 'late', 19: 'absent', 23: 'sick', 27: 'late' },
      '2026-12': { 3: 'absent', 9: 'late', 14: 'sick', 21: 'vacation', 24: 'incomplete', 28: 'late' },
    },
  },
  {
    key: '4', name: 'นางสาว xxx xxx', code: '20404', workTime: '1',
    mock: {
      '2026-11': { 2: 'early', 10: 'late', 18: 'vacation', 19: 'vacation', 24: 'absent', 30: 'sick' },
      '2026-12': { 7: 'late', 8: 'sick', 17: 'absent', 23: 'early', 25: 'vacation', 30: 'late' },
    },
  },
  {
    key: '5', name: 'นางสาว xxx xxx', code: '20601', workTime: '2',
    mock: {
      '2026-11': { 4: 'absent', 9: 'late', 13: 'sick', 20: 'incomplete', 26: 'vacation', 27: 'vacation' },
      '2026-12': { 2: 'vacation', 11: 'late', 15: 'sick', 18: 'early', 23: 'absent', 29: 'late' },
    },
  },
];

// ตัวเลขสุ่มแบบคงที่ (เปิดกี่ครั้งก็ได้ผลเดิม)
const seeded = (key, salt = 0) => {
  let h = 2166136261 ^ salt;
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};
const pad = (n) => String(n).padStart(2, '0');
const toMin = (hhmm) => (/^\d{2}:\d{2}$/.test(hhmm || '') ? Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3)) : null);
const fmt = (m) => {
  const v = ((m % 1440) + 1440) % 1440;
  return `${pad(Math.floor(v / 60))}:${pad(v % 60)}`;
};
const workTimeOf = (key) => WORK_TIMES.find((w) => w.key === key) || WORK_TIMES[1];

// เวลาเข้า/ออกตามตารางการทำงาน — แบบกำหนดชั่วโมงใช้ 08:30 + จำนวนชั่วโมง
function scheduleTimes(w) {
  const inMin = toMin(w.timeIn) ?? 8 * 60 + 30;
  const outMin = toMin(w.timeOut) ?? inMin + (parseInt(w.timeIn, 10) || 8) * 60;
  return { inMin, outMin };
}

function statusOf(staff, d, today) {
  const key = d.format('YYYY-MM-DD');
  if (d.day() === 0 || d.day() === 6) return { off: 'weekend' };
  if (HOLIDAYS[key]) return { off: 'holiday', holidayName: HOLIDAYS[key] };
  const mock = staff.mock[d.format('YYYY-MM')];
  if (mock) return { status: mock[d.date()] || 'normal' };
  if (!d.isBefore(today, 'day')) return {}; // ยังไม่ถึง
  const r = seeded(`${staff.key}|${key}`, 3);
  if (r < 0.7) return { status: 'normal' };
  if (r < 0.78) return { status: 'late' };
  if (r < 0.83) return { status: 'early' };
  if (r < 0.87) return { status: 'incomplete' };
  if (r < 0.91) return { status: 'sick' };
  if (r < 0.95) return { status: 'vacation' };
  return { status: 'absent' };
}

// รายละเอียดการลงเวลาของวันนั้นตามสถานะและตารางการทำงาน
function attendanceOf(status, w, seedKey) {
  const { inMin, outMin } = scheduleTimes(w);
  const rnd = (salt, from, to) => Math.floor(from + seeded(seedKey, salt) * (to - from));
  switch (status) {
    case 'normal': return { checkIn: fmt(inMin - rnd(1, 5, 45)), checkOut: fmt(outMin + rnd(2, 1, 60)) };
    case 'late': return { checkIn: fmt(inMin + rnd(1, 5, 60)), checkOut: fmt(outMin + rnd(2, 1, 40)) };
    case 'early': return { checkIn: fmt(inMin - rnd(1, 5, 40)), checkOut: fmt(outMin - rnd(2, 15, 90)) };
    case 'incomplete': return { checkIn: fmt(inMin - rnd(1, 5, 40)), checkOut: null };
    default: return { checkIn: null, checkOut: null };
  }
}

function StatusMark({ status, size = 10 }) {
  const s = STATUS[status];
  if (!s) return null;
  if (s.cross) return <span className="wc-cross" style={{ fontSize: size + 6 }}>✕</span>;
  if (s.letter) return <span className={`wc-leave ${status}`}>{s.letter}</span>;
  return <span className="wc-dot" style={{ width: size, height: size, background: s.dot }} />;
}

// รายละเอียดวัน (ใช้ทั้ง popover ตอนชี้ และในหน้าต่างกำหนดตารางการทำงาน)
function DayDetail({ info, wide }) {
  const { status, workTime, checkIn, checkOut, seedKey } = info;
  const s = STATUS[status];
  if (!s) return null;
  if (s.letter) {
    const reasons = LEAVE_REASONS[status];
    return (
      <div className="wc-detail" style={{ width: wide ? 'auto' : 210, textAlign: 'center' }}>
        <div className="wc-detail-title">{s.label} (ทั้งวัน)</div>
        <div className="wc-detail-sub">{reasons[Math.floor(seeded(seedKey, 9) * reasons.length)]}</div>
      </div>
    );
  }
  const block = (label, value, located, okTone) => (
    <div className="wc-detail-col">
      <div className="wc-detail-loc">{located ? LOCATION : '-'}</div>
      <div className="wc-detail-sub">{label}</div>
      <div className="wc-detail-time" style={{ color: value ? (okTone ? 'var(--ok)' : 'var(--danger)') : 'var(--text-muted)' }}>{value || '-'}</div>
    </div>
  );
  const { inMin, outMin } = scheduleTimes(workTime);
  return (
    <div className="wc-detail" style={{ width: wide ? 'auto' : 220 }}>
      <div className="wc-detail-title">{s.label}</div>
      <div className="wc-detail-cols">
        {block(`ลงเวลาเข้า (${fmt(inMin)})`, checkIn, !!checkIn, status !== 'late')}
        {block(`ลงเวลาออก (${fmt(outMin)})`, checkOut, !!checkOut, status !== 'early')}
      </div>
    </div>
  );
}

export default function RptWorkCalendarPage() {
  const today = useMemo(() => dayjs(), []);
  const [month, setMonth] = useState(() => today.startOf('month'));
  // ตารางการทำงานรายวันที่กำหนดเอง: { 'staffKey|YYYY-MM-DD': workTimeKey }
  const [overrides, setOverrides] = useState({});
  const [editing, setEditing] = useState(null); // { staff, date }
  const [pickedWorkTime, setPickedWorkTime] = useState(null);

  const days = useMemo(
    () => Array.from({ length: month.daysInMonth() }, (_, i) => month.add(i, 'day')),
    [month],
  );

  const workTimeFor = (staff, d) => workTimeOf(overrides[`${staff.key}|${d.format('YYYY-MM-DD')}`] || staff.workTime);

  const dayInfo = (staff, d) => {
    const seedKey = `${staff.key}|${d.format('YYYY-MM-DD')}`;
    const base = statusOf(staff, d, today);
    const workTime = workTimeFor(staff, d);
    return { ...base, workTime, seedKey, custom: Boolean(overrides[seedKey]), ...attendanceOf(base.status, workTime, seedKey) };
  };

  const openEditor = (staff, d) => {
    setEditing({ staff, date: d });
    setPickedWorkTime(workTimeFor(staff, d).key);
  };

  const saveWorkTime = () => {
    if (!editing) return;
    const { staff, date } = editing;
    const k = `${staff.key}|${date.format('YYYY-MM-DD')}`;
    setOverrides((prev) => {
      const next = { ...prev };
      // เลือกกลับเป็นตารางตั้งต้นของเจ้าหน้าที่ = ไม่ต้องเก็บค่าที่กำหนดเอง
      if (pickedWorkTime === staff.workTime) delete next[k];
      else next[k] = pickedWorkTime;
      return next;
    });
    message.success(`บันทึกตารางการทำงานวันที่ ${date.format('D MMM BBBB')} แล้ว`);
    setEditing(null);
  };

  const columns = [
    {
      title: 'เจ้าหน้าที่',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 180,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '13px', display: 'block' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>{record.code} · {workTimeOf(record.workTime).name}</Text>
        </div>
      ),
    },
    ...days.map((d) => {
      const key = d.format('YYYY-MM-DD');
      const offDay = d.day() === 0 || d.day() === 6 || HOLIDAYS[key];
      return {
        title: (
          <div style={{ textAlign: 'center', lineHeight: '1.2', color: offDay ? 'var(--danger)' : undefined }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{d.date()}</div>
            <div style={{ fontSize: '10px', color: offDay ? 'var(--danger)' : 'var(--text-muted)' }}>{WEEKDAYS[d.day()]}</div>
          </div>
        ),
        key: `day_${key}`,
        align: 'center',
        width: 42,
        onCell: (record) => {
          const info = dayInfo(record, d);
          const tint = info.off === 'holiday' ? 'wc-holiday' : info.off === 'weekend' ? 'wc-weekend' : '';
          return {
            className: `wc-cell ${tint}${info.custom ? ' wc-custom' : ''}`,
            onClick: () => openEditor(record, d),
            title: info.holidayName,
          };
        },
        render: (_, record) => {
          const info = dayInfo(record, d);
          if (!info.status) return null;
          return (
            <Popover content={<DayDetail info={info} />} trigger="hover" placement="top">
              <div className="wc-mark"><StatusMark status={info.status} /></div>
            </Popover>
          );
        },
      };
    }),
  ];

  const editingInfo = editing ? dayInfo(editing.staff, editing.date) : null;

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .wc-table .ant-table-cell { padding: 6px 4px !important; }
        .wc-table td.wc-cell { position: relative; padding: 0 !important; height: 40px; cursor: pointer; transition: box-shadow 180ms var(--ease); }
        .wc-table td.wc-cell:hover { box-shadow: inset 0 0 0 2px var(--gold); }
        .wc-table td.wc-weekend { background: var(--border) !important; }
        .wc-table td.wc-holiday { background: var(--danger-bg) !important; }
        .wc-table td.wc-custom::after, .wc-legend .wc-custom-mark::after { content: ''; position: absolute; top: 0; right: 0; border-style: solid; border-width: 0 9px 9px 0; border-color: transparent var(--gold) transparent transparent; }
        .wc-mark { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; }
        .wc-dot { display: inline-block; border-radius: 50%; }
        .wc-cross { color: var(--danger); font-weight: bold; line-height: 1; }
        .wc-leave { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; font-size: 12px; font-weight: 700; line-height: 1; }
        .wc-leave.sick { background: var(--danger-bg); color: var(--danger); box-shadow: inset 0 0 0 1px var(--danger-border); }
        .wc-leave.vacation { background: var(--navy-tint); color: var(--navy-3); box-shadow: inset 0 0 0 1px var(--navy-3); }

        .wc-legend { margin-bottom: 16px; padding: 12px 16px; background: var(--surface); border-radius: 8px; border: 1px solid var(--border-soft); }
        .wc-legend-item { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-dark); }
        .wc-legend-icon { display: inline-grid; place-items: center; width: 22px; height: 22px; flex: none; }
        .wc-legend .wc-swatch { width: 18px; height: 14px; border-radius: 3px; }
        .wc-legend .wc-custom-mark { position: relative; width: 18px; height: 14px; border: 1px solid var(--border); border-radius: 3px; background: var(--surface); overflow: hidden; }

        .wc-detail { padding: 4px; }
        .wc-detail-title { font-weight: bold; font-size: 12.5px; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid var(--border-soft); text-align: center; }
        .wc-detail-cols { display: flex; font-size: 11px; }
        .wc-detail-col { flex: 1; text-align: center; padding: 0 4px; }
        .wc-detail-col + .wc-detail-col { border-left: 1px solid var(--border-soft); }
        .wc-detail-loc { font-weight: bold; color: var(--text-muted); }
        .wc-detail-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .wc-detail-time { font-weight: bold; font-size: 13px; margin-top: 2px; font-variant-numeric: tabular-nums; }

        .wc-modal-row { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--border-soft); font-size: 13.5px; }
        .wc-modal-row > :first-child { flex: none; width: 92px; color: var(--text-muted); }
        .wc-modal-field { margin-top: 16px; }
        .wc-modal-field label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 13px; color: var(--text-dark); }
        .wc-card .ant-card-head-title { white-space: normal; }
        @media (max-width: 575.98px) {
          .wc-card .ant-card-head-wrapper { flex-wrap: wrap; }
          .wc-card .ant-card-head-title { flex: 1 1 100%; padding: 12px 0 6px; }
          .wc-card .ant-card-extra { margin: 0 0 10px; }
        }
      `}</style>

      <Card
        className="wc-card"
        title={
          <Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>
            <CalendarOutlined /> ปฏิทินการเข้าทำงาน {month.format('MMMM BBBB')}
          </Text>
        }
        extra={
          <Space>
            <Button size="small" disabled={month.isSame(today, 'month')} onClick={() => setMonth(today.startOf('month'))} style={{ backgroundColor: 'var(--surface)', color: 'var(--text-dark)' }}>เดือนปัจจุบัน</Button>
            <Button size="small" aria-label="เดือนก่อนหน้า" icon={<LeftOutlined />} onClick={() => setMonth(month.subtract(1, 'month'))} style={{ backgroundColor: 'var(--surface)', color: 'var(--text-dark)' }} />
            <Button size="small" aria-label="เดือนถัดไป" icon={<RightOutlined />} onClick={() => setMonth(month.add(1, 'month'))} style={{ backgroundColor: 'var(--surface)', color: 'var(--text-dark)' }} />
          </Space>
        }
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.08)' }}
      >
        {/* ส่วน Filter ด้านบน */}
        <FilterPanel>
          <FilterField label="หน่วยงาน">
            <Select defaultValue="all" style={{ width: '100%' }}>
              <Option value="all">ทั้งหมด</Option>
              <Option value="sec">สำนักเลขาธิการ</Option>
            </Select>
          </FilterField>
          <FilterField label="ระดับตำแหน่ง">
            <Select defaultValue="all" style={{ width: '100%' }}>
              <Option value="all">ทั้งหมด</Option>
            </Select>
          </FilterField>
          <FilterField label="ตำแหน่ง">
            <Select defaultValue="all" style={{ width: '100%' }}>
              <Option value="all">ทั้งหมด</Option>
            </Select>
          </FilterField>
          <FilterField label="ค้นหา">
            <Input placeholder="ชื่อ, รหัส" />
          </FilterField>
        </FilterPanel>

        {/* คำอธิบายความหมายของสี — ครบทุกสถานะในตาราง */}
        <div className="wc-legend">
          <Text strong style={{ display: 'block', marginBottom: 8 }}>ความหมายของสี :</Text>
          <Row gutter={[16, 8]}>
            {Object.entries(STATUS).map(([k, s]) => (
              <Col xs={12} sm={8} md={6} key={k}>
                <span className="wc-legend-item">
                  <span className="wc-legend-icon"><StatusMark status={k} /></span>= {s.label}
                </span>
              </Col>
            ))}
            <Col xs={12} sm={8} md={6}>
              <span className="wc-legend-item">
                <span className="wc-legend-icon"><span className="wc-swatch" style={{ background: 'var(--border)' }} /></span>= วันหยุดประจำสัปดาห์
              </span>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <span className="wc-legend-item">
                <span className="wc-legend-icon"><span className="wc-swatch" style={{ background: 'var(--danger-bg)', boxShadow: 'inset 0 0 0 1px var(--danger-border)' }} /></span>= วันหยุดนักขัตฤกษ์
              </span>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <span className="wc-legend-item">
                <span className="wc-legend-icon"><span className="wc-custom-mark" /></span>= กำหนดตารางการทำงานรายวัน
              </span>
            </Col>
          </Row>
          <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
            ชี้ที่ช่องเพื่อดูรายละเอียด · คลิกช่องวันเพื่อกำหนดตารางการทำงาน
          </Text>
        </div>

        {/* ตารางปฏิทิน Matrix */}
        <Table
          className="wc-table"
          dataSource={STAFF}
          columns={columns}
          pagination={false}
          bordered
          size="small"
          scroll={{ x: 180 + days.length * 42 }}
        />
      </Card>

      {/* กำหนดตารางการทำงานของวันที่คลิก */}
      <Modal
        open={Boolean(editing)}
        title="กำหนดตารางการทำงาน"
        okText="บันทึก"
        cancelText="ยกเลิก"
        onOk={saveWorkTime}
        onCancel={() => setEditing(null)}
        destroyOnHidden
      >
        {editing && (
          <>
            <div className="wc-modal-row"><span>เจ้าหน้าที่</span><strong>{editing.staff.name} ({editing.staff.code})</strong></div>
            <div className="wc-modal-row"><span>วันที่</span><span>{editing.date.format('ddddที่ D MMMM BBBB')}</span></div>
            <div className="wc-modal-row">
              <span>สถานะ</span>
              {editingInfo.status ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <StatusMark status={editingInfo.status} /> {STATUS[editingInfo.status].label}
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>
                  {editingInfo.holidayName || (editingInfo.off === 'weekend' ? 'วันหยุดประจำสัปดาห์' : 'ยังไม่มีข้อมูลการลงเวลา')}
                </span>
              )}
            </div>
            {editingInfo.status && !STATUS[editingInfo.status].cross && (
              <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
                <DayDetail info={editingInfo} wide />
              </div>
            )}

            <div className="wc-modal-field">
              <label htmlFor="wc-worktime">ตารางการทำงาน</label>
              <Select
                id="wc-worktime"
                value={pickedWorkTime}
                onChange={setPickedWorkTime}
                style={{ width: '100%' }}
                options={WORK_TIMES.map((w) => ({ value: w.key, label: workTimeLabel(w) }))}
              />
              <Text type="secondary" style={{ display: 'block', marginTop: 6, fontSize: 12 }}>
                ตารางตั้งต้นของเจ้าหน้าที่: {workTimeLabel(workTimeOf(editing.staff.workTime))}
              </Text>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
