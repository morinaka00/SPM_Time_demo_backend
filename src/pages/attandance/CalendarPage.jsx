import { useState } from 'react';
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
    <div className="panel">
      
      {/* 1. หัวข้อหน้า */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-soft)' }}>
        <Text strong className="section-label">ปฏิทินสรุปการทำงาน</Text>
      </div>

      {/* 2. แถบเปลี่ยนเดือน */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
        <Button type="text" icon={<LeftOutlined />} size="small" />
        <Text strong style={{ fontSize: '15px' }}>สิงหาคม 2569</Text>
        <Button type="text" icon={<RightOutlined />} size="small" />
      </div>

      {/* 3. แถบหัววันในสัปดาห์ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--grad-bar)', color: 'var(--gold-pale)', borderBottom: '2px solid var(--gold)', textAlign: 'center', fontSize: '12px', padding: '8px 0', fontWeight: 600 }}>
        {weekDays.map((d, index) => (
          <div key={index}>{d}</div>
        ))}
      </div>

      {/* 4. ตาราง Grid วันที่และจุดสถานะ */}
      <div style={{ padding: '8px 4px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
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
                    background: isSelected ? 'rgba(240,217,154,0.22)' : 'transparent',
                    border: isSelected ? '1px solid var(--gold)' : '1px solid transparent',
                    borderRadius: 6, transition: 'background 220ms var(--ease)',
                    opacity: item.month === 'current' ? 1 : 0.4
                  }}
                >
                  <div style={{ fontSize: '13px', color: 'var(--text-dark)', marginBottom: 2 }}>{item.day}</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {item.type === 'complete' && <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1.5px solid var(--ok)', display: 'inline-block' }} />}
                    {item.type === 'holiday' && <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1.5px solid var(--navy-3)', display: 'inline-block' }} />}
                    {item.type === 'incomplete' && <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1.5px solid var(--danger)', display: 'inline-block' }} />}
                    {item.type === 'normal' && <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1.5px solid var(--border)', display: 'inline-block' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 5. คำอธิบายสัญลักษณ์ (Legend) */}
      <div style={{ padding: '8px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid var(--ok)', display: 'inline-block' }} />
          <Text style={{ fontSize: '12px' }}>ข้อมูลครบถ้วน</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid var(--navy-3)', display: 'inline-block' }} />
          <Text style={{ fontSize: '12px' }}>วันหยุด</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid var(--danger)', display: 'inline-block' }} />
          <Text style={{ fontSize: '12px' }}>ข้อมูลไม่สมบูรณ์</Text>
        </div>
      </div>

      {/* 6. ส่วนแสดงการลงเวลาของวันที่ถูกเลือก */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 16px' }}>
        <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: 8 }}>การลงเวลา</Text>
        <Row gutter={8}>
          <Col span={12} style={{ borderRight: '1px solid var(--border-soft)', paddingRight: 8 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EnvironmentOutlined /> The Government House
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-dark)', marginTop: 2 }}>ลงเวลาเข้า (08:30)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--ok)', marginTop: 2 }}>08:10</div>
          </Col>
          <Col span={12} style={{ paddingLeft: 8 }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <EnvironmentOutlined /> The Government House
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-dark)', marginTop: 2 }}>ลงเวลาออก (16:30)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--danger)', marginTop: 2 }}>13:10</div>
          </Col>
        </Row>
      </div>

      {/* 7. ส่วนแสดงข้อมูลการลา */}
      <div style={{ background: 'var(--surface)', padding: '12px 16px' }}>
        <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: 6 }}>การลา</Text>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-dark)' }}>ลาป่วย</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>(19 ส.ค. 2569 13:00 - 16:30)</div>
        <div style={{ fontSize: '13px', marginTop: '4px' }}>
          สถานะ : <span style={{ color: 'var(--warn)', fontWeight: 'bold' }}>รออนุมัติ</span>
        </div>
      </div>

    </div>
  );
}