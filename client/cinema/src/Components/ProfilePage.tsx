import { useEffect, useState } from 'react';
import { Drawer, Typography, Button, Space, Avatar, Divider, Form, Input, Spin, message, ConfigProvider } from 'antd';
import { UserOutlined, LogoutOutlined, MailOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';
import { getProfile, updateProfile } from '../api/auth';

interface ProfilePageProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfilePage({ isOpen, onClose }: ProfilePageProps) {
    const { user, logout } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [createdAt, setCreatedAt] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();
    const [profileBackup, setProfileBackup] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen && user?.name) {
            setLoading(true);

            getProfile(user.name)
                .then((data) => {
                    const fetchedProfile = {
                        fullName: data.fullName ?? data.FullName,
                        username: data.username ?? data.Username,
                        email: data.email ?? data.Email,
                    };

                    form.setFieldsValue(fetchedProfile);
                    setProfileBackup(fetchedProfile);
                    setCreatedAt(data.createdAt ?? data.CreatedAt ?? '');
                    setIsEditing(false);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isOpen, user?.name, form]);


    const handleFormSubmit = async (values: any) => {
        if (!user?.name) return;
        setLoading(true);

        try {
            const success = await updateProfile(user.name, {
                fullName: values.fullName,
                username: values.username,
                email: values.email
            });

            if (success) {
                const usernameCambiado = values.username !== profileBackup.username;
                const emailCambiado = values.email !== profileBackup.email;


                if (usernameCambiado || emailCambiado) {
                    messageApi.open({
                        type: 'warning',
                        content: "It's necessary to re-LogIn due to credential changes.",
                        duration: 3
                    });

                    setTimeout(() => {
                        handleLogout();
                    }, 1500);

                } else {
                    messageApi.open({
                        type: 'success',
                        content: 'Profile updated successfully!',
                    });

                    setProfileBackup({
                        fullName: values.fullName,
                        username: values.username,
                        email: values.email
                    });

                    setIsEditing(false);
                    setLoading(false);
                }
            } else {
                throw new Error("Update failed");
            }
        } catch (err) {
            console.error(err);
            messageApi.open({
                type: 'error',
                content: 'Username or Email is already in use',
            });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        onClose();
    };


    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'var(--font-primary), font-primary, sans-serif',
                    colorPrimary: '#4d5078',
                },
                components: {
                    Input: {
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    },
                },
            }}
        >
            <Drawer
                title={
                    <Space>
                        <UserOutlined style={{ color: '#4d5078' }} />
                        <Typography.Text strong style={{ fontSize: 16, fontFamily: 'inherit' }}>Profile Settings</Typography.Text>
                    </Space>
                }
                placement="right"
                size="60%"
                onClose={onClose}
                open={isOpen}
            >
                {contextHolder}
                {user ? (
                    <Spin spinning={loading}>
                        <Space orientation="vertical" size="large" style={{ width: '100%' }}>

                            <Space orientation="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                                <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#4d5078' }} />
                                <Typography.Title level={4} style={{ margin: '8px 0 0 0', fontFamily: 'inherit' }}>
                                    {user.name}
                                </Typography.Title>
                                <Space size="middle" separator={<span>•</span>}>

                                    <Typography.Text type="secondary" style={{ fontSize: 9, fontFamily: 'inherit' }}>
                                        Role: {user.role || 'Unknown'}
                                    </Typography.Text>

                                    {createdAt && (
                                        <Typography.Text type="secondary" style={{ fontSize: 9, fontFamily: 'inherit' }}>
                                            <CalendarOutlined style={{ marginRight: 4 }} />
                                            Member since: {new Date(createdAt).toLocaleDateString()}
                                        </Typography.Text>
                                    )}
                                </Space>
                            </Space>

                            <Divider style={{ margin: '12px 0' }} />


                            <Form form={form} onFinish={handleFormSubmit} layout='vertical'>

                                <Form.Item
                                    label={<span style={{ fontFamily: 'var(--font-primary), sans-serif' }}>Full Name</span>}
                                    name="fullName"
                                    rules={[
                                        { required: true, message: "Please input your full name!" },
                                        { max: 255, message: "The full name cannot exceed 255 characters." }
                                    ]}
                                >
                                    <Input
                                        disabled={!isEditing}
                                        size="large"
                                        prefix={<IdcardOutlined />}
                                        placeholder="Full Name"
                                        type="text"
                                        style={{ fontFamily: 'system-ui, sans-serif' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span style={{ fontFamily: 'var(--font-primary), sans-serif' }}>User Name</span>}
                                    name="username"
                                    rules={[
                                        { required: true, message: "Please input your username!" },
                                        { min: 3, max: 50, message: "The username must be between 3 and 50 characters long." },
                                        { pattern: /^[a-zA-Z0-9]+$/, message: "The username can only contain letters and numbers." }
                                    ]}
                                >
                                    <Input
                                        disabled={!isEditing}
                                        size="large"
                                        prefix={<UserOutlined />}
                                        placeholder="UserName"
                                        type="text"
                                        style={{ fontFamily: 'system-ui, sans-serif' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span style={{ fontFamily: 'var(--font-primary), sans-serif' }}>Email Address</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: "Please input your email!" },
                                        { type: 'email', message: "The email format is invalid." },
                                        { max: 150, message: "The email cannot exceed 150 characters." }
                                    ]}
                                >
                                    <Input
                                        disabled={!isEditing}
                                        size="large"
                                        prefix={<MailOutlined />}
                                        placeholder="Email"
                                        type="email"
                                        style={{ fontFamily: 'system-ui, sans-serif' }}
                                    />
                                </Form.Item>

                                <div className="flex justify-center w-full mt-6">
                                    <div className="flex bg-slate-600/80 rounded-full p-1 border border-slate-500 shadow-inner text-base gap-1">

                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => {
                                                if (!isEditing) {
                                                    setIsEditing(true);
                                                } else {
                                                    form.submit();
                                                }
                                            }}
                                            className="cursor-pointer group relative flex items-center justify-center px-8 h-10 rounded-full text-white bg-slate-700 hover:bg-slate-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="inline-block transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] font-semibold">
                                                {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                                            </span>
                                        </button>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => {
                                                    if (profileBackup) {
                                                        form.setFieldsValue(profileBackup);
                                                    }
                                                    setIsEditing(false);
                                                }}
                                                className="cursor-pointer group relative flex items-center justify-center px-6 h-10 rounded-full text-slate-200 bg-transparent hover:bg-white/10 transition-colors duration-300 disabled:opacity-50"
                                            >
                                                <span className="inline-block transition-all duration-300 group-hover:scale-105 font-medium">
                                                    Cancel
                                                </span>
                                            </button>
                                        )}

                                    </div>
                                </div>
                            </Form>

                            <Divider style={{ margin: '24px 0 12px 0' }} />

                            <Button
                                color="danger"
                                variant="outlined"
                                size="large"
                                block
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                                style={{ fontFamily: 'var(--font-primary), sans-serif' }}
                            >
                                Log Out
                            </Button>

                        </Space>
                    </Spin>
                ) : (
                    <div style={{ textAlign: 'center', paddingTop: 40 }}>
                        <Typography.Text type="secondary" style={{ fontFamily: 'var(--font-primary), sans-serif' }}>
                            You are not currently logged in.
                        </Typography.Text>
                    </div>
                )}
            </Drawer>
        </ConfigProvider>
    );
}
