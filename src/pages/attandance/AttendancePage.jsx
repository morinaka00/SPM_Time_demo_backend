import React, { useState } from 'react';
import { Button, Row, Col, Typography, Space, message } from 'antd';
import { EnvironmentOutlined, PlusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function AttendancePage() {
  const [checkedInList, setCheckedInList] = useState([
    { time: '16:10', type: 'ลงเวลาออก (16:30)', location: 'The Government House' },
    { time: '12:10', type: 'สแกนออก/เข้าพัก', location: 'The Government House' },
    { time: '08:10', type: 'ลงเวลาเข้า (08:30)', location: 'The Government House' },
  ]);

  const handleCheckIn = () => {
    const currentTime = dayjs().format('HH:mm');
    const newLog = {
      time: currentTime,
      type: 'ลงเวลาเพิ่มเติม',
      location: 'The Government House'
    };
    setCheckedInList([newLog, ...checkedInList]);
    message.success(`ลงเวลาสำเร็จ เวลา ${currentTime} น.`);
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #d9d9d9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      
      {/* 1. ส่วนจำลองแผนที่ GPS และพิกัด */}
      <div style={{ 
        height: 180, 
        background: '#e6f7ff', 
        backgroundImage: 'radial-gradient(#bae7ff 1.5px, transparent 1.5px)', 
        backgroundSize: '16px 16px', 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderBottom: '1px solid #d9d9d9'
      }}>
        {/* วงรัศมี GPS */}
        <div style={{ 
          position: 'absolute', 
          background: 'rgba(24, 144, 255, 0.15)', 
          width: 90, 
          height: 90, 
          borderRadius: '50%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <div style={{ width: 12, height: 12, background: '#ff4d4f', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(255,77,79,0.3)' }} />
        </div>
        
        {/* ป้ายแสดงวันที่ตรงกลางแผนที่ */}
        <div style={{ position: 'absolute', bottom: 10, background: 'rgba(255, 255, 255, 0.95)', padding: '4px 16px', borderRadius: 16, fontSize: '14px', fontWeight: 'bold', border: '1px solid #d9d9d9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          วันจันทร์ที่ 19 ส.ค. 2569
        </div>
      </div>

      {/* 2. แถบแสดงสถานที่และระยะห่าง */}
      <div style={{ background: '#fafafa', padding: '12px 16px', borderBottom: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', gap: 8 }}>
        <EnvironmentOutlined style={{ fontSize: '18px', color: '#595959' }} />
        <Text strong style={{ fontSize: '15px' }}>The Government House (0.01 กม.)</Text>
      </div>

      {/* 3. ปุ่มกดลงเวลาขนาดใหญ่ */}
      <div style={{ padding: '16px', background: '#fff', textAlign: 'center' }}>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleCheckIn}
          style={{ 
            width: '100%', 
            height: 48, 
            backgroundColor: '#d9f7be', 
            borderColor: '#b7eb8f', 
            color: '#389e0d', 
            fontWeight: 'bold', 
            fontSize: '16px',
            boxShadow: 'none'
          }}
        >
          ลงเวลา
        </Button>
      </div>

      {/* 4. หัวข้อ "การลงเวลา" และช่องแบ่งเวลาเข้า-ออก */}
      <div style={{ background: '#fff', borderTop: '1px solid #d9d9d9', borderBottom: '1px solid #d9d9d9', padding: '12px 16px' }}>
        <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: 8 }}>การลงเวลา</Text>
        <Row gutter={8}>
          <Col span={12} style={{ borderRight: '1px solid #f0f0f0', paddingRight: 8 }}>
            <div style={{ fontSize: '12px', color: '#595959' }}>The Government House</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#262626' }}>ลงเวลาเข้า (08:30)</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#52c41a', marginTop: 4 }}>08:10</div>
          </Col>
          <Col span={12} style={{ paddingLeft: 8 }}>
            <div style={{ fontSize: '12px', color: '#595959' }}>The Government House</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#262626' }}>ลงเวลาออก (16:30)</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff4d4f', marginTop: 4 }}>16:10</div>
          </Col>
        </Row>
      </div>

      {/* 5. ประวัติการลงเวลา (รายการด้านล่าง) */}
      <div style={{ background: '#fff', padding: '12px 16px', minHeight: 160 }}>
        <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: 12 }}>ประวัติการลงเวลา</Text>
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {checkedInList.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: index < checkedInList.length - 1 ? '1px solid #f0f0f0' : 'none', paddingBottom: 8 }}>
              <Space size={12}>
                <Text strong style={{ fontSize: '15px', width: 45 }}>{item.time}</Text>
                <Space size={4}>
                  <EnvironmentOutlined style={{ color: '#595959' }} />
                  <Text style={{ fontSize: '14px', color: '#262626' }}>{item.location}</Text>
                </Space>
              </Space>
            </div>
          ))}
        </Space>
      </div>

      {/* 6. ปุ่มบวก (+) มุมขวาล่าง */}
      <div style={{ padding: '8px 16px', background: '#fff', textAlign: 'right', borderTop: '1px solid #f0f0f0' }}>
        <Button 
          type="text" 
          shape="circle" 
          icon={<PlusCircleOutlined style={{ fontSize: '26px', color: '#262626' }} />} 
          onClick={handleCheckIn}
        />
      </div>

    </div>
  );
}