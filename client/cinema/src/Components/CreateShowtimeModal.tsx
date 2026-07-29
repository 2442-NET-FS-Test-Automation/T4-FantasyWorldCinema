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
            title="Create New Showtime"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            okText="Create"
            cancelText="Cancel"
            className="rounded-lg!"
        >
            <Form
                form={form}
                layout="vertical"
                name="create_showtime_form"
                initialValues={{ room: "Sala 1" }}
                className="mt-4"
            >
                {/* Campo: Película asociada */}
                <Form.Item
                    name="movie" // Cambio menor: se alinea con showtime.movie
                    label="Select Movie"
                    rules={[{ required: true, message: "Please select a movie" }]}
                >
                    <Select placeholder="Choose a movie" className="rounded-md!">
                        <Select value="Inception">Inception</Select>
                        <Select value="The Dark Knight">The Dark Knight</Select>
                    </Select>
                </Form.Item>

                {/* Campo: Sala (ROOM) -> Corregido de acuerdo a showtime.room */}
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
                    {/* Campo: Fecha de la función (SHOWDATE) */}
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

                    {/* Campo: Hora de inicio (STARTTIME) -> Corregido de acuerdo a showtime.startTime */}
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
