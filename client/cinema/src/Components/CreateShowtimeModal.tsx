import { Modal, Form, Input, Select } from "antd";

interface CreateShowtimeModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    confirmLoading: boolean;
}

export function CreateShowtimeModal({ open, onClose, onSubmit, confirmLoading }: CreateShowtimeModalProps) {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            // Validate the fields before submitting
            const values = await form.validateFields();
            onSubmit(values);
            form.resetFields(); // Clears the form upon success
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
            title="Create New Showtime"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            okText="Create"
            cancelText="Cancel"
            destroyOnHidden
            className="rounded-lg!"
        >
            <Form
                form={form}
                layout="vertical"
                name="create_showtime_form"
                initialValues={{ room: "Sala 1" }}
                className="mt-4"
            >
                <Form.Item
                    name="movie"
                    label="Select Movie"
                    rules={[{ required: true, message: "Please select a movie" }]}
                >
                    <Select placeholder="Choose a movie" className="rounded-md!">
                        <Select value="Inception">Inception</Select>
                        <Select value="The Dark Knight">The Dark Knight</Select>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="room"
                    label="Cinema Room / Hall"
                    rules={[{ required: true, message: "Please select a room" }]}
                >
                    <Select className="rounded-md!">
                        <Select value="Sala 1">Sala 1</Select>
                        <Select value="Sala 2">Sala 2</Select>
                        <Select value="Sala 3 VIP">Sala 3 VIP</Select>
                        <Select value="Macro XE">Macro XE</Select>
                    </Select>
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="showDate"
                        label="Show Date"
                        rules={[{ required: true, message: "Please select a date" }]}
                    >
                        <Input 
                            type="date" 
                            className="rounded-md! h-8" 
                        />
                    </Form.Item>

                    <Form.Item
                        name="startTime"
                        label="Start Time"
                        rules={[{ required: true, message: "Please select a time" }]}
                    >
                        <Input 
                            type="time" 
                            className="rounded-md! h-8" 
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
}
