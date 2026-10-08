import React, { useState } from 'react';
import { Typography, Row, Col, Button } from 'antd';
import { LeftOutlined, RightOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(19); // ค่าเริ่มต้นเลือกวันที่ 19 (วันที่ตัวอย่างมีข้อมูลการลา)

  // จำลองข้อมูลตารางปฏิทินเดือนสิงหาคม 2569
  const calendarWeeks = [
    [
      { day: 26, type: 'holiday', month: 'prev' },
      { day: 27, type: 'complete', month: 'prev' },
      { day: 28, type: 'complete', month: 'prev' },
      { day: 29, type: 'complete', month: 'prev' },
      { day: 30, type: 'complete', month: 'prev' },
      { day: 31, type: 'complete', month: 'prev' },
      { day: 1, type: 'holiday', month: 'current' },
    ],
    [
      { day: 2, type: 'holiday', month: 'current' },
      { day: 3, type: 'complete', month: 'current' },
      { day: 4, type: 'complete', month: 'current' },
      { day: 5, type: 'complete', month: 'current' },
      { day: 6, type: 'complete', month: 'current' },
      { day: 7, type: 'complete', month: 'current' },
      { day: 8, type: 'holiday', month: 'current' },
    ],
    [
      { day: 9, type: 'holiday', month: 'current' },
      { day: 10, type: 'complete', month: 'current' },
      { day: 11, type: 'complete', month: 'current' },
      { day: 12, type: 'holiday', month: 'current' },
      { day: 13, type: 'complete', month: 'current' },
      { day: 14, type: 'complete', month: 'current' },
      { day: 15, type: 'holiday', month: 'current' },
    ],
    [
      { day: 16, type: 'holiday', month: 'current' },
      { day: 17, type: 'complete', month: 'current' },
      { day: 18, type: 'complete', month: 'current' },
      { day: 19, type: 'incomplete', month: 'current' }, // วันที่ 19 มีข้อมูลไม่สมบูรณ์ (จุดแดง)
      { day: 20, type: 'complete', month: 'current' },
      { day: 21, type: 'complete', month: 'current' },
      { day: 22, type: 'holiday', month: 'current' },
    ],
    [
      { day: 23, type: 'holiday', month: 'current' },
      { day: 24, type: 'complete', month: 'current' },
      { day: 25, type: 'complete', month: 'current' },
      { day: 26, type: 'normal', month: 'current' },
      { day: 27, type: 'normal', month: 'current' },
      { day: 28, type: 'normal', month: 'current' },
      { day: 29, type: 'normal', month: 'current' },
    ],
    [
      { day: 30, type: 'normal', month: 'current' },
      { day: 31, type: 'normal', month: 'current' },
      { day: 1, type: 'normal', month: 'next' },
      { day: 2, type: 'normal', month: 'next' },
      { day: 3, type: 'normal', month: 'next' },
      { day: 4, type: 'normal', month: 'next' },
      { day: 5, type: 'holiday', month: 'next' },
    ],
  ];

  const weekDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #d9d9d9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      
      {/* 1. หัวข้อหน้า */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Text strong style={{ fontSize: '16px' }}>ปฏิทินสรุปการทำงาน</Text>
      </div>

      {/* 2. แถบเปลี่ยนเดือน */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '8px 16px', borderBottom: '1px solid #d9d9d9' }}>
        <Button type="text" icon={<LeftOutlined />} size="small" />
        <Text strong style={{ fontSize: '15px' }}>สิงหาคม 2569</Text>
        <Button type="text" icon={<RightOutlined />} size="small" />
      </div>

      {/* 3. แถบหัววันในสัปดาห์ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#1890ff', color: '#fff', textAlign: 'center', fontSize: '12px', padding: '6px 0', fontWeight: 'bold' }}>
        {weekDays.map((d, index) => (
          <div key={index}>{d}</div>
        ))}
      </div>

      {/* 4. ตาราง Grid วันที่และจุดสถานะ */}
      <div style={{ padding: '8px 4px', background: '#fff', borderBottom: '1px solid #d9d9d9' }}>
        {calendarWeeks.map((week, wIndex) => (
          <div key={wIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
            {week.map((item, dIndex) => {
              const isSelected = selectedDay === item.day && item.month === 'current';
              return (
                <div 
                  key={dIndex} 
                  onClick={() => item.month === 'current' && setSelectedDay(item.day)}
                  style={{ 
                    textAlign: 'center', 
                    cursor: item.month === 'current' ? 'pointer' : 'default',
                    padding: '4px 0',
                    background: isSelected ? '#fffbe6' : 'transparent',
                    border: isSelected ? '1px solid #ffe58f' : '1px solid transparent',
                    borderRadius: 4,
                    opacity: item.month === 'current' ? 1 : 0.4
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#262626', marginBottom: 2 }}>{item.day}</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {item.type === 'complete' && <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1.5px solid #52c41a', display: 'inline-block' }} />}
                    {item.type === 'holiday' && <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1.5px solid #1890ff', display: 'inline-block' }} />}
                    {item.type === 'incomplete' && <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1.5px solid #ff4d4f', display: 'inline-block' }} />}
                    {item.type === 'normal' && <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1.5px solid #d9d9d9', display: 'inline-block' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 5. คำอธิบายสัญลักษณ์ (Legend) */}
      <div style={{ padding: '8px 16px', background: '#fafafa', borderBottom: '1px solid #d9d9d9', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid #52c41a', display: 'inline-block' }} />
          <Text style={{ fontSize: '12px' }}>ข้อมูลครบถ้วน</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid #1890ff', display: 'inline-block' }} />
          <Text style={{ fontSize: '12px' }}>วันหยุด</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid #ff4d4f', display: 'inline-block' }} />
          <Text style={{ fontSize: '12px' }}>ข้อมูลไม่สมบูรณ์</Text>
        </div>
      </div>

      {/* 6. ส่วนแสดงการลงเวลาของวันที่ถูกเลือก */}
      <div style={{ background: '#fff', borderBottom: '1px solid #d9d9d9', padding: '12px 16px' }}>
        <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: 8 }}>การลงเวลา</Text>
        <Row gutter={8}>
          <Col span={12} style={{ borderRight: '1px solid #f0f0f0', paddingRight: 8 }}>
            <div style={{ fontSize: '11px', color: '#595959', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EnvironmentOutlined /> The Government House
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#262626', marginTop: 2 }}>ลงเวลาเข้า (08:30)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a', marginTop: 2 }}>08:10</div>
          </Col>
          <Col span={12} style={{ paddingLeft: 8 }}>
            <div style={{ fontSize: '11px', color: '#595959', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EnvironmentOutlined /> The Government House
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#262626', marginTop: 2 }}>ลงเวลาออก (16:30)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f', marginTop: 2 }}>13:10</div>
          </Col>
        </Row>
      </div>

      {/* 7. ส่วนแสดงข้อมูลการลา */}
      <div style={{ background: '#fff', padding: '12px 16px' }}>
        <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: 6 }}>การลา</Text>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#262626' }}>ลาป่วย</div>
        <div style={{ fontSize: '12px', color: '#595959', marginTop: 2 }}>(19 ส.ค. 2569 13:00 - 16:30)</div>
        <div style={{ fontSize: '13px', marginTop: '4px' }}>
          สถานะ : <span style={{ color: '#faad14', fontWeight: 'bold' }}>รออนุมัติ</span>
        </div>
      </div>

    </div>
  );
}