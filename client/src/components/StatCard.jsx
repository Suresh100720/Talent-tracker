import React from 'react';
import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

const StatCard = ({ title, value, icon, backgroundColor, iconColor, onClick }) => {
  return (
    <Card
      onClick={onClick}
      hoverable
      style={{
        borderRadius: '16px',
        border: 'none',
        background: backgroundColor || '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        transition: 'transform 0.2s'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary" style={{ color: 'rgba(0,0,0,0.45)', fontWeight: 500, fontSize: '14px' }}>
            {title}
          </Text>
          <Title level={2} style={{ margin: '12px 0 0 0', fontWeight: 'bold' }}>
            {value}
          </Title>
        </div>
        <div style={{
          background: 'white',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: iconColor || '#7c3aed',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
