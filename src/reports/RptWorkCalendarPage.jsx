import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, Input, Table, Typography, Space, Popover } from 'antd';
import { 
  ArrowLeftOutlined, 
  SearchOutlined, 
  LeftOutlined, 
  RightOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { Option } = Select;

export default function RptWorkCalendarPage() {
  const navigate = useNavigate();

  // ข้อมูลจำลองพนักงานและสถานะการทำงานรายวัน (สิงหาคม 2026 มี 31 วัน)
  const staffData = [
    {
      key: '1',
      name: 'นาย xxx xxx',
      code: '10101',
      statuses: {
        1: 'holiday', 2: 'holiday', 3: 'normal', 4: 'normal', 5: 'normal', 6: 'normal', 7: 'normal',
        8: 'holiday', 9: 'holiday', 10: 'normal', 11: 'normal', 12: 'holiday', 13: 'normal', 14: 'leave',
        15: 'holiday', 16: 'holiday', 17: 'normal', 18: 'late', 19: 'normal', 20: 'normal', 21: 'absent',
        22: 'holiday', 23: 'holiday', 24: 'normal', 25: 'normal', 26: 'normal', 27: 'incomplete', 
        29: 'holiday', 30: 'holiday'
      }
    },
    {
      key: '2',
      name: 'นาย xxx xxx',
      code: '10102',
      statuses: {
        1: 'holiday', 2: 'holiday', 3: 'normal', 4: 'normal', 5: 'normal', 6: 'absent', 7: 'normal',
        8: 'holiday', 9: 'holiday', 10: 'normal', 11: 'normal', 12: 'holiday', 13: 'normal', 14: 'normal',
        15: 'holiday', 16: 'holiday', 17: 'normal', 18: 'normal', 19: 'late', 20: 'normal', 21: 'normal',
        22: 'holiday', 23: 'holiday', 24: 'normal', 25: 'normal', 26: 'leave', 27: 'incomplete', 
        29: 'holiday', 30: 'holiday'
      }
    },
    {
      key: '3',
      name: 'นาย xxx xxx',
      code: '20202',
      statuses: {
        1: 'holiday', 2: 'holiday', 3: 'normal', 4: 'normal', 5: 'leave', 6: 'normal', 7: 'normal',
        8: 'holiday', 9: 'holiday', 10: 'normal', 11: 'normal', 12: 'holiday', 13: 'absent', 14: 'normal',
        15: 'holiday', 16: 'holiday', 17: 'normal', 18: 'normal', 19: 'normal', 20: 'late', 21: 'normal',
        22: 'holiday', 23: 'holiday', 24: 'normal', 25: 'normal', 26: 'normal', 27: 'incomplete', 
        29: 'holiday', 30: 'holiday'
      }
    },
    {
      key: '4',
      name: 'นางสาว xxx xxx',
      code: '20404',
      statuses: {
        1: 'holiday', 2: 'holiday', 3: 'normal', 4: 'normal', 5: 'normal', 6: 'normal', 7: 'late',
        8: 'holiday', 9: 'holiday', 10: 'leave', 11: 'normal', 12: 'holiday', 13: 'normal', 14: 'normal',
        15: 'holiday', 16: 'holiday', 17: 'normal', 18: 'normal', 19: 'normal', 20: 'normal', 21: 'normal',
        22: 'holiday', 23: 'holiday', 24: 'absent', 25: 'normal', 26: 'normal', 27: 'incomplete', 
        29: 'holiday', 30: 'holiday'
      }
    },
    {
      key: '5',
      name: 'นางสาว xxx xxx',
      code: '20601',
      statuses: {
        1: 'holiday', 2: 'holiday', 3: 'normal', 4: 'absent', 5: 'normal', 6: 'normal', 7: 'normal',
        8: 'holiday', 9: 'holiday', 10: 'normal', 11: 'normal', 12: 'holiday', 13: 'normal', 14: 'normal',
        15: 'holiday', 16: 'holiday', 17: 'leave', 18: 'normal', 19: 'normal', 20: 'normal', 21: 'normal',
        22: 'holiday', 23: 'holiday', 24: 'normal', 25: 'late', 26: 'normal', 27: 'incomplete', 
        29: 'holiday', 30: 'holiday'
      }
    }
  ];

  // วันในสัปดาห์ของเดือนสิงหาคม 2026 (เริ่มวันที่ 1 ส.ค. 2026 เป็นวันเสาร์)
  const daysInAugust = [
    { day: 1, dow: 'ส' }, { day: 2, dow: 'อา' }, { day: 3, dow: 'จ' }, { day: 4, dow: 'อ' }, 
    { day: 5, dow: 'พ' }, { day: 6, dow: 'พฤ' }, { day: 7, dow: 'ศ' }, { day: 8, dow: 'ส' }, 
    { day: 9, dow: 'อา' }, { day: 10, dow: 'จ' }, { day: 11, dow: 'อ' }, { day: 12, dow: 'พ' }, 
    { day: 13, dow: 'พฤ' }, { day: 14, dow: 'ศ' }, { day: 15, dow: 'ส' }, { day: 16, dow: 'อา' }, 
    { day: 17, dow: 'จ' }, { day: 18, dow: 'อ' }, { day: 19, dow: 'พ' }, { day: 20, dow: 'พฤ' }, 
    { day: 21, dow: 'ศ' }, { day: 22, dow: 'ส' }, { day: 23, dow: 'อา' }, { day: 24, dow: 'จ' }, 
    { day: 25, dow: 'อ' }, { day: 26, dow: 'พ' }, { day: 27, dow: 'พฤ' }, { day: 28, dow: 'ศ' }, 
    { day: 29, dow: 'ส' }, { day: 30, dow: 'อา' }, { day: 31, dow: 'จ' }
  ];

  // ฟังก์ชันเรนเดอร์สัญลักษณ์สถานะในแต่ละวัน พร้อม Popover รายละเอียด
  const renderStatusCell = (status) => {
    let content = null;
    let popoverContent = null;

    switch (status) {
      case 'absent':
        content = <span style={{ color: '#ff4d4f', fontSize: '16px', fontWeight: 'bold' }}>✕</span>;
        popoverContent = (

          <div style={{ width: '210px', padding: '4px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: 6, borderBottom: '1px solid #f0f0f0', paddingBottom: 4, textAlign: 'center' }}>
              ขาดงาน
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #f0f0f0', paddingRight: 4 }}>
                
                <div style={{ fontWeight: 'bold',color: '#595959' }}>-</div>
                <div style={{ color: '#595959' }}>ลงเวลาเข้า (08:30)</div>
                <div style={{ color: '#c41a28', fontWeight: 'bold', fontSize: '12px', marginTop: 2 }}>-</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1, paddingLeft: 4 }}>
                <div style={{ fontWeight: 'bold',color: '#595959' }}>-</div>
                <div style={{ color: '#595959' }}>ลงเวลาออก (16:30)</div>
                <div style={{ color: '#c41a28', fontWeight: 'bold', fontSize: '12px', marginTop: 2 }}>-</div>
              </div>
            </div>
          </div>


        );
        break;
      case 'incomplete':
        content = <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#8c8c8c' }}></span>;
        popoverContent = (
          <div style={{ width: '210px', padding: '4px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: 6, borderBottom: '1px solid #f0f0f0', paddingBottom: 4, textAlign: 'center' }}>
              ยังไม่สมบูรณ์
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #f0f0f0', paddingRight: 4 }}>
                
                <div style={{ fontWeight: 'bold',color: '#595959' }}>The Government House</div>
                <div style={{ color: '#595959' }}>ลงเวลาเข้า (08:30)</div>
                <div style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '12px', marginTop: 2 }}>08:10</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1, paddingLeft: 4 }}>
                <div style={{ fontWeight: 'bold',color: '#595959' }}>-</div>
                <div style={{ color: '#595959' }}>ลงเวลาออก (16:30)</div>
                <div style={{ color: '#c41a28', fontWeight: 'bold', fontSize: '12px', marginTop: 2 }}>-</div>
              </div>
            </div>
          </div>

        );
        break;
      case 'late':
        content = <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#fa8c16' }}></span>;
        popoverContent = (
          <div style={{ width: '210px', padding: '4px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: 6, borderBottom: '1px solid #f0f0f0', paddingBottom: 4, textAlign: 'center' }}>
              เข้างานสาย/ออกงานก่อนเวลา
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #f0f0f0', paddingRight: 4 }}>
                
                <div style={{ fontWeight: 'bold',color: '#595959' }}>The Government House</div>
                <div style={{ color: '#595959' }}>ลงเวลาเข้า (08:30)</div>
                <div style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '12px', marginTop: 2 }}>08:10</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1, paddingLeft: 4 }}>
                <div style={{ fontWeight: 'bold',color: '#595959' }}>The Government House</div>
                <div style={{ color: '#595959' }}>ลงเวลาออก (16:30)</div>
                <div style={{ color: '#c41a28', fontWeight: 'bold', fontSize: '12px', marginTop: 2 }}>16:10</div>
              </div>
            </div>
          </div>

        );
        break;
      case 'leave':
        content = <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#1890ff' }}></span>;
        popoverContent = (
          <div style={{ textAlign: 'center', padding: '4px' }}>
            <Text strong style={{ fontSize: '12px' }}>ลาป่วย 08:30-16.30 </Text>
            <div style={{ fontSize: '12px', color: '#595959', marginTop: 2 }}>มีไข้ มีน้ำมูก เจ็บคอ</div>
          </div>
        );
        break;
      case 'normal':
      case 'ontime':
        content = <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#52c41a' }}></span>;
        popoverContent = (
          <div style={{ width: '210px', padding: '4px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: 6, borderBottom: '1px solid #f0f0f0', paddingBottom: 4, textAlign: 'center' }}>
              ลงเวลาปกติ
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #f0f0f0', paddingRight: 4 }}>
                
                <div style={{ fontWeight: 'bold',color: '#595959' }}>The Government House</div>
                <div style={{ color: '#595959' }}>ลงเวลาเข้า (08:30)</div>
                <div style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '12px', marginTop: 2 }}>08:10</div>
              </div>
              <div style={{ textAlign: 'center', flex: 1, paddingLeft: 4 }}>
                <div style={{ fontWeight: 'bold',color: '#595959' }}>The Government House</div>
                <div style={{ color: '#595959' }}>ลงเวลาออก (16:30)</div>
                <div style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '12px', marginTop: 2 }}>16:31</div>
              </div>
            </div>
          </div>
        );
        break;
      default:
        content = null;
    }

    if (!content) return null;

    return (
      <Popover content={popoverContent} trigger="hover" placement="top">
        <div style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {content}
        </div>
      </Popover>
    );
  };

  const columns = [
    {
      title: 'เจ้าหน้าที่',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 180,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '13px', display: 'block' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>{record.code}</Text>
        </div>
      ),
    },
    ...daysInAugust.map((item) => ({
      title: (
        <div style={{ textAlign: 'center', lineHeight: '1.2' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.day}</div>
          <div style={{ fontSize: '10px', color: '#8c8c8c' }}>{item.dow}</div>
        </div>
      ),
      dataIndex: ['statuses', item.day],
      key: `day_${item.day}`,
      align: 'center',
      width: 42,
      onCell: (record) => {
        const st = record.statuses[item.day];
        if (st === 'holiday') {
          return { style: { backgroundColor: '#e4e4e4', padding: 0 } };
        }
        return { style: { padding: 0 } };
      },
      render: (status) => {
        if (status === 'holiday') return null;
        return renderStatusCell(status);
      }
    }))
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .ant-table-cell {
          padding: 6px 4px !important;
        }
      `}</style>

      <Card 
        title={
          <Space>
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              ปฏิทินการเข้าทำงาน สิงหาคม 2026
            </Text>
          </Space>
        }
        extra={
          <Space>
            <Button size="small" style={{ backgroundColor: '#fff', color: '#333' }}>เดือนปัจจุบัน</Button>
            <Button size="small" icon={<LeftOutlined />} style={{ backgroundColor: '#fff', color: '#333' }} />
            <Button size="small" icon={<RightOutlined />} style={{ backgroundColor: '#fff', color: '#333' }} />
          </Space>
        }
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {/* ส่วน Filter ด้านบน */}
        <div style={{ padding: '16px', marginBottom: 20, background: '#f9fafb', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle" style={{ marginBottom: 12 }}>
                <Col span={6} style={{ textAlign: 'right' }}><Text>หน่วยงาน :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                    <Option value="sec">สำนักเลขาธิการ</Option>
                  </Select>
                </Col>
              </Row>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ตำแหน่ง :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                  </Select>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12}>
              <Row gutter={8} align="middle" style={{ marginBottom: 12 }}>
                <Col span={6} style={{ textAlign: 'right' }}><Text>ระดับตำแหน่ง :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                  </Select>
                </Col>
              </Row>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ค้นหา :</Text></Col>
                <Col span={18}>
                  <Input placeholder="ชื่อ, รหัส" />
                </Col>
              </Row>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#1890ff', padding: '0 32px' }}>
              ค้นหา
            </Button>
          </div>
        </div>

        {/* ส่วนคำอธิบายความหมายของสี (Legend) */}
        <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>ความหมายของสี :</Text>
          <Row gutter={[16, 8]}>
            <Col xs={12} sm={8} md={6}>
              <Space><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#8c8c8c', display: 'inline-block' }}></span> <Text style={{ fontSize: '12px' }}>= ยังไม่สมบูรณ์</Text></Space>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Space><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#52c41a', display: 'inline-block' }}></span> <Text style={{ fontSize: '12px' }}>= ลงเวลาปกติ</Text></Space>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Space><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fa8c16', display: 'inline-block' }}></span> <Text style={{ fontSize: '12px' }}>= เข้างานสาย/ออกงานก่อนเวลา</Text></Space>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Space><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#1890ff', display: 'inline-block' }}></span> <Text style={{ fontSize: '12px' }}>= ลา</Text></Space>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Space><span style={{ width: 10, height: 10, background: '#e4e4e4', display: 'inline-block' }}></span> <Text style={{ fontSize: '12px' }}>= วันหยุดนักขัตฤกษ์ / ประจำสัปดาห์</Text></Space>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Space><span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>✕</span> <Text style={{ fontSize: '12px' }}>= ขาดงาน</Text></Space>
            </Col>
          </Row>
        </div>

        {/* ตารางปฏิทิน Matrix */}
        <Table 
          dataSource={staffData} 
          columns={columns} 
          pagination={false} 
          bordered
          size="small"
          scroll={{ x: 1300 }}
        />
      </Card>
    </div>
  );
}