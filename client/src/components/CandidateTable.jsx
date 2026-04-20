import React, { forwardRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Tag, Button, Dropdown, Avatar, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';

const CandidateTable = forwardRef(({ rowData, onEdit, onDelete, onSelectionChanged, type = 'candidate', isStatTable = false }, ref) => {
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const isJobType = type === 'job';

  let colDefs = isJobType ? [
    { field: 'title', headerName: 'Job Title', flex: 1, fontWeight: 600 },
    { field: 'department', flex: 1 },
    { field: 'location', flex: 1 },
    {
      field: 'status',
      flex: 1,
      cellRenderer: (p) => {
        const colors = { Open: 'green', Closed: 'red', 'On Hold': 'orange' };
        return <Tag color={colors[p.value] || 'blue'}>{p.value}</Tag>;
      }
    }
  ] : [
    {
      headerName: '',
      field: 'checkbox',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      lockPinned: true,
      suppressMenu: true,
    },
    {
      field: 'name',
      flex: 1,
      cellRenderer: (p) => (
        <Space>
          <Avatar
            size="small"
            style={{
              backgroundColor: p.node.rowIndex % 2 === 0 ? '#7c3aed' : '#ec4899',
              fontSize: '10px',
              fontWeight: 600
            }}
          >
            {getInitials(p.value)}
          </Avatar>
          <span style={{ fontWeight: 500, color: '#1e293b' }}>{p.value}</span>
        </Space>
      )
    },
    { field: 'email', flex: 1 },
    { field: 'phone', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'status',
      flex: 1,
      cellRenderer: (p) => {
        const colors = {
          Active: 'blue',
          Inactive: 'default',
          Hired: 'green',
          Interview: 'purple',
          Screening: 'orange',
          Rejected: 'red'
        };
        return <Tag color={colors[p.value] || 'blue'}>{p.value}</Tag>;
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 110,
      pinned: 'right',
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => {
        const items = [
          { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => onEdit(params.data) },
          { key: 'delete', label: 'Delete', danger: true, icon: <DeleteOutlined />, onClick: () => onDelete(params.data._id) }
        ];
        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
          </Dropdown>
        );
      }
    }
  ];

  // Remove administrative columns for Stat Popups
  if (isStatTable) {
    colDefs = colDefs.filter(col => col.field !== 'checkbox' && col.field !== 'actions');
  }

  return (
    <div className="ag-theme-alpine" style={{ width: '100%' }}>
      <AgGridReact
        ref={ref}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          cellStyle: { textAlign: 'left' },
          sortable: false,
          filter: false,
          resizable: false,
          suppressMenu: true
        }}
        pagination={true}
        paginationPageSize={10}
        domLayout='autoHeight'
        onGridReady={(params) => params.api.sizeColumnsToFit()}
        onSelectionChanged={onSelectionChanged}
        rowSelection='multiple'
        suppressRowClickSelection={true} // Fixed: Clicking a cell (like Actions) won't select the row
        sideBar={{
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
              toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true
              }
            }
          ]
        }}
      />
    </div>
  );
});

export default CandidateTable;
