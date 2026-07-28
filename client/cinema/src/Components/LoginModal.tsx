import { useAuth } from '../auth/useAuth';
import { Button, Typography, Input, Form, Modal, Divider, message, ConfigProvider, Flex } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, logout, status } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const handleFormSubmit = async (values: any) => {
    const success = await login(values.identifier, values.password);
    if (success) {
      messageApi.open({
        type: 'success',
        content: 'Welcome back!',
      });
      onClose();
    } else {
      messageApi.open({
        type: 'error',
        content: 'Invalid Username or Password',
      });
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          colorPrimary: '#d4af37',
          colorBgElevated: '#0f0f12',
          colorText: '#ffffff',
          colorTextDescription: '#94a3b8',
          colorTextPlaceholder: '#64748b',
          borderRadiusLG: 16,
        },
        components: {
          Input: {
            colorBgContainer: '#1e1e24',
            colorBorder: '#2a2a32',
            colorText: '#ffffff',
            controlHeightLG: 48,
          },
          Divider: {
            colorSplit: 'rgba(212, 175, 55, 0.2)',
            colorTextHeading: '#d4af37',
          }
        },
      }}
    >
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={440}
        styles={{
          mask: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
          },
          body: {
            padding: '36px 32px',
            backgroundColor: '#0f0f12',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '16px',
          }
        }}
      >
        <Flex vertical id="LoginRegister">
          {contextHolder}

          <Typography.Title 
            level={2} 
            className='auth-title text-center mb-1!'
            style={{ 
              fontFamily: 'var(--font-primary), font-primary, serif', 
              color: '#ffffff',
              fontSize: '2rem',
              letterSpacing: '1px'
            }}
          >
            HELLO!
          </Typography.Title>
          
          <Typography.Paragraph 
            className='auth-subtitle text-center text-slate-400! mb-6!'
            style={{ fontSize: '14px', lineHeight: '1.5' }}
          >
            Access to buy your tickets at Fantasy World Cinema!
          </Typography.Paragraph>

          <Divider className='auth-divider my-4!'>
            <span style={{ 
              fontFamily: 'var(--font-primary), font-primary, serif', 
              letterSpacing: '2px',
              fontSize: '16px'
            }}>
              LOGIN
            </span>
          </Divider>

          {status !== 'authenticated' ? (
            <Form onFinish={handleFormSubmit} layout='vertical' className="mt-4">
              <Form.Item
                name="identifier"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined className="text-slate-400" />}
                  placeholder="UserName | Email"
                  type="text"
                  className="hover:border-[#d4af37]! focus:border-[#d4af37]!"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="text-slate-400" />}
                  placeholder="Password"
                  iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor="#d4af37" /> : <EyeInvisibleOutlined />)}
                  className="hover:border-[#d4af37]! focus:border-[#d4af37]!"
                />
              </Form.Item>

              <div className="w-full mt-8">
                <button
                  type="submit"
                  disabled={status === 'authenticating'}
                  className="w-full h-12 cursor-pointer relative flex items-center justify-center rounded-xl text-black bg-[#d4af37] hover:bg-[#e6c24a] transition-all duration-300 font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>
                    {status === 'authenticating' ? 'Authenticating...' : 'LogIn'}
                  </span>
                </button>
              </div>
            </Form>
          ) : (
            <div className="flex justify-center w-full mt-6">
              <Button
                danger
                type="primary"
                size="large"
                onClick={logout}
                icon={<LogoutOutlined />}
                className="w-full h-12 rounded-xl font-semibold"
              >
                LogOut
              </Button>
            </div>
          )}
        </Flex>
      </Modal>
    </ConfigProvider>
  );
}
