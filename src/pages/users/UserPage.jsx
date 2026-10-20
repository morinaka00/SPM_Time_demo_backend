import { useState } from 'react';
import {
  Card, Row, Col, Button, Select, Input, Table, Space, Typography, Tag, Tooltip, Popconfirm, message,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, DownloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  getUsers, deleteUser, userFullName, roleName, ROLES, STATUS_LABEL, STATUS_TAG,
} from './userData';

const { Text } = Typography;

// หน้ารายการ "ข้อมูลผู้ใช้งาน" — ดัดแปลงจากเมนู "ผู้ใช้งาน" ของต้นแบบ portal ใน artifact

const EMPTY_FILTER = { name: '', dept: '', status: 'all', role: 'all' };

const matches = (x, f) => {
  const name = `${userFullName(x)} ${x.firstEn} ${x.lastEn} ${x.username}`.toLowerCase();
  if (f.name && !name.includes(f.name.trim().toLowerCase())) return false;
  if (f.dept && !(x.dept || '').toLowerCase().includes(f.dept.trim().toLowerCase())) return false;
  if (f.status !== 'all' && x.status !== f.status) return false;
  if (f.role !== 'all' && !x.roleIds.includes(f.role)) return false;
  return true;
};

// ---------- Export ----------
const EXPORT_COLUMNS = [
  ['ลำดับ', (x, i) => i + 1],
  ['ชื่อ-นามสกุล', (x) => userFullName(x)],
  ['ชื่อผู้ใช้งาน', (x) => x.username],
  ['อีเมล', (x) => x.email],
  ['หน่วยงาน/สังกัด', (x) => x.dept],
  ['ตำแหน่ง', (x) => [x.position, x.level].filter(Boolean).join(' ')],
  ['สิทธิ์การใช้งาน', (x) => x.roleIds.map(roleName).filter(Boolean).join(', ')],
  ['ระบบที่มีสิทธิ์', (x) => x.systems.join(', ')],
  ['สถานะ', (x) => STATUS_LABEL[x.status]],
];

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const xmlText = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ใส่ BOM ไว้หน้าไฟล์ ให้ Excel อ่านภาษาไทยได้ถูกต้อง
const BOM = String.fromCharCode(0xfeff);

function exportCsv(rows) {
  const lines = [EXPORT_COLUMNS.map(([h]) => csvCell(h)).join(',')];
  rows.forEach((x, i) => lines.push(EXPORT_COLUMNS.map(([, get]) => csvCell(get(x, i))).join(',')));
  download('users.csv', `${BOM}${lines.join('\r\n')}`, 'text/csv;charset=utf-8');
}

