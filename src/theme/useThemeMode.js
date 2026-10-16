import { useEffect, useState } from 'react';

const THEME_KEY = 'spm_time_theme';

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark';
  } catch {
    return false;
  }
}

// เก็บโหมดสว่าง/มืด ไว้ใน localStorage และตั้ง data-theme ที่ <html> ให้ CSS variables เปลี่ยนตาม
export default function useThemeMode() {
  const [isDark, setIsDark] = useState(readSavedTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ไม่มี storage (เช่น private mode) ก็ใช้ได้ตามปกติ แค่จำค่าไม่ได้
    }
  }, [isDark]);

  return [isDark, () => setIsDark((v) => !v)];
}
