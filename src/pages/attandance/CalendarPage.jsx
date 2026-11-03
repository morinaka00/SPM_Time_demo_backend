import { useMemo, useState } from 'react';
import { Card, Row, Col, Button, Tooltip, Typography, Space } from 'antd';
import { LeftOutlined, RightOutlined, EnvironmentOutlined, HomeFilled, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

// ปฏิทินการทำงาน — layout ตามภาพตัวอย่าง (ตารางเดือน + สถานะรายวัน + WFH + รายละเอียดวันที่เลือก)
// ต้นแบบ: ข้อมูลการลงเวลาสร้างจำลองจากวันที่ (คงที่ทุกครั้งที่เปิด) ยังไม่เชื่อม backend

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const WORK_TIME = { in: '09:00', out: '18:00' };
const LOCATION = 'The Government House';

// สถานะรายวัน → ป้ายและโทนสีตามธีมระบบ กหฟก
const STATUS = {
  normal: { label: 'มาปกติ', tone: 'ok' },
  late: { label: 'มาสาย', tone: 'warn' },
  early: { label: 'กลับก่อน', tone: 'warn' },
  incomplete: { label: 'ลงเวลาไม่ครบ', tone: 'gold' },
  absent: { label: 'ขาดงาน', tone: 'danger' },
  leave: { label: 'ลา', tone: 'navy' },
  holiday: { label: 'วันหยุด', tone: 'idle' },
};

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

// ตัวเลขสุ่มแบบคงที่จากวันที่ (เปิดกี่ครั้งก็ได้ผลเดิม)
const seeded = (key, salt = 0) => {
  let h = 2166136261 ^ salt;
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return ((h >>> 0) % 1000) / 1000;
};
const pad = (n) => String(n).padStart(2, '0');
const timeAt = (key, salt, fromMin, toMin) => {
  const m = Math.floor(fromMin + seeded(key, salt) * (toMin - fromMin));
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

// ประเภทการลา → ไอคอนตัวอักษรในปฏิทิน
const LEAVE_TYPES = {
  sick: { label: 'ลาป่วย', short: 'ป' },
  vacation: { label: 'ลาพักร้อน', short: 'พ' },
};

// ข้อมูลจำลองแบบกำหนดเอง เดือน พ.ย.–ธ.ค. 2569 (วันทำงานที่ไม่ได้ระบุ = มาปกติ)
// sick/vacation = ลาทั้งวัน, ต่อท้าย -half = ลาครึ่งวันบ่าย
const MOCK_MONTHS = {
  '2026-11': {
    4: 'late', 9: 'sick', 10: 'sick', 13: 'absent', 17: 'late',
    20: 'vacation-half', 24: 'late', 26: 'absent', 27: 'vacation',
  },
  '2026-12': {
    2: 'late', 8: 'vacation', 9: 'vacation', 11: 'sick-half', 15: 'late',
    18: 'absent', 22: 'late', 24: 'vacation', 25: 'vacation', 29: 'sick',
  },
};

const normalRec = (rec) => ({ ...rec, status: 'normal', checkIn: timeAt(rec.key, 1, 7 * 60, 8 * 60 + 50), checkOut: timeAt(rec.key, 2, 18 * 60, 19 * 60 + 40) });
const lateRec = (rec) => ({ ...rec, status: 'late', checkIn: timeAt(rec.key, 1, 9 * 60 + 1, 10 * 60), checkOut: timeAt(rec.key, 2, 18 * 60, 19 * 60) });
const absentRec = (rec) => ({ ...rec, status: 'absent', wfh: null });
const leaveRec = (rec, kind, half) => ({
  ...rec,
  status: 'leave',
  wfh: null,
  checkIn: half ? timeAt(rec.key, 1, 7 * 60 + 30, 8 * 60 + 50) : null,
  checkOut: half ? '12:00' : null,
  leave: {
    kind,
    type: LEAVE_TYPES[kind].label,
    range: half ? '13:00 - 18:00' : 'ทั้งวัน',
    status: seeded(rec.key, 6) < 0.7 ? 'approved' : 'pending',
  },
});

function mockRecord(rec, code) {
  if (code === 'late') return lateRec(rec);
  if (code === 'absent') return absentRec(rec);
  if (code?.startsWith('sick') || code?.startsWith('vacation')) {
    const [kind, half] = code.split('-');
    return leaveRec(rec, kind, Boolean(half));
  }
  return normalRec(rec);
}

// ข้อมูลจำลองของแต่ละวัน
function dayRecord(d, today) {
  const key = d.format('YYYY-MM-DD');
  const weekend = d.day() === 0 || d.day() === 6;
  const holidayName = HOLIDAYS[key];
  const rec = { date: d, key, weekend, holidayName, status: null, checkIn: null, checkOut: null, wfh: null, leave: null };

  if (!weekend && !holidayName) {
    const w = seeded(key, 7);
    if (w < 0.55) rec.wfh = 'approved';
    else if (w < 0.6) rec.wfh = 'pending';
  }
  if (weekend) return rec;
  if (holidayName) return { ...rec, status: 'holiday' };

  // เดือนที่มีข้อมูลจำลองกำหนดเอง แสดงครบทั้งเดือน
  const mock = MOCK_MONTHS[d.format('YYYY-MM')];
  if (mock) return mockRecord(rec, mock[d.date()]);

  if (d.isAfter(today, 'day')) return rec; // ยังไม่ถึง

  if (d.isSame(today, 'day')) {
    return { ...rec, status: 'incomplete', checkIn: timeAt(key, 1, 7 * 60 + 40, 8 * 60 + 25), todayOpen: true };
  }

  const r = seeded(key, 3);
  if (r < 0.62) return normalRec(rec);
  if (r < 0.72) return lateRec(rec);
  if (r < 0.78) return { ...rec, status: 'early', checkIn: timeAt(key, 1, 7 * 60 + 30, 8 * 60 + 50), checkOut: timeAt(key, 2, 15 * 60, 17 * 60 + 50) };
  if (r < 0.84) return { ...rec, status: 'incomplete', checkIn: timeAt(key, 1, 7 * 60 + 30, 8 * 60 + 50) };
  if (r < 0.92) return leaveRec(rec, seeded(key, 5) < 0.5 ? 'sick' : 'vacation', seeded(key, 4) < 0.5);
  return absentRec(rec);
}

function monthCells(month, today) {
  const start = month.startOf('month');
  const blanks = start.day(); // วันอาทิตย์ = 0
  const cells = Array.from({ length: blanks }, () => null);
  for (let i = 0; i < month.daysInMonth(); i += 1) cells.push(dayRecord(start.add(i, 'day'), today));
  while (cells.length % 7) cells.push(null);
  return cells;
}

/* ---------------- ชิ้นส่วนย่อย ---------------- */
function StatusChip({ status, small, label }) {
  const s = STATUS[status];
  return <span className={`cal-chip tone-${s.tone}${small ? ' small' : ''}`}>{label || s.label}</span>;
}

// ไอคอนการลา: ป = ลาป่วย, พ = ลาพักร้อน
function LeaveBadge({ kind, size = 26 }) {
  const t = LEAVE_TYPES[kind];
  return (
    <Tooltip title={t.label}>
      <span className={`cal-badge cal-leave ${kind}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.5) }} aria-label={t.label}>
        {t.short}
      </span>
    </Tooltip>
  );
}

function WfhBadge({ state, size = 26 }) {
  const label = state === 'approved' ? 'ทำงานที่บ้าน (WFH)' : 'WFH รออนุมัติ';
  return (
    <Tooltip title={label}>
      <span className={`cal-badge cal-wfh ${state}`} style={{ width: size, height: size }} aria-label={label}>
        <HomeFilled />
      </span>
    </Tooltip>
  );
}

function DayCell({ rec, selected, today, onSelect }) {
  if (!rec) return <div className="cal-cell empty" aria-hidden="true" />;
  const isToday = rec.date.isSame(today, 'day');
  const offDay = rec.weekend || rec.holidayName;
  const future = rec.date.isAfter(today, 'day') && !rec.status;
  const times = rec.checkIn || rec.checkOut ? `${rec.checkIn || '--:--'} – ${rec.checkOut || '--:--'}` : null;

  const tint = rec.status === 'absent' ? 'tint-danger' : offDay ? 'tint-off' : '';
  return (
    <button
      type="button"
      className={`cal-cell ${tint}${selected ? ' selected' : ''}${future ? ' future' : ''}`}
      onClick={() => onSelect(rec.key)}
      aria-pressed={selected}
      aria-label={`${rec.date.format('D MMMM BBBB')}${rec.status ? ` ${STATUS[rec.status].label}` : ''}`}
    >
      <span className="cal-cell-top">
        <span className={`cal-day${isToday ? ' today' : ''}${offDay ? ' off' : ''}`}>{rec.date.date()}</span>
        {rec.leave && <LeaveBadge kind={rec.leave.kind} />}
        {rec.wfh && <WfhBadge state={rec.wfh} />}
      </span>
      {rec.holidayName && <span className="cal-holiday">{rec.holidayName}</span>}
      {rec.status && rec.status !== 'holiday' && (
        <>
          {/* จอแคบ: เหลือจุดสี */}
          <span className={`cal-dot tone-${STATUS[rec.status].tone}`} />
          <span className="cal-cell-detail">
            {/* วันนี้ยังไม่จบวัน: ยังไม่ตัดสินสถานะ */}
            {rec.todayOpen ? <span className="cal-chip small tone-idle">ยังไม่ครบวัน</span> : <StatusChip status={rec.status} label={rec.leave?.type} small />}
            {times && <span className="cal-time">{times}</span>}
          </span>
        </>
      )}
    </button>
  );
}

function TimeBlock({ label, value, tone }) {
  return (
    <div className="cal-time-block">
      <div className="cal-loc"><EnvironmentOutlined /> {LOCATION}</div>
      <div className="cal-time-label">{label}</div>
      <div className={`cal-time-value tone-text-${value ? tone : 'idle'}`}>{value || '--:--'}</div>
    </div>
  );
}

/* ---------------- หน้า ---------------- */
export default function CalendarPage() {
  const today = useMemo(() => dayjs(), []);
  const [month, setMonth] = useState(() => today.startOf('month'));
  const [selectedKey, setSelectedKey] = useState(() => today.format('YYYY-MM-DD'));

  const cells = useMemo(() => monthCells(month, today), [month, today]);
  const records = cells.filter(Boolean);
  const selected = records.find((r) => r.key === selectedKey) || null;
  const wfhApproved = records.filter((r) => r.wfh === 'approved').length;
  const wfhPending = records.filter((r) => r.wfh === 'pending').length;
  const sickDays = records.filter((r) => r.leave?.kind === 'sick').length;
  const vacationDays = records.filter((r) => r.leave?.kind === 'vacation').length;

  const goMonth = (m) => {
    setMonth(m);
    // เลือกวันที่ในเดือนใหม่: วันนี้ถ้าอยู่ในเดือนนั้น ไม่งั้นวันที่ 1
    setSelectedKey((m.isSame(today, 'month') ? today : m).format('YYYY-MM-DD'));
  };

  return (
    <div className="cal-page">
      <style>{`
        .cal-page { width: 100%; max-width: 1400px; margin: 0 auto; text-align: left; }
        .cal-card .ant-card-head-title { white-space: normal; }

        .cal-nav { display: flex; align-items: center; gap: 6px; }
        .cal-nav .cal-month { min-width: 130px; text-align: center; color: #fff; font-weight: 600; font-size: 15px; }
        .cal-nav .ant-btn { color: var(--gold-pale); }

        .cal-weekdays, .cal-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; }
        .cal-weekdays { margin-bottom: 8px; }
        .cal-weekdays span { text-align: center; font-size: 13px; font-weight: 600; color: var(--text-muted); }
        .cal-weekdays span.off { color: var(--danger); }

        .cal-cell { position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 4px; min-height: 92px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); text-align: left; font-family: var(--sans); color: var(--text-dark); cursor: pointer; transition: border-color 220ms var(--ease), box-shadow 220ms var(--ease), transform 220ms var(--ease); }
        .cal-cell:hover { border-color: var(--gold); box-shadow: var(--shadow-soft); }
        .cal-cell.empty { border: 0; background: transparent; cursor: default; }
        .cal-cell.tint-off { background: var(--bg); }
        .cal-cell.tint-danger { background: var(--danger-bg); border-color: var(--danger-border); }
        .cal-cell.selected { border: 2px solid var(--gold); padding: 7px 9px; background: rgba(240, 217, 154, 0.22); }
        .cal-cell.future .cal-day:not(.off) { color: var(--text-muted); }

        .cal-cell-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 4px; }
        .cal-day { display: inline-grid; place-items: center; min-width: 26px; height: 26px; font-size: 15px; font-weight: 700; }
        .cal-day.off { color: var(--danger); }
        .cal-day.today { border-radius: 50%; background: var(--ok); color: #fff; }

        .cal-badge { display: inline-grid; place-items: center; flex: none; border-radius: 50%; font-size: 13px; }
        .cal-leave { font-weight: 700; line-height: 1; }
        .cal-leave.sick { background: var(--danger-bg); color: var(--danger); box-shadow: inset 0 0 0 1px var(--danger-border); }
        .cal-leave.vacation { background: var(--navy-tint); color: var(--navy-3); box-shadow: inset 0 0 0 1px var(--navy-3); }
        .cal-wfh.approved { background: var(--navy-1); color: #fff; }
        .cal-wfh.pending { background: var(--gold); color: #241a02; }
        :root[data-theme='dark'] .cal-wfh.approved { background: var(--navy-3); }

        .cal-holiday { font-size: 12px; line-height: 1.35; color: var(--danger); }
        .cal-cell-detail { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }
        .cal-time { font-size: 11.5px; color: var(--text-muted); white-space: nowrap; }
        .cal-dot { display: none; width: 8px; height: 8px; border-radius: 50%; }

        .cal-chip { display: inline-block; padding: 1px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; line-height: 1.6; white-space: nowrap; }
        .cal-chip.small { font-size: 11.5px; padding: 0 7px; }
        .tone-ok { background: var(--ok-bg); color: var(--ok); }
        .tone-warn { background: var(--warn-bg); color: var(--warn); }
        .tone-danger { background: var(--danger-bg); color: var(--danger); }
        .tone-gold { background: var(--gold-tint); color: var(--gold); }
        .tone-navy { background: var(--navy-tint); color: var(--navy-3); }
        .tone-idle { background: var(--bg); color: var(--text-muted); }
        .cal-dot.tone-ok { background: var(--ok); } .cal-dot.tone-warn { background: var(--warn); }
        .cal-dot.tone-danger { background: var(--danger); } .cal-dot.tone-gold { background: var(--gold); }
        .cal-dot.tone-navy { background: var(--navy-3); } .cal-dot.tone-idle { background: var(--idle); }

        .cal-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-soft); font-size: 12.5px; color: var(--text-muted); }
        .cal-foot-item { display: inline-flex; align-items: center; gap: 6px; }
        .cal-legend { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 12px; font-size: 12.5px; color: var(--text-dark); }
        .cal-legend span { display: inline-flex; align-items: center; gap: 6px; }
        .cal-legend .cal-dot { display: inline-block; }

        .cal-detail-date { font-size: 16px; font-weight: 700; color: var(--text-dark); }
        .cal-wfh-card { display: flex; align-items: center; gap: 12px; margin-top: 14px; padding: 12px 14px; border-radius: 10px; background: var(--navy-tint); }
        .cal-wfh-card.pending { background: var(--gold-tint); }
        .cal-wfh-title { font-weight: 600; color: var(--text-dark); }
        .cal-wfh-sub { font-size: 12.5px; color: var(--text-muted); }
        .cal-section { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-soft); }
        .cal-section-title { margin-bottom: 10px; font-size: 15px; font-weight: 700; color: var(--text-dark); }
        .cal-times { display: grid; grid-template-columns: 1fr 1fr; }
        .cal-times > :first-child { padding-right: 12px; border-right: 1px solid var(--border-soft); }
        .cal-times > :last-child { padding-left: 12px; }
        .cal-loc { font-size: 12px; color: var(--text-muted); }
        .cal-time-label { margin-top: 2px; font-size: 13px; font-weight: 600; color: var(--text-dark); }
        .cal-time-value { margin-top: 2px; font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
        .tone-text-ok { color: var(--ok); } .tone-text-danger { color: var(--danger); } .tone-text-idle { color: var(--text-muted); }
        .cal-empty { color: var(--text-muted); font-size: 13px; }

        /* แท็บเล็ต/มือถือ: ช่องเล็กลง เหลือเลขวันที่ + จุดสถานะ */
        @media (max-width: 767.98px) {
          .cal-weekdays, .cal-grid { gap: 4px; }
          .cal-cell { min-height: 56px; padding: 6px 4px; align-items: center; border-radius: 8px; }
          .cal-cell.selected { padding: 5px 3px; }
          .cal-cell-top { flex-direction: column; align-items: center; }
          .cal-day { font-size: 13px; min-width: 22px; height: 22px; }
          .cal-badge { width: 16px !important; height: 16px !important; font-size: 9px !important; }
          .cal-cell-detail, .cal-holiday { display: none; }
          .cal-dot { display: block; }
          .cal-nav .cal-month { min-width: 96px; font-size: 14px; }
          /* หัวการ์ด: แถบเลื่อนเดือนลงไปอยู่ใต้ชื่อ */
          .cal-card .ant-card-head-wrapper { flex-wrap: wrap; }
          .cal-card .ant-card-head-title { flex: 1 1 100%; padding: 12px 0 6px; }
          .cal-card .ant-card-extra { width: 100%; margin: 0 0 10px; }
          .cal-card .cal-nav { justify-content: center; }
        }
      `}</style>

      <Row gutter={[16, 16]}>
        {/* ปฏิทินเดือน */}
        <Col xs={24} xl={16}>
          <Card
            className="cal-card"
            title={<Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}><CalendarOutlined /> ปฏิทินการทำงาน</Text>}
            styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
            style={{ borderRadius: 8 }}
            extra={
              <div className="cal-nav">
                <Button type="text" size="small" icon={<LeftOutlined />} aria-label="เดือนก่อนหน้า" onClick={() => goMonth(month.subtract(1, 'month'))} />
                <span className="cal-month">{month.format('MMMM BBBB')}</span>
                <Button type="text" size="small" icon={<RightOutlined />} aria-label="เดือนถัดไป" onClick={() => goMonth(month.add(1, 'month'))} />
                {!month.isSame(today, 'month') && (
                  <Button size="small" onClick={() => goMonth(today.startOf('month'))}>วันนี้</Button>
                )}
              </div>
            }
          >
            <div className="cal-weekdays" aria-hidden="true">
              {WEEKDAYS.map((w, i) => <span key={w} className={i === 0 || i === 6 ? 'off' : ''}>{w}</span>)}
            </div>
            <div className="cal-grid">
              {cells.map((rec, i) => (
                <DayCell key={rec?.key || `blank-${i}`} rec={rec} today={today} selected={rec?.key === selectedKey} onSelect={setSelectedKey} />
              ))}
            </div>

            <div className="cal-foot">
              <span className="cal-foot-item"><WfhBadge state="approved" size={22} /> WFH {wfhApproved} วัน</span>
              <span className="cal-foot-item"><WfhBadge state="pending" size={22} /> WFH รออนุมัติ {wfhPending} วัน</span>
              <span className="cal-foot-item"><LeaveBadge kind="sick" size={22} /> ลาป่วย {sickDays} วัน</span>
              <span className="cal-foot-item"><LeaveBadge kind="vacation" size={22} /> ลาพักร้อน {vacationDays} วัน</span>
              <span>เวลาทำงานปกติ {WORK_TIME.in} – {WORK_TIME.out} น. · กดที่วันเพื่อดูรายละเอียด</span>
            </div>
            <div className="cal-legend">
              {Object.entries(STATUS).map(([k, s]) => (
                <span key={k}><i className={`cal-dot tone-${s.tone}`} />{s.label}</span>
              ))}
            </div>
          </Card>
        </Col>

        {/* รายละเอียดวันที่เลือก */}
        <Col xs={24} xl={8}>
          <Card style={{ borderRadius: 8 }} title={<Text strong style={{ fontSize: 15 }}>รายละเอียดวันที่เลือก</Text>}>
            {!selected ? (
              <div className="cal-empty">กดที่วันในปฏิทินเพื่อดูรายละเอียด</div>
            ) : (
              <>
                <div className="cal-detail-date">{selected.date.format('ddddที่ D MMMM BBBB')}</div>
                <Space size={6} wrap style={{ marginTop: 6 }}>
                  {selected.todayOpen ? (
                    <span className="cal-chip tone-idle">ยังไม่ครบวัน</span>
                  ) : (
                    selected.status && <StatusChip status={selected.status} />
                  )}
                  {!selected.status && (
                    <span className="cal-chip tone-idle">
                      {selected.weekend ? 'วันหยุดสุดสัปดาห์' : 'ยังไม่ถึงวันทำงาน'}
                    </span>
                  )}
                  {selected.holidayName && <Text type="secondary">{selected.holidayName}</Text>}
                </Space>

                {selected.wfh && (
                  <div className={`cal-wfh-card ${selected.wfh}`}>
                    <WfhBadge state={selected.wfh} size={36} />
                    <div>
                      <div className="cal-wfh-title">ทำงานที่บ้าน (WFH)</div>
                      <div className="cal-wfh-sub">
                        {selected.wfh === 'approved' ? 'ลงเวลานอกเขตพื้นที่ได้' : 'รออนุมัติ · ยังลงเวลานอกเขตพื้นที่ไม่ได้'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="cal-section">
                  <div className="cal-section-title">การลงเวลา</div>
                  <div className="cal-times">
                    <TimeBlock label={`ลงเวลาเข้า (${WORK_TIME.in})`} value={selected.checkIn} tone="ok" />
                    <TimeBlock label={`ลงเวลาออก (${WORK_TIME.out})`} value={selected.checkOut} tone="danger" />
                  </div>
                </div>

                <div className="cal-section">
                  <div className="cal-section-title">การลา</div>
                  {selected.leave ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 15 }}>
                        <LeaveBadge kind={selected.leave.kind} size={28} />
                        {selected.leave.type}
                      </div>
                      <div className="cal-wfh-sub">({selected.date.format('D MMM BBBB')} {selected.leave.range})</div>
                      <div style={{ marginTop: 4 }}>
                        สถานะ :{' '}
                        <span className={`cal-chip ${selected.leave.status === 'approved' ? 'tone-ok' : 'tone-warn'}`}>
                          {selected.leave.status === 'approved' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="cal-empty">ไม่มีรายการลา</div>
                  )}
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
