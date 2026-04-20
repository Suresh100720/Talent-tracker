import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Divider, Space } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  GoogleOutlined, 
  AppleOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled in your Firebase console. Please enable it under Authentication > Sign-in method.');
      } else {
        setError(err.message || 'Google Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 420, 
          borderRadius: '16px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          border: 'none'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={3} style={{ marginBottom: '24px', fontWeight: 600 }}>Log in with</Title>
          
          <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
            <Button 
              icon={<GoogleOutlined style={{ color: '#ea4335' }} />} 
              size="large"
              style={{ width: 160, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500 }}
              onClick={handleGoogleLogin}
            >
              Google
            </Button>
            <Button 
              icon={<AppleOutlined />} 
              size="large"
              style={{ width: 160, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500 }}
            >
              Apple
            </Button>
          </Space>
        </div>

        <Divider plain><Text type="secondary">or</Text></Divider>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px', borderRadius: '8px' }} />}

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Email address" 
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            style={{ marginBottom: '8px' }}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Password" 
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <Link to="#" style={{ color: '#764ba2', fontWeight: 500 }}>Forgot password?</Link>
          </div>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              style={{ 
                height: '48px', 
                borderRadius: '8px', 
                background: '#764ba2', 
                borderColor: '#764ba2',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              Log In
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Text type="secondary">Don't have an account? </Text>
            <Link to="#" style={{ color: '#764ba2', fontWeight: 600 }}>Sign up</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
