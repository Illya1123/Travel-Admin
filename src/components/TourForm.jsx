import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState, useMemo } from 'react'
import { uploadImageTour } from '../api/upload'
import { FaPlus, FaTrash } from 'react-icons/fa'

const TourForm = ({ onSubmit, initialValues, editingTourId, onCancel }) => {
    const [services, setServices] = useState(initialValues?.services || [])
    const [newService, setNewService] = useState('')
    const [editorValue, setEditorValue] = useState(initialValues?.overview || '')
    const [imageList, setImageList] = useState(initialValues?.image || [])

    const formik = useFormik({
        initialValues: {
            title: initialValues?.title || '',
            price: initialValues?.price || 0,
            type: initialValues?.type || 'Tour Trong Nước',
            country: initialValues?.country || '',
            score: initialValues?.score || 0,
            score_description: initialValues?.score_description || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().required('Bắt buộc'),
            price: Yup.number().min(0, 'Không hợp lệ').required('Bắt buộc'),
            type: Yup.string().oneOf(['Tour Nước Ngoài', 'Tour Trong Nước']).required('Bắt buộc'),
            country: Yup.string().required('Bắt buộc'),
            score: Yup.number().min(0).max(10, 'Từ 0 đến 10').typeError('Phải là số'),
            score_description: Yup.string(),
        }),
        onSubmit: async (values, { resetForm }) => {
            const parsedValues = {
                ...values,
                services,
                image: imageList, // gửi danh sách ảnh
                overview: editorValue,
            }
            await onSubmit(parsedValues, resetForm)
            setServices([])
            setNewService('')
            setEditorValue('')
            setImageList([])
        },
    })

    const handleAddService = () => {
        if (newService.trim()) {
            setServices([...services, newService.trim()])
            setNewService('')
        }
    }

    const handleRemoveService = (index) => {
        setServices(services.filter((_, i) => i !== index))
    }

    const handleRemoveImage = (index) => {
        setImageList(imageList.filter((_, i) => i !== index))
    }

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files)
        for (let file of files) {
            const data = await uploadImageTour(file)
            setImageList((prev) => [...prev, data.url])
        }
    }

    const domesticCountries = ['Việt Nam']
    const internationalCountries = [
        'Nhật Bản',
        'Trung Quốc',
        'Hàn Quốc',
        'Châu Âu',
        'Mỹ',
        'Anh',
        'Úc',
    ]

    const countryOptions = useMemo(() => {
        return formik.values.type === 'Tour Trong Nước' ? domesticCountries : internationalCountries
    }, [formik.values.type])

    const formatCurrency = (value) => {
        if (!value) return ''
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    const unformatCurrency = (value) => {
        return value.replace(/\./g, '')
    }

    return (
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">
                {editingTourId ? 'Cập nhật tour' : 'Tạo tour mới'}
            </h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Các trường văn bản */}
                {[
                    { name: 'title', label: 'Tiêu đề', type: 'text' },
                    {
                        name: 'score',
                        label: 'Điểm đánh giá (0-10)',
                        type: 'number',
                        min: 0,
                        max: 10,
                    },
                    { name: 'score_description', label: 'Mô tả đánh giá', type: 'text' },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="block font-medium">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formik.values[field.name]}
                            onChange={(e) => {
                                let value = e.target.value
                                if (field.name === 'score') {
                                    value = Math.max(0, Math.min(10, Number(value)))
                                }
                                formik.setFieldValue(field.name, value)
                            }}
                            min={field.name === 'score' ? 0 : undefined}
                            max={field.name === 'score' ? 10 : undefined}
                            className="w-full border rounded p-2"
                        />
                        {formik.errors[field.name] && formik.touched[field.name] && (
                            <p className="text-red-500 text-sm">{formik.errors[field.name]}</p>
                        )}
                    </div>
                ))}

                {/* Upload nhiều ảnh */}
                <div>
                    <label className="block font-medium mb-1">Hình ảnh</label>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    <div className="flex gap-2 flex-wrap mt-2">
                        {imageList.map((url, index) => (
                            <div key={index} className="relative w-32 h-24">
                                <img
                                    src={url}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <input
                    type="text"
                    name="price"
                    value={formatCurrency(formik.values.price)}
                    onChange={(e) => {
                        const raw = unformatCurrency(e.target.value)
                        const numeric = parseInt(raw || '0', 10)
                        formik.setFieldValue('price', isNaN(numeric) ? 0 : numeric)
                    }}
                    onBlur={(e) => {
                        // Khi blur thì reformat lại
                        const raw = unformatCurrency(e.target.value)
                        const numeric = parseInt(raw || '0', 10)
                        formik.setFieldValue('price', isNaN(numeric) ? 0 : numeric)
                    }}
                    className="w-full border rounded p-2"
                />
                {/* Loại tour */}
                <div>
                    <label className="block font-medium">Loại tour</label>
                    <select
                        name="type"
                        onChange={(e) => {
                            const selectedType = e.target.value
                            formik.setFieldValue('type', selectedType)
                            formik.setFieldValue('country', '') // reset quốc gia nếu thay đổi loại tour
                        }}
                        value={formik.values.type}
                        className="w-full border rounded p-2"
                    >
                        <option value="Tour Trong Nước">Tour Trong Nước</option>
                        <option value="Tour Nước Ngoài">Tour Nước Ngoài</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium">Quốc gia</label>
                    <select
                        name="country"
                        onChange={formik.handleChange}
                        value={formik.values.country}
                        className="w-full border rounded p-2"
                    >
                        <option value="">-- Chọn quốc gia --</option>
                        {countryOptions.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                    {formik.errors.country && formik.touched.country && (
                        <p className="text-red-500 text-sm">{formik.errors.country}</p>
                    )}
                </div>

                {/* Dịch vụ */}
                <div>
                    <label className="block font-medium">Dịch vụ</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newService}
                            onChange={(e) => setNewService(e.target.value)}
                            className="border p-2 rounded w-full"
                            placeholder="Nhập dịch vụ"
                        />
                        <button
                            type="button"
                            onClick={handleAddService}
                            className="bg-green-600 text-white px-3 py-2 rounded"
                        >
                            <FaPlus />
                        </button>
                    </div>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                        {services.map((s, i) => (
                            <li key={i} className="flex justify-between items-center">
                                {s}
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 ml-2"
                                    onClick={() => handleRemoveService(i)}
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tổng quan */}
                <div>
                    <label className="block font-medium mb-1">Tổng quan</label>
                    <textarea
                        value={editorValue}
                        onChange={(e) => setEditorValue(e.target.value)}
                        className="w-full border rounded p-2 h-40"
                        placeholder="Nhập tổng quan về tour, có thể dán link hình ảnh"
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">
                        * Bạn có thể dán link hình ảnh đã upload lên Cloudinary vào nội dung này.
                    </p>
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
                    >
                        {editingTourId ? 'Cập nhật' : 'Tạo tour'}
                    </button>
                    {editingTourId && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-400 text-white px-4 rounded hover:bg-gray-500"
                        >
                            Huỷ
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default TourForm
