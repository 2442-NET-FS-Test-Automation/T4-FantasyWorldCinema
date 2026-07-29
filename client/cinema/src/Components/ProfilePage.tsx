import { useEffect, useState } from 'react';
import { 
    Drawer, 
    Typography, 
    Button, 
    Avatar, 
    Form, 
    Input, 
    Spin, 
    message, 
    ConfigProvider, 
    Tag 
} from 'antd';
import { 
    UserOutlined, 
    LogoutOutlined, 
    MailOutlined, 
    IdcardOutlined, 
    CalendarOutlined, 
    EditOutlined, 
    CheckOutlined, 
    CloseOutlined 
} from '@ant-design/icons';
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

    // We monitor the fields in real time to detect real changes
    const formValues = Form.useWatch([], form);
    const hasChanges = isEditing && profileBackup && (
        formValues?.fullName !== profileBackup.fullName ||
        formValues?.username !== profileBackup.username ||
        formValues?.email !== profileBackup.email
    );

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
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
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
                        content: "Credentials changed. Please log in again.",
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

                    setProfileBackup(values);
                    setIsEditing(false);
                }
            } else {
                throw new Error("Update failed");
            }
        } catch (err) {
            console.error(err);
            messageApi.open({
                type: 'error',
                content: 'Username or Email is already in use.',
            });
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
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    colorPrimary: '#d4af37',
                    colorBgElevated: '#0f0f12',
                    colorText: '#ffffff',
                    colorTextDescription: '#94a3b8',
                    colorTextPlaceholder: '#475569',
                    borderRadiusLG: 12,
                },
                components: {
                    Input: {
                        colorBgContainer: 'rgba(24, 24, 27, 0.7)',
                        colorBorder: '#27272a',
                        colorText: '#ffffff',
                        controlHeightLG: 46,
                        colorTextDisabled: '#ffffff',
                        colorBgContainerDisabled: 'rgba(18, 18, 21, 0.5)',
                        activeBorderColor: '#d4af37',
                        hoverBorderColor: '#e6c24a',
                    },
                    Form: {
                        labelColor: '#e4e4e7',
                    }
                },
            }}
        >
            <Drawer
                title={
                    <div className="flex items-center gap-2">
                        <UserOutlined className="text-[#d4af37] text-lg" />
                        <span className="text-white font-semibold tracking-wide text-lg">
                            Profile Settings
                        </span>
                    </div>
                }
                extra={
                    <Button
                        danger
                        type="primary"
                        size="middle"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        className="rounded-xl font-semibold"
                        style={{ fontFamily: 'var(--font-primary), font-primary, serif' }}
                    >
                        Log Out
                    </Button>
                }
                placement="right"
                size={460}
                onClose={onClose}
                open={isOpen}
                styles={{
                    mask: {
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                    header: {
                        backgroundColor: '#0f0f12',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                        padding: '20px 24px'
                    },
                    body: {
                        /* Smooth ambient gradient in the Drawer */
                        background: 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.08) 0%, rgba(20, 20, 26, 0.6) 45%, #0f0f12 100%)',
                        padding: '24px'
                    }
                }}
            >
                {contextHolder}

                {user ? (
                    <Spin spinning={loading}>
                        <div className="flex flex-col items-center gap-6 w-full">
                            
                            {/* --- PROFILE CARD --- */}
                            <div className="flex flex-col items-center text-center w-full p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-white/10 shadow-lg">
                                <Avatar 
                                    size={88} 
                                    icon={<UserOutlined className="text-3xl text-zinc-300" />} 
                                    className="bg-zinc-900 border-2 border-[#d4af37]/80 shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-3"
                                />
                                
                                <h3 className="text-xl font-semibold text-white tracking-wide m-0">
                                    {user.name}
                                </h3>

                                <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                                    <Tag color="gold" className="uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border-0 text-[11px] bg-[#d4af37]/15 text-[#d4af37]">
                                        {user.role || 'Member'}
                                    </Tag>

                                    {createdAt && (
                                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                                            <CalendarOutlined className="text-zinc-500" />
                                            {new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* --- EDIT FORM --- */}
                            <Form 
                                form={form} 
                                onFinish={handleFormSubmit} 
                                layout="vertical" 
                                className="w-full space-y-4"
                            >
                                <Form.Item
                                    label={<span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Full Name</span>}
                                    name="fullName"
                                    rules={[
                                        { required: true, message: "Please input your full name!" },
                                        { max: 255, message: "Maximum 255 characters allowed." }
                                    ]}
                                >
                                    <Input
                                        disabled={!isEditing}
                                        size="large"
                                        prefix={<IdcardOutlined className={isEditing ? "text-[#d4af37]" : "text-zinc-500"} />}
                                        placeholder="Full Name"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Username</span>}
                                    name="username"
                                    rules={[
                                        { required: true, message: "Please input your username!" },
                                        { min: 3, max: 50, message: "Between 3 and 50 characters." },
                                        { pattern: /^[a-zA-Z0-9]+$/, message: "Only letters and numbers allowed." }
                                    ]}
                                >
                                    <Input
                                        disabled={!isEditing}
                                        size="large"
                                        prefix={<UserOutlined className={isEditing ? "text-[#d4af37]" : "text-zinc-500"} />}
                                        placeholder="Username"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Email Address</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: "Please input your email!" },
                                        { type: 'email', message: "Invalid email address format." },
                                        { max: 150, message: "Maximum 150 characters allowed." }
                                    ]}
                                >
                                    <Input
                                        disabled={!isEditing}
                                        size="large"
                                        prefix={<MailOutlined className={isEditing ? "text-[#d4af37]" : "text-zinc-500"} />}
                                        placeholder="Email"
                                    />
                                </Form.Item>

                                {/* --- ACTION BUTTONS --- */}
                                <div className="pt-4 flex items-center gap-3 w-full">
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-white font-medium text-xs tracking-wider uppercase transition-all duration-200 border border-zinc-700/80 cursor-pointer shadow-sm"
                                        >
                                            <EditOutlined className="text-[#d4af37]" />
                                            <span>Edit Profile</span>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() => {
                                                    if (profileBackup) form.setFieldsValue(profileBackup);
                                                    setIsEditing(false);
                                                }}
                                                className="w-1/3 h-11 flex items-center justify-center gap-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 font-medium text-xs tracking-wider uppercase transition-all duration-200 border border-zinc-700/60 cursor-pointer"
                                            >
                                                <CloseOutlined />
                                                <span>Cancel</span>
                                            </button>

                                            <button
                                                type="button"
                                                disabled={loading || !hasChanges}
                                                onClick={() => form.submit()}
                                                className={`w-2/3 h-11 flex items-center justify-center gap-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-[0_4px_15px_rgba(212,175,55,0.25)] ${
                                                    loading || !hasChanges
                                                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50 shadow-none'
                                                        : 'bg-[#d4af37] hover:bg-[#e6c24a] text-black cursor-pointer'
                                                }`}
                                            >
                                                <CheckOutlined />
                                                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </Form>
                        </div>
                    </Spin>
                ) : (
                    <div className="text-center py-12">
                        <Typography.Text type="secondary">
                            You are not currently logged in.
                        </Typography.Text>
                    </div>
                )}
            </Drawer>
        </ConfigProvider>
    );
}