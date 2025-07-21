import { useEffect, useState } from 'react'
import {
    getAllPaymentMethods,
    updatePaymentMethodStatus,
} from '../api/payment_method'
import Swal from 'sweetalert2'

const Settings = () => {
    const [paymentMethods, setPaymentMethods] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMethods = async () => {
    try {
        setLoading(true)
        const response = await getAllPaymentMethods()
        console.log('Phương thức:', response)

        const methods = response?.data
        if (!Array.isArray(methods)) throw new Error('Phản hồi không hợp lệ')

        setPaymentMethods(methods)
    } catch (error) {
        console.error('API Error:', error)
        Swal.fire('Lỗi', 'Không thể lấy phương thức thanh toán', 'error')
    } finally {
        setLoading(false)
    }
}

    const handleToggle = async (method) => {
        const newStatus = !method.disabled
        try {
            await updatePaymentMethodStatus(method.name, newStatus)
            setPaymentMethods((prev) =>
                prev.map((m) =>
                    m.name === method.name ? { ...m, disabled: newStatus } : m
                )
            )
            Swal.fire('Thành công', `Đã ${newStatus ? 'tắt' : 'bật'} ${method.name}`, 'success')
        } catch (error) {
            Swal.fire('Lỗi', `Không thể cập nhật ${method.name}`, 'error')
        }
    }

    useEffect(() => {
        fetchMethods()
    }, [])

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Cài đặt phương thức thanh toán</h1>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.name}
                            className="flex items-center justify-between rounded-lg border px-4 py-2 shadow-sm"
                        >
                            <span className="text-lg font-medium">{method.name}</span>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={method.disabled === false}
                                    onChange={() => handleToggle(method)}
                                    className="sr-only peer"
                                />
                                <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[4px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full"></div>
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Settings
