import { useMemo, useState } from 'react';
import { Card, Button, Select, Table, Typography, Space, Tag, Modal, Empty, message } from 'antd';
import { ArrowLeftOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FilterPanel, { FilterField } from '../components/FilterPanel';
import { getUsers } from '../pages/users/userData';

const { Text } = Typography;

// รายงานประวัติการลงเวลา (log การลงเวลาเข้า/ออกงานรายครั้ง และเวลาที่ส่งข้อมูลไป DPIS)
// ต้นแบบ: ข้อมูลจำลองสร้างจากรายชื่อผู้ใช้งานใน userData.js ตามปี/เดือน/หน่วยงาน/เจ้าหน้าที่ที่เลือก

const TODAY = new Date();
const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];
// ปี พ.ศ. ย้อนหลัง 2 ปีถึงปีปัจจุบัน (เก็บค่าเป็น ค.ศ.)
const YEARS = [0, 1, 2].map((i) => TODAY.getFullYear() - i);

const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear() + 543}`;
const fmtTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const sameDay = (a, b) => a.toDateString() === b.toDateString();

// ต้นแบบ: ไม่แสดงชื่อจริง/ชื่อสมมุติ ใช้ตัวอักษรแทนชื่อ + รหัสเจ้าหน้าที่ (แบบเดียวกับรายงานสรุปการมาปฏิบัติราชการ)
//   คนละคนในหน่วยงานเดียวกันใช้ตัวอักษรต่างกัน: xxxx xxx, yyyy yyy, zzzz zzz, wwww www, ...
const staffNo = (p) => Number(p.id.replace(/\D/g, ''));
const staffCode = (p) => String(40500 + staffNo(p));
const MASK_LETTERS = 'xyzwvutsrqponmlkjihgfedcba';
const maskedName = (p) => {
  const sameDept = getUsers().filter((x) => x.dept === p.dept).sort((a, b) => staffNo(a) - staffNo(b));
  const c = MASK_LETTERS[sameDept.findIndex((x) => x.id === p.id) % MASK_LETTERS.length];
  return `${p.prefix || ''}${c.repeat(4)} ${c.repeat(3)}`;
};

// สุ่มแบบคงที่ (ค้นหาเงื่อนไขเดิมได้ผลเหมือนเดิมทุกครั้ง)
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (n) => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h >>> 0) % 10000) / 10000 * n;
  };
}

function buildLogs({ year, month, dept, staffId }) {
  const people = getUsers().filter((x) => x.dept === dept && (!staffId || x.id === staffId));
  const daysInMonth = new Date(year, month, 0).getDate();
  const rows = [];

  people.forEach((p) => {
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date > TODAY) break;
      const dow = date.getDay();
      if (dow === 0 || dow === 6) continue;

      const rnd = seeded(`${p.id}-${year}-${month}-${day}`);
      if (rnd(100) < 8) continue; // ลา / ไม่ได้ลงเวลา

      const isToday = sameDay(date, TODAY);
      const punches = [
        { type: 'in', at: new Date(year, month - 1, day, 7, 40 + Math.floor(rnd(70))) },
      ];
      // วันนี้ยังไม่ถึงเวลาออกงาน หรือบางวันลืมลงเวลาออก
      if (!(isToday && TODAY.getHours() < 16) && rnd(100) >= 5) {
        punches.push({ type: 'out', at: new Date(year, month - 1, day, 16, 30 + Math.floor(rnd(75))) });
      }

      punches.forEach((pc) => {
        const sent = new Date(pc.at.getTime() + (1 + Math.floor(rnd(14))) * 60000);
        const pending = sent > TODAY || (isToday && rnd(100) < 40);
        rows.push({
          key: `${p.id}-${day}-${pc.type}`,
          userId: p.id,
          name: maskedName(p),
          code: staffCode(p),
          dept: p.dept,
          position: p.position,
          sortKey: pc.at.getTime(),
          date: fmtDate(pc.at),
          type: pc.type,
          time: fmtTime(pc.at),
          dpis: pending ? '' : `${fmtDate(sent)} ${fmtTime(sent)}`,
        });
      });
    }
  });

  return rows.sort((a, b) => a.code.localeCompare(b.code) || a.sortKey - b.sortKey);
}

const TYPE_LABEL = { in: 'เข้างาน', out: 'ออกงาน' };

async function exportExcel(rows, { year, month, deptName, staffName }) {
  const { default: ExcelJS } = await import('exceljs');
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('ประวัติการลงเวลา', { views: [{ state: 'frozen', ySplit: 4 }] });
  const font = { name: 'Tahoma', size: 10 };
  const border = { style: 'thin', color: { argb: 'FFBFC7D5' } };
  const allBorders = { top: border, left: border, bottom: border, right: border };

  ws.columns = [
    { key: 'no', width: 7 },
    { key: 'name', width: 30 },
    { key: 'dept', width: 28 },
    { key: 'position', width: 28 },
    { key: 'date', width: 13 },
    { key: 'type', width: 11 },
    { key: 'time', width: 10 },
    { key: 'dpis', width: 22 },
  ];

  ws.mergeCells('A1:H1');
  ws.getCell('A1').value = 'รายงานประวัติการลงเวลา';
  ws.getCell('A1').font = { ...font, size: 14, bold: true };
  ws.mergeCells('A2:H2');
  ws.getCell('A2').value =
    `ประจำเดือน ${MONTHS[month - 1]} ${year + 543}  หน่วยงาน: ${deptName}  เจ้าหน้าที่: ${staffName}`;
  ws.getCell('A2').font = font;

  const headTop = ws.getRow(3);
  const headSub = ws.getRow(4);
  headTop.values = ['ลำดับ', 'ชื่อ', 'หน่วยงาน', 'ตำแหน่ง', 'วันที่', 'เวลาเข้า/ออกงาน', '', 'วันที่/เวลาที่ส่ง DPIS'];
  headSub.values = ['', '', '', '', '', 'ประเภท', 'เวลา', ''];
  ['A', 'B', 'C', 'D', 'E', 'H'].forEach((c) => ws.mergeCells(`${c}3:${c}4`));
  ws.mergeCells('F3:G3');
  [headTop, headSub].forEach((r) => {
    r.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { ...font, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0C1B3A' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = allBorders;
    });
  });

  rows.forEach((r, i) => {
    const row = ws.addRow({
      no: i + 1, name: `${r.name} (${r.code})`, dept: r.dept, position: r.position, date: r.date,
      type: TYPE_LABEL[r.type], time: r.time, dpis: r.dpis || 'รอส่งข้อมูล',
    });
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.font = font;
      cell.border = allBorders;
      cell.alignment = { vertical: 'middle', horizontal: [1, 5, 6, 7, 8].includes(col) ? 'center' : 'left' };
    });
  });

  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = `AttendanceLog_${year + 543}_${pad(month)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AttendanceLogPage() {
  const navigate = useNavigate();
  const [modal, modalHolder] = Modal.useModal();
  const [msg, msgHolder] = message.useMessage();

  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [dept, setDept] = useState();
  const [staffId, setStaffId] = useState();
  const [result, setResult] = useState(null); // { rows, criteria }
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const depts = useMemo(() => [...new Set(getUsers().map((x) => x.dept).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'th')), []);
  const staffOptions = useMemo(
    () => getUsers()
      .filter((x) => x.dept === dept)
      .map((x) => ({ value: x.id, label: `${maskedName(x)} (${staffCode(x)})` }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    [dept],
  );

  const handleSearch = () => {
    const missing = [!year && 'ปี', !month && 'เดือน', !dept && 'หน่วยงาน'].filter(Boolean);
    if (missing.length) {
      modal.warning({
        title: 'กรุณาระบุเงื่อนไขการค้นหา',
        content: `กรุณาเลือก ${missing.join(', ')} ก่อนกดค้นหา`,
        okText: 'ตกลง',
      });
      return;
    }
    const staff = staffOptions.find((o) => o.value === staffId);
    const criteria = { year, month, deptName: dept, staffName: staff?.label || 'ทั้งหมด' };
    setLoading(true);
    setTimeout(() => {
      setResult({ rows: buildLogs({ year, month, dept, staffId }), criteria });
      setLoading(false);
    }, 300);
  };

  const handleReset = () => {
    setYear(undefined);
    setMonth(undefined);
    setDept(undefined);
    setStaffId(undefined);
    setResult(null);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportExcel(result.rows, result.criteria);
    } catch {
      msg.error('ส่งออกไฟล์ Excel ไม่สำเร็จ');
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    {
      title: 'ชื่อ',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, r) => (
        <div>
          <Text strong style={{ fontSize: 13, display: 'block', color: 'var(--gold)' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>({r.code})</Text>
        </div>
      ),
    },
    { title: 'หน่วยงาน', dataIndex: 'dept', key: 'dept', width: 180 },
    { title: 'ตำแหน่ง', dataIndex: 'position', key: 'position', width: 180 },
    { title: 'วันที่', dataIndex: 'date', key: 'date', align: 'center', width: 110 },
    {
      title: 'เวลาเข้า/ออกงาน',
      key: 'time',
      align: 'center',
      width: 150,
      render: (_, r) => (
        <Space size={6}>
          <Tag color={r.type === 'in' ? 'success' : 'processing'} style={{ marginInlineEnd: 0 }}>
            {TYPE_LABEL[r.type]}
          </Tag>
          <span style={{ color: 'var(--navy-3)', fontWeight: 500 }}>{r.time}</span>
        </Space>
      ),
    },
    {
      title: 'วันที่/เวลาที่ส่ง DPIS',
      dataIndex: 'dpis',
      key: 'dpis',
      align: 'center',
      width: 170,
      render: (v) => (v ? v : <Tag color="warning" style={{ marginInlineEnd: 0 }}>รอส่งข้อมูล</Tag>),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      {modalHolder}
      {msgHolder}
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: 'var(--white)' }} onClick={() => navigate(-1)} />
            <Text style={{ color: 'var(--white)', fontSize: 16, fontWeight: 'bold' }}>ประวัติการลงเวลา</Text>
          </Space>
        }
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.08)' }}
      >
        <FilterPanel
          onSearch={handleSearch}
          onReset={handleReset}
          extra={
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExport}
              loading={exporting}
              disabled={!result?.rows.length}
              style={result?.rows.length
                ? { backgroundColor: 'var(--ok-bg)', borderColor: 'var(--ok-border)', color: 'var(--ok)', fontWeight: 500 }
                : { fontWeight: 500 }}
            >
              Export Excel
            </Button>
          }
        >
          <FilterField label="ปี">
            <Select
              value={year}
              onChange={setYear}
              placeholder="เลือกปี"
              options={YEARS.map((y) => ({ value: y, label: String(y + 543) }))}
            />
          </FilterField>
          <FilterField label="เดือน">
            <Select
              value={month}
              onChange={setMonth}
              placeholder="เลือกเดือน"
              options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))}
            />
          </FilterField>
          <FilterField label="หน่วยงาน">
            <Select
              value={dept}
              onChange={(v) => {
                setDept(v);
                setStaffId(undefined);
              }}
              placeholder="เลือกหน่วยงาน"
              showSearch
              options={depts.map((d) => ({ value: d, label: d }))}
            />
          </FilterField>
          <FilterField label="เจ้าหน้าที่">
            <Select
              value={staffId}
              onChange={setStaffId}
              disabled={!dept}
              popupMatchSelectWidth={false}
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder={dept ? 'ทั้งหมด' : 'กรุณาเลือกหน่วยงานก่อน'}
              options={staffOptions}
            />
          </FilterField>
        </FilterPanel>

        {result || loading ? (
          <Table
            dataSource={result?.rows || []}
            columns={columns}
            loading={loading}
            bordered
            size="small"
            scroll={{ x: 990 }}
            pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `ทั้งหมด ${t} รายการ` }}
            rowClassName={(_, i) => (i % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            locale={{ emptyText: <Empty description="ไม่พบข้อมูลการลงเวลาตามเงื่อนไขที่เลือก" /> }}
          />
        ) : (
          <Empty description="กรุณาเลือก ปี เดือน และหน่วยงาน แล้วกดค้นหา" style={{ padding: '32px 0' }} />
        )}
      </Card>
    </div>
  );
}
