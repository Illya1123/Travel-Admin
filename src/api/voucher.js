import axios from 'axios'

const baseUrl = import.meta.env.VITE_BACKEND

export const getAllVoucher = async (param = {}) => {
    try {
        const response = await axios.get(`${baseUrl}/api/vouchers`, { params: param })
        return response.data
    } catch (error) {
        console.error('Lỗi khi lấy danh sách voucher:', error.response?.data || error.message)
        throw error
    }
}

export const createVoucherCode = async (param) => {
    const data = {
        code: param.code,
        quantity: param.quantity,
        type: param.type,
        discountValue: param.discountValue,
        maxDiscount: param.type === 'percentage' ? param.maxDiscount : null,
        minOrderValue: param.minOrderValue,
        expiryDate: param.expiryDate,
    }

    try {
        const response = await axios.post(`${baseUrl}/api/vouchers/`, data)
        return response.data
    } catch (error) {
        console.error(
            'Create voucher code error: ',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

export const deleteVoucherById = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}/api/vouchers/${id}`)
        return response.data
    } catch (error) {
        console.error('Lỗi khi xóa voucher:', error.response?.data || error.message)
        throw error
    }
}

export const updateVoucherById = async (id, data) => {
    try {
        const response = await axios.put(`${baseUrl}/api/vouchers/${id}`, data)
        return response.data
    } catch (error) {
        console.error('Lỗi khi cập nhật voucher:', error.response?.data || error.message)
        throw error
    }
}
