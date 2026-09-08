import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, Input, Table, Typography, Space, DatePicker, Empty } from 'antd';
import { 
  ArrowLeftOutlined, 
  SearchOutlined, 
  FileExcelOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Option } = Select;

export default function RptLeaveDetailPage() {
  const navigate = useNavigate();
  const [searched, setSearched] = useState(false);

  // กดปุ่มค้นหาเพื่อแสดงตาราง
  const handleSearch = () => {
    setSearched(true);
  };

  // สร้างคอลัมน์วันที่ 1 ถึง 31
  const dayColumns = [];
  for (let i = 1; i <= 31; i++) {
    dayColumns.push({
      title: `${i}`,
      dataIndex: `day_${i}`,
      key: `day_${i}`,
      align: 'center',
      width: 34,
      render: (val) => {
        let bg = 'transparent';
        let color = '#000';
        if (val === 'ป') { bg = '#ffe58f'; color = '#d48806'; } // ป่วย/กิจ
        else if (val === 'พ') { bg = '#d9f7be'; color = '#389e0d'; } // พักผ่อน
        else if (val === 'ล') { bg = '#bae7ff'; color = '#096dd9'; } // ลาอื่นๆ
        return (
          <span style={{ display: 'block', background: bg, color: color, fontWeight: 'bold', fontSize: '11px', borderRadius: 2 }}>
            {val || ''}
          </span>
        );
      },
      onCell: () => ({
        style: {
          // ทำไฮไลต์วันเสาร์-อาทิตย์จำลอง
          backgroundColor: (i === 6 || i === 7 || i === 13 || i === 14 || i === 20 || i === 21 || i === 27 || i === 28) ? '#e6f4ea' : 'inherit',
          fontSize: '11px',
          padding: '2px 1px',
          textAlign: 'center'
        }
      })
    });
  }

  // โครงสร้าง Columns ของตาราง
  const columns = [
    {
      title: 'ชื่อ-สกุล',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 150,
      render: (text, record) => {
        if (record.isDeptHeader) {
          return {
            props: {
              colSpan: 38,
              style: { backgroundColor: '#f0f2f5', fontWeight: 'bold' }
            },
            children: <Text strong style={{ color: '#1f2937', fontSize: '13px' }}>{text}</Text>
          };
        }
        return (
          <div>
            <Text strong style={{ fontSize: '12px', display: 'block', color: '#1f2937' }}>{text}</Text>
            {record.code && <Text type="secondary" style={{ fontSize: '10px' }}>({record.code})</Text>}
          </div>
        );
      }
    },
    {
      title: 'วันที่',
      children: dayColumns
    },
    {
      title: 'ในเดือนนี้',
      children: [
        { title: 'สาย', dataIndex: 'm_late', key: 'm_late', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'พักผ่อน', dataIndex: 'm_vacation', key: 'm_vacation', align: 'center', width: 50, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'คลอด', dataIndex: 'm_maternity', key: 'm_maternity', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'ป่วย', dataIndex: 'm_sick', key: 'm_sick', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'ครั้ง', dataIndex: 'm_times', key: 'm_times', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
      ]
    },
    {
      title: 'ลามาแล้ว',
      children: [
        { title: 'สาย', dataIndex: 'p_late', key: 'p_late', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'พักผ่อน', dataIndex: 'p_vacation', key: 'p_vacation', align: 'center', width: 50, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'คลอด', dataIndex: 'p_maternity', key: 'p_maternity', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'ป่วย', dataIndex: 'p_sick', key: 'p_sick', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'ครั้ง', dataIndex: 'p_times', key: 'p_times', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
      ]
    },
    {
      title: 'รวม',
      children: [
        { title: 'สาย', dataIndex: 't_late', key: 't_late', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'พักผ่อน', dataIndex: 't_vacation', key: 't_vacation', align: 'center', width: 50, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'คลอด', dataIndex: 't_maternity', key: 't_maternity', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'ป่วย', dataIndex: 't_sick', key: 't_sick', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
        { title: 'ครั้ง', dataIndex: 't_times', key: 't_times', align: 'center', width: 42, render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val },
      ]
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width: 75,
      render: (val, rec) => rec.isDeptHeader ? { props: { colSpan: 0 } } : val
    }
  ];

  // ข้อมูลจำลองตามโครงสร้างหน่วยงานและรายชื่อพนักงาน
  const dataSource = [
    { key: 'd1', isDeptHeader: true, name: 'ฝ่ายบริหารทั่วไป' },
    {
      key: '1',
      name: 'นาย xxx xxx',
      code: '40501',
      day_5: 'ป',
      m_late: '', m_vacation: '4', m_maternity: '', m_sick: '2', m_times: '2',
      p_late: '2', p_vacation: '4', p_maternity: '', p_sick: '2', p_times: '2',
      t_late: '2', t_vacation: '4', t_maternity: '', t_sick: '2', t_times: '2',
      remark: ''
    },
    {
      key: '2',
      name: 'นางสาว xxx xxx',
      code: '40502',
      day_12: 'พ',
      m_late: '', m_vacation: '4', m_maternity: '', m_sick: '', m_times: '2',
      p_late: '', p_vacation: '10', p_maternity: '', p_sick: '7', p_times: '2',
      t_late: '', t_vacation: '4', t_maternity: '', t_sick: '', t_times: '2',
      remark: ''
    },
    { key: 'd2', isDeptHeader: true, name: 'กลุ่มบริหารระบบเครือข่ายฯ' },
    {
      key: '3',
      name: 'นาย xxx xxx',
      code: '40503',
      day_13: 'ป',
      m_late: '', m_vacation: '5', m_maternity: '', m_sick: '4', m_times: '5',
      p_late: '5', p_vacation: '10', p_maternity: '', p_sick: '4', p_times: '5',
      t_late: '', t_vacation: '6', t_maternity: '', t_sick: '1', t_times: '1',
      remark: ''
    },
    { key: 'd3', isDeptHeader: true, name: 'กลุ่มพัฒนาระบบสารสนเทศฯ' },
    {
      key: '4',
      name: 'นาย xxx xxx',
      code: '40504',
      day_6: 'ป',
      day_10: 'ป',
      m_late: '1', m_vacation: '5', m_maternity: '', m_sick: '9', m_times: '8',
      p_late: '5', p_vacation: '9.5', p_maternity: '', p_sick: '1', p_times: '1',
      t_late: '', t_vacation: '5', t_maternity: '', t_sick: '10', t_times: '9',
      remark: ''
    }
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
              รายงานสรุปการลา
            </Text>
          </Space>
        }
        extra={
          <Button 
            icon={<FileExcelOutlined />} 
            style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f', color: '#52c41a', fontWeight: '500' }}
          >
            รายงานสรุปการลา
          </Button>
          
        }
        
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {/* ส่วน Filter ด้านบนเหมือนหน้า RptAttatancePage */}
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
                    <Option value="sec">สำนักเลขาธิการ</Option>
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
                <Col span={6} style={{ textAlign: 'right' }}><Text>ค้นหา :</Text></Col>
                <Col span={18}>
                  <Input placeholder="ค้นหาชื่อเจ้าหน้าที่..." />
                </Col>
              </Row>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearch}
              style={{ backgroundColor: '#1f2937', borderColor: '#1f2937', padding: '0 36px', height: '38px' }}
            >
              ค้นหา
            </Button>
          </div>
        </div>

        {/* ตารางแสดงผลเฉพาะเมื่อกดปุ่มค้นหาแล้ว */}
        {searched ? (
          <div>
           
            <Table 
              dataSource={dataSource} 
              columns={columns} 
              pagination={false} 
              bordered
              size="small"
              scroll={{ x: 1400 }}
              rowClassName={(record, index) => record.isDeptHeader ? 'table-dept-header' : (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fafafa', borderRadius: 8, border: '1px dashed #d9d9d9' }}>
            <Empty description={<Text type="secondary">กรุณากดปุ่ม "ค้นหา" ด้านบนเพื่อแสดงรายงานสรุปการลา</Text>} />
          </div>
        )}
      </Card>
    </div>
  );
}