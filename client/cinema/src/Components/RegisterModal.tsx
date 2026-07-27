import { useAuth } from '../auth/useAuth';
import { Typography, Input, Form, Modal, Divider, message, ConfigProvider } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const { register, login, status, error } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

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
          <div
            className="font-primary text-slate-800 p-8 bg-cover bg-center bg-no-repeat w-full h-full min-h-[400px] rounded-x1"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.80)), url("/Fantasy_World_Login_Background.webp")',
            }}
          >
            {contextHolder}

            <Typography.Title level={2} style={{ margin: 0, color: '#4d5078', fontFamily: 'inherit' }}>
              ¡Hello!
            </Typography.Title>
            <Typography.Paragraph style={{ margin: '4px 0', fontSize: 16, fontFamily: 'inherit' }}>
              Register your account to become a Fantasy World Cinema member!
            </Typography.Paragraph>

            <Divider style={{ borderColor: '#4d5078', color: '#4d5078', fontSize: '24px', fontWeight: 'bold', fontFamily: 'inherit' }}>
              SignUp
            </Divider>

            {error && (
              <div className="mb-4">
                <Typography.Text type="danger" strong style={{ fontFamily: 'inherit' }}>
                  Error: {error}
                </Typography.Text>
              </div>
            )}

            <Form onFinish={handleFormSubmit} layout='vertical'>
              <Form.Item
                name="fullName"
                rules={[
                  { required: true, message: "Please input your full name!" },
                  { max: 255, message: "The full name cannot exceed 255 characters." }
                ]}
              >
                <Input
                  size="large"
                  prefix={<IdcardOutlined />}
                  placeholder="Full Name"
                  type="text"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
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
                  prefix={<UserOutlined />}
                  placeholder="UserName"
                  type="text"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
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
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  type="email"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
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
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  style={{ fontFamily: 'system-ui, sans-serif' }}
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
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
                      {status === 'authenticating' ? 'Registering...' : 'SignUp'}
                    </span>
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}
