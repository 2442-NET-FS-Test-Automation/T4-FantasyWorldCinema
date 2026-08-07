import { Modal, Form, Input, InputNumber, Select, ConfigProvider, theme } from "antd";
import { CreateMovie, UpdateMovie } from "../api/Movies";
import { useEffect } from "react";
import type { MovieItem } from "../types";

interface CreateMovieModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    confirmLoading: boolean;
    moviedata?: MovieItem;
}

const DEFAULT_VALUES = { genre: "", rating: "G", durationMinutes: 120 };

export function CreateMovieModal({ open, onClose, onSubmit, confirmLoading, moviedata }: CreateMovieModalProps) {
    const [form] = Form.useForm();
    const isEditing = !!moviedata;

    useEffect(() => {
        if (open) {
            if (isEditing) {
                form.setFieldsValue({
                    title: moviedata.title,
                    synopsis: moviedata.synopsis,
                    poster: moviedata.poster,
                    rating: moviedata.rating,
                    genre: moviedata.genre,
                    durationMinutes: moviedata.durationMinutes || (moviedata as any).duration
                });
            }
            else {
                form.setFieldsValue(DEFAULT_VALUES);
            }
        }
    }, [open, moviedata, isEditing, form]);


    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (isEditing) {
                console.log(moviedata, values);
                
                const updatedInfo: MovieItem = {
                    movie_Id: Number((moviedata as any).key),
                    title: values.title,
                    genre: values.genre,
                    rating: values.rating,
                    synopsis: values.synopsis,
                    durationMinutes: Number(values.durationMinutes),
                    poster: values.poster
                };
                console.log(values, updatedInfo);
                await UpdateMovie(updatedInfo);
                onSubmit({ ...moviedata, ...values, duration: Number(values.durationMinutes) });
            }
            else { 
                await CreateMovie(values);
                onSubmit(values);
            }

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
                title={isEditing ? "Edit Movie" : "Create New Movie"}
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okText={isEditing ? "Save Changes" : "Create"}
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
                    name="movie_form"
                    // We initialize according to Swagger's scheme (genre is now an empty string, not an array)
                    initialValues={DEFAULT_VALUES}
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
                            <Select
                                className="h-10"
                                options={[
                                    { value: "G", label: "G (General)" },
                                    { value: "PG", label: "PG" },
                                    { value: "PG13", label: "PG-13" },
                                    { value: "R", label: "R" },
                                    { value: "NC17", label: "NC-17 - Adults Only" },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="genre"
                        label="Genre"
                        rules={[{ required: true, message: "Please select a genre" }]}
                    >
                        <Select
                            placeholder="Select genre"
                            className="h-10"
                            options={[
                                { value: "Action", label: "Action" },
                                { value: "Comedy", label: "Comedy" },
                                { value: "Drama", label: "Drama" },
                                { value: "Horror", label: "Horror" },
                                { value: "Sci-Fi", label: "Sci-Fi" },
                                { value: "Romance", label: "Romance" },
                                { value: "Animation", label: "Animation" },
                                { value: "Fantasy", label: "Fantasy" },
                            ]}
                        />
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
