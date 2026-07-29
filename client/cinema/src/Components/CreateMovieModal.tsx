import { Modal, Form, Input, InputNumber, Select } from "antd";

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
            // Valida los campos antes de enviar
            const values = await form.validateFields();
            onSubmit(values);
            form.resetFields(); // Limpia el formulario al tener éxito
        } catch (error) {
            console.log("Validation failed:", error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Create New Movie"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            okText="Create"
            cancelText="Cancel"
            destroyOnClose
            className="rounded-lg!"
        >
            <Form
                form={form}
                layout="vertical"
                name="create_movie_form"
                initialValues={{ genre: [], rating: "G" }}
                className="mt-4"
            >
                {/* Campo: Título */}
                <Form.Item
                    name="title"
                    label="Movie Title"
                    rules={[{ required: true, message: "Please enter the movie title" }]}
                >
                    <Input placeholder="e.g. Inception" className="rounded-md!" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    {/* Campo: Duración */}
                    <Form.Item
                        name="duration"
                        label="Duration (minutes)"
                        rules={[
                            { required: true, message: "Required" },
                            { type: "number", min: 1, message: "Must be greater than 0" }
                        ]}
                    >
                        <InputNumber className="w-full! rounded-md!" placeholder="120" />
                    </Form.Item>

                    {/* Campo: Clasificación */}
                    <Form.Item
                        name="rating"
                        label="Rating"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Select className="rounded-md!">
                            <Select value="G">G (General)</Select>
                            <Select value="PG">PG</Select>
                            <Select value="PG-13">PG-13</Select>
                            <Select value="R">R</Select>
                            <Select value="R">NC-17 - Adults Only</Select>
                        </Select>
                    </Form.Item>
                </div>

                {/* Campo: Géneros */}
                <Form.Item
                    name="genre"
                    label="Genres"
                    rules={[{ required: true, message: "Please select at least one genre"}]}
                >
                    <Select placeholder="Select genres" className="rounded-md!">
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

                {/* Campo: Póster (URL) */}
                <Form.Item
                    name="poster"
                    label="Poster URL"
                    rules={[
                        { required: true, message: "Please enter the poster image URL" },
                        { type: "url", message: "Please enter a valid URL" }
                    ]}
                >
                    <Input placeholder="https://example.com" className="rounded-md!" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
