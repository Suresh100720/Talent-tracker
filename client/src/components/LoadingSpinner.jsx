import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    background: 'rgba(255, 255, 255, 0.7)',
    zIndex: 9999
  }}>
    <Spin size="large" description="Loading..." />
  </div>
);

export default LoadingSpinner;
