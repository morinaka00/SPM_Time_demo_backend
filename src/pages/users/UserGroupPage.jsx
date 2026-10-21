import { useState } from 'react';
import {
  Card, Row, Col, Button, Select, Input, Table, Space, Typography, Tag, Tooltip, Popconfirm, message,
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getRoles, deleteRole, countUsersInRole, MENU_LEAVES } from './userData';
import RoleMembersModal from './RoleMembersModal';

const { Text } = Typography;

// หน้ารายการ "สิทธิการใช้งาน" — ดัดแปลงจากเมนู "จัดการสิทธิ์การใช้งาน" ของต้นแบบ portal ใน artifact

const EMPTY_FILTER = { name: '', status: 'all' };

const matches = (r, f) => {
  const q = f.name.trim().toLowerCase();
  if (q && !`${r.name} ${r.code}`.toLowerCase().includes(q)) return false;
  if (f.status === 'active' && !r.active) return false;
  if (f.status === 'inactive' && r.active) return false;
  return true;
};

// จำนวนเมนูที่สิทธิ์นี้มองเห็นได้
const visibleMenuCount = (r) => MENU_LEAVES.filter((m) => r.perms[m.key]?.view).length;

export default function UserGroupPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(getRoles);
  // popup รายชื่อผู้ใช้: role ที่เปิดอยู่ + key ใหม่ทุกครั้งที่เปิด
  const [members, setMembers] = useState({ role: null, key: 0 });
  const openMembers = (role) => setMembers((m) => ({ role, key: m.key + 1 }));
  const closeMembers = () => setMembers((m) => ({ ...m, role: null }));
  const [draft, setDraft] = useState(EMPTY_FILTER);
  const [filter, setFilter] = useState(EMPTY_FILTER);

  const rows = roles.filter((r) => matches(r, filter));

  const handleDelete = (r) => {
    if (!deleteRole(r.id)) {
      message.warning('ลบไม่ได้ เนื่องจากยังมีผู้ใช้งานอยู่ในสิทธิ์นี้');
      return;
    }
    setRoles(getRoles());
    message.success(`ลบสิทธิ์ "${r.name}" แล้ว`);
  };

  const columns = [
    // นับต่อเนื่องข้ามหน้า (index ที่ antd ส่งมาเริ่มใหม่ทุกหน้า)
    { title: 'ลำดับ', key: 'index', align: 'center', width: 70, render: (_, r) => rows.indexOf(r) + 1 },
    {
      title: 'ชื่อสิทธิ์การใช้งาน',
      key: 'name',
      render: (_, r) => (
        <div>
          <Text strong>{r.name}</Text>
          <div className="role-sub">เข้าถึงได้ {visibleMenuCount(r)} จาก {MENU_LEAVES.length} เมนู</div>
        </div>
      ),
    },
    { title: 'ระดับสิทธิ์การใช้งาน', dataIndex: 'code', key: 'code', render: (code) => <code className="role-code">{code}</code> },
    {
      title: 'จำนวนผู้ใช้งาน',
      key: 'count',
      align: 'center',
      width: 140,
      // คลิกเพื่อเปิด popup เลือก/นำออกรายชื่อผู้ใช้ในสิทธิ์นี้
      render: (_, r) => (
        <Tooltip title="ดู/จัดการรายชื่อผู้ใช้งาน">
          <button type="button" className="count-badge" onClick={() => openMembers(r)}>
            <TeamOutlined /> {countUsersInRole(r.id)} คน
          </button>
        </Tooltip>
      ),
    },
    {
      title: 'สถานะ',
      key: 'status',
      align: 'center',
      width: 120,
      render: (_, r) => <Tag color={r.active ? 'success' : 'default'}>{r.active ? 'ใช้งาน' : 'ไม่ใช้งาน'}</Tag>,
    },
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      width: 110,
      render: (_, r) => {
        const inUse = countUsersInRole(r.id) > 0;
        return (
          <Space size="middle">
            <Tooltip title="แก้ไข">
              <Button
                type="link"
                icon={<EditOutlined />}
                style={{ color: 'var(--navy-3)', padding: 0 }}
                onClick={() => navigate(`/users/UserGroupDetailPage?id=${r.id}`)}
              />
            </Tooltip>
            {inUse ? (
              <Tooltip title="ลบไม่ได้ — ยังมีผู้ใช้งานในสิทธิ์นี้">
                <Button type="link" icon={<DeleteOutlined />} disabled style={{ padding: 0 }} />
              </Tooltip>
            ) : (
              <Popconfirm
                title={`ยืนยันการลบสิทธิ์ "${r.name}" ?`}
                onConfirm={() => handleDelete(r)}
                okText="ลบ"
                okButtonProps={{ danger: true }}
                cancelText="ยกเลิก"
              >
                <Tooltip title="ลบ">
                  <Button type="link" icon={<DeleteOutlined />} style={{ color: 'var(--danger)', padding: 0 }} />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .role-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .role-code { font-size: 12.5px; padding: 2px 8px; border-radius: 5px; background: var(--bg); border: 1px solid var(--border); color: var(--text-dark); }
        .count-badge { display: inline-flex; align-items: center; gap: 6px; min-width: 64px; justify-content: center; padding: 3px 12px; border: 1px solid var(--navy-tint-border); border-radius: 999px; background: var(--navy-tint); color: var(--navy-3); font-family: var(--sans); font-size: 12.5px; font-weight: 600; cursor: pointer; transition: background 220ms var(--ease), border-color 220ms var(--ease), color 220ms var(--ease); }
        .count-badge:hover, .count-badge:focus-visible { border-color: var(--gold); background: var(--gold-tint); color: var(--text-dark); }
        .role-filter label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--text-dark); }
        .role-filter .ant-select { width: 100%; }
      `}</style>

      <Card
        title={<Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>จัดการสิทธิ์การใช้งาน</Text>}
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8 }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/users/UserGroupDetailPage')}>
            เพิ่มข้อมูล
          </Button>
        }
      >
        <Text type="secondary">กำหนดกลุ่มสิทธิ์และเมนูที่เข้าถึงได้ สำหรับระบบลงเวลาปฏิบัติราชการ</Text>

        <Row gutter={[16, 16]} align="bottom" className="role-filter" style={{ marginTop: 20 }}>
          <Col xs={24} md={10}>
            <label htmlFor="rf-name">ชื่อสิทธิ์การใช้งาน</label>
            <Input
              id="rf-name"
              placeholder="ค้นหาชื่อสิทธิ์การใช้งาน"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              onPressEnter={() => setFilter(draft)}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <label htmlFor="rf-status">สถานะการใช้งาน</label>
            <Select
              id="rf-status"
              value={draft.status}
              onChange={(status) => setDraft((d) => ({ ...d, status }))}
              options={[
                { value: 'all', label: 'ทั้งหมด' },
                { value: 'active', label: 'ใช้งาน' },
                { value: 'inactive', label: 'ไม่ใช้งาน' },
              ]}
            />
          </Col>
          <Col xs={24} md={8}>
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
          </Col>
        </Row>

        <Table
          rowKey="id"
          dataSource={rows}
          columns={columns}
          bordered
          size="middle"
          scroll={{ x: 800 }}
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 10, showTotal: (total) => `ทั้งหมด ${total} รายการ` }}
          locale={{ emptyText: 'ไม่พบสิทธิ์การใช้งานตามเงื่อนไขที่ค้นหา' }}
        />
      </Card>

      <RoleMembersModal
        role={members.role}
        sessionKey={members.key}
        onClose={closeMembers}
        onSaved={() => {
          closeMembers();
          setRoles([...getRoles()]); // รีเฟรชจำนวนผู้ใช้และสถานะปุ่มลบ
        }}
      />
    </div>
  );
}
