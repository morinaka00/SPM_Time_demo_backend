import { useState } from 'react';
import { Modal, Select, Button, Space, Avatar, Typography, Tooltip, Empty, message } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { getUsers, getUsersInRole, setRoleMembers, userFullName } from './userData';

const { Text } = Typography;

// Popup จัดการรายชื่อผู้ใช้ในสิทธิ์ — เปิดจากช่อง "จำนวนผู้ใช้งาน" ในหน้า UserGroupPage
// หน้าตาแบบเดียวกับส่วน "รายชื่อเจ้าหน้าที่" ในหน้าตั้งค่ารอบการทำงาน (เลือก + เพิ่ม + การ์ดรายชื่อ)
// เพิ่ม/ลบในรายการได้ก่อน แล้วกด "บันทึก" จึงมีผลจริง (กด "ยกเลิก" = ไม่เปลี่ยนแปลง)

const subtitle = (u) => [u.position, u.dept].filter(Boolean).join(' · ') || u.username || '-';

// เนื้อหาใน popup — ใช้ key ใหม่ทุกครั้งที่เปิด (sessionKey) จึงเริ่มจากรายชื่อที่บันทึกไว้เสมอ
// แม้จะเปิดซ้ำระหว่างที่ popup เดิมยังเล่นแอนิเมชันปิดอยู่
function MembersEditor({ role, onClose, onSaved }) {
  const [memberIds, setMemberIds] = useState(() => getUsersInRole(role.id).map((u) => u.id));
  const [pickId, setPickId] = useState(null);

  const allUsers = getUsers();
  const members = memberIds.map((id) => allUsers.find((u) => u.id === id)).filter(Boolean);
  const options = allUsers
    .filter((u) => !memberIds.includes(u.id))
    .map((u) => ({
      value: u.id,
      label: `${userFullName(u)}${u.username ? ` (${u.username})` : ''} - ${u.dept || 'ไม่ระบุหน่วยงาน'}`,
    }));

  const handleAdd = () => {
    if (!pickId) {
      message.warning('กรุณาเลือกผู้ใช้งานก่อนกดเพิ่ม');
      return;
    }
    setMemberIds((ids) => [...ids, pickId]);
    setPickId(null);
  };

  const handleSave = () => {
    setRoleMembers(role.id, memberIds);
    message.success(`บันทึกรายชื่อผู้ใช้ในสิทธิ์ "${role.name}" แล้ว (${memberIds.length} คน)`);
    onSaved();
  };

  return (
    <>
      <div className="rm-label">เลือกผู้ใช้งานเข้าสิทธิ์นี้</div>
      <Space.Compact style={{ width: '100%' }}>
        <Select
          showSearch
          allowClear
          value={pickId}
          onChange={setPickId}
          placeholder="-- ค้นหาและเลือกผู้ใช้งาน --"
          options={options}
          optionFilterProp="label"
          notFoundContent="ไม่มีผู้ใช้งานที่เลือกได้"
          style={{ width: 'calc(100% - 96px)' }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ width: 96 }}>
          เพิ่ม
        </Button>
      </Space.Compact>

      <div className="rm-divider" />

      <div className="rm-count">
        <TeamOutlined /> ผู้ใช้งานในสิทธิ์นี้ {members.length} คน
      </div>

      <div className="rm-list">
        {members.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="ยังไม่มีผู้ใช้งานในสิทธิ์นี้" />
        ) : (
          members.map((u) => (
            <div key={u.id} className="rm-card">
              <Space size="middle" style={{ minWidth: 0 }}>
                <Avatar size={44} icon={<UserOutlined />} className="rm-avatar" />
                <div style={{ minWidth: 0 }}>
                  <Text strong className="rm-name">
                    {userFullName(u)}{u.username ? ` (${u.username})` : ''}
                  </Text>
                  <Text type="secondary" className="rm-sub">{subtitle(u)}</Text>
                </div>
              </Space>
              <Tooltip title="นำออกจากสิทธิ์">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`นำ ${userFullName(u)} ออกจากสิทธิ์`}
                  onClick={() => setMemberIds((ids) => ids.filter((id) => id !== u.id))}
                />
              </Tooltip>
            </div>
          ))
        )}
      </div>

      <div className="rm-footer">
        <Button onClick={onClose} style={{ minWidth: 110 }}>ยกเลิก</Button>
        <Button type="primary" onClick={handleSave} style={{ minWidth: 110 }}>บันทึก</Button>
      </div>
    </>
  );
}

export default function RoleMembersModal({ role, sessionKey, onClose, onSaved }) {
  return (
    <Modal
      className="rm-modal"
      open={Boolean(role)}
      onCancel={onClose}
      footer={null}
      width={640}
      centered
      destroyOnHidden
      maskClosable={false}
      title={
        <span className="rm-title">
          รายชื่อผู้ใช้งาน
          {role && <span className="rm-title-role">สิทธิ์: {role.name}</span>}
        </span>
      }
    >
      <style>{`
        .rm-modal .ant-modal-container, .rm-modal .ant-modal-content { padding: 0; overflow: hidden; border-radius: 16px; }
        .rm-modal .ant-modal-header { margin: 0; padding: 16px 24px; background: var(--grad-bar); border-bottom: 2px solid var(--gold); }
        .rm-title { display: block; color: #fff; font-size: 17px; font-weight: 700; }
        .rm-title-role { display: block; margin-top: 2px; font-size: 12.5px; font-weight: 400; color: var(--gold-pale); }
        .rm-modal .ant-modal-close { top: 18px; inset-inline-end: 16px; color: rgba(255,255,255,0.8); }
        .rm-modal .ant-modal-close:hover { color: var(--gold-pale); background: rgba(255,255,255,0.1); }
        .rm-modal .ant-modal-body { padding: 20px 24px 0; background: var(--bg); }
        .rm-label { margin-bottom: 8px; font-size: 14px; color: var(--text-dark); }
        .rm-divider { height: 1px; margin: 18px 0 14px; background: var(--border); }
        .rm-count { margin-bottom: 10px; font-size: 13px; font-weight: 600; color: var(--text-muted); }
        .rm-list { max-height: min(46vh, 380px); overflow-y: auto; padding-right: 4px; }
        .rm-card { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); }
        .rm-avatar.ant-avatar { flex: none; background: var(--bg); color: var(--text-muted); }
        .rm-name { display: block; font-size: 14px; }
        .rm-sub { display: block; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rm-footer { display: flex; justify-content: center; gap: 12px; margin: 8px -24px 0; padding: 16px 24px 20px; border-top: 1px solid var(--border-soft); background: var(--surface); }
      `}</style>
      {role && <MembersEditor key={sessionKey} role={role} onClose={onClose} onSaved={onSaved} />}
    </Modal>
  );
}
