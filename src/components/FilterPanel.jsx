import { Children, useState } from 'react';
import { Row, Col, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

// ส่วนค้นหา/กรองข้อมูลมาตรฐานของทุกหน้า (รูปแบบเดียวกับหน้า users/UserPage)
//   - ช่องกรอง: ป้ายชื่ออยู่ด้านบน เรียงแถวละ 4 ช่องบนจอกว้าง (FilterField กำหนด span ได้)
//   - ปุ่ม "ค้นหา" + "ล้างค่า" ชิดซ้าย, ปุ่มเสริม (เช่น Export) ชิดขวาผ่าน prop `extra`
//   - กด Enter ในช่องข้อความ = ค้นหา
//   - "ล้างค่า" คืนค่าเริ่มต้นให้ช่องที่ไม่ได้ผูก state (ใช้ defaultValue) โดย mount ใหม่
//     ส่วนช่องที่ผูก state ให้คืนค่าเองใน onReset
//
// ตัวอย่าง:
//   <FilterPanel onSearch={...} onReset={...} extra={<Button>Export</Button>}>
//     <FilterField label="หน่วยงาน"><Select defaultValue="all" ... /></FilterField>
//   </FilterPanel>

export function FilterField({ label, htmlFor, span = 6, children }) {
  // span = ความกว้างบนจอใหญ่ (จาก 24) — มือถือเต็มแถว, แท็บเล็ตครึ่งแถว
  return (
    <Col xs={24} sm={span > 12 ? 24 : 12} lg={span}>
      <label className="filter-panel-label" htmlFor={htmlFor}>{label}</label>
      {children}
    </Col>
  );
}

export default function FilterPanel({ children, onSearch, onReset, extra, searchText = 'ค้นหา', className = '' }) {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    onReset?.();
  };

  return (
    <form
      className={`filter-panel ${className}`.trim()}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.();
      }}
    >
      <Row gutter={[16, 16]} key={resetKey}>
        {Children.toArray(children)}
      </Row>
      <div className="filter-panel-actions">
        <Space wrap>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            {searchText}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            ล้างค่า
          </Button>
        </Space>
        {extra && <Space wrap>{extra}</Space>}
      </div>
    </form>
  );
}
