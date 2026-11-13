import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, ConfigProvider } from 'antd';
import th_TH from 'antd/locale/th_TH'; // นำเข้าภาษาไทยของ Ant Design
import './App.css';
import BrandHeader from './components/BrandHeader';
import HeaderActions from './components/HeaderActions';
import { getOpmTheme } from './theme/opmTheme';
import useThemeMode from './theme/useThemeMode';
import { readSession, writeSession } from './auth/session';
import LoginPage from './pages/login/LoginPage';

// ตั้งค่า Day.js ให้รองรับภาษาไทยและปี พ.ศ. (Buddhist Era) ทั่วทั้งแอป
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.locale('th');
dayjs.extend(buddhistEra);

import { DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { MENU_ITEMS } from './config/menuItems';

// ดึงไฟล์หน้าต่างๆ เข้ามา

// Dash Board
import DashboardPage from './pages/DashboardPage';

//Attandance การมาปฏิบัติราชการ
import AttendancePage from './pages/attandance/AttendancePage';
import CalendarPage from './pages/attandance/CalendarPage';
import AttendanceRequestPage from './pages/attandance/AttendanceRequestPage';
import AttendanceApprovePage from './pages/attandance/AttendanceApprovePage';
import LeavehistoryPage from './pages/attandance/LeavehistoryPage';
import OvertimeHistoryPage from './pages/attandance/OvertimeHistoryPage';
import AttendanceHistoryPage from './pages/attandance/AttendanceHistoryPage';

// Calendar Report ปฏิทินสรุปการมาทำงาน
import RptWorkCalendarPage from './reports/RptWorkCalendarPage';

//Attandance Settings ตั้งค่าการทำงาน
import WorkTimePage from './pages/attandance_setting/WorkTimePage'; 
import WorkCyclePage from './pages/attandance_setting/WorkCyclePage';
import WorkCycleDetailPage from './pages/attandance_setting/WorkCycleDetailPage';
import OTPage from './pages/attandance_setting/OTPage';
import OTDetailPage from './pages/attandance_setting/OTDetailPage';
import WFAPage from './pages/attandance_setting/WFAPage';
import WFADetailPage from './pages/attandance_setting/WFADetailPage';




// System Setting
import HolidayGroupPage from './pages/setting/HolidayGroupPage';
import HolidayPage from './pages/setting/HolidayPage';
import OTRatePage from './pages/setting/OTRatePage';
import LocationPage from './pages/setting/LocationPage';


// Report
import RptAttatancePage from './reports/RptAttatancePage';
import RptLeaveDetailPage from './reports/RptLeaveDetailPage';
import RptOvertimePage from './reports/RptOvertimePage';
import AttendanceLogPage from './reports/AttendanceLogPage';

//user && permission
import TermsConditionPage from './pages/setting/TermsConditionPage';
import UserPage from './pages/users/UserPage';
import UserDetailPage from './pages/users/UserDetailPage';
import UserGroupPage from './pages/users/UserGroupPage';
import UserGroupDetailPage from './pages/users/UserGroupDetailPage';
import ActivityPage from './pages/users/ActivityPage';
import LoginLogPage from './pages/users/LoginPage';
import ClientPage from './pages/system_settings/ClientPage';
import MailPage from './pages/system_settings/MailPage';
import CaptchaPage from './pages/system_settings/CaptchaPage';
import LineOAPage from './pages/system_settings/LineOAPage';





const { Header, Content, Sider } = Layout;


function MainLayout({ isDark, onToggleTheme, onLogout }) {
  // จอแคบกว่า md ให้เริ่มแบบย่อเมนู (onBreakpoint จะทำงานเฉพาะตอนขนาดจอเปลี่ยน)
  const [collapsed, setCollapsed] = useState(() => window.matchMedia('(max-width: 767.98px)').matches);
  const navigate = useNavigate();
  const location = useLocation();


  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Sider
        className="app-sider"
        width={232}
        breakpoint="md"
        onBreakpoint={(broken) => setCollapsed(broken)}
        collapsible
        trigger={null}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div className="brand" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          {/* ปุ่มคลิกเพื่อเปิด/ปิดเมนู */}
          <span
            className="brand-toggle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          {!collapsed && (
            <>
              <span className="brand-name">
                ระบบบันทึกเวลาปฏิบัติราชการ
                <small>Time Attendance</small>
              </span>
            </>
          )}
        </div>

        <Menu 
          theme="dark" 
          selectedKeys={[location.pathname]} 
          mode="inline" 
          items={MENU_ITEMS} 
          onClick={(e) => navigate(e.key)} 
        />
      </Sider>

      <Layout>
        <Header className="app-header">
          <div className="app-header-left">
            <BrandHeader size="sm" />
          </div>
          <HeaderActions isDark={isDark} onToggleTheme={onToggleTheme} onLogout={onLogout} />
        </Header>

        <Content className="app-content">
          <div>
            <Routes>
              {/* สั่งให้เปิดหน้าเว็บมาแล้ว Redirect ไปที่หน้า Dashboard ทันที */}
              <Route path="/" element={<Navigate to="/DashboardPage" replace />} />
              
              <Route path="/DashboardPage" element={<DashboardPage />} />
              
              <Route path="/attendance/AttendancePage" element={<AttendancePage />} />
               <Route path="/attendance/AttendanceRequestPage" element={<AttendanceRequestPage />} />
              <Route path="/attendance/AttendanceApprovePage" element={<AttendanceApprovePage />} />
              <Route path="/attendance/CalendarPage" element={<CalendarPage />} />
              <Route path="/attendance/LeavehistoryPage" element={<LeavehistoryPage />} />
              <Route path="/attendance/OvertimeHistoryPage" element={<OvertimeHistoryPage />} />
              <Route path="/attendance/DashboardOutlined" element={<DashboardOutlined />} />
              <Route path="/attendance/AttendanceHistoryPage" element={<AttendanceHistoryPage />} />
              


              <Route path="/report/RptAttatancePage" element={<RptAttatancePage />} />
              <Route path="/report/RptWorkCalendarPage" element={<RptWorkCalendarPage />} />
              <Route path="/report/RptLeaveDetailPage" element={<RptLeaveDetailPage />} />
              <Route path="/report/RptOvertimePage" element={<RptOvertimePage />} />
              <Route path="/report/AttendanceLogPage" element={<AttendanceLogPage />} />

              {/* เปลี่ยนมาเรียกใช้งานคอมโพเนนต์ WorkTimePage จริงๆ ตรงนี้ */}
              <Route path="/settings/WorkTimePage" element={<WorkTimePage />} />
              <Route path="/settings/HolidayGroupPage" element={<HolidayGroupPage title="ตั้งค่ากลุ่มวันหยุดประจำปี" />} />
              <Route path="/settings/HolidayPage" element={<HolidayPage title="ตั้งค่าวันหยุดประจำปี" />} />
              <Route path="/settings/OTRatePage" element={<OTRatePage title="ตั้งค่าอัตราค่าล่วงเวลา" />} />

              
              <Route path="/settings/WorkCyclePage" element={<WorkCyclePage title="ตั้งค่ารอบการมาปฏิบัติราชการ" />} />
              <Route path="/settings/WorkCycleDetailPage" element={<WorkCycleDetailPage title="ตั้งค่ารอบการมาปฏิบัติราชการ" />} />
              <Route path="/settings/LocationPage" element={<LocationPage title="ตั้งค่าพิกัดการลงเวลา" />} />
              <Route path="/settings/OTPage" element={<OTPage title="กำหนดผู้มีสิทธิทำงานล่วงเวลา" />} />
              <Route path="/settings/OTDetailPage" element={<OTDetailPage title="Add/Edit ผู้มีสิทธิทำงานล่วงเวลา" />} />
              <Route path="/settings/WFAPage" element={<WFAPage title="กำหนดผู้มีสิทธิลงเวลานอกสถานที่" />} />
              <Route path="/settings/WFADetailPage" element={<WFADetailPage title="Add/Edit ผู้มีสิทธิลงเวลานอกสถานที่" />} />

              <Route path="/users/UserPage" element={<UserPage />} />
              <Route path="/users/UserDetailPage" element={<UserDetailPage />} />
              <Route path="/users/UserGroupPage" element={<UserGroupPage />} />
              <Route path="/users/UserGroupDetailPage" element={<UserGroupDetailPage />} />
              <Route path="/users/ActivityPage" element={<ActivityPage />} />
              <Route path="/users/LoginPage" element={<LoginLogPage />} />
              <Route path="/system_settings/ClientPage" element={<ClientPage />} />
              <Route path="/system_settings/MailPage" element={<MailPage />} />
              <Route path="/system_settings/CaptchaPage" element={<CaptchaPage />} />
              <Route path="/system_settings/LineOAPage" element={<LineOAPage />} />

              <Route path="/settings/TermsConditionPage" element={<TermsConditionPage title="ตั้งค่าข้อกำหนดและเงื่อนไขการใช้งาน" />} />
              
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

