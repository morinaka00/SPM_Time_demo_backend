import {
  DashboardOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  SnippetsOutlined,
  SettingOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';

// เมนูหลักของระบบ — ใช้ทั้งเมนูด้านซ้าย (App.jsx) และตารางสิทธิ์การเข้าถึงเมนู (หน้าสิทธิการใช้งาน)
// key = เส้นทางของหน้า, เมนูที่มี children คือกลุ่มเมนู
export const MENU_ITEMS = [
  { key: '/DashboardPage', icon: <ClockCircleOutlined />, label: 'dashboard' },
  {
    key: '/attendance',
    icon: <FileSearchOutlined />,
    label: 'การปฏิบัติราชการ',
    children: [
      { key: '/attendance/AttendancePage', icon: <ClockCircleOutlined />, label: 'ลงเวลาทำงาน' },
      { key: '/attendance/AttendanceRequestPage', icon: <CalendarOutlined />, label: 'ขอลงเวลา' },
      { key: '/attendance/CalendarPage', icon: <CalendarOutlined />, label: 'ปฏิทินการทำงาน' },
      { key: '/attendance/LeavehistoryPage', icon: <SnippetsOutlined />, label: 'ประวัติการลา' },
      { key: '/attendance/OvertimeHistoryPage', icon: <DashboardOutlined />, label: 'ประวัติการทำงานล่วงเวลา' },
    ],
  },
  { key: '/report/RptWorkCalendarPage', icon: <CalendarOutlined />, label: 'ปฏิทินสรุปการมาปฏิบัติราชการ' },
  {
    key: '/tasetting',
    icon: <FileSearchOutlined />,
    label: 'ตั้งค่าการทำงาน',
    children: [
      { key: '/settings/WorkTimePage', label: 'ตั้งค่าเวลาการทำงาน' },
      { key: '/settings/WorkCyclePage', label: 'ตั้งค่ารอบการมาปฏิบัติราชการ' },
      { key: '/settings/OTPage', label: 'กำหนดผู้มีสิทธิทำงานล่วงเวลา' },
      { key: '/settings/WFAPage', label: 'กำหนดผู้มีสิทธิลงเวลานอกสถานที่' },
    ],
  },
  {
    key: '/report',
    icon: <FileSearchOutlined />,
    label: 'รายงาน',
    children: [
      { key: '/report/RptAttatancePage', label: 'รายงานสรุปการมาปฏิบัติราชการ' },
      { key: '/report/RptLeaveDetailPage', label: 'รายงานสรุปข้อมูลการลา' },
      { key: '/report/RptOvertimePage', label: 'รายงานสรุปการข้อมูลการทำงานล่วงเวลา' },
    ],
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'ตั้งค่าข้อมูลพื้นฐาน',
    children: [
      { key: '/settings/HolidayGroupPage', label: 'ตั้งค่ากลุ่มวันหยุดประจำปี' },
      { key: '/settings/HolidayPage', label: 'ตั้งค่าวันหยุดประจำปี' },
      { key: '/settings/LocationPage', label: 'ตั้งค่าพิกัดการลงเวลา' },
      { key: '/settings/OTRatePage', label: 'ตั้งค่าอัตราค่าล่วงเวลา' },
    ],
  },
  {
    key: '/users',
    icon: <SettingOutlined />,
    label: 'ข้อมูลผู้ใช้งาน',
    children: [
      { key: '/users/UserPage', label: 'ข้อมูลผู้ใช้งาน' },
      { key: '/users/UserGroupPage', label: 'สิทธิการใช้งาน' },
      { key: '/users/ActivityPage', label: 'Activity Log' },
      { key: '/users/LoginPage', label: 'Login Log' },
    ],
  },
  {
    key: '/system_settings',
    icon: <SettingOutlined />,
    label: 'การตั้งค่าการใช้งานระบบ',
    children: [
      { key: '/system_settings/ClientPage', label: 'ตั้งค่า การใช้งานของหน่วยงาน' },
      { key: '/system_settings/MailPage', label: 'ตั้งค่า Mail Server' },
      { key: '/system_settings/CaptchaPage', label: 'ตั้งค่า Captcha' },
      { key: '/system_settings/LineOAPage', label: 'ตั้งค่าการแจ้งเตือน LINE OA' },
      { key: '/settings/TermsConditionPage', label: 'ประกาศความเป็นส่วนตัว' },
    ],
  },
];
