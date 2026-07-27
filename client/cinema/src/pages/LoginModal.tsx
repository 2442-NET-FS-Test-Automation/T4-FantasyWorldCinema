import { useAuth } from '../auth/useAuth';
import { useState } from 'react';
import { Button, Typography, Input, Form, Modal, Divider, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const { login, logout, status, user, error } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

  const handleFormSubmit = async () => {
    const success = await login(identifier, password);
    if (success) {
      console.log("Successfully logIn");
      messageApi.open({
        type: 'success',
        content: 'LogIn Successfully',
      });
      onClose();
    } else {
      console.log("Failed to logIn");
      messageApi.open({
        type: 'error',
        content: 'Wrong User or Password',
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      styles={{
        header: {
          background: 'transparent'
        },
        content: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.80)), url("Fantasy_World_Login_Background.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      }}
    >
      {contextHolder}
      <Typography.Title level={2} style={{ margin: 0, color: '#1677ff' }}>
        ¡Hello!
      </Typography.Title>
      <Typography.Paragraph style={{ margin: '4px 0', fontSize: 16 }}>
        Access to buy your tickets at Fantasy World Cinema!
      </Typography.Paragraph>

      <Divider style={{ borderColor: '#051fb3', color: '#051fb3', fontSize: '24px', fontWeight: 'bold' }}>LogIn</Divider>

      <div>
        <p><strong>Status:</strong> <code>{status}</code></p>
        <p><strong>Loged User:</strong> {user ? JSON.stringify(user) : 'Nobody'}</p>
        {error && <p><strong>Error:</strong> {error}</p>}
      </div>

      {status !== 'authenticated' ? (
        <Form onFinish={handleFormSubmit} layout='vertical'>
          <Form.Item
            name="identifier"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="UserName | Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={status === 'authenticating'}
          >
            LogIn
          </Button>
        </Form>
      ) : (
        <Button
          color="danger"
          variant="outlined"
          size="large"
          onClick={logout}
          icon={<LogoutOutlined />}
        >
          LogOut
        </Button>
      )}
    </Modal>
  );
}
