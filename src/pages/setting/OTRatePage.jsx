import React, { useState } from 'react';
import { 
  Card, Row, Col, Button, Select, Input, Table, Space, Typography, 
  Tooltip, Popconfirm, message, Modal, Form, Tag, InputNumber, Switch, Divider, Radio 
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function OTRatePage() {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      ot_rate_id: 1,
      ot_rate_name: 'อัตราค่าล่วงเวลาตามประกาศกรมบัญชีกลาง',
      ot_rate_desc: 'อัตรามาตรฐานสำหรับข้าราชการและเจ้าหน้าที่',
      ot_rate_type: 'fixed',
      normal_rate: 50,
      normal_max: 4,
      holiday_max: 7,
      delaystart: 30,
      holiday_intime: 60,
      holiday_overtime: 60,
      Minimum_ot: 15,
      roundup_cal: 1,
      rounddown_minute: 59,
      roundup_minute: 0,
      overday_cal: 'day',
      IsActive: true,
    },
    {
      key: '2',
      ot_rate_id: 2,
      ot_rate_name: 'อัตราค่าล่วงเวลาสำหรับเจ้าหน้าที่ xxx',
      ot_rate_desc: 'อัตราพิเศษสำหรับพนักงานเฉพาะกิจ',
      ot_rate_type: 'salary',
      normal_rate: 1.0,
      normal_max: 4,
      holiday_max: 4,
      delaystart: 10,
      holiday_intime: 1.0,
      holiday_overtime: 1.5,
      Minimum_ot: 30,
      roundup_cal: 0,
      rounddown_minute: 0,
      roundup_minute: 0,
      overday_cal: 'start_date',
      IsActive: false,
    },
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentKey, setCurrentKey] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form] = Form.useForm();

  const handleAddClick = () => {
    setModalMode('add');
    setCurrentKey(null);
    form.resetFields();
    form.setFieldsValue({
      ot_rate_type: 'fixed',
      normal_rate: 1.0,
      normal_max: 4,
      holiday_max: 4,
      delaystart: 0,
      holiday_intime: 1.0,
      holiday_overtime: 1.0,
      Minimum_ot: 0,
      roundup_cal: 0,
      rounddown_minute: 0,
      roundup_minute: 0,
      overday_cal: 'day',
      IsActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setModalMode('edit');
    setCurrentKey(record.key);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      if (modalMode === 'add') {
        const newRecord = {
          key: String(dataSource.length + 1),
          ot_rate_id: dataSource.length + 1,
          ...values,
        };
        setDataSource([...dataSource, newRecord]);
        message.success('เพิ่มอัตราค่าล่วงเวลาสำเร็จ');
      } else {
        setDataSource(dataSource.map(item => item.key === currentKey ? { ...item, ...values } : item));
        message.success('แก้ไขอัตราค่าล่วงเวลาสำเร็จ');
      }
      setIsModalOpen(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleDelete = (key) => {
    setDataSource(dataSource.filter(item => item.key !== key));
    message.success('ลบรายการสำเร็จ');
  };

  const filteredData = dataSource.filter(item => {
    const matchSearch = item.ot_rate_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.ot_rate_desc?.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || 
                        (statusFilter === 'active' && item.IsActive) || 
                        (statusFilter === 'inactive' && !item.IsActive);
    return matchSearch && matchStatus;
  });

  const columns = [
    { 
      title: 'ชื่ออัตราค่าล่วงเวลา', 
      dataIndex: 'ot_rate_name', 
      key: 'ot_rate_name', 
      render: (text, record) => (
        <a onClick={() => handleEditClick(record)} style={{ color: '#1890ff', fontWeight: '500' }}>
          {text}
        </a>
      ) 
    },
    { 
      title: 'รายละเอียด', 
      dataIndex: 'ot_rate_desc', 
      key: 'ot_rate_desc', 
    },
    { 
      title: 'อัตราวันปกติ', 
      dataIndex: 'normal_rate', 
      key: 'normal_rate', 
      align: 'center',
      width: 110,
    },
    { 
      title: 'สถานะ', 
      dataIndex: 'IsActive', 
      key: 'IsActive', 
      align: 'center',
      width: 110,
      render: (active) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
        </Tag>
      )
    },
    {
      title: 'จัดการ',
      key: 'action',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="แก้ไข">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              style={{ color: '#1890ff', padding: 0 }} 
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Popconfirm title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?" onConfirm={() => handleDelete(record.key)} okText="ใช่" cancelText="ยกเลิก">
            <Button type="link" icon={<DeleteOutlined />} style={{ color: '#ff4d4f', padding: 0 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', textAlign: 'left'}}>
      
      <style>{`
        .ant-select, .ant-input-affix-wrapper, .ant-input {
          width: 100% !important;
        }
        .filter-label {
          text-align: right !important;
          display: block !important;
          padding-right: 8px;
        }
        .ant-table-thead > tr > th {
          text-align: center !important;
        }
        .left-col-item .ant-form-item-label {
          white-space: normal !important;
          line-height: 1.2 !important;
          padding-right: 8px !important;
        }
      `}</style>

      {/* Card หลัก */}
      <Card 
        title={<Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>ตั้งค่าอัตราค่าล่วงเวลา </Text>}
        headStyle={{ backgroundColor: '#1f2937', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        extra={
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#1890ff' }} onClick={handleAddClick}>
              เพิ่ม
            </Button>
          </Space>
        }
      >
        <div style={{ padding: '20px', marginBottom: 16, background: '#f9fafb', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>สถานะ :</Text></Col>
                <Col span={18}>
                  <Select value={statusFilter} onChange={val => setStatusFilter(val)} style={{ width: '100%' }}>
                    <Option value="all">ทั้งหมด</Option>
                    <Option value="active">ใช้งาน</Option>
                    <Option value="inactive">ไม่ใช้งาน</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={8} align="middle">
                <Col span={6} style={{ textAlign: 'right' }}><Text>ค้นหา :</Text></Col>
                <Col span={18}>
                  <Input 
                    placeholder="ค้นหาชื่ออัตราค่าล่วงเวลา" 
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear 
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', padding: '0 36px', height: '38px' }}
            >
              ค้นหา
            </Button>
          </div>
        </div>

        <Table 
          dataSource={filteredData} 
          columns={columns} 
          pagination={{ pageSize: 5 }} 
          bordered
          size="middle"
        />
      </Card>

      {/* Popup Modal สำหรับ เพิ่ม / แก้ไข อัตราค่าล่วงเวลา */}
      <Modal
        title={<Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{modalMode === 'add' ? 'เพิ่มอัตราค่าล่วงเวลา' : 'แก้ไขอัตราค่าล่วงเวลา'}</Text>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={1050}
        footer={null}
        style={{ top: 20 }}
      >
        <Form form={form} layout="horizontal" style={{ padding: '8px 0' }}>
          <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '12px' }}>
            <Row gutter={16}>
              
              {/* ชื่ออัตราค่าล่วงเวลา */}
              <Col xs={24}>
                <Form.Item 
                  label={<span style={{ fontWeight: '500' }}>ชื่ออัตราค่าล่วงเวลา <span style={{ color: 'red' }}>*</span></span>} 
                  name="ot_rate_name"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                  rules={[{ required: true, message: 'กรุณากรอกชื่ออัตราค่าล่วงเวลา' }]}
                >
                  <Input placeholder="ระบุชื่ออัตราค่าล่วงเวลา" />
                </Form.Item>
              </Col>

              {/* รายละเอียดอัตราค่าล่วงเวลา */}
              <Col xs={24}>
                <Form.Item 
                  label={<span style={{ fontWeight: '500' }}>รายละเอียดอัตราค่าล่วงเวลา</span>} 
                  name="ot_rate_desc"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  <TextArea rows={2} placeholder="อธิบายรายละเอียดเพิ่มเติม" />
                </Form.Item>
              </Col>
              {/* สถานะการใช้งาน */}
              <Col xs={24}>
                <Form.Item 
                  label={<span style={{ fontWeight: '500' }}>สถานะการใช้งาน</span>} 
                  name="IsActive" 
                  valuePropName="checked"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  <Switch checkedChildren="ใช้งาน" unCheckedChildren="ไม่ใช้งาน" />
                </Form.Item>
              </Col>
              {/* การคำนวณค่าล่วงเวลา  */}
              <Col xs={24} >
                <Form.Item 
                  label={<span style={{ fontWeight: '500' }}>การคำนวณค่าล่วงเวลา</span>} 
                  name="ot_rate_type"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 19 }}
                >
                  <Radio.Group>
                    <Radio value="fixed">อัตราคงที่</Radio>
                    <Radio value="salary">เท่า</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              

              <Col span={24}><Divider style={{ margin: '8px 0 16px 0' }} /></Col>

              {/* Column 1 (Left): อัตราค่าล่วงเวลา - ปรับขยายส่วน Label และบีบช่อง Input ให้เหลือ 30-40% */}
              <Col xs={24} md={12}>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: 8, border: '1px solid #f0f0f0', height: '100%' }}>
                  <Text strong style={{ fontSize: '15px', color: '#1f2937', display: 'block', marginBottom: 16, borderBottom: '2px solid #1890ff', paddingBottom: 6 }}>
                    1. อัตราค่าล่วงเวลา
                  </Text>

                  <Form.Item className="left-col-item" labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label={<span style={{ fontWeight: '500' }}>อัตราค่าล่วงเวลาในวันทำงานปกติ</span>} name="normal_rate">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>

                  <Form.Item className="left-col-item" labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label={<span style={{ fontWeight: '500' }}>อัตราค่าล่วงเวลาช่วงเวลาทำงานในวันหยุด</span>} name="holiday_intime">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>

                  <Form.Item className="left-col-item" labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label={<span style={{ fontWeight: '500' }}>อัตราค่าล่วงเวลานอกช่วงเวลาทำงานในวันหยุด</span>} name="holiday_overtime">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>

                  <Form.Item className="left-col-item" labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label={<span style={{ fontWeight: '500' }}>จำนวนชั่วโมงสูงสุดต่อวัน (ข้าราชการไม่เกิน 4 ชม.)</span>} name="normal_max">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item className="left-col-item" labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label={<span style={{ fontWeight: '500' }}>ชั่วโมงสูงสุดในวันหยุด (ไม่เกิน 7 ชม.)</span>} name="holiday_max">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item className="left-col-item" labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label={<span style={{ fontWeight: '500' }}>จำนวนนาทีก่อนเริ่มคิดค่าล่วงเวลา</span>} name="delaystart">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item className="left-col-item" labelCol={{ span: 16 }} wrapperCol={{ span: 8 }} label={<span style={{ fontWeight: '500' }}>จำนวน ชม. ขั้นต่ำในการขอ OT</span>} name="Minimum_ot" style={{ marginBottom: 0 }}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </div>
              </Col>

              {/* Column 2 (Right): รูปแบบการคำนวน */}
              <Col xs={24} md={12}>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: 8, border: '1px solid #f0f0f0', height: '100%' }}>
                  <Text strong style={{ fontSize: '15px', color: '#1f2937', display: 'block', marginBottom: 16, borderBottom: '2px solid #1890ff', paddingBottom: 6 }}>
                    2. รูปแบบการคำนวน
                  </Text>

                  <Form.Item labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label={<span style={{ fontWeight: '500' }}>วิธีคำนวณอัตราล่วงเวลาข้ามวัน</span>} name="overday_cal">
                    <Radio.Group>
                      <Radio value="day">คำนวณตามวัน</Radio>
                      <Radio value="start_date">คำนวณตามวันที่เริ่มต้น</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label={<span style={{ fontWeight: '500' }}>ปัดเศษลงทุกๆ(นาที)</span>} name="rounddown_minute">
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label={<span style={{ fontWeight: '500' }}>การปัดเศษขึ้นทุกๆ(นาที)</span>} name="roundup_minute" style={{ marginBottom: 0 }}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </div>
              </Col>

            </Row>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 14, borderTop: '1px solid #f0f0f0' }}>
            <Space size="middle">
              <Button 
                type="primary" 
                onClick={handleModalSubmit}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', padding: '0 32px', height: 38 }}
              >
                บันทึก
              </Button>
              <Button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '0 32px', height: 38 }}
              >
                ยกเลิก
              </Button>
            </Space>
          </div>

        </Form>
      </Modal>

    </div>
  );
}