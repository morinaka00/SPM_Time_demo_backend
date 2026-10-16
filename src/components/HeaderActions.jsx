import { Tooltip } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import NotificationPanel from './NotificationPanel';
import UserMenu from './UserMenu';

// ปุ่มด้านขวาของ Header: สลับธีม · แจ้งเตือน · เมนูผู้ใช้
export default function HeaderActions({ isDark, onToggleTheme }) {
  const themeLabel = isDark ? 'โหมดสว่าง' : 'โหมดกลางคืน';
  return (
    <div className="header-actions">
      <Tooltip title={themeLabel}>
        <button type="button" className="icon-btn" aria-label={themeLabel} onClick={onToggleTheme}>
          {isDark ? <SunOutlined /> : <MoonOutlined />}
        </button>
      </Tooltip>
      <NotificationPanel />
      <UserMenu isDark={isDark} onToggleTheme={onToggleTheme} />
    </div>
  );
}
