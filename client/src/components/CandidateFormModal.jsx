import React from 'react';
import { Modal, Form, Input, Select, Button, Typography } from 'antd';

const { Text, Title } = Typography;

const CandidateFormModal = ({ open, onCancel, onFinish, editingId, form }) => {
  const roleOptions = [
    { value: 'Frontend Developer', label: 'Frontend' },
    { value: 'Backend Developer', label: 'Backend' },
    { value: 'UI/UX Designer', label: 'UI/UX' },
    { value: 'Cybersecurity Analyst', label: 'Cybersecurity' },
    { value: 'AI/ML Engineer', label: 'AI/ML' },
    { value: 'Data Scientist', label: 'Data Science' },
    { value: 'Fullstack Developer', label: 'Fullstack' },
    { value: 'DevOps Engineer', label: 'DevOps' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Hired', label: 'Hired' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Screening', label: 'Screening' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>{editingId ? "Edit Candidate" : "Register New Candidate"}</Title>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      bodyStyle={{ padding: '24px' }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          name="name"
          label={<Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>NAME <span style={{ color: '#ff4d4f' }}>*</span></Text>}
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Ex: John Doe" style={{ height: 45, borderRadius: '8px' }} />
        </Form.Item>

        <Form.Item
          name="email"
          label={<Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>EMAIL <span style={{ color: '#ff4d4f' }}>*</span></Text>}
          rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}
        >
          <Input placeholder="john@example.com" style={{ height: 45, borderRadius: '8px' }} />
        </Form.Item>

        <Form.Item
          name="phone"
          label={<Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>PHONE</Text>}
          rules={[
            { required: true, message: 'Phone is required' },
            { pattern: /^[0-9]{10}$/, message: 'Must be exactly 10 digits' }
          ]}
        >
          <Input
            placeholder="10 digit number"
            maxLength={10}
            style={{ height: 45, borderRadius: '8px' }}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Form.Item name="role" label={<Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>ROLE</Text>} rules={[{ required: true, message: 'Role is required' }]}>
          <Select placeholder="Select specialization" style={{ height: 45 }}>
            {roleOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
          </Select>
        </Form.Item>

        <Form.Item name="status" label={<Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>STATUS</Text>} initialValue="Active">
          <Select style={{ height: 45 }}>
            {statusOptions.map(opt => <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>)}
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
          <Button onClick={onCancel} style={{ height: 45, borderRadius: '8px', padding: '0 24px' }}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            style={{ background: '#7c3aed', borderColor: '#7c3aed', height: 45, padding: '0 24px', borderRadius: '8px', fontWeight: 600 }}
          >
            {editingId ? "Update Candidate" : "Save Candidate"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CandidateFormModal;
