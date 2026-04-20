import React, { useState, useEffect, useRef } from 'react';
import { Space, Button, message, Modal, Typography, Form } from 'antd';
import { PlusOutlined, DownloadOutlined, DeleteFilled } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import CandidateTable from '../components/CandidateTable';
import CandidateFormModal from '../components/CandidateFormModal';

const { Title } = Typography;

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const gridRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/candidates');
      setCandidates(res.data);
    } catch (err) {
      message.error('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFinish = async (values) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/candidates/${editingId}`, values);
        message.success('Candidate updated');
      } else {
        await axiosInstance.post('/candidates', values);
        message.success('Candidate created');
      }
      setIsModalOpen(false);
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
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/candidates/${id}`);
          message.success('Deleted');
          fetchData();
        } catch (err) {
          message.error('Failed');
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: `Delete ${selectedRows.length} candidates?`,
      onOk: async () => {
        try {
          await Promise.all(selectedRows.map(row => axiosInstance.delete(`/candidates/${row._id}`)));
          message.success('Bulk delete successful');
          fetchData();
          setSelectedRows([]);
        } catch (err) {
          message.error('Error in bulk delete');
        }
      }
    });
  };

  if (loading && candidates.length === 0) return <LoadingSpinner />;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div /> {/* Spacer for title now in Navbar */}
        <Space>
          {selectedRows.length > 0 && (
            <>
              <Button icon={<DownloadOutlined />} onClick={() => gridRef.current.api.exportDataAsCsv()}>Export CSV</Button>
              <Button danger icon={<DeleteFilled />} onClick={handleBulkDelete}>Delete Selected ({selectedRows.length})</Button>
            </>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}
            style={{ background: '#7c3aed', borderColor: '#7c3aed', borderRadius: '8px' }}
          >
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

      <CandidateFormModal
        open={isModalOpen}
        form={form}
        editingId={editingId}
        onCancel={() => { setIsModalOpen(false); setEditingId(null); }}
        onFinish={handleFinish}
      />
    </div>
  );
};

export default Candidates;
