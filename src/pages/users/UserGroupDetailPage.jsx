import { useState } from 'react';
import {
  Card, Button, Input, Space, Typography, Form, Radio, Table, Checkbox, Result, Tag, message,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MENU_ITEMS } from '../../config/menuItems';
import {
  getRole, saveRole, isRoleNameTaken, countUsersInRole, emptyPerms, MENU_LEAVES, PERM_ACTIONS,
} from './userData';

const { Text } = Typography;

// หน้า Add/Edit "สิทธิการใช้งาน" — ดัดแปลงจากฟอร์ม "เพิ่ม/แก้ไขสิทธิ์การใช้งาน" ของต้นแบบ portal
// ตาราง "สิทธิ์การเข้าถึงเมนู" ใช้เมนูจริงของระบบนี้ (src/config/menuItems.jsx)
// ไม่มี ?id = เพิ่มใหม่, มี ?id=<รหัส> = แก้ไข

// แถวของตารางสิทธิ์: กลุ่มเมนู (มี children) และเมนูย่อย
const PERM_ROWS = MENU_ITEMS.map((m) =>
  m.children
    ? { key: m.key, label: m.label, icon: m.icon, children: m.children.map((c) => ({ key: c.key, label: c.label })) }
    : { key: m.key, label: m.label, icon: m.icon },
);
const leafKeysOf = (row) => (row.children ? row.children.map((c) => c.key) : [row.key]);
const ALL_LEAF_KEYS = MENU_LEAVES.map((m) => m.key);

const clonePerms = (perms) => Object.fromEntries(ALL_LEAF_KEYS.map((k) => [k, { ...(perms?.[k] || emptyPerms()[k]) }]));

// ตั้งค่าสิทธิ์ของเมนูหลายตัวพร้อมกัน พร้อมกฎความสัมพันธ์:
// เปิด เพิ่ม/แก้ไข/ลบ/ส่งออก → ต้องเปิด "แสดง" ด้วย, ปิด "แสดง" → ปิดสิทธิ์อื่นทั้งหมด
function applyPerm(perms, keys, action, checked) {
  const next = { ...perms };
  keys.forEach((k) => {
    const p = { ...next[k], [action]: checked };
    if (action !== 'view' && checked) p.view = true;
    if (action === 'view' && !checked) PERM_ACTIONS.forEach((a) => { p[a.key] = false; });
    next[k] = p;
  });
  return next;
}

// สถานะ checkbox ของกลุ่ม/ทั้งคอลัมน์: ครบทุกตัว, บางตัว, หรือไม่มี
const tri = (perms, keys, action) => {
  const n = keys.filter((k) => perms[k]?.[action]).length;
  return { checked: n > 0 && n === keys.length, indeterminate: n > 0 && n < keys.length };
};

