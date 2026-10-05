import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, Space, Card, Typography } from 'antd';
import th_TH from 'antd/locale/th_TH'; // นำเข้าภาษาไทยของ Ant Design

// ตั้งค่า Day.js ให้รองรับภาษาไทยและปี พ.ศ. (Buddhist Era) ทั่วทั้งแอป
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.locale('th');
dayjs.extend(buddhistEra);

import { 
  DashboardOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  TeamOutlined, 
  UserOutlined,
  SnippetsOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  FileSearchOutlined
} from '@ant-design/icons';

// ดึงไฟล์หน้าต่างๆ เข้ามา
import DashboardPage from './pages/DashboardPage';
// Request
import WorkCyclePage from './pages/WorkCyclePage';
import WorkCycleDetailPage from './pages/WorkCycleDetailPage';
import OTPage from './pages/OTPage';
import OTDetailPage from './pages/OTDetailPage';
import WFAPage from './pages/WFAPage';
import WFADetailPage from './pages/WFADetailPage';

// Report
import RptAttatancePage from './reports/RptAttatancePage';
import RptWorkCalendarPage from './reports/RptWorkCalendarPage';
import RptLeaveDetailPage from './reports/RptLeaveDetailPage';
import RptOvertimePage from './reports/RptOvertimePage';

//Settings
import WorkTimePage from './pages/WorkTimePage'; 
import HolidayPage from './pages/HolidayPage';
import LocationPage from './pages/LocationPage';




const { Header, Content, Sider } = Layout;
const { Title } = Typography; 

// คอมโพเนนต์สำหรับหน้าตั้งค่า (ประกาศไว้ด้านนอกเพื่อป้องกัน Error)
function SettingsPlaceholder({ title }) {
  return (
    <Card style={{ borderRadius: 8 }}>
      <Title level={4}>{title}</Title>
      <p>ระบบกำลังพัฒนาส่วนของการตั้งค่านี้...</p>
    </Card>
  );
}

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/DashboardPage', icon: <ClockCircleOutlined />, label: 'dashboard' },
    { key: '/report/RptWorkCalendarPage', icon: <CalendarOutlined />, label: 'ปฏิทินสรุปการมาปฏิบัติราชการ' },
    { key: '/report', icon: <FileSearchOutlined />, label: 'ตั้งค่าการทำงาน',
children: [
        { key: '/settings/WorkTimePage', label: 'ตั้งค่าเวลาการทำงาน' },
        { key: '/settings/WorkCyclePage', label: 'ตั้งค่ารอบการมาปฏิบัติราชการ' },
        { key: '/settings/OTPage', label: 'กำหนดผู้มีสิทธิทำงานล่วงเวลา' },
        { key: '/settings/WFAPage', label: 'กำหนดผู้มีสิทธิลงเวลานอกสถานที่' },
        
      ],

     },
    { key: '/report', icon: <FileSearchOutlined />, label: 'รายงาน',
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
        { key: '/settings/HolidayPage', label: 'ตั้งค่าวันหยุดประจำปี' },
        
        { key: '/settings/LocationPage', label: 'ตั้งค่าพิกัดการลงเวลา' },
        
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* CSS บังคับให้เมนูหลัก เมนูย่อย และข้อความภายในชิดซ้ายทั้งหมด */}
      <style>{`
        .ant-menu-item, .ant-menu-submenu-title, .ant-menu-sub .ant-menu-item {
          text-align: left !important;
        }
        .ant-menu-item .ant-menu-title-content, 
        .ant-menu-submenu-title .ant-menu-title-content, 
        .ant-menu-sub .ant-menu-item .ant-menu-title-content {
          text-align: left !important;
          display: inline-block;
          width: 100%;
        }
      `}</style>

      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '0 12px',
          background: '#002140',
          color: '#fff',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          {/* ปุ่มคลิกเพื่อเปิด/ปิดเมนู */}
          <span 
            onClick={() => setCollapsed(!collapsed)} 
            style={{ fontSize: '18px', cursor: 'pointer', marginRight: 8, minWidth: '24px', textAlign: 'center', color: '#d4af37' }}
            title={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          <img 
            src="/logo_spm.png" 
            alt="Logo" 
            style={{ width: 32, height: 32, objectFit: 'contain', minWidth: '32px' }} 
          />
          {!collapsed && (
            <span style={{ marginLeft: 10, fontSize: '13px', fontWeight: 'bold', lineHeight: '1.2' }}>
              สำนักเลขาธิการ<br/>นายกรัฐมนตรี
            </span>
          )}
        </div>

        <Menu 
          theme="dark" 
          selectedKeys={[location.pathname]} 
          mode="inline" 
          items={menuItems} 
          onClick={(e) => navigate(e.key)} 
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
          <h2 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>ระบบลงเวลาปฏิบัติราชการ</h2>
          <Space>
            <UserOutlined /> <span>เจ้าหน้าที่: สมชาย ใจดี (Developer)</span>
          </Space>
        </Header>

        <Content style={{ margin: '24px 16px' }}>
          <div style={{ padding: 24, minHeight: 380, background: '#f5f5f5', borderRadius: 8 }}>
            <Routes>
              {/* สั่งให้เปิดหน้าเว็บมาแล้ว Redirect ไปที่หน้า Dashboard ทันที */}
              <Route path="/" element={<Navigate to="/DashboardPage" replace />} />
              
              <Route path="/DashboardPage" element={<DashboardPage />} />

              <Route path="/report/RptAttatancePage" element={<RptAttatancePage />} />
              <Route path="/report/RptWorkCalendarPage" element={<RptWorkCalendarPage />} />
              <Route path="/report/RptLeaveDetailPage" element={<RptLeaveDetailPage />} />
              <Route path="/report/RptOvertimePage" element={<RptOvertimePage />} />

              {/* เปลี่ยนมาเรียกใช้งานคอมโพเนนต์ WorkTimePage จริงๆ ตรงนี้ */}
              <Route path="/settings/WorkTimePage" element={<WorkTimePage />} />
              <Route path="/settings/HolidayPage" element={<HolidayPage title="ตั้งค่าวันหยุดประจำปี" />} />
              <Route path="/settings/WorkCyclePage" element={<WorkCyclePage title="ตั้งค่ารอบการมาปฏิบัติราชการ" />} />
              <Route path="/settings/WorkCycleDetailPage" element={<WorkCycleDetailPage title="ตั้งค่ารอบการมาปฏิบัติราชการ" />} />
              <Route path="/settings/LocationPage" element={<LocationPage title="ตั้งค่าพิกัดการลงเวลา" />} />
              <Route path="/settings/OTPage" element={<OTPage title="กำหนดผู้มีสิทธิทำงานล่วงเวลา" />} />
              <Route path="/settings/OTDetailPage" element={<OTDetailPage title="Add/Edit ผู้มีสิทธิทำงานล่วงเวลา" />} />
              <Route path="/settings/WFAPage" element={<WFAPage title="กำหนดผู้มีสิทธิลงเวลานอกสถานที่" />} />
              <Route path="/settings/WFADetailPage" element={<WFADetailPage title="Add/Edit ผู้มีสิทธิลงเวลานอกสถานที่" />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}