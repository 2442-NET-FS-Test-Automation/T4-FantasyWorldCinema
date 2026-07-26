import { useAuth } from '../auth/useAuth';
import { Button, Typography, Input, Form, Modal, Divider, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const { register, status, error } = useAuth();

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
      messageApi.open({
        type: 'success',
        content: 'Signed Up Successfully',
      });
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
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      styles={{
        header: { background: 'transparent' },
        content: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.80)), url("/Fantasy_World_Login_Background.webp")',
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
        Register your account to become a Fantasy World Cinema member!
      </Typography.Paragraph>

      <Divider style={{ borderColor: '#051fb3', color: '#051fb3', fontSize: '24px', fontWeight: 'bold' }}>
        SignUp
      </Divider>


      {error && (
        <div style={{ marginBottom: 16 }}>
          <Typography.Text type="danger" strong>Error: {error}</Typography.Text>
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
          />
        </Form.Item>

        <Button
          type="primary"
          size="large"
          block
          htmlType="submit"
          loading={status === 'authenticating'}
        >
          SignUp
        </Button>
      </Form>
    </Modal>
  );
}
