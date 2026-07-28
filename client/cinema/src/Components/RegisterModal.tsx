import { useAuth } from '../auth/useAuth';
import { Typography, Input, Form, Modal, Divider, message, ConfigProvider, Flex } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const { register, login, status, error } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  // CORRECCIÓN LÓGICA: Recibe los datos validados nativamente de Ant Design
  const handleFormSubmit = async (values: any) => {
    const success = await register(
      values.fullName,
      values.username,
      values.email,
      values.password
    );

    if (success) {
      console.log("Successfully Registered");
      const loggedIn = await login(values.username, values.password);

      if (loggedIn) {
        messageApi.open({
          type: 'success',
          content: 'Registered and Logged In Successfully',
        });
      } else {
        messageApi.open({
          type: 'success',
          content: 'Signed Up Successfully! Please log in manually.',
        });
      }
      onClose();
    } else {
      console.log("Failed to register");
      messageApi.open({
        type: 'warning',
        content: 'Username or Email is already in use',
      });
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          // Mismo esquema de tipografía limpia por defecto y colores oscuros / dorados del Login
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
        width={440} // Consistencia visual en dimensiones con el modal de Login
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

          {/* Título: Tipografía de fantasía de la app compartida */}
          <Typography.Title 
            level={2} 
            className='auth-title text-center !mb-1'
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
            className='auth-subtitle text-center !text-slate-400 !mb-6'
            style={{ fontSize: '14px', lineHeight: '1.5' }}
          >
            Register your account to become a Fantasy World Cinema member!
          </Typography.Paragraph>

          <Divider className='auth-divider !my-4'>
            <span style={{ 
              fontFamily: 'var(--font-primary), font-primary, serif', 
              letterSpacing: '2px',
              fontSize: '16px'
            }}>
              SIGNUP
            </span>
          </Divider>

          {error && (
            <div className="mb-4 text-center">
              <Typography.Text type="danger" strong style={{ fontSize: '14px' }}>
                Error: {error}
              </Typography.Text>
            </div>
          )}

          <Form onFinish={handleFormSubmit} layout='vertical' className="mt-4">
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: "Please input your full name!" },
                { max: 255, message: "The full name cannot exceed 255 characters." }
              ]}
            >
              <Input
                size="large"
                prefix={<IdcardOutlined className="text-slate-400" />}
                placeholder="Full Name"
                type="text"
                className="hover:!border-[#d4af37] focus:!border-[#d4af37]"
              />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 3, max: 50, message: "The username must be between 3 and 50 characters long." },
                { pattern: /^[a-zA-Z0-9]+$/, message: "The username can only contain letters and numbers." }
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-slate-400" />}
                placeholder="UserName"
                type="text"
                className="hover:!border-[#d4af37] focus:!border-[#d4af37]"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: 'email', message: "The email format is invalid." },
                { max: 150, message: "The email cannot exceed 150 characters." }
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined className="text-slate-400" />}
                placeholder="Email"
                type="email"
                className="hover:!border-[#d4af37] focus:!border-[#d4af37]"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, max: 100, message: "The password must be between 8 and 100 characters long." }
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="Password"
                iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor="#d4af37" /> : <EyeInvisibleOutlined />)}
                className="hover:!border-[#d4af37] focus:!border-[#d4af37]"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="Confirm Password"
                iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor="#d4af37" /> : <EyeInvisibleOutlined />)}
                className="hover:!border-[#d4af37] focus:!border-[#d4af37]"
              />
            </Form.Item>

            {/* Botón Principal: Copia exacta del estilo dorado interactivo */}
            <div className="w-full mt-8">
              <button
                type="submit"
                disabled={status === 'authenticating'}
                className="w-full h-12 cursor-pointer relative flex items-center justify-center rounded-xl text-black bg-[#d4af37] hover:bg-[#e6c24a] transition-all duration-300 font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>
                  {status === 'authenticating' ? 'Registering...' : 'SignUp'}
                </span>
              </button>
            </div>
          </Form>
        </Flex>
      </Modal>
    </ConfigProvider>
  );
}
