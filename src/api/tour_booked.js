import axios from 'axios'

const baseUrl = import.meta.env.VITE_BACKEND

export const getAllOrder = async () => {
    try {
        const token = localStorage.getItem('accessToken')
        const response = await axios.get(`${baseUrl}/api/tour-order/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        console.log(
            'Lỗi khi lấy danh sách toàn bộ tour được book: ',
            error.response.data || error.message
        )
        throw error
    }
}

export const updateOrderStatus = async (id, status) => {
    try {
        const response = await axios.put(`${baseUrl}/api/tour-order/${id}/status`, { status })
        return response.data
    } catch (error) {
        console.log('Lỗi thay đổi status: ', error.response.data || error.message)
        throw error
    }
}
