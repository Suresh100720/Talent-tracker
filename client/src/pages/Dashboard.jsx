import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Typography, Tag, Space, Modal, Button, Form, message } from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  DownloadOutlined,
  DeleteFilled,
  FileTextOutlined,
  RocketOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import DashboardCharts from '../components/DashboardCharts';
import CandidateTable from '../components/CandidateTable';
import CandidateFormModal from '../components/CandidateFormModal';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  // Modal states
  const [statModal, setStatModal] = useState({ visible: false, title: '', data: [], type: 'candidate' });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form] = Form.useForm();
  const gridRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, candidatesRes, jobsRes] = await Promise.all([
        axiosInstance.get('/stats'),
        axiosInstance.get('/candidates'),
        axiosInstance.get('/jobs')
      ]);
      setStats(statsRes.data);
      setCandidates(candidatesRes.data);
      setJobs(jobsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatClick = (category) => {
    let filtered = [];
    let title = '';
    let type = 'candidate';

    if (category === 'total_candidates') {
      filtered = candidates;
      title = 'Total Candidates';
      type = 'candidate';
    } else if (category === 'hired') {
      filtered = candidates.filter(c => c.status === 'Hired');
      title = 'Hired Candidates';
      type = 'candidate';
    } else if (category === 'total_jobs') {
      filtered = jobs;
      title = 'Total Job Listings';
      type = 'job';
    } else if (category === 'open_jobs') {
      filtered = jobs.filter(j => j.status === 'Open');
      title = 'Open Job Listings';
      type = 'job';
    }

    setStatModal({ visible: true, title, data: filtered, type });
  };

  const handleFinish = async (values) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/candidates/${editingId}`, values);
        message.success('Candidate updated successfully');
      } else {
        await axiosInstance.post('/candidates', values);
        message.success('Candidate created successfully');
      }
      setIsFormModalOpen(false);
      setEditingId(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error('Action failed');
    }
  };

  const handleEdit = (candidate) => {
    setEditingId(candidate._id);
    form.setFieldsValue(candidate);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this candidate?',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/candidates/${id}`);
          message.success('Candidate deleted');
          fetchData();
        } catch (err) {
          message.error('Delete failed');
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: `Delete ${selectedRows.length} candidates?`,
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await Promise.all(selectedRows.map(row => axiosInstance.delete(`/candidates/${row._id}`)));
          message.success('Selected candidates deleted');
          fetchData();
          setSelectedRows([]);
        } catch (err) {
          message.error('Failed to delete some candidates');
        }
      }
    });
  };

  if (loading) return <LoadingSpinner />;

  const chartData = Object.keys(stats.byStatus || {}).map(key => ({
    name: key,
    value: stats.byStatus[key]
  }));

  return (
    <div style={{ padding: '32px' }}>
      {/* Stat Cards Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Total Candidates" value={stats.totalCandidates} icon={<UserOutlined />} backgroundColor="#f5f3ff" iconColor="#7c3aed" onClick={() => handleStatClick('total_candidates')} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Total Jobs" value={stats.totalJobs} icon={<FileTextOutlined />} backgroundColor="#f0f9ff" iconColor="#0ea5e9" onClick={() => handleStatClick('total_jobs')} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Hired" value={stats.byStatus.Hired || 0} icon={<RocketOutlined />} backgroundColor="#f0fdf4" iconColor="#22c55e" onClick={() => handleStatClick('hired')} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard title="Open Jobs" value={stats.jobsByStatus.Open || 0} icon={<SolutionOutlined />} backgroundColor="#fffbeb" iconColor="#f59e0b" onClick={() => handleStatClick('open_jobs')} />
        </Col>
      </Row>

      {/* Analyticsintegration */}
      <div style={{ marginBottom: '32px' }}>
        <DashboardCharts chartData={chartData} total={stats.totalCandidates} active={stats.byStatus.Hired || 0} roles={candidates.length} />
      </div>

      {/* Main Table Section */}
      <div style={{ background: 'white', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0ea5e9' }}>All Candidates</Title>
          <Space>
            {selectedRows.length > 0 && (
              <>
                <Button icon={<DownloadOutlined />} onClick={() => gridRef.current.api.exportDataAsCsv()}>Export CSV</Button>
                <Button danger icon={<DeleteFilled />} onClick={handleBulkDelete}>Delete Selected ({selectedRows.length})</Button>
              </>
            )}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setIsFormModalOpen(true); }} style={{ background: '#7c3aed', borderColor: '#7c3aed', height: 44, borderRadius: '12px', padding: '0 24px', fontWeight: 600 }}>
              Add Candidate
            </Button>
          </Space>
        </div>

        <CandidateTable
          ref={gridRef}
          rowData={candidates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectionChanged={() => setSelectedRows(gridRef.current.api.getSelectedRows())}
        />
      </div>

      <CandidateFormModal
        open={isFormModalOpen}
        form={form}
        editingId={editingId}
        onCancel={() => { setIsFormModalOpen(false); setEditingId(null); }}
        onFinish={handleFinish}
      />

      <Modal
        title={statModal.title}
        open={statModal.visible}
        onCancel={() => setStatModal({ ...statModal, visible: false })}
        width={1000} 
        footer={null} 
        centered 
        styles={{ body: { padding: 0 } }}
      >
        <CandidateTable 
          key={statModal.type}
          rowData={statModal.data} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          type={statModal.type} 
          isStatTable={true}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
