import { theme } from 'antd';

// ธีม "กรมเข้ม ริบบิ้นทอง" — ดู Design.md ข้อ 6
// ค่าในโหมดมืดต้องตรงกับ [data-theme='dark'] ใน src/index.css

const lightTokens = {
  colorPrimary: '#26418a',
  colorInfo: '#26418a',
  colorLink: '#26418a',
  colorSuccess: '#1e6b48',
  colorWarning: '#c9982c',
  colorError: '#c0392b',
  // พื้น/ขอบของสถานะ (Design.md ข้อ 1.4) — กำหนดเองแทนค่าที่ antd คำนวณให้
  colorSuccessBg: '#f2fbf5',
  colorSuccessBorder: '#bfe3cb',
  colorWarningBg: '#fdf5ee',
  colorWarningBorder: '#f3d3ba',
  colorErrorBg: '#fdf1ef',
  colorErrorBorder: '#f2c6c0',
  colorText: '#0c1b3a',
  colorTextHeading: '#0c1b3a',
  colorTextSecondary: '#7c7a70',
  colorBorder: '#e7e4dc',
  colorBorderSecondary: '#efece5',
  colorBgLayout: '#fbfaf7',
  colorBgContainer: '#ffffff',
  colorBgElevated: '#ffffff',
};

const darkTokens = {
  colorPrimary: '#4a68c0',
  colorInfo: '#4a68c0',
  colorLink: '#8fa6e6',
  colorSuccess: '#5fbf8f',
  colorWarning: '#e2bd5f',
  colorError: '#e57366',
  colorSuccessBg: '#16302a',
  colorSuccessBorder: '#285844',
  colorWarningBg: '#33281a',
  colorWarningBorder: '#5c4524',
  colorErrorBg: '#3a2020',
  colorErrorBorder: '#5a2f2f',
  colorText: '#eef0f4',
  colorTextHeading: '#eef0f4',
  colorTextSecondary: '#aab1c0',
  colorBorder: '#2b3247',
  colorBorderSecondary: '#242b40',
  colorBgLayout: '#12172a',
  colorBgContainer: '#1c2338',
  colorBgElevated: '#1c2338',
};

export function getOpmTheme(isDark) {
  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      ...(isDark ? darkTokens : lightTokens),
      fontFamily: "'Prompt', 'Sarabun', sans-serif",
      fontSize: 14,
      borderRadius: 8,
    },
    components: {
      Layout: {
        headerBg: '#0c1b3a',
        siderBg: '#0c1b3a',
        triggerBg: '#081531',
        triggerColor: '#f0d99a',
        bodyBg: isDark ? '#12172a' : '#fbfaf7',
        headerHeight: 64,
        headerPadding: '0 24px',
      },
      Menu: {
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'rgba(8,21,49,0.35)',
        darkPopupBg: '#0c1b3a',
        darkItemColor: 'rgba(255,255,255,0.72)',
        darkItemHoverColor: '#ffffff',
        darkItemHoverBg: 'rgba(255,255,255,0.06)',
        darkItemSelectedBg: 'rgba(201,152,44,0.18)',
        darkItemSelectedColor: '#f0d99a',
      },
      Card: {
        headerFontSize: 15,
      },
      Table: {
        headerBg: isDark ? '#181e31' : '#fbfaf7',
        headerColor: isDark ? '#eef0f4' : '#0c1b3a',
        rowHoverBg: isDark ? '#222a42' : '#f6f4ee',
      },
    },
  };
}
