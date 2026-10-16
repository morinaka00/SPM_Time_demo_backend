import { useState } from 'react';
import { Drawer, Button, Tooltip } from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// หมวดการแจ้งเตือน (ดัดแปลงจากแผงแจ้งเตือนของต้นแบบ portal ให้เหลือเฉพาะงานลงเวลา)
const NOTIF_CATEGORIES = {
  time: { label: 'การลงเวลา', tone: 'tone-time', icon: <ClockCircleOutlined /> },
  request: { label: 'คำขอลงเวลา', tone: 'tone-request', icon: <FormOutlined /> },
  leave: { label: 'การลา', tone: 'tone-leave', icon: <CalendarOutlined /> },
  ot: { label: 'ทำงานล่วงเวลา', tone: 'tone-ot', icon: <FieldTimeOutlined /> },
};

// ข้อมูลจำลอง
const NOTIF_ITEMS = [
  { id: 1, cat: 'time', title: 'ยังไม่ได้ลงเวลาออก', meta: '19 ส.ค. 2569 · The Government House', to: '/attendance/AttendancePage' },
  { id: 2, cat: 'time', title: 'ข้อมูลการลงเวลาไม่สมบูรณ์', meta: '2 วัน ในเดือนสิงหาคม', to: '/attendance/CalendarPage' },
  { id: 3, cat: 'request', title: 'คำขอปรับปรุงเวลารออนุมัติ', meta: 'กองบริหารงานทั่วไป · 3 รายการ', to: '/attendance/AttendanceRequestPage' },
  { id: 4, cat: 'request', title: 'คำขอลงเวลาได้รับการอนุมัติ', meta: '15 ส.ค. 2569', to: '/attendance/AttendanceRequestPage' },
  { id: 5, cat: 'leave', title: 'ใบลาป่วยรออนุมัติ', meta: '19 ส.ค. 2569 13:00 - 16:30', to: '/attendance/LeavehistoryPage' },
  { id: 6, cat: 'leave', title: 'ใบลาพักผ่อนรออนุมัติ', meta: 'นางสาวสมหญิง · 2 วัน', to: '/attendance/LeavehistoryPage' },
  { id: 7, cat: 'ot', title: 'คำขอทำงานล่วงเวลารออนุมัติ', meta: '15 มิ.ย. 2569 · 2 ชั่วโมง', to: '/attendance/OvertimeHistoryPage' },
];

const countBy = (cat) => NOTIF_ITEMS.filter((it) => it.cat === cat).length;
const badgeText = (n) => (n > 9 ? '9+' : String(n));

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const total = NOTIF_ITEMS.length;
  const catCount = Object.keys(NOTIF_CATEGORIES).length;
  const items = NOTIF_ITEMS.filter((it) => filter === 'all' || it.cat === filter);

  const openItem = (item) => {
    setOpen(false);
    navigate(item.to);
  };

  return (
    <>
      <Tooltip title="การแจ้งเตือน">
        <button type="button" className="icon-btn" aria-label={`การแจ้งเตือน ${total} รายการ`} onClick={() => setOpen(true)}>
          <BellOutlined />
          {total > 0 && <span className="icon-btn-badge">{badgeText(total)}</span>}
        </button>
      </Tooltip>

      <Drawer
        className="notif-drawer"
        placement="right"
        width={400}
        open={open}
        onClose={() => setOpen(false)}
        title={
          <>
            การแจ้งเตือน
            <span className="notif-sub">{total} รายการรอดำเนินการจาก {catCount} หมวด</span>
          </>
        }
        extra={
          <Tooltip title="ตั้งค่าการแจ้งเตือน">
            <Button type="text" shape="circle" icon={<SettingOutlined />} />
          </Tooltip>
        }
      >
        <div className="notif-filters">
          <button
            type="button"
            className={`notif-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            ทั้งหมด {total}
          </button>
          {Object.entries(NOTIF_CATEGORIES).map(([id, c]) => (
            <Tooltip key={id} title={c.label}>
              <button
                type="button"
                aria-label={c.label}
                className={`notif-icon-filter ${c.tone} ${filter === id ? 'active' : ''}`}
                onClick={() => setFilter(id)}
              >
                {c.icon}
                <span className="cnt">{badgeText(countBy(id))}</span>
              </button>
            </Tooltip>
          ))}
        </div>

        <div className="notif-list">
          {items.length === 0 ? (
            <div className="notif-empty">ไม่มีรายการแจ้งเตือนในหมวดนี้</div>
          ) : (
            items.map((it) => {
              const c = NOTIF_CATEGORIES[it.cat];
              return (
                <button type="button" key={it.id} className="notif-item" onClick={() => openItem(it)}>
                  <span className={`notif-item-icon ${c.tone}`}>{c.icon}</span>
                  <span>
                    <div className="notif-item-title">{it.title}</div>
                    <div className="notif-item-meta">{c.label} · {it.meta}</div>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </Drawer>
    </>
  );
}
