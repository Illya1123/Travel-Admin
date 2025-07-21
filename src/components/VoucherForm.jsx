import { useFormik } from 'formik'
import * as Yup from 'yup'

const VoucherForm = ({ onSubmit, editingVoucherId, initialValues, onCancel }) => {
    const formik = useFormik({
        initialValues: initialValues || {
            code: '',
            quantity: 1,
            type: 'percentage',
            discountValue: 0,
            maxDiscount: '',
            minOrderValue: 0,
            expiryDate: '',
            isActive: true,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            code: Yup.string().required('Bắt buộc'),
            quantity: Yup.number().min(1, 'Tối thiểu 1').required('Bắt buộc'),
            type: Yup.string().oneOf(['percentage', 'fixed']).required(),
            discountValue: Yup.number().min(1, 'Phải lớn hơn 0').required('Bắt buộc'),
            maxDiscount: Yup.number().min(0, 'Không hợp lệ').nullable(),
            minOrderValue: Yup.number().min(0, 'Không hợp lệ'),
            expiryDate: Yup.date()
                .min(new Date().toISOString().split('T')[0], 'Không được chọn ngày quá khứ')
                .required('Bắt buộc'),
        }),
        onSubmit: (values, { resetForm }) => onSubmit(values, resetForm),
    })

    const fields = [
        {
            name: 'code',
            label: 'Mã Voucher',
            type: 'text',
        },
        {
            name: 'quantity',
            label: 'Số lượng',
            type: 'number',
        },
        {
            name: 'discountValue',
            label: 'Giá trị giảm',
            type: 'number',
        },
        {
            name: 'maxDiscount',
            label: 'Giảm tối đa (VNĐ)',
            type: 'number',
            condition: formik.values.type === 'percentage', // chỉ hiển thị khi type = percentage
        },
        {
            name: 'minOrderValue',
            label: 'Đơn hàng tối thiểu (VNĐ)',
            type: 'number',
        },
        {
            name: 'expiryDate',
            label: 'Ngày hết hạn',
            type: 'date',
        },
    ]

    return (
        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 text-blue-600">
                {editingVoucherId ? 'Cập nhật voucher' : 'Tạo voucher mới'}
            </h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {fields.map(
                    (field) =>
                        field.condition !== false && (
                            <div key={field.name}>
                                <label className="block font-medium">{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    onChange={formik.handleChange}
                                    value={formik.values[field.name]}
                                    min={
                                        field.name === 'expiryDate'
                                            ? new Date().toISOString().split('T')[0]
                                            : undefined
                                    }
                                    className="w-full border rounded p-2"
                                />
                                {formik.errors[field.name] && formik.touched[field.name] && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors[field.name]}
                                    </p>
                                )}
                            </div>
                        )
                )}

                <div>
                    <label className="block font-medium">Loại giảm giá</label>
                    <select
                        name="type"
                        onChange={formik.handleChange}
                        value={formik.values.type}
                        className="w-full border rounded p-2"
                    >
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Số tiền (VNĐ)</option>
                    </select>
                </div>
                <div>
                    <label className="block font-medium">Trạng thái</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formik.values.isActive}
                            onChange={formik.handleChange}
                            className="w-4 h-4"
                        />
                        <span>{formik.values.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
                    >
                        {editingVoucherId ? 'Cập nhật' : 'Tạo voucher'}
                    </button>
                    {editingVoucherId && (
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

export default VoucherForm
