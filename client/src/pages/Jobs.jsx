import React, { useState, useEffect } from 'react';
import { 
  Button, Modal, Form, Input, Select, Space, Flex,
  Popconfirm, message, Alert, Spin, Typography, InputNumber, Row, Col, Tag, Card 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SendOutlined,
  EnvironmentOutlined,
  BlockOutlined,
  WarningOutlined
} from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';

const { Title, Text } = Typography;

const Jobs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Job Form (Create/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [jobForm] = Form.useForm();

  // Application Form
  const [applyModal, setApplyModal] = useState({ visible: false, job: null });
  const [applyForm] = Form.useForm();

  const titleOptions = [
    'Frontend Developer', 'Backend Developer', 'Fullstack Developer', 
    'UI/UX Designer', 'AI/ML Engineer', 'Data Scientist', 
    'Cybersecurity Analyst', 'DevOps Engineer', 'Mobile App Developer'
  ];
  
  const deptOptions = ['CSE', 'ECE', 'MECH', 'CIVIL', 'DEGREE', 'HR', 'Sales', 'Marketing'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/jobs');
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/jobs/${editingId}`, values);
        message.success('Job updated successfully');
      } else {
        await axiosInstance.post('/jobs', values);
        message.success('Job created successfully');
      }
      setIsModalOpen(false);
      jobForm.resetFields();
      setEditingId(null);
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Action failed');
    }
  };

  // Close with dirty check for Job Form
  const handleJobCancel = () => {
    if (jobForm.isFieldsTouched()) {
      Modal.confirm({
        title: 'Discard changes?',
        icon: <WarningOutlined style={{ color: 'red' }} />,
        content: 'You have unsaved modifications. Are you sure you want to close?',
        onOk: () => {
          setIsModalOpen(false);
          jobForm.resetFields();
        }
      });
    } else {
      setIsModalOpen(false);
    }
  };

  // Close with dirty check for Apply Form
  const handleApplyCancel = () => {
    if (applyForm.isFieldsTouched()) {
      Modal.confirm({
        title: 'Discard application?',
        icon: <WarningOutlined style={{ color: 'red' }} />,
        content: 'You have entered information in the application form. Close anyway?',
        onOk: () => {
          setApplyModal({ visible: false, job: null });
          applyForm.resetFields();
        }
      });
    } else {
      setApplyModal({ visible: false, job: null });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      message.success('Job deleted');
      fetchData();
    } catch (err) {
      message.error('Failed to delete');
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    jobForm.setFieldsValue(job);
    setIsModalOpen(true);
  };

  const handleApplySubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        role: applyModal.job.title,
        status: 'Applied'
      };
      await axiosInstance.post('/candidates', payload);
      message.success(`Application for ${applyModal.job.title} submitted successfully!`);
      setApplyModal({ visible: false, job: null });
      applyForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Title level={2} className="mb-0">Job Board</Title>
          <Text type="secondary">Manage your active job listings and applications</Text>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={() => { setEditingId(null); jobForm.resetFields(); setIsModalOpen(true); }}
        >
          Create New Job
        </Button>
      </div>

      {error && <Alert title="Error" description={error} type="error" showIcon className="mb-4" />}

      {loading && !data.length ? (
        <div className="text-center py-5"><Spin description="Loading job board..." size="large" /></div>
      ) : (
        <div className="row g-4">
          {data.length > 0 ? data.map((job, index) => {
            const bgColors = ['#f5f3ff', '#f0f9ff', '#f0fdf4', '#fffbeb', '#fff1f2', '#faf5ff'];
            const cardBg = bgColors[index % bgColors.length];
            
            return (
              <div key={job._id} className="col-12 col-md-6 col-xl-4">
                <Card 
                  hoverable 
                  className="shadow-sm border-0"
                  style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    background: cardBg
                  }}
                  actions={[
                    <Space onClick={() => handleEdit(job)}><EditOutlined key="edit" /> Edit</Space>,
                    <Popconfirm title="Delete this job?" onConfirm={() => handleDelete(job._id)}>
                      <Space style={{ color: '#ff4d4f' }}><DeleteOutlined key="delete" /> Delete</Space>
                    </Popconfirm>,
                    <Space onClick={() => setApplyModal({ visible: true, job })}><SendOutlined key="apply" /> Apply</Space>
                  ]}
                >
                <div className="mb-3 d-flex justify-content-between align-items-start">
                  <Tag color={job.status === 'Open' ? 'green' : job.status === 'Closed' ? 'red' : 'orange'}>
                    {job.status}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </Text>
                </div>
                
                <Title level={4} style={{ marginBottom: '8px' }}>{job.title}</Title>
                
                <Flex vertical gap="small" style={{ width: '100%' }}>
                  <Text type="secondary">
                    <BlockOutlined style={{ marginRight: '8px' }} />
                    {job.department}
                  </Text>
                  <Text type="secondary">
                    <EnvironmentOutlined style={{ marginRight: '8px' }} />
                    {job.location}
                  </Text>
                  <div className="mt-2 py-2 px-3 bg-light rounded-pill d-inline-block">
                    <Text strong>{job.openings} Openings</Text>
                  </div>
                </Flex>
              </Card>
            </div>
          );
          }) : (
            <div className="col-12 text-center py-5">
              <Text type="secondary">No jobs found. Click "Create New Job" to get started.</Text>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingId ? "Edit Job Listing" : "Create New Job Listing"}
        open={isModalOpen}
        onCancel={handleJobCancel}
        onOk={() => jobForm.submit()}
        confirmLoading={loading}
        centered
        okText={editingId ? "Update" : "Save"}
      >
        <Form form={jobForm} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item name="title" label="Job Title" rules={[{ required: true, message: 'Please select job title' }]}>
            <Select placeholder="Select Role">
              {titleOptions.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select department' }]}>
                <Select placeholder="Select Dept">
                  {deptOptions.map(opt => <Select.Option key={opt} value={opt}>{opt}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Location">
                <Input placeholder="e.g. Remote / New York" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="openings" label="Openings" initialValue={1}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="Open">
                <Select>
                  <Select.Option value="Open">Open</Select.Option>
                  <Select.Option value="Closed">Closed</Select.Option>
                  <Select.Option value="On Hold">On Hold</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Application/Form Modal */}
      <Modal
        title={`Apply for ${applyModal.job?.title}`}
        open={applyModal.visible}
        onCancel={handleApplyCancel}
        onOk={() => applyForm.submit()}
        confirmLoading={loading}
        centered
        okText="Submit Application"
      >
        {applyModal.job && (
          <div className="mb-4">
            <Tag color="blue">{applyModal.job.department} • {applyModal.job.location}</Tag>
            <hr className="my-3" />
            <Form form={applyForm} layout="vertical" onFinish={handleApplySubmit}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                <Input placeholder="John Doe" />
              </Form.Item>
              <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
                <Input placeholder="john@example.com" />
              </Form.Item>
              <Form.Item name="phone" label="Phone Number">
                <Input placeholder="+1 234 567 890" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Jobs;