// ต้อง Login ก่อนเข้าทุกหน้า — ยังไม่ Login จะถูกพาไป /login แล้วกลับมาหน้าเดิมหลังเข้าสู่ระบบ
function AppRoutes({ isDark, onToggleTheme }) {
  const [session, setSession] = useState(readSession);
  const navigate = useNavigate();
  const location = useLocation();

  const login = (username, method) => {
    const next = { username, method, loginAt: new Date().toISOString() };
    writeSession(next);
    setSession(next); // เส้นทาง /login จะพากลับหน้าเดิมเอง (ดู homePath ด้านล่าง)
  };

  const logout = () => {
    writeSession(null);
    setSession(null);
    navigate('/login', { replace: true });
  };

  // หลัง Login กลับไปหน้าที่ตั้งใจเปิดไว้ก่อนถูกพามา /login (ถ้ามี)
  const homePath = location.state?.from || '/DashboardPage';

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to={homePath} replace /> : <LoginPage onLogin={login} />}
      />
      <Route
        path="/*"
        element={
          session ? (
            <MainLayout isDark={isDark} onToggleTheme={onToggleTheme} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  const [isDark, toggleTheme] = useThemeMode();
  return (
    <ConfigProvider theme={getOpmTheme(isDark)} locale={th_TH}>
      <BrowserRouter>
        <AppRoutes isDark={isDark} onToggleTheme={toggleTheme} />
      </BrowserRouter>
    </ConfigProvider>
  );
}