import { useMemo, useState } from 'react';
import { Card, Button, Input, DatePicker, Table, Typography, Tag, Modal, Empty, message } from 'antd';
import { FileExcelOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import FilterPanel, { FilterField } from '../../components/FilterPanel';
import { getUsers } from './userData';

const { Text } = Typography;
const { RangePicker } = DatePicker;

// หน้า "Activity Log" — ประวัติการใช้งานระบบของผู้ใช้ (ใคร ทำอะไร เมื่อไร จากที่ไหน)
// ต้นแบบ: ข้อมูลจำลองสร้างจากรายชื่อผู้ใช้งานใน userData.js (ยังไม่มี backend)
//   คลิก "ดูรายละเอียด" เพื่อดูฟิลด์ที่เปลี่ยนแปลง (ค่าใหม่ / ค่าเดิม)

const ACTION_LABEL = { created: 'เพิ่มข้อมูล', updated: 'แก้ไขข้อมูล', deleted: 'ลบข้อมูล', login: 'เข้าสู่ระบบ', logout: 'ออกจากระบบ' };
const ACTION_TAG = { created: 'success', updated: 'processing', deleted: 'error', login: 'default', logout: 'default' };

const fmtDb = (d) => dayjs(d).format('YYYY-MM-DD HH:mm:ss');

// สุ่มแบบคงที่ (เปิดหน้าใหม่ได้ข้อมูลชุดเดิม)
function seeded(seed) {
  let h = seed >>> 0 || 1;
  return (n) => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000 * n;
  };
}

const URLS = [
  '/users/UserDetailPage', '/users/UserGroupDetailPage', '/settings/WorkTimePage', '/settings/HolidayPage',
  '/attendance/AttendanceApprovePage', '/settings/LocationPage', '/system_settings/MailPage',
];
const OS_LIST = ['Windows 11', 'Windows 10', 'macOS 15', 'iOS 18', 'Android 15'];
const BROWSERS = ['Chrome 142', 'Edge 142', 'Safari 19', 'Firefox 145'];

// ตัวอย่างฟิลด์ที่ถูกแก้ไข [ชื่อฟิลด์อังกฤษ, ชื่อไทย, ค่าใหม่, ค่าเดิม]
const FIELD_SAMPLES = [
  ['status', 'สถานะ', 'connected', 'pending'],
  ['phone', 'เบอร์โทรศัพท์', '02-288-4110', '02-288-4001'],
  ['position', 'ตำแหน่ง', 'นักวิชาการคอมพิวเตอร์', 'นักจัดการงานทั่วไป'],
  ['role_id', 'สิทธิ์การใช้งาน', 'r2', 'r3'],
  ['work_start', 'เวลาเริ่มงาน', '08:30', '08:00'],
  ['work_end', 'เวลาเลิกงาน', '16:30', '16:00'],
  ['location_radius', 'รัศมีพิกัด (เมตร)', '200', '150'],
];

// ต้นแบบ: ไม่แสดง email จริง ใช้ตัวอักษรแทน (คนละคนใช้ตัวอักษรต่างกัน) เช่น xxxx@xxxx.com, yyyy@yyyy.com
const MASK_LETTERS = 'xyzwvutsrqponmlkjihgfedcba';
const maskedEmail = (i) => {
  const c = MASK_LETTERS[i % MASK_LETTERS.length];
  return `${c.repeat(4)}@${c.repeat(4)}.com`;
};