function exportXml(rows) {
  const tags = ['no', 'fullName', 'username', 'email', 'department', 'position', 'roles', 'systems', 'status'];
  const body = rows
    .map((x, i) => `  <user>\n${EXPORT_COLUMNS.map(([, get], c) => `    <${tags[c]}>${xmlText(get(x, i))}</${tags[c]}>`).join('\n')}\n  </user>`)
    .join('\n');
  download('users.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<users>\n${body}\n</users>\n`, 'application/xml');
}

export default function UserPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(getUsers);
  const [draft, setDraft] = useState(EMPTY_FILTER); // ค่าที่กำลังกรอก
  const [filter, setFilter] = useState(EMPTY_FILTER); // ค่าที่ใช้กรองจริง (กดค้นหาแล้ว)

  const rows = users.filter((x) => matches(x, filter));
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value?.target ? value.target.value : value }));

  const handleDelete = (record) => {
    deleteUser(record.id);
    setUsers(getUsers());
    message.success(`ลบผู้ใช้งาน "${userFullName(record)}" แล้ว`);
  };

  const columns = [
    // นับต่อเนื่องข้ามหน้า (index ที่ antd ส่งมาเริ่มใหม่ทุกหน้า)
    { title: 'ลำดับ', key: 'index', align: 'center', width: 70, render: (_, x) => rows.indexOf(x) + 1 },
    {
      title: 'ผู้ใช้งาน',
      key: 'name',
      render: (_, x) => (
        <div>
          <Text strong>{userFullName(x)}</Text>
          {(x.username || x.email) && (
            <div className="user-sub">{[x.username, x.email].filter(Boolean).join(' · ')}</div>
          )}
        </div>
      ),
    },
    {
      title: 'หน่วยงาน/ประเภท',
      key: 'dept',
      render: (_, x) => (
        <div>
          {x.dept || '-'}
          {x.position && <div className="user-sub">{x.position}{x.level ? ` ${x.level}` : ''}</div>}
        </div>
      ),
    },
    {
      title: 'สิทธิ์การใช้งาน',
      key: 'roles',
      render: (_, x) =>
        x.roleIds.length ? (
          <Space size={[4, 4]} wrap>
            {x.roleIds.map((id) => <Tag key={id} className="role-chip">{roleName(id)}</Tag>)}
          </Space>
        ) : (
          <Text type="secondary">ยังไม่ได้กำหนดสิทธิ์</Text>
        ),
    },
    {
      title: 'สถานะ',
      key: 'status',
      align: 'center',
      width: 130,
      render: (_, x) => <Tag color={STATUS_TAG[x.status]}>{STATUS_LABEL[x.status]}</Tag>,
    },
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      width: 110,
      render: (_, x) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{ color: 'var(--navy-3)', padding: 0 }}
              onClick={() => navigate(`/users/UserDetailPage?id=${x.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title={`ยืนยันการลบผู้ใช้งาน "${userFullName(x)}" ?`}
            onConfirm={() => handleDelete(x)}
            okText="ลบ"
            okButtonProps={{ danger: true }}
            cancelText="ยกเลิก"
          >
            <Tooltip title="ลบ">
              <Button type="link" icon={<DeleteOutlined />} style={{ color: 'var(--danger)', padding: 0 }} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .user-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .role-chip.ant-tag { margin: 0; background: var(--navy-tint); border-color: var(--navy-tint-border); color: var(--navy-3); }
        .user-filter label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--text-dark); }
        .user-filter .ant-select { width: 100%; }
      `}</style>

      <Card
        title={<Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>ข้อมูลผู้ใช้งาน</Text>}
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8 }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/users/UserDetailPage')}>
            เพิ่มผู้ใช้
          </Button>
        }
      >
        <Text type="secondary">
          รายชื่อผู้ใช้งานทั้งหมด {users.length} คน ในระบบ พร้อมระบบที่ได้รับสิทธิ์ใช้งาน
        </Text>

        {/* ส่วนค้นหา */}
        <Row gutter={[16, 16]} className="user-filter" style={{ marginTop: 20 }}>
          <Col xs={24} sm={12} lg={6}>
            <label htmlFor="uf-name">ชื่อ-นามสกุล</label>
            <Input id="uf-name" placeholder="ค้นหาชื่อผู้ใช้" value={draft.name} onChange={set('name')} onPressEnter={() => setFilter(draft)} allowClear />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <label htmlFor="uf-dept">หน่วยงาน</label>
            <Input id="uf-dept" placeholder="ค้นหาหน่วยงาน/สังกัด" value={draft.dept} onChange={set('dept')} onPressEnter={() => setFilter(draft)} allowClear />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <label htmlFor="uf-status">สถานะ</label>
            <Select
              id="uf-status"
              value={draft.status}
              onChange={set('status')}
              options={[{ value: 'all', label: 'ทั้งหมด' }, ...Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))]}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <label htmlFor="uf-role">สิทธิ์การใช้งาน</label>
            <Select
              id="uf-role"
              value={draft.role}
              onChange={set('role')}
              options={[{ value: 'all', label: 'ทุกสิทธิ์' }, ...ROLES.map((r) => ({ value: r.id, label: r.name }))]}
            />
          </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, margin: '20px 0 16px' }}>
          <Space wrap>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => setFilter(draft)}>ค้นหา</Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setDraft(EMPTY_FILTER);
                setFilter(EMPTY_FILTER);
              }}
            >
              ล้างค่า
            </Button>
          </Space>
          <Space wrap>
            <Button icon={<DownloadOutlined />} onClick={() => exportCsv(rows)} disabled={!rows.length}>Export CSV</Button>
            <Button icon={<DownloadOutlined />} onClick={() => exportXml(rows)} disabled={!rows.length}>Export XML</Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          dataSource={rows}
          columns={columns}
          bordered
          size="middle"
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
          locale={{ emptyText: 'ไม่พบผู้ใช้งานตามเงื่อนไขที่ค้นหา' }}
        />
      </Card>
    </div>
  );
}
