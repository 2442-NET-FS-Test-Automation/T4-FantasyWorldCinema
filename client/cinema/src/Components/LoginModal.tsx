import { useAuth } from '../auth/useAuth';
import { useState } from 'react';
import { Button, Typography, Input, Form, Modal, Divider, message, ConfigProvider, Flex } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const { login, logout, status } = useAuth();
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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'var(--font-primary), font-primary, sans-serif',
            colorPrimary: '#4d5078',

            paddingMD: 0,
            paddingLG: 0,
            paddingContentHorizontalLG: 0,
          },
          components: {
            Input: {
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            Modal: {
              padding: 0,
              paddingMD: 0,
              paddingLG: 0,
            }
          },
        }}
      >
        <Modal
          open={isOpen}
          onCancel={onClose}
          footer={null}
          styles={{
            body: {
              padding: 0,
              overflow: 'hidden',
              borderRadius: '5px',
            }
          }}
        >
          <Flex vertical
            id="LoginRegister"
            className="Flex-LoginRegister-Background"
          >
            {contextHolder}

            <Typography.Title level={2} className='auth-title'>
              Hello!
            </Typography.Title>
            <Typography.Paragraph className='auth-subtitle'>
              Access to buy your tickets at Fantasy World Cinema!
            </Typography.Paragraph>

            <Divider className='auth-divider'>
              LogIn
            </Divider>

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
                    style={{ fontFamily: 'system-ui, sans-serif' }}
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
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  />
                </Form.Item>

                <div className="flex justify-center w-full mt-6">
                  <div className="flex bg-slate-600/80 rounded-full p-1 border border-slate-500 shadow-inner text-base">
                    <button
                      type="submit"
                      disabled={status === 'authenticating'}
                      className="cursor-pointer group relative flex items-center justify-center px-8 h-10 rounded-full text-white bg-slate-700 hover:bg-slate-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="inline-block transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] font-semibold">
                        {status === 'authenticating' ? 'Authenticating...' : 'LogIn'}
                      </span>
                    </button>
                  </div>
                </div>
              </Form>
            ) : (
              <div className="flex justify-center w-full mt-4">
                <Button
                  color="danger"
                  variant="outlined"
                  size="large"
                  onClick={logout}
                  icon={<LogoutOutlined />}
                >
                  LogOut
                </Button>
              </div>
            )}
          </Flex>
        </Modal>
      </ConfigProvider>
    </div>
  );
}
