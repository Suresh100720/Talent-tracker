import React from 'react';
import { Layout, Avatar, Space, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;
const { Text, Title } = Typography;

const Navbar = ({ collapsed, setCollapsed }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Route to Page Title mapping
  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Dashboard';
      case '/candidates': return 'Candidates Pipeline';
      case '/jobs': return 'Job Management';
      default: return 'Admin Panel';
    }
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        width: '100%',
        zIndex: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          style: { fontSize: '18px', cursor: 'pointer', marginRight: '24px' },
          onClick: () => setCollapsed(!collapsed),
        })}
        <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
          {getPageTitle(location.pathname)}
        </Title>
      </div>


    </Header>
  );
};

export default Navbar;