function buildLogs() {
  const users = getUsers().filter((u) => u.email).map((u, i) => ({ ...u, email: maskedEmail(i) }));
  const rnd = seeded(20261113);
  const now = dayjs();
  const rows = [];
  for (let i = 0; i < 60; i++) {
    const u = users[Math.floor(rnd(users.length))];
    const at = now.subtract(Math.floor(rnd(30 * 24 * 60)), 'minute').second(Math.floor(rnd(60)));
    const r = rnd(100);
    const action = r < 45 ? 'updated' : r < 60 ? 'created' : r < 68 ? 'deleted' : r < 88 ? 'login' : 'logout';
    const isLogin = action === 'login' || action === 'logout';
    // บางรายการถูกบันทึกจากระบบเบื้องหลัง (ไม่มีข้อมูล IP/URL/OS/Browser)
    const system = !isLogin && rnd(100) < 25;

    let changes = [];
    if (action === 'updated') {
      const prev = at.subtract(1 + Math.floor(rnd(180)), 'minute');
      changes = [['update_date', 'วันที่แก้ไข', fmtDb(at), fmtDb(prev)]];
      const n = Math.floor(rnd(3));
      for (let k = 0; k < n; k++) {
        const f = FIELD_SAMPLES[Math.floor(rnd(FIELD_SAMPLES.length))];
        if (!changes.some((c) => c[0] === f[0])) changes.unshift(f);
      }
    } else if (action === 'created') {
      changes = [['create_date', 'วันที่สร้าง', fmtDb(at), ''], ['create_by', 'ผู้สร้าง', u.email, '']];
    } else if (action === 'deleted') {
      changes = [['delete_date', 'วันที่ลบ', fmtDb(at), ''], ['is_active', 'สถานะการใช้งาน', '0', '1']];
    }

    rows.push({
      at,
      email: u.email,
      action,
      ip: system ? '' : `10.${10 + Math.floor(rnd(20))}.${Math.floor(rnd(255))}.${1 + Math.floor(rnd(254))}`,
      url: system ? '' : isLogin ? '/login' : URLS[Math.floor(rnd(URLS.length))],
      os: system ? '' : OS_LIST[Math.floor(rnd(OS_LIST.length))],
      browser: system ? '' : BROWSERS[Math.floor(rnd(BROWSERS.length))],
      changes: changes.map(([field, th, next, old]) => ({ field, th, next, old })),
    });
  }
  return rows
    .sort((a, b) => b.at.valueOf() - a.at.valueOf())
    .map((r, i) => ({ ...r, id: rows.length - i, key: rows.length - i }));
}

const EMPTY_FILTER = { range: null, email: '', ip: '' };

const matches = (r, f) => {
  if (f.range?.[0] && r.at.isBefore(f.range[0].startOf('day'))) return false;
  if (f.range?.[1] && r.at.isAfter(f.range[1].endOf('day'))) return false;
  if (f.email && !r.email.toLowerCase().includes(f.email.trim().toLowerCase())) return false;
  if (f.ip && !r.ip.includes(f.ip.trim())) return false;
  return true;
};

const dash = (v) => v || '-';

