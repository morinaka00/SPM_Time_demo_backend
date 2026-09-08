import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, Input, Table, Typography, Space, DatePicker } from 'antd';
import { 
  ArrowLeftOutlined, 
  SearchOutlined, 
  FileExcelOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

export default function RptAttatancePage() {
  const navigate = useNavigate();

  // ข้อมูลจำลองครอบคลุมครบทุก Case สถานะการลงเวลา
  const reportData = [
    {
      key: '1',
      name: 'นาย xxx xxx',
      code: '40503',
      dept: 'สำนักเลขาธิการ',
      position: 'xxx',
      date: '01/08/69',
      inPlan: '08:30',
      inActual: '',
      inReason: '',
      inLocation: '',
      inDistance: '',
      outPlan: '16:30',
      outActual: '',
      outReason: '',
      outLocation: '',
      outDistance: '',
      workPlan: '08:00',
      workActual: '00:00',
      workDiff: '',
      overview: 'วันหยุดนักขัตฤกษ์ / ประจำสัปดาห์'
    },
    {
      key: '2',
      name: 'นาย xxx xxx',
      code: '40503',
      dept: 'สำนักเลขาธิการ',
      position: 'xxx',
      date: '02/08/69',
      inPlan: '08:30',
      inActual: '',
      inReason: '',
      inLocation: '',
      inDistance: '',
      outPlan: '16:30',
      outActual: '',
      outReason: '',
      outLocation: '',
      outDistance: '',
      workPlan: '08:00',
      workActual: '00:00',
      workDiff: '',
      overview: 'ลา'
    },
    {
      key: '3',
      name: 'นาย xxx xxx',
      code: '40503',
      dept: 'สำนักเลขาธิการ',
      position: 'xxx',
      date: '03/08/69',
      inPlan: '08:30',
      inActual: '08:10',
      inReason: '',
      inLocation: 'The Government House',
      inDistance: '12 ม.',
      outPlan: '16:30',
      outActual: '17:31',
      outReason: '',
      outLocation: 'The Government House',
      outDistance: '10 ม.',
      workPlan: '08:00',
      workActual: '08:21',
      workDiff: '00:21',
      overview: 'ลงเวลาปกติ'
    },
    {
      key: '4',
      name: 'นาย xxx xxx',
      code: '40503',
      dept: 'สำนักเลขาธิการ',
      position: 'xxx',
      date: '04/08/69',
      inPlan: '08:30',
      inActual: '08:55',
      inReason: 'ประชุมกระทรวง xxxx',
      inLocation: 'The Government House',
      inDistance: '10 กม.',
      outPlan: '16:30',
      outActual: '16:45',
      outReason: 'ประชุมกระทรวง xxxx',
      outLocation: 'The Government House',
      outDistance: '10 กม.',
      workPlan: '08:00',
      workActual: '07:20',
      workDiff: '-00:40',
      overview: 'ลงเวลาปกติ'
    },
    {
      key: '5',
      name: 'นาย xxx xxx',
      code: '40503',
      dept: 'สำนักเลขาธิการ',
      position: 'xxx',
      date: '05/08/69',
      inPlan: '08:30',
      inActual: '08:20',
      inReason: '',
      inLocation: 'The Government House',
      inDistance: '15 ม.',
      outPlan: '16:30',
      outActual: '',
      outReason: '',
      outLocation: '',
      outDistance: '',
      workPlan: '08:00',
      workActual: '00:00',
      workDiff: '',
      overview: 'ยังไม่สมบูรณ์'
    },
    {
      key: '6',
      name: 'นาย xxx xxx',
      code: '40503',
      dept: 'สำนักเลขาธิการ',
      position: 'xxx',
      date: '06/08/69',
      inPlan: '08:30',
      inActual: '',
      inReason: '',
      inLocation: '',
      inDistance: '',
      outPlan: '16:30',
      outActual: '',
      outReason: '',
      outLocation: '',
      outDistance: '',
      workPlan: '08:00',
      workActual: '00:00',
      workDiff: '',
      overview: 'ขาดงาน'
    }
  ];

  // โครงสร้าง Columns ของตาราง
  const columns = [
    {
      title: 'ชื่อ',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 140,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '13px', display: 'block', color: '#b8860b' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>({record.code})</Text>
        </div>
      ),
    },
    {
      title: 'หน่วยงาน',
      dataIndex: 'dept',
      key: 'dept',
      width: 130,
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'position',
      key: 'position',
      width: 90,
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      width: 90,
    },
    {
      title: 'เข้างาน',
      children: [
        { title: 'กำหนด', dataIndex: 'inPlan', key: 'inPlan', align: 'center', width: 75 },
        { 
          title: 'เข้างาน', 
          dataIndex: 'inActual', 
          key: 'inActual', 
          align: 'center', 
          width: 75,
          render: (val) => <span style={{ color: '#1890ff' }}>{val}</span>
        },
        { title: 'เหตุผล', dataIndex: 'inReason', key: 'inReason', align: 'center', width: 70 },
        { 
          title: 'สถานที่', 
          dataIndex: 'inLocation', 
          key: 'inLocation', 
          width: 150,
          render: (val) => <span style={{ fontSize: '11px', color: '#1890ff' }}>{val}</span>
        },
        { title: 'ระยะห่าง', dataIndex: 'inDistance', key: 'inDistance', align: 'center', width: 80 },
      ],
    },
    {
      title: 'ออกงาน',
      children: [
        { title: 'กำหนด', dataIndex: 'outPlan', key: 'outPlan', align: 'center', width: 75 },
        { 
          title: 'ออกงาน', 
          dataIndex: 'outActual', 
          key: 'outActual', 
          align: 'center', 
          width: 75,
          render: (val) => <span style={{ color: '#1890ff' }}>{val}</span>
        },
        { title: 'เหตุผล', dataIndex: 'outReason', key: 'outReason', align: 'center', width: 70 },
        { 
          title: 'สถานที่', 
          dataIndex: 'outLocation', 
          key: 'outLocation', 
          width: 150,
          render: (val) => <span style={{ fontSize: '11px', color: '#1890ff' }}>{val}</span>
        },
        { title: 'ระยะห่าง', dataIndex: 'outDistance', key: 'outDistance', align: 'center', width: 80 },
      ],
    },
    {
      title: 'ระยะเวลาการทำงาน',
      children: [
        { title: 'กำหนด', dataIndex: 'workPlan', key: 'workPlan', align: 'center', width: 75 },
        { title: 'เวลาจริง', dataIndex: 'workActual', key: 'workActual', align: 'center', width: 75 },
        { title: 'ส่วนต่าง', dataIndex: 'workDiff', key: 'workDiff', align: 'center', width: 75 },
      ],
    },
    {
      title: 'ภาพรวม',
      dataIndex: 'overview',
      key: 'overview',
      align: 'center',
      width: 150,
      render: (val) => {
        let color = '#52c41a';
        if (val === 'ยังไม่สมบูรณ์') color = '#8c8c8c';
        else if (val === 'ลงเวลาปกติ') color = '#52c41a';
        else if (val === 'เข้างานสาย/ออกงานก่อนเวลา') color = '#fa8c16';
        else if (val === 'ลา') color = '#1890ff';
        else if (val === 'วันหยุดนักขัตฤกษ์ / ประจำสัปดาห์') color = '#ff7875';
        else if (val === 'ขาดงาน') color = '#ff4d4f';

        return (
          <span style={{ color, fontSize: '11px', fontWeight: '500' }}>
            {val}
          </span>
        );
      },
    },
    {
      title: 'Re-Cal',
      key: 'recal',
      align: 'center',
      width: 60,
      render: () => (
        <Button type="text" icon={<ReloadOutlined style={{ color: '#1890ff' }} />} />
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .ant-table-cell {
          padding: 8px 6px !important;
        }
      `}</style>

      <Card 
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} type="text" style={{ color: '#fff' }} onClick={() => navigate(-1)} />
            <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              รายละเอียดการเข้าทำงาน
            </Text>
          </Space>
        }
        extra={
          <Button 
            icon={<FileExcelOutlined />} 
            style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f', color: '#52c41a', fontWeight: '500' }}
          >
            Export Excel
          </Button>
        }
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {/* ส่วน Filter ด้านบน */}
        <div style={{ padding: '20px', marginBottom: 20, background: '#f9fafb', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Row gutter={[16, 12]}>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ตั้งแต่ :</Text></Col>
                <Col span={18}>
                  <DatePicker defaultValue={dayjs('2026-08-01')} format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ถึงวันที่ :</Text></Col>
                <Col span={18}>
                  <DatePicker defaultValue={dayjs('2026-08-31')} format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>หน่วยงาน :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ระดับตำแหน่ง :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                  </Select>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12}>
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
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>เจ้าหน้าที่ :</Text></Col>
                <Col span={18}>
                  <Select defaultValue="all" style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด...</Option>
                  </Select>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>สถานะการลงเวลา :</Text></Col>
                <Col span={18}>
                  <Select 
                    mode="multiple" 
                    defaultValue={[
                      'incomplete', 
                      'normal', 
                      'late', 
                      'leave', 
                      'holiday', 
                      'absent'
                    ]} 
                    style={{ width: '100%' }}
                    placeholder="เลือกสถานะการลงเวลา"
                    maxTagCount="responsive"
                  >
                    <Option value="incomplete">ยังไม่สมบูรณ์</Option>
                    <Option value="normal">ลงเวลาปกติ</Option>
                    <Option value="late">เข้างานสาย/ออกงานก่อนเวลา</Option>
                    <Option value="leave">ลา</Option>
                    <Option value="holiday">วันหยุดนักขัตฤกษ์ / ประจำสัปดาห์</Option>
                    <Option value="absent">ขาดงาน</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ค้นหา :</Text></Col>
                <Col span={18}>
                  <Input defaultValue="" />
                </Col>
              </Row>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#1f2937', borderColor: '#1f2937', padding: '0 36px', height: '38px' }}>
              ค้นหา
            </Button>
          </div>
        </div>

        {/* ตารางแสดงรายละเอียดการทำงาน */}
        <Table 
          dataSource={reportData} 
          columns={columns} 
          pagination={false} 
          bordered
          size="small"
          scroll={{ x: 1500 }}
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        />
      </Card>
    </div>
  );
}