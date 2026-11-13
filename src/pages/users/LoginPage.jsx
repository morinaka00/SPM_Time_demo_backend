import { useMemo, useState } from 'react';
import { Card, Input, DatePicker, Table, Typography, Tag, Empty } from 'antd';
import dayjs from 'dayjs';
import FilterPanel, { FilterField } from '../../components/FilterPanel';

const { Text } = Typography;
const { RangePicker } = DatePicker;

// หน้า "Login Log" — ประวัติการเข้า/ออกจากระบบของผู้ใช้งาน
// ต้นแบบ: ข้อมูลจำลอง (ยังไม่มี backend) ชื่อผู้ใช้งานแสดงเป็น xxx@xxx.com

const USERNAME = 'xxx@xxx.com';
const STATUS_LABEL = { login: 'เข้าสู่ระบบ', logout: 'ออกจากระบบ' };
const STATUS_TAG = { login: 'success', logout: 'default' };

// สุ่มแบบคงที่ (เปิดหน้าใหม่ได้ข้อมูลชุดเดิม)
function seeded(seed) {
  let h = seed >>> 0 || 1;
  return (n) => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000 * n;
  };
}

const IPS = ['49.228.26.108', '49.228.26.108', '49.228.26.108', '10.12.4.21', '110.164.88.35', '182.232.10.77'];

function buildLogs() {
  const rnd = seeded(20261113);
  const now = dayjs();
  const rows = [];
  for (let i = 0; i < 50; i++) {
    rows.push({
      at: now.subtract(Math.floor(rnd(14 * 24 * 60)), 'minute').second(Math.floor(rnd(60))),
      username: USERNAME,
      ip: IPS[Math.floor(rnd(IPS.length))],
      status: rnd(100) < 85 ? 'login' : 'logout',
    });
  }
  return rows
    .sort((a, b) => b.at.valueOf() - a.at.valueOf())
    .map((r, i) => ({ ...r, key: i + 1 }));
}

const EMPTY_FILTER = { username: '', range: null };

const matches = (r, f) => {
  if (f.username && !r.username.toLowerCase().includes(f.username.trim().toLowerCase())) return false;
  if (f.range?.[0] && r.at.isBefore(f.range[0].startOf('day'))) return false;
  if (f.range?.[1] && r.at.isAfter(f.range[1].endOf('day'))) return false;
  return true;
};

export default function LoginLogPage() {
  const allRows = useMemo(() => buildLogs(), []);
  const [draft, setDraft] = useState(EMPTY_FILTER);
  const [filter, setFilter] = useState(EMPTY_FILTER);

  const rows = useMemo(() => allRows.filter((r) => matches(r, filter)), [allRows, filter]);
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value?.target ? value.target.value : value }));

  const columns = [
    { title: 'ลำดับ', key: 'index', align: 'center', width: 80, render: (_, r) => rows.indexOf(r) + 1 },
    {
      title: 'วันที่เข้าใช้งาน',
      key: 'at',
      align: 'center',
      width: 200,
      render: (_, r) => r.at.format('D MMM BBBB HH:mm:ss'),
    },
    { title: 'ชื่อผู้ใช้งาน', dataIndex: 'username', key: 'username' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip', align: 'center', width: 180 },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 140,
      render: (v) => (
        <Tag color={STATUS_TAG[v]} title={STATUS_LABEL[v]} style={{ marginInlineEnd: 0 }}>{v}</Tag>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      <Card
        title={<Text style={{ color: 'var(--white)', fontSize: 16, fontWeight: 'bold' }}>Login Log</Text>}
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.08)' }}
      >
        <FilterPanel
          onSearch={() => setFilter(draft)}
          onReset={() => {
            setDraft(EMPTY_FILTER);
            setFilter(EMPTY_FILTER);
          }}
        >
          <FilterField label="ชื่อผู้ใช้งาน" htmlFor="ll-username" span={12}>
            <Input id="ll-username" placeholder="ระบุ" value={draft.username} onChange={set('username')} allowClear />
          </FilterField>
          <FilterField label="ช่วงวันที่เข้าใช้งาน" span={12}>
            <RangePicker
              value={draft.range}
              onChange={set('range')}
              format="DD/MM/BBBB"
              placeholder={['วันที่เริ่มต้น', 'วันที่สิ้นสุด']}
              style={{ width: '100%' }}
            />
          </FilterField>
        </FilterPanel>

        <Table
          dataSource={rows}
          columns={columns}
          bordered
          size="middle"
          scroll={{ x: 800 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `ทั้งหมด ${t} รายการ` }}
          rowClassName={(_, i) => (i % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
          locale={{ emptyText: <Empty description="ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา" /> }}
        />
      </Card>
    </div>
  );
}