async function exportExcel(rows) {
  const { default: ExcelJS } = await import('exceljs');
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Activity Log', { views: [{ state: 'frozen', ySplit: 1 }] });
  const font = { name: 'Tahoma', size: 10 };
  const border = { style: 'thin', color: { argb: 'FFBFC7D5' } };
  const allBorders = { top: border, left: border, bottom: border, right: border };

  ws.columns = [
    { header: 'ลำดับ', key: 'no', width: 7 },
    { header: 'รหัสรายการ', key: 'id', width: 11 },
    { header: 'วันที่เข้าใช้งาน', key: 'at', width: 22 },
    { header: 'ชื่อผู้ใช้งาน', key: 'email', width: 30 },
    { header: 'การกระทำ', key: 'action', width: 14 },
    { header: 'IP Address', key: 'ip', width: 16 },
    { header: 'URL', key: 'url', width: 32 },
    { header: 'OS', key: 'os', width: 13 },
    { header: 'Browser', key: 'browser', width: 13 },
    { header: 'รายละเอียด', key: 'detail', width: 60 },
  ];
  ws.getRow(1).eachCell((cell) => {
    cell.font = { ...font, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0C1B3A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = allBorders;
  });
  rows.forEach((r, i) => {
    const row = ws.addRow({
      no: i + 1, id: r.id, at: r.at.format('DD/MM/BBBB HH:mm:ss'), email: r.email, action: r.action,
      ip: dash(r.ip), url: dash(r.url), os: dash(r.os), browser: dash(r.browser),
      detail: r.changes.map((c) => `${c.field}: ${c.old || '-'} → ${c.next || '-'}`).join('\n') || '-',
    });
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.font = font;
      cell.border = allBorders;
      cell.alignment = { vertical: 'top', wrapText: true, horizontal: [1, 2, 3, 5, 6, 8, 9].includes(col) ? 'center' : 'left' };
    });
  });

  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `ActivityLog_${dayjs().format('BBBBMMDD')}.xlsx` });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ActivityPage() {
  const [msg, msgHolder] = message.useMessage();
  const allRows = useMemo(buildLogs, []);
  const [draft, setDraft] = useState(EMPTY_FILTER);
  const [filter, setFilter] = useState(EMPTY_FILTER);
  const [detail, setDetail] = useState(null);
  const [exporting, setExporting] = useState(false);

  const rows = useMemo(() => allRows.filter((r) => matches(r, filter)), [allRows, filter]);
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value?.target ? value.target.value : value }));

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportExcel(rows);
    } catch {
      msg.error('ส่งออกไฟล์ Excel ไม่สำเร็จ');
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    { title: 'ลำดับ', key: 'index', align: 'center', width: 70, render: (_, r) => rows.indexOf(r) + 1 },
    { title: 'รหัสรายการ', dataIndex: 'id', key: 'id', align: 'center', width: 100 },
    {
      title: 'วันที่เข้าใช้งาน',
      key: 'at',
      align: 'center',
      width: 190,
      render: (_, r) => r.at.format('D MMM BBBB HH:mm:ss'),
    },
    { title: 'ชื่อผู้ใช้งาน', dataIndex: 'email', key: 'email', width: 220 },
    {
      title: 'การกระทำ',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 120,
      render: (v) => (
        <Tag color={ACTION_TAG[v]} title={ACTION_LABEL[v]} style={{ marginInlineEnd: 0 }}>{v}</Tag>
      ),
    },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip', align: 'center', width: 130, render: dash },
    { title: 'URL', dataIndex: 'url', key: 'url', width: 220, render: (v) => (v ? <Text code>{v}</Text> : <div style={{ textAlign: 'center' }}>-</div>) },
    { title: 'OS', dataIndex: 'os', key: 'os', align: 'center', width: 110, render: dash },
    { title: 'Browser', dataIndex: 'browser', key: 'browser', align: 'center', width: 110, render: dash },
    {
      title: 'รายละเอียด',
      key: 'detail',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (_, r) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          style={{ color: 'var(--navy-3)', padding: 0 }}
          onClick={() => setDetail(r)}
        >
          ดูรายละเอียด
        </Button>
      ),
    },
  ];

  const detailColumns = [
    {
      title: 'ฟิลด์ (อังกฤษ - ไทย)',
      dataIndex: 'field',
      key: 'field',
      width: '34%',
      render: (v, c) => (
        <div>
          <Text strong>{v}</Text>
          <div className="activity-sub">{c.th}</div>
        </div>
      ),
    },
    { title: 'ค่าใหม่', dataIndex: 'next', key: 'next', render: (v) => <span className="activity-new">{dash(v)}</span> },
    { title: 'ค่าเดิม', dataIndex: 'old', key: 'old', render: (v) => <Text type="secondary">{dash(v)}</Text> },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      {msgHolder}
      <style>{`
        .activity-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .activity-new { color: var(--navy-3); font-weight: 500; }
      `}</style>

      <Card
        title={<Text style={{ color: 'var(--white)', fontSize: 16, fontWeight: 'bold' }}>Activity Log</Text>}
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.08)' }}
      >
        <FilterPanel
          onSearch={() => setFilter(draft)}
          onReset={() => {
            setDraft(EMPTY_FILTER);
            setFilter(EMPTY_FILTER);
          }}
          extra={
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExport}
              loading={exporting}
              disabled={!rows.length}
              style={rows.length
                ? { backgroundColor: 'var(--ok-bg)', borderColor: 'var(--ok-border)', color: 'var(--ok)', fontWeight: 500 }
                : { fontWeight: 500 }}
            >
              Export Excel
            </Button>
          }
        >
          <FilterField label="ช่วงวันที่เข้าใช้งาน" span={12}>
            <RangePicker
              value={draft.range}
              onChange={set('range')}
              format="DD/MM/BBBB"
              placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']}
              style={{ width: '100%' }}
            />
          </FilterField>
          <FilterField label="ชื่อผู้ใช้งาน" htmlFor="af-email" span={6}>
            <Input id="af-email" placeholder="ระบุ email" value={draft.email} onChange={set('email')} allowClear />
          </FilterField>
          <FilterField label="IP Address" htmlFor="af-ip" span={6}>
            <Input id="af-ip" placeholder="ระบุ IP Address" value={draft.ip} onChange={set('ip')} allowClear />
          </FilterField>
        </FilterPanel>

        <Table
          dataSource={rows}
          columns={columns}
          bordered
          size="middle"
          scroll={{ x: 1400 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `ทั้งหมด ${t} รายการ` }}
          rowClassName={(_, i) => (i % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
          locale={{ emptyText: <Empty description="ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา" /> }}
        />
      </Card>

      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={null}
        width={960}
        title={
          <div>
            รายละเอียด
            {detail && (
              <div className="activity-sub" style={{ fontWeight: 400 }}>
                รหัสรายการ {detail.id} · {detail.email} · {detail.at.format('D MMM BBBB HH:mm:ss')} · {detail.action}
              </div>
            )}
          </div>
        }
        destroyOnHidden
      >
        <Table
          rowKey="field"
          dataSource={detail?.changes || []}
          columns={detailColumns}
          bordered
          size="middle"
          pagination={false}
          locale={{ emptyText: <Empty description="ไม่มีการเปลี่ยนแปลงข้อมูล" /> }}
        />
      </Modal>
    </div>
  );
}
