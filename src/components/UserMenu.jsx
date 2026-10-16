import { useState } from 'react';
import { Dropdown, Avatar, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  BgColorsOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import ProfileModal from './ProfileModal';

// เมนูโปรไฟล์ผู้ใช้ (ดัดแปลงจาก profile dropdown ของต้นแบบ portal)
export default function UserMenu({
  name = 'สมชาย ใจดี',
  role = 'เจ้าหน้าที่ · Developer',
  email = 'somchai.j@opm.go.th',
  isDark,
  onToggleTheme,
}) {
  const [profileTab, setProfileTab] = useState(null); // null = ปิด modal

  const items = [
    { key: 'info', icon: <UserOutlined />, label: 'ข้อมูลส่วนตัว' },
    { key: 'password', icon: <LockOutlined />, label: 'รหัสผ่านและความปลอดภัย' },
    { key: 'notif', icon: <BellOutlined />, label: 'การแจ้งเตือน' },
    { key: 'theme', icon: <BgColorsOutlined />, label: isDark ? 'การแสดงผล: โหมดสว่าง' : 'การแสดงผล: โหมดกลางคืน' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'ออกจากระบบ', danger: true },
  ];

  const onClick = ({ key }) => {
    if (key === 'theme') onToggleTheme?.();
    else if (key === 'logout') message.info('ออกจากระบบ (ต้นแบบ)');
    else setProfileTab(key); // info / password / notif
  };

  return (
    <>
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        menu={{ items, onClick }}
        popupRender={(menu) => (
          <div className="profile-menu">
            <div className="profile-menu-head">
              <Avatar size={40} icon={<UserOutlined />} />
              <div>
                <div className="profile-menu-name">{name}</div>
                <div className="profile-menu-email">{email}</div>
              </div>
            </div>
            {menu}
          </div>
        )}
      >
        <button type="button" className="header-user" aria-label="เมนูผู้ใช้งาน">
          <span className="header-user-text">
            <span className="header-user-name">{name}</span>
            <span className="header-user-role">{role}</span>
          </span>
          <Avatar size={40} icon={<UserOutlined />} />
        </button>
      </Dropdown>
      <ProfileModal
        open={profileTab !== null}
        tab={profileTab}
        onTabChange={setProfileTab}
        onClose={() => setProfileTab(null)}
      />
    </>
  );
}
