import React from 'react';
import { Layout, Menu, Avatar, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  AuditOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/candidates', icon: <TeamOutlined />, label: 'Candidates' },
    { key: '/jobs', icon: <AuditOutlined />, label: 'Jobs' },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="80"
      onBreakpoint={(broken) => {
        if (broken) setCollapsed(true);
      }}
      style={{
        minHeight: '100vh',
        background: '#0a0a0c',
        zIndex: 100
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
        {/* Logo Section */}
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <div style={{ width: 32, height: 32, background: '#7c3aed', borderRadius: '8px', marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>T</span>
          </div>
          {!collapsed && <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Admin Panel</h2>}
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1, marginTop: '24px' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              background: 'transparent',
              border: 'none'
            }}
            inlineIndent={24}
          />
        </div>

        {/* User Info & Logout Section */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', padding: '0 8px' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#7c3aed', marginRight: '12px' }} />
              <div style={{ overflow: 'hidden' }}>
                <Text style={{ color: 'white', display: 'block', fontSize: '14px', fontWeight: 500 }}>
                  {currentUser?.email?.split('@')[0]}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.45)', display: 'block', fontSize: '11px' }} ellipsis>
                  {currentUser?.email}
                </Text>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#7c3aed' }} />
            </div>
          )}

          <Menu
            theme="dark"
            mode="inline"
            selectable={false}
            onClick={handleLogout}
            style={{ background: 'transparent', border: 'none' }}
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined style={{ color: '#ec4899' }} />,
                label: <span style={{ color: '#ec4899' }}>Logout</span>,
              }
            ]}
          />
        </div>
      </div>

      <style>
        {`
          .ant-menu-dark.ant-menu-inline .ant-menu-item-selected {
            background-color: #7c3aed !important;
            border-radius: 8px !important;
            width: calc(100% - 16px) !important;
            margin-left: 8px !important;
          }
          .ant-menu-dark .ant-menu-item:hover {
            background-color: rgba(124, 58, 237, 0.1) !important;
          }
        `}
      </style>
    </Sider>
  );
};

export default Sidebar;