export default function UserGroupDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const role = id ? getRole(id) : null;
  const isEdit = Boolean(role);
  const [form] = Form.useForm();
  const [perms, setPerms] = useState(() => clonePerms(role?.perms));

  const goBack = () => navigate('/users/UserGroupPage');
  const setFor = (keys, action) => (e) => setPerms((p) => applyPerm(p, keys, action, e.target.checked));

  const handleSave = () =>
    form
      .validateFields()
      .then(({ name, status }) => {
        saveRole(id, { name: name.trim(), active: status === 'active', perms });
        message.success(isEdit ? 'บันทึกการแก้ไขสิทธิ์การใช้งานแล้ว' : 'เพิ่มสิทธิ์การใช้งานใหม่แล้ว');
        goBack();
      })
      .catch(() => message.error('กรุณาตรวจสอบข้อมูลที่ไม่ถูกต้อง'));

  if (id && !role) {
    return (
      <Card style={{ maxWidth: 640, margin: '0 auto' }}>
        <Result
          status="404"
          title="ไม่พบสิทธิ์การใช้งาน"
          subTitle="สิทธิ์นี้อาจถูกลบไปแล้ว"
          extra={<Button type="primary" onClick={goBack}>กลับไปหน้ารายการ</Button>}
        />
      </Card>
    );
  }

  const permColumns = [
    {
      title: 'เมนู',
      key: 'label',
      render: (_, row) =>
        row.children ? (
          <span className="perm-group">
            {row.icon} {row.label}
            <span className="perm-group-count">({row.children.length} เมนู)</span>
          </span>
        ) : (
          <span className={row.icon ? 'perm-group' : 'perm-leaf'}>
            {row.icon} {row.label}
          </span>
        ),
    },
    ...PERM_ACTIONS.map((a) => ({
      key: a.key,
      align: 'center',
      width: 92,
      // หัวคอลัมน์ติ๊กได้ = เลือก/ยกเลิกทั้งคอลัมน์
      title: (
        <Checkbox {...tri(perms, ALL_LEAF_KEYS, a.key)} onChange={setFor(ALL_LEAF_KEYS, a.key)}>
          {a.label}
        </Checkbox>
      ),
      render: (_, row) => {
        const keys = leafKeysOf(row);
        return (
          <Checkbox
            {...tri(perms, keys, a.key)}
            onChange={setFor(keys, a.key)}
            aria-label={`${a.label} — ${row.label}`}
          />
        );
      },
    })),
  ];

  const usersInRole = isEdit ? countUsersInRole(role.id) : 0;

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .role-form-sep { font-size: 14px; font-weight: 700; color: var(--text-dark); margin: 8px 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
        .role-form-sep::before { content: ''; display: inline-block; width: 3px; height: 14px; margin-right: 8px; border-radius: 2px; background: var(--gold); vertical-align: -2px; }
        .perm-table .ant-table-thead > tr > th { white-space: nowrap; }
        .perm-group { font-weight: 600; color: var(--text-dark); }
        .perm-group .anticon { color: var(--text-muted); margin-right: 4px; }
        .perm-group-count { margin-left: 6px; font-size: 12px; font-weight: 400; color: var(--text-muted); }
        .perm-leaf { color: var(--text-dark); }
        .perm-table .ant-table-row-level-1 > td { background: var(--bg); }
      `}</style>

      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: 'var(--white)' }} onClick={goBack} aria-label="กลับ" />
            <Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>
              {isEdit ? 'แก้ไขสิทธิ์การใช้งาน' : 'เพิ่มสิทธิ์การใช้งานใหม่'}
            </Text>
          </Space>
        }
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          <Text type="secondary">กำหนดชื่อกลุ่มสิทธิ์และสิทธิ์การเข้าถึงเมนูของระบบบันทึกเวลาปฏิบัติราชการ</Text>
          {isEdit && (
            <Space size={6} wrap>
              <Text type="secondary">ระดับสิทธิ์:</Text>
              <Tag>{role.code}</Tag>
              <Text type="secondary">ผู้ใช้งาน {usersInRole} คน</Text>
            </Space>
          )}
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: role?.name || '', status: role && !role.active ? 'inactive' : 'active' }}
        >
          <Form.Item
            label="ชื่อสิทธิ์การใช้งาน"
            name="name"
            rules={[
              { required: true, whitespace: true, message: 'กรุณากรอกชื่อสิทธิ์การใช้งาน' },
              {
                validator: (_, v) =>
                  v && isRoleNameTaken(v, id) ? Promise.reject(new Error('ชื่อสิทธิ์นี้มีในระบบแล้ว')) : Promise.resolve(),
              },
            ]}
          >
            <Input placeholder="เช่น เจ้าหน้าที่งบประมาณ" maxLength={100} />
          </Form.Item>
          <Form.Item
            label="สถานะการใช้งาน"
            name="status"
            rules={[{ required: true }]}
            extra={usersInRole > 0 ? `ปิดใช้งานแล้ว ผู้ใช้ ${usersInRole} คนที่มีสิทธิ์นี้อยู่เดิมยังคงมีสิทธิ์ แต่จะเลือกสิทธิ์นี้ให้ผู้ใช้ใหม่ไม่ได้` : undefined}
          >
            <Radio.Group
              options={[
                { value: 'active', label: 'ใช้งาน' },
                { value: 'inactive', label: 'ไม่ใช้งาน' },
              ]}
            />
          </Form.Item>
        </Form>

        <div className="role-form-sep">สิทธิ์การเข้าถึงเมนู</div>
        <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12.5 }}>
          ติ๊กที่หัวคอลัมน์เพื่อเลือกทั้งคอลัมน์ · ติ๊กที่กลุ่มเมนูเพื่อเลือกทุกเมนูย่อยในกลุ่ม · เลือก เพิ่ม/แก้ไข/ลบ/ส่งออก แล้วจะเปิด "แสดง" ให้อัตโนมัติ
        </Text>

        <Table
          className="perm-table"
          rowKey="key"
          dataSource={PERM_ROWS}
          columns={permColumns}
          pagination={false}
          bordered
          size="small"
          scroll={{ x: 760 }}
          expandable={{ defaultExpandAllRows: true, indentSize: 20 }}
        />

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Space size="middle" wrap style={{ justifyContent: 'center' }}>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} style={{ minWidth: 140, height: 38 }}>
              บันทึกข้อมูล
            </Button>
            <Button onClick={goBack} style={{ minWidth: 140, height: 38 }}>
              ยกเลิก
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}
