import React from 'react';
import { Result, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '24px'
    }}>
      <Result
        status="404"
        title={
          <Title level={1} style={{ margin: 0, fontSize: '64px', color: '#7c3aed' }}>404</Title>
        }
        subTitle={
          <div style={{ marginTop: '16px' }}>
            <Title level={3}>Oops! You've drifted into space.</Title>
            <Paragraph type="secondary" style={{ fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
              The page you are looking for doesn't exist or has been moved to another dimension.
            </Paragraph>
          </div>
        }
        extra={
          <Button 
            type="primary" 
            size="large" 
            icon={<HomeOutlined />}
            onClick={() => navigate('/dashboard')}
            style={{ 
              background: '#7c3aed', 
              borderColor: '#7c3aed',
              height: '48px',
              padding: '0 32px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
            }}
          >
            Back to Dashboard
          </Button>
        }
        icon={<RocketOutlined style={{ fontSize: '100px', color: '#7c3aed' }} />}
      />
    </div>
  );
};

export default NotFound;
