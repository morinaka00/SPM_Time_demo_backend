import { useState } from 'react';
import { Card, Button, Select, Input, Table, Switch, Typography, Space, Pagination, DatePicker } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import FilterPanel, { FilterField } from '../../components/FilterPanel';

const { Text } = Typography;
const { Option } = Select;

export default function TermsConditionPage() {
  const [viewMode, setViewMode] = useState('list'); // 'list' หรือ 'detail'
  const [, setCurrentTerm] = useState(null);

  // ข้อมูลจำลอง (Mock Data) หน้าหลัก
  const [dataSource, setDataSource] = useState([
    { key: '1', version: '1', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน', publishDate: '1 พ.ค. 2569', createDate: '-', acceptCount: 2, status: true },
    { key: '2', version: '2', title: 'เพิ่มเนื้อหาทดสอบ', publishDate: '21 พ.ค. 2569', createDate: '-', acceptCount: 2, status: false },
    { key: '3', version: '3', title: 'แก้ไขรายละเอียดข้อกำหนดและเงื่อนไข', publishDate: '15 มิ.ย. 2569', createDate: '-', acceptCount: 17, status: false },
    { key: '4', version: '4', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน 2', publishDate: '8 ก.ค. 2569', createDate: '-', acceptCount: 3, status: false },
    { key: '5', version: '5', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน เวอร์ชัน 2', publishDate: '10 ก.ค. 2569', createDate: '-', acceptCount: 3, status: false },
    { key: '6', version: '6', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน เวอร์ชัน 3', publishDate: '13 ก.ค. 2569', createDate: '-', acceptCount: 10, status: true },
    { key: '7', version: '7', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน เวอร์ชัน 4', publishDate: '20 ก.ค. 2569', createDate: '-', acceptCount: 9, status: true },
    { key: '8', version: '8', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน เวอร์ชัน 4 20 ก.ค. 2569', publishDate: '21 ก.ค. 2569', createDate: '-', acceptCount: 57, status: true },
    { key: '9', version: '9', title: 'ข้อกำหนดและเงื่อนไขการใช้งาน1', publishDate: '7 ก.ย. 2569', createDate: '-', acceptCount: 21, status: true },
  ]);

  // ข้อมูลจำลองรายชื่อผู้ยอมรับเงื่อนไข (Detail Data)
  const detailDataSource = [
    { key: '1', no: 1, name: 'DOE-59514 ทดสอบระบบ', email: 'kiattiphum.j2@gmail.com', ip: '172.26.0.3', consentDate: '8 ก.ค. 2569 16:03', publishDate: '1 พ.ค. 2569' },
    { key: '2', no: 2, name: 'DLPW-13755 ทดสอบระบบ', email: 'adminssomolhrmsdev@gmail.com', ip: '172.26.0.3', consentDate: '8 ก.ค. 2569 16:04', publishDate: '1 พ.ค. 2569' },
  ];

  // ฟังก์ชันสลับสถานะเปิด/ปิดใช้งาน (Switch)
  const handleStatusChange = (key, checked) => {
    setDataSource(prev => 
      prev.map(item => item.key === key ? { ...item, status: checked } : item)
    );
  };

  // เมื่อคลิกที่จำนวนผู้ยอมรับเงื่อนไข
  const handleRowClick = (record) => {
    setCurrentTerm(record);
    setViewMode('detail');
  };

  // ปุ่มย้อนกลับ
  const handleBackToList = () => {
    setViewMode('list');
    setCurrentTerm(null);
  };

  // โครงสร้าง Columns หน้าหลัก
  const columns = [
    
  
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      align: 'center',
      width: 90,
    },
    {
      title: 'หัวข้อ',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <a style={{ color: 'var(--navy-3)' }}>{text}</a>
    },
    {
      title: 'วันที่เริ่มเผยแพร่',
      dataIndex: 'publishDate',
      key: 'publishDate',
      align: 'center',
      width: 150,
    },
    {
      title: 'วันที่สร้าง',
      dataIndex: 'createDate',
      key: 'createDate',
      align: 'center',
      width: 120,
    },
    {
      title: 'รายชื่อผู้ยอมรับเงื่อนไข',
      dataIndex: 'acceptCount',
      key: 'acceptCount',
      align: 'center',
      width: 160,
      render: (count, record) => (
        <a 
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(record);
          }}
          style={{ color: 'var(--navy-3)', fontWeight: '500', cursor: 'pointer' }}
        >
          ({count})
        </a>
      ),
    },
    {
      title: 'ใช้งาน',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
      render: (status, record) => (
        <Switch 
          checked={status} 
          onChange={(checked) => handleStatusChange(record.key, checked)}
        />
      ),
    },
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      width: 100,
      render: () => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} style={{ color: 'var(--navy-3)' }} title="แก้ไข" />
          <Button type="text" size="small" icon={<DeleteOutlined />} style={{ color: 'var(--danger)' }} title="ลบ" />
        </Space>
      ),
    },
  ];

  // โครงสร้าง Columns หน้ารายละเอียดผู้ยอมรับเงื่อนไข
  const detailColumns = [
    {
      title: 'ลำดับ',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      width: 70,
    },
    {
      title: 'ชื่อ-สกุล',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a style={{ color: 'var(--navy-3)' }}>{text}</a>,
    },
    {
      title: 'อีเมล',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <a style={{ color: 'var(--navy-3)' }}>{text}</a>,
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
    },
    {
      title: 'วันที่ยินยอม',
      dataIndex: 'consentDate',
      key: 'consentDate',
      align: 'center',
      width: 160,
    },
    {
      title: 'วันที่เริ่มเผยแพร่เอกสาร',
      dataIndex: 'publishDate',
      key: 'publishDate',
      align: 'center',
      width: 160,
    },
  ];

  // หากอยู่ในโหมดแสดงรายชื่อผู้ยอมรับเงื่อนไข (Detail View)
  if (viewMode === 'detail') {
    return (
      <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
        <style>{`
          .ant-table-cell {
            padding: 10px 12px !important;
          }
        `}</style>

        {/* ส่วน Filter ค้นหาด้านบน (เพิ่มช่วงวันที่) — อยู่ในการ์ดเหมือนหน้าอื่น */}
        <Card style={{ borderRadius: 8, marginBottom: 16 }} styles={{ body: { paddingBottom: 4 } }}>
          <FilterPanel>
            <FilterField label="ตั้งแต่วันที่" span={8}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="เลือกวันที่เริ่มต้น" />
            </FilterField>
            <FilterField label="ถึงวันที่" span={8}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="เลือกวันที่สิ้นสุด" />
            </FilterField>
            <FilterField label="ค้นหา" span={8}>
              <Input placeholder="ชื่อ อีเมล หรือ IP Address" allowClear />
            </FilterField>
          </FilterPanel>
        </Card>

        {/* ส่วนรายการข้อมูล */}
        <Card 
          title={<Text strong style={{ fontSize: '15px', color: 'var(--navy-1)' }}>รายการข้อมูล</Text>}
          extra={
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackToList}
              style={{ borderRadius: 6, fontWeight: '500' }}
            >
              ย้อนกลับ
            </Button>
          }
          variant="borderless"
          style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.06)' }}
          styles={{ header: { borderBottom: '1px solid var(--border-soft)', padding: '0 20px' }, body: { padding: '16px 20px' } }}
        >
          {/* Pagination ด้านบน */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 12, gap: 12 }}>
            <Text type="secondary" style={{ fontSize: '13px' }}>แสดง 1 ถึง 2 จากทั้งหมด 2 รายการ</Text>
            <Pagination simple defaultCurrent={1} total={2} pageSize={25} />
            <Select defaultValue={25} size="small" style={{ width: 85 }}>
              <Option value={25}>25 / หน้า</Option>
              <Option value={50}>50 / หน้า</Option>
            </Select>
          </div>

          <Table 
            dataSource={detailDataSource} 
            columns={detailColumns} 
            pagination={false} 
            bordered={false}
            size="middle"
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
          />

          {/* Pagination ด้านล่าง */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16, gap: 12 }}>
            <Text type="secondary" style={{ fontSize: '13px' }}>แสดง 1 ถึง 2 จากทั้งหมด 2 รายการ</Text>
            <Pagination simple defaultCurrent={1} total={2} pageSize={25} />
            <Select defaultValue={25} size="small" style={{ width: 85 }}>
              <Option value={25}>25 / หน้า</Option>
              <Option value={50}>50 / หน้า</Option>
            </Select>
          </div>
        </Card>
      </div>
    );
  }

  // โหมดแสดงรายการหลัก (List View)
  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
      <style>{`
        .ant-table-cell {
          padding: 10px 12px !important;
        }
      `}</style>

      <Card 
        title={
          <Text style={{ color: 'var(--white)', fontSize: '16px', fontWeight: 'bold' }}>
            ข้อกำหนดและเงื่อนไขการใช้งาน
          </Text>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: 'var(--navy-3)', borderColor: 'var(--navy-3)', fontWeight: '500' }}>
            เพิ่ม
          </Button>
        }
        styles={{ header: { backgroundColor: 'var(--navy-1)', borderTopLeftRadius: 8, borderTopRightRadius: 8 } }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(12,27,58,0.08)' }}
      >
        <FilterPanel>
          <FilterField label="หัวข้อ" span={8}>
            <Input placeholder="หัวข้อ หรือ version" allowClear />
          </FilterField>
          <FilterField label="สถานะการใช้งาน" span={8}>
            <Select defaultValue="all" style={{ width: '100%' }}>
              <Option value="all">ทั้งหมด</Option>
              <Option value="active">เปิดใช้งาน</Option>
              <Option value="inactive">ปิดใช้งาน</Option>
            </Select>
          </FilterField>
        </FilterPanel>

        <Table 
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ pageSize: 10, placement: ['bottomEnd'] }} 
          bordered
          size="middle"
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        />
      </Card>
    </div>
  );
}