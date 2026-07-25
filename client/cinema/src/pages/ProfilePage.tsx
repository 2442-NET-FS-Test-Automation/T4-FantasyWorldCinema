import { Drawer, Typography, Button, Space, Avatar, Divider } from 'antd';
import { UserOutlined, LogoutOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';

interface ProfilePageProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfilePage({ isOpen, onClose }: ProfilePageProps) {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <Drawer
            title={
                <Space>
                    <UserOutlined style={{ color: '#1677ff' }} />
                    <Typography.Text strong style={{ fontSize: 16 }}>Profile</Typography.Text>
                </Space>
            }
            placement="right"
            width="50%"
            onClose={onClose}
            open={isOpen}
        >
            {user ? (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>

                    <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                        <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
                        <Typography.Title level={4} style={{ margin: '8px 0 0 0' }}>
                            {user.name}
                        </Typography.Title>
                        <Typography.Text type="secondary">¡Welcome!</Typography.Text>
                    </Space>


                    <Divider style={{ margin: '12px 0' }} />
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Space direction="vertical">
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}> 
                                User Name
                            </Typography.Text>
                            <Typography.Text strong style={{ fontSize: 16 }}>
                                <UserOutlined /> {user.name || 'Unknown'}
                            </Typography.Text>
                        </Space>

                        <Space direction="vertical">
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}> 
                                Role
                            </Typography.Text>
                            <Typography.Text strong style={{ fontSize: 16 }}>
                                <UserOutlined /> {user.role || 'Unknown'}
                            </Typography.Text>
                        </Space>

                        <Space direction="vertical">
                            <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                                Email
                            </Typography.Text>
                            <Typography.Text strong style={{ fontSize: 16 }}><MailOutlined /> {user.email || 'Unknown'}</Typography.Text>
                        </Space>
                    </Space>


                    <Divider style={{ margin: '24px 0 12px 0' }} />
                    <Button
                        color="danger"
                        variant="outlined"
                        size="large"
                        block
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Log Out
                    </Button>

                </Space>
            ) : (
                <div style={{ textAlign: 'center', paddingTop: 40 }}>
                    <Typography.Text type="secondary">You are not currently logged in.</Typography.Text>
                </div>
            )}
        </Drawer>
    );
}
