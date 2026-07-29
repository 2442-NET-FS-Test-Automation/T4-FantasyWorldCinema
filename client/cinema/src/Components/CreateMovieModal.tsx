import { Modal, Form, Input, InputNumber, Select, ConfigProvider, theme } from "antd";
import { CreateMovie } from "../api/Movies";

interface CreateMovieModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    confirmLoading: boolean;
}

export function CreateMovieModal({ open, onClose, onSubmit, confirmLoading }: CreateMovieModalProps) {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            
            await CreateMovie(values);
            onSubmit(values);
            form.resetFields();
        } catch (error) {
            console.log("Validation failed:", error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        // We encapsulate in a local ConfigProvider to force the dark theme and gold accents in the modal
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: "#d4af37",
                    colorBgContainer: "#1e1e24",
                    colorBgElevated: "#121214",
                    borderRadius: 12,
                },
            }}
        >
            <Modal
                title="Create New Movie"
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okText="Create"
                cancelText="Cancel"
                destroyOnHidden
                okButtonProps={{ htmlType: "button" }} 
                styles={{
                    mask: { backdropFilter: "blur(4px)" },
                }}
                className="font-sans"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="create_movie_form"
                    // We initialize according to Swagger's scheme (genre is now an empty string, not an array)
                    initialValues={{ genre: "", rating: "G", durationMinutes: 120 }}
                    className="mt-4"
                    onSubmitCapture={(e) => e.preventDefault()} 
                >

                    <Form.Item
                        name="title"
                        label="Movie Title"
                        rules={[{ required: true, message: "Please enter the movie title" }]}
                    >
                        <Input placeholder="e.g. Inception" className="h-10" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="durationMinutes"
                            label="Duration (minutes)"
                            rules={[
                                { required: true, message: "Required" },
                                { type: "number", min: 1, message: "Must be greater than 0" }
                            ]}
                        >
                            <InputNumber className="w-full! h-10! flex items-center" placeholder="120" />
                        </Form.Item>

                        <Form.Item
                            name="rating"
                            label="Rating"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Select className="h-10">
                                <Select value="G">G (General)</Select>
                                <Select value="PG">PG</Select>
                                <Select value="PG-13">PG-13</Select>
                                <Select value="R">R</Select>
                                <Select value="NC-17">NC-17 - Adults Only</Select>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="genre"
                        label="Genre"
                        rules={[{ required: true, message: "Please select a genre" }]}
                    >
                        <Select placeholder="Select genre" className="h-10">
                            <Select value="Action">Action</Select>
                            <Select value="Comedy">Comedy</Select>
                            <Select value="Drama">Drama</Select>
                            <Select value="Horror">Horror</Select>
                            <Select value="Sci-Fi">Sci-Fi</Select>
                            <Select value="Romance">Romance</Select>
                            <Select value="Animation">Animation</Select>
                            <Select value="Fantasy">Fantasy</Select>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="synopsis"
                        label="Synopsis"
                        rules={[{ required: true, message: "Please enter the movie synopsis" }]}
                    >
                        <Input.TextArea
                            placeholder="Write a brief description of the movie..."
                            rows={3}
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>

                    <Form.Item
                        name="poster"
                        label="Poster URL"
                        rules={[
                            { required: true, message: "Please enter the poster image URL" },
                            { type: "url", message: "Please enter a valid URL" }
                        ]}
                    >
                        <Input placeholder="https://example.com" className="h-10" />
                    </Form.Item>
                </Form>
            </Modal>
        </ConfigProvider>
    );
}
